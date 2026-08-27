import type {
  AgentContext,
  ToolResult,
} from "../types";

import {
  runRAG,
} from "@/lib/rag/pipeline";

export interface RagToolInput {
  query: string;
}

export async function executeRagTool(
  input: RagToolInput,
  context: AgentContext
): Promise<
  ToolResult
> {
  try {
    if (
      !input.query ||
      !input.query.trim()
    ) {
      return {
        success: false,
        error:
          "RAG query cannot be empty.",
      };
    }

    const result =
      await runRAG(
        input.query
      );

    return {
      success: true,
      data: result,
      metadata: {
        requestId:
          context.requestId,
      },
    };
  } catch (error) {
    console.error(
      "RAG tool failed:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "RAG tool failed.",
    };
  }
}