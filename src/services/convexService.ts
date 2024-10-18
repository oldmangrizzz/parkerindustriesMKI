import { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import { CONVEX_URL } from '../config/env';
import logger from '../utils/logger';

class ConvexService {
  private client: ConvexClient;

  constructor() {
    this.client = new ConvexClient(CONVEX_URL);
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

  async storeMemory(key: string, value: any) {
    return await this.client.mutation(api.memories.store, { key, value });
  }

  async retrieveMemory(key: string) {
    return await this.client.query(api.memories.get, { key });
  }

  async updateMemory(key: string, value: any) {
    return await this.client.mutation(api.memories.update, { key, value });
  }

  async deleteMemory(key: string) {
    return await this.client.mutation(api.memories.delete, { key });
  }

  async listMemories() {
    return await this.client.query(api.memories.list);
  }

  async searchMemories(query: string) {
    return await this.client.query(api.memories.search, { query });
  }
}

export default new ConvexService();