# mes-journal-service

A serverless microservice responsible for responsible for retrieving driving examiner journal data.
Primarily intended to be used with the [MES mobile app](https://github.com/dvsa/mes-mobile-app).

## Structure

All serverless functions live in dedicated directories in `src/functions`.
Code that is common between multiple functions should reside in `src/common`.

As per the principles of Hexagonal Architecture, each function has the following directories to help us separate concerns:

* `framework` - contains all Inbound and Outbound Adapters, and all use of external/proprietary APIs - depends upon...
* `application` - contains all Inbound and Outbound Ports, doesn't use any external/proprietary APIs - depends upon...
* `domain` - contains all domain objects (Aggregates, Objects, Value classes etc) with all "business logic" (not just anaemic data holders), doesn't use any external/proprietary APIs.

## Build

To build a zip file for every function to `build/artifacts`, run:

```shell
npm run package
```

To build a subset of the functions, pass a comma separated list of function names, like so:

```shell
npm run package -- get,set
```

## Test

To run the unit tests, simply run:

```shell
npm test
```
