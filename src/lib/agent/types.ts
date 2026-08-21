export type ToolName =
  | "rag"
  | "calculator"
  | "events"
  | "memory";

export interface AgentSource {
  id?: string;
  documentName?: string;
  content?: string;
  score?: number;
  sourceType?: ToolName;
}

export interface AgentResult {
  answer: string;
  sources: AgentSource[];
  tool: ToolName;
  confidence?: "high" | "medium" | "low";
}

export interface VerificationResult {
  verified: boolean;
  confidence: "high" | "medium" | "low";
  reason: string;
  answer: string;
  sources: AgentSource[];
}

export interface ReasoningStep {
  tool: ToolName;
  purpose: string;
}

export interface AgentPlan {
  goal: string;
  steps: ReasoningStep[];
  requiresVerification: boolean;
}

export interface FusedEvidence {
  answer: string;
  confidence: "high" | "medium" | "low";
  conflict: boolean;
  reason: string;
  evidenceCount: number;
}

export interface DecisionResult {
  approved: boolean;
  answer: string;
  confidence: "high" | "medium" | "low";
}