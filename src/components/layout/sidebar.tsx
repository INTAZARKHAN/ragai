"use client";

import { Plus } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

export default function Sidebar() {
  const clearMessages = useChatStore(
    (state) => state.clearMessages
  );

  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950">
      <div className="p-4">
        <button
          onClick={clearMessages}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>
    </aside>
  );
}