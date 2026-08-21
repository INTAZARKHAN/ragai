"use client";

import { useEffect, useState } from "react";

export interface ChatMessage {
  id: string;
  role: string;
  content: string;
}

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<
    ChatMessage[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadChat() {
      const res = await fetch(
        `/api/chats/${chatId}`
      );

      const data = await res.json();

      setMessages(
        data.messages || []
      );

      setLoading(false);
    }

    loadChat();
  }, [chatId]);

  return {
    messages,
    setMessages,
    loading,
  };
}