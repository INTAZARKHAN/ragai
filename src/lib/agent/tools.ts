import { runRAG } from "@/lib/rag/pipeline";

import {
  getCompanyEvents,
} from "./company-events";

import {
  memoryTool,
} from "./memory-tool";

import {
  AgentResult,
} from "./types";

interface CompanyEvent {
  title: string;
  description: string;
  date: string;
}

export async function ragTool(
  question: string
): Promise<AgentResult> {
  const result =
    await runRAG(question);

  return {
    answer: result.answer,
    sources: result.sources,
    tool: "rag",
    confidence:
      result.sources?.length > 0
        ? "high"
        : "low",
  };
}

export async function memoryAgentTool(
  question: string
): Promise<AgentResult> {
  return memoryTool(question);
}

export async function calculatorTool(
  expression: string
): Promise<AgentResult> {
  try {
    const result = Function(
      `"use strict"; return (${expression})`
    )();

    if (
      typeof result !== "number" ||
      !Number.isFinite(result)
    ) {
      return {
        answer:
          "Invalid calculation.",
        sources: [],
        tool: "calculator",
        confidence: "low",
      };
    }

    return {
      answer: String(result),
      sources: [],
      tool: "calculator",
      confidence: "high",
    };
  } catch {
    return {
      answer:
        "Invalid calculation.",
      sources: [],
      tool: "calculator",
      confidence: "low",
    };
  }
}

export async function companyEventsTool(
  question: string
): Promise<AgentResult> {
  const events: CompanyEvent[] =
    await getCompanyEvents();

  if (events.length === 0) {
    return {
      answer:
        "No recent company events or updates were found.",
      sources: [],
      tool: "events",
      confidence: "low",
    };
  }

  const query =
    question.toLowerCase();

  const queryWords =
    query
      .split(/\s+/)
      .filter(
        (word: string) =>
          word.length > 2
      );

  const scoredEvents =
    events.map(
      (event: CompanyEvent) => {
        const text =
          `${event.title} ${event.description}`
            .toLowerCase();

        let score = 0;

        for (
          const word of queryWords
        ) {
          if (
            text.includes(word)
          ) {
            score++;
          }
        }

        return {
          event,
          score,
        };
      }
    );

  scoredEvents.sort(
    (a, b) => {
      if (
        b.score !== a.score
      ) {
        return (
          b.score - a.score
        );
      }

      return (
        new Date(
          b.event.date
        ).getTime() -
        new Date(
          a.event.date
        ).getTime()
      );
    }
  );

  const best =
    scoredEvents.filter(
      (item) =>
        item.score > 0
    );

  if (
    best.length === 0
  ) {
    return {
      answer:
        "I couldn't find a company event or update matching your question.",
      sources: [],
      tool: "events",
      confidence: "low",
    };
  }

  const answer =
    best
      .slice(0, 5)
      .map(
        ({ event }) =>
          `${event.title}\n${event.description}\nDate: ${event.date}`
      )
      .join("\n\n");

  return {
    answer,
    sources: [],
    tool: "events",
    confidence: "high",
  };
}