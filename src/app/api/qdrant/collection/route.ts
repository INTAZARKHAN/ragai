import { NextResponse } from "next/server";
import {
  createKnowledgeCollection,
} from "@/lib/qdrant/collection";

export async function POST() {
  try {
    await createKnowledgeCollection();

    return NextResponse.json({
      success: true,
      collection: "company_knowledge",
      message:
        "Knowledge collection is ready.",
    });
  } catch (error) {
    console.error(
      "Collection creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create knowledge collection",
      },
      {
        status: 500,
      }
    );
  }
}