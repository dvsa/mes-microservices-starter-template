import { DisplayProcessor, SpecReporter } from 'jasmine-spec-reporter';

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(_: jasmine.JasmineStartedInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  customProcessors: [CustomProcessor],
}));
