import {
  AgentResult,
  VerificationResult,
  FusedEvidence,
} from "./types";

export function verifyAgentResult(
  result: AgentResult
): VerificationResult {
  // --------------------------------
  // 1. Empty Result
  // --------------------------------

  if (
    !result.answer ||
    result.answer.trim().length === 0
  ) {
    return {
      verified: false,
      confidence: "low",
      reason:
        "The agent returned an empty answer.",
      answer:
        "No answer could be produced.",
      sources: result.sources,
    };
  }

  // --------------------------------
  // 2. MEMORY
  // --------------------------------

  if (
    result.tool === "memory"
  ) {
    const lower =
      result.answer.toLowerCase();

    const noMemory =
      lower.includes(
        "don't have any previous conversation memory"
      ) ||
      lower.includes(
        "no previous conversation memory"
      ) ||
      lower.includes(
        "no conversation memory"
      ) ||
      lower.includes(
        "could not find a previous conversation record"
      );

    if (noMemory) {
      return {
        verified: false,
        confidence: "low",
        reason:
          "No previous conversation memory is available.",
        answer:
          result.answer,
        sources: [],
      };
    }

    return {
      verified: true,
      confidence: "high",
      reason:
        "Previous conversation memory was successfully retrieved.",
      answer:
        result.answer,
      sources: [],
    };
  }

  // --------------------------------
  // 3. CALCULATOR
  // --------------------------------

  if (
    result.tool === "calculator"
  ) {
    if (
      result.answer ===
      "Invalid calculation."
    ) {
      return {
        verified: false,
        confidence: "low",
        reason:
          "Calculator failed.",
        answer:
          "The calculation could not be completed.",
        sources: [],
      };
    }

    return {
      verified: true,
      confidence: "high",
      reason:
        "Calculator generated a deterministic result.",
      answer:
        result.answer,
      sources: [],
    };
  }

  // --------------------------------
  // 4. RAG
  // --------------------------------

  if (
    result.tool === "rag"
  ) {
    const lower =
      result.answer.toLowerCase();

    const ragFailure =
      lower.includes(
        "could not find evidence"
      ) ||
      lower.includes(
        "knowledge search failed"
      ) ||
      lower.includes(
        "fetch failed"
      ) ||
      lower.includes(
        "timeout"
      ) ||
      lower.includes(
        "couldn't find this information"
      );

    if (ragFailure) {
      return {
        verified: false,
        confidence: "low",
        reason:
          "Knowledge retrieval failed.",
        answer:
          result.answer,
        sources: result.sources,
      };
    }

    if (
      result.sources.length === 0
    ) {
      return {
        verified: false,
        confidence: "low",
        reason:
          "No supporting knowledge was retrieved.",
        answer:
          "I could not find evidence in the company knowledge base.",
        sources: [],
      };
    }

    const confidence =
      result.sources.length >= 3
        ? "high"
        : "medium";

    return {
      verified: true,
      confidence,
      reason:
        "Company knowledge evidence was retrieved.",
      answer:
        result.answer,
      sources:
        result.sources,
    };
  }

  // --------------------------------
  // 5. EVENTS
  // --------------------------------

  if (
    result.tool === "events"
  ) {
    const lower =
      result.answer.toLowerCase();

    const notFound =
      lower.includes(
        "no recent company events"
      ) ||
      lower.includes(
        "couldn't find"
      );

    if (notFound) {
      return {
        verified: false,
        confidence: "low",
        reason:
          "No matching event found.",
        answer:
          result.answer,
        sources: [],
      };
    }

    return {
      verified: true,
      confidence: "high",
      reason:
        "Information came from company events.",
      answer:
        result.answer,
      sources:
        result.sources,
    };
  }

  // --------------------------------
  // 6. UNKNOWN
  // --------------------------------

  return {
    verified: false,
    confidence: "low",
    reason:
      "Unknown tool result.",
    answer:
      "The information could not be verified.",
    sources:
      result.sources,
  };
}

export function verifyFusedEvidence(
  fused: FusedEvidence
): VerificationResult {
  if (
    fused.conflict
  ) {
    return {
      verified: false,
      confidence: "low",
      reason:
        fused.reason,
      answer:
        "Conflicting information was found between company data sources.",
      sources: [],
    };
  }

  return {
    verified: true,
    confidence:
      fused.confidence,
    reason:
      fused.reason,
    answer:
      fused.answer,
    sources: [],
  };
}