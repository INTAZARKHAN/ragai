import { QdrantClient } from "@qdrant/js-client-rest";

const url = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY;

if (!url) {
  throw new Error("QDRANT_URL is not defined");
}

if (!apiKey) {
  throw new Error("QDRANT_API_KEY is not defined");
}

export const qdrant = new QdrantClient({
  url,
  apiKey,
});