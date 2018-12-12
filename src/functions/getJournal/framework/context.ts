import 'reflect-metadata';

import { Container } from 'inversify';
import { JournalRetriever } from '../application/service/JournalRetriever';
import { StaticJournalRetriever } from '../application/service/StaticJournalRetriever';

export enum ServiceIdentifiers {
  JournalRetriever = 'JournalRetriever',
  Logger = 'Logger',
}

const container = new Container();
container.bind<JournalRetriever>(ServiceIdentifiers.JournalRetriever).to(StaticJournalRetriever);

export default container;
