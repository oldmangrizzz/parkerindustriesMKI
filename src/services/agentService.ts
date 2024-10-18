import { ParkerIndustries } from '../agents/ParkerIndustries';

class AgentService {
  private parkerIndustries: ParkerIndustries;

  constructor() {
    this.parkerIndustries = new ParkerIndustries();
  }

  async processInput(input: string): Promise<string> {
    return await this.parkerIndustries.process(input);
  }
}

export default new AgentService();