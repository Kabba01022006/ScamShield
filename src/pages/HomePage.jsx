import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Loader2, X, AlertTriangle, Cpu, PhoneCall, ShieldCheck,
  FilePlus2, Siren, Landmark, Smartphone, Briefcase,
} from 'lucide-react';
import { useScams } from '../context/ScamContext';
import { ScamCard } from '../components/ScamCard';
import { UnifiedThreatCard } from '../components/UnifiedThreatCard';
import { API_BASE_URL } from '../config';

const card = 'bg-white dark:bg-[#080d1a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl';

// Examples visitors can click to try the checker
const EXAMPLES = [
  { label: 'Fake phone number',    value: '+919876543210' },
  { label: 'Electricity bill SMS', value: 'Your power will be cut tonight at 9:30 PM. Pay ₹10 via Discom APK to avoid disconnection.' },
  { label: 'Phishing email',       value: 'security@bank-alert.xyz' },
];

// "How it works" steps
const STEPS = [
  { title: 'Paste it',            desc: 'Enter the phone number, email, website, or message that looks suspicious.' },
  { title: 'We check it',         desc: 'We compare it with scams people have reported and look for known scam patterns.' },
  { title: 'Know what to do',     desc: 'You get a risk level, the warning signs we found, and clear advice on what to do next.' },
];

// Common scams (full details are on the About page)
const SCAMS = [
  { icon: Siren,      title: 'Digital Arrest',      how: 'A fake police or CBI officer says you are "under arrest" on a video call and asks for money.' },
  { icon: Landmark,   title: 'Fake KYC / OTP',      how: 'A message says your bank account will be blocked unless you click a link and update KYC.' },
  { icon: Smartphone, title: 'UPI Refund Trick',    how: 'Someone asks you to enter your UPI PIN "to receive money". That only sends money out.' },
  { icon: Briefcase,  title: 'Task / Job Scam',     how: 'A WhatsApp job pays a little at first, then asks you to deposit money to continue.' },
];

// Rules that stop most scams
const RULES = [
  'Never share your OTP, PIN, or CVV with anyone, even if they say they are from your bank.',
  'Police and CBI never arrest anyone over a video call. Hang up and call 1930.',
  'You never need to enter a PIN to receive money.',
  'A real job never asks you to pay money first.',
];

// Works out whether the input is an email, phone number, or message,
// and returns where to send it.
const buildRequest = (input) => {
  // Email
  if (input.includes('@') && !input.includes(' ')) {
    return {
      vector: 'email',
      endpoint: `${API_BASE_URL}/api/analyze-email`,
      payload: { sender: input, rawEmail: input, body: input, subject: 'Home AI Quick Scan', headers: { spf: 'neutral' } },
    };
  }

  // Phone number
  const digits = input.replace(/\D/g, '');
  const hasLetters = /[a-zA-Z]/.test(input);
  if (!hasLetters && digits.length >= 5 && digits.length <= 15) {
    let countryCode = '+91';
    let phoneNumber = digits;

    if (input.startsWith('+')) {
      if (digits.startsWith('91') && digits.length === 12) { phoneNumber = digits.slice(2); }
      else if (digits.startsWith('1') && digits.length === 11) { countryCode = '+1'; phoneNumber = digits.slice(1); }
      else if (digits.startsWith('44')) { countryCode = '+44'; phoneNumber = digits.slice(2); }
      else if (digits.startsWith('61')) { countryCode = '+61'; phoneNumber = digits.slice(2); }
      else if (digits.startsWith('40')) { countryCode = '+40'; phoneNumber = digits.slice(2); }
      else {
        const match = input.match(/^\+(\d{1,4})/);
        if (match) { countryCode = `+${match[1]}`; phoneNumber = digits.slice(match[1].length); }
        else { countryCode = 'OTHER'; }
      }
    } else if (digits.length === 5) {
      countryCode = 'SHORTCODE';
    } else if (/^(0871|0906|0800|0844)/.test(digits)) {
      countryCode = '+44';
    } else if (digits.length !== 10) {
      countryCode = 'OTHER';
    }

    return {
      vector: 'phone',
      endpoint: `${API_BASE_URL}/api/analyze-phone`,
      payload: { countryCode, phoneNumber },
    };
  }

  // Anything else: treat as a message or link
  return { vector: 'text', endpoint: `${API_BASE_URL}/api/analyze`, payload: { message: input } };
};

export const HomePage = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analyzedType, setAnalyzedType] = useState('text');
  const [lastInput, setLastInput] = useState('');

  const resultRef = useRef(null);
  const navigate = useNavigate();
  const { scams } = useScams();

  const recentReports = scams.slice(0, 3);
  const confirmations = scams.reduce((sum, s) => sum + (s.meTooCount || 1), 0);

  const runCheck = async (rawInput) => {
    const input = (rawInput !== undefined ? rawInput : query).trim();
    if (!input) {
      setError('Please enter a phone number, email, website, or message to check.');
      return;
    }

    setQuery(input);
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const { vector, endpoint, payload } = buildRequest(input);
      setAnalyzedType(vector);
      setLastInput(input);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      setResult(await res.json());
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    } catch (err) {
      console.error('Home check error:', err);
      setError(err.message || 'Could not reach the server. Make sure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearCheck = () => {
    setResult(null);
    setError(null);
    setQuery('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-14 pb-12">

      {/* 1. HERO: headline + checker */}
      <section className="text-center space-y-6 pt-8 sm:pt-14">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
          Not sure if it&rsquo;s a scam? <br />
          <span className="text-gradient-cyber">Check it first.</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
          Got a strange call, message, or email? Paste the phone number, email, website, or message
          below and we&rsquo;ll tell you if it looks like a scam.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); runCheck(); }}
          className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white dark:bg-[#040711] p-2 rounded-2xl border border-slate-200 dark:border-cyan-500/20 shadow-lg focus-within:border-cyan-500 dark:focus-within:border-[#00e5ff]/60 transition-colors">
          <div className="flex-1 flex items-center px-3">
            <Search className="w-5 h-5 text-cyan-600 dark:text-[#00e5ff] shrink-0" />
            <input type="text" value={query} disabled={isAnalyzing}
              onChange={(e) => { setQuery(e.target.value); if (error) setError(null); }}
              placeholder="Phone number, email, website, or message"
              aria-label="Phone number, email, website, or message to check"
              className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium" />
            {query && !isAnalyzing && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button type="submit" disabled={isAnalyzing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] text-black font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95 transition-transform">
            {isAnalyzing
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
              : <>Check now <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {isAnalyzing && (
          <p className="text-sm text-cyan-700 dark:text-[#00e5ff] font-medium animate-pulse">
            Checking reports and scam patterns. This takes a few seconds.
          </p>
        )}

        {error && (
          <div className="max-w-2xl mx-auto flex items-start justify-between gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm font-medium text-left">
            <span className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </span>
            <button onClick={() => setError(null)} aria-label="Dismiss" className="p-0.5 shrink-0"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Examples (hidden once there is a result) */}
        {!result && !isAnalyzing && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Try an example:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex.label} type="button" onClick={() => runCheck(ex.value)}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-semibold transition-colors">
                {ex.label}
              </button>
            ))}
          </div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="text-left space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Result</h2>
              <div className="flex items-center gap-2">
                <button onClick={clearCheck}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" /> Clear
                </button>
                <Link to="/analyze"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-sm font-bold text-cyan-700 dark:text-[#00e5ff] hover:bg-cyan-500/20 transition-colors">
                  <Cpu className="w-4 h-4" /> Open full AI Scanner
                </Link>
              </div>
            </div>

            <UnifiedThreatCard
              result={result}
              tabType={analyzedType}
              analyzedInput={lastInput}
              onExportToReport={() => navigate('/report')}
            />
          </div>
        )}
      </section>

      {/* 2. HOW IT WORKS + NUMBERS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">How it works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className={`${card} p-6 space-y-3`}>
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#a855f7] text-black text-sm font-black flex items-center justify-center">
                {i + 1}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className={`${card} grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 text-center`}>
          <div className="p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">{scams.length}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Scams reported</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-600 dark:text-[#00e5ff]">{confirmations}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">People confirmed them</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400">1930</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">National cyber crime helpline</div>
          </div>
        </div>
      </section>

      {/* 3. SCAMS TO WATCH OUT FOR */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Scams to watch out for</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">The most common ones in India right now.</p>
          </div>
          <Link to="/about#learn" className="inline-flex items-center gap-1 text-sm font-bold text-cyan-700 dark:text-[#00e5ff] hover:underline shrink-0">
            Learn more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCAMS.map(({ icon: Icon, title, how }) => (
            <div key={title} className={`${card} p-5 space-y-2`}>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{how}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SAFETY RULES */}
      <section className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">4 rules that stop most scams</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. RECENT REPORTS */}
      {recentReports.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Recently reported scams</h2>
            <Link to="/database" className="inline-flex items-center gap-1 text-sm font-bold text-cyan-700 dark:text-[#00e5ff] hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReports.map((scam) => <ScamCard key={scam.id} scam={scam} />)}
          </div>
        </section>
      )}

      {/* 6. REPORT + HELP */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${card} p-6 space-y-3`}>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Got a scam call or message?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Report it. Your report helps warn other people before they get tricked.
          </p>
          <Link to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] text-black text-sm font-black">
            <FilePlus2 className="w-4 h-4" /> Report a scam
          </Link>
        </div>

        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Already lost money?</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Call 1930 right away. The sooner you report, the better the chance of getting it back.{' '}
            <Link to="/about#emergency" className="font-bold text-rose-700 dark:text-rose-300 hover:underline">What to do next</Link>
          </p>
          <a href="tel:1930"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors">
            <PhoneCall className="w-4 h-4" /> Call 1930
          </a>
        </div>
      </section>

    </div>
  );
};
