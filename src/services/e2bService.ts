import axios from 'axios';
import { E2B_API_KEY } from '../config/env';
import logger from '../utils/logger';

const E2B_API_URL = 'https://api.e2b.dev/v1';

class E2BService {
  private api: ReturnType<typeof axios.create>;
  private projectId: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: E2B_API_URL,
      headers: {
        'Authorization': `Bearer ${E2B_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async initialize(): Promise<void> {
    if (!this.projectId) {
      await this.createProject();
    }
  }

  async createProject(): Promise<string> {
    try {
      const response = await this.api.post('/projects', {
        name: 'Parker Industries AI Interface',
        description: 'A project for dynamic code execution and AI integration',
      });
      this.projectId = response.data.id;
      logger.info('E2B Project created with ID:', this.projectId);
      return this.projectId;
    } catch (error) {
      logger.error('Error creating E2B project:', error);
      throw error;
    }
  }

  async createFragment(code: string, language: string): Promise<string> {
    if (!this.projectId) {
      await this.initialize();
    }
    try {
      const response = await this.api.post(`/projects/${this.projectId}/fragments`, { code, language });
      return response.data.id;
    } catch (error) {
      logger.error('Error creating E2B fragment:', error);
      throw error;
    }
  }

  async executeFragment(fragmentId: string, inputs: Record<string, any> = {}): Promise<any> {
    try {
      const response = await this.api.post(`/fragments/${fragmentId}/execute`, { inputs });
      return response.data.result;
    } catch (error) {
      logger.error('Error executing E2B fragment:', error);
      throw error;
    }
  }

  async listFragments(): Promise<any[]> {
    if (!this.projectId) {
      await this.initialize();
    }
    try {
      const response = await this.api.get(`/projects/${this.projectId}/fragments`);
      return response.data;
    } catch (error) {
      logger.error('Error listing E2B fragments:', error);
      throw error;
    }
  }
}

export default new E2BService();