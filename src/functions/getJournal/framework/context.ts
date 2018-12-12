import 'reflect-metadata';

import { Container } from 'inversify';
import { JournalRetriever } from '../application/service/JournalRetriever';
import { StaticJournalRetriever } from '../application/service/StaticJournalRetriever';
import { Logger } from '../../../common/application/utils/logging/Logger';
import { ConsoleLogger } from '../../../common/application/utils/logging/ConsoleLogger';

export enum ServiceIdentifiers {
  JournalRetriever = 'JournalRetriever',
  Logger = 'Logger',
}

const container = new Container();
container.bind<JournalRetriever>(ServiceIdentifiers.JournalRetriever).to(StaticJournalRetriever);
container.bind<Logger>(ServiceIdentifiers.Logger).to(ConsoleLogger);

export default container;
