export abstract class Agent {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract process(input: string): Promise<string>;
}