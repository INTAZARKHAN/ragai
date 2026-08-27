import type {
  AgentTool,
  ToolName,
} from "../types";

class ToolRegistry {
  private tools =
    new Map<
      ToolName,
      AgentTool
    >();

  register(
    tool: AgentTool
  ) {
    if (
      this.tools.has(
        tool.name
      )
    ) {
      throw new Error(
        `Tool "${tool.name}" is already registered.`
      );
    }

    this.tools.set(
      tool.name,
      tool
    );
  }

  get(
    name: ToolName
  ) {
    return this.tools.get(
      name
    );
  }

  getAll() {
    return Array.from(
      this.tools.values()
    );
  }

  has(
    name: ToolName
  ) {
    return this.tools.has(
      name
    );
  }
}

export const toolRegistry =
  new ToolRegistry();