import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building2,
  CreditCard,
  Hash,
  Siren,
  FileText,
  Video,
  Mail,
  Smartphone,
  Globe,
  Briefcase,
  Wallet,
  Package,
  Truck,
  TrendingUp,
  Coins,
  Cpu,
  Monitor,
  IndianRupee,
  Loader2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const SCAM_CATEGORIES = [
  'Bank & UPI Fraud',
  'CBI & Digital Arrest',
  'OTP & Phishing',
  'Part-Time Job / Task',
  'E-commerce & Delivery',
  'Investment & Crypto',
  'Tech Support & Refund'
];

export const ReportIncident = ({ onReportSuccess }) => {
  // Controlled Form State
  const [formData, setFormData] = useState({
    // Top-Level Required Inputs
    email: '',
    phone_number: '',

    // Universal Context Inputs (Stored inside incident_details)
    scam_category: 'Bank & UPI Fraud',
    incident_title: '',
    date_encountered: new Date().toISOString().split('T')[0],
    attack_methodology: '',

    // Dynamic: Bank & UPI Fraud
    bank_name: '',
    compromised_account: '',
    transaction_utr: '',

    // Dynamic: CBI & Digital Arrest
    impersonated_agency: '',
    fake_warrant_number: '',
    video_platform: '',

    // Dynamic: OTP & Phishing
    delivery_platform: '',
    spoofed_sender_id: '',
    malicious_url: '',

    // Dynamic: Part-Time Job / Task
    recruiting_platform: '',
    task_type: '',
    scammer_wallet: '',

    // Dynamic: E-commerce & Delivery
    impersonated_courier: '',
    fake_tracking_number: '',
    redelivery_fee: '',

    // Dynamic: Investment & Crypto
    fake_trading_url: '',
    asset_class: '',
    scammer_deposit_address: '',

    // Dynamic: Tech Support & Refund
    impersonated_software: '',
    remote_access_tool: '',
    payment_demanded: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // Submission handler packaging exact JSON structure
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Strict validation of Top-Level Required Inputs
    if (!formData.email.trim() || !formData.phone_number.trim()) {
      setError('Both Email Address and Phone Number are required fields.');
      return;
    }

    if (!formData.incident_title.trim()) {
      setError('Please provide an Incident Title.');
      return;
    }

    if (!formData.attack_methodology.trim()) {
      setError('Please describe the Detailed Attack Methodology.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Universal context stored inside incident_details
      const incident_details = {
        scam_category: formData.scam_category,
        incident_title: formData.incident_title.trim(),
        date_encountered: formData.date_encountered,
        attack_methodology: formData.attack_methodology.trim()
      };

      // Conditionally append category-specific dynamic fields
      if (formData.scam_category === 'Bank & UPI Fraud') {
        if (formData.bank_name) incident_details.bank_name = formData.bank_name.trim();
        if (formData.compromised_account) incident_details.compromised_account = formData.compromised_account.trim();
        if (formData.transaction_utr) incident_details.transaction_utr = formData.transaction_utr.trim();
      }

      if (formData.scam_category === 'CBI & Digital Arrest') {
        if (formData.impersonated_agency) incident_details.impersonated_agency = formData.impersonated_agency.trim();
        if (formData.fake_warrant_number) incident_details.fake_warrant_number = formData.fake_warrant_number.trim();
        if (formData.video_platform) incident_details.video_platform = formData.video_platform.trim();
      }

      if (formData.scam_category === 'OTP & Phishing') {
        if (formData.delivery_platform) incident_details.delivery_platform = formData.delivery_platform.trim();
        if (formData.spoofed_sender_id) incident_details.spoofed_sender_id = formData.spoofed_sender_id.trim();
        if (formData.malicious_url) incident_details.malicious_url = formData.malicious_url.trim();
      }

      if (formData.scam_category === 'Part-Time Job / Task') {
        if (formData.recruiting_platform) incident_details.recruiting_platform = formData.recruiting_platform.trim();
        if (formData.task_type) incident_details.task_type = formData.task_type.trim();
        if (formData.scammer_wallet) incident_details.scammer_wallet = formData.scammer_wallet.trim();
      }

      if (formData.scam_category === 'E-commerce & Delivery') {
        if (formData.impersonated_courier) incident_details.impersonated_courier = formData.impersonated_courier.trim();
        if (formData.fake_tracking_number) incident_details.fake_tracking_number = formData.fake_tracking_number.trim();
        if (formData.redelivery_fee) incident_details.redelivery_fee = formData.redelivery_fee.trim();
      }

      if (formData.scam_category === 'Investment & Crypto') {
        if (formData.fake_trading_url) incident_details.fake_trading_url = formData.fake_trading_url.trim();
        if (formData.asset_class) incident_details.asset_class = formData.asset_class.trim();
        if (formData.scammer_deposit_address) incident_details.scammer_deposit_address = formData.scammer_deposit_address.trim();
      }

      if (formData.scam_category === 'Tech Support & Refund') {
        if (formData.impersonated_software) incident_details.impersonated_software = formData.impersonated_software.trim();
        if (formData.remote_access_tool) incident_details.remote_access_tool = formData.remote_access_tool.trim();
        if (formData.payment_demanded) incident_details.payment_demanded = formData.payment_demanded.trim();
      }

      // Exact JSON structure demanded by the specification
      const payload = {
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        incident_details
      };

      const endpoint = `${API_BASE_URL}/api/report`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setSuccess({
        complaint_id: data.complaint_id,
        message: data.message || 'Complaint recorded in database successfully.'
      });

      if (onReportSuccess) {
        onReportSuccess(data);
      }

      // Reset dynamic details but retain email & phone for convenience
      setFormData((prev) => ({
        ...prev,
        incident_title: '',
        attack_methodology: '',
        bank_name: '',
        compromised_account: '',
        transaction_utr: '',
        impersonated_agency: '',
        fake_warrant_number: '',
        video_platform: '',
        delivery_platform: '',
        spoofed_sender_id: '',
        malicious_url: '',
        recruiting_platform: '',
        task_type: '',
        scammer_wallet: '',
        impersonated_courier: '',
        fake_tracking_number: '',
        redelivery_fee: '',
        fake_trading_url: '',
        asset_class: '',
        scammer_deposit_address: '',
        impersonated_software: '',
        remote_access_tool: '',
        payment_demanded: ''
      }));

    } catch (err) {
      console.error('Incident report error:', err);
      setError(err.message || 'Failed to submit incident report to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const INPUT_STYLE = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 text-sm font-medium transition-all";
  const LABEL_STYLE = "block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5";

  return (
    <div className="bg-white/95 dark:bg-[#080d1a]/95 border border-slate-200/90 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
      
      {/* Header Badge */}
      <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-[#00e5ff] text-xs font-bold font-mono tracking-wide">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>OFFICIAL INCIDENT REPORTING DISPATCH</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight font-display">
          Report a Cyber Threat & Fraud Incident
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          Submit fraudulent activity to the national intelligence register. Dynamic parameters adapt automatically to the attack vector.
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Incident Complaint Successfully Filed #{success.complaint_id}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 pl-7">
            {success.message} The incident metadata has been saved into the MySQL database JSON column.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Controlled Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: TOP-LEVEL REQUIRED INPUTS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-600 dark:text-[#00e5ff] uppercase tracking-wider">
            <span>1. Mandatory Complainant Identifiers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_STYLE}>
                <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00e5ff]" />
                <span>Email Address <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="citizen@domain.com"
                required
                className={INPUT_STYLE}
              />
            </div>

            <div>
              <label className={LABEL_STYLE}>
                <Smartphone className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00e5ff]" />
                <span>Phone Number <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                required
                className={INPUT_STYLE}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: UNIVERSAL CONTEXT INPUTS */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-600 dark:text-[#c084fc] uppercase tracking-wider">
            <span>2. Universal Incident Context</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_STYLE}>
                <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Scam Category <span className="text-rose-500">*</span></span>
              </label>
              <select
                name="scam_category"
                value={formData.scam_category}
                onChange={handleInputChange}
                className={INPUT_STYLE}
              >
                {SCAM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white dark:bg-[#040711] text-slate-900 dark:text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL_STYLE}>
                <Calendar className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Date Encountered <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                name="date_encountered"
                value={formData.date_encountered}
                onChange={handleInputChange}
                required
                className={INPUT_STYLE}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_STYLE}>
              <FileText className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>Incident Title <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              name="incident_title"
              value={formData.incident_title}
              onChange={handleInputChange}
              placeholder="e.g. Fake KYC Account Suspension Notice, Electricity APK Scam..."
              required
              className={INPUT_STYLE}
            />
          </div>

          <div>
            <label className={LABEL_STYLE}>
              <Info className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>Detailed Attack Methodology <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              name="attack_methodology"
              value={formData.attack_methodology}
              onChange={handleInputChange}
              rows={4}
              placeholder="Explain the tactics used by the fraudster: communication channels, deception narratives, threats, or payment demands..."
              required
              className={INPUT_STYLE}
            />
          </div>
        </div>

        {/* SECTION 3: DYNAMIC CATEGORY-SPECIFIC FIELDS USING CONDITIONAL RENDERING (&&) */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-cyan-600 dark:text-[#00e5ff] uppercase tracking-wider">
              3. Dynamic Vector Parameters: {formData.scam_category}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Adapts dynamically to category
            </span>
          </div>

          {/* DYNAMIC 1: Bank & UPI Fraud */}
          {formData.scam_category === 'Bank & UPI Fraud' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Bank Name</span>
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g. SBI, HDFC, ICICI"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <CreditCard className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Compromised Account</span>
                </label>
                <input
                  type="text"
                  name="compromised_account"
                  value={formData.compromised_account}
                  onChange={handleInputChange}
                  placeholder="Account Number or UPI ID"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Hash className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Transaction UTR</span>
                </label>
                <input
                  type="text"
                  name="transaction_utr"
                  value={formData.transaction_utr}
                  onChange={handleInputChange}
                  placeholder="12-digit UTR or Reference #"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* DYNAMIC 2: CBI & Digital Arrest */}
          {formData.scam_category === 'CBI & Digital Arrest' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Siren className="w-3.5 h-3.5 text-rose-500" />
                  <span>Impersonated Agency</span>
                </label>
                <input
                  type="text"
                  name="impersonated_agency"
                  value={formData.impersonated_agency}
                  onChange={handleInputChange}
                  placeholder="e.g. CBI, ED, Cyber Police"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  <span>Fake Warrant Number</span>
                </label>
                <input
                  type="text"
                  name="fake_warrant_number"
                  value={formData.fake_warrant_number}
                  onChange={handleInputChange}
                  placeholder="e.g. CBI/FIR-9821/2026"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Video Platform</span>
                </label>
                <input
                  type="text"
                  name="video_platform"
                  value={formData.video_platform}
                  onChange={handleInputChange}
                  placeholder="e.g. Skype, WhatsApp Video"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* DYNAMIC 3: OTP & Phishing */}
          {formData.scam_category === 'OTP & Phishing' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Delivery Platform</span>
                </label>
                <input
                  type="text"
                  name="delivery_platform"
                  value={formData.delivery_platform}
                  onChange={handleInputChange}
                  placeholder="e.g. SMS, WhatsApp, Email"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Hash className="w-3.5 h-3.5 text-amber-500" />
                  <span>Spoofed Sender ID</span>
                </label>
                <input
                  type="text"
                  name="spoofed_sender_id"
                  value={formData.spoofed_sender_id}
                  onChange={handleInputChange}
                  placeholder="e.g. AX-BOBALT, VK-HDFCBK"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  <span>Malicious URL</span>
                </label>
                <input
                  type="url"
                  name="malicious_url"
                  value={formData.malicious_url}
                  onChange={handleInputChange}
                  placeholder="https://bank-verification.xyz/login"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* DYNAMIC 4: Part-Time Job / Task */}
          {formData.scam_category === 'Part-Time Job / Task' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Briefcase className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Recruiting Platform</span>
                </label>
                <input
                  type="text"
                  name="recruiting_platform"
                  value={formData.recruiting_platform}
                  onChange={handleInputChange}
                  placeholder="e.g. Telegram, WhatsApp, Instagram"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <FileText className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Task Type</span>
                </label>
                <input
                  type="text"
                  name="task_type"
                  value={formData.task_type}
                  onChange={handleInputChange}
                  placeholder="e.g. YouTube Likes, Hotel Reviews"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Wallet className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Scammer Wallet</span>
                </label>
                <input
                  type="text"
                  name="scammer_wallet"
                  value={formData.scammer_wallet}
                  onChange={handleInputChange}
                  placeholder="Scammer UPI ID or Crypto Wallet"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* DYNAMIC 5: E-commerce & Delivery */}
          {formData.scam_category === 'E-commerce & Delivery' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Truck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Impersonated Courier</span>
                </label>
                <input
                  type="text"
                  name="impersonated_courier"
                  value={formData.impersonated_courier}
                  onChange={handleInputChange}
                  placeholder="e.g. India Post, FedEx, BlueDart"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Fake Tracking Number</span>
                </label>
                <input
                  type="text"
                  name="fake_tracking_number"
                  value={formData.fake_tracking_number}
                  onChange={handleInputChange}
                  placeholder="e.g. IN982145892"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <IndianRupee className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Redelivery Fee</span>
                </label>
                <input
                  type="text"
                  name="redelivery_fee"
                  value={formData.redelivery_fee}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹25, ₹49"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* DYNAMIC 6: Investment & Crypto */}
          {formData.scam_category === 'Investment & Crypto' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fake Trading URL</span>
                </label>
                <input
                  type="url"
                  name="fake_trading_url"
                  value={formData.fake_trading_url}
                  onChange={handleInputChange}
                  placeholder="https://global-trade-fx.vip"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Asset Class</span>
                </label>
                <input
                  type="text"
                  name="asset_class"
                  value={formData.asset_class}
                  onChange={handleInputChange}
                  placeholder="e.g. Crypto, Forex, VIP Stocks"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scammer Deposit Address</span>
                </label>
                <input
                  type="text"
                  name="scammer_deposit_address"
                  value={formData.scammer_deposit_address}
                  onChange={handleInputChange}
                  placeholder="USDT TRC20 or Escrow Account"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* DYNAMIC 7: Tech Support & Refund */}
          {formData.scam_category === 'Tech Support & Refund' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div>
                <label className={LABEL_STYLE}>
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>Impersonated Software</span>
                </label>
                <input
                  type="text"
                  name="impersonated_software"
                  value={formData.impersonated_software}
                  onChange={handleInputChange}
                  placeholder="e.g. Microsoft, Apple, McAfee"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span>Remote Access Tool</span>
                </label>
                <input
                  type="text"
                  name="remote_access_tool"
                  value={formData.remote_access_tool}
                  onChange={handleInputChange}
                  placeholder="e.g. AnyDesk, TeamViewer, RustDesk"
                  className={INPUT_STYLE}
                />
              </div>

              <div>
                <label className={LABEL_STYLE}>
                  <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                  <span>Payment Demanded</span>
                </label>
                <input
                  type="text"
                  name="payment_demanded"
                  value={formData.payment_demanded}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹49,999 or Gift Cards"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span className="text-rose-500 font-bold">*</span> Mandatory fields for national intelligence ingestion.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#00e5ff]/25 active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Registering Complaint...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Incident Complaint</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
