import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode; // Por si queremos ponerle un ícono de ubicación o de llave
}

export const Input = ({ icon, className = '', ...props }: InputProps) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {icon && (
        <span className="absolute left-4 text-primary">
          {icon}
        </span>
      )}
      <input 
        className={`w-full bg-surface-white text-content-main placeholder-content-muted rounded-lg py-3 px-4 outline-none border-2 border-transparent focus:border-primary transition-colors ${icon ? 'pl-11' : ''}`}
        {...props}
      />
    </div>
  );
};