"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { PriceRangeField } from '../molecules/PriceRangeField';
import { SearchModeTabs } from '../molecules/SearchModeTabs';

const SEARCH_TABS = ['Quiero Comprar', 'Quiero Alquilar', 'Quiero Anticrético', 'Quiero Vender'];

const CIUDADES_OPTIONS = [
  { value: 'lapaz', label: 'La Paz' },
  { value: 'elalto', label: 'El Alto' },
  { value: 'cochabamba', label: 'Cochabamba' },
  { value: 'santacruz', label: 'Santa Cruz' },
];

const TIPOS_PROPIEDAD_OPTIONS = [
  { value: 'casas', label: 'Casa' },
  { value: 'departamentos', label: 'Departamento' },
  { value: 'terrenos', label: 'Terreno' },
  { value: 'oficinas', label: 'Oficina' },
  { value: 'locales', label: 'Local Comercial' },
];

export const HeroSearch = () => {
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState('Quiero Comprar');
  const [ciudad, setCiudad] = useState('');
  const [tipoPropiedad, setTipoPropiedad] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (tabActiva === 'Quiero Vender') {
      router.push('/publicar');
      return;
    }

    const basePath =
      tabActiva === 'Quiero Anticrético'
        ? '/anticretico'
        : tabActiva === 'Quiero Alquilar'
        ? '/alquilar'
        : '/comprar';

    const params = new URLSearchParams();
    if (ciudad) params.set('ciudad', ciudad);
    if (precioMin) params.set('min', precioMin);
    if (precioMax) params.set('max', precioMax);

    const typeSlug = tipoPropiedad || 'todos';
    const query = params.toString() ? `?${params.toString()}` : '';

    router.push(`${basePath}/${typeSlug}${query}`);
  };

  return (
    <section className="relative w-full min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 overflow-hidden">
      {/* Fondo de pantalla con overlay degradado seguro */}
      <div className="absolute inset-0 z-0 bg-gray-950">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="Propiedades InmoVAX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/50 to-gray-950/90" />
      </div>

      {/* Contenido principal centrado */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Título Principal y Bajada */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md mb-2 sm:mb-3">
          Encuentra tu próximo hogar
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-xl mx-auto mb-6 sm:mb-8 font-medium drop-shadow">
          La mayor oferta de anticréticos, ventas y alquileres en Bolivia con total seguridad
        </p>

        {/* Molécula: Pestañas de Modo de Búsqueda */}
        <SearchModeTabs
          options={SEARCH_TABS}
          activeOption={tabActiva}
          onChange={setTabActiva}
        />

        {/* Buscador Principal Multipantalla */}
        <form
          onSubmit={handleSearch}
          className="w-full bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full p-2.5 sm:p-3 md:p-2 shadow-2xl border border-white/30 flex flex-col md:flex-row items-stretch md:items-center divide-y divide-gray-100 md:divide-y-0 md:divide-x md:divide-gray-200 transition-all"
        >
          {/* Campo 1: Ciudades */}
          <div className="flex-1 w-full px-2 sm:px-3 py-1.5 md:py-2">
            <Select
              placeholder="Ciudades"
              options={CIUDADES_OPTIONS}
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              selectClassName="bg-transparent text-sm sm:text-base font-semibold py-2 sm:py-2.5"
            />
          </div>

          {/* Campo 2: Tipo de Propiedad */}
          <div className="flex-1 w-full px-2 sm:px-3 py-1.5 md:py-2">
            <Select
              placeholder="Tipo de Propiedad"
              options={TIPOS_PROPIEDAD_OPTIONS}
              value={tipoPropiedad}
              onChange={(e) => setTipoPropiedad(e.target.value)}
              selectClassName="bg-transparent text-sm sm:text-base font-semibold py-2 sm:py-2.5"
            />
          </div>

          {/* Campo 3: Rango de precios */}
          <div className="flex-1 w-full px-2 sm:px-3 py-1.5 md:py-2">
            <PriceRangeField
              min={precioMin}
              max={precioMax}
              onMinChange={setPrecioMin}
              onMaxChange={setPrecioMax}
            />
          </div>

          {/* Botón de Acción Principal */}
          <div className="pt-2 md:pt-0 md:pl-2 shrink-0">
            <Button
              type="submit"
              variant="primary"
              className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-full font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Search className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap">
                {tabActiva === 'Quiero Vender' ? 'Publicar mi Inmueble' : 'Buscar Inmuebles'}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
