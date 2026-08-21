import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company RAG Chatbot",
  description: "Internal Knowledge Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}