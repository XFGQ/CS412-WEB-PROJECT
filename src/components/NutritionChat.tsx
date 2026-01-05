"use client";

import { useState } from "react";

type Message = {
    id: number;
    role: "user" | "ai";
    text: string;
};

export default function DietChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            role: "user",
            text: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("/api/mistral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                }),
            });

            const data = await response.json();

            const aiMsg: Message = {
                id: Date.now() + 1,
                role: "ai",
                text: data.text || "I couldn't answer that right now.",
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: "ai",
                    text: "An error occurred. Please try again.",
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50">
            {/* MESSAGES */}
            <div className="flex-1 p-6 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                                ? "ml-auto bg-green-600 text-white"
                                : "mr-auto bg-slate-800 text-slate-100 border border-slate-700"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}

                {isTyping && (
                    <div className="text-xs text-slate-400">AI is typing...</div>
                )}
            </div>

            {/* INPUT */}
            <div className="p-4 border-t border-slate-800 flex gap-2 bg-slate-900/60">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="What should I eat today?"
                    className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                    onClick={sendMessage}
                    className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}