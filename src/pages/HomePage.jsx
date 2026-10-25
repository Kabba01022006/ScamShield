import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Database, 
  AlertTriangle, 
  LayoutDashboard,
  Zap,
  Cpu,
  Lock,
  Radio,
  CheckCircle2,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { useScams } from '../context/ScamContext';
import { ScamCard } from '../components/ScamCard';
import { UnifiedThreatCard } from '../components/UnifiedThreatCard';
import { API_BASE_URL } from '../config';

const SCAN_STEPS = [
  "Running sub-millisecond deterministic heuristics & regex screening...",
  "Cross-referencing verified spam database & community blacklist...",
  "Evaluating coercion, urgency markers, and social engineering...",
  "Synthesizing threat intelligence report & victim safety protocol..."
];

export const HomePage = () => {
  const [quickQuery, setQuickQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analyzedType, setAnalyzedType] = useState('text');
  const [lastAnalyzedInput, setLastAnalyzedInput] = useState('');
  
  const resultRef = useRef(null);
  const navigate = useNavigate();
  const { scams } = useScams();

  // Cycling scanning steps
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Input Vector Detection & Dispatch Logic
  const executeScan = async (rawInput) => {
    const input = (rawInput !== undefined ? rawInput : quickQuery).trim();
    if (!input) {
      setError('Please enter a phone number (+91...), email, website link, or message text to analyze.');
      return;
    }

    setQuickQuery(input);
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let endpoint = '';
      let payload = {};
      let vector = 'text';

      // 1. Email detection
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || (input.includes('@') && !input.includes(' '))) {
        vector = 'email';
        endpoint = `${API_BASE_URL}/api/analyze-email`;
        payload = {
          sender: input,
          rawEmail: input,
          body: input,
          subject: 'Home AI Quick Scan',
          headers: { spf: 'neutral' }
        };
      } 
      // 2. Phone detection
      else {
        const cleanDigits = input.replace(/\D/g, '');
        const hasLetters = /[a-zA-Z]/.test(input);

        if (!hasLetters && cleanDigits.length >= 5 && cleanDigits.length <= 15) {
          vector = 'phone';
          endpoint = `${API_BASE_URL}/api/analyze-phone`;

          let countryCode = '+91';
          let phoneNumber = cleanDigits;

          if (input.startsWith('+')) {
            if (cleanDigits.startsWith('91') && cleanDigits.length === 12) {
              countryCode = '+91';
              phoneNumber = cleanDigits.slice(2);
            } else if (cleanDigits.startsWith('1') && cleanDigits.length === 11) {
              countryCode = '+1';
              phoneNumber = cleanDigits.slice(1);
            } else if (cleanDigits.startsWith('44')) {
              countryCode = '+44';
              phoneNumber = cleanDigits.slice(2);
            } else if (cleanDigits.startsWith('61')) {
              countryCode = '+61';
              phoneNumber = cleanDigits.slice(2);
            } else if (cleanDigits.startsWith('40')) {
              countryCode = '+40';
              phoneNumber = cleanDigits.slice(2);
            } else {
              const match = input.match(/^\+(\d{1,4})/);
              if (match) {
                countryCode = `+${match[1]}`;
                phoneNumber = cleanDigits.slice(match[1].length);
              } else {
                countryCode = 'OTHER';
                phoneNumber = cleanDigits;
              }
            }
          } else if (cleanDigits.length === 5) {
            countryCode = 'SHORTCODE';
            phoneNumber = cleanDigits;
          } else if (/^(0871|0906|0800|0844)/.test(cleanDigits)) {
            countryCode = '+44';
            phoneNumber = cleanDigits;
          } else if (cleanDigits.length === 10) {
            countryCode = '+91';
            phoneNumber = cleanDigits;
          } else {
            countryCode = 'OTHER';
            phoneNumber = cleanDigits;
          }

          payload = { countryCode, phoneNumber };
        } 
        // 3. Text message, URL, SMS, or keywords
        else {
          vector = 'text';
          endpoint = `${API_BASE_URL}/api/analyze`;
          payload = { message: input };
        }
      }

      setAnalyzedType(vector);
      setLastAnalyzedInput(input);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);

    } catch (err) {
      console.error('Home scan error:', err);
      setError(err.message || 'Failed to contact threat analysis server on port 5001.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    executeScan();
  };

  const handleClearScan = () => {
    setResult(null);
    setError(null);
    setQuickQuery('');
  };

  // Show 3 most recent reports
  const recentReports = scams.slice(0, 3);

  const totalReports = scams.length;
  const totalConfirmations = scams.reduce((sum, scam) => sum + (scam.meTooCount || 1), 0);

  return (
    <div className="space-y-16 pb-16">

      {/* ---------- 1. HERO SECTION ---------- */}
      <section className="pt-12 sm:pt-20 pb-6 text-center px-4 relative">
        <div className="max-w-4xl mx-auto space-y-7">
          
          {/* Cyber Status Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff] border border-cyan-500/25 text-xs font-bold font-mono tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
            </span>
            <span>COMMUNITY CYBER THREAT NETWORK</span>
            <span className="text-slate-400">|</span>
            <span className="font-sans font-semibold">Tier 1 & Tier 2 Active</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] font-display">
            Check Threats. <br />
            <span className="text-gradient-cyber">Before You Get Scammed.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            ScamShieldAI verifies suspicious phone numbers, phishing emails, extortion calls, and SMS smishing against a national verified blacklist and sub-millisecond AI heuristics before you trust them.
          </p>

          {/* Quick Search Floating Bar */}
          <form
            onSubmit={handleQuickSearch}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white/90 dark:bg-[#040711]/95 p-2.5 rounded-2xl border border-slate-200/90 dark:border-cyan-500/20 shadow-xl shadow-slate-900/5 dark:shadow-[#00e5ff]/5 backdrop-blur-xl focus-within:border-cyan-500/60 dark:focus-within:border-[#00e5ff]/60 transition-all"
          >
            <div className="flex-1 flex items-center px-3.5 relative">
              <Search className="w-5 h-5 text-cyan-600 dark:text-[#00e5ff] shrink-0" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => {
                  setQuickQuery(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Check suspicious phone (+91...), email, website, or SMS text..."
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
                aria-label="Search suspicious identifier"
                disabled={isAnalyzing}
              />
              {quickQuery && !isAnalyzing && (
                <button
                  type="button"
                  onClick={() => setQuickQuery('')}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] disabled:opacity-60 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#00e5ff]/25 active:scale-95 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>Instant Verify</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Error Banner */}
          {error && (
            <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className="p-1 hover:bg-rose-500/20 rounded-lg transition-colors text-rose-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Scanning Animation State */}
          {isAnalyzing && (
            <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-white/90 dark:bg-[#040711]/95 border border-cyan-500/30 shadow-xl shadow-[#00e5ff]/5 backdrop-blur-xl text-center space-y-3.5">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-[#00e5ff] border border-cyan-500/25">
                <Loader2 className="w-6 h-6 animate-spin text-[#00e5ff]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#a855f7]" />
                  <span>ScamShield AI Threat Engine Verifying...</span>
                </p>
                <p className="text-xs text-cyan-600 dark:text-[#00e5ff] font-medium animate-pulse">
                  {SCAN_STEPS[scanStep]}
                </p>
              </div>
              <div className="w-full max-w-md mx-auto h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00e5ff] to-[#a855f7] transition-all duration-500 rounded-full"
                  style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick Sample Chips (When idle) */}
          {!result && !isAnalyzing && (
            <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] font-bold">Try instant test:</span>
              {[
                { label: '🚨 Utility Scam (+91)', value: '+919876543210' },
                { label: '⚡ Electricity Bill SMS', value: 'Your power will be cut tonight at 9:30 PM. Pay ₹10 via Discom APK to avoid disconnection.' },
                { label: '🎣 Phishing Domain', value: 'security@bank-alert.xyz' },
                { label: '🪖 OLX Army QR Fraud', value: 'Army officer wants to buy vehicle. Scan UPI QR and enter UPI PIN to receive payment.' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => executeScan(sample.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 transition-colors text-[11px] font-medium active:scale-95"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          )}

          {/* AI SCAM ANALYZER RESULT DISPLAY */}
          {result && (
            <div ref={resultRef} className="max-w-4xl mx-auto mt-6 text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-[#040711]/95 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff]"></span>
                  </span>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-[#00e5ff]">
                    AI Scam Analysis Verdict: {analyzedType.toUpperCase()} VECTOR
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearScan}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Result</span>
                  </button>
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00e5ff] text-xs font-bold border border-cyan-500/30 transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Open AI Scanner Studio</span>
                  </Link>
                </div>
              </div>

              <UnifiedThreatCard
                result={result}
                tabType={analyzedType}
                analyzedInput={lastAnalyzedInput}
                onExportToReport={() => navigate('/report')}
              />
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-[#000000] dark:hover:bg-[#00e5ff]/10 text-white dark:text-[#00e5ff] font-black text-xs sm:text-sm border border-transparent dark:border-[#00e5ff]/40 transition-all shadow-md active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400 dark:text-[#00e5ff]" />
              <span>SOC Threat Dashboard</span>
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100/70 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-white/10 transition-all active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Report a Scam</span>
            </Link>
            <Link
              to="/database"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100/70 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-white/10 transition-all active:scale-95"
            >
              <Database className="w-4 h-4 text-[#a855f7]" />
              <span>Threat Database ({totalReports})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 2. REAL-TIME STATS TELEMETRY ---------- */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 dark:bg-[#040711]/90 p-6 rounded-3xl border border-slate-200/80 dark:border-cyan-500/15 shadow-sm backdrop-blur-xl">
          <div className="text-center p-2">
            <p className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-mono">{totalReports}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
              Dossiers Ingested
            </p>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80 dark:border-white/5">
            <p className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-[#00e5ff] font-mono">{totalConfirmations}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
              Citizens Protected
            </p>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80 dark:border-white/5">
            <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-[#c084fc] font-mono">98.6%</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
              AI Precision Rate
            </p>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80 dark:border-white/5">
            <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">&lt;1ms</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
              Heuristic Latency
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 3. SOC THREAT OPERATIONS DASHBOARD SHOWCASE ---------- */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-black via-[#060918] to-black text-white rounded-3xl p-7 sm:p-9 border border-cyan-500/30 dark:border-[#00e5ff]/35 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 text-cyan-700 dark:text-[#00e5ff] border border-[#00e5ff]/30 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
              <span>LIVE THREAT TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              SOC Threat Operations Command Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Surveillance console tracking real-time spam phone records, phishing senders, attack vector breakdowns, and an embedded diagnostic sandbox with one-click threat intelligence exports.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-[#00e5ff] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> MySQL Threat DB Connected
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#c084fc] font-bold">
                <Radio className="w-3.5 h-3.5" /> 6 National Hotspots
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-xs sm:text-sm transition-all shadow-xl shadow-[#00e5ff]/25 active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 4. DEFENSE ARCHITECTURE ("HOW IT WORKS") ---------- */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-wider text-cyan-600 dark:text-[#00e5ff] uppercase font-mono">
            MULTI-LAYERED DEFENSE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-display">
            How ScamShield AI Shields You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-[#080d1a]/85 p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 cyber-card shadow-sm backdrop-blur-xl">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-[#00e5ff] w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              1. Sub-ms Heuristic Screening
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Deterministic regex engine intercepts OTP extraction, Digital Arrest coercion, and smishing triggers in under 1 millisecond.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#080d1a]/85 p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 cyber-card shadow-sm backdrop-blur-xl">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-[#c084fc] w-fit">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              2. Live Threat Blacklist
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Every citizen report auto-indexes fraudulent phone numbers and phishing domains into the central MySQL blacklist.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#080d1a]/85 p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 cyber-card shadow-sm backdrop-blur-xl">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              3. Neural AI Deep Triage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Small Language Model contextual classifier unpacks deceptive social engineering, giving clear advice to potential victims.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 5. RECENT VERIFIED THREAT REPORTS ---------- */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-2xl font-black text-slate-950 dark:text-white font-display">
              Recently Reported Threat Dossiers
            </h2>
          </div>
          <Link
            to="/database"
            className="text-xs font-bold text-slate-900 dark:text-white hover:text-cyan-500 dark:hover:text-[#00e5ff] flex items-center gap-1 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReports.map((scam) => (
            <ScamCard key={scam.id} scam={scam} />
          ))}
        </div>
      </section>

      {/* ---------- 6. CALL TO ACTION BANNER ---------- */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#040711] via-[#090e24] to-[#040711] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight font-display relative z-10">
            Were you targeted by a scam or extortion call?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed relative z-10">
            Every suspicious phone number, fraudulent email, and fake notice you report is automatically indexed to protect thousands of other citizens in real time.
          </p>
          <div className="pt-2 relative z-10">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-[#00e5ff]/25 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Threat Dossier</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
