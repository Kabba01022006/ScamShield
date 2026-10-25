import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck, PhoneCall, ChevronDown, Mail, ArrowRight,
  Search, Cpu, FilePlus2, Landmark, Siren, Smartphone, Briefcase,
  TrendingUp, Package,
} from 'lucide-react';

// ── CONTENT (edit text here, no need to touch the layout below) ──────────────

const STEPS = [
  { icon: Search,   title: 'Check',   desc: 'Search a phone number, email, or link to see if others have reported it.', to: '/database' },
  { icon: Cpu,      title: 'Analyze', desc: 'Paste a suspicious message and the AI Scanner shows its risk level and red flags.', to: '/analyze' },
  { icon: FilePlus2, title: 'Report', desc: 'Got scammed or targeted? Report it so others are warned.', to: '/report' },
];

const SCAMS = [
  { icon: Siren,      title: 'Digital Arrest',
    how:  'Someone posing as police, CBI, or customs says you are "under arrest" on a video call and demands money.',
    tip:  'No agency arrests people over video call or asks for payment. Hang up and call 1930.' },
  { icon: Landmark,   title: 'Fake KYC / OTP',
    how:  'A message says your bank account will be blocked unless you update KYC through a link.',
    tip:  'Banks never ask for your OTP, PIN, or CVV. Never share them with anyone.' },
  { icon: Smartphone, title: 'UPI Refund Trick',
    how:  'A buyer or "support agent" sends a collect request and asks you to enter your PIN to receive money.',
    tip:  'You never need a PIN to receive money. Entering it only sends money out.' },
  { icon: Briefcase,  title: 'Task / Part-Time Job',
    how:  'A WhatsApp or Telegram job pays small amounts at first, then asks you to deposit more to continue.',
    tip:  'A real job never asks you to pay first. Stop at the first deposit request.' },
  { icon: TrendingUp, title: 'Fake Investment App',
    how:  'An app or group promises guaranteed high returns, then blocks withdrawals.',
    tip:  'No one can guarantee returns. Only use SEBI-registered platforms.' },
  { icon: Package,    title: 'Fake Courier / Customs',
    how:  'A call says your parcel is stuck or has illegal items, and asks for a fee or personal details.',
    tip:  'Check the tracking number on the official courier site. Never pay through a caller\'s link.' },
];

const IF_SCAMMED = [
  { title: 'Call 1930 right away',          desc: 'The faster you report, the better the chance of freezing the money.' },
  { title: 'Report at cybercrime.gov.in',   desc: 'File an official complaint with screenshots, numbers, and transaction IDs.' },
  { title: 'Contact your bank',             desc: 'Ask them to block your card or UPI and flag the transaction.' },
  { title: 'Secure your accounts',          desc: 'Change passwords and uninstall any remote-access app such as AnyDesk.' },
];

const FAQS = [
  { q: 'Is ScamShieldAI free?',
    a: 'Yes. Searching the database, using the AI Scanner, and submitting reports are all free.' },
  { q: 'How does the AI Scanner work?',
    a: 'It checks your message against known scam reports and common scam patterns, then an AI model gives a risk score with the red flags it found.' },
  { q: 'Can the scanner be wrong?',
    a: 'Yes. It is a helpful guide, not a guarantee. If something feels off, do not pay or share details, and verify through the official source.' },
  { q: 'How are community reports checked?',
    a: 'Reports are categorized automatically, and numbers or emails reported by several people are marked as higher risk.' },
  { q: 'Is my personal information shared?',
    a: 'No. Only the scammer\'s details (number, email, link) and tactics are shown. Your identity is never published.' },
  { q: 'What should I do if I already lost money?',
    a: 'Call 1930 immediately, then report at cybercrime.gov.in and contact your bank. See the steps above.' },
];

// ── PAGE ─────────────────────────────────────────────────────────────────────

const card = 'bg-white dark:bg-[#080d1a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl';

const SectionTitle = ({ title, subtitle }) => (
  <div className="space-y-1">
    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
    {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
  </div>
);

export const AboutPage = () => {
  const { hash } = useLocation();

  // Makes footer links like /about#faq scroll to the right section
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, [hash]);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-14">

      {/* 1. INTRO */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-[#00e5ff]/10 border border-teal-200 dark:border-[#00e5ff]/30 text-teal-800 dark:text-[#00e5ff] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> About ScamShieldAI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Spot scams before they cost you
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          ScamShieldAI is a free, community-powered tool for people in India. Check suspicious numbers
          and messages, learn how common scams work, and warn others by reporting what you find.
        </p>
      </section>

      {/* 2. HOW TO USE */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map(({ icon: Icon, title, desc, to }) => (
          <Link key={title} to={to} className={`${card} p-5 space-y-3 hover:border-cyan-500 dark:hover:border-[#00e5ff]/50 transition-colors group`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-[#00e5ff]/10 text-cyan-700 dark:text-[#00e5ff] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              {title}
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
          </Link>
        ))}
      </section>

      {/* 3. LEARN: COMMON SCAMS */}
      <section id="learn" className="space-y-5 scroll-mt-24">
        <SectionTitle title="Learn: common scams in India" subtitle="Know the pattern and you can spot it." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCAMS.map(({ icon: Icon, title, how, tip }) => (
            <article key={title} className={`${card} p-5 space-y-3`}>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon className="w-4 h-4 text-rose-500 shrink-0" /> {title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{how}</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed font-semibold flex gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" /> <span>{tip}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. IF YOU WERE SCAMMED */}
      <section id="emergency" className="scroll-mt-24 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Already scammed? Act fast</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Follow these four steps in order.</p>
          </div>
          <a href="tel:1930"
             className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-colors">
            <PhoneCall className="w-4 h-4" /> Call 1930
          </a>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IF_SCAMMED.map((s, i) => (
            <li key={s.title} className="bg-white dark:bg-[#080d1a] border border-rose-100 dark:border-rose-500/20 rounded-2xl p-4 flex gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="space-y-5 scroll-mt-24">
        <SectionTitle title="Frequently asked questions" />
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className={`${card} group`}>
              <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between gap-3 text-sm sm:text-base font-bold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-teal-700 dark:text-[#00e5ff] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 6. CONTACT */}
      <section id="contact" className={`${card} scroll-mt-24 p-6 sm:p-8 text-center space-y-3`}>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Still have a question?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Feedback, ideas, or data requests are welcome.</p>
        <a href="mailto:intelligence@scamshield.ai"
           className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-[#00e5ff] hover:underline">
          <Mail className="w-4 h-4" /> intelligence@scamshield.ai
        </a>
      </section>

    </div>
  );
};
