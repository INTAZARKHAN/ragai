import { qdrant } from "@/lib/qdrant/client";
import { embeddingProvider } from "@/lib/embeddings";
import { COLLECTION_NAME } from "@/lib/qdrant/collection";
import { initializeQdrant } from "@/lib/qdrant/init";
import { RetrievedChunk } from "@/types/rag";

export async function retrieveRelevantChunks(
  query: string,
  limit = 5
): Promise<RetrievedChunk[]> {
  await initializeQdrant();

  const queryVector =
    await embeddingProvider.embed(query);

  const results =
    await qdrant.query(COLLECTION_NAME, {
      query: queryVector,
      limit,
      with_payload: true,
    });

  const activeResults = results.points.filter(
    (result) => result.payload?.isActive === true
  );

  return activeResults.map((result) => {
    const payload = result.payload ?? {};

    return {
      id: String(result.id),

      score:
        typeof result.score === "number"
          ? result.score
          : 0,

      content:
        typeof payload.content === "string"
          ? payload.content
          : "",

      documentName:
        typeof payload.documentName === "string"
          ? payload.documentName
          : "Unknown document",

      pageNumber:
        typeof payload.pageNumber === "number"
          ? payload.pageNumber
          : undefined,
    };
  });
}