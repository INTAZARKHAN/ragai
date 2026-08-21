import { qdrant } from "@/lib/qdrant";
import { createEmbedding } from "./create-embedding";

export async function searchKnowledge(
  query: string
) {
  const embedding =
    await createEmbedding(query);

  const results =
    await qdrant.query(
      "knowledge-base",
      {
        query: embedding,
        limit: 5,
      }
    );

  return results.points;
}