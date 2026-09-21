import React from 'react';

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
      return (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(option)}
          className={`flex items-center justify-center text-center px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full border text-xs sm:text-sm md:text-base font-bold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer select-none ${
            isActive
              ? 'bg-white/25 border-white text-white shadow-lg backdrop-blur-md ring-2 ring-white/40'
              : 'bg-black/35 border-white/30 text-white/90 hover:border-white hover:bg-white/15 hover:text-white backdrop-blur-md'
          }`}
        >
          <span className="truncate">{option}</span>
        </button>
      );
    })}
  </div>
);