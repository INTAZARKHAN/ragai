import { QdrantClient } from '@qdrant/js-client-rest';

let client: QdrantClient | null = null;

export function getQdrantClient(): QdrantClient {
  if (!client) {
    const url = process.env.QDRANT_URL;
    if (!url) throw new Error('QDRANT_URL environment variable is not set');
    client = new QdrantClient({
      url,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }
  return client;
}

// YE WALI LINE SABSE IMPORTANT HAI - purane imports ke liye
export const qdrant = getQdrantClient();