import { qdrant } from "@/lib/qdrant";

export async function createCollection() {
  try {
    await qdrant.createCollection(
      "knowledge-base",
      {
        vectors: {
          size: 1536,
          distance: "Cosine",
        },
      }
    );
  } catch (error) {
    console.log(
      "Collection already exists"
    );
  }
}