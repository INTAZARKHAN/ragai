"use client";

import { useChatStore } from "@/store/chat-store";
import MessageBubble from "./message-bubble";

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            How can I help you today?
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Ask anything about your company documents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  );
}