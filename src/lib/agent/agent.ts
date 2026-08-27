import {
  runAgentOrchestrator,
} from "./orchestrator";

import {
  remember,
} from "./memory";

import {
  createAgentContext,
} from "./context";

import {
  initializeTask,
  executeInitializedTask,
} from "./task/task-manager";

export async function runAgent(
  question: string,
  userId?: string
) {
  const context =
    createAgentContext(
      question,
      userId
    );

  const task =
    await initializeTask(
      question,
      context
    );

  console.log(
    "TASK CREATED:",
    {
      id: task.id,
      type: task.type,
      status: task.status,
      steps: task.steps.length,
    }
  );

  /*
   * Conversation does not need
   * persistent task execution.
   */
  if (
    task.type ===
    "CONVERSATION"
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

  /*
   * Execute persistent task.
   */
  try {
    await executeInitializedTask(
      task,
      context
    );
  } catch (error) {
    console.error(
      "Task execution failed:",
      error
    );
  }

  /*
   * Existing orchestrator remains
   * responsible for final response.
   */
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