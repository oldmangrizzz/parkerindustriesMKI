import { Agent } from './Agent';
import aiService from '../services/aiService';
import convexService from '../services/convexService';
import logger from '../utils/logger';
import { CUSTOM_SYSTEM_PROMPT } from '../config/customPrompt';

export class PeterParker extends Agent {
  private memory: Map<string, any> = new Map();

  constructor() {
    super('Peter Parker');
  }

  async process(input: string): Promise<string> {
    logger.info(`PeterParker processing: ${input}`);
    
    // Retrieve relevant memories
    const relevantMemories = await this.retrieveRelevantMemories(input);
    
    // Combine input with relevant memories and custom prompt
    const contextualizedInput = `
      ${CUSTOM_SYSTEM_PROMPT}
      Context: ${relevantMemories.join(' ')}
      Current input: ${input}
      Analyze and respond to the above based on your persona.
    `;

    // Use GPT-NeoX-20B-Chat wrapped with T5-XXL for response generation
    const response = await aiService.generateResponse(contextualizedInput);
    
    // Store the new memory
    await this.storeMemory(input, response);

    return response;
  }

  private async retrieveRelevantMemories(input: string): Promise<string[]> {
    // Implement memory retrieval logic using Convex
    const memories = await convexService.listMemories();
    // You can implement more sophisticated retrieval logic here
    return memories.slice(0, 5).map(m => m.value);
  }

  private async storeMemory(input: string, response: string): Promise<void> {
    await convexService.storeMemory(`memory:${Date.now()}`, { input, response });
  }

  async synthesize(results: string[]): Promise<string> {
    const synthesisPrompt = `
      ${CUSTOM_SYSTEM_PROMPT}
      You have received multiple perspectives on a problem. Synthesize these into a cohesive response:
      ${results.join('\n')}
    `;
    return await aiService.generateResponse(synthesisPrompt);
  }
}