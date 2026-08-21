import { NextRequest, NextResponse } from "next/server";
import { runRAG } from "@/lib/rag/pipeline";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const { question } = body;

    if (
      !question ||
      typeof question !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Question is required",
        },
        {
          status: 400,
        }
      );
    }

    const result = await runRAG(
      question.trim()
    );

    return NextResponse.json({
      success: true,
      question,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    console.error(
      "RAG context error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process RAG request",
      },
      {
        status: 500,
      }
    );
  }
}