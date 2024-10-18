import axios from 'axios';
import { REPLIT_API_KEY } from '../config/env';

const REPLIT_API_URL = 'https://replit.com/api/v1';

class ReplitService {
  private api: ReturnType<typeof axios.create>;

  constructor() {
    this.api = axios.create({
      baseURL: REPLIT_API_URL,
      headers: {
        'Authorization': `Bearer ${REPLIT_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async createRepl(name: string, language: string, files: { [key: string]: string }): Promise<any> {
    try {
      const response = await this.api.post('/repls', {
        name,
        language,
        files,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Repl:', error);
      throw error;
    }
  }

  async executeCode(replId: string, language: string, code: string): Promise<any> {
    try {
      const response = await this.api.post(`/repls/${replId}/execute`, {
        language,
        code,
      });
      return response.data;
    } catch (error) {
      console.error('Error executing code:', error);
      throw error;
    }
  }

  async getReplOutput(replId: string): Promise<any> {
    try {
      const response = await this.api.get(`/repls/${replId}/output`);
      return response.data;
    } catch (error) {
      console.error('Error getting Repl output:', error);
      throw error;
    }
  }

  // Add more advanced caching mechanism
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  async getCachedData(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Implement more sophisticated memory management
  private memoryUsage: { [key: string]: number } = {};

  trackMemoryUsage(key: string, size: number): void {
    this.memoryUsage[key] = (this.memoryUsage[key] || 0) + size;
    if (this.memoryUsage[key] > 1000000) { // 1MB limit per key
      console.warn(`Memory usage for ${key} exceeds 1MB`);
    }
  }

  getMemoryUsage(): { [key: string]: number } {
    return { ...this.memoryUsage };
  }
}

export default new ReplitService();