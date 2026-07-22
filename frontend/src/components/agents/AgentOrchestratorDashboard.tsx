"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
  Bot,
  Zap,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { AgentChatWidget } from "./AgentChatWidget";
import { AgentDataTable } from "./AgentDataTable";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

interface AgentMetadata {
  agent_id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  preferred_model_tier: string;
}

const SAMPLE_PROMPTS: Record<string, string> = {
  architect: "Design a high-throughput microservices architecture for real-time stock trading with WebSockets and Redis.",
  code_reviewer: "Audit this Python code for security issues and memory leaks: \ndef process(data): return eval(data)",
  coder: "Write a TypeScript function that implements LRU cache with O(1) time complexity.",
  debugger: "Diagnose this error: KeyError: 'user_id' in auth_middleware.py line 42 when processing JWT payload.",
  devops: "Generate a multi-stage Dockerfile and GitHub Actions workflow for a Next.js frontend with production caching.",
  test_engineer: "Generate PyTest unit tests with edge cases for a user registration function including password hashing.",
  ops: "Create Grafana alert thresholds and an incident response runbook for HTTP 504 Gateway Timeouts exceeding 5%.",
  langchain_reviewer: "Audit this LangChain RetrievalQA pipeline for token efficiency and memory retention bottlenecks.",
  hello_world: "Run a sub-second ping test to check provider latency and API connection health.",
  orchestrator: "Classify this task and route it to the best agent: 'Build a lead qualification script for our B2B sales team.'",
  planner: "Create a 4-week Agile sprint roadmap with epics and user stories for launching an AI analytics dashboard.",
  meeting_assistant: "Summarize these meeting notes and extract action items: 'Discussed Q3 budget, Sarah will update spreadsheet by Friday.'",
  customer_support: "Draft an empathetic response to a user complaining about a 10-minute API downtime during maintenance.",
  sales_assistant: "Draft a personalized 3-touch cold email outreach sequence for selling enterprise AI software to CTOs.",
  hr_recruiter: "Generate a Senior Full-Stack Engineer job description and 5 interview screening questions for React and Python.",
  legal: "Review this NDA clause for potential liability risks: 'Recipient shall indemnify Disclosing Party for all indirect damages.'",
  marketing: "Create a 1-week LinkedIn campaign strategy with 3 post copy variations for an AI developer tool launch.",
  finance: "Analyze this monthly budget summary and highlight anomalies: Revenue $150k, Server Costs $45k (vs $12k avg).",
  doc_writer: "Write a comprehensive Markdown README and API documentation for a FastAPI authentication endpoint.",
  writer: "Write an engaging 500-word blog article explaining the benefits of multi-agent LLM orchestration for enterprise.",
  email_assistant: "Draft an executive follow-up email to stakeholders summarizing the success of our multi-agent architecture release.",
  translator: "Translate this technical release note into Spanish and French preserving developer terminology: 'Zero-downtime deployment completed.'",
  travel_planner: "Build a 3-day business travel itinerary for Tokyo including budget breakdown, hotels near Shibuya, and transit tips.",
  health_tracker: "Create a 7-day high-protein meal plan and workout routine for an engineer working 8 hours at a desk.",
  home_automation: "Write a Home Assistant YAML automation script that turns on office lights at 8 AM and sets temperature to 72°F.",
  analyzer: "Deconstruct this dataset of customer feedback to extract core skill requirements for automated support routing.",
  comparator: "Compare the pros and cons of Groq Llama 3.3 vs NVIDIA NIM Llama 3.1 for low-latency coding tasks.",
  grader: "Evaluate this code sample against a strict quality rubric (0-100) and provide refactoring suggestions."
};

export const AgentOrchestratorDashboard: React.FC = () => {
  const { user } = useApp();
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<AgentMetadata | null>(null);
  const [showRegistry, setShowRegistry] = useState<boolean>(false);
  
  const [promptInput, setPromptInput] = useState<string>("");
  const [orchestrating, setOrchestrating] = useState<boolean>(false);
  const [orchestratorResult, setOrchestratorResult] = useState<any>(null);

  // Extract first name or display name dynamically
  const userName = user?.name ? user.name.split(" ")[0] : "Operator";

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/agents/");
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (e) {
      console.error("Failed to load agents list:", e);
    }
  };

  const [userHistory, setUserHistory] = useState<Array<{ id: string; query: string; timestamp: string }>>([]);

  // User-specific chat history storage key
  const storageKey = useMemo(() => {
    return user?.email ? `aegis_prompts_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "aegis_prompts_guest";
  }, [user]);

  // Load history on mount or user change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setUserHistory(JSON.parse(saved));
        } catch (e) {}
      } else {
        setUserHistory([]);
      }
    }
  }, [storageKey]);

  const [processingStep, setProcessingStep] = useState<string>("");

  const handleOrchestrate = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const query = promptOverride || promptInput;
    if (!query.trim() || orchestrating) return;

    // Save prompt to user-specific history
    const newEntry = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setUserHistory(prev => {
      const updated = [newEntry, ...prev.filter(item => item.query !== query.trim())].slice(0, 15);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    setOrchestrating(true);
    setOrchestratorResult(null);

    const steps = [
      "Analyzing query",
      "Classifying intent",
      selectedAgent ? `Assigning ${selectedAgent.name}` : "Selecting specialized agents",
      "Generating solution"
    ];

    let sIdx = 0;
    setProcessingStep(steps[0]);
    const stepInterval = setInterval(() => {
      sIdx++;
      if (sIdx < steps.length) {
        setProcessingStep(steps[sIdx]);
      }
    }, 700);

    try {
      const res = await fetch("http://localhost:8000/api/v1/agents/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: query,
          target_agent_id: selectedAgent?.agent_id || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrchestratorResult(data);
      }
    } catch (e) {
      console.error("Orchestration error:", e);
    } finally {
      clearInterval(stepInterval);
      setOrchestrating(false);
      setProcessingStep("");
    }
  };

  const categories = ["All", "Core Engineering", "Planning & Management", "Business & Support", "Specialized / Utility"];

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Active chat item for macOS style center window modal popup
  const [activeModalChat, setActiveModalChat] = useState<{ id: string; query: string; timestamp: string } | null>(null);

  // Separate recent 2 chats and remaining older history lines
  const recentChats = userHistory.slice(0, 2);
  const olderHistoryLines = userHistory.slice(2);

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 font-sans flex flex-col items-center justify-center min-h-[75vh] relative">
      
      {/* 1. RIGHT SIDEBAR: 2 Recent Chat Cards + History Lines */}
      <div className="fixed right-6 top-28 w-64 hidden xl:flex flex-col space-y-4 z-40">
        
        {/* Top Header Label */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            Recent Activity
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {userHistory.length} Saved
          </span>
        </div>

        {/* 2 Small Boxes for Recent Chats */}
        <div className="space-y-2.5">
          {recentChats.length === 0 ? (
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center">
              <p className="text-[11px] font-mono text-slate-500">No recent chats yet</p>
            </div>
          ) : (
            recentChats.map((item, index) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveModalChat(item)}
                className="w-full text-left p-3.5 rounded-xl bg-[#0c0d12]/90 border border-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg relative overflow-hidden backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase">
                    Recent #{index + 1}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono line-clamp-2 leading-relaxed group-hover:text-white">
                  {item.query}
                </p>
              </motion.button>
            ))
          )}
        </div>

        {/* History Lines Section Below Boxes */}
        {olderHistoryLines.length > 0 && (
          <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 block px-1 uppercase tracking-wider">
              Older History
            </span>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
              {olderHistoryLines.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModalChat(item)}
                  className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer group flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-400 group-hover:text-slate-200 truncate max-w-[170px]">
                    {item.query}
                  </span>
                  <span className="text-[9px] text-slate-600 shrink-0">{item.timestamp}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. MACOS-STYLE CENTER WINDOW MODAL POPUP */}
      <AnimatePresence>
        {activeModalChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            
            {/* macOS Window Frame */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-lg bg-[#0f1118]/95 border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden font-sans relative"
            >
              {/* macOS Window Titlebar with Red/Yellow/Green Control Buttons */}
              <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalChat(null)}
                    className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer flex items-center justify-center transition-all group"
                    title="Close Window (Esc)"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black">×</span>
                  </button>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-mono text-slate-400 font-medium tracking-wide">
                  Saved Chat Detail
                </span>
                <span className="text-[10px] font-mono text-slate-500">{activeModalChat.timestamp}</span>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                    Saved Prompt
                  </label>
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-slate-200 leading-relaxed">
                    {activeModalChat.query}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setActiveModalChat(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPromptInput(activeModalChat.query);
                      setActiveModalChat(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#3ee7c4] hover:bg-[#32d4b2] text-black font-semibold text-xs font-mono transition-all cursor-pointer shadow-[0_0_20px_rgba(62,231,196,0.25)] flex items-center gap-1.5"
                  >
                    <span>Use Prompt</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Centered Minimalist Greeting Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90">
          Hey! <span className="font-normal text-white">{userName}</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-light text-white/40 tracking-tight">
          What can I help with?
        </h2>
      </div>

      {/* Input Box Wrapper with Sign-In Style Multi-Color Glow Backdrop & Edgy Corners */}
      <div className="relative w-full">
        {/* Sign-In Page Style Ambient Gradient Glow Aura */}
        <div 
          className="absolute inset-0 -m-2 bg-gradient-to-r from-[#5683da] via-[#ff8964] to-[#3ee7c4] rounded-2xl opacity-20 blur-2xl animate-pulse pointer-events-none" 
          style={{ animationDuration: "5s" }}
        />

        {/* Screenshot Pixel-Perfect Edgy Input Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 rounded-xl bg-black border border-white/10 p-6 shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          <form onSubmit={(e) => handleOrchestrate(e)} className="space-y-5">
            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask me anything......"
                rows={3}
                className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono tracking-wide leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleOrchestrate(e);
                  }
                }}
              />

              {/* Lovable-style Clean Text Processing Indicator (No symbols, no badges) */}
              {orchestrating && (
                <div className="mt-3 text-xs font-mono text-slate-400 animate-pulse tracking-wide">
                  {processingStep}...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#161822] border border-white/[0.06] text-slate-400 text-xs font-mono hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="text-xs opacity-70">📎</span>
                <span>Attach file</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button 
                  type="button"
                  onClick={() => setShowRegistry(!showRegistry)}
                  className="px-4 py-2 rounded-lg bg-[#161822] border border-white/[0.06] text-slate-400 hover:text-white transition-colors font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{selectedAgent ? selectedAgent.name : "Override Agent"}</span>
                  <span className="text-[10px]">▾</span>
                </button>

                <button
                  type="submit"
                  disabled={orchestrating || !promptInput.trim()}
                  className="w-9 h-9 rounded-lg bg-[#1b4e43] hover:bg-[#236456] disabled:opacity-20 text-[#32d4b2] font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md"
                >
                  {orchestrating ? (
                    <RefreshCw size={15} className="animate-spin text-[#32d4b2]" />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Execution Blueprint Output */}
      {orchestratorResult && (
        <div className="space-y-4 pt-4 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-[#0e1015]/80 border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="font-mono uppercase tracking-wider">Blueprint Execution</span>
              <span className="text-emerald-400 font-mono">
                {orchestratorResult.orchestrator_summary?.total_agents_assigned} Agents Dispatched
              </span>
            </div>
            <p className="text-sm font-medium text-white">
              {orchestratorResult.orchestrator_summary?.execution_plan}
            </p>
          </div>

          <div className="space-y-3">
            {orchestratorResult.agent_executions?.map((exec: any, idx: number) => {
              const resObj = exec.result;
              return (
                <div key={idx} className="rounded-2xl bg-[#0e1015]/50 border border-white/[0.06] overflow-hidden">
                  <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/40">0{idx + 1}.</span>
                      <h4 className="text-xs font-medium text-white">{exec.agent_name}</h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle size={12} /> Done
                    </span>
                  </div>

                  <div className="p-5">
                    {resObj?.data ? (
                      <AgentDataTable
                        title={`${exec.agent_name} Output`}
                        agentName={exec.agent_name}
                        data={resObj.data}
                      />
                    ) : (
                      <div className="p-5 rounded-xl bg-black/60 border border-white/[0.06] text-xs text-white/90 leading-relaxed font-sans overflow-x-auto space-y-4">
                        {(() => {
                          const rawContent = resObj?.content || (typeof resObj === "string" ? resObj : JSON.stringify(resObj, null, 2));
                          
                          // Helper function to render Python syntax highlighted code line by line
                          const renderSyntaxCode = (code: string) => {
                            return code.split("\n").map((line, idx) => {
                              // Highlight comments
                              if (line.trim().startsWith("#")) {
                                return <div key={idx} className="text-slate-500 italic">{line}</div>;
                              }
                              
                              // Highlight keywords & syntax tokens
                              const tokens = line.split(/(\b(?:def|class|import|from|return|if|else|elif|for|while|in|try|except|with|as|async|await|pass|None|True|False|and|or|not|is|yield)\b|".*?"|'.*?'|\d+)/g);
                              
                              return (
                                <div key={idx} className="min-h-[1.2em]">
                                  {tokens.map((token, tIdx) => {
                                    if (/^(def|class|import|from|return|if|else|elif|for|while|in|try|except|with|as|async|await|pass|yield)$/.test(token)) {
                                      return <span key={tIdx} className="text-[#ff7b72] font-semibold">{token}</span>;
                                    }
                                    if (/^(None|True|False)$/.test(token)) {
                                      return <span key={tIdx} className="text-[#79c0ff] font-semibold">{token}</span>;
                                    }
                                    if (/^(".*?"|'.*?')$/.test(token)) {
                                      return <span key={tIdx} className="text-[#a5d6ff]">{token}</span>;
                                    }
                                    if (/^\d+$/.test(token)) {
                                      return <span key={tIdx} className="text-[#79c0ff]">{token}</span>;
                                    }
                                    return <span key={tIdx}>{token}</span>;
                                  })}
                                </div>
                              );
                            });
                          };

                          // Parse markdown parts (code blocks vs formatted text)
                          const parts = rawContent.split(/(```[\s\S]*?```)/g);
                          return parts.map((part: string, pIdx: number) => {
                            if (part.startsWith("```")) {
                              const firstLineEnd = part.indexOf("\n");
                              const lang = part.substring(3, firstLineEnd).trim() || "code";
                              const codeBody = part.substring(firstLineEnd + 1, part.length - 3).trim();
                              return (
                                <div key={pIdx} className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0d0f14] shadow-xl">
                                  <div className="px-4 py-2 bg-white/[0.04] border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50">
                                    <span className="uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                      {lang}
                                    </span>
                                    <button 
                                      onClick={() => navigator.clipboard.writeText(codeBody)}
                                      className="hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded bg-white/[0.05] border border-white/10"
                                    >
                                      Copy code
                                    </button>
                                  </div>
                                  <div className="p-4 font-mono text-[12px] text-slate-200 leading-relaxed overflow-x-auto selection:bg-indigo-500/30">
                                    {renderSyntaxCode(codeBody)}
                                  </div>
                                </div>
                              );
                            }
                            
                            // Render standard markdown text with bolding and clean lists
                            const lines = part.split("\n");
                            return (
                              <div key={pIdx} className="space-y-2">
                                {lines.map((line: string, lIdx: number) => {
                                  let cleanLine = line;
                                  if (!cleanLine.trim()) return <div key={lIdx} className="h-1" />;

                                  // Headers
                                  if (cleanLine.startsWith("### ")) {
                                    return <h4 key={lIdx} className="text-sm font-semibold text-white mt-4 mb-2 tracking-tight">{cleanLine.replace("### ", "")}</h4>;
                                  }
                                  if (cleanLine.startsWith("## ")) {
                                    return <h3 key={lIdx} className="text-base font-bold text-white mt-5 mb-2 tracking-tight border-b border-white/10 pb-1.5">{cleanLine.replace("## ", "")}</h3>;
                                  }
                                  if (cleanLine.startsWith("# ")) {
                                    return <h2 key={lIdx} className="text-lg font-bold text-white mt-6 mb-2">{cleanLine.replace("# ", "")}</h2>;
                                  }

                                  // Lists
                                  const isBullet = cleanLine.trim().startsWith("- ") || cleanLine.trim().startsWith("* ");
                                  if (isBullet) {
                                    cleanLine = cleanLine.trim().replace(/^[-*]\s+/, "");
                                  }

                                  // Format bold **text** correctly without leaving raw asterisks
                                  const partsBold = cleanLine.split(/(\*\*.*?\*\*)/g);
                                  const formattedElements = partsBold.map((bPart, bIdx) => {
                                    if (bPart.startsWith("**") && bPart.endsWith("**")) {
                                      return <strong key={bIdx} className="font-semibold text-white">{bPart.slice(2, -2)}</strong>;
                                    }
                                    return bPart;
                                  });

                                  if (isBullet) {
                                    return (
                                      <div key={lIdx} className="flex items-start gap-2 ml-2 my-1 text-white/80">
                                        <span className="text-indigo-400 font-bold shrink-0">•</span>
                                        <div>{formattedElements}</div>
                                      </div>
                                    );
                                  }

                                  return <p key={lIdx} className="text-white/80 leading-relaxed">{formattedElements}</p>;
                                })}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Collapsible Agent Registry Grid */}
      {showRegistry && (
        <div className="space-y-4 pt-6 border-t border-white/[0.06] animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/80">Available Agents Matrix</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/30" size={13} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white/[0.03] border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/30 focus:outline-none w-40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredAgents.map((agent) => {
              const isSelected = selectedAgent?.agent_id === agent.agent_id;
              return (
                <div
                  key={agent.agent_id}
                  onClick={() => setSelectedAgent(isSelected ? null : agent)}
                  className={`p-4 rounded-xl bg-[#0e1015]/60 border transition-all cursor-pointer flex flex-col justify-between h-32 hover:bg-[#13161f] ${
                    isSelected ? "border-indigo-500/60 bg-indigo-950/20" : "border-white/[0.06]"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-medium text-white">{agent.name}</h4>
                    <p className="text-[11px] text-white/40 font-light line-clamp-2 mt-1">
                      {agent.description}
                    </p>
                  </div>
                  <div className="text-[10px] text-indigo-400/80 font-mono">
                    {isSelected ? "Selected ✓" : "Click to select"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};


