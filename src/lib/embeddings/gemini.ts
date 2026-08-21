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

const REQUEST_TIMEOUT_MS = 12_000;
const MAX_RETRIES = 1;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function embedWithTimeout(
  text: string
): Promise<number[]> {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      const request = ai.models.embedContent({
        model: MODEL,
        contents: text,
        config: {
          outputDimensionality: DIMENSIONS,
        },
      });

      const timeout = new Promise<never>(
        (_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                `Gemini embedding request timed out after ${REQUEST_TIMEOUT_MS}ms`
              )
            );
          }, REQUEST_TIMEOUT_MS);
        }
      );

      const result = await Promise.race([
        request,
        timeout,
      ]);

      const embedding =
        result.embeddings?.[0]?.values;

      if (!embedding) {
        throw new Error(
          "Gemini returned no embedding"
        );
      }

      return embedding;
    } catch (error) {
      lastError = error;

      console.warn(
        `Gemini embedding attempt ${
          attempt + 1
        }/${MAX_RETRIES + 1} failed:`,
        error
      );

      if (attempt < MAX_RETRIES) {
        await sleep(500);
      }
    }
  }

  throw new Error(
    `Gemini embedding failed after ${
      MAX_RETRIES + 1
    } attempts: ${
      lastError instanceof Error
        ? lastError.message
        : String(lastError)
    }`
  );
}

export const geminiEmbeddingProvider: EmbeddingProvider =
  {
    name: "gemini",

    dimensions: DIMENSIONS,

    async embed(text: string) {
      if (!text.trim()) {
        throw new Error(
          "Cannot create embedding for empty text"
        );
      }

      return embedWithTimeout(text);
    },

    async embedMany(texts: string[]) {
      const results: number[][] = [];

      for (const text of texts) {
        results.push(
          await embedWithTimeout(text)
        );
      }

      return results;
    },
  };