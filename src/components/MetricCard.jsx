import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'cyan',
  demoLabel = 'DEMO DATA',
  badgeText,
  badgeType = 'default'
}) {
  const colorMap = {
    cyan: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/10 shadow-glow-cyan/10',
    red: 'border-red-500/20 text-red-400 bg-red-500/10 shadow-glow-red/10',
    orange: 'border-orange-500/20 text-orange-400 bg-orange-500/10 shadow-glow-orange/10',
    green: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10 shadow-glow-green/10',
    purple: 'border-purple-500/20 text-purple-400 bg-purple-500/10 shadow-glow-purple/10'
  };

  const badgeStyles = {
    danger: 'bg-red-950/80 text-red-400 border-red-500/30',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
    default: 'bg-slate-850 text-slate-300 border-slate-700'
  };

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden transition-all hover:border-slate-600/60 group">
      {/* Background ambient corner glow */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 ${
        accentColor === 'red' ? 'bg-red-500' :
        accentColor === 'orange' ? 'bg-orange-500' :
        accentColor === 'green' ? 'bg-emerald-500' : 'bg-cyan-500'
      }`}></div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {demoLabel && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                {demoLabel}
              </span>
            )}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white tracking-tight font-mono">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[accentColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
        <span className="text-slate-300 text-xs leading-normal">{subtitle}</span>
        {badgeText && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium shrink-0 border ${badgeStyles[badgeType] || badgeStyles.default}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
