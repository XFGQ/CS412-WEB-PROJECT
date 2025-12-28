// src/components/FitnessChat.tsx
"use client"; // Bu bir istemci bileşeni (etkileşim var)

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

export default function FitnessChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", text: "Merhaba! Ben Fitness asistanın. Bugün nasıl hissediyorsun? Antrenman tavsiyesi ister misin?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Kullanıcı mesajını ekle
    const userMsg: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 2. Yapay zeka cevabını simüle et (Burayı sonra gerçek API'ye bağlarız)
    setTimeout(() => {
      const aiMsg: Message = { 
        id: Date.now() + 1, 
        role: "ai", 
        text: "Harika bir hedef! Bunu veritabanına kaydetmemi ister misin yoksa yeni bir program mı hazırlayalım?" 
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-2xl bg-white shadow-lg overflow-hidden sticky top-4">
      {/* Başlık */}
      <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
        <Bot size={24} />
        <h2 className="font-bold">Fitness AI Coach</h2>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                msg.role === "user" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              {msg.role === "user" ? <User size={16} className="text-blue-600" /> : <Bot size={16} className="text-green-600" />}
            </div>
            <div
              className={`p-3 rounded-xl max-w-[80%] text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-400 ml-10">Yazıyor...</div>}
      </div>

      {/* Input Alanı */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bir şeyler sor..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
