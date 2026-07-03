import React from 'react';

export default function KnowledgeCommand() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8 mt-12 px-4">
      {/* Top Runbook Component */}
      <div className="relative w-full max-w-md rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-5 font-sans text-left shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg"></span>
            <h4 className="text-sm font-semibold text-white">Runbook Context</h4>
          </div>
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] uppercase tracking-wider font-mono font-bold">Ops</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] uppercase tracking-wider font-mono font-bold">CEO</span>
          </div>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Upload documents, assign review owners, and let autonomous agents cite exact source records behind each recommendation.
        </p>
      </div>

      {/* Bottom Policy Summary Layout */}
      <div className="w-full rounded-xl border border-white/10 bg-black/50 backdrop-blur-md overflow-hidden shadow-2xl text-left font-sans">
        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-2.5">
          <span className="text-orange-400 text-xs"></span>
          <span className="text-xs font-medium text-white">Policy summary generated</span>
        </div>
        <div className="p-4 text-xs text-slate-300 bg-black/20 leading-relaxed">
          Procurement threshold changed in <span className="text-blue-400 font-mono">section 4.2</span>. Suggested workflow update queued for finance approval.
        </div>
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 flex flex-wrap items-center gap-6 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5"><span className="text-blue-400"></span> Fast ingestion</div>
          <div className="flex items-center gap-1.5"><span className="text-purple-400"></span> Hybrid retrieval</div>
          <div className="flex items-center gap-1.5"><span className="text-emerald-400"></span> Cited answers</div>
        </div>
      </div>
    </div>
  );
}