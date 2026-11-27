"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, CornerDownLeft, SlidersHorizontal } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { PriceRangeField } from '../molecules/PriceRangeField';
import { SearchModeTabs } from '../molecules/SearchModeTabs';
import { parseAISearchQuery } from '@/lib/aiSearchParser';

const SEARCH_TABS = [
  'Búsqueda con IA',
  'Quiero Comprar',
  'Quiero Alquilar',
  'Quiero Anticrético',
  'Quiero Vender'
];

const SUGGESTED_AI_QUERIES = [
  'Departamento en Sopocachi en anticrético menos de $us 50,000',
  'Casa en alquiler en Calacoto con 3 dormitorios',
  'Oficina en venta en Miraflores La Paz',
  'Monoambiente en Achumani en alquiler',
  'Terreno en El Alto para comprar'
];

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

export const HeroSearch: React.FC = () => {
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState('Búsqueda con IA');
  
  // Estado Búsqueda con IA
  const [aiQuery, setAiQuery] = useState('');
  
  // Estado Filtros Clásicos
  const [ciudad, setCiudad] = useState('');
  const [tipoPropiedad, setTipoPropiedad] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  // Análisis inteligente en tiempo real
  const aiParsed = useMemo(() => {
    if (!aiQuery.trim()) return null;
    return parseAISearchQuery(aiQuery);
  }, [aiQuery]);

  const handleAISearch = (queryToUse?: string) => {
    const text = (queryToUse !== undefined ? queryToUse : aiQuery).trim();
    if (!text) {
      router.push('/comprar/todos');
      return;
    }
    const result = parseAISearchQuery(text);
    router.push(result.targetUrl);
  };

  const handleClassicSearch = (e?: React.FormEvent) => {
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
    <section 
      id="buscador-principal" 
      className="relative w-full min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 overflow-hidden"
    >
      {/* Fondo con overlay oscuro */}
      <div className="absolute inset-0 z-0 bg-gray-950">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="Propiedades InmoVAX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/85 via-gray-950/60 to-gray-950/95" />
      </div>

      {/* Contenedor central */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Badge Cero Comisiones */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cero Comisiones Inmobiliarias • Publicación 100% Gratuita</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md mb-3 max-w-4xl mx-auto">
          Encuentra tu próximo hogar o vende <span className="text-emerald-400">sin intermediarios</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-2xl mx-auto mb-6 sm:mb-8 font-medium drop-shadow leading-relaxed">
          Plataforma tecnológica de conexión directa en Bolivia. Explora inmuebles en lenguaje natural con IA o publica gratis en minutos.
        </p>

        {/* Pestañas de Modo de Búsqueda */}
        <SearchModeTabs
          options={SEARCH_TABS}
          activeOption={tabActiva}
          onChange={setTabActiva}
        />

        {/* CASO 1: MODO BÚSQUEDA INTELIGENTE CON IA */}
        {tabActiva === 'Búsqueda con IA' && (
          <div className="w-full max-w-4xl space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAISearch();
              }}
              className="w-full bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full p-2 md:p-2.5 shadow-2xl border-2 border-primary/40 focus-within:border-primary flex flex-col md:flex-row items-center gap-2 transition-all"
            >
              {/* Icono e Input de Lenguaje Natural */}
              <div className="flex-1 w-full flex items-center gap-3 px-3 sm:px-4 py-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ej: Departamento en Sopocachi en anticrético menos de $us 50,000..."
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base font-semibold focus:outline-hidden"
                  autoFocus
                />
              </div>

              {/* Botón Buscar con IA */}
              <div className="w-full md:w-auto shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full md:w-auto h-12 md:h-13 px-6 md:px-8 rounded-xl md:rounded-full font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                  <span className="whitespace-nowrap">Buscar con IA</span>
                  <CornerDownLeft className="w-4 h-4 hidden md:inline-block opacity-60" />
                </Button>
              </div>
            </form>

            {/* Chip de detección en tiempo real */}
            {aiParsed && aiParsed.detectedChips.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/10 text-xs text-white/90">
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  IA interpretó:
                </span>
                {aiParsed.detectedChips.map((chip, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 rounded-full bg-white/15 text-white font-medium text-[11px] border border-white/10"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {/* Sugerencias rápidas de búsqueda con IA */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-white/60 font-semibold text-[11px] uppercase tracking-wider">
                Prueba buscando:
              </span>
              {SUGGESTED_AI_QUERIES.map((query, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAiQuery(query);
                    handleAISearch(query);
                  }}
                  className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CASO 2: MODO VENDER DIRECTO */}
        {tabActiva === 'Quiero Vender' && (
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              Publica tu inmueble en minutos y véndelo tú mismo
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Sin comisiones de agentes (ahorras entre 3% y 7%). Recibe consultas directas a tu WhatsApp y gestiona tus visitas libremente.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => router.push('/publicar')}
                className="h-12 px-8 rounded-full font-black text-base shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <span>Publicar mi Inmueble Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* CASO 3: FILTROS CLÁSICOS (Comprar / Alquilar / Anticrético) */}
        {tabActiva !== 'Búsqueda con IA' && tabActiva !== 'Quiero Vender' && (
          <form
            onSubmit={handleClassicSearch}
            className="w-full bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full p-2 md:p-1.5 shadow-2xl border border-white/30 flex flex-col md:flex-row items-stretch md:items-center divide-y divide-gray-100 md:divide-y-0 md:divide-x md:divide-gray-200 transition-all"
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
                  Buscar Inmuebles
                </span>
              </Button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
