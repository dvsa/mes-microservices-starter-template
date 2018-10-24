import { createRedisClient } from 'redis';
import config from './config';

const client = createRedisClient(config.redisUrl());

client.on('ready', () => {
  console.log('Redis client: ready');
});
client.on('connect', () => {
  console.log('Redis client: connect');
});
client.on('reconnecting', () => {
  console.log('Redis client: reconnecting');
});
client.on('error', (err) => {
  console.log({ err }, 'Listener.redis.client error: %s', err);
  process.exit(1);
});
client.on('end', () => {
  console.log('Redis client: end');
});
client.on('warning', () => {
  console.log('Redis client: warning');
});

export default () => client;
