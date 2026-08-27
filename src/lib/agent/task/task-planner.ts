import {
  randomUUID,
} from "crypto";

import type {
  AgentTask,
  TaskPlan,
  TaskStep,
} from "./types";

import {
  classifyTask,
} from "./classifier";

export async function createTaskPlan(
  question: string
): Promise<TaskPlan> {
  const type = classifyTask(question);

  const title =
    question.trim().slice(0, 100);

  const description =
    question.trim();

  switch (type) {
    case "CONVERSATION":
      return {
        title:
          title || "Conversation",

        description,

        type: "CONVERSATION",

        priority: "NORMAL",

        steps: [],
      };

    case "QUESTION":
      return {
        title:
          title || "Question",

        description,

        type: "QUESTION",

        priority: "NORMAL",

        steps: [
          {
            description:
              "Search the company knowledge base for information relevant to the user's question.",

            tool: "rag",

            input: question,
          },
        ],
      };

    case "RESEARCH":
      return {
        title:
          title || "Research Task",

        description,

        type: "RESEARCH",

        priority: "NORMAL",

        steps: [
          {
            description:
              "Search the company knowledge base for relevant information.",

            tool: "rag",

            input: question,
          },

          {
            description:
              "Check recent company events and updates.",

            tool: "events",

            input: question,
          },

          {
            description:
              "Verify and combine the collected evidence.",

            input: question,
          },
        ],
      };

    case "ACTION":
      return {
        title:
          title || "Action Task",

        description,

        type: "ACTION",

        priority: "NORMAL",

        steps: [
          {
            description:
              "Understand the requested action and required parameters.",

            input: question,
          },

          {
            description:
              "Check whether user approval is required.",

            input: question,
          },

          {
            description:
              "Execute the requested action.",

            input: question,
          },

          {
            description:
              "Verify that the action completed successfully.",

            input: question,
          },
        ],
      };

    case "MULTI_STEP":
      return {
        title:
          title || "Multi-Step Task",

        description,

        type: "MULTI_STEP",

        priority: "NORMAL",

        steps: [
          {
            description:
              "Analyze the complete request.",

            input: question,
          },

          {
            description:
              "Execute the required steps in order.",

            input: question,
          },

          {
            description:
              "Verify the final result.",

            input: question,
          },
        ],
      };

    default:
      return {
        title,
        description,
        type: "QUESTION",
        priority: "NORMAL",
        steps: [
          {
            description:
              "Search the knowledge base.",

            tool: "rag",

            input: question,
          },
        ],
      };
  }
}

/**
 * Creates executable step objects
 * from an already-created task.
 */
export function createTaskSteps(
  task: AgentTask
): TaskStep[] {
  switch (task.type) {
    case "CONVERSATION":
      return [];

    case "QUESTION":
      return [
        {
          id: randomUUID(),

          order: 1,

          description:
            "Search the company knowledge base for information relevant to the user's question.",

          tool: "rag",

          status: "PENDING",

          input: task.description,
        },
      ];

    case "RESEARCH":
      return [
        {
          id: randomUUID(),

          order: 1,

          description:
            "Search the company knowledge base for relevant information.",

          tool: "rag",

          status: "PENDING",

          input: task.description,
        },

        {
          id: randomUUID(),

          order: 2,

          description:
            "Check recent company events and updates.",

          tool: "events",

          status: "PENDING",

          input: task.description,
        },

        {
          id: randomUUID(),

          order: 3,

          description:
            "Verify and combine the collected evidence.",

          status: "PENDING",

          input: task.description,
        },
      ];

    case "ACTION":
      return [
        {
          id: randomUUID(),
          order: 1,
          description:
            "Understand the requested action and required parameters.",
          status: "PENDING",
          input: task.description,
        },

        {
          id: randomUUID(),
          order: 2,
          description:
            "Check whether user approval is required.",
          status: "PENDING",
          input: task.description,
        },

        {
          id: randomUUID(),
          order: 3,
          description:
            "Execute the requested action.",
          status: "PENDING",
          input: task.description,
        },

        {
          id: randomUUID(),
          order: 4,
          description:
            "Verify that the action completed successfully.",
          status: "PENDING",
          input: task.description,
        },
      ];

    case "MULTI_STEP":
      return [
        {
          id: randomUUID(),
          order: 1,
          description:
            "Analyze the complete request.",
          status: "PENDING",
          input: task.description,
        },

        {
          id: randomUUID(),
          order: 2,
          description:
            "Execute the required steps in order.",
          status: "PENDING",
          input: task.description,
        },

        {
          id: randomUUID(),
          order: 3,
          description:
            "Verify the final result.",
          status: "PENDING",
          input: task.description,
        },
      ];

    default:
      return [];
  }
}