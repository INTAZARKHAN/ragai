import MessageList from "./message-list";
import ChatInput from "./chat-input";

export default function ChatWindow() {
  return (
    <div className="flex h-full flex-1 flex-col bg-slate-900">
      <div className="flex flex-1 overflow-y-auto">
        <MessageList />
      </div>

      <ChatInput />
    </div>
  );
}