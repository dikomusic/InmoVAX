import React from 'react';
import { Sparkles } from 'lucide-react';

interface SearchModeTabsProps {
  options: string[];
  activeOption: string;
  onChange: (option: string) => void;
  className?: string;
}

export const SearchModeTabs = ({ options, activeOption, onChange, className = '' }: SearchModeTabsProps) => (
  <div
    className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-md sm:max-w-none mb-4 sm:mb-6 ${className}`}
    role="tablist"
    aria-label="Modo de búsqueda"
  >
    {options.map((option) => {
      const isActive = activeOption === option;
      const isAI = option.toLowerCase().includes('ia');

      return (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(option)}
          className={`flex items-center justify-center gap-1.5 text-center px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full border text-xs sm:text-sm md:text-base font-extrabold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer select-none ${
            isActive
              ? isAI
                ? 'bg-gradient-to-r from-primary to-blue-700 border-white text-white shadow-xl ring-2 ring-white/50 scale-105'
                : 'bg-white/25 border-white text-white shadow-lg backdrop-blur-md ring-2 ring-white/40'
              : isAI
              ? 'bg-blue-950/60 border-blue-400/50 text-blue-200 hover:bg-blue-900/70 hover:border-blue-300 backdrop-blur-md'
              : 'bg-black/35 border-white/30 text-white/90 hover:border-white hover:bg-white/15 hover:text-white backdrop-blur-md'
          }`}
        >
          {isAI && <Sparkles className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300 animate-pulse' : 'text-blue-300'}`} />}
          <span className="truncate">{option}</span>
        </button>
      );
    })}
  </div>
);
