const { ConvexClient } = require('convex/browser');
const logger = require('../utils/logger');

class ConvexService {
  constructor() {
    this.client = new ConvexClient(process.env.CONVEX_URL);
  }

  async initialize() {
    try {
      await this.client.sync();
      logger.info('Convex client initialized');
    } catch (error) {
      logger.error('Failed to initialize Convex client:', error);
      throw error;
    }
  }

  async storeMemory(key, value) {
    return await this.client.mutation('memories:store', { key, value });
  }

  async retrieveMemory(key) {
    return await this.client.query('memories:get', { key });
  }

  async updateMemory(key, value) {
    return await this.client.mutation('memories:update', { key, value });
  }

  async deleteMemory(key) {
    return await this.client.mutation('memories:delete', { key });
  }

  async listMemories() {
    return await this.client.query('memories:list');
  }
}

const convexService = new ConvexService();

module.exports = {
  ConvexService: convexService,
  initializeConvex: () => convexService.initialize()
};