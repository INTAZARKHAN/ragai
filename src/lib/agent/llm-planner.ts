import {
  createFallbackPlan,
  validateAgentPlan,
} from "./reasoning-planner";

import { getOpenAI } from "@/lib/openai";

import {
  AgentPlan,
  ToolName,
} from "./types";

const SYSTEM_PROMPT = `
You are the planning component of an enterprise AI employee.

Your job is ONLY to understand the user's goal and create
a structured tool-use plan.

You MUST NOT answer the user's question.

You MUST NOT invent company facts.

Available tools:

1. memory
   Use for previous conversation questions, previous answers,
   unfinished tasks, earlier discussions, user context,
   and requests such as:
   - "What did I ask before?"
   - "What was my previous question?"
   - "What were we discussing?"
   - "Continue the previous task."
   - "What did we decide earlier?"

2. rag
   Use for company policies, procedures, rules, documents,
   established company knowledge, and internal knowledge.

3. events
   Use for recent company announcements, changes,
   updates, fees, policy changes, and dated events.

4. calculator
   Use for arithmetic calculations.

Planning rules:

- Conversation-history questions MUST use memory.
- Do NOT use rag for previous conversation questions.
- Use memory when the user refers to "before", "previous",
  "earlier", "last question", "our conversation",
  or asks to continue a previous task.
- Use rag for company knowledge.
- Use events for recent or dated company changes.
- Use calculator for arithmetic.
- Use multiple tools when genuinely necessary.
- Verification should normally be required.
- Never invent factual information.
- Return ONLY valid JSON.

JSON format:

{
  "goal": "string",
  "steps": [
    {
      "tool": "memory | rag | events | calculator",
      "purpose": "string"
    }
  ],
  "requiresVerification": true
}
`;

const FALLBACK_PLAN: AgentPlan = {
  goal:
    "Answer the user's request using the most appropriate available company data source.",

  steps: [
    {
      tool: "rag",
      purpose:
        "Check the company knowledge base for relevant information.",
    },
  ],

  requiresVerification: true,
};

const PLANNER_TIMEOUT_MS = 12_000;

function cleanJson(
  content: string
): string {
  return content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function isValidTool(
  value: unknown
): value is ToolName {
  return (
    value === "rag" ||
    value === "events" ||
    value === "calculator" ||
    value === "memory"
  );
}

function isValidPlan(
  value: unknown
): value is AgentPlan {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const plan =
    value as Record<
      string,
      unknown
    >;

  if (
    typeof plan.goal !== "string"
  ) {
    return false;
  }

  if (
    !Array.isArray(plan.steps)
  ) {
    return false;
  }

  if (
    typeof plan.requiresVerification !==
    "boolean"
  ) {
    return false;
  }

  for (
    const step of plan.steps
  ) {
    if (
      !step ||
      typeof step !== "object"
    ) {
      return false;
    }

    const item =
      step as Record<
        string,
        unknown
      >;

    if (
      !isValidTool(item.tool)
    ) {
      return false;
    }

    if (
      typeof item.purpose !==
      "string"
    ) {
      return false;
    }
  }

  return true;
}

function createTimeoutError(): Error {
  return new Error(
    `Agent planner timed out after ${PLANNER_TIMEOUT_MS}ms`
  );
}

export async function createAgentPlan(
  question: string
): Promise<AgentPlan> {
  const openai = getOpenAI();

  /*
   * If OpenAI is unavailable, immediately
   * use the deterministic planner.
   */
  if (!openai) {
    console.warn(
      "OpenAI not configured. Using deterministic fallback."
    );

    return createFallbackPlan(
      question
    );
  }

  try {
    console.log(
      "REASONING PLANNER: Asking OpenAI for tool plan..."
    );

    /*
     * Race the OpenAI request against our own
     * application-level timeout.
     */
    const request =
      openai.chat.completions.create(
        {
          model: "gpt-4.1-mini",

          temperature: 0,

          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: question,
            },
          ],
        },
        {
          timeout:
            PLANNER_TIMEOUT_MS,
          maxRetries: 0,
        }
      );

    const timeout =
      new Promise<never>(
        (_, reject) => {
          setTimeout(() => {
            reject(
              createTimeoutError()
            );
          }, PLANNER_TIMEOUT_MS);
        }
      );

    const response =
      await Promise.race([
        request,
        timeout,
      ]);

    const content =
      response.choices[0]
        ?.message?.content;

    if (!content) {
      console.warn(
        "Reasoning planner returned empty response. Using deterministic fallback."
      );

      return createFallbackPlan(
        question
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(
        cleanJson(content)
      );
    } catch {
      console.warn(
        "Reasoning planner returned invalid JSON. Using deterministic fallback."
      );

      return createFallbackPlan(
        question
      );
    }

    if (!isValidPlan(parsed)) {
      console.warn(
        "Reasoning planner returned invalid plan. Using deterministic fallback."
      );

      return createFallbackPlan(
        question
      );
    }

    console.log(
      "REASONING PLANNER: Valid plan received."
    );

    return validateAgentPlan(
      parsed
    );
  } catch (error: unknown) {
    const apiError =
      error as {
        status?: number;
        code?: string;
        type?: string;
        message?: string;
      };

    /*
     * Rate limit / quota.
     */
    if (
      apiError.status === 429 ||
      apiError.code ===
        "insufficient_quota" ||
      apiError.type ===
        "insufficient_quota"
    ) {
      console.warn(
        "OpenAI reasoning quota unavailable. Using deterministic fallback."
      );

      return createFallbackPlan(
        question
      );
    }

    /*
     * Timeout.
     */
    if (
      apiError.message?.includes(
        "timed out"
      ) ||
      apiError.code ===
        "ETIMEDOUT" ||
      apiError.code ===
        "ECONNABORTED"
    ) {
      console.warn(
        "OpenAI reasoning planner timed out. Using deterministic fallback."
      );

      return createFallbackPlan(
        question
      );
    }

    /*
     * Network / connection errors.
     */
    if (
      apiError.code ===
        "ECONNRESET" ||
      apiError.code ===
        "ENETUNREACH" ||
      apiError.code ===
        "EAI_AGAIN" ||
      apiError.code ===
        "UND_ERR_CONNECT_TIMEOUT"
    ) {
      console.warn(
        "OpenAI network connection failed. Using deterministic fallback."
      );

      return createFallbackPlan(
        question
      );
    }

    /*
     * Any unexpected planner error should
     * never stop the complete agent.
     */
    console.error(
      "Reasoning planner failed. Using deterministic fallback:",
      error
    );

    return createFallbackPlan(
      question
    );
  }
}