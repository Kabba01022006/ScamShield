import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  AlertOctagon,
  PhoneCall,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useRecoveryStore } from '../../store/useRecoveryStore';

/**
 * RecoverLayout
 * 
 * Parent layout for the "Emergency Cyber Fraud Recovery" module.
 * Wraps both sequential steps with:
 * 1. Emergency Header Banner with direct 1930 CTA
 * 2. Live Progress Tracker with animated percentage and Reset Progress button
 * 3. Tab Navigation with NavLink for Step 1 and Step 2
 * 4. Nested content via <Outlet />
 * 5. Official legal disclaimer banner
 */
export const RecoverLayout = () => {
  const completedSteps = useRecoveryStore((s) => s.completedSteps);
  const resetProgress = useRecoveryStore((s) => s.resetProgress);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completedCount = completedSteps.length;
  const totalSteps = 6;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const isAllImmediateDone = completedCount === totalSteps;

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <header className="space-y-4">
        
        {/* Alert Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono uppercase tracking-wider">
          <AlertOctagon className="w-3.5 h-3.5 animate-pulse text-rose-500" />
          <span>Incident Response Protocol</span>
        </div>

        {/* Heading & Direct CTA Flex Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              I've Been Scammed: Emergency Recovery Mode
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed">
              The <strong className="text-slate-900 dark:text-white font-bold">"Golden Hour"</strong> (the first 2 hours after a fraudulent transaction) is the most critical window. Rapidly reporting the incident enables the National Cyber Crime Helpline (1930) and banking networks to place emergency liens on fraudster/mule accounts before the funds can be cashed out.
            </p>
          </div>

          {/* Direct CTA button: Call 1930 Helpline */}
          <div className="shrink-0 pt-2 md:pt-0">
            <a
              href="tel:1930"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 transition-all active:scale-95 group"
            >
              <PhoneCall className="w-5 h-5 group-hover:animate-bounce" />
              <span>Call 1930 Helpline</span>
            </a>
          </div>
        </div>

      </header>

      {/* 2. Live Progress Tracker */}
      <section
        aria-label="Recovery Progress Tracker"
        className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#00e5ff]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Golden Hour Action Plan
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">
                Golden Hour Action Plan: {completedCount} of {totalSteps} Completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-base font-black font-mono text-cyan-600 dark:text-[#00e5ff]">
              {progressPercent}%
            </span>

            {/* Reset Progress Button */}
            {completedCount > 0 && (
              <div>
                {showResetConfirm ? (
                  <div className="flex items-center gap-1.5 p-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl animate-in fade-in">
                    <span className="text-[11px] text-rose-700 dark:text-rose-400 font-bold px-1">
                      Reset?
                    </span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-2 py-0.5 text-[11px] font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-1.5 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-slate-800 transition-colors"
                    title="Reset all completed checklist steps"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Progress</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Animated Progress Bar */}
        <div
          className="w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="h-full bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] transition-all duration-500 ease-out rounded-full shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 3. Tab Navigation (NavLink) */}
      <nav aria-label="Recovery Steps Navigation" className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-2xl p-2.5 sm:p-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          
          {/* Tab 1: Step 1 Immediate Actions */}
          <NavLink
            to="/recover"
            end
            className={({ isActive }) =>
              `flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all border ${
                isActive
                  ? 'bg-cyan-500/10 dark:bg-[#00e5ff]/10 border-cyan-500/50 dark:border-[#00e5ff]/50 text-cyan-900 dark:text-[#00e5ff] shadow-sm'
                  : 'bg-slate-50/70 dark:bg-[#040711] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-mono transition-colors ${
                      isAllImmediateDone
                        ? 'bg-emerald-500 text-black font-bold'
                        : isActive
                        ? 'bg-gradient-to-br from-[#00e5ff] to-[#818cf8] text-black font-bold'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isAllImmediateDone ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    ) : (
                      '1'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display uppercase tracking-wider">
                        Step 1
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {completedCount}/{totalSteps} Done
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-950 dark:text-white">
                      Step 1: Immediate Actions (Golden Hour)
                    </p>
                  </div>
                </div>

                {isActive && (
                  <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-800 dark:text-[#00e5ff] font-mono">
                    Current
                  </span>
                )}
              </>
            )}
          </NavLink>

          {/* Tab 2: Step 2 Complaint Draft Generator */}
          <NavLink
            to="/recover/complaint"
            className={({ isActive }) =>
              `flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all border ${
                isActive
                  ? 'bg-cyan-500/10 dark:bg-[#00e5ff]/10 border-cyan-500/50 dark:border-[#00e5ff]/50 text-cyan-900 dark:text-[#00e5ff] shadow-sm'
                  : 'bg-slate-50/70 dark:bg-[#040711] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-mono transition-colors ${
                      isActive
                        ? 'bg-gradient-to-br from-[#00e5ff] to-[#818cf8] text-black font-bold'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display uppercase tracking-wider">
                        Step 2
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300">
                        Formal Police Draft
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-950 dark:text-white">
                      Step 2: Complaint Draft Generator
                    </p>
                  </div>
                </div>

                {isActive && (
                  <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-800 dark:text-[#00e5ff] font-mono">
                    Current
                  </span>
                )}
              </>
            )}
          </NavLink>

        </div>
      </nav>

      {/* 5. Nested Content via Outlet */}
      <main>
        <Outlet />
      </main>

      {/* 4. Footer Disclaimer */}
      <footer className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs sm:text-sm leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span className="uppercase tracking-wider font-mono text-xs">Official Cyber Crime Disclaimer & Warning</span>
        </div>
        <p>
          This is an independent, self-help educational complaint drafting tool intended to help victims quickly organize and structure critical facts. <strong>This tool does NOT automatically lodge, submit, or transmit a complaint to law enforcement or banking institutions.</strong> You must officially register and submit your complaint on the Government of India portal at{' '}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 inline-flex items-center gap-1"
          >
            cybercrime.gov.in
            <ExternalLink className="w-3 h-3" />
          </a>{' '}
          or by immediately calling the National Cyber Crime Helpline at <a href="tel:1930" className="underline font-bold text-rose-600 dark:text-rose-400">1930</a>.
        </p>
      </footer>

    </div>
  );
};

export default RecoverLayout;
