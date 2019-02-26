import { Mock, It, Times } from 'typemoq';
import LogEvent from '../LogEvent';
import Logger, { LogDelegate } from '../Logger';

describe('Logger', () => {
  const moqLogDelegate = Mock.ofType<LogDelegate>();
  let sut: Logger;

  beforeEach(() => {
    moqLogDelegate.reset();

    sut = new Logger(moqLogDelegate.object, 'exampleTestLogger');
  });

  describe('logEvents', () => {
    it('should call `logDelegate` as expected', async () => {
      // ACT
      await sut.logEvents(Array(3).fill(Mock.ofType<LogEvent>().object));

      // ASSERT
      moqLogDelegate.verify(
        x => x(It.is<LogEvent[]>(evnts => evnts.length === 3)),
        Times.once());
    });

    it('should swallow, and output to console error, any exceptions ', async () => {
      moqLogDelegate.setup(x => x(It.isAny()))
        .throws(new Error('example external logging system error'));

      const moqConsoleError = Mock.ofInstance(console.error);
      spyOn(console, 'error').and.callFake(moqConsoleError.object);

      // ACT
      await sut.logEvents([Mock.ofType<LogEvent>().object]);

      // ASSERT
      moqConsoleError.verify(
        x => x('Error occurred while attempting to log events to logging system:'),
        Times.once());

      moqConsoleError.verify(
          x => x(It.is<Error>(e => e.message === 'example external logging system error')),
          Times.once());
    });
  });

  describe('log', () => {
    it('should call `logDelegate` as expected', async () => {
      // ACT
      await sut.log('test log message', 'info', { value: 1234 });

      // ASSERT
      moqLogDelegate.verify(
        x => x(It.is<LogEvent[]>(evnts =>
          evnts.length === 1 &&
          evnts[0].timestamp > 0 &&
          evnts[0].timestamp <= new Date().getTime() &&
          /test log message/.test(evnts[0].message) &&
          /info/.test(evnts[0].message) &&
          /1234/.test(evnts[0].message))),
        Times.once());
    });

    it('additional `logData` overrides other arguments', async () => {
      // ACT
      await sut.log('test log message', 'info', { logLevel: 'other' });

      // ASSERT
      moqLogDelegate.verify(
        x => x(It.is<LogEvent[]>(evnts =>
          evnts.length === 1 &&
          /test log message/.test(evnts[0].message) &&
          !/info/.test(evnts[0].message) &&
          /other/.test(evnts[0].message))),
        Times.once());
    });
  });
});
