import React from 'react';

export default function ExecutionGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4 mt-12">
      {/* Card 1: Command Palette */}
      <div className="flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent text-left min-h-[240px]">
        <div className="w-full max-w-xs mx-auto rounded-lg border border-white/10 bg-black/60 p-2 shadow-xl font-sans text-xs">
          <div className="text-slate-500 px-2 py-1 mb-1 border-b border-white/5 text-[10px]">Run command...</div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between p-2 rounded bg-white/5 text-white">
              <span>Summarize latest customer risks</span>
              <span className="text-[10px] bg-white/10 px-1 rounded text-slate-400 font-mono">Enter</span>
            </div>
            <div className="flex items-center justify-between p-2 text-slate-400">
              <span>Create finance review task</span>
              <span className="text-[10px] font-mono text-slate-600">Cmd K</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-white font-medium text-sm">Command palette.</h4>
          <p className="text-slate-400 text-xs mt-1">Trigger agents, retrieve docs, and open workflows without digging through menus.</p>
        </div>
      </div>

      {/* Card 2: Team Planner */}
      <div className="flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent text-left min-h-[240px]">
        <div className="w-full max-w-xs mx-auto bg-white text-black p-3 rounded-xl shadow-xl font-sans">
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-500">High Priority</span>
          <h5 className="font-semibold text-xs mt-0.5">Approve anomaly response workflow</h5>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-500">
            <span></span> <span>4:00 PM Review</span>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-white font-medium text-sm">Team planner.</h4>
          <p className="text-slate-400 text-xs mt-1">Turn agent findings into scheduled work, owners, and review windows.</p>
        </div>
      </div>

      {/* Card 3: Decision Room */}
      <div className="flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent text-left min-h-[240px]">
        <div className="w-full max-w-xs mx-auto flex items-center justify-between gap-4 p-3 rounded-xl bg-black/40 border border-white/10 shadow-lg font-sans">
          <div className="space-y-1">
            <div className="text-white font-medium text-xs">Risk Review Room</div>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-medium">Finance</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-medium">Ops</span>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-md shadow-blue-600/20 whitespace-nowrap">
            Join Room
          </button>
        </div>
        <div className="mt-6">
          <h4 className="text-white font-medium text-sm">Decision room.</h4>
          <p className="text-slate-400 text-xs mt-1">Bring finance, operations, and customer signals into one shared meeting view.</p>
        </div>
      </div>

      {/* Card 4: Critical Alerts */}
      <div className="flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent text-left min-h-[240px]">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 opacity-20 blur-xl animate-pulse"></div>
          <div className="w-14 h-14 rounded-full border border-white/10 bg-black/40 flex items-center justify-center relative">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute"></span>
            <span className="w-2 h-2 rounded-full bg-rose-500 relative"></span>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-white font-medium text-sm">Critical alerts.</h4>
          <p className="text-slate-400 text-xs mt-1">Surface anomalies before they turn into missed revenue or operational drag.</p>
        </div>
      </div>
    </div>
  );
}