import { injectable } from 'inversify';
import { Logger } from './Logger';

@injectable()
export class ConsoleLogger implements Logger {
  info(msg: string): void {
    console.log(`INFO: ${msg}`);
  }
  warn(msg: string): void {
    console.log(`WARN: ${msg}`);
  }
  error(msg: string): void {
    console.error(`ERROR: ${msg}`);
  }
}
