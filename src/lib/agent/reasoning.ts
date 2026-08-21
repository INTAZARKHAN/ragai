import {
  AgentResult,
  VerificationResult,
} from "./types";

export type ReasoningDecision =
  | "answer"
  | "needs_more_evidence"
  | "cannot_verify"
  | "conflict";

export interface ReasoningResult {
  decision: ReasoningDecision;
  reason: string;
  nextTool?:
    | "rag"
    | "events"
    | "calculator"
    | "memory";
}

export function reasonAboutResult(
  result: AgentResult,
  verification: VerificationResult
): ReasoningResult {
  if (
    result.tool === "memory" &&
    verification.verified
  ) {
    return {
      decision: "answer",

      reason:
        "Relevant previous conversation memory was successfully retrieved and verified.",
    };
  }

  if (
    verification.verified &&
    verification.confidence === "high"
  ) {
    return {
      decision: "answer",

      reason:
        "The available evidence is sufficient and verified.",
    };
  }

  if (
    result.tool === "rag" &&
    result.sources.length === 0
  ) {
    return {
      decision: "cannot_verify",

      reason:
        "The knowledge base did not provide supporting evidence.",
    };
  }

  if (
    result.tool === "events" &&
    result.answer.includes(
      "couldn't find"
    )
  ) {
    return {
      decision: "cannot_verify",

      reason:
        "No matching company event was found.",
    };
  }

  if (
    result.tool === "calculator" &&
    !verification.verified
  ) {
    return {
      decision: "cannot_verify",

      reason:
        "The calculation could not be verified.",
    };
  }

  if (!verification.verified) {
    return {
      decision:
        "needs_more_evidence",

      reason:
        "The current result is not sufficiently verified.",
    };
  }

  return {
    decision: "cannot_verify",

    reason:
      "The agent could not establish sufficient evidence.",
  };
}