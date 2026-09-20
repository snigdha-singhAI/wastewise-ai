import React from 'react';
import { useWasteData } from '../context/WasteDataContext';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar() {
  const { reports, hotspots, route, triggerLiveAnalysis, resetDemoData, isLiveAnalyzing } = useWasteData();

  const highPriorityCount = hotspots.filter(h => h.priority === 'HIGH').length;

  return (
    <header className="h-16 border-b border-cyan-500/20 bg-dark-surface/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Branding micro-indicators & Demo Mode status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping-slow"></span>
          <span className="font-semibold tracking-wider">DEMO MODE</span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GEOSPATIAL OPS &bull; PUNE REGION</span>
        </div>

        <div className="hidden xl:inline-block px-2.5 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-[11px] text-amber-400/90 font-mono">
          DEMO DATA &mdash; FOR PROTOTYPE DEMONSTRATION
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center space-x-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={resetDemoData}
          title="Reset dataset back to original 28 demo reports"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">RESET DEMO</span>
        </button>

        {/* RUN LIVE ANALYSIS prominent button */}
        <button
          onClick={triggerLiveAnalysis}
          disabled={isLiveAnalyzing}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-glow-cyan hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isLiveAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-slate-950" />
              <span className="tracking-wide uppercase">ANALYZING...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="tracking-wide uppercase">RUN LIVE ANALYSIS</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
