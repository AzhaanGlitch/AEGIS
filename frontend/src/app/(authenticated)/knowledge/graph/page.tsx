"use client";

import React from "react";
import Header from "@/components/Header";

export default function GraphPage() {
  return (
    <>
      <Header title="Knowledge Graph Explorer" />
      
      <div className="flex-1 p-8 relative z-10 space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-bold text-base mb-2">Entity Traversal Visualizer</h3>
          <p className="text-xs text-smoke mb-6">Interactive view of the entities and semantic relations discovered in documents.</p>

          <div className="h-96 border border-slate-edge/70 rounded-xl relative flex items-center justify-center bg-void/60 overflow-hidden">
            
            {/* SVG graph */}
            <svg className="w-full h-full absolute inset-0">
              {/* Connection lines */}
              <line x1="30%" y1="30%" x2="50%" y2="50%" stroke="#4a4b50" strokeWidth="2" />
              <line x1="70%" y1="30%" x2="50%" y2="50%" stroke="#4a4b50" strokeWidth="2" />
              <line x1="50%" y1="75%" x2="50%" y2="50%" stroke="#4a4b50" strokeWidth="2" />
              <line x1="30%" y1="30%" x2="15%" y2="50%" stroke="#4a4b50" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="70%" y1="30%" x2="85%" y2="50%" stroke="#4a4b50" strokeWidth="1.5" strokeDasharray="4" />

              {/* Central Node */}
              <circle cx="50%" cy="50%" r="24" fill="#5683da" className="animate-pulse" />
              <text x="50%" y="50%" textAnchor="middle" fill="#white" fontSize="11" dy="3" fontWeight="bold">Acme Corp</text>

              {/* Supporting nodes */}
              <circle cx="30%" cy="30%" r="18" fill="#111" stroke="#4a4b50" strokeWidth="2" />
              <text x="30%" y="30%" textAnchor="middle" fill="#a9a9aa" fontSize="9" dy="3">PRD Spec</text>

              <circle cx="70%" cy="30%" r="18" fill="#111" stroke="#4a4b50" strokeWidth="2" />
              <text x="70%" y="30%" textAnchor="middle" fill="#a9a9aa" fontSize="9" dy="3">Founder</text>

              <circle cx="50%" cy="75%" r="18" fill="#111" stroke="#4a4b50" strokeWidth="2" />
              <text x="50%" y="75%" textAnchor="middle" fill="#a9a9aa" fontSize="9" dy="3">Sales DB</text>
            </svg>

            <div className="absolute bottom-3 right-3 text-[10px] text-smoke font-medium">
              Click entities to explore connection paths.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
