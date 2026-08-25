import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export const Select = ({ options, placeholder, icon, className = '', ...props }: SelectProps) => {
  return (
    <div className={`relative flex items-center w-[200px] ${className}`}>
      {icon && (
        <span className="absolute left-4 text-primary z-10">
          {icon}
        </span>
      )}
      <select 
        className={`w-full bg-surface-white text-content-main rounded-lg py-3 px-4 outline-none border-2 border-transparent focus:border-primary cursor-pointer appearance-none transition-colors ${icon ? 'pl-11' : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled selected hidden>
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
      <span className="absolute right-4 text-content-muted pointer-events-none">
        ▼
      </span>
    </div>
  );
};