export interface TextChunk {
  content: string;
  chunkIndex: number;
}

interface ChunkOptions {
  maxCharacters?: number;
  overlapCharacters?: number;
}

export function chunkText(
  text: string,
  options: ChunkOptions = {}
): TextChunk[] {
  const maxCharacters = options.maxCharacters ?? 3000;
  const overlapCharacters = options.overlapCharacters ?? 300;

  const cleanText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanText) {
    return [];
  }

  const chunks: TextChunk[] = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < cleanText.length) {
    let end = Math.min(
      start + maxCharacters,
      cleanText.length
    );

    if (end < cleanText.length) {
      const lastSpace = cleanText.lastIndexOf(" ", end);

      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    const content = cleanText
      .slice(start, end)
      .trim();

    if (content) {
      chunks.push({
        content,
        chunkIndex,
      });

      chunkIndex++;
    }

    if (end >= cleanText.length) {
      break;
    }

    start = Math.max(
      end - overlapCharacters,
      start + 1
    );
  }

  return chunks;
}