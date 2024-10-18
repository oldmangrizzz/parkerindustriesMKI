import { PeterParker } from './PeterParker';
import { WebDevelopmentAgent, AIResearchAgent, BusinessStrategyAgent } from './SpecializedAgents';
import { EmpireState } from './EmpireState';
import { DynamicModelAgent } from './DynamicModelAgent';
import { Agent } from './Agent';
import convexService from '../services/convexService';
import logger from '../utils/logger';

export class ParkerIndustries {
  private peterParker: PeterParker;
  private specializedAgents: Agent[];
  private empireState: EmpireState;
  private dynamicModelAgent: DynamicModelAgent;

  constructor() {
    this.peterParker = new PeterParker();
    this.specializedAgents = [
      new WebDevelopmentAgent(),
      new AIResearchAgent(),
      new BusinessStrategyAgent(),
    ];
    this.empireState = new EmpireState();
    this.dynamicModelAgent = new DynamicModelAgent();
  }

  async initialize(): Promise<void> {
    try {
      await convexService.initialize();
      logger.info('ParkerIndustries initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize ParkerIndustries:', error);
      throw error;
    }
  }

  async process(input: string): Promise<string> {
    logger.info(`Processing input: ${input}`);
    const startTime = Date.now();

    try {
      // Get initial insight from Peter Parker
      const peterInsight = await this.peterParker.process(input);

      // Process with specialized agents in parallel
      const specializedResults = await Promise.all(
        this.specializedAgents.map(agent => agent.process(input))
      );

      // Process with swarm
      const swarmResults = await this.empireState.processSwarm(input);

      // Process with dynamic model agent
      const dynamicModelResult = await this.dynamicModelAgent.process(input);

      // Combine all results
      const allResults = [peterInsight, ...specializedResults, ...swarmResults, dynamicModelResult];

      // Let Peter Parker synthesize the final result
      const finalResult = await this.peterParker.synthesize(allResults);

      // Store the processed data in Convex for persistence
      await this.storeProcessedData(input, finalResult);

      const endTime = Date.now();
      logger.info(`Processing completed in ${endTime - startTime}ms`);

      return finalResult;
    } catch (error) {
      logger.error('Error during processing:', error);
      throw error;
    }
  }

  private async storeProcessedData(input: string, output: string): Promise<void> {
    try {
      await convexService.storeMemory(`processed:${Date.now()}`, { input, output });
    } catch (error) {
      logger.error('Failed to store processed data:', error);
    }
  }

  async addSpecializedAgent(agent: Agent): Promise<void> {
    this.specializedAgents.push(agent);
    logger.info(`Added new specialized agent: ${agent.name}`);
  }

  async removeSpecializedAgent(agentName: string): Promise<void> {
    this.specializedAgents = this.specializedAgents.filter(agent => agent.name !== agentName);
    logger.info(`Removed specialized agent: ${agentName}`);
  }

  async getProcessingHistory(): Promise<any[]> {
    try {
      return await convexService.listMemories();
    } catch (error) {
      logger.error('Failed to retrieve processing history:', error);
      throw error;
    }
  }
}

export default new ParkerIndustries();