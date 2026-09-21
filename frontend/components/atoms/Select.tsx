import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  selectClassName?: string;
}

export const Select = ({ options, placeholder, icon, className = '', selectClassName = '', ...props }: SelectProps) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {icon && (
        <span className="absolute left-3.5 text-primary z-10 pointer-events-none">
          {icon}
        </span>
      )}
      <select 
        className={`w-full bg-surface-white text-content-main rounded-lg py-3 px-4 outline-none border-2 border-transparent focus:border-primary cursor-pointer appearance-none transition-colors ${icon ? 'pl-10' : ''} ${selectClassName}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {/* Ícono de flechita para el select */}
      <span className="absolute right-3.5 text-content-muted pointer-events-none text-xs">
        ▼
      </span>
    </div>
  );
};