import React from 'react';
import { Sparkles, ShieldAlert, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { AiScamAnalyzer } from '../components/AiScamAnalyzer';

export const AiAnalyzerPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-[#00e5ff] text-xs font-bold font-mono tracking-wide">
          <Cpu className="w-3.5 h-3.5" />
          <span>Zero-Knowledge Multi-Vector Threat Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-display">
          Instant Multi-Vector <span className="text-gradient-cyber">Threat Scanner</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
          Screen SMS transcripts, verify suspicious phone numbers & shortcodes, and inspect spoofed email headers using our hybrid threat intelligence engine.
        </p>
      </div>

      {/* Main Analyzer Component */}
      <AiScamAnalyzer />

      {/* How the Multi-Vector Threat Engine Works */}
      <div className="bg-white/90 dark:bg-[#080d1a]/95 border border-slate-200/80 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm backdrop-blur-xl">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 font-display">
          <ShieldAlert className="w-5 h-5 text-cyan-600 dark:text-[#00e5ff]" />
          How The Hybrid Multi-Vector Threat Engine Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2.5 p-5 bg-slate-50/80 dark:bg-[#040711]/80 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm transition-all hover:border-cyan-500/40">
            <h4 className="font-bold text-cyan-600 dark:text-[#00e5ff] text-sm">1. SMS & Text Vectors</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Detects psychological urgency markers, fake government notices (CBI digital arrests), predatory shortcodes, and fraudulent lottery or task bait.
            </p>
          </div>

          <div className="space-y-2.5 p-5 bg-slate-50/80 dark:bg-[#040711]/80 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm transition-all hover:border-purple-500/40">
            <h4 className="font-bold text-purple-600 dark:text-[#c084fc] text-sm">2. Phone & Shortcode Registry</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Cross-references inbound numbers against community scam databases, identifies UK/Global premium toll traps (0871/0906), and flags VoIP spoofing.
            </p>
          </div>

          <div className="space-y-2.5 p-5 bg-slate-50/80 dark:bg-[#040711]/80 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm transition-all hover:border-indigo-500/40">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">3. Deep Email & Header Forensics</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Inspects SPF authentication failures, identifies disposable abuse TLDs (.xyz, .top), and blocks executable malware attachments (.exe, .bat, .vbs).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
