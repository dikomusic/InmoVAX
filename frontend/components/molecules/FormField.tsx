import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({ label, htmlFor, hint, error, children, className = '' }: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-bold text-content-main">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-semibold text-red-600" role="alert">{error}</p>
      ) : hint ? (
        <p className="text-xs text-content-muted">{hint}</p>
      ) : null}
    </div>
  );
};