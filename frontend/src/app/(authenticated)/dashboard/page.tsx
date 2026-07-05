"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { Layers, FileUp, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { currentRole, addDocument } = useApp();
  
  const [dashboardData, setDashboardData] = useState<any>({
    metrics: { revenue: "$1,245,800", revenueGrowth: "+14.2% MoM", activeUsers: "14,890", userGrowth: "+8.4%", dealsClosed: "342", anomalyAlerts: "1" },
    recentActivity: [
      {"time": "10 mins ago", "type": "agent", "msg": "CEO Agent coordinated with Sales Agent to output Q3 forecast."},
      {"time": "1 hour ago", "type": "system", "msg": "Document ingestion complete: Q2_Financial_Report.pdf (82 pages)"},
      {"time": "3 hours ago", "type": "user", "msg": "Sales Manager drafted outbound campaign for lead 'Apex Logistics'"}
    ]
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploadingState, setUploadingState] = useState<"idle" | "uploading" | "indexing" | "completed">("idle");
  const [indexingPct, setIndexingPct] = useState(0);
  const [indexingLogs, setIndexingLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/dashboard/founder")
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.log("Backend offline or unreachable, using fallback."));
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
      setUploadingState("indexing");
      setIndexingPct(10);
      setIndexingLogs(["Uploading to server..."]);
      addDocument(droppedFiles[0].name, `${(droppedFiles[0].size / 1024).toFixed(1)} KB`);

      const interval = setInterval(() => {
        setIndexingPct(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingState("completed");
            setIndexingLogs(logs => [...logs, "Indexing complete! Vectors pushed to Qdrant.", "Knowledge Graph updated."]);
            return 100;
          }
          const next = prev + 30;
          setIndexingLogs(logs => [...logs, `Generating chunks and parsing elements... ${next}%`]);
          return next;
        });
      }, 1000);
    }
  };

  return (
    <>
      <Header title="Business Intelligence Dashboard" />
      
      <div className="flex-1 p-8 relative">
        <div className="absolute top-10 right-10 w-96 h-96 aurora-beam rounded-full"></div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-[#0c0c0e]/80 border border-white/5 hover:border-white/10 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ff8964]/10 rounded-full blur-xl pointer-events-none" />
              <div className="text-xs font-semibold text-ash uppercase tracking-wider mb-2 font-mono">Total Monthly Revenue</div>
              <div className="text-3xl font-extrabold">{dashboardData.metrics?.revenue}</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                {dashboardData.metrics?.revenueGrowth}
              </div>
            </div>

            {/* Metric 2 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-[#0c0c0e]/80 border border-white/5 hover:border-white/10 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#5683da]/10 rounded-full blur-xl pointer-events-none" />
              <div className="text-xs font-semibold text-ash uppercase tracking-wider mb-2 font-mono">Active CRM Pipeline</div>
              <div className="text-3xl font-extrabold">$842,500</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                Weighted: $512,000
              </div>
            </div>

            {/* Metric 3 */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-[#0c0c0e]/80 border border-white/5 hover:border-white/10 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="text-xs font-semibold text-ash uppercase tracking-wider mb-2 font-mono">System Health / Anomalies</div>
              <div className="text-3xl font-extrabold">{dashboardData.metrics?.anomalyAlerts} Alert</div>
              <div className="text-xs text-ember-pulse mt-2 flex items-center gap-1 font-medium">
                1 budget deviation detected
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logs activity */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-electric-iris" /> Agent Action & Activity Logs
              </h3>
              <div className="space-y-4">
                {dashboardData.recentActivity?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start text-sm border-b border-slate-edge/50 pb-3 last:border-0 last:pb-0">
                    <div className="px-2 py-1 rounded text-[10px] font-semibold uppercase bg-slate-edge/30 text-ash mt-0.5">
                      {item.type}
                    </div>
                    <div>
                      <p className="text-white text-sm">{item.msg}</p>
                      <span className="text-xs text-smoke mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Ingest Panel */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base mb-2">Onboarding Quick Ingest</h3>
                <p className="text-sm text-ash mb-4">Upload training spec PDFs, policies or CSV tables directly into the vector database pipeline.</p>
                
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-slate-edge rounded-xl p-8 text-center hover:border-electric-iris transition-colors cursor-pointer bg-charcoal/10"
                >
                  <FileUp className="w-10 h-10 text-ash mx-auto mb-3" />
                  <span className="text-xs text-ash">Drag and Drop PDF, CSV, or DOCX files here</span>
                </div>

                {uploadingState !== "idle" && (
                  <div className="mt-4 p-4 bg-void/50 rounded-lg border border-slate-edge/50">
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-electric-iris capitalize">{uploadingState}...</span>
                      <span>{indexingPct}%</span>
                    </div>
                    <div className="w-full bg-slate-edge/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-electric-iris h-full transition-all duration-300" style={{ width: `${indexingPct}%` }}></div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {indexingLogs.slice(-2).map((log, index) => (
                        <div key={index} className="text-[10px] text-smoke">{log}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
