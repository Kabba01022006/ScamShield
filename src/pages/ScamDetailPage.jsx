import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  Calendar,
  User,
  Check,
  Copy,
  ThumbsUp,
  AlertTriangle,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useScams } from '../context/ScamContext';

// Same pattern as ScamCard: a lookup table instead of a switch statement.
const TYPE_ICONS = {
  Website: <Globe className="w-4 h-4" />,
  Email: <Mail className="w-4 h-4" />,
  'Phone Call': <Phone className="w-4 h-4" />,
  SMS: <MessageSquare className="w-4 h-4" />,
};
const DEFAULT_ICON = <AlertTriangle className="w-4 h-4" />;

export const ScamDetailPage = () => {
  const { id } = useParams();
  const { getScamById, incrementMeToo, hasVotedFor } = useScams();
  const [copied, setCopied] = useState(false);
  const [meTooMessage, setMeTooMessage] = useState(null);

  const scam = getScamById(id);

  // If the URL points to a scam ID that doesn't exist, show a friendly
  // "not found" message instead of crashing.
  if (!scam) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Report Not Found</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No report exists with ID <code className="font-mono font-bold">"{id}"</code>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/database" className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm">
            Browse Database
          </Link>
          <Link to="/" className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 text-sm font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isVoted = hasVotedFor(scam.id);

  const handleCopyIdentifier = () => {
    navigator.clipboard.writeText(scam.identifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMeTooClick = () => {
    incrementMeToo(scam.id);
    setMeTooMessage(
      isVoted ? 'Confirmation removed.' : 'Thanks! Your confirmation helps warn others.'
    );
    setTimeout(() => setMeTooMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Back link + report ID */}
      <div className="flex items-center justify-between">
        <Link to="/database" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 dark:text-slate-400">
          <ArrowLeft className="w-4 h-4" />
          Back to Database
        </Link>
        <span className="text-xs text-slate-500 font-mono font-bold">REF: #{scam.id.toUpperCase()}</span>
      </div>

      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200/90 dark:border-[#00e5ff]/20 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl dark:shadow-[0_0_35px_rgba(0,229,255,0.08)]">

        {/* Type badge, threat level, date, title, reporter */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 dark:bg-[#00e5ff]/10 dark:text-[#00e5ff] dark:border dark:border-[#00e5ff]/30">
              {TYPE_ICONS[scam.scamType] || DEFAULT_ICON}
              {scam.scamType}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${
              scam.threatLevel === 'Critical'
                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30'
            }`}>
              {scam.threatLevel || 'High'} Risk
            </span>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {scam.incidentDate}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{scam.title}</h1>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <User className="w-3.5 h-3.5" />
            Reported by: <strong className="text-slate-900 dark:text-slate-200">{scam.reportedBy || 'Anonymous'}</strong>
          </div>
        </div>

        {/* Reported identifier + copy button */}
        <div className="bg-slate-50 dark:bg-[#040711] rounded-2xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">
              Reported Website / Email / Number:
            </span>
            <div className="flex items-center gap-2 text-amber-800 dark:text-[#00e5ff] font-mono text-base font-extrabold">
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
              <span className="break-all">{scam.identifier}</span>
            </div>
          </div>
          <button
            onClick={handleCopyIdentifier}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#080d1a] hover:dark:bg-[#040711] dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00e5ff]" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        {/* "This happened to me too" */}
        <div className="bg-slate-50 dark:bg-[#040711] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white dark:bg-gradient-to-r dark:from-[#00e5ff] dark:to-[#a855f7] dark:text-black flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              {scam.meTooCount || 1}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {scam.meTooCount || 1} people have confirmed this scam.
            </p>
          </div>
          <button
            onClick={handleMeTooClick}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isVoted
                ? 'bg-emerald-600 text-white dark:bg-[#00e5ff] dark:text-black font-black'
                : 'bg-slate-900 hover:bg-black dark:bg-gradient-to-r dark:from-[#00e5ff] dark:via-[#818cf8] dark:to-[#a855f7] dark:text-black font-black text-white hover:opacity-95'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isVoted ? 'fill-current' : ''}`} />
            {isVoted ? 'Confirmed by You' : 'This Happened to Me Too'}
          </button>
        </div>

        {meTooMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 dark:bg-[#00e5ff]/10 dark:border-[#00e5ff]/30 rounded-xl text-emerald-900 dark:text-[#00e5ff] text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {meTooMessage}
          </div>
        )}

        {/* Full description */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600 dark:text-[#00e5ff]" />
            What Happened
          </h2>
          <div className="bg-slate-50 dark:bg-[#040711] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {scam.description}
          </div>
        </div>

        {/* Red flags, if provided on this scam entry */}
        {scam.redFlags?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Red Flags to Watch For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scam.redFlags.map((flag, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                  {flag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prevention tip, if provided */}
        {scam.preventionTip && (
          <div className="bg-teal-50 dark:bg-[#00e5ff]/10 border border-teal-200 dark:border-[#00e5ff]/30 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-teal-900 dark:text-[#00e5ff] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              How to Protect Yourself
            </h3>
            <p className="text-xs text-teal-800 dark:text-slate-300">{scam.preventionTip}</p>
          </div>
        )}

        {/* Footer navigation */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <Link to="/database" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#040711] dark:border dark:border-slate-800 dark:hover:border-[#00e5ff]/30 dark:text-slate-200 text-xs font-bold transition-all">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Database
          </Link>
          <Link to="/report" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-gradient-to-r dark:from-[#00e5ff] dark:via-[#818cf8] dark:to-[#a855f7] dark:text-black text-white text-xs font-black shadow-md shadow-[#00e5ff]/20 hover:opacity-95 transition-all">
            Report Another Scam
          </Link>
        </div>

      </div>
    </div>
  );
};
