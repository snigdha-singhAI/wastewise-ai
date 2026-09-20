import React from 'react';
import { useWasteData } from '../context/WasteDataContext';
import PuneMap from '../components/Map/PuneMap';
import MapLegend from '../components/Map/MapLegend';
import MetricCard from '../components/MetricCard';
import {
  FileText,
  Flame,
  AlertTriangle,
  Route,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { reports, hotspots, route, selectedHotspot, setSelectedHotspotId, setActiveTab } = useWasteData();

  const totalReportsCount = 124 + (reports.length > 28 ? (reports.length - 28) : 0); // Dynamic demo fleet volume
  const highPriorityHotspots = hotspots.filter(h => h.priority === 'HIGH');
  const collectionStopsCount = route.stops?.length || 4;

  // Active hotspot for right panel (defaults to Hotspot #03 or selected)
  const currentHotspot = selectedHotspot || hotspots[0] || {
    name: 'Hotspot #03',
    locationName: 'Kothrud, Pune',
    priority: 'HIGH',
    priorityScore: 87,
    reportCount: 17,
    radiusMeters: 240,
    dominantWaste: 'Plastic / Mixed',
    suggestedAction: 'Recommended for immediate collection planning',
    priorityColor: '#ef4444'
  };

  // Mock prototype confidence breakdown
  const confidenceCategories = [
    { name: 'Plastic', percent: 91, color: 'bg-cyan-400' },
    { name: 'Paper', percent: 4, color: 'bg-blue-400' },
    { name: 'Metal', percent: 2, color: 'bg-slate-400' },
    { name: 'Glass', percent: 1, color: 'bg-purple-400' },
    { name: 'Organic', percent: 2, color: 'bg-emerald-400' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-white tracking-wide">
              MUNICIPAL OPERATIONS COMMAND
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              PUNE METRO SECTOR
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time geospatial hotspot detection & AI-guided collection routing
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all shadow-glow-cyan/20"
          >
            <span>+ Report Waste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL REPORTS"
          value={totalReportsCount}
          subtitle="Demo reports in current dataset"
          icon={FileText}
          accentColor="cyan"
          demoLabel="DEMO DATA"
          badgeText="Active Ingestion"
          badgeType="default"
        />
        <MetricCard
          title="ACTIVE HOTSPOTS"
          value={hotspots.length || 5}
          subtitle="DBSCAN spatial clusters"
          icon={Flame}
          accentColor="orange"
          demoLabel="DEMO DATA"
          badgeText="DBSCAN Clustered"
          badgeType="warning"
        />
        <MetricCard
          title="HIGH PRIORITY"
          value={highPriorityHotspots.length || 2}
          subtitle="Priority score ≥ 70"
          icon={AlertTriangle}
          accentColor="red"
          demoLabel="DEMO DATA"
          badgeText="Critical Action"
          badgeType="danger"
        />
        <MetricCard
          title="COLLECTION STOPS"
          value={collectionStopsCount}
          subtitle="Priority route stops"
          icon={Route}
          accentColor="green"
          demoLabel="DEMO DATA"
          badgeText="Route Ready"
          badgeType="success"
        />
      </div>

      {/* Main Map + Right Side Hotspot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Map Container (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="h-[520px] relative rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl">
            <PuneMap
              showReports={true}
              showHotspots={true}
              showRoute={true}
              focusedHotspot={selectedHotspot}
            />

            {/* In-Map Floating Legend */}
            <div className="absolute bottom-4 left-4 z-10 max-w-lg">
              <MapLegend />
            </div>

            {/* Map Top-Right Status Micro-Badge */}
            <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-mono border border-cyan-500/30 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">PUNE TILE LAYER: ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
            <span>Click any hotspot circle or marker to inspect telemetry details</span>
            <span>OpenStreetMap Tiles &bull; No API Key Required</span>
          </div>
        </div>

        {/* Right Side Panel (4 cols): Hotspot Details & Model Prediction */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Card 1: HOTSPOT DETAILS */}
          <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-500/30 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  HOTSPOT DETAILS
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                DEMO DATA
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hotspot ID:</span>
                <span className="font-bold text-white text-sm bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 text-cyan-300">
                  {currentHotspot.name || 'HOTSPOT #03'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-slate-200">
                  {currentHotspot.locationName || 'Kothrud, Pune'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Priority:</span>
                <span className={`px-2.5 py-0.5 rounded font-extrabold text-[11px] ${
                  currentHotspot.priority === 'HIGH'
                    ? 'bg-red-950 text-red-400 border border-red-500/50 shadow-glow-red/20'
                    : 'bg-orange-950 text-orange-400 border border-orange-500/50 shadow-glow-orange/20'
                }`}>
                  {currentHotspot.priority || 'HIGH'} (Score: {currentHotspot.priorityScore || 87})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reports Count:</span>
                <span className="font-bold text-cyan-400">
                  {currentHotspot.reportCount || 17} reports
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cluster Radius:</span>
                <span className="text-slate-200">
                  {currentHotspot.radiusMeters || 240} m
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Waste Type:</span>
                <span className="text-amber-300 font-semibold">
                  {currentHotspot.dominantWaste || 'Plastic / Mixed'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Report:</span>
                <span className="text-slate-300">Today</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Suggested Action:</span>
                <div className={`p-2 rounded-lg text-[11px] font-sans font-medium border ${
                  currentHotspot.priority === 'HIGH'
                    ? 'bg-red-950/40 border-red-500/30 text-red-300'
                    : 'bg-orange-950/40 border-orange-500/30 text-orange-300'
                }`}>
                  {currentHotspot.suggestedAction || 'Recommended for immediate collection planning'}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: MODEL PREDICTION */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  MODEL PREDICTION
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Prototype / Demo Inference
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1 text-xs font-mono">
                <span className="text-cyan-300 font-bold">Plastic</span>
                <span className="text-white font-extrabold text-sm">91% confidence</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-glow-cyan" style={{ width: '91%' }}></div>
              </div>
            </div>

            {/* Category breakdown bars */}
            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide">Category Distribution:</div>
              {confidenceCategories.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 w-16">{cat.name}</span>
                  <div className="flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                  </div>
                  <span className="text-slate-300 w-8 text-right">{cat.percent}%</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
              * Prototype simulated inference layer. Engineered for pluggable PyTorch/ONNX CNN weights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
