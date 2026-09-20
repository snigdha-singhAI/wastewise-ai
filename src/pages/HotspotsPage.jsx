import React, { useState } from 'react';
import { useWasteData } from '../context/WasteDataContext';
import PuneMap from '../components/Map/PuneMap';
import {
  Flame,
  Filter,
  Layers,
  Code2,
  Info,
  CheckCircle,
  ExternalLink,
  Sliders
} from 'lucide-react';

export default function HotspotsPage() {
  const { hotspots, selectedHotspotId, setSelectedHotspotId, setActiveTab } = useWasteData();
  const [filterPriority, setFilterPriority] = useState('ALL');

  const filteredHotspots = hotspots.filter(h => {
    if (filterPriority === 'ALL') return true;
    return h.priority === filterPriority;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-white tracking-wide">
              WASTE HOTSPOTS
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-500/30">
              DBSCAN CLUSTERING
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Identify recurring dumping areas using spatial clustering.
          </p>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterPriority(tier)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterPriority === tier
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Map on Left (7 cols), Table/Cards on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="h-[520px] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl relative">
            <PuneMap
              showReports={true}
              showHotspots={true}
              showRoute={false}
              focusedHotspot={hotspots.find(h => h.id === selectedHotspotId)}
            />

            <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-mono border border-orange-500/30 flex items-center space-x-2">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span className="text-slate-300">
                ACTIVE CLUSTERS: <strong className="text-orange-400">{hotspots.length}</strong>
              </span>
            </div>
          </div>

          {/* Technical Geospatial Method Explanation Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                <Code2 className="w-4 h-4" />
                <span>GEOSPATIAL METHOD &bull; DBSCAN</span>
              </div>
              <span className="text-[10px] text-slate-500">ALGORITHM SPEC</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              <strong>Why:</strong> Groups nearby waste reports into spatial clusters without requiring a predefined number of clusters (unlike k-means). Automatically segregates isolated complaints as noise.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">EPS (Radius)</span>
                <span className="text-sm font-bold text-cyan-300">500 m</span>
                <span className="text-[9px] text-slate-500 block">Haversine metric</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">MIN_SAMPLES</span>
                <span className="text-sm font-bold text-cyan-300">3 points</span>
                <span className="text-[9px] text-slate-500 block">Density threshold</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">NOISE REJECTION</span>
                <span className="text-sm font-bold text-emerald-400">Enabled</span>
                <span className="text-[9px] text-slate-500 block">Filters random spikes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Hotspots Cards & Table */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              IDENTIFIED HOTSPOT CLUSTERS ({filteredHotspots.length})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
              DEMO DATA
            </span>
          </div>

          <div className="space-y-3 max-h-[660px] overflow-y-auto pr-1">
            {filteredHotspots.map((hotspot) => {
              const isSelected = hotspot.id === selectedHotspotId;
              const isHigh = hotspot.priority === 'HIGH';
              const isMed = hotspot.priority === 'MEDIUM';

              return (
                <div
                  key={hotspot.id}
                  onClick={() => setSelectedHotspotId(hotspot.id)}
                  className={`glass-panel rounded-2xl p-4 transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-cyan-400/80 bg-slate-900/90 shadow-glow-cyan/20'
                      : 'border-slate-800/80 hover:border-slate-700 bg-dark-card'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-sm">
                          {hotspot.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                          isHigh
                            ? 'bg-red-950 text-red-400 border border-red-500/40 shadow-glow-red/10'
                            : isMed
                            ? 'bg-orange-950 text-orange-400 border border-orange-500/40 shadow-glow-orange/10'
                            : 'bg-yellow-950 text-yellow-400 border border-yellow-500/40'
                        }`}>
                          {hotspot.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-1">
                        {hotspot.locationName}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-cyan-400 font-bold text-sm">
                        {hotspot.reportCount} reports
                      </div>
                      <div className="text-[10px] text-slate-400">
                        r = {hotspot.radiusMeters} m
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Dominant: <strong className="text-amber-300">{hotspot.dominantWaste}</strong>
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Score: <strong className="text-white">{hotspot.priorityScore}</strong>
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                      <span>Currently focused on dashboard</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('dashboard');
                        }}
                        className="hover:underline flex items-center space-x-1 text-cyan-400 font-bold"
                      >
                        <span>View Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
