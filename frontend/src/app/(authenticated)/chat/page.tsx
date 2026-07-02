"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { Brain, Loader2, Send } from "lucide-react";

export default function ChatPage() {
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "ai", text: "Welcome to AEGIS. I'm your CEO Agent orchestration node. Ask me anything about Acme Enterprise Corp's performance, remote policies, or financial reports.", agent: "CEO Agent", citations: [] }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("CEO Agent");
  const [chatStatus, setChatStatus] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatSocketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatStatus]);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsStreaming(true);
    setChatStatus("Initializing...");

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
      setChatStatus("Backend offline, running local mock response...");
      setTimeout(() => {
        setChatStatus(null);
        let mockReply = "";
        if (userMsg.toLowerCase().includes("revenue") || userMsg.toLowerCase().includes("financial")) {
          mockReply = "Based on local memory, forecasted Q3 revenue is $1.42M (+12% increase). There are no high-risk budget alerts. Sources: [AEGIS_PRD.md:L97-105](file:///Users/yashgoyal/Documents/AEGIS/AEGIS_PRD.md#L97-L105).";
        } else if (userMsg.toLowerCase().includes("policy") || userMsg.toLowerCase().includes("remote")) {
          mockReply = "According to the Remote Work Policy handbook, team members are eligible for up to 3 remote days per week. Sources: [Remote_Work_Policy_v2.pdf](file:///Users/yashgoyal/Documents/AEGIS/extracted_text.txt#L152-L158).";
        } else {
          mockReply = `This is a mock response from the ${selectedAgent} (offline fallback). Your query: "${userMsg}".`;
        }
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = mockReply;
          updated[updated.length - 1].citations = [
            { name: "AEGIS PRD", link: "file:///Users/yashgoyal/Documents/AEGIS/AEGIS_PRD.md" }
          ];
          return updated;
        });
        setIsStreaming(false);
      }, 1200);
    };
  };

  return (
    <>
      <Header title="AI Workspace Chat" />
      
      <div className="flex-1 p-8 flex flex-col h-[calc(100vh-4rem)] relative z-10">
        <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden relative">
          
          {/* Chat options */}
          <div className="p-4 bg-charcoal/50 border-b border-slate-edge flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-electric-iris" />
              <span className="text-sm font-semibold">Active Agent Node:</span>
              <select
                value={selectedAgent}
                onChange={e => setSelectedAgent(e.target.value)}
                className="bg-void border border-slate-edge text-xs rounded px-2 py-1 focus:outline-none"
              >
                <option value="CEO Agent">CEO Agent (Strategic Router)</option>
                <option value="Sales Agent">Sales Agent</option>
                <option value="Marketing Agent">Marketing Agent</option>
                <option value="Finance Agent">Finance Agent</option>
                <option value="HR Agent">HR Agent</option>
                <option value="Legal Agent">Legal Agent</option>
                <option value="Research Agent">Research Agent</option>
                <option value="Analytics Agent">Analytics Agent</option>
              </select>
            </div>

            <div className="text-xs text-smoke font-medium">
              RAG Database: <span className="text-emerald-400 font-semibold">Qdrant Ingest Active</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-electric-iris/20 border border-electric-iris/30 flex items-center justify-center font-bold text-xs text-electric-iris uppercase shrink-0">
                    {msg.agent[0]}
                  </div>
                )}

                <div className={`max-w-xl rounded-2xl px-5 py-3 text-sm ${
                  msg.sender === "user" ? "bg-electric-iris text-white" : "bg-charcoal border border-slate-edge"
                }`}>
                  {msg.sender === "ai" && (
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-smoke mb-1">{msg.agent}</div>
                  )}
                  
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-edge/50 flex flex-wrap gap-2">
                      <span className="text-[10px] text-smoke">Sources:</span>
                      {msg.citations.map((cit: any, idx: number) => (
                        <a
                          key={idx}
                          href={cit.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-electric-iris hover:underline bg-electric-iris/10 px-2 py-0.5 rounded border border-electric-iris/20"
                        >
                          {cit.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatStatus && (
              <div className="flex items-center gap-3 text-xs text-smoke bg-charcoal/40 border border-slate-edge/50 px-4 py-2.5 rounded-full w-max">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-iris" />
                <span>{chatStatus}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <div className="p-4 border-t border-slate-edge bg-void">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                placeholder="Ask anything (e.g. 'What's the forecast for Q3?', 'What is our remote work policy?')"
                className="flex-1 bg-charcoal border border-slate-edge rounded-full px-5 py-3 text-sm placeholder-smoke focus:outline-none focus:border-electric-iris"
              />
              <button
                onClick={sendChatMessage}
                className="p-3 bg-electric-iris hover:bg-opacity-90 rounded-full text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
