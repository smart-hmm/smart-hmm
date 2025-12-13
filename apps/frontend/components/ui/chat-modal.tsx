"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import useAsk from "@/services/react-query/mutations/use-ask";
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
    </div>
  );
}

export default function HRMChatbotModal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { mutateAsync: ask, isPending: isAsking } = useAsk();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Xin chào. Tôi là trợ lý HRM. Bạn có thể hỏi về chấm công, lương, nghỉ phép, hoặc chính sách nội bộ.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const question = input.trim();
    setInput("");

    const typingId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: question,
      },
      {
        id: typingId,
        role: "assistant",
        content: "",
        typing: true,
      },
    ]);

    try {
      const res = await ask({ question });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId ? { ...m, content: res.answer, typing: false } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                content: "Có lỗi xảy ra. Vui lòng thử lại sau.",
                typing: false,
              }
            : m
        )
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition hover:opacity-90"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div
          onClick={(e) => {
            if (e.target !== e.currentTarget) return;
            setOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-4"
        >
          <div className="flex h-[520px] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-[var(--color-background)] text-[var(--color-foreground)] shadow-xl ring-1 ring-[var(--color-muted)]">
            <div className="flex items-center justify-between border-b border-[var(--color-muted)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold">HRM Assistant</p>
                <p className="text-xs text-gray-400">Hỏi nhanh về HR</p>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-background)] px-4 py-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                  }`}
                >
                  {m.typing ? <TypingDots /> : m.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-[var(--color-muted)] bg-[var(--color-background)] p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Hỏi về nghỉ phép, lương, chấm công..."
                  className="flex-1 rounded-lg border border-[var(--color-muted)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-lg bg-[var(--color-primary)] p-2 text-white transition hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
