import type {
  AgentContext,
  AgentTask,
  TaskPriority,
  TaskType,
} from "./types";

import {
  createTask,
  getTaskById,
  updateTaskStatus,
} from "./task-repository";

import {
  createTaskPlan,
} from "./task-planner";

import {
  executeTask,
} from "./task-executor";

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export async function initializeTask(
  question: string,
  context: AgentContext
): Promise<AgentTask> {
  const requestId =
    context.requestId ??
    generateRequestId();

  const plan =
    await createTaskPlan(question);

  const task =
    await createTask({
      requestId,

      userId: context.userId,

      title:
        plan.title ||
        question.slice(0, 100),

      description:
        plan.description ||
        question,

      type:
        plan.type as TaskType,

      priority:
        (plan.priority as TaskPriority) ??
        "NORMAL",

      steps: plan.steps.map(
        (
          step,
          index
        ) => ({
          order: index + 1,

          description:
            step.description,

          tool: step.tool,

          input: step.input,
        })
      ),
    });

  return task;
}

export async function getInitializedTask(
  taskId: string
): Promise<AgentTask | null> {
  return getTaskById(taskId);
}

export async function markTaskExecuting(
  taskId: string
): Promise<AgentTask> {
  return updateTaskStatus(
    taskId,
    "EXECUTING"
  );
}

export async function markTaskCompleted(
  taskId: string
): Promise<AgentTask> {
  return updateTaskStatus(
    taskId,
    "COMPLETED"
  );
}

export async function markTaskFailed(
  taskId: string
): Promise<AgentTask> {
  return updateTaskStatus(
    taskId,
    "FAILED"
  );
}

/**
 * Executes an already initialized task.
 */
export async function executeInitializedTask(
  task: AgentTask,
  context: AgentContext
): Promise<AgentTask> {
  return executeTask(
    task.id,
    context.question
  );
}