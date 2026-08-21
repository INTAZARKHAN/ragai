export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;

  embedMany(texts: string[]): Promise<number[][]>;

  dimensions: number;

  name: string;
}