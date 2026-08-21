import { NextResponse } from "next/server";
import { ingestDocuments } from "@/lib/documents/processor";

export async function POST() {
  try {
    const result = await ingestDocuments();

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Document ingestion failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Document ingestion failed",
      },
      {
        status: 500,
      }
    );
  }
}