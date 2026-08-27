export type TaskType =
  | "QUESTION"
  | "RESEARCH"
  | "ACTION"
  | "MULTI_STEP"
  | "CONVERSATION";

export type TaskStatus =
  | "PENDING"
  | "PLANNING"
  | "EXECUTING"
  | "WAITING_APPROVAL"
  | "VERIFYING"
  | "COMPLETED"
  | "FAILED";

export type TaskPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export type TaskStepStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface AgentContext {
  question: string;
  userId?: string;
  requestId?: string;
  sessionId?: string;
}

export interface TaskStep {
  id: string;
  order: number;
  description: string;
  tool?: string;
  status: TaskStepStatus;
  input?: unknown;
  result?: unknown;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentTask {
  id: string;
  requestId: string;
  userId?: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  steps: TaskStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskExecutionResult {
  success: boolean;
  answer: string;
  task: AgentTask;
}

export interface TaskPlanStep {
  description: string;
  tool?: string;
  input?: unknown;
}

export interface TaskPlan {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  steps: TaskPlanStep[];
}