import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Share2,
  AlertTriangle,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Users,
  Copy,
  Check
} from 'lucide-react';

const TYPE_ICONS = {
  Website: <Globe className="w-3.5 h-3.5" />,
  Email: <Mail className="w-3.5 h-3.5" />,
  'Phone Call': <Phone className="w-3.5 h-3.5" />,
  SMS: <MessageSquare className="w-3.5 h-3.5" />,
  'Social Media': <Share2 className="w-3.5 h-3.5" />,
};
const DEFAULT_ICON = <AlertTriangle className="w-3.5 h-3.5" />;

const THREAT_BADGES = {
  critical: { label: 'CRITICAL', className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30', dot: 'bg-rose-500 animate-ping' },
  high: { label: 'HIGH RISK', className: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30', dot: 'bg-amber-500' },
  medium: { label: 'ELEVATED', className: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-[#00e5ff]/15 dark:text-[#00e5ff] dark:border-[#00e5ff]/35', dot: 'bg-[#00e5ff]' },
};

function ThreatBadge({ level }) {
  const badge = THREAT_BADGES[level?.toLowerCase()] || THREAT_BADGES.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border font-mono ${badge.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
      {badge.label}
    </span>
  );
}

export const ScamCard = ({ scam }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (scam.identifier) {
      navigator.clipboard.writeText(scam.identifier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="group relative bg-white/85 dark:bg-[#080d1a]/95 border border-slate-200/90 dark:border-cyan-500/15 hover:border-cyan-400/50 dark:hover:border-[#00e5ff]/50 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 dark:hover:shadow-[#00e5ff]/15 hover:-translate-y-1 flex flex-col justify-between backdrop-blur-xl">
      <div>
        {/* Top row: scam type badge, threat level badge, date */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 dark:bg-white/5 dark:text-slate-200 border border-slate-200/80 dark:border-white/10">
              {TYPE_ICONS[scam.scamType] || DEFAULT_ICON}
              {scam.scamType}
            </span>
            <ThreatBadge level={scam.threatLevel} />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{scam.incidentDate}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-[#00e5ff] transition-colors line-clamp-1 mb-2.5 font-display">
          {scam.title}
        </h3>

        {/* Reported identifier */}
        <div className="bg-slate-50 dark:bg-[#040711] rounded-2xl px-3.5 py-2.5 border border-slate-200/80 dark:border-white/10 mb-3.5 flex items-center justify-between text-xs font-mono">
          <div className="truncate text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate font-bold tracking-tight">{scam.identifier}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-[#00e5ff] transition-colors shrink-0 ml-2"
            title="Copy identifier"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00e5ff]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Short summary */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 font-medium">
          {scam.summary || scam.description}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Users className="w-3.5 h-3.5 text-purple-500 dark:text-[#a855f7]" />
          <span>
            <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">{scam.meTooCount || 1}</strong> confirmed
          </span>
        </div>

        <Link
          to={`/scam/${scam.id}`}
          className="inline-flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-[#00e5ff] group-hover:translate-x-0.5 transition-all"
        >
          <span>View Dossier</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </article>
  );
};
