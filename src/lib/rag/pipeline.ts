import { retrieveRelevantChunks } from "./retriever";
import { buildRAGPrompt } from "./prompt";
import { aiProvider } from "@/lib/ai";

export interface RAGResult {
  answer: string;

  sources: {
    documentName: string;
    pageNumber?: number;
    score: number;
  }[];
}

export async function runRAG(
  question: string
): Promise<RAGResult> {
  const chunks = await retrieveRelevantChunks(
    question,
    5
  );

  if (chunks.length === 0) {
    return {
      answer:
        "I couldn't find this information in the company knowledge base.",
      sources: [],
    };
  }

  /*
   * Minimum relevance threshold.
   * This prevents very weak matches from being
   * blindly sent to the LLM.
   */
  const relevantChunks = chunks.filter(
    (chunk) => chunk.score >= 0.3
  );

  if (relevantChunks.length === 0) {
    return {
      answer:
        "I couldn't find this information in the company knowledge base.",
      sources: [],
    };
  }

  const context = relevantChunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}]
Document: ${chunk.documentName}
${
  chunk.pageNumber
    ? `Page: ${chunk.pageNumber}`
    : ""
}

Content:
${chunk.content}`
    )
    .join("\n\n");

  const prompt = buildRAGPrompt(
    question,
    context
  );

  const answer =
    await aiProvider.generateAnswer({
      question,
      context: prompt,
    });

  return {
    answer,

    sources: relevantChunks.map((chunk) => ({
      documentName: chunk.documentName,
      pageNumber: chunk.pageNumber,
      score: chunk.score,
    })),
  };
}