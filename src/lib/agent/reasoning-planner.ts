import {
  AgentPlan,
  ToolName,
} from "./types";

const ALLOWED_TOOLS: ToolName[] = [
  "rag",
  "calculator",
  "events",
  "memory",
];

function isAllowedTool(
  tool: string
): tool is ToolName {
  return ALLOWED_TOOLS.includes(
    tool as ToolName
  );
}

export function validateAgentPlan(
  plan: AgentPlan
): AgentPlan {
  const validSteps =
    plan.steps.filter((step) =>
      isAllowedTool(step.tool)
    );

  return {
    goal: plan.goal,
    steps: validSteps,
    requiresVerification:
      plan.requiresVerification,
  };
}

const MEMORY_PATTERNS = [
  "what did i ask",
  "what have i asked",
  "previous question",
  "my previous question",
  "earlier question",
  "what was my question",
  "what did we discuss",
  "what were we discussing",
  "previous conversation",
  "earlier conversation",
  "continue previous",
  "continue the previous",
  "continue where we left",
];

function isMemoryQuestion(
  question: string
): boolean {
  const lower = question
    .toLowerCase()
    .trim();

  return MEMORY_PATTERNS.some(
    (pattern) =>
      lower.includes(pattern)
  );
}

const CASUAL_PATTERNS = [
  "hello",
  "hi",
  "hey",
  "hey there",
  "good morning",
  "good afternoon",
  "good evening",
  "thanks",
  "thank you",
];

function isCasualQuestion(
  question: string
): boolean {
  const lower = question
    .toLowerCase()
    .trim();

  return CASUAL_PATTERNS.some(
    (pattern) =>
      lower === pattern ||
      lower.startsWith(
        `${pattern} `
      )
  );
}

export function createFallbackPlan(
  question: string
): AgentPlan {
  const lower =
    question.toLowerCase().trim();

  // --------------------------------
  // 1. Conversation Memory
  // --------------------------------

  if (
    isMemoryQuestion(question)
  ) {
    console.log(
      "FALLBACK PLANNER: MEMORY"
    );

    return {
      goal:
        "Retrieve relevant previous conversation memory and continue from the existing context.",

      steps: [
        {
          tool: "memory",

          purpose:
            "Search previous conversation memory for the user's earlier questions, answers, and task context.",
        },
      ],

      requiresVerification: true,
    };
  }

  // --------------------------------
  // 2. Casual Conversation
  // --------------------------------

  if (
    isCasualQuestion(question)
  ) {
    console.log(
      "FALLBACK PLANNER: CASUAL"
    );

    return {
      goal:
        "Respond naturally to the user's conversational greeting or acknowledgement.",

      steps: [],

      requiresVerification: false,
    };
  }

  // --------------------------------
  // 3. Calculator
  // --------------------------------

  const mathPattern =
    /^[0-9+\-*/().\s]+$/;

  if (
    mathPattern.test(lower)
  ) {
    console.log(
      "FALLBACK PLANNER: CALCULATOR"
    );

    return {
      goal:
        "Calculate the requested expression.",

      steps: [
        {
          tool: "calculator",

          purpose:
            "Evaluate the mathematical expression.",
        },
      ],

      requiresVerification: true,
    };
  }

  // --------------------------------
  // 4. Company Events / Updates
  // --------------------------------

  const eventKeywords = [
    "event",
    "events",
    "update",
    "updates",
    "recent",
    "latest",
    "new",
    "newest",
    "change",
    "changed",
    "changes",
    "announcement",
    "announcements",
  ];

  const feeKeywords = [
    "fee",
    "fees",
    "price",
    "pricing",
    "charge",
    "charges",
    "cost",
  ];

  const policyChangeKeywords = [
    "policy change",
    "policy changed",
    "policy update",
    "policy updated",
  ];

  const isEventQuestion =
    eventKeywords.some(
      (keyword) =>
        lower.includes(keyword)
    );

  const isFeeQuestion =
    feeKeywords.some(
      (keyword) =>
        lower.includes(keyword)
    );

  const isPolicyChangeQuestion =
    policyChangeKeywords.some(
      (keyword) =>
        lower.includes(keyword)
    );

  if (
    isEventQuestion ||
    isFeeQuestion ||
    isPolicyChangeQuestion
  ) {
    console.log(
      "FALLBACK PLANNER: EVENTS"
    );

    return {
      goal:
        "Find recent company events or changes relevant to the user's question.",

      steps: [
        {
          tool: "events",

          purpose:
            "Check recent company events and updates.",
        },
      ],

      requiresVerification: true,
    };
  }

  // --------------------------------
  // 5. Company Knowledge / RAG
  // --------------------------------

  console.log(
    "FALLBACK PLANNER: RAG"
  );

  return {
    goal:
      "Find verified information in the company knowledge base.",

    steps: [
      {
        tool: "rag",

        purpose:
          "Search company knowledge for evidence relevant to the user's question.",
      },
    ],

    requiresVerification: true,
  };
}