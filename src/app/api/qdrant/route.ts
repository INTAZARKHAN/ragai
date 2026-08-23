import { NextResponse } from "next/server";

import { getQdrantClient } from "@/lib/qdrant/client";

export async function GET() {
  try {
    const qdrant = getQdrantClient();

    if (!qdrant) {
      return NextResponse.json(
        {
          success: false,
          error: "Qdrant is not configured",
        },
        {
          status: 500,
        }
      );
    }

    const collections =
      await qdrant.getCollections();

    return NextResponse.json({
      success: true,

      message:
        "Qdrant connection successful",

      collections:
        collections.collections.map(
          (collection) =>
            collection.name
        ),
    });
  } catch (error) {
    console.error(
      "Qdrant connection error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Qdrant connection failed",
      },
      {
        status: 500,
      }
    );
  }
}