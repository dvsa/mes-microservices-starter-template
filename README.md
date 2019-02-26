# mes-microservices-starter-template

A serverless microservice template.

## Structure

All serverless functions live in dedicated directories in `src/functions`.
Code that is common between multiple functions should reside in `src/common`.

As per the principles of Hexagonal Architecture, each function has the following directories to help us separate concerns:

* `framework` - contains all Inbound and Outbound Adapters, and all use of external/proprietary APIs - depends upon...
* `application` - contains all Inbound and Outbound Ports, doesn't use any external/proprietary APIs - depends upon...
* `domain` - contains all domain objects (Aggregates, Objects, Value classes etc) with all "business logic" (not just anaemic data holders), doesn't use any external/proprietary APIs.

## Bootstrap

The domain model for the service is maintained as a JSON Schema. In order to compile the project, you need to generate the type information:

```shell
npm run bootstrap
```

## Run locally

Use the following script to spin up the microservice locally

```shell
npm start
```

## Build

To build a zip file for every function to `build/artifacts`, run:

```shell
npm run package
```

To build a subset of the functions, pass a comma separated list of function names, like so:

```shell
npm run package -- get,set
```

*N.b. The build requires [jq](https://github.com/stedolan/jq).*

*Any functions delcared in serverless.yml that contain the word "local" will be ignored in the packaging process.*

## Test

To run the unit tests, simply run:

```shell
npm test
```

## Logging

To implement logging to a Custom AWS CloudWatch Log Group use the `createLogger` function, passing the name of the
CloudWatch Log Group, to create an instance of the `Logger` class configured to log to CloudWatch.

### Logging - Create `Logger` instance
```typescript
import Logger from '../../../common/application/logging/Logger';
import { createLogger } from '../../../common/framework/logging/createLogger';

const logger: Logger = await createLogger('ExampleLoggerName', process.env.CUSTOM_CWLG_NAME);
```

### Logging - Log an individual message
```typescript
async logger.log(message: string, logLevel: LogLevel, logData?: Bag): Promise<void>
// where `LogLevel` can be 'debug' | 'info' | 'warn' | 'error'
// where `Bag` is an object containing properties (i.e. `{ [propName: string]: any }`)
```

The `message`, `logLevel`, and optional additional `logData`, are combined together in to a single object and
then JSON serialized to build the string that is sent to the logging system (i.e. CloudWatch in our case).

Examples:
```typescript
// Individual log examples:
await logger.log('Some debug log message', 'debug');
await logger.log('Some information log message', 'info');
await logger.log('Some warning log message', 'warn');
await logger.log('Some error log message', 'error', error);
```

Note that optional additional data can be passed to provide more contextual information, regardless of log level:
```typescript
await logger.log('Some log message', 'info', { optionalAdditionalData: true, numOfAttempts: 3, ... });
```

### Logging - Log in batch
```typescript
async logger.logEvents(logEvents: LogEvent[]): Promise<void>
```

For example:
```typescript
import LogEvent from '../../../common/application/logging/LogEvent';

// To log in batch:
const logEvents: LogEvent[] = ...;
await logger.logEvents(logEvents);
```