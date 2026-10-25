import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  PlusCircle, 
  UploadCloud, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  FileText, 
  HelpCircle, 
  Image as ImageIcon, 
  Radio 
} from 'lucide-react';
import { useScams } from '../context/ScamContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export const ReportPage = () => {
  const navigate = useNavigate();
  const { addReport } = useScams();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    scamType: 'Website',
    identifier: '',
    secondaryIdentifier: '',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    threatLevel: 'High',
  });

  const [proofFile, setProofFile] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const scamTypes = [
    'Website',
    'Email',
    'Phone Call',
    'SMS',
    'Social Media',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setProofPreviewUrl(preview);
      } else {
        setProofPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    setProofFile(null);
    if (proofPreviewUrl) {
      URL.revokeObjectURL(proofPreviewUrl);
      setProofPreviewUrl(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.scamType) newErrors.scamType = 'Please select a scam type';
    if (!formData.identifier.trim()) newErrors.identifier = 'The reported website, phone, or email is required';
    if (!formData.title.trim()) newErrors.title = 'A short summary/title is required';
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide details of what happened';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please write at least 20 characters explaining the scam';
    }
    if (!formData.incidentDate) newErrors.incidentDate = 'Date of incident is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // 1. Add to local community feed state (localStorage)
    addReport({
      scamType: formData.scamType,
      identifier: formData.identifier.trim(),
      secondaryIdentifier: formData.secondaryIdentifier.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      incidentDate: formData.incidentDate,
      threatLevel: formData.threatLevel,
      reportedBy: currentUser ? currentUser.name : 'Verified Citizen Sentinel',
      proofImage: proofPreviewUrl || "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
      proofFileName: proofFile ? proofFile.name : null
    });

    // 2. Automatically index phone numbers and emails into MySQL threat intelligence database
    try {
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scamType: formData.scamType,
          identifier: formData.identifier.trim(),
          secondaryIdentifier: formData.secondaryIdentifier.trim(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          threatLevel: formData.threatLevel
        })
      });
      const data = await response.json();
      console.log('Threat database indexed:', data);
    } catch (err) {
      console.warn('Backend database report sync error:', err.message);
    }

    setSuccessMessage('Scam threat signature and identifiers registered into the cyber fraud database!');

    setTimeout(() => {
      navigate('/database');
    }, 1400);
  };

  const handleAutofillTemplate = () => {
    setFormData({
      scamType: 'SMS',
      identifier: '+1 (800) 412-8833',
      secondaryIdentifier: 'secure-bank-account-revalidation.com',
      title: 'Urgent Debit Card Temporary Freeze Phishing Link',
      description: 'Received a text message stating: "Alert: Your debit card ending in 4102 has been temporarily suspended due to unusual activity. Reactivate immediately at secure-bank-account-revalidation.com or visit a branch." The website replicated a major bank and prompted for card number, PIN, and CVV.',
      incidentDate: new Date().toISOString().split('T')[0],
      threatLevel: 'Critical',
    });
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Broadcast Incident Advisory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Submit Fraud Incident Report
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
          Document deceptive contact points, fraudulent phone numbers, or spoofed URLs to immunize the community against repeat attacks.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-400 text-sm font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Template Helper Button */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#040711] rounded-2xl border border-slate-200 dark:border-white/10 text-xs">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff]" />
            Need a structured sample format?
          </span>
          <button
            type="button"
            onClick={handleAutofillTemplate}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#080d1a] dark:hover:bg-white/10 text-cyan-700 dark:text-[#00e5ff] font-bold border border-slate-200 dark:border-cyan-500/30 transition-colors shadow-sm font-mono"
          >
            ⚡ Load Threat Template
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1: Scam Type + Threat Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Scam Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Attack Vector / Scam Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="scamType"
                value={formData.scamType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#040711] border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium"
              >
                {scamTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.scamType && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.scamType}
                </p>
              )}
            </div>

            {/* Threat Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Calculated Threat Severity
              </label>
              <select
                name="threatLevel"
                value={formData.threatLevel}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#040711] border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium"
              >
                <option value="Critical">Critical (Financial Drain / Account Takeover)</option>
                <option value="High">High (Phishing Link / Credential Harvesting)</option>
                <option value="Medium">Medium (Unsolicited Pitch / Suspicious Message)</option>
              </select>
            </div>

          </div>

          {/* Row 2: Reported Identifier (URL / Phone / Email) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Primary Fraudulent Identifier (Link, Phone, or Email) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              placeholder="e.g. +1 (800) 555-0199, usps-redelivery-portal.org, support@irs-warrant.net"
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-[#040711] border ${
                errors.identifier ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
              } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-mono`}
            />
            <p className="text-[11px] text-slate-500">
              This exact identifier will be indexed for instant community search matches.
            </p>
            {errors.identifier && (
              <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.identifier}
              </p>
            )}
          </div>

          {/* Optional Secondary Identifier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Impersonated Brand / Secondary Contact Point (Optional)
            </label>
            <input
              type="text"
              name="secondaryIdentifier"
              value={formData.secondaryIdentifier}
              onChange={handleInputChange}
              placeholder="e.g. Impersonating Chase Bank Fraud Dept, Telegram: @AdminEscrow"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#040711] border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20"
            />
          </div>

          {/* Row 3: Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Incident Title / Summary Headline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Fake delivery text demanding credit card for redelivery fee"
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
                  errors.title ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
                } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20`}
              />
              {errors.title && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Date Encountered <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#040711] border border-slate-300 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20"
              />
              {errors.incidentDate && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.incidentDate}
                </p>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Detailed Attack Methodology <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the tactics: How did they contact you? What payment or information was demanded? What fake threats were made?..."
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-[#040711] border ${
                errors.description ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
              } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 leading-relaxed font-medium`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>

          {/* Optional File Upload for Proof / Screenshot */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Screenshot Evidence / Threat Artifacts (Optional)
            </label>

            {!proofFile ? (
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-[#00e5ff] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-[#040711] dark:hover:bg-[#080d1a]">
                <UploadCloud className="w-8 h-8 text-teal-600 dark:text-[#00e5ff] mb-2" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Select screenshot, email header, or message capture
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  PNG, JPG, or WEBP up to 10MB (Stored securely in local session)
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-[#040711] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  {proofPreviewUrl ? (
                    <img
                      src={proofPreviewUrl}
                      alt="Proof Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-[#00e5ff]">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {proofFile.name}
                    </p>
                    <p className="text-[11px] text-teal-700 dark:text-[#00e5ff] font-mono font-semibold">
                      {(proofFile.size / 1024).toFixed(1)} KB • Verified Local Evidence
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2 bg-slate-50 dark:bg-[#040711] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-medium">
            <HelpCircle className="w-4 h-4 text-teal-600 dark:text-[#00e5ff] shrink-0 mt-0.5" />
            <span>
              <strong>PII Redaction:</strong> Never include personal banking credentials, credit card numbers, or government IDs. Redact private information prior to submission.
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/database')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00e5ff]/25 active:scale-[0.98] disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Publishing Threat Signature...' : 'Publish Scam Warning'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
