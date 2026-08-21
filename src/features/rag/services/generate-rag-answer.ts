import { openai } from "@/lib/openai";

export async function generateRagAnswer(
  context: string,
  question: string
) {
  const response =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
You are a RAG assistant.

Only answer using the provided context.

If the answer is not in the context,
say:

"I could not find this information in the knowledge base."
`,
        },

        {
          role: "user",
          content: `
Context:

${context}

Question:

${question}
`,
        },
      ],
    });

  return (
    response.choices[0]
      ?.message?.content ?? ""
  );
}