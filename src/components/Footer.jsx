import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ExternalLink, RefreshCw, Lock, Radio, PhoneCall } from 'lucide-react';
import { useScams } from '../context/ScamContext';

export const Footer = () => {
  const { resetToSampleData } = useScams();

  return (
    <footer className="bg-white/90 dark:bg-[#000000]/95 border-t border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 mt-auto relative overflow-hidden transition-colors backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3.5">
            <Link to="/" className="flex items-center gap-2.5 text-slate-950 dark:text-white font-black text-lg group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#00e5ff] via-[#818cf8] to-[#a855f7] p-0.5 shadow-md shadow-[#00e5ff]/25 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="font-display">ScamShield<span className="text-gradient-cyber">AI</span></span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Open cyber threat intelligence network helping citizens identify, report, and neutralize scam operations through collective vigilance across India.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/25 dark:border-cyan-500/30 text-xs text-cyan-700 dark:text-[#00e5ff] font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
              <span>National Threat Defense Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-display">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Defense Tools
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-slate-950 dark:hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  SOC Threat Dashboard <span className="text-[10px] bg-purple-500/20 text-purple-700 dark:text-[#c084fc] px-1.5 py-0.2 rounded font-mono font-black border border-purple-500/30">LIVE</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  India Threat Radar Map
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1">
                  AI Scam Analyzer <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.2 rounded font-mono font-bold text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-white/10">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-slate-950 dark:hover:text-white transition-colors">Identifier Search & Verify</Link>
              </li>
              <li>
                <Link to="/database" className="hover:text-slate-950 dark:hover:text-white transition-colors">Public Threat Database</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors font-bold text-cyan-600 dark:text-[#00e5ff]">
                  + Submit Threat Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Information */}
          <div>
            <h4 className="text-xs font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-display">
              <Lock className="w-3.5 h-3.5 text-teal-500" />
              Safety Resources
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/about" className="hover:text-slate-950 dark:hover:text-white transition-colors">About ScamShieldAI</Link>
              </li>
              <li>
                <Link to="/about#emergency" className="text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors font-bold">
                  🚨 Emergency: If You Were Scammed
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>National Helpline: Dial 1930</span>
                </div>
              </li>
              <li>
                <Link to="/about#faq" className="hover:text-slate-950 dark:hover:text-white transition-colors">Security FAQ</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-950 dark:hover:text-white transition-colors">Community Sentinel Login</Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (window.confirm("Restore default threat intelligence dataset?")) {
                      resetToSampleData();
                      alert("Database restored to default threat records!");
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mt-2"
                  title="Reload verified threat dataset"
                >
                  <RefreshCw className="w-3 h-3" /> Restore Default Intel Dataset
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Advisory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              Community Threat Advisory
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-1">
              <strong className="text-slate-900 dark:text-slate-200 block font-bold font-display">National Protocol:</strong>
              <p>ScamShieldAI reports are crowdsourced by community sentinels. In case of immediate financial fraud, dial <strong>1930</strong> or register an instant complaint at <strong>cybercrime.gov.in</strong>.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ScamShieldAI Cyber Threat Intelligence Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy & Data Governance</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Intelligence Team</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
