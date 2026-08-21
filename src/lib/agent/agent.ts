import {
  runAgentOrchestrator,
} from "./orchestrator";

import {
  remember,
} from "./memory";

export async function runAgent(
  question: string
) {
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