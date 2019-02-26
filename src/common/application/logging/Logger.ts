import LogEvent from './LogEvent';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type Bag = { [propName: string]: any };

export type LogDelegate = (logEvents: LogEvent[]) => Promise<void>;

export default class Logger {
  private logDelegate: LogDelegate;

  loggerName: string;

  constructor(logDelegate: LogDelegate, loggerName: string) {
    this.logDelegate = logDelegate;
    this.loggerName = loggerName;
  }

  /**
   * Sends the specified array of `LogEvents` to the logging system.
   * @param logEvents The event messages to log.
   * @returns `Promise` for completing the async action.
   */
  async logEvents(logEvents: LogEvent[]): Promise<void> {
    try {
      await this.logDelegate(logEvents);
    } catch (e) {
      console.error('Error occurred while attempting to log events to logging system:');
      console.error(e);
    }
  }

  /**
   * Sends a `LogEvent`, with the specified message string, log level and
   * optional additional log data, to the logging system.
   * @param message The message string to log.
   * @param logLevel The severity of the `LogEvent`.
   * @param logData Optional, any additional data to include in the `LogEvent`.
   * @returns `Promise` for completing the async action.
   */
  async log(message: string, logLevel: LogLevel, logData?: Bag): Promise<void> {
    const eventMessage = Object.assign({ message, logLevel, loggerName: this.loggerName }, logData);

    await this.logEvents([{
      timestamp: new Date().getTime(),
      message: JSON.stringify(eventMessage),
    }]);
  }
}
