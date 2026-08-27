import { ToolName } from "./types";

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
  "what did i ask before",
  "what i asked before",
  "asked before",
  "last question",
  "my last question",
  "previous chat",
  "earlier chat",
  "last chat",
  "remember",
  "memory",
  "favorite",
  "do you remember",
];

const CALCULATOR_PATTERNS = [
  "calculate",
  "what is",
  "how much is",
  "multiply",
  "divide",
  "plus",
  "minus",
  "times",
  "percentage",
  "+",
  "-",
  "*",
  "/",
  "×",
  "÷",
];

const EVENTS_PATTERNS = [
  "event",
  "events",
  "meeting",
  "meetings",
  "schedule",
  "scheduled",
  "company event",
];

export function decideTool(
  question: string
): ToolName {
  const lower = question
    .toLowerCase()
    .trim();

  console.log(
    "PLANNER QUESTION:",
    lower
  );

  // -------------------------
  // MEMORY
  // -------------------------

  const isMemory =
    MEMORY_PATTERNS.some((pattern) =>
      lower.includes(pattern)
    );

  if (isMemory) {
    console.log(
      "SELECTED MEMORY"
    );

    return "memory";
  }

  // -------------------------
  // CALCULATOR
  // -------------------------

  const hasMathOperator =
    /[\d\s]+[+\-*/×÷][\d\s]+/.test(
      lower
    );

  const isCalculator =
    CALCULATOR_PATTERNS.some((pattern) =>
      lower.includes(pattern)
    ) || hasMathOperator;

  if (isCalculator) {
    console.log(
      "SELECTED CALCULATOR"
    );

    return "calculator";
  }

  // -------------------------
  // COMPANY EVENTS
  // -------------------------

  const isEvents =
    EVENTS_PATTERNS.some((pattern) =>
      lower.includes(pattern)
    );

  if (isEvents) {
    console.log(
      "SELECTED EVENTS"
    );

    return "events";
  }

  // -------------------------
  // DEFAULT → RAG
  // -------------------------

  console.log(
    "SELECTED RAG"
  );

  return "rag";
}