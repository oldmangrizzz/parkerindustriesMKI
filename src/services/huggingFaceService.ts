import axios from 'axios';
import { HUGGING_FACE_API_KEY } from '../config/env';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/nemotron-70b';

const huggingFaceService = axios.create({
  baseURL: HUGGING_FACE_API_URL,
  headers: {
    'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const generateSwarmResponse = async (input: string): Promise<string> => {
  try {
    const response = await huggingFaceService.post('', {
      inputs: input,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    });
    return response.data[0].generated_text;
  } catch (error) {
    console.error('Error generating swarm response:', error);
    throw new Error('Failed to generate swarm response');
  }
};

export default huggingFaceService;