import { NextRequest, NextResponse } from "next/server";
import { embeddingProvider } from "@/lib/embeddings";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Text is required",
        },
        {
          status: 400,
        }
      );
    }

    const vector = await embeddingProvider.embed(text);

    return NextResponse.json({
      success: true,
      provider: embeddingProvider.name,
      dimensions: vector.length,
      vectorPreview: vector.slice(0, 5),
    });
  } catch (error) {
    console.error("Embedding error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Embedding generation failed",
      },
      {
        status: 500,
      }
    );
  }
}