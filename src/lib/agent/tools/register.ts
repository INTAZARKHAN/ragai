import {
  toolRegistry,
} from "./registry";

import {
  ragTool,
  memoryAgentTool,
  calculatorTool,
  companyEventsTool,
} from "../tools";

toolRegistry.register({
  name: "rag",

  description:
    "Search the company knowledge base for verified information.",

  riskLevel: "LOW",

  execute: ragTool,
});

toolRegistry.register({
  name: "memory",

  description:
    "Search previously stored user and conversation memories.",

  riskLevel: "LOW",

  execute: memoryAgentTool,
});

toolRegistry.register({
  name: "events",

  description:
    "Search company events and internal updates.",

  riskLevel: "LOW",

  execute: companyEventsTool,
});

toolRegistry.register({
  name: "calculator",

  description:
    "Perform safe mathematical calculations.",

  riskLevel: "LOW",

  execute: calculatorTool,
});