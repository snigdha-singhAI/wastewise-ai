import React from 'react';
import { useWasteData } from '../context/WasteDataContext';
import {
  LayoutDashboard,
  Camera,
  Flame,
  Route,
  Cpu,
  Trash2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useWasteData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'report', label: 'Report Waste', icon: Camera, badge: 'Live AI' },
    { id: 'hotspots', label: 'Hotspots', icon: Flame, badge: 'DBSCAN' },
    { id: 'routes', label: 'Collection Routes', icon: Route, badge: 'Optimized' },
    { id: 'insights', label: 'Model Insights', icon: Cpu, badge: 'Weights' },
  ];

  return (
    <aside className="w-64 bg-dark-surface border-r border-cyan-500/20 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-glow-cyan">
              <Trash2 className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent">
                WASTEWISE AI
              </h1>
              <p className="text-[11px] text-cyan-400/80 font-mono tracking-tight">
                Smarter Data. Cleaner Cities.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            OPERATIONS CONSOLE
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Hackathon Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-lg p-3 bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400 font-semibold">CS11 PROTOTYPE</span>
            <span className="text-slate-500">24H HACK</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-snug">
            Hotspot Mapping & Collection Routing
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>TEAM: <strong className="text-slate-200">Snigger</strong></span>
            <span>By <strong className="text-cyan-300">Snigdha Singh</strong></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
