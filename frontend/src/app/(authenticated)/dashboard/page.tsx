"use client";

import React, { useState } from "react";
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
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const { currentRole, addDocument, documents } = useApp();
  const { activeView, setActiveView } = useNavigationState();

  const [dashboardData] = useState({
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

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const targetFile = e.dataTransfer.files[0];
      setFiles([targetFile]);
      setUploadState("uploading");
      setProgressPct(35);

      setTimeout(() => {
        setUploadState("indexing");
        setProgressPct(75);
      }, 1000);

      setTimeout(() => {
        setUploadState("completed");
        setProgressPct(100);
        addDocument(targetFile.name, `${(targetFile.size / 1024).toFixed(1)} KB`);
      }, 2200);
    }
  };

  const navTabs = [
    { name: "Dashboard", desc: "System Core Console Overview" },
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
      
      {/* Upper Context Sub-links Menu Switcher Bar */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.03] pb-4">
        {navTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveView(tab.name)}
            className={`px-4 py-2 text-[11px] font-mono uppercase tracking-wider rounded-lg border transition-all duration-150 cursor-pointer ${
              activeView === tab.name
                ? "bg-white/[0.05] text-white border-white/10 shadow-md"
                : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.01]"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Title Segment Info */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
          {activeView} <span className="text-xs font-mono font-normal text-slate-500">/ {currentRole} Security Access</span>
        </h1>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          {navTabs.find(t => t.name === activeView)?.desc}
        </p>
      </div>

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
                {dashboardData.recentActivity.map((log, index) => (
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
                  className="border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all cursor-pointer bg-black/40 group"
                >
                  <FileUp className="w-6 h-6 text-slate-600 mx-auto mb-3 group-hover:text-white transition-colors" />
                  <span className="text-[11px] font-mono text-slate-400 block tracking-wide">
                    Drag operational logs here to interface
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

      {/* 2. AGENT MESH PANEL */}
      {activeView === "Agent Mesh" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {[
            { name: "Executive Core Agent", role: "CEO Operations Strategy", status: "Online", performance: "99.8%" },
            { name: "Sales Outreach Agent", role: "Pipeline Conversion Leads", status: "Idle", performance: "94.2%" },
            { name: "Financial Analyzer Node", role: "Risk and Ledger Yield", status: "Online", performance: "100%" },
          ].map((agent, index) => (
            <div key={index} className="bg-[#09090b]/30 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-slate-400" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  agent.status === "Online" ? "bg-[#3ee7c4]/10 text-[#3ee7c4] border-[#3ee7c4]/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {agent.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-0.5">{agent.name}</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">{agent.role}</p>
              <div className="border-t border-white/[0.03] pt-3 flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Efficiency</span>
                <span className="text-white font-medium">{agent.performance}</span>
              </div>
            </div>
          ))}
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
        <div className="bg-[#09090b]/20 border border-white/[0.04] rounded-xl p-6 backdrop-blur-md space-y-4 animate-in fade-in duration-200">
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
              No unstructured files vectorized yet. Head back to the main console view to stream.
            </div>
          )}
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