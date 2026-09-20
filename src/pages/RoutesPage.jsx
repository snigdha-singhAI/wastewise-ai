import React, { useState } from 'react';
import { useWasteData } from '../context/WasteDataContext';
import PuneMap from '../components/Map/PuneMap';
import {
  Route as RouteIcon,
  RotateCw,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
  Flag,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function RoutesPage() {
  const { route, recalculateRoute } = useWasteData();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [lastOptimized, setLastOptimized] = useState(route.generatedAt || 'Just now');
  const [recalcSuccess, setRecalcSuccess] = useState(false);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    setRecalcSuccess(false);
    await new Promise(r => setTimeout(r, 650));
    recalculateRoute();
    setLastOptimized(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsRecalculating(false);
    setRecalcSuccess(true);
    setTimeout(() => setRecalcSuccess(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-white tracking-wide">
              SMART COLLECTION ROUTE
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              GREEDY TSP SEQUENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Prioritize hotspots and generate an efficient visit sequence.
          </p>
        </div>

        {/* Recalculate Button */}
        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono transition-all shadow-glow-green/20 disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>RECALCULATE ROUTE</span>
        </button>
      </div>

      {/* Recalculate confirmation toast */}
      {recalcSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-200 shadow-glow-green/20">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              ROUTE RECALCULATED: {route.stops?.length || 4} priority stops sequenced (~{route.totalDistanceKm || 32} km) via Greedy TSP heuristic!
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Updated: {lastOptimized}</span>
        </div>
      )}

      {/* Main Grid: Map on Left (7 cols), Route Details on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="h-[520px] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl relative">
            <PuneMap
              showReports={false}
              showHotspots={true}
              showRoute={true}
            />

            {/* In-Map Route Status Pill */}
            <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-lg text-xs font-mono border border-emerald-500/30 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping-slow"></span>
              <span className="text-white font-bold">DISPATCH READY &bull; 4 STOPS</span>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-3 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-400">
            <span>Method: Priority-weighted nearest-neighbor</span>
            <span>Estimated Distance: ~{route.totalDistanceKm || 32} km</span>
          </div>
        </div>

        {/* Side Panel: Route Summary & Turn-by-Turn Waypoints */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Route Summary Card */}
          <div className="glass-panel-glow rounded-2xl p-5 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <RouteIcon className="w-4 h-4 text-emerald-400" />
                <span>ROUTE SUMMARY</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                READY FOR COLLECTION
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Priority Stops:</span>
                <span className="text-xl font-bold text-white">{route.stops?.length || 4} stops</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Estimated Distance:</span>
                <span className="text-xl font-bold text-emerald-400">~{route.totalDistanceKm || 32} km</span>
              </div>
            </div>

            <div className="text-xs font-mono space-y-1.5 text-slate-300 pt-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Mission Time:</span>
                <strong className="text-white">~{route.estimatedTimeMin || 140} min (Drive + Service)</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Vehicle Class:</span>
                <span className="text-cyan-300">PMC 16T Compactor Truck</span>
              </div>
            </div>

            {/* Technical Algorithm Label */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-cyan-400 font-bold uppercase tracking-wider">
                ROUTING METHOD:
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Priority-weighted nearest-neighbor (Greedy TSP variant).
              </p>
              <p className="text-[10px] text-slate-500 italic">
                * Prototype route recommendation. Calculated from active coordinates.
              </p>
            </div>
          </div>

          {/* Sequential Waypoints List */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
              WAYPOINT SEQUENCE
            </div>

            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1 text-xs font-mono">
              {/* START: Depot */}
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center text-[10px] font-bold text-blue-300">
                    S
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">START: Municipal Fleet Depot</div>
                    <div className="text-[10px] text-slate-400">Swargate, Pune</div>
                  </div>
                </div>
                <span className="text-[10px] text-blue-300">0.0 km</span>
              </div>

              {/* Numbered Stops */}
              {route.stops?.map((stop) => (
                <div
                  key={stop.stopNumber}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[11px] font-extrabold shadow-glow-green/20">
                      {stop.stopNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-xs">
                        {stop.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {stop.reports} reports &bull; <span className="text-amber-300">{stop.dominantWaste}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      stop.priority === 'HIGH' ? 'text-red-400 bg-red-950/60' : 'text-orange-400 bg-orange-950/60'
                    }`}>
                      {stop.priority}
                    </span>
                    <div className="text-[10px] text-emerald-400 mt-0.5">+{stop.distanceFromPrevKm} km</div>
                  </div>
                </div>
              ))}

              {/* END: Recovery Facility */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                    E
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">END: Recovery Facility</div>
                    <div className="text-[10px] text-slate-400">Hadapsar Resource Recovery Park</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400">Final Drop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
