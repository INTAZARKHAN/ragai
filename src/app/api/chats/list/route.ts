import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json([]);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json([]);
  }

  const chats =
    await prisma.chat.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

  return Response.json(chats);
}