import { QdrantClient } from "@qdrant/js-client-rest";

let client: QdrantClient | null = null;

export function getQdrantClient() {
  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;

  if (!url || !apiKey) {
    console.warn(
      "Qdrant environment variables missing"
    );

    return null;
  }

  if (!client) {
    client = new QdrantClient({
      url,
      apiKey,
      checkCompatibility: false,
    });
  }

  return client;
}