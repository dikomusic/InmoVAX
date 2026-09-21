"use client";

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { FilterSidebar, FilterValues, initialFilterValues } from '@/components/organisms/FilterSidebar';
import { PropertyCard } from '@/components/organisms/PropertyCard';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import {
  operationLabels,
  PropertyListing,
  PropertyOperation,
  managedPropertyToListing
} from '@/components/data/propertyListings';
import { getAllManagedProperties, ManagedProperty, fetchAllPropertiesFromBackend } from '@/lib/propertiesStore';

const ResultsMap = dynamic(
  () => import('@/components/molecules/ResultsMap').then((mod) => mod.ResultsMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-content-muted font-semibold text-sm">
        Cargando mapa...
      </div>
    )
  }
);

interface PropertyResultsTemplateProps {
  operation: PropertyOperation;
  type: string;
  showMap?: boolean;
}

const formatType = (type: string) => {
  if (!type || type === 'todos') return 'Propiedades';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const PropertyResultsContent = ({ operation, type, showMap = false }: PropertyResultsTemplateProps) => {
  const searchParams = useSearchParams();
  const [mapVisible, setMapVisible] = useState(showMap);
  const [sortBy, setSortBy] = useState('recientes');

  // Inicializar filtros desde la URL o el tipo de ruta
  const [filters, setFilters] = useState<FilterValues>(() => {
    const ciudadParam = searchParams.get('ciudad') || '';
    const minParam = searchParams.get('min') || '';
    const maxParam = searchParams.get('max') || '';

    return {
      ...initialFilterValues,
      location: ciudadParam,
      propertyType: type !== 'todos' ? type : '',
      priceMin: minParam,
      priceMax: maxParam
    };
  });

  const typeLabel = formatType(type);
  const operationLabel = operationLabels[operation];

  // Estado reactivo conectado a Supabase vía backend Bun
  const [managedProps, setManagedProps] = useState<ManagedProperty[]>([]);

  useEffect(() => {
    // 1. Cargar datos locales existentes
    setManagedProps(getAllManagedProperties());

    // 2. Consultar datos frescos del backend en tiempo real
    fetchAllPropertiesFromBackend().then((data) => {
      if (data) setManagedProps(data);
    });

    const handleUpdate = () => {
      setManagedProps(getAllManagedProperties());
    };
    window.addEventListener('inmovax:properties-updated', handleUpdate);
    return () => window.removeEventListener('inmovax:properties-updated', handleUpdate);
  }, []);

  // Base de propiedades para la operación seleccionada conectada en tiempo real
  const baseListings = useMemo(() => {
    // Filtrar solo las propiedades con estado 'Activo' que correspondan a la operación actual
    return managedProps
      .filter((p) => p.status === 'Activo' && p.type.toLowerCase() === operation.toLowerCase())
      .map(managedPropertyToListing);
  }, [managedProps, operation]);

  // Filtrado reactivo en memoria
  const filteredProperties = useMemo(() => {
    return baseListings.filter((item: PropertyListing) => {
      // 1. Tipo de inmueble
      if (filters.propertyType) {
        const normFilterType = filters.propertyType.toLowerCase();
        const normItemType = item.tipo.toLowerCase();
        if (normItemType !== normFilterType && !normFilterType.startsWith(normItemType.slice(0, 4))) {
          return false;
        }
      }

      // 2. Ubicación / Búsqueda textual
      if (filters.location) {
        const term = filters.location.trim().toLowerCase();
        const inCity = item.ciudad.toLowerCase().includes(term);
        const inLoc = item.ubicacion.toLowerCase().includes(term);
        const inTitle = item.titulo.toLowerCase().includes(term);
        const inId = item.id.toLowerCase().includes(term);
        if (!inCity && !inLoc && !inTitle && !inId) return false;
      }

      // 3. Dormitorios
      if (filters.bedrooms) {
        const targetBeds = Number(filters.bedrooms);
        const beds = item.habitaciones ?? 0;
        if (targetBeds === 5) {
          if (beds < 5) return false;
        } else if (beds !== targetBeds) {
          return false;
        }
      }

      // 4. Baños
      if (filters.bathrooms) {
        const targetBaths = Number(filters.bathrooms);
        const baths = item.banos ?? 0;
        if (targetBaths === 4) {
          if (baths < 4) return false;
        } else if (baths !== targetBaths) {
          return false;
        }
      }

      // 5. Parqueos
      if (filters.parking) {
        const targetParking = Number(filters.parking);
        if ((item.estacionamientos || 0) < targetParking) return false;
      }

      // 6. Alberca / Piscina
      if (filters.pool) {
        const hasPool = filters.pool === 'Sí';
        if (Boolean(item.alberca) !== hasPool) return false;
      }

      // 7. Mascotas
      if (filters.pets) {
        const allowPets = filters.pets === 'Permitidas';
        if (Boolean(item.mascotas) !== allowPets) return false;
      }

      // 8. Clasificación
      if (filters.classification && item.clasificacion !== filters.classification) {
        return false;
      }

      // 9. Rango de precio
      if (filters.priceMin) {
        const minVal = Number(filters.priceMin);
        if (!isNaN(minVal) && item.precioNumerico < minVal) return false;
      }
      if (filters.priceMax) {
        const maxVal = Number(filters.priceMax);
        if (!isNaN(maxVal) && item.precioNumerico > maxVal) return false;
      }

      // 10. Área construida
      if (filters.constructionMin) {
        const minConst = Number(filters.constructionMin);
        const area = item.construccionM2 ?? item.metros ?? 0;
        if (!isNaN(minConst) && area < minConst) return false;
      }
      if (filters.constructionMax) {
        const maxConst = Number(filters.constructionMax);
        const area = item.construccionM2 ?? item.metros ?? 0;
        if (!isNaN(maxConst) && area > maxConst) return false;
      }

      return true;
    });
  }, [baseListings, filters]);

  // Ordenamiento reactivo
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (sortBy === 'menor-precio') {
      list.sort((a, b) => a.precioNumerico - b.precioNumerico);
    } else if (sortBy === 'mayor-precio') {
      list.sort((a, b) => b.precioNumerico - a.precioNumerico);
    } else {
      // 'recientes'
      list.sort((a, b) => (b.fechaPublicacion || '').localeCompare(a.fechaPublicacion || ''));
    }
    return list;
  }, [filteredProperties, sortBy]);

  // Conteo de filtros activos
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.propertyType && filters.propertyType !== type) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.parking) count++;
    if (filters.pool) count++;
    if (filters.pets) count++;
    if (filters.classification) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.constructionMin || filters.constructionMax) count++;
    return count;
  }, [filters, type]);

  const handleResetFilters = () => {
    setFilters({
      ...initialFilterValues,
      propertyType: type !== 'todos' ? type : ''
    });
  };

  return (
    <div
      className={`${
        mapVisible ? 'min-h-screen lg:h-[calc(100vh-80px)] lg:overflow-hidden' : 'min-h-screen'
      } bg-surface-light`}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:h-full lg:px-8">
        <header className="mb-6 shrink-0">
          <h1 className="text-3xl font-extrabold text-content-main">
            {typeLabel} en <span className="text-primary">{operationLabel}</span>
          </h1>
          <p className="mt-2 font-medium text-content-muted">
            Descubre opciones de {type === 'todos' ? 'inmuebles' : type} para {operation.toLowerCase()} con datos verificados y filtros inteligentes.
          </p>
        </header>

        <div
          className={`grid grid-cols-1 gap-6 ${
            mapVisible
              ? 'lg:min-h-0 lg:flex-1 lg:grid-cols-[240px_minmax(0,1fr)_minmax(320px,32%)]'
              : 'lg:grid-cols-[240px_minmax(0,1fr)]'
          }`}
        >
          <aside className="rounded-xl border border-gray-100 bg-surface-white p-4 lg:min-h-0 lg:overflow-y-auto lg:pr-3">
            <details className="group lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-extrabold text-content-main">
                <span className="flex items-center gap-2">
                  Filtros
                  {activeCount > 0 && (
                    <span className="bg-primary text-white text-xs font-black px-2 py-0.5 rounded-full">
                      {activeCount}
                    </span>
                  )}
                </span>
                <ChevronDown className="h-5 w-5 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4">
                <FilterSidebar
                  showTitle={false}
                  mapEnabled={mapVisible}
                  onMapToggle={setMapVisible}
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  activeCount={activeCount}
                />
              </div>
            </details>
            <div className="hidden lg:block">
              <FilterSidebar
                mapEnabled={mapVisible}
                onMapToggle={setMapVisible}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                activeCount={activeCount}
              />
            </div>
          </aside>

          <section className={`min-w-0 pb-8 ${mapVisible ? 'lg:min-h-0 lg:overflow-y-auto' : ''}`}>
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-surface-white p-4 shadow-sm sm:flex-row">
              <p className="min-w-0 flex-1 text-sm font-bold text-content-main">
                Mostrando <span className="text-primary font-black">{sortedProperties.length}</span>{' '}
                {sortedProperties.length === 1 ? 'resultado' : 'resultados'} para {typeLabel}
              </p>
              <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
                <span className="whitespace-nowrap text-sm font-bold text-content-muted">
                  Ordenar por:
                </span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: 'recientes', label: 'Más recientes' },
                    { value: 'menor-precio', label: 'Menor precio' },
                    { value: 'mayor-precio', label: 'Mayor precio' }
                  ]}
                  className="w-full bg-surface-light py-2 text-sm sm:w-48"
                />
              </div>
            </div>

            {sortedProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-white rounded-2xl border border-gray-100 my-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold text-content-main mb-2">
                  No se encontraron inmuebles
                </h3>
                <p className="text-content-muted max-w-md mb-6 text-sm font-medium">
                  No hay propiedades que coincidan con los filtros seleccionados. Intenta ampliar el rango de precio, cambiar la zona o restablecer los filtros.
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  Restablecer filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 min-[1180px]:grid-cols-2">
                {sortedProperties.map((property, index) => (
                  <PropertyCard key={property.id} {...property} imagePriority={index === 0} />
                ))}
              </div>
            )}
          </section>

          {mapVisible && (
            <div className="min-h-[420px] overflow-hidden rounded-xl border border-gray-200 bg-white lg:min-h-0">
              <ResultsMap />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PropertyResultsTemplate = (props: PropertyResultsTemplateProps) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-light flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <PropertyResultsContent {...props} />
    </Suspense>
  );
};