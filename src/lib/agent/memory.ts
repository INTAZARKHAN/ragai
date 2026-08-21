export type MemoryItem = {
  question: string;
  answer: string;
  timestamp: number;
};

const memory: MemoryItem[] = [];

export function remember(
  question: string,
  answer: string
): void {
  const cleanQuestion = question.trim();
  const cleanAnswer = answer.trim();

  if (!cleanQuestion || !cleanAnswer) {
    return;
  }

  memory.push({
    question: cleanQuestion,
    answer: cleanAnswer,
    timestamp: Date.now(),
  });

  if (memory.length > 100) {
    memory.shift();
  }

  console.log("MEMORY SAVED:", {
    question: cleanQuestion,
    memorySize: memory.length,
  });
}

export function getMemory(): MemoryItem[] {
  return [...memory];
}

export function getRecentMemory(
  limit = 5
): MemoryItem[] {
  return memory
    .slice()
    .reverse()
    .slice(0, limit);
}

export function searchMemory(
  query: string,
  limit = 5
): MemoryItem[] {
  const q = query.toLowerCase();

  return memory
    .filter(
      (item) =>
        item.question
          .toLowerCase()
          .includes(q) ||
        item.answer
          .toLowerCase()
          .includes(q)
    )
    .slice(-limit)
    .reverse();
}

export function clearMemory(): void {
  memory.length = 0;
}