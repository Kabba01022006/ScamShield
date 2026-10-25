import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Loader2,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Building2,
  User,
  Phone,
  CreditCard,
  Calendar,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useRecoveryStore } from '../../store/useRecoveryStore';
import { SCAM_CATEGORIES, validateComplaintForm } from '../../utils/validators';
import { FormField } from '../../components/form/FormField';
import { TextInput } from '../../components/form/TextInput';
import { SelectInput } from '../../components/form/SelectInput';
import { TextArea } from '../../components/form/TextArea';

/**
 * Helper to get current date formatted as YYYY-MM-DD
 */
const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Default empty form state - strictly blank by default
 */
export const BLANK_FORM = {
  fullName: '',
  contactPhone: '',
  scamCategory: '',
  incidentDate: '',
  amountLost: '',
  transactionId: '',
  scammerIdentifier: '',
  victimBankDetails: '',
  incidentDescription: '',
};

/**
 * Realistic OLX Reverse UPI QR sample scenario
 */
export const SAMPLE_OLX_SCENARIO = {
  fullName: 'Rohan Verma',
  contactPhone: '9876543210',
  scamCategory: 'OLX Reverse UPI QR',
  incidentDate: getTodayDateString(),
  amountLost: '45000',
  transactionId: '409281726354',
  scammerIdentifier: 'paytm-buyer92@okhdfcbank / +91 9811223344',
  victimBankDetails: 'HDFC Bank (Account ending 4821)',
  incidentDescription:
    'Listed a second-hand sofa for sale on OLX for Rs 15,000. Buyer claiming to be an Indian Army subedar contacted me on WhatsApp and agreed to purchase without bargaining. He sent an OLX-branded QR code stating "Scan this to receive advance payment into your account". Upon scanning and entering my UPI PIN, Rs 45,000 was debited in three unauthorized installments of Rs 15,000 each. The scammer immediately disconnected calls and blocked me.',
};

/**
 * Generates an ASCII-bordered formal complaint document ready for cybercrime.gov.in
 */
const generateAsciiComplaint = (data) => {
  const formattedAmount =
    data.amountLost !== undefined && data.amountLost !== ''
      ? `INR ${Number(data.amountLost).toLocaleString('en-IN')}`
      : 'INR 0 (Prevented / Zero Direct Loss)';

  const now = new Date();
  const timestamp = now.toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const divider = '--------------------------------------------------------------------------------';
  const boxTop = '+==============================================================================+';
  const boxBottom = '+==============================================================================+';

  return [
    boxTop,
    '|                      FORMAL CYBERCRIME COMPLAINT DRAFT                       |',
    '|           Prepared for Submission to: cybercrime.gov.in / 1930 / Police      |',
    '|           Citizen Financial Cyber Fraud Reporting System (CFCFRMS)           |',
    boxBottom,
    '',
    `DRAFT GENERATION DATE      : ${timestamp}`,
    `INCIDENT CATEGORY          : ${data.scamCategory || 'Cyber Financial Fraud'}`,
    'DOCUMENT PURPOSE           : Official Police & Banking Ombudsman Evidence Draft',
    '',
    '1. COMPLAINANT IDENTIFICATION',
    divider,
    `Full Legal Name            : ${data.fullName || '[Name Not Specified]'}`,
    `Contact Mobile Number      : +91 ${data.contactPhone || '[Phone Not Specified]'}`,
    '',
    '2. FINANCIAL & TRANSACTION PARTICULARS',
    divider,
    `Scam Category / Modus      : ${data.scamCategory || '[Category Not Specified]'}`,
    `Date of Incident           : ${data.incidentDate || '[Date Not Specified]'}`,
    `Total Disputed Amount      : ${formattedAmount}`,
    `Primary Transaction Ref/UTR: ${data.transactionId || '[UTR Not Specified]'}`,
    `Complainant Bank & Account : ${data.victimBankDetails || '[Bank & Card/Account Ending Details Not Specified]'}`,
    '',
    '3. ATTACKER & FRAUDSTER IDENTIFIERS',
    divider,
    `Suspect Phone / UPI / URL  : ${data.scammerIdentifier || '[Attacker Coordinates Not Specified]'}`,
    '',
    '4. CHRONOLOGICAL NARRATIVE OF THE INCIDENT',
    divider,
    data.incidentDescription
      ? data.incidentDescription.trim()
      : '[No narrative provided]',
    '',
    '5. IMMEDIATE INCIDENT MITIGATION PROTOCOLS EXECUTED',
    divider,
    '[X] Immediate call placed to National Cyber Crime Helpline (1930)',
    '[X] Home bank informed for emergency fraud dispute & recipient account lien',
    '[X] Compromised payment applications, debit/credit cards, and credentials blocked',
    '[X] Digital evidence preserved (12-digit UTR, chat transcripts, payment slips)',
    '',
    '6. LEGAL DECLARATION & PRAYER FOR POLICE / BANK INTERVENTION',
    divider,
    'I hereby solemnly declare that the facts and particulars stated above are true',
    'and correct to the best of my knowledge and memory. I request the Cyber Crime',
    'Police Cell and concerned Nodal Banking Authorities to:',
    '1. Direct the recipient/beneficiary bank to freeze and place an immediate lien on',
    '   the mule bank account that received the illicit funds.',
    '2. Initiate inter-bank recall and reversal proceedings under RBI / NPCI guidelines.',
    '3. Register an official FIR/NCRP complaint and initiate investigation against the',
    '   accused under relevant provisions of the Information Technology Act, 2000',
    '   and Bharatiya Nyaya Sanhita (BNS).',
    '',
    'Complainant Signature      : ___________________________________________________',
    `Date & Location            : ${data.incidentDate || getTodayDateString()}, India`,
    boxBottom,
  ].join('\n');
};

/**
 * ComplaintDraftStep (Step 2)
 * 
 * Form view to collect incident details with inline validation.
 * The form starts completely blank by default. Users can manually enter data
 * or click "⚡ Fill Sample Scenario" to load sample details.
 * Switches to formatted ASCII text output view upon clicking "Generate Formatted Complaint Draft".
 */
export const ComplaintDraftStep = () => {
  const draft = useRecoveryStore((s) => s.draft);
  const saveDraft = useRecoveryStore((s) => s.saveDraft);
  const clearDraft = useRecoveryStore((s) => s.clearDraft);

  // View state: 'form' or 'preview'
  const [viewMode, setViewMode] = useState('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form field state: starts blank by default unless active draft exists with user-entered values
  const [formValues, setFormValues] = useState(() => {
    if (draft && typeof draft === 'object') {
      const hasAnyValue = Object.values(draft).some(
        (val) => val !== null && val !== undefined && String(val).trim() !== ''
      );
      if (hasAnyValue) {
        return {
          fullName: draft.fullName || '',
          contactPhone: draft.contactPhone || '',
          scamCategory: draft.scamCategory || '',
          incidentDate: draft.incidentDate || '',
          amountLost: draft.amountLost !== undefined ? String(draft.amountLost) : '',
          transactionId: draft.transactionId || '',
          scammerIdentifier: draft.scammerIdentifier || '',
          victimBankDetails: draft.victimBankDetails || '',
          incidentDescription: draft.incidentDescription || '',
        };
      }
    }
    return { ...BLANK_FORM };
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync state changes with Zustand store only when non-empty
  useEffect(() => {
    const hasAnyValue = Object.values(formValues).some(
      (val) => val !== null && val !== undefined && String(val).trim() !== ''
    );
    if (hasAnyValue) {
      saveDraft(formValues);
    }
  }, [formValues, saveDraft]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if valid on change
    if (errors[name]) {
      const updatedValues = { ...formValues, [name]: value };
      const validationErrors = validateComplaintForm(updatedValues);
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name] || undefined,
      }));
    }
  };

  const handleFieldBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validateComplaintForm(formValues);
    if (validationErrors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
      }));
    }
  };

  // Special Feature 1: "⚡ Fill Sample Scenario"
  const handleFillSample = () => {
    setFormValues({ ...SAMPLE_OLX_SCENARIO });
    setErrors({});
    setTouched({});
    saveDraft({ ...SAMPLE_OLX_SCENARIO });
  };

  // Clear Form Action: Wipes all fields back to blank
  const handleClearForm = () => {
    setFormValues({ ...BLANK_FORM });
    setErrors({});
    setTouched({});
    if (clearDraft) {
      clearDraft();
    } else {
      saveDraft(null);
    }
  };

  // Check if form has any content filled in
  const isFormFilled = useMemo(() => {
    return Object.values(formValues).some(
      (val) => val !== null && val !== undefined && String(val).trim() !== ''
    );
  }, [formValues]);

  // Form submission: Validate and switch to Formatted Text Output View
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validateComplaintForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }

    // Simulate generation with quick feedback
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    saveDraft(formValues);
    setIsGenerating(false);
    setViewMode('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Plaintext complaint string
  const complaintPlainText = useMemo(() => {
    return generateAsciiComplaint(formValues);
  }, [formValues]);

  // Special Feature 2: "Copy Plaintext" button with temporary state
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(complaintPlainText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = complaintPlainText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  // Special Feature 3: "Download .txt" button with exact file name
  const handleDownloadTxt = () => {
    const todayStr = getTodayDateString();
    const fileName = `Cyber_Crime_Complaint_Draft_${todayStr}.txt`;
    const blob = new Blob([complaintPlainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Navigation Row: Back to Step 1 & View Toggle indicator */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/recover"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 1: Immediate Actions</span>
        </Link>

        {viewMode === 'preview' && (
          <button
            type="button"
            onClick={() => setViewMode('form')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Complaint Details</span>
          </button>
        )}
      </div>

      {/* VIEW MODE 1: FORM VIEW */}
      {viewMode === 'form' && (
        <div className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Header & Sample Fill Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Step 2 of 2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                Official Complaint Draft Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Enter your incident particulars below. Our engine compiles them into a formal legal statement formatted for cybercrime.gov.in and 1930 reporting.
              </p>
            </div>

            {/* Scenario buttons: "⚡ Fill Sample Scenario" & "Clear Form" */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleFillSample}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-[#00e5ff] font-extrabold text-xs border border-cyan-500/30 transition-all font-mono shadow-sm active:scale-95"
                title="Automatically pre-fills the form with a realistic OLX reverse UPI QR scam scenario for testing"
              >
                <Sparkles className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff]" />
                <span>⚡ Fill Sample Scenario</span>
              </button>

              {isFormFilled && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all active:scale-95"
                  title="Clear all fields back to blank"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleGenerate} noValidate className="space-y-8">
            
            {/* Section 1: Complainant Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                <User className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff]" />
                <span>1. Complainant Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Legal Name */}
                <FormField
                  id="fullName"
                  label="Full Legal Name"
                  required
                  error={errors.fullName}
                  hint="As registered in your bank account records"
                >
                  <TextInput
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Rohan Verma"
                    value={formValues.fullName}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.fullName}
                  />
                </FormField>

                {/* Contact Mobile Number */}
                <FormField
                  id="contactPhone"
                  label="Contact Mobile Number"
                  required
                  error={errors.contactPhone}
                  hint="10-digit Indian phone number (for police verification & SMS updates)"
                >
                  <TextInput
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formValues.contactPhone}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.contactPhone}
                  />
                </FormField>

              </div>
            </div>

            {/* Section 2: Financial & Incident Particulars */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                <CreditCard className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff]" />
                <span>2. Financial & Incident Particulars</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Scam Category */}
                <FormField
                  id="scamCategory"
                  label="Scam Category"
                  required
                  error={errors.scamCategory}
                >
                  <SelectInput
                    id="scamCategory"
                    name="scamCategory"
                    value={formValues.scamCategory}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    options={SCAM_CATEGORIES}
                    placeholder="Select Scam Category"
                    error={errors.scamCategory}
                  />
                </FormField>

                {/* Incident Date */}
                <FormField
                  id="incidentDate"
                  label="Incident Date"
                  required
                  error={errors.incidentDate}
                  hint="Cannot be in the future"
                >
                  <TextInput
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    max={getTodayDateString()}
                    value={formValues.incidentDate}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.incidentDate}
                  />
                </FormField>

                {/* Amount Lost in ₹ */}
                <FormField
                  id="amountLost"
                  label="Amount Lost in ₹"
                  required
                  error={errors.amountLost}
                  hint="Enter 0 if the transaction was blocked or frozen in time"
                >
                  <TextInput
                    id="amountLost"
                    name="amountLost"
                    type="number"
                    min="0"
                    placeholder="e.g. 45000 (or 0)"
                    value={formValues.amountLost}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.amountLost}
                  />
                </FormField>

                {/* Transaction Reference / 12-digit UTR Number */}
                <FormField
                  id="transactionId"
                  label="Transaction Reference / 12-digit UTR Number"
                  required
                  error={errors.transactionId}
                  hint="12-digit UPI reference number or IMPS/NEFT UTR from bank SMS"
                >
                  <TextInput
                    id="transactionId"
                    name="transactionId"
                    placeholder="e.g. 409281726354"
                    value={formValues.transactionId}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.transactionId}
                  />
                </FormField>

              </div>
            </div>

            {/* Section 3: Attacker Coordinates & Narrative */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                <AlertOctagon className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff]" />
                <span>3. Attacker Coordinates & Narrative</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Scammer's Phone / UPI ID / URL */}
                <FormField
                  id="scammerIdentifier"
                  label="Scammer's Phone / UPI ID / URL"
                  required
                  error={errors.scammerIdentifier}
                  hint="e.g. 9811223344, paytm-fraud@okhdfc, or malicious link"
                >
                  <TextInput
                    id="scammerIdentifier"
                    name="scammerIdentifier"
                    placeholder="e.g. paytm-buyer92@okhdfcbank / +91 9811223344"
                    value={formValues.scammerIdentifier}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.scammerIdentifier}
                  />
                </FormField>

                {/* Victim's Bank Name & Card/Account Ending 4 digits */}
                <FormField
                  id="victimBankDetails"
                  label="Victim's Bank Name & Card/Account Ending 4 digits"
                  required
                  error={errors.victimBankDetails}
                  hint="e.g. HDFC Bank (Account ending 4821)"
                >
                  <TextInput
                    id="victimBankDetails"
                    name="victimBankDetails"
                    placeholder="e.g. HDFC Bank (Account ending 4821)"
                    value={formValues.victimBankDetails}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    error={errors.victimBankDetails}
                  />
                </FormField>

              </div>

              {/* Chronological Description of Incident */}
              <FormField
                id="incidentDescription"
                label="Chronological Description of Incident"
                required
                error={errors.incidentDescription}
                hint="Describe step-by-step: what scam was promised, what link/app was used, and how funds were debited (minimum 20 characters)"
              >
                <TextArea
                  id="incidentDescription"
                  name="incidentDescription"
                  rows={4}
                  placeholder="Detail sequential facts: Listed item on OLX -> Scammer offered advance via QR code -> Scanned code on UPI -> Unauthorized funds debited..."
                  value={formValues.incidentDescription}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  error={errors.incidentDescription}
                />
              </FormField>

            </div>

            {/* Form Action Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-base shadow-xl shadow-[#00e5ff]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Formatting Official Complaint Draft...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Generate Formatted Complaint Draft</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* VIEW MODE 2: FORMATTED TEXT OUTPUT VIEW (PREVIEW) */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          
          {/* Main Preview Container */}
          <div className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Header & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    Official Draft Ready
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Formatted for cybercrime.gov.in / 1930
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display mt-1">
                  Formatted Complaint Statement
                </h2>
              </div>

              {/* Action Buttons: Edit, Copy, Download */}
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all active:scale-95"
                  title="Switch back to form to adjust details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                {/* Copy Plaintext Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all shadow-sm active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-300 font-extrabold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Plaintext</span>
                    </>
                  )}
                </button>

                {/* Download .txt Button */}
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black text-xs font-extrabold shadow-md shadow-[#00e5ff]/20 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download .txt</span>
                </button>

              </div>
            </div>

            {/* Monospace <pre> Block with ASCII Borders */}
            <div className="relative">
              <pre
                tabIndex={0}
                aria-label="Formatted Complaint Draft Output"
                className="p-5 sm:p-6 bg-slate-950 text-slate-100 rounded-2xl text-xs sm:text-[13px] font-mono leading-relaxed whitespace-pre-wrap max-h-[520px] overflow-y-auto border border-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/40 selection:bg-cyan-500 selection:text-black font-normal"
              >
                {complaintPlainText}
              </pre>
            </div>

            {/* Secondary Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                File format: UTF-8 encoded plain text file compatible with police cyber cells and bank dispute forms.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-bold text-cyan-600 dark:text-[#00e5ff] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
                <span className="text-slate-400">|</span>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="text-xs font-bold text-cyan-600 dark:text-[#00e5ff] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download as .txt</span>
                </button>
              </div>
            </div>

          </div>

          {/* "Next Official Actions" Checklist */}
          <div className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                  Mandatory Follow-up
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                  Next Official Actions: Submit to Authorities
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Generating this draft is step one. To initiate official asset freeze and recovery proceedings, complete these official steps immediately:
            </p>

            <ol className="space-y-3 pt-1">
              
              <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Submit on National Cyber Crime Portal (cybercrime.gov.in)
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Log in at{' '}
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 dark:text-[#00e5ff] font-bold underline inline-flex items-center gap-0.5"
                    >
                      cybercrime.gov.in
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>{' '}
                    with your mobile number. Select <strong>"Financial Fraud"</strong> and paste this chronological incident statement into the narrative box.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Upload Admissible Digital Evidence
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Attach screenshots of the fraudulent chats, SMS messages showing debit alerts, and your bank statement highlighting the 12-digit UTR.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Record Your 14-Digit NCRP Acknowledgement Number
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Once submitted, note down the acknowledgement number. This official government reference number is legally required by your bank for chargebacks.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-[#00e5ff] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Visit Your Home Bank Branch Within 24 Hours
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Visit your local bank branch manager. Hand over a physical copy of this complaint text and the NCRP Acknowledgement Number. Demand a written dispute docket number to ensure an inter-bank refund claim is active.
                  </p>
                </div>
              </li>

            </ol>

            {/* Quick Link Out to cybercrime.gov.in */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                <span>Open cybercrime.gov.in to File Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="tel:1930"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call 1930 Helpline</span>
              </a>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ComplaintDraftStep;
