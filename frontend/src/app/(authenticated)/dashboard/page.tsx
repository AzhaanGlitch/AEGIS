"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigationState } from "../layout";
import { 
  Layers, 
  FileUp, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Cpu, 
  Terminal,
  Workflow,
  Database,
  History,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Loader2,
  Brain
} from "lucide-react";
import { AgentOrchestratorDashboard } from "@/components/agents/AgentOrchestratorDashboard";

const renderMarkdown = (text: string) => {
  if (!text) return "";
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let cleanLine = line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const isBullet = cleanLine.trim().startsWith("* ") || cleanLine.trim().startsWith("- ");
    if (isBullet) {
      cleanLine = cleanLine.trim().replace(/^[\*\-]\s+/, "");
    }
    
    // Parse bold text
    let tempLine = cleanLine;
    const boldParts: React.ReactNode[] = [];
    let bMatch;
    let lastBIdx = 0;
    while ((bMatch = boldRegex.exec(tempLine)) !== null) {
      if (bMatch.index > lastBIdx) {
        boldParts.push(tempLine.substring(lastBIdx, bMatch.index));
      }
      boldParts.push(<strong key={bMatch.index} className="text-white font-bold">{bMatch[1]}</strong>);
      lastBIdx = boldRegex.lastIndex;
    }
    if (lastBIdx < tempLine.length) {
      boldParts.push(tempLine.substring(lastBIdx));
    }
    
    const content = boldParts.length > 0 ? boldParts : cleanLine;
    if (isBullet) {
      return (
        <li key={idx} className="list-disc ml-5 my-1 text-slate-300">
          {content}
        </li>
      );
    }
    if (cleanLine.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-sm font-bold text-white mt-4 mb-2 font-mono uppercase tracking-wider">
          {cleanLine.replace("### ", "")}
        </h4>
      );
    }
    if (cleanLine.startsWith("## ")) {
      return (
        <h3 key={idx} className="text-base font-bold text-white mt-5 mb-2 font-mono uppercase tracking-wider">
          {cleanLine.replace("## ", "")}
        </h3>
      );
    }
    return (
      <p key={idx} className="my-1.5 min-h-[1em]">
        {content}
      </p>
    );
  });
};

export default function DashboardPage() {
  const { currentRole, addDocument, documents, user, fetchDocuments } = useApp();
  const { activeView, setActiveView } = useNavigationState();

  const [dashboardData, setDashboardData] = useState<any>({
    metrics: { 
      revenue: "$1,245,800", 
      revenueGrowth: "+14.2% MoM", 
      activeUsers: "14,890", 
      userGrowth: "+8.4%", 
      dealsClosed: "342", 
      anomalyAlerts: "1" 
    },
    recentActivity: [
      { time: "10 mins ago", type: "agent", msg: "CEO Agent coordinated with Sales Agent to output Q3 forecast parameters." },
      { time: "1 hour ago", type: "system", msg: "Data cluster ingestion complete: Q2_Financial_Matrix.pdf indexed securely." },
      { time: "3 hours ago", type: "user", msg: "Operator node altered parameters for workflow tier 'Apex Distribution'." }
    ]
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "indexing" | "completed">("idle");
  const [progressPct, setProgressPct] = useState(0);
  const [ingestionLogs, setIngestionLogs] = useState<string[]>([]);

  // Workspace Chat State Variables
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
        } else if (userMsg.toLowerCase().includes("policy") || userMsg.toLowerCase().includes("remote") || userMsg.toLowerCase().includes("velocity") || userMsg.toLowerCase().includes("growth")) {
          mockReply = "According to the newly uploaded AEGIS Growth Strategy, target Average Contract Value is $45,000 / year and the sales velocity goal is to reduce the lead-to-close cycle from 45 days to 18 days. Sources: [AEGIS_Growth_Strategy_2026.txt](file:///Users/yashgoyal/Documents/AEGIS/AEGIS_Growth_Strategy_2026.txt).";
        } else {
          mockReply = `This is a mock response from the ${selectedAgent} (offline fallback). Your query: "${userMsg}".`;
        }
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = mockReply;
          updated[updated.length - 1].citations = [
            { name: "AEGIS Growth Strategy", link: "file:///Users/yashgoyal/Documents/AEGIS/AEGIS_Growth_Strategy_2026.txt" }
          ];
          return updated;
        });
        setIsStreaming(false);
      }, 1200);
    };
  };

  useEffect(() => {
    // Fetch live dashboard metrics
    fetch("http://localhost:8000/api/v1/dashboard/founder")
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(() => {});
  }, [activeView]);

  const handleFileUpload = async (targetFile: File) => {
    setFiles([targetFile]);
    setUploadState("uploading");
    setProgressPct(10);
    setIngestionLogs(["Uploading " + targetFile.name + "..."]);

    const formData = new FormData();
    formData.append("file", targetFile);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ingest/upload", {
        method: "POST",
        body: formData
      });
      const uploadResult = await res.json();

      // Start polling progress
      const interval = setInterval(async () => {
        try {
          const progRes = await fetch("http://localhost:8000/api/v1/ingest/progress");
          const progData = await progRes.json();
          setProgressPct(progData.percentage);
          setIngestionLogs(progData.log || []);
          
          if (progData.status === "completed" || progData.percentage >= 100) {
            clearInterval(interval);
            setUploadState("completed");
            setProgressPct(100);
            addDocument(targetFile.name, `${(targetFile.size / 1024).toFixed(1)} KB`);
            fetchDocuments();
          } else if (progData.status === "processing") {
            setUploadState("indexing");
          }
        } catch {
          clearInterval(interval);
          setUploadState("idle");
        }
      }, 1000);
    } catch (error) {
      setUploadState("idle");
      alert("Ingestion pipeline failed to start.");
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const navTabs = [
    { name: "Dashboard", desc: "System Core Console Overview" },
    { name: "Workspace Chat", desc: "Interact with Autonomous AI Agents" },
    { name: "Agent Mesh", desc: "Autonomous Agent Execution Networks" },
    { name: "Workflows", desc: "Linear Pipeline Synthesizer Channels" },
    { name: "Knowledge Base", desc: "Vector Storage Arrays & RAG Pipelines" },
    { name: "Logs Trace", desc: "Immutable Machine Activity Stream Logs" },
    { name: "Documents", desc: "Ingested Unstructured File Matrices" },
    { name: "Settings", desc: "Node Parameters & Configuration Layers" },
    { name: "Support", desc: "Terminal Maintenance Protocol Request" }
  ];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      


      {/* Title Segment Info (Hidden when in Agent Mesh mode for a clean look) */}
      {activeView !== "Agent Mesh" && (
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            {activeView} <span className="text-xs font-mono font-normal text-slate-500">/ {currentRole} Security Access</span>
          </h1>
          {user && (
            <p className="text-xs text-[#3ee7c4] font-mono">
              Welcome back, {user.name} ({user.email})
            </p>
          )}
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            {navTabs.find(t => t.name === activeView)?.desc}
          </p>
        </div>
      )}

      {/* Main Core Router Switcher Frame */}
      {activeView === "Dashboard" && (
        <>
          {/* Card Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#09090b]/30 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Gross Attributed Yield</span>
                <Activity className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white">{dashboardData.metrics.revenue}</span>
                <span className="text-[10px] font-mono text-[#3ee7c4]">{dashboardData.metrics.revenueGrowth}</span>
              </div>
            </div>

            <div className="bg-[#09090b]/30 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Synchronized Node Users</span>
                <Cpu className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white">{dashboardData.metrics.activeUsers}</span>
                <span className="text-[10px] font-mono text-[#5683da]">{dashboardData.metrics.userGrowth}</span>
              </div>
            </div>

            <div className="bg-[#09090b]/30 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Anomalies Isolated</span>
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff8964]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white">{dashboardData.metrics.anomalyAlerts}</span>
                <span className="text-[10px] font-mono text-[#ff8964]/70">Action Needed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Logs component snippet */}
            <div className="lg:col-span-7 bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-6 flex items-center gap-2 border-b border-white/[0.02] pb-3">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> Operational Logs Trace
              </h2>
              <div className="space-y-3.5">
                {dashboardData.recentActivity.map((log: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg text-xs">
                    <span className="text-[10px] font-mono text-slate-600 shrink-0 pt-0.5 w-20">{log.time}</span>
                    <p className="text-slate-400 leading-relaxed">
                      <span className="font-mono text-white mr-1.5 font-semibold">[{log.type.toUpperCase()}]</span>
                      {log.msg}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingestion Module */}
            <div className="lg:col-span-5 bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 flex flex-col justify-between backdrop-blur-md">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-2 flex items-center gap-2 border-b border-white/[0.02] pb-3">
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" /> Vector Ingest Core
                </h2>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-mono">
                  Drop files directly into localized memory layouts to update your agent systems.
                </p>

                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('dashboard-file-input')?.click()}
                  className="border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all cursor-pointer bg-black/40 group"
                >
                  <input
                    id="dashboard-file-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <FileUp className="w-6 h-6 text-slate-600 mx-auto mb-3 group-hover:text-white transition-colors" />
                  <span className="text-[11px] font-mono text-slate-400 block tracking-wide">
                    Drag operational logs here or <span className="underline text-white">click to browse</span>
                  </span>
                </div>
              </div>

              {uploadState !== "idle" && (
                <div className="mt-4 p-4 bg-[#060608]/90 rounded-lg border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400 capitalize">{uploadState}...</span>
                    <span className="text-white">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 1.5. WORKSPACE CHAT PANEL */}
      {activeView === "Workspace Chat" && (
        <div className="flex flex-col h-[calc(100vh-220px)] border border-white/[0.04] rounded-xl bg-[#09090b]/20 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
          {/* Agent Selector Header */}
          <div className="p-4 bg-black/40 border-b border-white/[0.04] flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#3ee7c4]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Target Orchestration Agent</span>
            </div>
            <div className="flex gap-2">
              {["CEO Agent", "Sales Agent", "Marketing Agent"].map((agent) => (
                <button
                  key={agent}
                  onClick={() => setSelectedAgent(agent)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border transition cursor-pointer ${
                    selectedAgent === agent
                      ? "bg-white/10 text-white border-white/20"
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  }`}
                >
                  {agent}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Brain className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
                <div className="space-y-1.5">
                  {msg.sender === "ai" && (
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                      {msg.agent}
                    </span>
                  )}
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed font-sans ${
                      msg.sender === "user"
                        ? "bg-[#5683da]/10 border border-[#5683da]/20 text-white"
                        : "bg-white/[0.02] border border-white/[0.04] text-slate-300"
                    }`}
                  >
                    {renderMarkdown(msg.text)}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.citations.map((cite: any, cIdx: number) => (
                        <a
                          key={cIdx}
                          href={cite.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded text-[10px] font-mono transition-colors"
                        >
                          <FileText className="w-2.5 h-2.5" /> {cite.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatStatus && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> {chatStatus}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-black/40 border-t border-white/[0.04] flex items-center gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder={`Send instructions to ${selectedAgent}...`}
              className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/20 font-sans"
              disabled={isStreaming}
            />
            <button
              onClick={sendChatMessage}
              disabled={isStreaming}
              className="w-10 h-10 bg-white text-black hover:bg-white/90 rounded-lg flex items-center justify-center shrink-0 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. AGENT MESH PANEL (27-Agent Orchestrator Suite) */}
      {activeView === "Agent Mesh" && (
        <div className="animate-in fade-in duration-200">
          <AgentOrchestratorDashboard />
        </div>
      )}

      {/* 3. WORKFLOWS ENGINE PIPELINES */}
      {activeView === "Workflows" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {[
            { id: "WF-091", title: "Q3 Fiscal Growth Projection pipeline", system: "Automated Core Framework", updates: "Triggered 12m ago" },
            { id: "WF-104", title: "Lead Ingestion & Qualification Chain", system: "Sales Segment Framework", updates: "Triggered 2h ago" },
          ].map((wf, index) => (
            <div key={index} className="bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Workflow className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">[{wf.id}]</span>
                    <h3 className="text-sm font-semibold text-white">{wf.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{wf.system} • {wf.updates}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white text-black font-semibold text-[10px] font-mono uppercase tracking-wider rounded-lg hover:bg-white/90 transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer">
                <Play className="w-3 h-3 fill-current" /> Execute
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. KNOWLEDGE BASE STORAGE ARRAYS */}
      {activeView === "Knowledge Base" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <div className="bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white border-b border-white/[0.02] pb-3 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-500" /> Active Vector Collections
            </h2>
            <div className="space-y-3">
              {["Corporate_Financial_Embeddings", "Customer_Insight_Matrix_2026", "Operator_Runbook_V3"].map((db, i) => (
                <div key={i} className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">{db}</span>
                  <span className="text-slate-600">1,536 dimensions</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md flex flex-col justify-center text-center p-8">
            <Sparkles className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-mono text-slate-400">Total System Embedding Memory Usage</p>
            <span className="text-3xl font-bold tracking-tight text-white mt-1">4.12M Vectors</span>
          </div>
        </div>
      )}

      {/* 5. LOGS TRACE STREAM */}
      {activeView === "Logs Trace" && (
        <div className="bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/[0.02] pb-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-slate-500" /> Continuous Logs Engine Trace
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase text-[#3ee7c4] tracking-wider bg-[#3ee7c4]/5 px-2 py-0.5 rounded border border-[#3ee7c4]/15">
              <span className="w-1 h-1 bg-[#3ee7c4] rounded-full animate-ping" /> Live Pipeline
            </span>
          </div>
          <div className="space-y-2.5 max-h-[450px] overflow-y-auto font-mono text-[11px] leading-relaxed pr-2">
            {[
              { t: "15:44:21", s: "SYS", m: "Memory cluster reallocation optimization successfully executed in channel 4." },
              { t: "15:42:09", s: "SEC", m: "Gateway firewall analyzed inbound handshake verification from root token layer." },
              { t: "15:39:12", s: "RAG", m: "Chunking index engine split transaction log blocks into localized storage trees." },
              { t: "15:30:05", s: "AGT", m: "CEO Agent synchronized updated contextual objectives parameters to Sales cluster." },
            ].map((log, i) => (
              <div key={i} className="p-2.5 bg-black/40 border border-white/[0.02] rounded-md text-slate-400 flex gap-4">
                <span className="text-slate-600 shrink-0">{log.t}</span>
                <span className="text-white font-semibold shrink-0">[{log.s}]</span>
                <span>{log.m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DOCUMENTS REGISTRY */}
      {activeView === "Documents" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Documents List */}
          <div className="lg:col-span-7 bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white border-b border-white/[0.02] pb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Ingested File Repositories
            </h2>
            {documents.length > 0 ? (
              <div className="divide-y divide-white/[0.03]">
                {documents.map((doc: any, i: number) => (
                  <div key={i} className="py-3.5 flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-200 font-medium">{doc.name}</span>
                    </div>
                    <span className="text-slate-500">{doc.size || 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                No unstructured files vectorized yet. Try uploading one.
              </div>
            )}
          </div>

          {/* Upload Zone */}
          <div className="lg:col-span-5 bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 flex flex-col justify-between backdrop-blur-md">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-white mb-2 flex items-center gap-2 border-b border-white/[0.02] pb-3">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" /> Ingest New Document
              </h2>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-mono">
                Drop files directly into localized memory layouts to update your agent systems.
              </p>

              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('documents-file-input')?.click()}
                className="border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all cursor-pointer bg-black/40 group"
              >
                <input
                  id="documents-file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <FileUp className="w-6 h-6 text-slate-600 mx-auto mb-3 group-hover:text-white transition-colors" />
                <span className="text-[11px] font-mono text-slate-400 block tracking-wide">
                  Drag files here or <span className="underline text-white">click to browse</span>
                </span>
              </div>
            </div>

            {uploadState !== "idle" && (
              <div className="mt-4 p-4 bg-[#060608]/90 rounded-lg border border-white/5 space-y-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400 capitalize">{uploadState}...</span>
                  <span className="text-white">{progressPct}%</span>
                </div>
                <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
                  <div className="bg-white h-full transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. SETTINGS AND NODE CONTROLS */}
      {activeView === "Settings" && (
        <div className="max-w-2xl bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white border-b border-white/[0.02] pb-3 flex items-center gap-2">
            <SettingsIcon className="w-3.5 h-3.5 text-slate-500" /> Security Node Configuration
          </h2>
          <div className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Primary Access Layer Model</label>
              <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-white/20 font-mono">
                <option>AEGIS-Custom-Mesh-V2 (Default)</option>
                <option>GPT-4o-Enterprise-Tunnel</option>
                <option>Claude-3.5-Sonnet-Isolated</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Vector Ingestion Chunking Overlap</label>
              <input type="text" defaultValue="256 tokens" className="w-full bg-black border border-white/10 rounded-lg p-3 text-slate-300 font-mono focus:outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* 8. TERMINAL SUPPORT LAYER */}
      {activeView === "Support" && (
        <div className="max-w-xl bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md space-y-4 animate-in fade-in duration-200">
          <h2 className="text-xs font-mono uppercase tracking-widest text-white border-b border-white/[0.02] pb-3 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Terminal Maintenance Protocol
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Need emergency matrix intervention? Open a ticket directly to your isolated network developer instance.
          </p>
          <textarea 
            rows={4} 
            placeholder="Describe connection anomaly parameters..." 
            className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-white/20 text-xs font-sans"
          />
          <button className="w-full py-3 bg-white text-black font-bold text-[10px] font-mono uppercase tracking-wider rounded-lg hover:bg-white/90 transition duration-150 cursor-pointer">
            Deploy Maintenance Request
          </button>
        </div>
      )}

    </div>
  );
}