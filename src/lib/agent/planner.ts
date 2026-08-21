import {
  ToolName,
} from "./types";

const MEMORY_PATTERNS = [
  "what did i ask",
  "what have i asked",
  "previous question",
  "my previous question",
  "earlier question",
  "what was my question",
  "what did we discuss",
  "what were we discussing",
  "previous conversation",
  "earlier conversation",
  "continue previous",
  "continue the previous",
  "continue where we left",

  // NEW
  "what did i ask before",
  "what i asked before",
  "what is asked before",
  "asked before",
  "last question",
  "my last question",
  "previous chat",
  "earlier chat",
  "last chat",
  "remember",
  "memory",
];

export function decideTool(
  question: string
): ToolName {
  const lower =
    question
      .toLowerCase()
      .trim();

  console.log(
    "PLANNER QUESTION:",
    lower
  );

  const isMemory =
    MEMORY_PATTERNS.some(
      (pattern) =>
        lower.includes(
          pattern
        )
    );

  if (isMemory) {
    console.log(
      "SELECTED MEMORY"
    );

    return "memory";
  }

  console.log(
    "SELECTED RAG"
  );

  return "rag";
}