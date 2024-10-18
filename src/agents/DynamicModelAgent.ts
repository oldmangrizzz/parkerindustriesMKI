import { Agent } from './Agent';
import huggingFaceSpacesService from '../services/huggingFaceSpacesService';
import logger from '../utils/logger';

export class DynamicModelAgent extends Agent {
  private modelCache: Map<string, { author: string, name: string }> = new Map();

  constructor() {
    super('Dynamic Model Agent');
  }

  async process(input: string): Promise<string> {
    logger.info(`DynamicModelAgent processing: ${input}`);

    const taskType = this.determineTaskType(input);
    const space = await this.selectAppropriateSpace(taskType);

    try {
      const result = await huggingFaceSpacesService.invokeSpaceAPI(space.author, space.name, { input });
      return result;
    } catch (error) {
      logger.error(`Error invoking Hugging Face Space ${space.author}/${space.name}:`, error);
      return `Error processing input with ${space.name}`;
    }
  }

  private determineTaskType(input: string): string {
    const taskTypes = [
      { type: 'image_classification', keywords: ['classify image', 'what is in this image', 'identify object'] },
      { type: 'text_generation', keywords: ['write', 'generate text', 'create a story'] },
      { type: 'translation', keywords: ['translate', 'in French', 'to Spanish'] },
      { type: 'question_answering', keywords: ['answer', 'what is', 'how do', 'why does'] },
      { type: 'summarization', keywords: ['summarize', 'give me a summary', 'tldr'] },
    ];

    for (const task of taskTypes) {
      if (task.keywords.some(keyword => input.toLowerCase().includes(keyword))) {
        return task.type;
      }
    }

    return 'general';
  }

  private async selectAppropriateSpace(taskType: string): Promise<{ author: string, name: string }> {
    if (this.modelCache.has(taskType)) {
      return this.modelCache.get(taskType)!;
    }

    try {
      const spaces = await huggingFaceSpacesService.listSpaces(50);
      const appropriateSpace = spaces.find((space: any) => 
        space.tags.includes(taskType) && space.likes > 100 // Basic quality filter
      );

      if (appropriateSpace) {
        const result = { author: appropriateSpace.author, name: appropriateSpace.id };
        this.modelCache.set(taskType, result);
        return result;
      }
    } catch (error) {
      logger.error('Error selecting appropriate Hugging Face Space:', error);
    }

    // Fallback to default spaces if no appropriate space found
    const defaultSpaces: { [key: string]: { author: string, name: string } } = {
      'image_classification': { author: 'microsoft', name: 'resnet-50' },
      'text_generation': { author: 'bigscience', name: 'bloom' },
      'translation': { author: 'facebook', name: 'mbart-large-50-many-to-many-mmt' },
      'question_answering': { author: 'deepset', name: 'roberta-base-squad2' },
      'summarization': { author: 'facebook', name: 'bart-large-cnn' },
      'general': { author: 'openai', name: 'whisper' },
    };

    return defaultSpaces[taskType] || defaultSpaces['general'];
  }
}