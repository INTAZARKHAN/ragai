import {
  AgentResult,
  FusedEvidence,
} from "./types";

export function fuseEvidence(
  evidence: AgentResult[]
): FusedEvidence {
  if (evidence.length === 0) {
    return {
      answer:
        "No evidence found.",

      confidence: "low",

      conflict: false,

      reason:
        "No tools produced evidence.",

      evidenceCount: 0,
    };
  }

  if (evidence.length === 1) {
    return {
      answer:
        evidence[0].answer,

      confidence: "medium",

      conflict: false,

      reason:
        "Only one evidence source available.",

      evidenceCount: 1,
    };
  }

  const answers =
    evidence.map((item) =>
      item.answer.trim()
    );

  const unique =
    new Set(answers);

  if (unique.size > 1) {
    return {
      answer:
        "Conflicting evidence detected.",

      confidence: "low",

      conflict: true,

      reason:
        "Different tools returned different conclusions.",

      evidenceCount:
        evidence.length,
    };
  }

  return {
    answer:
      answers[0],

    confidence: "high",

    conflict: false,

    reason:
      "Multiple evidence sources agree.",

    evidenceCount:
      evidence.length,
  };
}