import * as bluebird from 'bluebird';
import * as redis from 'redis';
import SequelizeRedis from 'sequelize-redis';

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Define your redisClient
const redisClient = redis.createClient(`${process.env.REDIS_URL}`);
redisClient.on('error', (error) => {
  console.error(error);
});

redisClient.on('connect', () => {
  console.log('Connected to redis successfully');
});

// Let's start
export const sequelizeRedis = new SequelizeRedis(redisClient);
