const axios = require('axios');
const logger = require('../utils/logger');

const REPLIT_API_URL = 'https://replit.com/api/v1';

class ReplitService {
  constructor() {
    this.api = axios.create({
      baseURL: REPLIT_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.REPLIT_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async executeOnReplit(code) {
    try {
      const response = await this.api.post('/execute', { language: 'javascript', code });
      return response.data.result;
    } catch (error) {
      logger.error('Error executing code on Replit:', error);
      throw new Error('Failed to execute code on Replit');
    }
  }
}

module.exports = new ReplitService();