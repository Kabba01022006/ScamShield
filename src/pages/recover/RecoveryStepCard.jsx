import React from 'react';
import { Check, ExternalLink, Phone, AlertOctagon, ShieldAlert } from 'lucide-react';

/**
 * RecoveryStepCard
 * 
 * Interactive card for each Golden Hour recovery action.
 * Supports:
 * - Urgency badge (High Urgency vs Normal Urgency)
 * - Accessible custom checkbox
 * - Strikethrough completed styling
 * - Action buttons with event propagation isolation
 */
export const RecoveryStepCard = ({
  stepNumber,
  title,
  reason,
  urgency = 'Normal Urgency',
  guidance,
  icon: Icon,
  action,
  isDone,
  onToggle,
}) => {
  const isHighUrgency = urgency === 'High Urgency';

  return (
    <div
      onClick={onToggle}
      role="checkbox"
      aria-checked={isDone}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 ${
        isDone
          ? 'bg-slate-50/70 dark:bg-[#040711]/60 border-slate-200/60 dark:border-white/5 opacity-80'
          : isHighUrgency
          ? 'bg-white dark:bg-[#080d1a]/95 border-rose-500/30 dark:border-rose-500/30 hover:border-rose-500/60 shadow-sm hover:shadow-md'
          : 'bg-white dark:bg-[#080d1a]/95 border-slate-200/90 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-[#00e5ff]/40 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        
        {/* Custom Accessible Checkbox */}
        <div
          className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all border ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-black shadow-sm'
              : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#040711] group-hover:border-cyan-500 dark:group-hover:border-[#00e5ff]'
          }`}
          aria-hidden="true"
        >
          {isDone ? (
            <Check className="w-4 h-4 stroke-[3] text-black" />
          ) : (
            <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-[#00e5ff]">
              {stepNumber}
            </span>
          )}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-2">
          
          {/* Header Row: Title + Urgency Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isDone
                      ? 'text-slate-400 dark:text-slate-500'
                      : isHighUrgency
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-cyan-600 dark:text-[#00e5ff]'
                  }`}
                />
              )}
              <h3
                className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                  isDone
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {title}
              </h3>
            </div>

            {/* Urgency Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-wider shrink-0 transition-opacity ${
                isDone
                  ? 'opacity-60 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  : isHighUrgency
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {isHighUrgency ? (
                <AlertOctagon className="w-3 h-3 text-rose-500" />
              ) : (
                <ShieldAlert className="w-3 h-3 text-cyan-600 dark:text-[#00e5ff]" />
              )}
              <span>{urgency}</span>
            </span>
          </div>

          {/* Description / Reason */}
          <p
            className={`text-xs sm:text-sm leading-relaxed transition-colors ${
              isDone
                ? 'text-slate-400 dark:text-slate-600'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {reason}
          </p>

          {/* Special Guidance Note (if any) */}
          {guidance && !isDone && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <span className="font-bold font-mono">Action Note:</span>
              <span>{guidance}</span>
            </div>
          )}

          {/* Action button if provided */}
          {action && (
            <div className="pt-1.5" onClick={(e) => e.stopPropagation()}>
              {action.type === 'tel' ? (
                <a
                  href={`tel:${action.tel || '1930'}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{action.label}</span>
                </a>
              ) : (
                <a
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-[#00e5ff] border border-cyan-500/30 text-xs font-bold font-mono transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40 active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{action.label}</span>
                </a>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
