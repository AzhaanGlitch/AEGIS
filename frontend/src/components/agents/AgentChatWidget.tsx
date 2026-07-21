"use client";

import React, { useState } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

interface AgentChatWidgetProps {
  agentName: string;
  agentRole: string;
  category: string;
  onSendMessage: (message: string) => Promise<string>;
}

export const AgentChatWidget: React.FC<AgentChatWidgetProps> = ({
  agentName,
  agentRole,
  category,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      text: `Hello! I am the ${agentName} (${agentRole}). How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const responseText = await onSendMessage(userText);
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: "Error communicating with agent. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Widget Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              {agentName}
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/20">
                {category}
              </span>
            </h3>
            <p className="text-xs text-slate-400">{agentRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <Sparkles size={12} />
          <span>Groq / NVIDIA NIM Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "agent" && (
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-md"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[10px] mt-1.5 ${
                  msg.sender === "user" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 animate-pulse">
              <Bot size={16} />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
              <span>Agent processing query...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${agentName}...`}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
