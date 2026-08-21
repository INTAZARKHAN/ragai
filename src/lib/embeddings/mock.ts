import { EmbeddingProvider } from "./provider";

const DIMENSIONS = 1536;

function createVector(text: string): number[] {
  const vector = new Array(DIMENSIONS).fill(0);

  for (let i = 0; i < text.length; i++) {
    const index = i % DIMENSIONS;

    vector[index] += text.charCodeAt(i) / 1000;
  }

  return vector;
}

export const mockEmbeddingProvider: EmbeddingProvider = {
  name: "mock",

  dimensions: DIMENSIONS,

  async embed(text: string) {
    return createVector(text);
  },

  async embedMany(texts: string[]) {
    return texts.map(createVector);
  },
};