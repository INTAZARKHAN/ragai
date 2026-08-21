"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Chat",
    href: "/dashboard/chat",
  },
];

export default function ChatSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-background">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          Company RAG
        </h2>

        <p className="text-sm text-muted-foreground">
          Knowledge Assistant
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-accent font-medium"
                  : "hover:bg-accent/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-5 py-4">
        <p className="text-xs text-muted-foreground">
          AI Knowledge Assistant
        </p>
      </div>
    </aside>
  );
}