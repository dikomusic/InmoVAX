"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../atoms/Input';

interface PriceRangeFieldProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const PriceRangeField = ({ min, max, onMinChange, onMaxChange, label = 'Rango de precios', className = '' }: PriceRangeFieldProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const displayValue = min || max ? `$${min || '0'} - $${max || '∞'}` : label;

  return (
    <div className={`relative flex-1 w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full h-full min-h-[48px] px-4 py-2.5 sm:py-3 bg-transparent outline-none text-left flex justify-between items-center group cursor-pointer"
        aria-expanded={open}
      >
        <span className={`text-sm sm:text-base font-medium truncate ${min || max ? 'text-content-main font-semibold' : 'text-gray-500'}`}>{displayValue}</span>
        <span className={`text-gray-400 text-xs transition-transform ${open ? 'rotate-180 text-primary' : 'group-hover:text-primary'}`}>▼</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 w-full sm:w-[280px] flex gap-3 animate-fade-in">
          <Input type="number" placeholder="Mín ($us)" value={min} onChange={(event) => onMinChange(event.target.value)} />
          <Input type="number" placeholder="Máx ($us)" value={max} onChange={(event) => onMaxChange(event.target.value)} />
        </div>
      )}
    </div>
  );
};