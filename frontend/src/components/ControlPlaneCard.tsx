import React from 'react';

export default function ControlPlaneCard() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 font-mono text-left text-xs text-slate-300 shadow-2xl">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-slate-500 text-[11px] ml-2">AEGIS / Agent Control Plane</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase tracking-wider font-semibold">
          High Priority
        </div>
      </div>

      {/* Main Alert Segment */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight font-sans">
              $12.5K ad spend spike detected
            </h4>
            <p className="text-slate-400 text-[11px] mt-1 font-sans leading-relaxed">
              Finance agent identified a paid acquisition charge <span className="text-amber-400 font-medium">3.1x above</span> the historical monthly average.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 block">Confidence</span>
            <span className="text-emerald-400 font-bold text-sm">86%</span>
          </div>
        </div>

        {/* Execution Step */}
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2 font-sans">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Routed evidence to <span className="text-white font-medium">Marketing</span> and <span className="text-white font-medium">Cash-Flow Review</span></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pl-3.5">
            <span>→ Prepared owner checklist & approval workflow for</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white text-[10px] uppercase font-mono tracking-wider">CEO</span>
          </div>
        </div>

        {/* Source Files Context Section */}
        <div className="pt-2 border-t border-white/5">
          <span className="text-[10px] text-slate-500 block mb-2 uppercase tracking-wider font-semibold">Attached Sources</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans text-[11px]">
            <div className="flex items-center gap-2 p-2 rounded bg-white/[0.01] border border-white/5 hover:border-white/10 transition">
              <span className="text-emerald-400"></span>
              <span className="truncate text-slate-300">Ledger_June2026.csv</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-white/[0.01] border border-white/5 hover:border-white/10 transition">
              <span className="text-red-400"></span>
              <span className="truncate text-slate-300">Marketing_ROI.pdf</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-white/[0.01] border border-white/5 hover:border-white/10 transition">
              <span className="text-amber-400"></span>
              <span className="truncate text-slate-300">CRM_Accounts.json</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}