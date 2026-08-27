import type {
  AgentTask,
  TaskStep,
} from "./types";

import {
  getTaskById,
  updateTaskStep,
  updateTaskStatus,
} from "./task-repository";

import {
  ragTool,
  calculatorTool,
  companyEventsTool,
  memoryAgentTool,
} from "../tools";

async function executeTool(
  step: TaskStep,
  question: string
): Promise<string> {
  switch (step.tool) {
    case "rag": {
      const result =
        await ragTool(question);

      return result.answer;
    }

    case "calculator": {
      const result =
        await calculatorTool(
          question
        );

      return result.answer;
    }

    case "events": {
      const result =
        await companyEventsTool(
          question
        );

      return result.answer;
    }

    case "memory": {
      const result =
        await memoryAgentTool(
          question
        );

      return result.answer;
    }

    default:
      return step.description;
  }
}

export async function executeTask(
  taskId: string,
  question: string
): Promise<AgentTask> {
  const task =
    await getTaskById(taskId);

  if (!task) {
    throw new Error(
      `Task not found: ${taskId}`
    );
  }

  await updateTaskStatus(
    taskId,
    "EXECUTING"
  );

  /*
   * Re-fetch the task after updating
   * status so we have the latest state.
   */
  const executingTask =
    await getTaskById(taskId);

  if (!executingTask) {
    throw new Error(
      `Task disappeared: ${taskId}`
    );
  }

  for (
    const step of executingTask.steps
  ) {
    try {
      await updateTaskStep(
        step.id,
        {
          status: "RUNNING",
          startedAt: new Date(),
        }
      );

      const answer =
        await executeTool(
          step,
          question
        );

      await updateTaskStep(
        step.id,
        {
          status: "COMPLETED",
          output: answer,
          completedAt: new Date(),
        }
      );
    } catch (error) {
      await updateTaskStep(
        step.id,
        {
          status: "FAILED",

          error:
            error instanceof Error
              ? error.message
              : "Unknown execution error",

          completedAt: new Date(),
        }
      );

      await updateTaskStatus(
        taskId,
        "FAILED"
      );

      throw error;
    }
  }

  return updateTaskStatus(
    taskId,
    "COMPLETED"
  );
}