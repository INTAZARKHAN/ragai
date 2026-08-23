import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import { parseTextFile } from "../src/lib/documents/parser";
import { chunkText } from "../src/lib/rag/chunker";
import { embeddingProvider } from "../src/lib/embeddings";
import { getQdrantClient } from "../src/lib/qdrant/client";
import { COLLECTION_NAME } from "../src/lib/qdrant/collection";
const qdrant = getQdrantClient();

if (!qdrant) {
  throw new Error("Qdrant unavailable");
}

const DOCUMENTS_DIR = path.join(
  process.cwd(),
  "documents"
);

async function main() {
  console.log("");
  console.log("================================");
  console.log("   COMPANY RAG DOCUMENT INGEST");
  console.log("================================");
  console.log("");

  const files = await fs.readdir(
    DOCUMENTS_DIR
  );

  const textFiles = files.filter((file) =>
    file.toLowerCase().endsWith(".txt")
  );

  if (textFiles.length === 0) {
    console.log("No TXT documents found.");
    console.log("");
    console.log(
      `Add TXT files to: ${DOCUMENTS_DIR}`
    );
    console.log("");
    return;
  }

  console.log(
    `Found ${textFiles.length} TXT document(s).`
  );

  console.log("");

  for (const file of textFiles) {
    const filePath = path.join(
      DOCUMENTS_DIR,
      file
    );

    console.log(`Processing: ${file}`);

    // -----------------------------
    // 1. Read Text File
    // -----------------------------

    console.log("Reading text file...");

    const parsed =
      await parseTextFile(filePath);

    console.log(
      `Extracted ${parsed.text.length} characters.`
    );

    // -----------------------------
    // 2. Create Chunks
    // -----------------------------

    console.log("Creating chunks...");

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
    // 3. Create New Version
    // -----------------------------

    const version = Date.now();

    console.log(
      `New version: ${version}`
    );

    // -----------------------------
    // 4. Find Previous Active Version
    // -----------------------------

    console.log(
      "Checking for previous active version..."
    );

    const existingResults =
      await qdrant.scroll(
        COLLECTION_NAME,
        {
          limit: 1000,

          with_payload: true,

          with_vector: false,
        }
      );

    const existingActivePoints =
      existingResults.points.filter(
        (point) => {
          const payload =
            point.payload ?? {};

          return (
            payload.documentName ===
              parsed.fileName &&
            payload.isActive === true
          );
        }
      );

    // -----------------------------
    // 5. Disable Previous Version
    // -----------------------------

    if (
      existingActivePoints.length > 0
    ) {
      console.log(
        `Found ${existingActivePoints.length} active chunk(s).`
      );

      await qdrant.setPayload(
        COLLECTION_NAME,
        {
          payload: {
            isActive: false,
          },

          points:
            existingActivePoints.map(
              (point) => point.id
            ),

          wait: true,
        }
      );

      console.log(
        "Previous version disabled."
      );
    } else {
      console.log(
        "No previous active version found."
      );
    }

    // -----------------------------
    // 6. Create Embeddings
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

          version,

          isActive: true,

          uploadedAt:
            new Date().toISOString(),
        },
      });

      console.log(
        `Embedding ${i + 1}/${chunks.length}`
      );
    }

    // -----------------------------
    // 7. Upload New Version
    // -----------------------------

    console.log(
      "Uploading new version to Qdrant..."
    );

    await qdrant.upsert(
      COLLECTION_NAME,
      {
        wait: true,
        points,
      }
    );

    console.log("");

    console.log(
      `✓ ${file} successfully ingested.`
    );

    console.log(
      `✓ Version ${version} is ACTIVE.`
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
}

main().catch((error) => {
  console.error("");
  console.error(
    "Document ingestion failed:"
  );
  console.error(error);
  process.exit(1);
});