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

      {/* Orchestrator Output Section */}
      {orchestratorResult && (
        <div className="max-w-7xl mx-auto mb-12 space-y-6">
          {/* Routing Decision Banner */}
          <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                Orchestrator Routing Result
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>Selected Agent:</span>
                <span className="text-indigo-400">{orchestratorResult.orchestrator_summary?.selected_agent?.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {orchestratorResult.orchestrator_summary?.selected_agent?.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Reasoning: {orchestratorResult.orchestrator_summary?.routing_reasoning}
              </p>
            </div>
          </div>

          {/* Agent Response Rendering */}
          {orchestratorResult.agent_response?.data ? (
            <AgentDataTable
              title={`${orchestratorResult.orchestrator_summary?.selected_agent?.name} Output`}
              agentName={orchestratorResult.orchestrator_summary?.selected_agent?.name || "Agent"}
              data={orchestratorResult.agent_response.data}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Bot className="text-indigo-400" size={18} />
                <span>Response Output</span>
              </h3>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {orchestratorResult.agent_response?.content || JSON.stringify(orchestratorResult, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agents Registry Section */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">27-Agent Registry</h2>
            <p className="text-xs text-slate-400">Click any agent card to target it directly for your next prompt.</p>
          </div>

          {/* Filter and Search Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const isSelected = selectedAgent?.agent_id === agent.agent_id;
            return (
              <div
                key={agent.agent_id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Bot size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                    {agent.preferred_model_tier} tier
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-base mb-1">{agent.name}</h3>
                <p className="text-xs text-indigo-400 font-medium mb-3">{agent.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>
                <div className="flex items-center justify-between text-[11px] pt-4 border-t border-slate-800/80 text-slate-500">
                  <span>{agent.category}</span>
                  {isSelected ? (
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <CheckCircle size={12} /> Selected
                    </span>
                  ) : (
                    <span className="text-slate-400 hover:text-indigo-400 transition-colors">
                      Select Agent →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
