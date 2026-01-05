// src/components/FitnessChat.tsx
"use client";

import { useState } from "react";
import { Bot } from "lucide-react";

type Message = {
    id: number;
    role: "ai";
    text: string;
};

type FitnessChatProps = {
    mode: string;
};

export default function FitnessChat({ mode }: FitnessChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasEvaluated, setHasEvaluated] = useState(false);

    const handleEvaluate = async () => {
        if (!mode || hasEvaluated) return;

        setIsTyping(true);

        try {
            const response = await fetch("/api/mistral", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: mode,
                }),
            });

            const data = await response.json();

            const aiMsg: Message = {
                id: Date.now(),
                role: "ai",
                text: data.text || "Could not retrieve evaluation.",
            };

            setMessages([aiMsg]);
            setHasEvaluated(true);
        } catch (error) {
            setMessages([
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
        <div className="flex flex-col h-full border border-gray-200 rounded-2xl bg-white shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
                <Bot size={24} />
                <h2 className="font-bold">AI Fitness Evaluation</h2>
            </div>
 
            {/* Content */}
            <div className="flex-1 p-4 bg-gray-50">
                {!hasEvaluated && (
                    <button
                        onClick={handleEvaluate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Evaluate
                    </button>
                )}

                {isTyping && (
                    <div className="mt-4 text-sm text-gray-400">Evaluating...</div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="mt-4 p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800"
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
        </div>
    );
}