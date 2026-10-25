import React, { useState, useEffect, useRef } from 'react';
import { StatsBanner } from './StatsBanner';
import { UnifiedThreatCard } from './UnifiedThreatCard';
import {
  MessageSquare,
  PhoneCall,
  Mail,
  Sparkles,
  RefreshCw,
  Cpu,
  Lock,
  Clipboard,
  Check,
  Trash2,
  AlertTriangle,
  FileCode,
  Paperclip,
  AtSign,
  Heading,
  AlignLeft,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Info,
  Globe,
  Upload,
  FileText,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../config';

// ─── COUNTRY CODES REGISTRY WITH LENGTH RULES ────────────────────────────────
const COUNTRY_CODES = [
  { code: '+91', name: 'India', flag: '🇮🇳', digits: 10, placeholder: '98765 43210' },
  { code: '+1', name: 'USA / Canada', flag: '🇺🇸', digits: 10, placeholder: '202 555 0199' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', digits: 10, placeholder: '7911 123456' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', digits: 9, placeholder: '412 345 678' },
  { code: '+40', name: 'Romania (VoIP)', flag: '🇷🇴', digits: 9, placeholder: '721 234 567' },
  { code: 'SHORTCODE', name: '5-Digit / Toll Shortcode', flag: '⚡', digits: 5, placeholder: '58888 or 0871...' },
  { code: 'OTHER', name: 'Other International', flag: '🌐', digits: null, placeholder: 'Phone digits...' }
];

// ─── SAMPLE PRESETS PER TAB ──────────────────────────────────────────────────
const SMS_SAMPLES = [
  { title: "🚨 CBI Digital Arrest", text: "CBI Notice: Arrest warrant issued. Join Skype video call for Digital Arrest immediately." },
  { title: "⚡ Electricity Cut",   text: "Your power will be cut tonight at 9:30 PM. Pay ₹10 via Discom APK to avoid disconnection." },
  { title: "🪖 OLX Army UPI QR", text: "Army officer wants to buy your vehicle. Scan UPI QR and enter UPI PIN to receive ₹15,000." },
  { title: "💼 Telegram Task",   text: "Earn ₹3000 daily! Like YouTube videos, get ₹150 bonus. Message @Global_Task_Coordinator on Telegram." },
];

const PHONE_SAMPLES = [
  { title: "🚨 Utility Fraud (DB)", code: "+91", number: "9876543210", desc: "Flagged utility scam in database" },
  { title: "🚨 CBI Impersonation (DB)", code: "+91", number: "9821450192", desc: "Extortion scammer in database" },
  { title: "⚡ UK Toll Rate (0871)", code: "+44", number: "0871987654", desc: "High-rate UK premium shortcode" },
  { title: "⚡ 5-Digit Shortcode", code: "SHORTCODE", number: "58888", desc: "Automated premium shortcode" },
  { title: "🌐 VoIP / Romania (+40)", code: "+40", number: "721234567", desc: "Unverified international corridor" },
  { title: "✅ Clean Domestic (+91)", code: "+91", number: "9810012345", desc: "Standard verified 10-digit number" },
  { title: "❌ Invalid 11-Digits (+91)", code: "+91", number: "98100123456", desc: "Invalid length test (rejected)" }
];

const RAW_EMAIL_SAMPLES = [
  {
    title: "💣 Malware .eml (invoice.exe)",
    text: `From: "Accounts Dept" <billing@instant-invoice.com>\nTo: accounts@mycompany.com\nSubject: Overdue Invoice Notice #9821\nReceived-SPF: pass\nDate: Sat, 17 Oct 2026 14:00:00 +0000\nContent-Type: multipart/mixed\n\nPlease find attached the overdue commercial invoice. Remit settlement immediately to prevent legal recovery.\n\nAttachment: invoice.exe`
  },
  {
    title: "🎣 Domain Spoof .eml (.xyz + SPF Fail)",
    text: `From: "Chase Bank Security" <admin@bank-update.xyz>\nTo: customer@chase.com\nSubject: Critical Security Notification\nReceived-SPF: fail\nDate: Sat, 17 Oct 2026 14:00:00 +0000\n\nUnauthorized login detected from foreign IP. Verify your account immediately to restore full service access.\nClick: https://secure-verification.xyz/login`
  },
  {
    title: "⚠️ Credential Phish .eml (OTP/PIN Demand)",
    text: `From: "Cloud Support Security" <security@cloud-support.net>\nTo: user@company.com\nSubject: URGENT: ACCOUNT SUSPENDED\nReceived-SPF: pass\nDate: Sat, 17 Oct 2026 14:00:00 +0000\n\nYour account has been temporarily suspended due to security compliance violations. Reply directly with your system password and UPI PIN to restore your portal access immediately.`
  },
  {
    title: "✅ Safe GitHub Digest .eml",
    text: `From: "GitHub Digest" <newsletter@github.com>\nTo: developer@github.com\nSubject: Your Weekly GitHub Open Source Digest\nReceived-SPF: pass\nDate: Sat, 17 Oct 2026 14:00:00 +0000\n\nExplore this week's trending repositories, engineering blog posts, and security advisories from the open source community.`
  },
  {
    title: "📄 macOS Saved .rtf Email",
    text: `{\\rtf1\\ansi\\ansicpg1252\\cocoartf2820\n{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\deftab720\n\\f0\\fs24 From: "Account Security" <security@chase-alert.xyz>\\par\nSubject: URGENT: SUSPICIOUS LOGIN DETECTED\\par\nReceived-SPF: fail\\par\n\\par\nDear User,\\par\nSuspicious transaction attempted. Verify credentials immediately to prevent account lock.\\par\nAttachment: security_patch.exe}`
  }
];

// ─── DYNAMIC SCANNING ANIMATION STEPS ────────────────────────────────────────
const SCAN_STEPS_MAP = {
  text: [
    "Searching 100,000 GCT Cyber Threat Records...",
    "Evaluating Urgency, Fear, & Coercion Markers...",
    "Cross-referencing Malicious Domains & APK Signatures...",
    "Synthesizing Victim Safety Protocols..."
  ],
  phone: [
    "Validating E.164 Country Code & Strict Digit Allocations...",
    "Querying phone_threat_records Database...",
    "Screening UK & Global Premium Rate Shortcodes (0871, 0906, 0800, 0844)...",
    "Analyzing Carrier Telecom Routing & Synthesizing Advisory..."
  ],
  email: [
    "Parsing MIME Headers, SPF & Origin Authentication...",
    "Scanning Attachments for Executable & Script Trojans (.exe, .bat, .vbs)...",
    "Evaluating Subject Urgency & Credential Harvesting Heuristics...",
    "Invoking Local Llama 3.2 SLM Social Engineering Classifier..."
  ]
};

// ─── RTF STRIPPER HELPER (Extracts clean text from macOS / Apple Mail .rtf files) ──
function stripRtf(rtf) {
  if (!rtf || typeof rtf !== 'string') return '';
  if (!rtf.trim().startsWith('{\\rtf')) return rtf;

  let output = '';
  let groupLevel = 0;
  let skipGroupLevel = -1;

  for (let i = 0; i < rtf.length; i++) {
    const char = rtf[i];
    if (char === '{') {
      groupLevel++;
      continue;
    }
    if (char === '}') {
      if (skipGroupLevel === groupLevel) skipGroupLevel = -1;
      groupLevel--;
      continue;
    }
    if (skipGroupLevel !== -1 && groupLevel >= skipGroupLevel) {
      continue;
    }
    if (char === '\\') {
      const nextChar = rtf[i + 1];
      if (nextChar === '\\' || nextChar === '{' || nextChar === '}') {
        output += nextChar;
        i++;
        continue;
      }
      if (nextChar === "'") {
        const hex = rtf.substring(i + 2, i + 4);
        output += String.fromCharCode(parseInt(hex, 16));
        i += 3;
        continue;
      }
      let j = i + 1;
      while (j < rtf.length && /[a-zA-Z0-9\-]/.test(rtf[j])) j++;
      const controlWord = rtf.substring(i + 1, j);
      if (controlWord === 'par' || controlWord === 'pard' || controlWord === 'line') {
        output += '\n';
      } else if (controlWord === 'tab') {
        output += '\t';
      } else if (controlWord === 'fonttbl' || controlWord === 'colortbl' || controlWord === 'stylesheet' || controlWord === 'info' || controlWord === '*') {
        skipGroupLevel = groupLevel;
      }
      if (j < rtf.length && rtf[j] === ' ') j++;
      i = j - 1;
      continue;
    }
    if (char === '\r' || char === '\n') continue;
    output += char;
  }
  return output.replace(/\n{3,}/g, '\n\n').trim();
}

// ─── CLIENT-SIDE RFC 822 / RAW EMAIL PARSER HELPER ──────────────────────────
function parseRawEmail(rawInput) {
  const raw = stripRtf(rawInput);
  if (!raw || !raw.trim()) {
    return { sender: '', subject: '', spf: 'unknown', attachments: [], body: '' };
  }

  // 1. Sender
  let sender = '';
  const fromMatch = raw.match(/(?:^|\n)(?:From|Sender):\s*([^\r\n]+)/i);
  if (fromMatch) {
    const emailInside = fromMatch[1].match(/<([^>]+)>/);
    sender = emailInside ? emailInside[1].trim() : fromMatch[1].trim();
  }

  // 2. Subject
  let subject = '';
  const subMatch = raw.match(/(?:^|\n)Subject:\s*([^\r\n]+)/i);
  if (subMatch) {
    subject = subMatch[1].trim();
  }

  // 3. SPF
  let spf = 'unknown';
  const spfMatch = raw.match(/(?:Received-SPF|Authentication-Results|spf)\s*[:=]\s*([^\r\n;]+)/i);
  if (spfMatch) {
    const lower = spfMatch[1].toLowerCase();
    if (lower.includes('fail')) spf = 'fail';
    else if (lower.includes('pass')) spf = 'pass';
    else if (lower.includes('softfail')) spf = 'softfail';
    else spf = lower.trim();
  }

  // 4. Attachments
  const attachments = [];
  const regex1 = /(?:filename|name)\s*=\s*["']?([^"';\r\n]+)/gi;
  let m;
  while ((m = regex1.exec(raw)) !== null) {
    const name = m[1].trim();
    if (name && !attachments.includes(name)) attachments.push(name);
  }
  const regex2 = /(?:Attachment|Attachments|Attached):\s*([^\r\n]+)/gi;
  while ((m = regex2.exec(raw)) !== null) {
    const files = m[1].split(',').map(s => s.trim());
    files.forEach(f => {
      if (f && !attachments.includes(f)) attachments.push(f);
    });
  }

  // 5. Body
  let body = '';
  const parts = raw.split(/\r?\n\r?\n/);
  if (parts.length > 1) {
    body = parts.slice(1).join('\n\n').trim();
  } else {
    body = raw.trim();
  }

  return { sender, subject, spf, attachments, body };
}

export const AiScamAnalyzer = ({ onExportToReport }) => {
  // Navigation: 3-tab layout ('text' | 'phone' | 'email')
  const [activeTab, setActiveTab] = useState('text');

  // Input states: SMS
  const [smsText, setSmsText] = useState('');

  // Input states: Phone tab (country code + national number)
  const [selectedCountry, setSelectedCountry] = useState('+91');
  const [customCountryCode, setCustomCountryCode] = useState('+');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Input states: Email tab
  const [emailMode, setEmailMode] = useState('raw'); // 'raw' | 'fields'
  const [rawEmailText, setRawEmailText] = useState('');
  const [emailForm, setEmailForm] = useState({
    sender: '',
    headers: '{\n  "spf": "pass"\n}',
    subject: '',
    body: '',
    attachments: ''
  });

  const fileInputRef = useRef(null);

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [pasted, setPasted] = useState(false);

  // Cycling scanning animation
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setScanStep(0);
      const steps = SCAN_STEPS_MAP[activeTab] || SCAN_STEPS_MAP.text;
      interval = setInterval(() => {
        setScanStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, activeTab]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
  };

  // ─── VALIDATION HELPER FOR PHONE BY COUNTRY CODE ────────────────────────────
  const getPhoneValidation = () => {
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const count = cleanDigits.length;

    if (count === 0) {
      return {
        isValid: false,
        status: 'empty',
        count: 0,
        expected: selectedCountry === '+91' ? 10 : selectedCountry === 'SHORTCODE' ? 5 : '10',
        message: selectedCountry === '+91' ? 'Enter 10-digit Indian phone number' : 'Enter phone number'
      };
    }

    if (selectedCountry === 'SHORTCODE') {
      const isPremium = /^(0871|0906|0800|0844)/.test(phoneNumber);
      const isValid = count === 5 || isPremium;
      return {
        isValid,
        status: isValid ? 'valid' : 'invalid',
        count,
        expected: isPremium ? 'Premium Rate Format' : 5,
        message: isValid
          ? '✓ Valid shortcode / premium rate format'
          : `⚠️ Invalid shortcode length: ${count} digits (must be 5 digits or start with 0871/0906/0800/0844)`
      };
    }

    if (selectedCountry === '+91') {
      const isValid = count === 10;
      return {
        isValid,
        status: isValid ? 'valid' : count > 10 ? 'overflow' : 'incomplete',
        count,
        expected: 10,
        message: isValid
          ? '✓ Valid 10-digit Indian phone number'
          : count > 10
          ? `❌ Invalid Number: Indian (+91) numbers cannot exceed 10 digits! (Found ${count} digits)`
          : `⚠️ Incomplete: ${count} of 10 digits entered`
      };
    }

    if (selectedCountry === '+1') {
      const isValid = count === 10;
      return {
        isValid,
        status: isValid ? 'valid' : count > 10 ? 'overflow' : 'incomplete',
        count,
        expected: 10,
        message: isValid
          ? '✓ Valid 10-digit US/Canada number'
          : count > 10
          ? `❌ Invalid: US/Canada numbers cannot exceed 10 digits! (Found ${count} digits)`
          : `⚠️ Incomplete: ${count} of 10 digits entered`
      };
    }

    if (selectedCountry === '+44') {
      const isValid = count >= 9 && count <= 11;
      return {
        isValid,
        status: isValid ? 'valid' : 'invalid',
        count,
        expected: '9-11',
        message: isValid
          ? '✓ Valid UK telephone format'
          : `⚠️ UK numbers must be between 9 and 11 digits (Found ${count} digits)`
      };
    }

    // General international
    const isValid = count >= 5 && count <= 15;
    return {
      isValid,
      status: isValid ? 'valid' : 'invalid',
      count,
      expected: '5-15',
      message: isValid
        ? `✓ Valid international digit count (${count} digits)`
        : `⚠️ International numbers must have between 5 and 15 digits (Found ${count})`
    };
  };

  const phoneValidation = getPhoneValidation();

  // Smart Phone Paste Handler: Auto-extracts country code and national digits
  const handlePhonePaste = (rawPastedText) => {
    let text = rawPastedText.trim();
    if (!text) return;

    if (text.startsWith('+91')) {
      setSelectedCountry('+91');
      setPhoneNumber(text.slice(3).replace(/\D/g, ''));
    } else if (text.startsWith('+1')) {
      setSelectedCountry('+1');
      setPhoneNumber(text.slice(2).replace(/\D/g, ''));
    } else if (text.startsWith('+44')) {
      setSelectedCountry('+44');
      setPhoneNumber(text.slice(3).replace(/\D/g, ''));
    } else if (text.startsWith('+40')) {
      setSelectedCountry('+40');
      setPhoneNumber(text.slice(3).replace(/\D/g, ''));
    } else if (text.startsWith('+61')) {
      setSelectedCountry('+61');
      setPhoneNumber(text.slice(3).replace(/\D/g, ''));
    } else if (text.length === 5 && /^\d{5}$/.test(text)) {
      setSelectedCountry('SHORTCODE');
      setPhoneNumber(text);
    } else if (/^(0871|0906|0800|0844)/.test(text)) {
      setSelectedCountry('+44');
      setPhoneNumber(text);
    } else if (text.startsWith('+')) {
      setSelectedCountry('OTHER');
      const match = text.match(/^\+(\d{1,4})/);
      if (match) {
        setCustomCountryCode(`+${match[1]}`);
        setPhoneNumber(text.slice(match[0].length).replace(/\D/g, ''));
      } else {
        setPhoneNumber(text.replace(/\D/g, ''));
      }
    } else {
      setPhoneNumber(text.replace(/\D/g, ''));
    }

    setPasted(true);
    setTimeout(() => setPasted(false), 2000);
  };

  // Live Raw Email Parsing & Synchronization
  const parsedRawEmail = parseRawEmail(rawEmailText);

  const handleRawEmailChange = (text) => {
    setRawEmailText(text);
    setError(null);
    const parsed = parseRawEmail(text);
    if (parsed.sender || parsed.subject || parsed.body) {
      setEmailForm({
        sender: parsed.sender,
        subject: parsed.subject,
        body: parsed.body,
        attachments: parsed.attachments.join(', '),
        headers: JSON.stringify({ spf: parsed.spf === 'unknown' ? 'pass' : parsed.spf }, null, 2)
      });
    }
  };

  // File Upload Handler (.eml, .txt, .msg)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const cleaned = stripRtf(content);
        handleRawEmailChange(cleaned);
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clipboard Paste Helper
  const handleClipboardPaste = async (field = 'sms') => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      if (field === 'sms') {
        setSmsText(text);
      } else if (field === 'phone') {
        handlePhonePaste(text);
      } else if (field === 'rawEmail') {
        handleRawEmailChange(text);
      } else if (field === 'emailBody') {
        setEmailForm(prev => ({ ...prev, body: text }));
      }
      setPasted(true);
      setTimeout(() => setPasted(false), 2000);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  // Reset form
  const handleReset = () => {
    if (activeTab === 'text') {
      setSmsText('');
    } else if (activeTab === 'phone') {
      setSelectedCountry('+91');
      setCustomCountryCode('+');
      setPhoneNumber('');
    } else {
      setRawEmailText('');
      setEmailForm({
        sender: '',
        headers: '{\n  "spf": "pass"\n}',
        subject: '',
        body: '',
        attachments: ''
      });
    }
    setResult(null);
    setError(null);
  };

  // ─── API DISPATCH LOGIC ─────────────────────────────────────────────────────
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'text') {
        if (!smsText.trim()) {
          setError('Please enter SMS or message text to analyze.');
          setIsAnalyzing(false);
          return;
        }
        endpoint = `${API_BASE_URL}/api/analyze`;
        payload = { message: smsText.trim() };

      } else if (activeTab === 'phone') {
        const cleanDigits = phoneNumber.replace(/\D/g, '');
        if (!cleanDigits) {
          setError('Please enter a phone number to verify.');
          setIsAnalyzing(false);
          return;
        }

        const actualCode = selectedCountry === 'OTHER'
          ? customCountryCode
          : selectedCountry;

        endpoint = `${API_BASE_URL}/api/analyze-phone`;
        payload = {
          countryCode: actualCode,
          phoneNumber: cleanDigits
        };

      } else if (activeTab === 'email') {
        endpoint = `${API_BASE_URL}/api/analyze-email`;

        if (emailMode === 'raw') {
          if (!rawEmailText.trim()) {
            setError('Please paste a raw email or upload an .eml file to analyze.');
            setIsAnalyzing(false);
            return;
          }

          payload = {
            rawEmail: rawEmailText.trim(),
            sender: parsedRawEmail.sender,
            subject: parsedRawEmail.subject,
            body: parsedRawEmail.body,
            headers: { spf: parsedRawEmail.spf },
            attachments: parsedRawEmail.attachments
          };

        } else {
          // Manual form fields mode
          if (!emailForm.sender.trim() && !emailForm.subject.trim() && !emailForm.body.trim()) {
            setError('Please enter sender email, subject, or message body to analyze.');
            setIsAnalyzing(false);
            return;
          }

          let parsedHeaders = {};
          if (emailForm.headers.trim()) {
            try {
              parsedHeaders = JSON.parse(emailForm.headers);
            } catch {
              parsedHeaders = { raw: emailForm.headers };
            }
          }

          const attachmentsArray = emailForm.attachments
            ? emailForm.attachments.split(',').map(a => a.trim()).filter(Boolean)
            : [];

          payload = {
            sender: emailForm.sender.trim(),
            headers: parsedHeaders,
            subject: emailForm.subject.trim(),
            body: emailForm.body.trim(),
            attachments: attachmentsArray
          };
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error('Threat analysis error:', err);
      setError(err.message || 'Failed to connect to backend on port 5001. Ensure server is active.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get current analyzed target input for PDF export
  const getCurrentAnalyzedInput = () => {
    if (activeTab === 'text') return smsText;
    if (activeTab === 'phone') {
      const code = selectedCountry === 'OTHER' ? customCountryCode : selectedCountry;
      return `${code} ${phoneNumber}`;
    }
    if (emailMode === 'raw') {
      return rawEmailText || emailForm;
    }
    return emailForm;
  };

  const selectedCountryConfig = COUNTRY_CODES.find(c => c.code === selectedCountry) || COUNTRY_CODES[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* LIVE STATS BANNER */}
      <StatsBanner />

      {/* NAVIGATION TABS (SMS/Text, Phone Lookup, Email Analyzer) */}
      <div className="bg-slate-100/90 dark:bg-[#080d1a]/90 p-1.5 rounded-2xl border border-slate-200/90 dark:border-cyan-500/20 flex gap-1.5 shadow-sm backdrop-blur-xl">
        <button
          id="tab-btn-text"
          type="button"
          onClick={() => handleTabChange('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'text'
              ? 'bg-white dark:bg-[#040711] text-cyan-700 dark:text-[#00e5ff] shadow-sm ring-1 ring-slate-900/5 dark:ring-cyan-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
          }`}
        >
          <MessageSquare className={`w-4 h-4 ${activeTab === 'text' ? 'text-cyan-600 dark:text-[#00e5ff]' : 'text-slate-400'}`} />
          <span>SMS / Text</span>
        </button>

        <button
          id="tab-btn-phone"
          type="button"
          onClick={() => handleTabChange('phone')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'phone'
              ? 'bg-white dark:bg-[#040711] text-purple-700 dark:text-[#c084fc] shadow-sm ring-1 ring-slate-900/5 dark:ring-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
          }`}
        >
          <PhoneCall className={`w-4 h-4 ${activeTab === 'phone' ? 'text-purple-600 dark:text-[#c084fc]' : 'text-slate-400'}`} />
          <span>Phone Lookup</span>
        </button>

        <button
          id="tab-btn-email"
          type="button"
          onClick={() => handleTabChange('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'email'
              ? 'bg-white dark:bg-[#040711] text-indigo-700 dark:text-indigo-400 shadow-sm ring-1 ring-slate-900/5 dark:ring-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
          }`}
        >
          <Mail className={`w-4 h-4 ${activeTab === 'email' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'}`} />
          <span>Email Analyzer</span>
        </button>
      </div>

      {/* MAIN INPUT CARD */}
      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200/90 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl dark:shadow-none transition-all backdrop-blur-xl">

        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {activeTab === 'text' && <Cpu className="w-5 h-5 animate-pulse" />}
              {activeTab === 'phone' && <PhoneCall className="w-5 h-5 animate-pulse" />}
              {activeTab === 'email' && <Zap className="w-5 h-5 animate-pulse" />}
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'text' && 'SMS & Text Threat Classifier'}
                {activeTab === 'phone' && 'Phone & Carrier Threat Intelligence'}
                {activeTab === 'email' && 'Deep Email & SPF Header Inspector'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {activeTab === 'text' && 'Hybrid Heuristic Regex & Local Llama 3.2 SLM Classifier'}
                {activeTab === 'phone' && 'Country Code Formatted Inspection with Strict Length Validation'}
                {activeTab === 'email' && 'Supports 1-Click Complete Email / .EML Import with Auto-Extraction'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Client-Side Confidential
          </div>
        </div>

        {/* ─── TAB 1: SMS / TEXT FORM ────────────────────────────────────────── */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-teal-500 dark:focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <textarea
                id="sms-textarea"
                rows={4}
                value={smsText}
                onChange={e => setSmsText(e.target.value)}
                placeholder="Paste suspicious SMS, WhatsApp message, chat transcript, or notification text here..."
                className="w-full bg-transparent p-4 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none font-medium leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-100/60 dark:bg-slate-800/70 border-t border-slate-200/60 dark:border-slate-700/60 rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClipboardPaste('sms')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-xs"
                  >
                    {pasted ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-500" /> Pasted!</>
                    ) : (
                      <><Clipboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Paste Clipboard</>
                    )}
                  </button>

                  {smsText && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {smsText.length} characters
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Quick Test Samples:
              </p>
              <div className="flex flex-wrap gap-2">
                {SMS_SAMPLES.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSmsText(sample.text)}
                    className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700/80 rounded-full bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-300 hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-xs"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: PHONE LOOKUP FORM (COUNTRY CODE + NUMBER) ─────────────── */}
        {activeTab === 'phone' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Country Code & National Phone Number
                </label>

                {/* Real-time validation badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      phoneValidation.status === 'valid'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : phoneValidation.status === 'overflow'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 animate-pulse'
                        : phoneValidation.status === 'incomplete'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {phoneValidation.count} / {selectedCountryConfig.digits || '10'} digits
                  </span>
                </div>
              </div>

              {/* Combined Country Code + Phone Input Group */}
              <div className="flex flex-col sm:flex-row gap-2">
                
                {/* 1. Country Code Selector */}
                <div className="sm:w-56 shrink-0 relative">
                  <select
                    id="phone-country-code-select"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full h-full min-h-[52px] px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer shadow-xs"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code} className="dark:bg-slate-800 py-1">
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* If 'OTHER' custom code is chosen */}
                {selectedCountry === 'OTHER' && (
                  <div className="sm:w-28 shrink-0">
                    <input
                      type="text"
                      value={customCountryCode}
                      onChange={e => setCustomCountryCode(e.target.value)}
                      placeholder="+XX"
                      className="w-full min-h-[52px] px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xs"
                    />
                  </div>
                )}

                {/* 2. National Phone Number Input */}
                <div className="flex-1 relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all flex items-center px-4 shadow-xs">
                  <PhoneCall className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                  <input
                    id="phone-input"
                    type="text"
                    value={phoneNumber}
                    onChange={e => {
                      const val = e.target.value;
                      setPhoneNumber(val);
                      setError(null);
                    }}
                    onPaste={e => {
                      const text = e.clipboardData.getData('text');
                      if (text && text.includes('+')) {
                        e.preventDefault();
                        handlePhonePaste(text);
                      }
                    }}
                    placeholder={`e.g. ${selectedCountryConfig.placeholder}`}
                    className="w-full bg-transparent py-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />

                  {phoneNumber && (
                    <button
                      type="button"
                      onClick={() => setPhoneNumber('')}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* Status / Instruction text */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <span
                  className={`font-semibold transition-all ${
                    phoneValidation.status === 'valid'
                      ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                      : phoneValidation.status === 'overflow'
                      ? 'text-rose-700 dark:text-rose-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {phoneValidation.message}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClipboardPaste('phone')}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {pasted ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Pasted</> : <><Clipboard className="w-3.5 h-3.5" /> Paste Full Number</>}
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Presets for Phone */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Quick Test Samples:
              </p>
              <div className="flex flex-wrap gap-2">
                {PHONE_SAMPLES.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(sample.code);
                      setPhoneNumber(sample.number);
                      setResult(null);
                      setError(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold border rounded-full transition-all flex items-center gap-1.5 shadow-xs ${
                      sample.title.includes('Invalid')
                        ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                        : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <span>{sample.title}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({sample.code} {sample.number})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: EMAIL ANALYZER (1-CLICK IMPORT OR DETAILED FIELDS) ───── */}
        {activeTab === 'email' && (
          <div className="space-y-5">

            {/* Mode Switcher: 1-Click Complete Import vs Detailed Fields */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setEmailMode('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    emailMode === 'raw'
                      ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1-Click Complete Email / .EML Import</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailMode('fields')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    emailMode === 'fields'
                      ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Custom Form Fields (Manual)</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                {emailMode === 'raw' ? '⚡ Automatically extracts From, Subject, SPF & Attachments' : '🛠️ Manual inspection mode'}
              </span>
            </div>

            {/* ── MODE A: 1-CLICK RAW IMPORT / FILE DROP ZONE ── */}
            {emailMode === 'raw' ? (
              <div className="space-y-4">
                
                {/* File Dropzone & Large Raw Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Paste Complete Email Text or Upload (.eml / .rtf / .txt)
                    </label>

                    {/* Hidden file input supporting .rtf, .eml, .txt */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".eml,.txt,.msg,.rfc822,.rtf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Upload .eml / .rtf File
                    </button>
                  </div>

                  <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                    <textarea
                      id="raw-email-textarea"
                      rows={6}
                      value={rawEmailText}
                      onChange={e => handleRawEmailChange(e.target.value)}
                      placeholder="Paste complete email text here (including 'Show Original' headers, From:, Subject:, Body, or file attachments)..."
                      className="w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-100/60 dark:bg-slate-800/70 border-t border-slate-200/60 dark:border-slate-700/60 rounded-b-2xl">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleClipboardPaste('rawEmail')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-xs"
                        >
                          {pasted ? (
                            <><Check className="w-3.5 h-3.5 text-emerald-500" /> Pasted Email!</>
                          ) : (
                            <><Clipboard className="w-3.5 h-3.5 text-slate-400" /> Paste Full Email</>
                          )}
                        </button>

                        {rawEmailText && (
                          <button
                            type="button"
                            onClick={() => handleRawEmailChange('')}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Clear
                          </button>
                        )}
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {rawEmailText.length} characters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Extraction Diagnostics Banner */}
                {rawEmailText.trim() && (
                  <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/50 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        Auto-Extracted Email Indicators
                      </h4>

                      <button
                        type="button"
                        onClick={() => setEmailMode('fields')}
                        className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        Edit in Form Fields &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-cyan-100 dark:border-cyan-900/40 shadow-xs">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">Sender Email</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {parsedRawEmail.sender || <span className="text-slate-400 italic">None detected</span>}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-cyan-100 dark:border-cyan-900/40 shadow-xs">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">Subject</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {parsedRawEmail.subject || <span className="text-slate-400 italic">None detected</span>}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-cyan-100 dark:border-cyan-900/40 shadow-xs">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">SPF Status</span>
                        <span
                          className={`font-black uppercase text-xs inline-block px-2 py-0.5 rounded-md ${
                            parsedRawEmail.spf === 'fail'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                              : parsedRawEmail.spf === 'pass'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {parsedRawEmail.spf}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-cyan-100 dark:border-cyan-900/40 shadow-xs">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">Attachments</span>
                        <span
                          className={`font-semibold truncate block ${
                            parsedRawEmail.attachments.some(a => /\.(exe|bat|vbs|js|scr|dll)$/i.test(a))
                              ? 'text-rose-600 dark:text-rose-400 font-black'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {parsedRawEmail.attachments.length > 0
                            ? parsedRawEmail.attachments.join(', ')
                            : <span className="text-slate-400 italic">None</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Email Presets */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Quick Complete Email (.eml) Test Presets:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {RAW_EMAIL_SAMPLES.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleRawEmailChange(sample.text)}
                        className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700/80 rounded-full bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-700 dark:hover:text-cyan-300 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        {sample.title}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* ── MODE B: DETAILED FORM FIELDS (MANUAL TWEAKING) ── */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sender Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-sender" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AtSign className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      Sender Email Address
                    </label>
                    <input
                      id="email-sender"
                      type="text"
                      value={emailForm.sender}
                      onChange={e => setEmailForm(prev => ({ ...prev, sender: e.target.value }))}
                      placeholder="e.g. admin@bank-update.xyz, billing@service.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 shadow-xs transition-all"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-subject" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Heading className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      Email Subject
                    </label>
                    <input
                      id="email-subject"
                      type="text"
                      value={emailForm.subject}
                      onChange={e => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g. URGENT: ACCOUNT SUSPENDED"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 shadow-xs transition-all"
                    />
                  </div>
                </div>

                {/* Attachments Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email-attachments" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Attachments (comma-separated filenames)
                  </label>
                  <input
                    id="email-attachments"
                    type="text"
                    value={emailForm.attachments}
                    onChange={e => setEmailForm(prev => ({ ...prev, attachments: e.target.value }))}
                    placeholder="e.g. invoice.exe, payment_slip.pdf, account_details.docm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 shadow-xs transition-all"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Flags dangerous extensions: .exe, .bat, .vbs, .scr, .js, .dll, .jar, .ws, .ocx, .bin, .zip, .rar, .7z, .docm
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Body */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-body" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlignLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        Email Body Content
                      </span>
                      <button
                        type="button"
                        onClick={() => handleClipboardPaste('emailBody')}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline normal-case font-semibold"
                      >
                        Paste body
                      </button>
                    </label>
                    <textarea
                      id="email-body"
                      rows={4}
                      value={emailForm.body}
                      onChange={e => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="Paste the email content body text here..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 resize-none shadow-xs transition-all"
                    />
                  </div>

                  {/* Email Headers/Metadata (JSON) */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-headers" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        Email Headers / Metadata (JSON)
                      </span>
                      <div className="flex gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setEmailForm(prev => ({ ...prev, headers: '{\n  "spf": "fail"\n}' }))}
                          className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                        >
                          Set SPF Fail
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailForm(prev => ({ ...prev, headers: '{\n  "spf": "pass"\n}' }))}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          Set SPF Pass
                        </button>
                      </div>
                    </label>
                    <textarea
                      id="email-headers"
                      rows={4}
                      value={emailForm.headers}
                      onChange={e => setEmailForm(prev => ({ ...prev, headers: e.target.value }))}
                      placeholder='e.g. {"spf": "fail"}'
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 resize-none shadow-xs transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* SUBMIT BUTTON ROW */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Reset Form
          </button>

          <button
            id="run-analysis-btn"
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing || (activeTab === 'phone' && phoneNumber.length > 0 && !phoneValidation.isValid)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black text-sm font-black flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00e5ff]/25 transition-all active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <><RefreshCw className="w-4 h-4 animate-spin text-black" /> Analyzing Threat...</>
            ) : (
              <><Sparkles className="w-4 h-4 text-black" /> Run Threat Diagnosis</>
            )}
          </button>
        </div>

      </div>

      {/* LIVE SCANNING ANIMATION */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Multi-Tier Engine Diagnostics in Progress
              </h4>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-bold transition-all">
                {(SCAN_STEPS_MAP[activeTab] || SCAN_STEPS_MAP.text)[scanStep]}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-full animate-pulse" />
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 animate-pulse" />
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2 animate-pulse" />
          </div>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* UNIFIED STANDARDIZED THREAT CARD RESULT */}
      {result && !isAnalyzing && (
        <UnifiedThreatCard
          result={result}
          tabType={activeTab}
          analyzedInput={getCurrentAnalyzedInput()}
          onExportToReport={onExportToReport}
        />
      )}

    </div>
  );
};