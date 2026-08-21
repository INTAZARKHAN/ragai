import { FileText } from "lucide-react";

interface MessageSource {
  documentName: string;
  pageNumber?: number;
  score: number;
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: MessageSource[];
}

export default function MessageBubble({
  role,
  content,
  sources = [],
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-slate-700 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-7">
          {content}
        </div>

        {!isUser && sources.length > 0 && (
          <div className="mt-5 border-t border-slate-700 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Sources
            </p>

            <div className="space-y-2">
              {sources.map(
                (source, index) => (
                  <div
                    key={`${source.documentName}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2"
                  >
                    <FileText
                      size={16}
                      className="shrink-0 text-slate-400"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-200">
                        {source.documentName}
                      </p>

                      {source.pageNumber && (
                        <p className="text-xs text-slate-500">
                          Page{" "}
                          {source.pageNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}