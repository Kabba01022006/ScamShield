import React, { forwardRef } from 'react';

/**
 * SelectInput: Standardized dropdown component matching ScamShield UI design language.
 */
export const SelectInput = forwardRef(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      options = [],
      placeholder = 'Select an option',
      error,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <select
        ref={ref}
        id={id || name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={
          hasError && id ? `${id}-error` : id ? `${id}-hint` : undefined
        }
        className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#040711] border ${
          hasError
            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20'
        } rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const isObj = typeof opt === 'object' && opt !== null;
          const optValue = isObj ? opt.value : opt;
          const optLabel = isObj ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    );
  }
);

SelectInput.displayName = 'SelectInput';
