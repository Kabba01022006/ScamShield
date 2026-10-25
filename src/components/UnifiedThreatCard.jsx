import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Copy,
  Check,
  LifeBuoy,
  Info,
  Cpu,
  Zap,
  Database,
  FileCode,
  Tag,
  Download
} from 'lucide-react';

const COLOR_THEMES = {
  rose: {
    banner: 'bg-rose-600 text-white',
    card: 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    text: 'text-rose-800 dark:text-rose-300',
    gauge: 'text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700',
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-700'
  },
  amber: {
    banner: 'bg-amber-500 text-slate-950',
    card: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
    gauge: 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700'
  },
  emerald: {
    banner: 'bg-emerald-600 text-white',
    card: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-300',
    gauge: 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700'
  },
  slate: {
    banner: 'bg-slate-500 text-white',
    card: 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    gauge: 'text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600',
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
  }
};

export const UnifiedThreatCard = ({
  result,
  tabType = 'text', // 'text' | 'phone' | 'email'
  analyzedInput = '',
  metadata = {},
  onExportToReport
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const score = result.risk_score ?? (result.is_scam ? 85 : 15);
  const level = (result.risk_level || (score >= 75 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'SAFE')).toUpperCase();
  const themeKey = level === 'HIGH' ? 'rose' : level === 'MEDIUM' ? 'amber' : level === 'IRRELEVANT' ? 'slate' : 'emerald';
  const theme = COLOR_THEMES[themeKey] || COLOR_THEMES.slate;

  // Trigger Source Identification
  const source = result.source || (result.threat_category ? 'DATABASE_RECORD' : 'HEURISTIC_RULE');

  const getSourceBadge = () => {
    if (source === 'DATABASE_RECORD') {
      return {
        label: 'Database Threat Record',
        icon: Database,
        classes: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
      };
    }
    if (source === 'AI_ANALYSIS') {
      return {
        label: 'Ollama Llama 3.2 SLM Agent',
        icon: Cpu,
        classes: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      };
    }
    return {
      label: 'Deterministic Heuristics Engine',
      icon: Zap,
      classes: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
    };
  };

  const sourceMeta = getSourceBadge();
  const SourceIcon = sourceMeta.icon;

  // Copy Summary Handler
  const handleCopySummary = async () => {
    const summary = `[ScamShield AI Incident Analysis - ${tabType.toUpperCase()}]
Verdict: ${level} RISK (${score}%)
Trigger Engine: ${sourceMeta.label}
Rationale: ${result.justification || 'No rationale available'}
${result.victim_advice ? `Victim Action Plan: ${result.victim_advice}` : ''}
Timestamp: ${new Date().toISOString()}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  // PDF Export Handler
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('ScamShield AI - Cyber Incident & Threat Diagnostic Report', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated Date: ${new Date().toLocaleString()}`, 20, 28);
    doc.text(`Vector Type: ${tabType.toUpperCase()} Analysis`, 20, 34);
    doc.text(`Incident Status: ${level} RISK (Risk Score: ${score}%)`, 20, 40);
    doc.text(`Trigger Source: ${sourceMeta.label}`, 20, 46);

    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    let currentY = 58;

    // Section 1: Analyzed Target
    doc.setFont('helvetica', 'bold');
    doc.text(`1. Inspected Target (${tabType.toUpperCase()}):`, 20, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 6;

    const inputPreview = typeof analyzedInput === 'object'
      ? JSON.stringify(analyzedInput, null, 2)
      : String(analyzedInput);

    const splitInput = doc.splitTextToSize(inputPreview, 170);
    doc.text(splitInput.slice(0, 10), 20, currentY);
    currentY += Math.min(splitInput.length, 10) * 5 + 8;

    // Section 2: Threat Diagnostics & Red Flags
    doc.setFont('helvetica', 'bold');
    doc.text('2. Threat Diagnostics & Red Flags:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 6;

    const justificationText = result.justification || 'No diagnostic rationale provided.';
    const splitJustification = doc.splitTextToSize(justificationText, 170);
    doc.text(splitJustification, 20, currentY);
    currentY += splitJustification.length * 5 + 8;

    // Section 3: Actionable Advice
    if (result.victim_advice) {
      doc.setFont('helvetica', 'bold');
      doc.text('3. Actionable Victim Guidance & Defensive Protocol:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      currentY += 6;

      const splitAdvice = doc.splitTextToSize(result.victim_advice, 170);
      doc.text(splitAdvice, 20, currentY);
      currentY += splitAdvice.length * 5 + 8;
    }

    doc.setFontSize(8);
    doc.text('Official intelligence compiled by ScamShield AI Multi-Vector Threat Engine.', 20, 280);
    doc.text('Submit this report to National Cyber Crime Portal (cybercrime.gov.in) or call 1930.', 20, 285);

    doc.save(`ScamShield_${tabType.toUpperCase()}_Incident_${Date.now()}.pdf`);
  };

  return (
    <div
      id="unified-threat-card"
      className="bg-white dark:bg-[#080d1a]/95 border border-slate-200/90 dark:border-[#00e5ff]/20 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-[0_0_35px_rgba(0,229,255,0.08)] transition-all animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* 1. TOP SEVERITY BANNER */}
      {level === 'IRRELEVANT' ? (
        <div className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 py-3.5 flex items-center gap-3">
          <Info className="w-5 h-5 shrink-0 text-slate-200" />
          <p className="text-xs font-bold">
            IRRELEVANT INPUT: This text has no relation to scams, fraud, phishing, or cybersecurity threats.
          </p>
        </div>
      ) : score >= 75 ? (
        <div className="bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 shrink-0 text-white" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">
                CRITICAL THREAT DETECTED: HIGH MALICIOUS PROBABILITY
              </h3>
              <p className="text-xs font-medium text-rose-100">
                Do NOT interact, dial back, send money, scan UPI QR codes, or open attachments.
              </p>
            </div>
          </div>

          <a
            href="tel:1930"
            className="px-4 py-2 rounded-xl bg-white text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:bg-rose-50 transition-all shrink-0 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            Call 1930 Cyber Helpline
          </a>
        </div>
      ) : score >= 40 ? (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-6 py-3.5 flex items-center justify-between gap-3 font-bold text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              ELEVATED RISK / SUSPICIOUS: Exercise heightened caution. Verify origin through independent verified channels.
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3.5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold">
            LOW RISK DETECTED: No standard fraud signatures, known scam records, or malicious patterns flagged.
          </p>
        </div>
      )}

      {/* 2. BODY CONTENT */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* SCORE, VERDICT & ACTIONS HEADER */}
        <div className={`${theme.card} border p-6 rounded-2xl flex flex-wrap items-center justify-between gap-6`}>
          <div className="flex items-center gap-5">
            {/* Risk Gauge */}
            <div
              className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-black border bg-white dark:bg-[#040711] ${theme.gauge} shadow-xs shrink-0`}
            >
              {level === 'IRRELEVANT' ? (
                <>
                  <span className="text-3xl tracking-tight">0%</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">N/A</span>
                </>
              ) : (
                <>
                  <span className="text-3xl tracking-tight">{score}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Risk Score</span>
                </>
              )}
            </div>

            {/* Verdict & Meta */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${theme.badge}`}>
                  {level === 'HIGH' ? 'CRITICAL FRAUD / PHISHING'
                    : level === 'MEDIUM' ? 'ELEVATED SUSPICION'
                    : level === 'IRRELEVANT' ? 'IRRELEVANT CONTENT'
                    : 'STANDARD SAFE'}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sourceMeta.classes}`}>
                  <SourceIcon className="w-3.5 h-3.5" />
                  {sourceMeta.label}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {level === 'IRRELEVANT'
                  ? 'Irrelevant / Non-Scam Content'
                  : result.is_scam || score >= 75
                  ? 'Confirmed Threat Vector Pattern'
                  : score >= 40
                  ? 'Suspicious Signal Anomaly'
                  : 'Standard Legitimate Pattern'}
              </h3>

              {/* Vector Specific Pill Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {result.threat_category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {result.threat_category}
                  </span>
                )}

                {result.report_count !== undefined && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 font-semibold text-[11px]">
                    <ShieldAlert className="w-3 h-3" />
                    {result.report_count} Community Reports
                  </span>
                )}

                {result.carrier && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    Carrier: {result.carrier}
                  </span>
                )}

                {result.country_code && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    Region: {result.country_code}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              id="copy-summary-btn"
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#040711] hover:bg-slate-50 dark:hover:bg-[#080d1a] text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00e5ff]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              {copied ? 'Copied to Clipboard' : 'Copy Incident Summary'}
            </button>

            <button
              id="export-pdf-btn"
              type="button"
              onClick={handleExportPDF}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:opacity-95 text-black text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-[#00e5ff]/20 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Download Cyber Cell PDF Report
            </button>

            {score >= 40 && onExportToReport && (
              <button
                type="button"
                onClick={onExportToReport}
                className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                File Citizen Complaint <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. SPECIFIC RED FLAGS & FORENSIC RATIONALE */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#00e5ff]" />
            Threat Diagnostic Findings & Red Flags
          </h4>

          <div className="bg-slate-50/80 dark:bg-[#040711] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {result.justification || 'No detailed rationale provided.'}
            </p>
          </div>
        </div>

        {/* 4. ACTIONABLE VICTIM GUIDANCE */}
        {result.victim_advice && result.victim_advice !== 'None' && (
          <div className="bg-rose-50/70 dark:bg-[#040711] border border-rose-200/80 dark:border-rose-900/60 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider">
              <LifeBuoy className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Actionable Defense & Recovery Advice
            </div>
            <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
              {result.victim_advice}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
