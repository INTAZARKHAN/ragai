import { QdrantClient } from "@qdrant/js-client-rest";

let qdrantInstance: QdrantClient | null = null;

export function getQdrantClient() {
  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;

  if (!url || !apiKey) {
    console.warn("Qdrant env vars missing");
    return null;
  }

  if (!qdrantInstance) {
    qdrantInstance = new QdrantClient({
      url,
      apiKey,
    });
  }

  return qdrantInstance;
}