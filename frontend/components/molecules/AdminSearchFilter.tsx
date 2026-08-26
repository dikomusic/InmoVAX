import React from 'react';

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
    icon?: string;
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
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* BUSCADOR */}
      <div className="w-full md:w-80 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
        />
        <span className="absolute left-3 top-3 text-xs text-gray-400">🔍</span>
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
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              {actionButton.icon && <span>{actionButton.icon}</span>}
              {actionButton.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {actionButton.icon && <span>{actionButton.icon}</span>}
              {actionButton.label}
            </button>
          )
        )}
      </div>
    </div>
  );
};
