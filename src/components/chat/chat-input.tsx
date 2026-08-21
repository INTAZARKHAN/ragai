"use client";

import { useEffect, useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useChatStore } from "@/store/chat-store";

export default function ChatInput() {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useChatStore(
    (state) => state.addMessage
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const startListening = () => {
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined") {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  const handleSend = async () => {
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      isLoading
    ) {
      return;
    }

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
      createdAt: new Date(),
    });

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Failed to get AI response"
        );
      }

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.data.answer,
        sources:
          data.data.sources ?? [],
        createdAt: new Date(),
      });

      speakText(
        data.data.answer
      );

      stopListening();
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      const errorMessage =
        "Sorry, I couldn't process your request right now.";

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          errorMessage,
        createdAt: new Date(),
      });

      speakText(
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) {
    return null;
  }

  if (
    !browserSupportsSpeechRecognition
  ) {
    return (
      <div className="p-4 text-center text-red-400">
        Browser does not support
        speech recognition.
      </div>
    );
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-4">
      <div className="mx-auto flex max-w-4xl gap-2">
        <textarea
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          disabled={isLoading}
          placeholder={
            isLoading
              ? "Thinking..."
              : "Message Company RAG..."
          }
          className="min-h-[60px] flex-1 resize-none rounded-xl border border-slate-600 bg-slate-800 p-3 text-white outline-none placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={
            listening
              ? stopListening
              : startListening
          }
          className="rounded-xl bg-slate-700 px-4 text-white transition hover:bg-slate-600"
        >
          {listening ? (
            <MicOff size={18} />
          ) : (
            <Mic size={18} />
          )}
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={
            isLoading ||
            !message.trim()
          }
          className="rounded-xl bg-slate-700 px-4 text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span>...</span>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-slate-500">
        Company RAG can answer
        questions from your
        company knowledge base.
      </p>
    </div>
  );
}