export interface AIProvider {
  name: string;

  generateAnswer(input: {
    question: string;
    context: string;
  }): Promise<string>;
}