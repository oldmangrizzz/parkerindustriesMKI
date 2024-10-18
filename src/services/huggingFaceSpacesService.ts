import axios from 'axios';
import { HUGGING_FACE_API_KEY } from '../config/env';

const HF_API_URL = 'https://huggingface.co/api';

class HuggingFaceSpacesService {
  private api: ReturnType<typeof axios.create>;

  constructor() {
    this.api = axios.create({
      baseURL: HF_API_URL,
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async listSpaces(limit: number = 10): Promise<any> {
    try {
      const response = await this.api.get(`/spaces?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error listing Hugging Face Spaces:', error);
      throw error;
    }
  }

  async getSpaceInfo(author: string, spaceName: string): Promise<any> {
    try {
      const response = await this.api.get(`/spaces/${author}/${spaceName}`);
      return response.data;
    } catch (error) {
      console.error('Error getting Space info:', error);
      throw error;
    }
  }

  async invokeSpaceAPI(author: string, spaceName: string, data: any): Promise<any> {
    try {
      const response = await this.api.post(`/spaces/${author}/${spaceName}/api`, data);
      return response.data;
    } catch (error) {
      console.error('Error invoking Space API:', error);
      throw error;
    }
  }
}

export default new HuggingFaceSpacesService();