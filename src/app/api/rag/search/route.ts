import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required",
        },
        {
          status: 400,
        }
      );
    }

    const results =
      await retrieveRelevantChunks(query, 5);

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error) {
    console.error("RAG search error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
      },
      {
        status: 500,
      }
    );
  }
}