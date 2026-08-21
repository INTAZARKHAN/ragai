export interface TextChunk {
  content: string;
  chunkIndex: number;
}

export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): TextChunk[] {
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanedText) {
    return [];
  }

  const chunks: TextChunk[] = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < cleanedText.length) {
    let end = Math.min(
      start + chunkSize,
      cleanedText.length
    );

    // Try to end at a sentence/word boundary
    if (end < cleanedText.length) {
      const lastPeriod =
        cleanedText.lastIndexOf(".", end);

      const lastNewLine =
        cleanedText.lastIndexOf("\n", end);

      const lastSpace =
        cleanedText.lastIndexOf(" ", end);

      const boundary = Math.max(
        lastPeriod,
        lastNewLine,
        lastSpace
      );

      if (boundary > start + chunkSize * 0.5) {
        end = boundary + 1;
      }
    }

    const content = cleanedText
      .slice(start, end)
      .trim();

    if (content) {
      chunks.push({
        content,
        chunkIndex,
      });

      chunkIndex++;
    }

    if (end >= cleanedText.length) {
      break;
    }

    start = Math.max(
      end - overlap,
      start + 1
    );
  }

  return chunks;
}