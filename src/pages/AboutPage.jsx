import React, { useState } from 'react';
import {
  ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Mail, Send,
  Sparkles, CheckCircle2, Users, Lock, AlertTriangle, Flame,
  CreditCard, PhoneCall, CheckSquare, Square
} from 'lucide-react';

// ── STATIC DATA ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'bank',     label: 'Bank / Card Compromised',    icon: CreditCard    },
  { id: 'money',    label: 'Sent Money / Wire',           icon: PhoneCall     },
  { id: 'identity', label: 'SSN / Identity Leaked',       icon: Lock          },
  { id: 'software', label: 'Installed Remote App / Link', icon: AlertTriangle },
];

const PROTOCOLS = {
  bank:     { title: 'Shared Card / Banking Credentials', steps: [
    { id: 'b1', text: 'Call your bank fraud line immediately (number on the back of your card).' },
    { id: 'b2', text: 'Cancel card and dispute any unauthorized transactions.' },
    { id: 'b3', text: 'Change your online banking password and PIN from a safe device.' },
    { id: 'b4', text: 'Enable SMS alerts for any charge over $0.01.' },
  ]},
  money:    { title: 'Sent Funds via Zelle, Wire, or Crypto', steps: [
    { id: 'm1', text: 'Notify the payment app / bank immediately to report as fraudulent.' },
    { id: 'm2', text: 'Document all chat logs, transaction IDs, and timestamps.' },
    { id: 'm3', text: 'File a complaint at reportfraud.ftc.gov.' },
    { id: 'm4', text: 'Beware of "Recovery Scammers" — they are secondary scams.' },
  ]},
  identity: { title: 'Disclosed SSN or Government ID', steps: [
    { id: 'i1', text: 'Freeze credit at Experian, Equifax, and TransUnion.' },
    { id: 'i2', text: 'Report identity theft at IdentityTheft.gov.' },
    { id: 'i3', text: 'Create a ssa.gov account to block unauthorized claim filings.' },
    { id: 'i4', text: 'Review free credit report at annualcreditreport.com.' },
  ]},
  software: { title: 'Clicked Link or Installed Remote Tool', steps: [
    { id: 's1', text: 'Disconnect immediately from Wi-Fi and mobile data.' },
    { id: 's2', text: 'Uninstall AnyDesk, TeamViewer, or QuickAssist.' },
    { id: 's3', text: 'Run a deep anti-malware scan.' },
    { id: 's4', text: 'Reset all email and banking passwords from a clean device.' },
  ]},
};

const VALUES = [
  { icon: Users,    color: 'teal',   title: 'Distributed Sentinel Network', desc: 'When one person spots a scam SMS or extortion call, immediate indexing protects thousands of subsequent targets.' },
  { icon: Sparkles, color: 'cyan',   title: 'Instant Cross-Verification',   desc: 'Sub-second querying across numbers, domains, and crypto addresses helps citizens verify before transacting.' },
  { icon: Lock,     color: 'indigo', title: 'Zero-Knowledge Defense',       desc: 'We strictly isolate personal identity from submitted threat intelligence vectors.' },
];

const FAQS = [
  { q: 'Is ScamShieldAI completely free?',             a: 'Yes — 100% free. Anyone can search the database, use the AI analyzer, and submit reports without a subscription.' },
  { q: 'How are community reports validated?',          a: 'Reports use heuristic categorization and crowd confirmation. Identifiers with repeat reports are auto-flagged with elevated risk markers.' },
  { q: 'How is personal privacy preserved?',           a: 'Strict privacy-first architecture. No real identity required. Only attacker coordinates and tactics are published.' },
  { q: 'What should I do after falling for a scam?',   a: 'Use the Emergency Protocol above: call your bank, freeze credit files, file with national cyber authorities, then report here.' },
  { q: 'Can organizations query threat intelligence?', a: 'Yes — the community database supports structured querying for anti-abuse analysts and security tools.' },
];

// Shared input className
const INPUT = 'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#040711] border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium';

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export const AboutPage = () => {
  const [openFaq,        setOpenFaq]        = useState(0);
  const [emergencyTab,   setEmergencyTab]   = useState('bank');
  const [completedSteps, setCompletedSteps] = useState({});
  const [form,           setForm]           = useState({ name: '', email: '', subject: '', message: '' });
  const [sent,           setSent]           = useState(false);

  const toggleStep = (id) =>
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const setField = (key) => (e) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setForm({ name: '', email: '', subject: '', message: '' }), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* 1 ── HERO */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-[#00e5ff]/10 border border-teal-200 dark:border-[#00e5ff]/30 text-teal-800 dark:text-[#00e5ff] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> Global Cyber Defense Mission
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Neutralizing Fraud Through <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 dark:from-[#00e5ff] dark:via-[#818cf8] dark:to-[#a855f7]">
            Collective Threat Intelligence
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Fraud rings profit off asymmetrical information — catching people off-guard before warnings spread.
          ScamShieldAI eliminates that gap by turning every encounter into community-wide immunity.
        </p>
      </section>

      {/* 2 ── EMERGENCY PROTOCOL */}
      <section id="emergency" className="bg-white dark:bg-[#080d1a]/95 border-2 border-rose-300 dark:border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-[0_0_35px_rgba(244,63,94,0.08)] space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 text-xs font-extrabold font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> EMERGENCY PROTOCOL
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            What To Do Immediately If You Were Scammed
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Select what happened to unlock your customized crisis mitigation checklist:
          </p>
        </div>

        {/* Situation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = emergencyTab === id;
            return (
              <button key={id} type="button" onClick={() => setEmergencyTab(id)}
                className={`p-3.5 rounded-2xl text-left text-xs font-bold flex flex-col gap-2 border transition-all ${
                  active
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm dark:bg-rose-500/15 dark:border-rose-500 dark:text-rose-300'
                    : 'bg-slate-50 dark:bg-[#040711] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Step Checklist */}
        <div className="bg-slate-50 dark:bg-[#040711] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Priority Actions: {PROTOCOLS[emergencyTab].title}
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Click checkboxes as you complete each step</span>
          </div>

          <div className="space-y-2.5">
            {PROTOCOLS[emergencyTab].steps.map((step, idx) => {
              const done = !!completedSteps[step.id];
              return (
                <div key={step.id} onClick={() => toggleStep(step.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    done
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-white dark:bg-[#080d1a] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                  }`}
                >
                  {done
                    ? <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    : <Square      className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  }
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                    <strong className="text-slate-500 mr-2 font-mono">STEP {idx + 1}:</strong>
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 ── CORE VALUES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VALUES.map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="bg-white dark:bg-[#080d1a]/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:dark:border-[#00e5ff]/30 space-y-3 shadow-sm transition-all">
            <div className={`w-10 h-10 rounded-xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-400 flex items-center justify-center border border-${color}-200 dark:border-${color}-500/20`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
          </div>
        ))}
      </section>

      {/* 4 ── FAQ ACCORDION */}
      <section id="faq" className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-teal-700 dark:text-[#00e5ff] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> Knowledge Base
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Understand how our platform protects privacy and verifies threats.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white dark:bg-[#080d1a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:outline-none">
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{faq.q}</span>
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-[#040711] text-teal-700 dark:text-[#00e5ff] shrink-0 ml-3">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5 ── CONTACT FORM */}
      <section className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-[#00e5ff]/20 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-600 dark:text-[#00e5ff]" /> Contact Cyber Threat Intelligence Team
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Research inquiries, threat intelligence data exchange, or platform feedback.
          </p>
        </div>

        {sent ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 rounded-2xl text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">Message Dispatched!</h3>
            <p className="text-xs text-emerald-700 dark:text-slate-300 font-medium">
              Our intelligence team will respond within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">Full Name <span className="text-rose-500">*</span></label>
                <input type="text" required value={form.name} onChange={setField('name')} placeholder="e.g. Jordan Smith" className={INPUT} />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">Email <span className="text-rose-500">*</span></label>
                <input type="email" required value={form.email} onChange={setField('email')} placeholder="jordan@security.org" className={INPUT} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">Inquiry Topic</label>
              <input type="text" value={form.subject} onChange={setField('subject')} placeholder="Threat intelligence integration, feature request..." className={INPUT} />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">Message <span className="text-rose-500">*</span></label>
              <textarea required rows={4} value={form.message} onChange={setField('message')}
                placeholder="Provide details regarding your communication..."
                className={`${INPUT} leading-relaxed`} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a href="mailto:intelligence@scamshield.ai" className="text-xs text-teal-700 dark:text-[#00e5ff] hover:text-[#c084fc] hover:underline font-mono font-bold">
                Direct dispatch: intelligence@scamshield.ai
              </a>
              <button type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:opacity-95 text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00e5ff]/20 active:scale-[0.98]">
                <Send className="w-4 h-4" /> Transmit Message
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};