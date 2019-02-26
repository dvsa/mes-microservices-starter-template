import * as awsSdkMock from 'aws-sdk-mock';
import { Mock, It, Times } from 'typemoq';
import { CloudWatchLogs } from 'aws-sdk';
import * as logger from '../createLogger';
import { LogDelegate } from '../../../application/logging/Logger';

describe('logging', () => {
  const originalConsoleLog = console.log;
  const moqConsoleLog = Mock.ofInstance(console.log);
  const moqCreateLogStream = Mock.ofInstance(new CloudWatchLogs().createLogStream);
  const moqPutLogEvents = Mock.ofInstance(new CloudWatchLogs().putLogEvents);

  beforeEach(() => {
    moqConsoleLog.reset();
    moqCreateLogStream.reset();
    moqPutLogEvents.reset();

    moqCreateLogStream.setup(x => x(It.isAny(), It.isAny()))
      .returns(() => <any><unknown>Promise.resolve(true));

    moqPutLogEvents.setup(x => x(It.isAny(), It.isAny()))
      .returns(() => <any><unknown>Promise.resolve(true));

    moqConsoleLog
      .setup(x => x(It.isAny(), It.isAny()))
      .callback(
        (message?: any, ...optionalParams: any[]) => originalConsoleLog(message, ...optionalParams));

    awsSdkMock.mock('CloudWatchLogs', 'createLogStream', moqCreateLogStream.object);
    awsSdkMock.mock('CloudWatchLogs', 'putLogEvents', moqPutLogEvents.object);

    spyOn(console, 'log').and.callFake(moqConsoleLog.object);
  });

  afterEach(() => {
    awsSdkMock.restore('CloudWatchLogs', 'createLogStream');
    awsSdkMock.restore('CloudWatchLogs', 'putLogEvents');
  });

  describe('createLogger', () => {
    const sut = logger.createLogger;

    const initialisedConsoleLogging = 'Initialised console logging';
    const initialisedCloudWatchLogging = 'Initialised Custom CloudWatch logging';

    it('creates a console logger if no CloudWatch LogGroupName specified', async () => {
      // ACT
      const result = await sut('testLogger', undefined);

      // ASSERT
      expect(result).toBeDefined();
      expect(result.loggerName).toEqual('testLogger');

      moqConsoleLog.verify(x => x(It.is<string>(s => s.indexOf(initialisedConsoleLogging) !== -1)), Times.once());
      moqConsoleLog.verify(x => x(It.is<string>(s => s.indexOf(initialisedCloudWatchLogging) !== -1)), Times.never());
    });

    it('creates a CloudWatch logger if CloudWatch LogGroupName is specified', async () => {
      // ACT
      const result = await sut('testLogger', 'cloudWatchLogGroupName');

      // ASSERT
      expect(result).toBeDefined();
      expect(result.loggerName).toEqual('testLogger');

      moqConsoleLog.verify(x => x(It.is<string>(s => s.indexOf(initialisedConsoleLogging) !== -1)), Times.never());
      moqConsoleLog.verify(x => x(It.is<string>(s => s.indexOf(initialisedCloudWatchLogging) !== -1)), Times.once());
    });
  });

  describe('createCloudWatchLogger', () => {
    const sut = logger.createCloudWatchLogger;

    it('creates a log delegate that logs to CloudWatch', async () => {
      // ACT
      const result: LogDelegate = await sut('testLoggerName', 'testLogGroupName');
      await result([{ timestamp: 265473, message: 'test log message to cloudwatch' }]);

      // ASSERT
      moqPutLogEvents.verify(
        x => x(
          It.is<CloudWatchLogs.Types.PutLogEventsRequest>(r =>
            r.logEvents[0].message === 'test log message to cloudwatch' &&
            r.logGroupName === 'testLogGroupName' &&
            r.logStreamName.indexOf('testLoggerName') > -1),
          It.isAny()),
        Times.once());
    });

    it('should call the `createLogStream` CloudWatchLogs method correctly', async () => {
      // ACT
      await sut('testLoggerName', 'testLogGroupName');

      // ASSERT
      moqCreateLogStream.verify(
        x => x(
          It.is<CloudWatchLogs.Types.CreateLogStreamRequest>(r =>
            r.logGroupName === 'testLogGroupName' &&
            /^testLoggerName-\d\d\d\d-\d\d-\d\d-[0-9a-f]{32}$/.test(r.logStreamName)),
          It.isAny()),
        Times.once());
    });

    it('should use `sequenceToken` from previous `putLogEvents` result', async () => {
      moqPutLogEvents.reset();
      moqPutLogEvents.setup(x => x(It.isAny(), It.isAny()))
        .returns(() => <any><unknown>Promise.resolve({
          nextSequenceToken: 'example-sequenceToken-123',
        }));

      // ACT
      const result = await sut('testLoggerName', 'testLogGroupName');
      await result([{ timestamp: 1, message: 'test log message to cloudwatch 1' }]);
      await result([{ timestamp: 2, message: 'test log message to cloudwatch 2' }]);

      // ASSERT
      moqPutLogEvents.verify(
        x => x(
          It.is<CloudWatchLogs.Types.PutLogEventsRequest>(r =>
            r.logEvents[0].message === 'test log message to cloudwatch 1' &&
            r.sequenceToken === undefined),
          It.isAny()),
        Times.once());

      moqPutLogEvents.verify(
        x => x(
          It.is<CloudWatchLogs.Types.PutLogEventsRequest>(r =>
            r.logEvents[0].message === 'test log message to cloudwatch 2' &&
            r.sequenceToken === 'example-sequenceToken-123'),
          It.isAny()),
        Times.once());
    });

    it('should swallow a `ResourceAlreadyExistsException` error', async () => {
      awsSdkMock.remock('CloudWatchLogs', 'createLogStream', async () => {
        throw {
          errorType: 'ResourceAlreadyExistsException',
        };
      });

      // ACT
      const result = await sut('testLoggerName', 'testLogGroupName');

      // ASSERT
      expect(result).toBeDefined();
    });

    it('should throw on any other exceptions', async () => {
      awsSdkMock.remock('CloudWatchLogs', 'createLogStream', async () => {
        throw {
          errorType: 'SomeOtherException',
        };
      });

      let errorThrown: any | undefined = undefined;
      let wasErrorThrown = false;

      // ACT
      try {
        await sut('testLoggerName', 'testLogGroupName');
      } catch (e) {
        errorThrown = e;
        wasErrorThrown = true;
      }

      // ASSERT
      expect(wasErrorThrown).toEqual(true);
      expect(errorThrown).toBeDefined();
      expect(errorThrown.errorType).toEqual('SomeOtherException');
    });
  });

  describe('createConsoleLogger', () => {
    const sut = logger.createConsoleLogger;

    it('creates a log delegate that logs to the console', async () => {
      // ACT
      const result: LogDelegate = sut('testLoggerName');
      await result([{ timestamp: 347574, message: 'an example log message' }]);

      // ASSERT
      moqConsoleLog.verify(
        x => x(
          It.is<string>(s => /testLoggerName:/.test(s)),
          It.is<any>(args => /^an example log message$/.test(args[0].message))),
        Times.once());
    });
  });

  describe('uniqueLogStreamName', () => {
    const sut = logger.uniqueLogStreamName;

    it('returns a string in the expected format', () => {
      // ACT
      const result = sut('LoggerName');

      // ASSERT
      expect(result).toMatch(/^LoggerName-\d\d\d\d-\d\d-\d\d-[0-9a-f]{32}$/);
    });

    it('generates unique names each time', () => {
      const results = new Set();
      const countToGenerate = 50000;

      // ACT
      for (let i = 0; i < countToGenerate; i = i + 1) {
        const result = sut('LoggerName');
        results.add(result);
      }

      // ASSERT
      expect(results.size).toEqual(countToGenerate);
    });
  });
});
