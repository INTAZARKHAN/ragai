import {
  FusedEvidence,
  DecisionResult,
} from "./types";

export function makeDecision(
  fused: FusedEvidence
): DecisionResult {
  if (
    fused.conflict
  ) {
    return {
      approved: false,

      answer:
        "The available company data contains conflicting information. Human review is recommended.",

      confidence: "low",
    };
  }

  if (
    fused.confidence === "low"
  ) {
    return {
      approved: false,

      answer:
        "There is not enough reliable evidence to make a decision.",

      confidence: "low",
    };
  }

  return {
    approved: true,

    answer: fused.answer,

    confidence:
      fused.confidence,
  };
}