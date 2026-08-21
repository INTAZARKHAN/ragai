import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/agent";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const { message } = body;

    if (
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    const result =
  await runAgent(
    message.trim()
  );

    return NextResponse.json({
      success: true,

      data: {
        answer: result.answer,

        sources: result.sources,
      },
    });
  } catch (error) {
    console.error(
      "Chat API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while processing your question.",
      },
      {
        status: 500,
      }
    );
  }
}