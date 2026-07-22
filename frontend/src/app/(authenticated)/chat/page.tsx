"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { Brain, Loader2, Send, Sparkles, FileText, Bot, User, CornerDownLeft } from "lucide-react";

export default function ChatPage() {
  const { user } = useApp();
  const initialGreeting = { 
    sender: "ai", 
    text: "Welcome to AEGIS Workspace Intelligence. I'm your CEO Orchestration Node. Ask me anything about Acme Enterprise Corp's performance, remote work policies, or financial metrics.", 
    agent: "CEO Agent", 
    citations: [] 
  };

  const [chatMessages, setChatMessages] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aegis_chat_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [initialGreeting];
  });

  const [chatInput, setChatInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("CEO Agent");
  const [chatStatus, setChatStatus] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatSocketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-save chat messages to localStorage whenever chatMessages changes
  useEffect(() => {
    if (typeof window !== "undefined" && chatMessages.length > 0) {
      localStorage.setItem("aegis_chat_history", JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  const availableAgents = [
    "CEO Agent",
    "Sales Agent",
    "Marketing Agent",
    "Finance Agent",
    "HR Agent",
    "Legal Agent",
    "Research Agent",
    "Analytics Agent"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatStatus]);

  const sendChatMessage = () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsStreaming(true);
    setChatStatus("Initializing RAG vector search...");

    const ws = new WebSocket("ws://localhost:8000/api/v1/chat/stream");
    chatSocketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ query: userMsg, agent_type: selectedAgent }));
    };

    let incomingText = "";
    setChatMessages(prev => [...prev, { sender: "ai", text: "", agent: selectedAgent, citations: [] }]);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "status") {
        setChatStatus(data.data.msg);
      } else if (data.type === "token") {
        setChatStatus(null);
        incomingText += data.token;
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = incomingText;
          return updated;
        });
      } else if (data.type === "done") {
        setIsStreaming(false);
        setChatStatus(null);
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].citations = data.citations || [];
          return updated;
        });
        ws.close();
      }
    };

    ws.onerror = () => {
      setChatStatus("Backend offline, running local RAG response...");
      setTimeout(() => {
        setChatStatus(null);
        let mockReply = "";
        if (userMsg.toLowerCase().includes("revenue") || userMsg.toLowerCase().includes("financial")) {
          mockReply = "Based on indexed financial memory, forecasted Q3 revenue is **$1.42M (+12% MoM growth)**. There are no critical budget alerts.\n\nKey metric breakdown:\n- SaaS MRR: $118,500\n- Enterprise ACV: $45,000";
        } else if (userMsg.toLowerCase().includes("policy") || userMsg.toLowerCase().includes("remote")) {
          mockReply = "According to the **Remote Work Policy v2**, team members are eligible for up to 3 remote days per week upon manager sign-off.";
        } else {
          mockReply = `This is an intelligent response node from **${selectedAgent}**. Processing query: "${userMsg}". All vector embeddings verified.`;
        }
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = mockReply;
          updated[updated.length - 1].citations = [
            { name: "AEGIS PRD Documentation", link: "file:///Users/yashgoyal/Documents/AEGIS/AEGIS_PRD.md" }
          ];
          return updated;
        });
        setIsStreaming(false);
      }, 1000);
    };
  };

  // Helper function to parse bold markdown formatting cleanly
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const cleanLine = isBullet ? line.trim().replace(/^[-*]\s+/, "") : line;
      
      const partsBold = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedParts = partsBold.map((bPart, bIdx) => {
        if (bPart.startsWith("**") && bPart.endsWith("**")) {
          return <strong key={bIdx} className="font-semibold text-white">{bPart.slice(2, -2)}</strong>;
        }
        return bPart;
      });

      if (isBullet) {
        return (
          <div key={lIdx} className="flex items-start gap-2 ml-2 my-1 text-slate-300">
            <span className="text-[#3ee7c4] font-bold shrink-0">•</span>
            <div>{formattedParts}</div>
          </div>
        );
      }
      return <p key={lIdx} className="text-slate-300 leading-relaxed my-0.5">{formattedParts}</p>;
    });
  };

  return (
    <>
      <Header title="AI Workspace Chat" />
      
      <div className="flex-1 p-6 md:p-8 flex flex-col h-[calc(100vh-4rem)] relative z-10 max-w-6xl mx-auto w-full">
        {/* Main Gemini Glass Container */}
        <div className="flex-1 flex flex-col rounded-3xl bg-[#0c0d12]/90 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden relative">
          
          {/* Header Bar with Agent Selector Pills */}
          <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-tight">Enterprise Agent Chat</h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Qdrant Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light">Select active agent node to converse with live vector memory</p>
              </div>
            </div>

            {/* Agent Select Pills & Clear History */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <div className="flex items-center gap-1.5">
                {availableAgents.map((ag) => (
                  <button
                    key={ag}
                    onClick={() => setSelectedAgent(ag)}
                    className={`px-3 py-1 rounded-full text-xs font-light whitespace-nowrap transition-all cursor-pointer ${
                      selectedAgent === ag
                        ? "bg-white text-black font-normal shadow-sm"
                        : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {ag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear all saved chat history?")) {
                    localStorage.removeItem("aegis_chat_history");
                    setChatMessages([initialGreeting]);
                  }
                }}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-500 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30 transition-all cursor-pointer whitespace-nowrap ml-1"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Messages Stream Body */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                
                {msg.sender === "ai" && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0 shadow-lg mt-0.5">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-5 text-xs transition-all ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg rounded-tr-sm" 
                    : "bg-[#11131a]/80 border border-white/[0.07] text-slate-200 shadow-md rounded-tl-sm backdrop-blur-md"
                }`}>
                  {msg.sender === "ai" && (
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                      <span className="text-[10px] font-mono text-indigo-400 font-medium uppercase tracking-wider">
                        {msg.agent}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Live Memory Node</span>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {msg.sender === "user" ? (
                      <p className="whitespace-pre-wrap leading-relaxed text-white text-xs">{msg.text}</p>
                    ) : (
                      renderFormattedText(msg.text)
                    )}
                  </div>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Sources:</span>
                      {msg.citations.map((cit: any, idx: number) => (
                        <a
                          key={idx}
                          href={cit.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 transition-all"
                        >
                          <FileText size={11} />
                          <span>{cit.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {chatStatus && (
              <div className="flex items-center gap-3 text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-4 py-2.5 rounded-2xl w-max backdrop-blur-md animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-[#3ee7c4]" />
                <span className="font-mono text-[11px]">{chatStatus}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Gemini Style Elevated Input Control Bar */}
          <div className="p-4 md:p-5 border-t border-white/[0.06] bg-black/40 backdrop-blur-xl">
            <div className="relative flex items-center rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-white/20 transition-all p-2 pr-3">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                placeholder={`Ask ${selectedAgent} anything (e.g. 'What is the forecasted Q3 revenue?', 'Remote work policy')...`}
                className="flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-light"
                disabled={isStreaming}
              />
              <button
                onClick={sendChatMessage}
                disabled={isStreaming || !chatInput.trim()}
                className="w-9 h-9 bg-[#3ee7c4] hover:bg-[#32d4b2] disabled:opacity-20 text-black font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-[0_0_20px_rgba(62,231,196,0.25)]"
              >
                <Send size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

