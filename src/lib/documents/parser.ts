import fs from "node:fs/promises";
import path from "node:path";

export interface ParsedTextFile {
  text: string;
  fileName: string;
}

export async function parseTextFile(
  filePath: string
): Promise<ParsedTextFile> {
  try {
    const text = await fs.readFile(
      filePath,
      "utf-8"
    );

    return {
      text: text.trim(),
      fileName: path.basename(filePath),
    };
  } catch (error) {
    console.error(
      `Failed to read text file: ${filePath}`,
      error
    );

    throw new Error(
      `Unable to read document: ${path.basename(filePath)}`
    );
  }
}