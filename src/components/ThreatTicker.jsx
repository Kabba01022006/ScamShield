import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, Sparkles, TrendingUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThreatTicker = () => {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const alerts = [
    {
      level: "CRITICAL",
      text: "Mass Phishing Campaign: Fake USPS & Toll SMS targeting +1 area codes with fraudulent $0.35-$11.50 payment portals.",
      link: "/search?q=usps",
      tag: "SMS Attack"
    },
    {
      level: "HIGH",
      text: "Voice Spoofing Surge: Callers posing as Chase & Wells Fargo Fraud Teams demanding 2FA security codes.",
      link: "/search?q=chase",
      tag: "VOIP Spoofing"
    },
    {
      level: "CRITICAL",
      text: "DeFi Staking Fraud: Cloned investment websites promising 18% daily return draining connected Web3 wallets.",
      link: "/search?q=crypto",
      tag: "Crypto Drainer"
    },
    {
      level: "HIGH",
      text: "PDF Invoice Malware: Fake Geek Squad & Amazon Prime annual renewal emails requesting AnyDesk installs.",
      link: "/search?q=amazon",
      tag: "Email Phish"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [alerts.length]);

  if (dismissed) return null;

  const currentAlert = alerts[tickerIndex];

  return (
    <div className="bg-rose-50 dark:bg-gradient-to-r dark:from-[#000000] dark:via-[#080d1a] dark:to-[#000000] border-b border-rose-200 dark:border-[#00e5ff]/20 text-xs py-2 px-4 transition-all relative z-50 text-slate-800 dark:text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-bold tracking-wider text-rose-700 dark:text-rose-400 uppercase text-[10px] hidden sm:inline flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Live Threat Intel
          </span>
          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 font-mono text-[10px] font-bold border border-rose-300 dark:border-rose-500/30">
            {currentAlert.tag}
          </span>
        </div>

        {/* Scrolling text */}
        <div className="flex-1 truncate text-center sm:text-left transition-opacity duration-300 font-medium">
          <span className="mr-2 text-rose-700 dark:text-rose-300 font-bold hidden md:inline">[{currentAlert.level}]</span>
          <span className="text-slate-800 dark:text-slate-200 hover:underline">{currentAlert.text}</span>
          <Link
            to={currentAlert.link}
            className="ml-2 text-teal-700 dark:text-[#00e5ff] hover:text-teal-900 dark:hover:text-[#c084fc] underline font-bold inline-flex items-center gap-0.5"
          >
            Investigate
          </Link>
        </div>

        {/* Right close */}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-1 shrink-0"
          title="Dismiss threat ticker"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
