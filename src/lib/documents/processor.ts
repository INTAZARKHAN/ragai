import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import { parseTextFile } from "./parser";
import { chunkText } from "./chunker";
import { embeddingProvider } from "../embeddings";
import { getQdrantClient } from "../qdrant/client";
import { COLLECTION_NAME } from "../qdrant/collection";

const DOCUMENTS_DIR = path.join(
  process.cwd(),
  "documents"
);

export async function ingestDocuments() {
  console.log("");
  console.log("================================");
  console.log("   COMPANY RAG DOCUMENT INGEST");
  console.log("================================");
  console.log("");

  const qdrant = getQdrantClient();

  if (!qdrant) {
    throw new Error(
      "Qdrant client unavailable. Check QDRANT_URL and QDRANT_API_KEY."
    );
  }

  const files = await fs.readdir(
    DOCUMENTS_DIR
  );

  const textFiles = files.filter((file) =>
    file.toLowerCase().endsWith(".txt")
  );

  if (textFiles.length === 0) {
    console.log(
      "No TXT documents found."
    );

    return {
      success: true,
      documents: 0,
      chunks: 0,
    };
  }

  let totalChunks = 0;

  console.log(
    `Found ${textFiles.length} TXT document(s).`
  );

  console.log("");

  for (const file of textFiles) {
    const filePath = path.join(
      DOCUMENTS_DIR,
      file
    );

    console.log(
      `Processing: ${file}`
    );

    // -----------------------------
    // 1. Read Text File
    // -----------------------------

    console.log(
      "Reading text file..."
    );

    const parsed =
      await parseTextFile(filePath);

    console.log(
      `Extracted ${parsed.text.length} characters.`
    );

    // -----------------------------
    // 2. Create Chunks
    // -----------------------------

    console.log(
      "Creating chunks..."
    );

    const chunks = chunkText(
      parsed.text
    );

    console.log(
      `Created ${chunks.length} chunks.`
    );

    if (chunks.length === 0) {
      console.log(
        "No text chunks found. Skipping document."
      );

      continue;
    }

    // -----------------------------
    // 3. Create Embeddings
    // -----------------------------

    console.log(
      "Creating embeddings..."
    );

    const points = [];

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      const chunk = chunks[i];

      console.log(
        `Embedding ${i + 1}/${chunks.length}`
      );

      const vector =
        await embeddingProvider.embed(
          chunk.content
        );

      points.push({
        id: crypto.randomUUID(),

        vector,

        payload: {
          content: chunk.content,

          documentName:
            parsed.fileName,

          chunkIndex:
            chunk.chunkIndex,
        },
      });
    }

    // -----------------------------
    // 4. Upload To Qdrant
    // -----------------------------

    console.log(
      "Uploading vectors to Qdrant..."
    );

    await qdrant.upsert(
      COLLECTION_NAME,
      {
        wait: true,
        points,
      }
    );

    totalChunks += chunks.length;

    console.log("");

    console.log(
      `✓ ${file} successfully ingested.`
    );

    console.log("");
  }

  console.log(
    "================================"
  );

  console.log(
    "   INGESTION COMPLETED"
  );

  console.log(
    "================================"
  );

  console.log("");

  return {
    success: true,
    documents: textFiles.length,
    chunks: totalChunks,
  };
}