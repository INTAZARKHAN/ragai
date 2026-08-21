import { qdrant } from "@/lib/qdrant";
import { createEmbedding } from "./create-embedding";

export async function storeChunks(
  documentId: string,
  chunks: string[]
) {
  const points = [];

  for (const chunk of chunks) {
    const embedding =
      await createEmbedding(chunk);

    points.push({
      id: crypto.randomUUID(),

      vector: embedding,

      payload: {
        documentId,
        content: chunk,
      },
    });
  }

  await qdrant.upsert(
    "knowledge-base",
    {
      wait: true,
      points,
    }
  );

  return points;
}