import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title: "New Chat",
    },
  });

  return Response.json(chat);
}