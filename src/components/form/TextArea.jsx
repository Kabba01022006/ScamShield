import React, { forwardRef } from 'react';

/**
 * TextArea: Standardized multi-line text input matching ScamShield UI design language.
 */
export const TextArea = forwardRef(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      rows = 4,
      placeholder,
      error,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <textarea
        ref={ref}
        id={id || name}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={
          hasError && id ? `${id}-error` : id ? `${id}-hint` : undefined
        }
        className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
          hasError
            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20'
        } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium transition-colors resize-y disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
