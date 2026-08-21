export function buildContext(
  results: any[]
) {
  return results
    .map(
      (item) =>
        item.payload?.content
    )
    .join("\n\n");
}