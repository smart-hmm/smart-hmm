"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

export default function HRMChatbotModal() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content:
                "Xin chào 👋 Tôi là trợ lý HRM. Bạn có thể hỏi về chấm công, lương, nghỉ phép, hoặc chính sách nội bộ.",
        },
    ]);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // 🔧 MOCK AI RESPONSE (replace with API call)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content:
                        "Tôi đã ghi nhận câu hỏi của bạn. HR sẽ phản hồi hoặc AI sẽ xử lý thông tin này ngay.",
                },
            ]);
        }, 600);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                type='button'
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition hover:opacity-90"
            >
                <MessageCircle className="h-6 w-6" />
            </button>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-4">
                    <div className="flex h-[520px] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-[var(--color-background)] text-[var(--color-foreground)] shadow-xl ring-1 ring-[var(--color-muted)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[var(--color-muted)] px-4 py-3">
                            <div>
                                <p className="text-sm font-semibold">HRM Assistant</p>
                                <p className="text-xs text-gray-400">Hỏi nhanh về HR</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => setOpen(false)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-background)] px-4 py-3">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === "user"
                                        ? "ml-auto bg-[var(--color-primary)] text-white"
                                        : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                                        }`}
                                >
                                    {m.content}
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
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
                                    type='button'
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
