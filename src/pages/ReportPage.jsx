import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Radio, 
  PhoneCall, 
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ReportIncident } from '../components/ReportIncident';

export const ReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Emergency Advisory Top Banner: Golden Hour Protocol */}
      <div className="bg-amber-50/95 dark:bg-[#0c0903] border-2 border-amber-400/60 dark:border-amber-500/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-left shadow-lg shadow-amber-500/5 backdrop-blur-xl transition-all">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 dark:bg-amber-400/15 text-amber-700 dark:text-amber-400 border border-amber-400/40 shrink-0 shadow-sm">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider font-mono shadow-sm">
                CRITICAL EMERGENCY
              </span>
              <p className="text-sm sm:text-base font-black text-slate-950 dark:text-white font-display tracking-tight">
                Immediate Financial Fraud: Golden Hour Protocol
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              If your bank account or UPI was debited within the last 2 hours, dial{' '}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-amber-200/90 dark:bg-amber-400/20 text-amber-950 dark:text-amber-300 font-black font-mono text-xs border border-amber-400/60 shadow-sm">
                1930
              </span>{' '}
              immediately to freeze the fraudster's beneficiary accounts before cashout.
            </p>
          </div>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-black dark:text-amber-300 font-black text-xs border border-amber-400/60 dark:border-amber-500/40 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
        >
          <span>cybercrime.gov.in</span>
          <ExternalLink className="w-4 h-4 stroke-[2.5]" />
        </a>
      </div>

      {/* Dynamic Controlled Incident Reporting Form */}
      <ReportIncident 
        onReportSuccess={(result) => {
          console.log('Complaint filed successfully:', result);
        }} 
      />

    </div>
  );
};
