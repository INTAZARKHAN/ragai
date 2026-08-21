import ChatSidebar from "./chat-sidebar";

export default function ChatLayout() {
  return (
    <div className="flex h-[calc(100vh-0px)] w-full overflow-hidden bg-background">
      <ChatSidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Company RAG Chat
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Ask questions about company knowledge.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}