import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, Phone, Mail, FileText, Users,
  RefreshCw, Search, ArrowRight, PhoneCall,
} from 'lucide-react';
import { useScams } from '../context/ScamContext';
import { API_BASE_URL } from '../config';

const card = 'bg-white dark:bg-[#080d1a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl';

// Turns "DIGITAL_ARREST" into "Digital arrest"
const prettify = (text = '') => {
  const t = text.replace(/_/g, ' ').toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const DashboardPage = () => {
  const { scams } = useScams();

  // Data from the backend (phone + email blacklists)
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Quick check box
  const [input, setInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const loadIntel = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard-intel`);
      if (res.ok) setIntel(await res.json());
    } catch (err) {
      console.warn('Could not load dashboard data:', err.message);
    } finally {
      setLoading(false);
      if (manual) setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadIntel();
    const timer = setInterval(loadIntel, 30000); // refresh every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const phones = intel?.phoneThreats || [];
  const emails = intel?.emailThreats || [];
  const confirmations = scams.reduce((sum, s) => sum + (s.meTooCount || 1), 0);

  // One combined list: blacklisted phones + emails + community reports
  const allThreats = useMemo(() => {
    const list = [];
    scams.forEach((s) => list.push({
      id: `r-${s.id}`,
      kind: 'Report',
      name: s.identifier || s.title,
      category: s.scamType || 'Fraud',
      reports: s.meTooCount || 1,
      critical: (s.threatLevel || '').toUpperCase() === 'CRITICAL',
      to: `/scam/${s.id}`,
    }));
    phones.forEach((p) => list.push({
      id: `p-${p.id}`,
      kind: 'Phone',
      name: p.phone_number,
      category: prettify(p.threat_category),
      reports: p.report_count,
      critical: p.report_count > 80,
    }));
    emails.forEach((e) => list.push({
      id: `e-${e.id}`,
      kind: 'Email',
      name: e.email_address,
      category: prettify(e.threat_category),
      reports: e.report_count,
      critical: e.report_count > 80,
    }));
    return list.sort((a, b) => (b.reports || 0) - (a.reports || 0));
  }, [scams, phones, emails]);

  const topThreats = allThreats.slice(0, 8);

  // Top scam types, counted from the real data
  const topTypes = useMemo(() => {
    const counts = {};
    allThreats.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + (t.reports || 1);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = sorted[0]?.[1] || 1;
    return sorted.map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }));
  }, [allThreats]);

  // Quick check: figures out if the input is a phone, email, or message
  const runCheck = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setChecking(true);
    setResult(null);

    let url = `${API_BASE_URL}/api/analyze`;
    let body = { message: text };
    if (text.includes('@') && !text.includes(' ')) {
      url = `${API_BASE_URL}/api/analyze-email`;
      body = { email: text };
    } else if (/^\+?\d[\d\s-]{6,15}\d$/.test(text.replace(/[()]/g, ''))) {
      url = `${API_BASE_URL}/api/analyze-phone`;
      body = { phone: text };
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Service busy');
      setResult({ text, data: await res.json() });
    } catch {
      setResult({ text, error: 'Could not run the check right now. Please try again.' });
    } finally {
      setChecking(false);
    }
  };

  const stats = [
    { label: 'Scam phone numbers', value: phones.length,     icon: Phone    },
    { label: 'Scam emails',        value: emails.length,     icon: Mail     },
    { label: 'Community reports',  value: scams.length,      icon: FileText },
    { label: 'People who confirmed', value: confirmations,   icon: Users    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            A quick look at reported scams across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadIntel(true)} disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <Link to="/report"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] text-black text-sm font-black shadow-lg shadow-[#00e5ff]/20">
            <ShieldAlert className="w-4 h-4" /> Report a scam
          </Link>
        </div>
      </section>

      {/* Shown only if the backend server is not running */}
      {!loading && !intel && (
        <p className="text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3 font-medium">
          The live database is offline, so only community reports are shown. Start the backend server to see phone and email data.
        </p>
      )}

      {/* 2. NUMBERS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${card} p-5 space-y-2`}>
            <Icon className="w-5 h-5 text-cyan-600 dark:text-[#00e5ff]" />
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">{loading ? '–' : value}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
          </div>
        ))}
      </section>

      {/* 3. QUICK CHECK + TOP SCAM TYPES (one card) */}
      <section className={`${card} p-6 sm:p-8 space-y-6`}>

        {/* Quick check */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Quick check</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Paste a phone number, email, or suspicious message to see if it's a scam.
            </p>
          </div>

          <form onSubmit={runCheck} className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="+91 98765 43210, name@site.com, or a message"
              className="flex-1 min-w-0 px-3.5 py-3 bg-slate-50 dark:bg-[#040711] border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff]" />
            <button type="submit" disabled={checking || !input.trim()}
              className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-[#00e5ff] text-white dark:text-black text-sm font-black disabled:opacity-50 flex items-center gap-2">
              {checking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {checking ? 'Checking' : 'Check'}
            </button>
          </form>

          {result?.error && (
            <p className="text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3">
              {result.error}
            </p>
          )}

          {result?.data && (
            <div className={`rounded-xl border p-4 space-y-2 ${
              result.data.is_scam
                ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30'
                : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 text-sm font-extrabold ${
                  result.data.is_scam ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'
                }`}>
                  {result.data.is_scam ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {result.data.is_scam ? 'Looks like a scam' : 'Looks safe'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  Risk {result.data.risk_score ?? (result.data.is_scam ? 95 : 5)}/100
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.data.justification || prettify(result.data.threat_category) ||
                  (result.data.is_scam ? 'This matches a known scam pattern.' : 'No warning signs found.')}
              </p>
              {result.data.victim_advice && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>What to do:</strong> {result.data.victim_advice}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-1 text-sm font-bold">
                {result.data.is_scam && (
                  <Link to={`/report?identifier=${encodeURIComponent(result.text)}`}
                    className="text-rose-700 dark:text-rose-300 hover:underline">Report it</Link>
                )}
                <Link to="/analyze" className="text-cyan-700 dark:text-[#00e5ff] hover:underline">Open full AI Scanner</Link>
              </div>
            </div>
          )}
        </div>

        {/* Top scam types */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Top scam types</h3>
            <span className="text-xs text-slate-400">Number of reports</span>
          </div>

          {topTypes.length === 0 ? (
            <p className="text-sm text-slate-500">No data yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
              {topTypes.map((t) => (
                <div key={t.name} className="space-y-1">
                  <div className="flex justify-between gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span className="truncate">{t.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">{t.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#a855f7]" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. MOST REPORTED */}
      <section className={`${card} p-6 space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Most reported right now</h2>
          <Link to="/database" className="inline-flex items-center gap-1 text-sm font-bold text-cyan-700 dark:text-[#00e5ff] hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {topThreats.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No threats to show yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {topThreats.map((t) => {
              const row = (
                <>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.kind} · {t.category}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {t.critical && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                        CRITICAL
                      </span>
                    )}
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                      {t.reports} <span className="text-xs font-normal text-slate-400">reports</span>
                    </span>
                  </div>
                </>
              );
              return (
                <li key={t.id}>
                  {t.to ? (
                    <Link to={t.to} className="flex items-center justify-between gap-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors">{row}</Link>
                  ) : (
                    <div className="flex items-center justify-between gap-4 py-3">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 5. HELP BANNER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <strong className="text-rose-700 dark:text-rose-300">Lost money to a scam?</strong> Call 1930 right away. The sooner you report, the better the chance of freezing the money.
        </p>
        <a href="tel:1930"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shrink-0 transition-colors">
          <PhoneCall className="w-4 h-4" /> Call 1930
        </a>
      </section>

    </div>
  );
};
