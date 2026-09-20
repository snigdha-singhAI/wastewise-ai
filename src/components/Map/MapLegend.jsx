import React from 'react';

export default function MapLegend({ className = '' }) {
  return (
    <div className={`glass-panel rounded-xl p-3 border border-slate-700/60 shadow-xl select-none ${className}`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
        MAP INTELLIGENCE LEGEND
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan"></span>
          <span className="text-slate-300 text-[11px]">Regular Report</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-glow-orange animate-pulse"></span>
          <span className="text-slate-300 text-[11px]">Emerging Hotspot</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-red animate-pulse"></span>
          <span className="text-slate-300 text-[11px]">High Priority Hotspot</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-1 bg-emerald-400 rounded-full shadow-glow-green"></span>
          <span className="text-slate-300 text-[11px]">Collection Route</span>
        </div>
      </div>
    </div>
  );
}
