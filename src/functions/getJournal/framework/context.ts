import 'reflect-metadata';

import { Container } from 'inversify';

export enum ServiceIdentifiers {
  JournalRetriever = 'JournalRetriever',
  Logger = 'Logger',
}

const container = new Container();

export default container;
