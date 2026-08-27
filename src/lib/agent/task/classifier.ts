import type { TaskType } from "./types";

export function classifyTask(
  question: string
): TaskType {
  const text = question
    .trim()
    .toLowerCase();

  if (!text) {
    return "CONVERSATION";
  }

  const conversationPatterns = [
    "hello",
    "hi",
    "hey",
    "thanks",
    "thank you",
    "good morning",
    "good evening",
  ];

  if (
    conversationPatterns.some(
      (pattern) =>
        text === pattern ||
        text.startsWith(`${pattern} `)
    )
  ) {
    return "CONVERSATION";
  }

  const actionPatterns = [
    "send",
    "create",
    "delete",
    "update",
    "book",
    "schedule",
    "email",
    "notify",
    "submit",
    "cancel",
    "change",
    "add",
    "remove",
  ];

  if (
    actionPatterns.some((pattern) =>
      text.includes(pattern)
    )
  ) {
    return "ACTION";
  }

  const researchPatterns = [
    "research",
    "compare",
    "find out",
    "investigate",
    "analyze",
    "analyse",
    "summarize",
  ];

  if (
    researchPatterns.some((pattern) =>
      text.includes(pattern)
    )
  ) {
    return "RESEARCH";
  }

  const multiStepPatterns = [
    "and then",
    "after that",
    "step by step",
    "first",
    "then",
    "finally",
  ];

  if (
    multiStepPatterns.some((pattern) =>
      text.includes(pattern)
    )
  ) {
    return "MULTI_STEP";
  }

  return "QUESTION";
}