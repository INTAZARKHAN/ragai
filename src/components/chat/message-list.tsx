"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chat-store";
import MessageBubble from "./message-bubble";

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white">
            How can I help today?
          </h1>

          <p className="mt-4 text-slate-400">
            Ask anything about your company knowledge base
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

      <div ref={bottomRef} />
    </div>
  );
}