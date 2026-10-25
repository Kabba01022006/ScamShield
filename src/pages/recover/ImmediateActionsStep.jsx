import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  Building2,
  CreditCard,
  Camera,
  Globe,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useRecoveryStore } from '../../store/useRecoveryStore';
import { RecoveryStepCard } from './RecoveryStepCard';

/**
 * 6 Critical Immediate Recovery Actions for the "Golden Hour"
 */
const IMMEDIATE_STEPS = [
  {
    id: 1,
    title: 'Call 1930 (National Cyber Crime Helpline)',
    urgency: 'High Urgency',
    reason:
      'Connects directly to the Citizen Financial Cyber Fraud Reporting System (CFCFRMS). Law enforcement coordination officers immediately notify the recipient banks to place a lien and freeze the fraudster/mule account before funds can be transferred or withdrawn at ATMs.',
    icon: PhoneCall,
    action: {
      type: 'tel',
      tel: '1930',
      label: 'Dial 1930 immediately',
    },
  },
  {
    id: 2,
    title: 'Inform Your Bank & Request Fraud Transaction Hold',
    urgency: 'High Urgency',
    reason:
      'Immediately notify your home bank\'s 24x7 cyber fraud and debit/credit card emergency desk. Quote your 12-digit transaction UTR number to demand an emergency recall / transaction lien before settlement.',
    guidance: 'Call debit/credit fraud helpline with your 12-digit UTR number',
    icon: Building2,
  },
  {
    id: 3,
    title: 'Temporarily Block Compromised UPI Apps & Cards',
    urgency: 'Normal Urgency',
    reason:
      'Prevent recurring or secondary drain attacks. Lock debit/credit cards via mobile banking or SMS, switch off online and international e-commerce channels, and deregister or reset UPI PINs on compromised devices.',
    guidance: 'Lock cards and revoke UPI permissions immediately',
    icon: CreditCard,
  },
  {
    id: 4,
    title: 'Preserve Screenshots, Call Logs, and Transaction UTRs',
    urgency: 'Normal Urgency',
    reason:
      'Capture admissible digital evidence: payment confirmation receipts displaying the 12-digit UTR number, full WhatsApp or Telegram chat exports with timestamps, caller phone numbers, phishing URLs, and SMS headers.',
    guidance: 'Keep timestamps and chat transcripts intact',
    icon: Camera,
  },
  {
    id: 5,
    title: 'Register a Formal Complaint at cybercrime.gov.in',
    urgency: 'Normal Urgency',
    reason:
      'Lodge an official online cyber complaint under the Financial Fraud section on the National Cyber Crime Reporting Portal. This generates a mandatory 14-digit NCRP Acknowledgement Number needed by your bank for dispute processing.',
    icon: Globe,
    action: {
      type: 'link',
      url: 'https://cybercrime.gov.in',
      label: 'Visit cybercrime.gov.in',
    },
  },
  {
    id: 6,
    title: 'Change NetBanking & UPI Passwords from a Clean Device',
    urgency: 'Normal Urgency',
    reason:
      'If your phone had remote access apps (e.g. AnyDesk, TeamViewer) installed or passwords were typed on fake links, use a separate, uncompromised phone or PC to update your MPIN, NetBanking login & transaction passwords, and linked email account passwords.',
    guidance: 'Update MPIN and NetBanking passwords from an uncompromised device',
    icon: KeyRound,
  },
];

/**
 * ImmediateActionsStep (Step 1)
 * 
 * Interactive checklist of 6 critical immediate recovery actions.
 * Toggling cards persists in localStorage and updates the parent layout progress tracker.
 */
export const ImmediateActionsStep = () => {
  const completedSteps = useRecoveryStore((s) => s.completedSteps);
  const toggleStep = useRecoveryStore((s) => s.toggleStep);

  const completedCount = completedSteps.length;
  const isAllDone = completedCount === IMMEDIATE_STEPS.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Step Introduction Card */}
      <div className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Step 1 of 2
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                Immediate Actions (Golden Hour Checklist)
              </h2>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#040711] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00e5ff] shrink-0" />
            <span>Click any card below once you have completed the action</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Time is of the essence. Complete these six actions immediately to maximize the likelihood that your bank and the national cyber cell can freeze the fraudulent money trail before it leaves the banking system.
        </p>
      </div>

      {/* Congratulatory / Encouraging Banner when all 6 steps are finished */}
      {isAllDone && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-black shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-100">
                All 6 immediate recovery actions marked as completed!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                You have mitigated immediate risks. Now compile your facts into an official cybercrime complaint draft.
              </p>
            </div>
          </div>
          <Link
            to="/recover/complaint"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
          >
            <span>Proceed to Step 2</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      )}

      {/* The 6 Interactive Action Cards */}
      <div className="space-y-3">
        {IMMEDIATE_STEPS.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <RecoveryStepCard
              key={step.id}
              stepNumber={step.id}
              title={step.title}
              urgency={step.urgency}
              reason={step.reason}
              guidance={step.guidance}
              icon={step.icon}
              action={step.action}
              isDone={isDone}
              onToggle={() => toggleStep(step.id)}
            />
          );
        })}
      </div>

      {/* Next Step CTA Box at the bottom */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-[#080d1a] dark:via-[#0c142c] dark:to-[#080d1a] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[#00e5ff] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Next Phase</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center justify-center sm:justify-start gap-2">
            <FileText className="w-5 h-5 text-[#00e5ff]" />
            <span>Proceed to Step 2: Complaint Draft</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Prepare an official police and bank complaint text formatted specifically for cybercrime.gov.in and 1930 reporting.
          </p>
        </div>

        <Link
          to="/recover/complaint"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-extrabold text-sm shadow-lg shadow-[#00e5ff]/25 active:scale-95 transition-all shrink-0"
        >
          <span>Proceed to Step 2: Complaint Draft</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>

    </div>
  );
};

export default ImmediateActionsStep;
