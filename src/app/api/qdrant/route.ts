import { NextResponse } from "next/server";
import { qdrant } from "@/lib/qdrant/client";

export async function GET() {
  try {
    const collections = await qdrant.getCollections();

    return NextResponse.json({
      success: true,
      message: "Qdrant connection successful",
      collections: collections.collections.map(
        (collection) => collection.name
      ),
    });
  } catch (error) {
    console.error("Qdrant connection error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Qdrant connection failed",
      },
      {
        status: 500,
      }
    );
  }
}