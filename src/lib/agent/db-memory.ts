import { prisma } from "@/lib/prisma";

export async function saveMemory(
  question: string,
  answer: string
) {
  await prisma.agentMemory.create({
    data: {
      question,
      answer,
    },
  });
}

export async function getRecentMemory(
  limit = 10
) {
  return prisma.agentMemory.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}