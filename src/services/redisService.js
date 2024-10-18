const Redis = require('ioredis');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      this.client = new Redis(process.env.REDIS_URL);
      logger.info('Connected to Redis');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async set(key, value) {
    return await this.client.set(key, value, 'EX', 3600); // 1 hour expiration
  }

  async get(key) {
    return await this.client.get(key);
  }

  async del(key) {
    return await this.client.del(key);
  }
}

const redisService = new RedisService();

module.exports = {
  RedisService: redisService,
  connectRedis: () => redisService.connect()
};