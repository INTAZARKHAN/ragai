import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "RAG AI backend is running",
    timestamp: new Date().toISOString(),
  });
}