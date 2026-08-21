import {
  AgentPlan,
  AgentResult,
  VerificationResult,
} from "./types";

import {
  ragTool,
  calculatorTool,
  companyEventsTool,
} from "./tools";

import {
  memoryTool,
} from "./memory-tool";

import {
  runAgentOrchestrator,
} from "./orchestrator";

import {
  remember,
} from "./memory";

export async function executeTool(
  tool: AgentPlan["steps"][number]["tool"],
  question: string
): Promise<AgentResult> {
  switch (tool) {
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

    case "memory":
      return memoryTool(question);

    default:
      throw new Error(
        `Unsupported agent tool: ${tool}`
      );
  }
}

export async function runAgent(
  question: string
): Promise<VerificationResult> {
  const result =
    await runAgentOrchestrator(
      question
    );

  if (
    result.answer &&
    result.answer.trim()
  ) {
    remember(
      question,
      result.answer
    );
  }

  return result;
}