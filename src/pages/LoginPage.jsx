import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  KeyRound, 
  ShieldAlert, 
  Fingerprint 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const { login, signup, currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isSignUp) {
      signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setSubmittedMessage(`Sentinel account created for ${formData.name}! Redirecting...`);
    } else {
      login({
        email: formData.email.trim(),
        password: formData.password,
      });
      setSubmittedMessage('Sentinel credentials verified! Redirecting to dashboard...');
    }

    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  // If already authenticated
  if (isAuthenticated && currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-[#00e5ff]/20 rounded-3xl p-8 text-center space-y-6 shadow-xl dark:shadow-[0_0_30px_rgba(0,229,255,0.08)]">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 dark:bg-[#00e5ff]/15 dark:text-[#00e5ff] dark:border-[#00e5ff]/30 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Sentinel Session</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
              Signed in as <span className="text-teal-700 dark:text-[#00e5ff] font-bold">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#040711] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Security Clearance:</span>
              <span className="text-teal-800 dark:text-[#a855f7] font-bold font-mono">{currentUser.role || 'Community Sentinel'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Threat Submission Node:</span>
              <span className="text-emerald-700 dark:text-[#00e5ff] font-bold flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span> Authorized / Active
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] text-black font-extrabold text-sm transition-all text-center shadow-lg shadow-[#00e5ff]/20 hover:opacity-95 active:scale-[0.98]"
            >
              Return to Defense Dashboard
            </Link>
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 dark:bg-[#040711] dark:hover:bg-rose-500/20 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors"
            >
              Terminate Session (Sign Out)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#080d1a]/95 backdrop-blur-md border border-slate-200/90 dark:border-[#00e5ff]/20 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/15 blur-2xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00e5ff]/10 blur-2xl pointer-events-none rounded-full" />

        {/* Header with icon */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-[#00e5ff]/15 text-teal-700 dark:text-[#00e5ff] flex items-center justify-center mx-auto border border-teal-200 dark:border-[#00e5ff]/30 shadow-inner">
            <Fingerprint className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isSignUp ? 'Enroll Defense Sentinel' : 'Sentinel Authentication'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isSignUp
              ? 'Join the citizen intelligence network to track and neutralize scams'
              : 'Sign in to access verified threat logging and incident tracking'}
          </p>
        </div>

        {/* Tab Toggle Switch */}
        <div className="flex p-1 bg-slate-100 dark:bg-[#040711] rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrors({});
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-teal-600 text-white dark:bg-gradient-to-r dark:from-[#00e5ff] dark:to-[#a855f7] dark:text-black dark:font-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrors({});
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isSignUp
                ? 'bg-teal-600 text-white dark:bg-gradient-to-r dark:from-[#00e5ff] dark:to-[#a855f7] dark:text-black dark:font-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Enroll New Sentinel
          </button>
        </div>

        {/* Success Alert Banner */}
        {submittedMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name field (Signup only) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
                    errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
                  } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="sentinel@scamshield.ai"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
                  errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
                } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                Password <span className="text-rose-500">*</span>
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
                  errors.password ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
                } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800'
                  } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-[#00e5ff] dark:focus:ring-2 dark:focus:ring-[#00e5ff]/20 font-medium`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Quick Fill Test Profile Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: 'Elena Vance (Threat Analyst)',
                  email: 'sentinel.alpha@scamshield.ai',
                  password: 'securitypass123',
                  confirmPassword: 'securitypass123',
                });
                setErrors({});
              }}
              className="text-[11px] text-slate-800 hover:text-black dark:text-[#00e5ff] dark:hover:text-[#c084fc] hover:underline inline-flex items-center gap-1 font-bold"
            >
              ⚡ Fill with Verified Sentinel Profile
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black dark:bg-gradient-to-r dark:from-[#00e5ff] dark:via-[#818cf8] dark:to-[#a855f7] text-white dark:text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 dark:shadow-[0_0_25px_rgba(0,229,255,0.25)] hover:opacity-95 active:scale-[0.98]"
          >
            <span>{isSignUp ? 'Enroll Sentinel Profile' : 'Authenticate Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Standard Badge */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#040711] rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900 dark:text-slate-200">Zero-Knowledge Session Protocol:</strong> Your credentials are validated locally with zero transmission of raw secrets.
          </p>
        </div>

      </div>
    </div>
  );
};
