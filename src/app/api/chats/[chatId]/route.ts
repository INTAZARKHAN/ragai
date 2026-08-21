import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: {
    params: Promise<{ chatId: string }>
  }
) {
  const { chatId } = await params;

  const chat =
    await prisma.chat.findUnique({
      where: {
        id: chatId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

  return Response.json(chat);
}