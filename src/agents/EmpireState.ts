import { Agent } from './Agent';
import { generateSwarmResponse } from '../services/huggingFaceService';

class SwarmAgent extends Agent {
  constructor(id: number) {
    super(`Swarm Agent ${id}`);
  }

  async process(input: string): Promise<string> {
    return await generateSwarmResponse(`Analyze from a unique perspective: ${input}`);
  }
}

export class EmpireState {
  private swarmAgents: SwarmAgent[];

  constructor(size: number = 10) {
    this.swarmAgents = Array.from({ length: size }, (_, i) => new SwarmAgent(i + 1));
  }

  async processSwarm(input: string): Promise<string[]> {
    const promises = this.swarmAgents.map(agent => agent.process(input));
    return await Promise.all(promises);
  }
}