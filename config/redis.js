const { promisifyAll } = require('bluebird');
const redis = require('redis');

promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);
const { logger } = require('config/logger');

const client = redis.createClient(process.env.REDIS_URL);

client.on('ready', () => {
    logger.info('Redis is ready')
});

client.on('connect', () => {
    logger.info('Connect to redis')
});

client.on('error', (err) => {
    logger.info(err)
});


module.exports = client;

