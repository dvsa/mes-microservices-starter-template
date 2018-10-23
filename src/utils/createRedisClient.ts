import { createRedisClient } from 'redis';
import config from './config';

const client = createRedisClient(config.redisUrl);

client.on('ready', function () {
    console.log('Redis client: ready');
});
client.on('connect', function () {
    console.log('Redis client: connect');
});
client.on('reconnecting', function () {
    console.log('Redis client: reconnecting');
});
client.on('error', function (err) {
    console.log({err: err}, 'Listener.redis.client error: %s', err);
    process.exit(1);
});
client.on('end', function () {
    console.log('Redis client: end');
});
client.on('warning', function () {
    console.log('Redis client: warning');
});

export default client;