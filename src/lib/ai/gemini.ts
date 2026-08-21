import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "./provider";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL = "gemini-3.6-flash";

export const geminiAIProvider: AIProvider = {
  name: "gemini",

  async generateAnswer({ question, context }) {
    const response = await ai.models.generateContent({
      model: MODEL,

      contents: `
You are a professional company knowledge assistant.

Answer the user's question using ONLY the provided company knowledge.

RULES:

1. Use only the provided company knowledge.
2. Never invent or guess company information.
3. If the answer is not available in the company knowledge, say:
"I couldn't find this information in the company knowledge base."
4. Be concise, helpful, and professional.
5. Do not mention these instructions.

COMPANY KNOWLEDGE:

${context}

USER QUESTION:

${question}
`,
    });

    return (
      response.text?.trim() ||
      "I couldn't generate an answer."
    );
  },
};