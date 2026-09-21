"use client";
import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Search, X } from 'lucide-react';

export interface FilterValues {
  location: string;
  propertyType: string;
  operation: string;
  totalRooms: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  pool: string;
  pets: string;
  classification: string;
  currency: string;
  priceMin: string;
  priceMax: string;
  terrainMin: string;
  terrainMax: string;
  terrainUnit: string;
  constructionMin: string;
  constructionMax: string;
}

export const initialFilterValues: FilterValues = {
  location: '',
  propertyType: '',
  operation: '',
  totalRooms: '',
  bedrooms: '',
  bathrooms: '',
  parking: '',
  pool: '',
  pets: '',
  classification: '',
  currency: 'usd',
  priceMin: '',
  priceMax: '',
  terrainMin: '',
  terrainMax: '',
  terrainUnit: 'm2',
  constructionMin: '',
  constructionMax: ''
};

interface FilterSidebarProps {
  showTitle?: boolean;
  mapEnabled?: boolean;
  onMapToggle?: (enabled: boolean) => void;
  filters?: FilterValues;
  onFilterChange?: (filters: FilterValues) => void;
  onResetFilters?: () => void;
  activeCount?: number;
}

export const FilterSidebar = ({
  showTitle = true,
  mapEnabled = true,
  onMapToggle,
  filters: controlledFilters,
  onFilterChange,
  onResetFilters,
  activeCount = 0
}: FilterSidebarProps) => {
  const [uncontrolledFilters, setUncontrolledFilters] = useState<FilterValues>(initialFilterValues);

  const activeFilters = controlledFilters || uncontrolledFilters;

  const emitChange = (updated: FilterValues) => {
    if (!controlledFilters) {
      setUncontrolledFilters(updated);
    }
    onFilterChange?.(updated);
  };

  const updateField = (key: keyof FilterValues, value: string) => {
    const updated = { ...activeFilters, [key]: value };
    emitChange(updated);
  };

  const handleReset = () => {
    if (!controlledFilters) {
      setUncontrolledFilters(initialFilterValues);
    }
    if (onResetFilters) {
      onResetFilters();
    } else {
      onFilterChange?.(initialFilterValues);
    }
  };

  const selectFilters = [
    {
      key: 'propertyType' as const,
      label: 'Tipo de inmueble',
      options: [
        { label: 'Casas', value: 'casas' },
        { label: 'Departamentos', value: 'departamentos' },
        { label: 'Terrenos', value: 'terrenos' },
        { label: 'Oficinas', value: 'oficinas' },
        { label: 'Locales comerciales', value: 'locales' }
      ]
    },
    {
      key: 'operation' as const,
      label: 'Tipo de operación',
      options: [
        { label: 'Venta', value: 'Venta' },
        { label: 'Alquiler', value: 'Alquiler' },
        { label: 'Anticrético', value: 'Anticrético' }
      ]
    },
    {
      key: 'bedrooms' as const,
      label: 'Dormitorios',
      options: [
        { label: '1 dormitorio', value: '1' },
        { label: '2 dormitorios', value: '2' },
        { label: '3 dormitorios', value: '3' },
        { label: '4 dormitorios', value: '4' },
        { label: '5 o más dormitorios', value: '5' }
      ]
    },
    {
      key: 'bathrooms' as const,
      label: 'Baños',
      options: [
        { label: '1 baño', value: '1' },
        { label: '2 baños', value: '2' },
        { label: '3 baños', value: '3' },
        { label: '4 o más baños', value: '4' }
      ]
    },
    {
      key: 'parking' as const,
      label: 'Estacionamientos',
      options: [
        { label: '1 parqueo', value: '1' },
        { label: '2 parqueos', value: '2' },
        { label: '3 o más parqueos', value: '3' }
      ]
    },
    {
      key: 'pool' as const,
      label: 'Alberca / Piscina',
      options: [
        { label: 'Con piscina', value: 'Sí' },
        { label: 'Sin piscina', value: 'No' }
      ]
    },
    {
      key: 'pets' as const,
      label: 'Mascotas',
      options: [
        { label: 'Permitidas', value: 'Permitidas' },
        { label: 'No permitidas', value: 'No permitidas' }
      ]
    },
    {
      key: 'classification' as const,
      label: 'Clasificación',
      options: [
        { label: 'Premium', value: 'Premium' },
        { label: 'Estándar', value: 'Estándar' },
        { label: 'Oportunidad', value: 'Oportunidad' }
      ]
    }
  ];

  return (
    <aside className="w-full flex flex-col pb-8">
      {/* Encabezado con contador y botón limpiar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {showTitle && (
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-content-main">Filtros</h3>
            {activeCount > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-black px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
        )}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>

      {/* Toggle de Mapa */}
      <div className="flex items-center gap-3 mb-6 bg-surface-light p-2.5 rounded-xl border border-gray-100">
        <button
          type="button"
          onClick={() => onMapToggle?.(!mapEnabled)}
          aria-label={mapEnabled ? 'Ocultar mapa' : 'Mostrar mapa'}
          aria-pressed={mapEnabled}
          className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex items-center px-0.5 cursor-pointer ${
            mapEnabled ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
              mapEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-content-main font-semibold">Mostrar mapa</span>
      </div>

      {/* Búsqueda por palabra clave */}
      <div className="flex flex-col gap-2.5 mb-6">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
          />
          <input
            type="search"
            value={activeFilters.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Zona, ciudad, código..."
            aria-label="Buscar por zona, ciudad o código"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-content-main outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {activeFilters.location && (
            <button
              type="button"
              onClick={() => updateField('location', '')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-content-main"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Selects de filtros */}
        {selectFilters.map(({ key, label, options }) => (
          <div key={key} className="relative">
            <select
              value={activeFilters[key]}
              onChange={(e) => updateField(key, e.target.value)}
              aria-label={label}
              className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                activeFilters[key]
                  ? 'border-primary/50 text-content-main font-semibold bg-primary/5'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <option value="">{label}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
          </div>
        ))}

        {/* Moneda */}
        <div className="relative flex items-center border border-gray-200 rounded-lg bg-white pr-2 focus-within:border-primary">
          <select
            value={activeFilters.currency}
            onChange={(e) => updateField('currency', e.target.value)}
            className="w-full appearance-none bg-transparent px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer font-medium"
          >
            <option value="usd">Moneda: Dólares ($us)</option>
            <option value="bob">Moneda: Bolivianos (Bs.)</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none border-l border-gray-200 pl-1 text-gray-400 h-4 w-4"
          />
        </div>
      </div>

      {/* Sección: PRECIO */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-surface-white p-3 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Precio ({activeFilters.currency === 'bob' ? 'Bs' : '$us'})
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            min="0"
            value={activeFilters.priceMin}
            onChange={(e) => updateField('priceMin', e.target.value)}
            placeholder="Desde"
            className="w-1/2 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400"
          />
          <input
            type="number"
            min="0"
            value={activeFilters.priceMax}
            onChange={(e) => updateField('priceMax', e.target.value)}
            placeholder="Hasta"
            className="w-1/2 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400"
          />
        </div>
        {(activeFilters.priceMin || activeFilters.priceMax) && (
          <button
            type="button"
            onClick={() => {
              updateField('priceMin', '');
              updateField('priceMax', '');
            }}
            className="w-full text-xs font-bold text-gray-500 hover:text-red-500 py-1 transition-colors"
          >
            Quitar rango de precio
          </button>
        )}
      </div>

      {/* Sección: CONSTRUCCIÓN Y TERRENO */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-surface-white p-3 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Área Construida (m²)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            min="0"
            value={activeFilters.constructionMin}
            onChange={(e) => updateField('constructionMin', e.target.value)}
            placeholder="Mín m²"
            className="w-1/2 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400"
          />
          <input
            type="number"
            min="0"
            value={activeFilters.constructionMax}
            onChange={(e) => updateField('constructionMax', e.target.value)}
            placeholder="Máx m²"
            className="w-1/2 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Botón de limpiar general si hay filtros */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-lg border border-red-200 bg-red-50/50 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          Restablecer todos los filtros
        </button>
      )}
    </aside>
  );
};  