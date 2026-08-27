import {
  toolRegistry,
} from "./tools/registry";

import type {
  AgentContext,
  AgentResult,
  ToolName,
} from "./types";

export async function executeAgentTool(
  toolName: ToolName,
  question: string,
  context: AgentContext
): Promise<AgentResult> {
  const tool =
    toolRegistry.get(
      toolName
    );

  if (!tool) {
    throw new Error(
      `Unknown agent tool: ${toolName}`
    );
  }

  console.log(
    "TOOL EXECUTION START:",
    {
      tool: toolName,
      requestId:
        context.requestId,
    }
  );

  const result =
    await tool.execute(
      question,
      context
    );

  console.log(
    "TOOL EXECUTION END:",
    {
      tool: toolName,
      success: true,
    }
  );

  return result;
}