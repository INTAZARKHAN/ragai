import { getQdrantClient } from "./client";

export const COLLECTION_NAME =
  "company_knowledge";

const VECTOR_SIZE = 1536;

export async function ensureCollection() {
  const qdrant = getQdrantClient();

  if (!qdrant) {
    console.warn(
      "Qdrant unavailable. Collection check skipped."
    );
    return;
  }

  const collections =
    await qdrant.getCollections();

  const exists =
    collections.collections.some(
      (collection) =>
        collection.name ===
        COLLECTION_NAME
    );

  if (exists) {
    console.log(
      `Qdrant collection "${COLLECTION_NAME}" already exists.`
    );
    return;
  }

  await qdrant.createCollection(
    COLLECTION_NAME,
    {
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine",
      },
    }
  );

  console.log(
    `Qdrant collection "${COLLECTION_NAME}" created.`
  );
}

export async function createKnowledgeCollection() {
  await ensureCollection();
}