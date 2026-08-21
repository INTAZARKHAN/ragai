"use client";

import { create } from "zustand";
import { Message } from "@/types/chat";

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore =
  create<ChatStore>((set) => ({
    messages: [],

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    clearMessages: () =>
      set({
        messages: [],
      }),
  }));