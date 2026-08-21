export type MessageRole = "user" | "assistant";

export interface MessageSource {
  documentName: string;
  pageNumber?: number;
  score: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  sources?: MessageSource[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}