import React from 'react';
import { useWasteData } from '../context/WasteDataContext';
import { CheckCircle2, Loader2, Sparkles, Database, Network, Flame, Route, Check } from 'lucide-react';

export default function LiveAnalysisModal() {
  const { isLiveAnalyzing, analysisStep, hotspots, route, reports, closeLiveAnalysis } = useWasteData();

  if (!isLiveAnalyzing && analysisStep === 0) return null;

  const steps = [
    { num: 1, label: 'Ingesting Pune Waste Reports...', detail: `${reports.length} geo-tagged observations loaded`, icon: Database },
    { num: 2, label: 'Executing DBSCAN Spatial Clustering...', detail: 'eps=500m, min_samples=3 applied', icon: Network },
    { num: 3, label: 'Calculating Hotspot Priority Scores...', detail: 'Alpha (50%) + Beta (30%) + Gamma (20%)', icon: Flame },
    { num: 4, label: 'Optimizing Collection Route Sequence...', detail: 'Priority-weighted nearest-neighbor TSP', icon: Route },
    { num: 5, label: 'Updating Geospatial Operations View...', detail: 'Dispatching waypoints to fleet console', icon: Sparkles },
  ];

  const highPriorityCount = hotspots.filter(h => h.priority === 'HIGH').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-glow rounded-2xl p-6 border border-cyan-500/40 relative overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              PIPELINE LIVE ANALYSIS
            </h3>
            <p className="text-xs text-cyan-400/80 font-mono">
              REPORT &rarr; DETECT &rarr; PRIORITIZE &rarr; OPTIMIZE
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4 my-6">
          {steps.map((step) => {
            const isDone = analysisStep > step.num;
            const isCurrent = analysisStep === step.num;
            const isPending = analysisStep < step.num;
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className={`flex items-start space-x-3.5 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/15 border border-cyan-500/40 shadow-glow-cyan/10'
                    : isDone
                    ? 'bg-slate-900/60 border border-emerald-500/20'
                    : 'opacity-40 border border-transparent'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-mono">
                      {step.num}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-cyan-300' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isDone ? 'COMPLETE' : isCurrent ? 'COMPUTING' : 'QUEUED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analysis Complete Banner */}
        {analysisStep >= 6 && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white tracking-wide">
                  ANALYSIS COMPLETE
                </div>
                <div className="text-xs text-emerald-300 font-mono">
                  {route.stops?.length || 4} priority stops generated.
                </div>
              </div>
            </div>
            <button
              onClick={closeLiveAnalysis}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-glow-green transition-all"
            >
              VIEW OPERATIONS
            </button>
          </div>
        )}

        {/* Live status footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Detected: <strong className="text-cyan-400">{hotspots.length} Hotspots</strong> ({highPriorityCount} High Priority)
          </span>
          <span className="text-emerald-400 font-semibold">
            {route.stops?.length || 4} priority stops generated
          </span>
        </div>
      </div>
    </div>
  );
}
