import React from 'react';
import { Search } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  selectFilters?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }[];
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
}

export const AdminSearchFilter = ({
  searchQuery,
  onSearchChange,
  placeholder = "Buscar...",
  selectFilters = [],
  actionButton
}: AdminSearchFilterProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* BUSCADOR */}
      <div className="w-full md:w-80 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* FILTROS Y ACCIÓN */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        {selectFilters.map((filter, index) => (
          <select
            key={index}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {actionButton && (
          actionButton.href ? (
            <a
              href={actionButton.href}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {actionButton.icon}
              {actionButton.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {actionButton.icon}
              {actionButton.label}
            </button>
          )
        )}
      </div>
    </div>
  );
};

