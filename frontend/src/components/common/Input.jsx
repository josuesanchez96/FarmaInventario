import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-500'
              : 'border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:focus:border-brand-400'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 animate-fade-in">
          <span>•</span> {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
