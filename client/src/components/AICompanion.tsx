import { Bot, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function AICompanion() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: isFaculty
        ? `Hello ${user?.explorer_name || "Faculty"}! I can help you create missions, quiz questions, answer options, explanations, difficulty levels, and XP suggestions.`
        : `Hello ${user?.explorer_name || "Explorer"}! Your AI Companion is online. Ask me about HTML, CSS, JavaScript, databases, or cybersecurity!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const history = messages.map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));
      const res = await api.post("/ai/chat", { message: userText, history });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      const message = axiosErrorMessage(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl flex flex-col h-[400px]">
      <div className="mb-4 flex items-center gap-3 border-b border-cyan-500/10 pb-3">
        <div className="rounded-full bg-cyan-500 p-2.5">
          <Bot size={22} className="text-black" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Archie AI</h2>
          <p className="text-[10px] text-green-400 font-mono">Online // Core.Link.Established</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none"
                  : "bg-[#091625] text-gray-300 border border-slate-800/80 rounded-tl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-none p-3.5 text-xs bg-[#091625] text-cyan-400 border border-cyan-500/20 animate-pulse font-mono">
              Archie is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2 pt-3 border-t border-cyan-500/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask Archie..."
          className="flex-1 rounded-xl bg-[#091625] border border-slate-800 px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500/50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-cyan-400 p-2.5 text-black transition hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 cursor-pointer flex items-center justify-center"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function axiosErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === "string" && backendMessage.length > 0) {
      return `⚠️ ${backendMessage}`;
    }
  }
  return "⚠️ System connection anomaly. Could not reach AI Core.";
}