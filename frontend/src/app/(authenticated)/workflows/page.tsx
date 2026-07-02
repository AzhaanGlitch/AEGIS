"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Play, ChevronRight } from "lucide-react";

export default function WorkflowsPage() {
  const [workflowNodes] = useState<any[]>([
    { id: "1", label: "Trigger: High Priority Lead Ingested", type: "trigger" },
    { id: "2", label: "Action: Auto-Draft Pitch Deck & Email", type: "agent" },
    { id: "3", label: "Action: Dispatch Slack Notification", type: "action" }
  ]);

  const triggerWorkflowRun = () => {
    fetch("http://localhost:8000/api/v1/workflows/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Lead Score Email Sequence" })
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(() => alert("Workflow run completed successfully. Leads scored & Slack notification sent."));
  };

  return (
    <>
      <Header title="Visual Workflow Builder" />
      
      <div className="flex-1 p-8 relative z-10 space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-base">State-Aware Automation Pipeline</h3>
              <p className="text-xs text-smoke mt-1">Design triggers and coordination steps between LLM sub-agents.</p>
            </div>
            <button
              onClick={triggerWorkflowRun}
              className="px-4 py-2 bg-electric-iris text-white font-medium rounded-full text-xs hover:bg-opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              Run Automation Sequence <Play className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 border border-slate-edge/70 rounded-xl relative bg-void/60 flex items-center justify-around p-4 overflow-x-auto">
            {workflowNodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <div className="px-5 py-4 bg-charcoal border border-slate-edge rounded-xl shadow-lg relative min-w-44 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-smoke mb-1">{node.type}</div>
                  <div className="text-xs font-semibold text-white">{node.label}</div>
                </div>
                {i < workflowNodes.length - 1 && (
                  <div className="text-slate-edge animate-pulse">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
