import {
  getRecentMemory,
} from "./memory";

export async function memoryTool(
  _question?: string
) {
  const memory =
    getRecentMemory(10);

  if (
    memory.length === 0
  ) {
    return {
      answer:
        "I don't have any previous conversation memory available yet.",

      sources: [],

      tool: "memory" as const,

      confidence: "low" as const,
    };
  }

  const answer =
    memory
      .map(
        (item, index) =>
          `${index + 1}. User: ${item.question}\nAssistant: ${item.answer}`
      )
      .join("\n\n");

  return {
    answer,

    sources: [],

    tool: "memory" as const,

    confidence: "high" as const,
  };
}