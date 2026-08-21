"use client";

import type { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({
  children,
}: ChatLayoutProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden">
      {children}
    </div>
  );
}