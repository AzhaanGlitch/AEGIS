"use client";

import React, { useState, useEffect } from "react";
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
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<AgentMetadata | null>(null);
  
  const [promptInput, setPromptInput] = useState<string>("");
  const [orchestrating, setOrchestrating] = useState<boolean>(false);
  const [orchestratorResult, setOrchestratorResult] = useState<any>(null);

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

  const handleOrchestrate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || orchestrating) return;

    setOrchestrating(true);
    setOrchestratorResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/agents/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: promptInput,
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
      setOrchestrating(false);
    }
  };

  const categories = ["All", "Core Engineering", "Planning & Management", "Business & Support", "Specialized / Utility", "Skill-Creator Suite"];

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              <Sparkles size={14} />
              <span>AEGIS Multi-Agent Core V2.0</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              27-Agent Orchestrator Dashboard
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Intelligent multi-role orchestration powered by Groq, NVIDIA NIM, and HuggingFace endpoints. Automatically classifies user intent, routes tasks, and executes specialized workloads.
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-black text-white">{agents.length || 27}</div>
              <div className="text-xs text-slate-400 font-medium">Active Agents</div>
            </div>
            <div className="h-10 w-px bg-slate-800 hidden sm:block" />
            <div className="px-4 py-2 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Zap size={16} />
              <span>Multi-Provider Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Orchestrator Prompt Input */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Cpu className="text-indigo-400" size={20} />
            <span>Master Orchestrator Prompt</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Type any prompt below. The Orchestrator will automatically classify your intent and delegate it to the best of the 27 agents. Alternatively, select a specific agent below to override auto-routing.
          </p>

          <form onSubmit={handleOrchestrate} className="space-y-4">
            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. Write a Python function for rate-limiting REST APIs with Redis, or design a marketing strategy for our new SaaS launching next month..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
              {selectedAgent && (
                <div className="absolute top-3 right-3 bg-indigo-950/80 border border-indigo-500/30 px-3 py-1 rounded-lg text-xs text-indigo-300 flex items-center gap-2">
                  <span>Target Override: <strong>{selectedAgent.name}</strong></span>
                  <button
                    type="button"
                    onClick={() => setSelectedAgent(null)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                LLM Providers: <span className="text-indigo-400 font-medium">Groq (Llama 3.3)</span> • <span className="text-teal-400 font-medium">NVIDIA NIM</span> • <span className="text-sky-400 font-medium">HuggingFace</span>
              </div>
              <button
                type="submit"
                disabled={orchestrating || !promptInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25"
              >
                {orchestrating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Orchestrating...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Task</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Orchestrator Output Section - Multi-Agent Concurrent Flow */}
      {orchestratorResult && (
        <div className="max-w-7xl mx-auto mb-12 space-y-6">
          {/* Master Plan Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 p-6 rounded-2xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                <Sparkles size={14} />
                <span>Master Orchestrator Plan</span>
              </div>
              <div className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
                <Zap size={14} />
                <span>{orchestratorResult.orchestrator_summary?.total_agents_assigned} Agents Running Simultaneously</span>
              </div>
            </div>
            
            <h3 className="text-xl font-extrabold text-white">
              {orchestratorResult.orchestrator_summary?.execution_plan}
            </h3>
            <p className="text-xs text-slate-400">
              User Prompt: <span className="text-slate-200 italic">"{orchestratorResult.orchestrator_summary?.user_input}"</span>
            </p>
          </div>

          {/* Concurrent Agents Execution Flow */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Bot className="text-indigo-400" size={20} />
              <span>Active Agent Pipeline Executions</span>
            </h3>

            {orchestratorResult.agent_executions?.map((exec: any, idx: number) => {
              const resObj = exec.result;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all"
                >
                  {/* Agent Card Header */}
                  <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-100 text-base">{exec.agent_name}</h4>
                          <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20">
                            {exec.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{exec.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full font-mono">
                      <CheckCircle size={13} />
                      <span>Execution Complete</span>
                    </div>
                  </div>

                  {/* Subtask Assigned */}
                  <div className="p-4 bg-slate-950/50 border-b border-slate-800/60 text-xs text-slate-300">
                    <strong className="text-indigo-400 font-mono">Assigned Subtask: </strong>
                    <span>{exec.subtask}</span>
                  </div>

                  {/* Output Display */}
                  <div className="p-6">
                    {resObj?.data ? (
                      <AgentDataTable
                        title={`${exec.agent_name} Structured Output`}
                        agentName={exec.agent_name}
                        data={resObj.data}
                      />
                    ) : (
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-sm text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {resObj?.content || JSON.stringify(resObj, null, 2)}
                      </div>
                    )}
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
