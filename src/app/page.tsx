import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Sidebar from "@/components/layout/sidebar";
import ChatWindow from "@/components/chat/chat-window";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex flex-1 bg-slate-900">
          <ChatWindow />
        </main>
      </div>

      <Footer />
    </div>
  );
}