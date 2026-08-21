"use client";

import { Bot } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <div className="flex items-center gap-2">
          <Bot size={24} />

          <h1 className="font-semibold">
            Company RAG Chatbot
          </h1>
        </div>
      </div>
    </header>
  );
}