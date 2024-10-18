import axios from 'axios';
import { HUGGING_FACE_API_KEY } from '../config/env';

const GPT_NEOX_API_URL = 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b-chat-int8';
const T5_XXL_API_URL = 'https://api-inference.huggingface.co/models/google/t5-xxl-lm-adapt';

class AIService {
  private api: ReturnType<typeof axios.create>;

  constructor() {
    this.api = axios.create({
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateResponse(input: string): Promise<string> {
    try {
      const [gptNeoxResponse, t5Response] = await Promise.all([
        this.api.post(GPT_NEOX_API_URL, { inputs: input }),
        this.api.post(T5_XXL_API_URL, { inputs: input })
      ]);

      const gptNeoxOutput = gptNeoxResponse.data[0].generated_text;
      const t5Output = t5Response.data[0].generated_text;

      // Combine outputs (you can implement a more sophisticated combination logic)
      return `GPT-NeoX: ${gptNeoxOutput}\n\nT5-XXL: ${t5Output}`;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

export default new AIService();