import {
  randomUUID,
} from "crypto";

import type {
  AgentContext,
  AgentTask,
  TaskPriority,
} from "./types";

import {
  classifyTask,
} from "./classifier";

export function createAgentTask(
  context: AgentContext
): AgentTask {
  const type =
    classifyTask(
      context.question
    );

  const now =
    new Date();

  return {
    id: randomUUID(),

    requestId:
      context.requestId ??
      randomUUID(),

    userId:
      context.userId,

    title:
      context.question.slice(
        0,
        100
      ),

    description:
      context.question,

    type,

    priority:
      "NORMAL" as TaskPriority,

    status:
      "PENDING",

    steps: [],

    createdAt: now,

    updatedAt: now,
  };
}