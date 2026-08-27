import { randomUUID } from "crypto";

import type {
  AgentContext,
} from "./types";

export function createAgentContext(
  question: string,
  userId?: string
): AgentContext {
  return {
    requestId: randomUUID(),

    question,

    userId,

    riskLevel: "LOW",

    status: "PENDING",

    metadata: {},
  };
}