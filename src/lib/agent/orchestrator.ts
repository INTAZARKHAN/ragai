import {
  createAgentPlan,
} from "./llm-planner";

import {
  ragTool,
  calculatorTool,
  companyEventsTool,
  memoryAgentTool,
} from "./tools";

import {
  verifyAgentResult,
} from "./verifier";

import {
  fuseEvidence,
} from "./evidence-fusion";

import {
  makeDecision,
} from "./decision-engine";

import {
  AgentPlan,
  AgentResult,
  VerificationResult,
} from "./types";

const MAX_STEPS = 3;

async function executeTool(
  tool: AgentPlan["steps"][number]["tool"],
  question: string
): Promise<AgentResult> {
  console.log(
    "EXECUTING TOOL:",
    tool
  );

  switch (tool) {
    case "memory":
      return memoryAgentTool(
        question
      );

    case "rag":
      return ragTool(question);

    case "events":
      return companyEventsTool(
        question
      );

    case "calculator":
      return calculatorTool(
        question
      );

    default:
      throw new Error(
        `Unsupported agent tool: ${tool}`
      );
  }
}

export async function runAgentOrchestrator(
  question: string
): Promise<VerificationResult> {
  console.log(
    "\n=============================="
  );

  console.log(
    "AGENT QUESTION:",
    question
  );

  const plan =
    await createAgentPlan(
      question
    );

  console.log(
    "AGENT GOAL:",
    plan.goal
  );

  console.log(
    "AGENT PLAN:",
    JSON.stringify(
      plan.steps,
      null,
      2
    )
  );

  
if (
  plan.steps.length === 0
) {
  return {
    verified: true,
    confidence: "high",
    answer:
      "Hello! How can I help you?",
    reason:
      "The agent identified this as a conversational message that does not require a company knowledge tool.",
    sources: [],
  };
}
  const limitedSteps =
    plan.steps.slice(
      0,
      MAX_STEPS
    );

  const evidence: AgentResult[] =
    [];

  for (
    const step of limitedSteps
  ) {
    try {
      const result =
        await executeTool(
          step.tool,
          question
        );

      console.log(
        "TOOL RESULT:",
        step.tool,
        result
      );

      const verification =
        verifyAgentResult(
          result
        );

      console.log(
        "VERIFICATION:",
        verification
      );

      if (
        verification.verified
      ) {
        evidence.push(
          result
        );
      } else {
        console.warn(
          "Tool result was not verified:",
          step.tool
        );
      }
    } catch (error) {
      console.error(
        `Tool execution failed: ${step.tool}`,
        error
      );
    }
  }

  if (
    evidence.length === 0
  ) {
    return {
      verified: false,
      confidence: "low",
      answer:
        "I could not establish reliable evidence for this request.",
      reason:
        "All planned tool results failed verification.",
      sources: [],
    };
  }

  const fused =
    fuseEvidence(
      evidence
    );

  console.log(
    "FUSED EVIDENCE:",
    fused
  );

  const decision =
    makeDecision(
      fused
    );

  console.log(
    "AGENT DECISION:",
    decision
  );

  console.log(
    "==============================\n"
  );

  return {
    verified:
      decision.approved,

    confidence:
      decision.confidence,

    answer:
      decision.answer,

    reason:
      fused.reason,

    sources:
      evidence.flatMap(
        (item) =>
          item.sources
      ),
  };
}