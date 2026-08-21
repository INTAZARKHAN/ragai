import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: {
    params: Promise<{ chatId: string }>
  }
) {
  const { chatId } = await params;

  const body = await req.json();

  const message =
    await prisma.message.create({
      data: {
        chatId,
        role: body.role,
        content: body.content,
      },
    });

  return Response.json(message);
}