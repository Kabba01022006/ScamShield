import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * FormField: Accessible wrapper for form controls providing label, hint,
 * validation error with aria-live, and consistent styling.
 */
export const FormField = ({
  id,
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-slate-800 dark:text-slate-200"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {children}

      {hint && !error && (
        <p id={id ? `${id}-hint` : undefined} className="text-[11px] text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          aria-live="polite"
          className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 font-medium mt-1 animate-in fade-in duration-150"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
