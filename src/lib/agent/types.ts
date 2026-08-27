export type AgentRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type AgentTaskStatus =
  | "PENDING"
  | "PLANNING"
  | "EXECUTING"
  | "WAITING_APPROVAL"
  | "VERIFYING"
  | "COMPLETED"
  | "FAILED";

export type ToolName =
  | "memory"
  | "rag"
  | "events"
  | "calculator";

export interface AgentPlanStep {
  tool: ToolName;
  purpose: string;
}

export interface AgentPlan {
  goal: string;

  steps: AgentPlanStep[];

  requiresVerification: boolean;
}

export interface AgentSource {
  documentName: string;

  pageNumber?: number;

  score: number;
}

export interface AgentResult {
  answer: string;

  sources: AgentSource[];

  tool: ToolName;

  confidence:
    | "low"
    | "medium"
    | "high";
}

export interface VerificationResult {
  verified: boolean;

  confidence:
    | "low"
    | "medium"
    | "high";

  answer: string;

  reason: string;

  sources: AgentSource[];
}

/**
 * Evidence produced after combining
 * verified results from one or more tools.
 */
export interface FusedEvidence {
  answer: string;

  confidence:
    | "low"
    | "medium"
    | "high";

  conflict: boolean;

  reason: string;

  evidenceCount: number;
}

/**
 * Final decision made by the decision engine.
 */
export interface DecisionResult {
  approved: boolean;

  confidence:
    | "low"
    | "medium"
    | "high";

  answer: string;
}

export interface AgentContext {
  requestId: string;

  question: string;

  userId?: string;

  taskId?: string;

  riskLevel: AgentRiskLevel;

  status: AgentTaskStatus;

  metadata: Record<
    string,
    unknown
  >;
}

export interface ToolResult<T = unknown> {
  success: boolean;

  data?: T;

  error?: string;

  message?: string;

  metadata?: Record<
    string,
    unknown
  >;
}

export interface AgentTool {
  name: ToolName;

  description: string;

  riskLevel: AgentRiskLevel;

  execute(
    input: string,
    context: AgentContext
  ): Promise<AgentResult>;
}