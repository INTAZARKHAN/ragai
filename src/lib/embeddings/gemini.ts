import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import { EmbeddingProvider } from "./provider";

dotenv.config({
  path: ".env",
});

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not defined. Check your .env file."
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL = "gemini-embedding-2";
const DIMENSIONS = 1536;

export const geminiEmbeddingProvider: EmbeddingProvider = {
  name: "gemini",

  dimensions: DIMENSIONS,

  async embed(text: string) {
    const result = await ai.models.embedContent({
      model: MODEL,
      contents: text,
      config: {
        outputDimensionality: DIMENSIONS,
      },
    });

    const embedding =
      result.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error(
        "Gemini returned no embedding"
      );
    }

    return embedding;
  },

  async embedMany(texts: string[]) {
    return Promise.all(
      texts.map((text) => this.embed(text))
    );
  },
};