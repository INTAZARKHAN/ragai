import { prisma } from "@/lib/prisma";

export async function GET() {
  const existing =
    await prisma.knowledgeBase.findFirst();

  if (existing) {
    return Response.json(existing);
  }

  const kb =
    await prisma.knowledgeBase.create({
      data: {
        name: "Default KB",
      },
    });

  return Response.json(kb);
}