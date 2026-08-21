import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { chunkText } from "@/features/rag/utils/chunk-text";
import { extractPdfText } from "@/features/rag/services/extract-pdf-text";
import { storeChunks } from "@/features/rag/services/store-chunks";

export async function POST(
  req: NextRequest
) {
  try {
    const formData =
      await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return Response.json(
        {
          error: "File required",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const text =
      await extractPdfText(buffer);

    const chunks =
      chunkText(text);

    const kb =
      await prisma.knowledgeBase.findFirst();

    if (!kb) {
      return Response.json(
        {
          error:
            "Create knowledge base first",
        },
        {
          status: 400,
        }
      );
    }

    const document =
      await prisma.document.create({
        data: {
          title: file.name,
          sourceType: "PDF",
          knowledgeBaseId: kb.id,
        },
      });

    const vectors =
      await storeChunks(
        document.id,
        chunks
      );

    await prisma.documentChunk.createMany({
      data: vectors.map(
        (vector, index) => ({
          documentId: document.id,
          content: chunks[index],
          vectorId: String(
            vector.id
          ),
        })
      ),
    });

    return Response.json({
      success: true,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}