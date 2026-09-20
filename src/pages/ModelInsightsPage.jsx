import React from 'react';
import { useWasteData } from '../context/WasteDataContext';
import { WASTE_CATEGORIES, MODEL_METADATA } from '../services/classificationService';
import {
  Cpu,
  Flame,
  Sliders,
  GitFork,
  ArrowDown,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

export default function ModelInsightsPage() {
  const { weights, setWeights, hotspots } = useWasteData();

  const handleAlphaChange = (e) => {
    const val = parseFloat(e.target.value);
    setWeights(prev => ({ ...prev, alpha: val }));
  };

  const handleBetaChange = (e) => {
    const val = parseFloat(e.target.value);
    setWeights(prev => ({ ...prev, beta: val }));
  };

  const handleGammaChange = (e) => {
    const val = parseFloat(e.target.value);
    setWeights(prev => ({ ...prev, gamma: val }));
  };

  // Pipeline flow steps
  const pipelineSteps = [
    { label: 'IMAGE', desc: 'Citizen / Fleet Upload', icon: '📸' },
    { label: 'PREPROCESSING', desc: 'Resizing [224, 224] & Normalization', icon: '⚙️' },
    { label: 'CNN / INFERENCE', desc: 'MobileNetV3 Feature Backbone', icon: '🧠' },
    { label: 'WASTE TYPE', desc: 'Softmax Class Probabilities', icon: '🏷️' },
    { label: 'GPS + TIMESTAMP', desc: 'Spatial-Temporal Geo-tagging', icon: '📍' },
    { label: 'DBSCAN', desc: 'Density Clustering (eps=500m)', icon: '🌐' },
    { label: 'HOTSPOT', desc: 'Centroid & Radius Computation', icon: '🔥' },
    { label: 'PRIORITY SCORE', desc: 'Weighted Multi-factor Formula', icon: '📊' },
    { label: 'ROUTE', desc: 'Greedy TSP Optimization', icon: '🚚' },
    { label: 'MAP', desc: 'Interactive Fleet Operations', icon: '🗺️' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-black text-white tracking-wide">
            MODEL INSIGHTS & ARCHITECTURE
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-400 border border-purple-500/30">
            TECHNICAL PIPELINE
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Deep dive into inference distributions, geospatial priority mathematics, and system flow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: WASTE CLASSIFICATION (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  WASTE CLASSIFICATION
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Prototype inference visualization
              </span>
            </div>

            <div className="space-y-3.5 font-mono text-xs">
              {/* Category confidence bars */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-cyan-300 font-bold">Plastic</span>
                  <span className="text-white font-bold">91% demo confidence</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full shadow-glow-cyan" style={{ width: '91%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Paper & Cardboard</span>
                  <span className="text-slate-400">4%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Metal Scrap</span>
                  <span className="text-slate-400">2%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Glass</span>
                  <span className="text-slate-400">1%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: '1%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Organic</span>
                  <span className="text-slate-400">1%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '1%' }}></div>
                </div>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono space-y-1.5">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Architecture Target:</span>
                <span className="text-slate-200">MobileNetV3 / ResNet-50</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>Tensor Input:</span>
                <span className="text-cyan-300">[1, 3, 224, 224]</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>Model Format:</span>
                <span className="text-purple-300">ONNX Web Runtime (.onnx)</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 italic">
                * Clean modular abstraction ready for pluggable trained weights.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: HOTSPOT PRIORITY (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  HOTSPOT PRIORITY FORMULA
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                Prototype scoring weights
              </span>
            </div>

            {/* Formula display */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <div className="text-xs text-slate-400">PRIORITY SCORING EQUATION:</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                Priority Score = <span className="text-cyan-400">&alpha; &times; Frequency</span> + <span className="text-purple-400">&beta; &times; Spatial Density</span> + <span className="text-amber-400">&gamma; &times; Waste Severity</span>
              </div>
            </div>

            {/* Configurable Sliders */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-300">Report Frequency (&alpha;):</span>
                  <span className="font-bold text-white">{Math.round(weights.alpha * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={weights.alpha}
                  onChange={handleAlphaChange}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-purple-300">Spatial Density (&beta;):</span>
                  <span className="font-bold text-white">{Math.round(weights.beta * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.05"
                  value={weights.beta}
                  onChange={handleBetaChange}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-amber-300">Waste Severity (&gamma;):</span>
                  <span className="font-bold text-white">{Math.round(weights.gamma * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={weights.gamma}
                  onChange={handleGammaChange}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Ranked Chart based on active scores */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>RANKED HOTSPOT SCORES (LIVE RECALCULATED):</span>
                <span className="text-[9px] text-slate-500">DEMO SCORES</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {hotspots.slice(0, 5).map((hotspot) => (
                  <div key={hotspot.id} className="flex items-center space-x-3">
                    <span className="text-slate-300 w-28 truncate">{hotspot.name}</span>
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${hotspot.priorityScore}%`,
                          backgroundColor: hotspot.priorityColor || '#ef4444'
                        }}
                      ></div>
                    </div>
                    <span className="font-bold text-white w-8 text-right">{hotspot.priorityScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: END-TO-END PIPELINE (Full Width) */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              END-TO-END TECHNICAL PIPELINE
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            INTEGRATED EXECUTION FLOW
          </span>
        </div>

        {/* Desktop Pipeline Flowchart */}
        <div className="hidden md:flex items-center justify-between overflow-x-auto py-3 gap-2">
          {pipelineSteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/90 border border-slate-800 min-w-[95px] shrink-0 hover:border-cyan-500/40 transition-all">
                <span className="text-lg">{step.icon}</span>
                <span className="mt-1 text-[11px] font-bold font-mono text-cyan-300">
                  {step.label}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">
                  {step.desc}
                </span>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Pipeline Flowchart */}
        <div className="md:hidden grid grid-cols-2 gap-2 text-xs font-mono">
          {pipelineSteps.map((step, idx) => (
            <div key={step.label} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2">
              <span className="text-base">{step.icon}</span>
              <div>
                <div className="text-[11px] font-bold text-cyan-300">{idx + 1}. {step.label}</div>
                <div className="text-[9px] text-slate-400">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <span>PIPELINE SPEC: Pure deterministic geospatial clustering with pluggable ML inference layer</span>
          <span className="text-cyan-400">Team Snigger &bull; CS11 Geospatial Environment</span>
        </div>
      </div>
    </div>
  );
}
