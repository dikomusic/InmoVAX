import React from 'react';
import { Check } from 'lucide-react';

export interface PropertyFormData {
  operacion: string;
  tipoInmueble: string;
  moneda: string;
  precio: string;
  negociable: boolean;
  descripcion: string;
  zona: string;
  calle: string;
  coordenadas: { lat: number; lng: number } | null;
  supConstruida: string;
  supTerreno?: string;
  habitaciones: string;
  banos: string;
  parqueos: string;
  amenidades: string[];
  folioReal: string;
  tieneFolio: boolean;
  fotosCount: number;
  imagenUrl?: string;
  galeria: string[];
}

interface PublishSummaryCardProps {
  data: PropertyFormData;
  onEditStep?: (step: number) => void;
}

export const PublishSummaryCard = ({
  data,
  onEditStep
}: PublishSummaryCardProps) => {
  return (
    <div className="bg-gradient-to-br from-surface-dark to-[#0F1E4A] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-800 space-y-6">
      
      {/* CABECERA RESUMEN */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-700/80">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>Datos Guardados Intactos</span>
          </span>
          <h3 className="text-xl font-extrabold text-white mt-2">Resumen de tu Inmueble</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-accent">
            {data.moneda === 'usd' ? '$us' : 'Bs.'} {data.precio || '0'}
          </span>
          {data.negociable && (
            <span className="text-[10px] text-gray-300 block font-semibold">(Precio Negociable)</span>
          )}
        </div>
      </div>

      {/* DETALLES PRINCIPALES */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 text-[10px] uppercase font-bold block">Modalidad</span>
          <span className="font-extrabold text-white text-sm capitalize">{data.operacion}</span>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 text-[10px] uppercase font-bold block">Tipo de Inmueble</span>
          <span className="font-extrabold text-white text-sm capitalize">{data.tipoInmueble}</span>
        </div>
      </div>

      {/* UBICACIÓN */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-[10px] uppercase font-bold">Ubicación Seleccionada</span>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(2)}
              className="text-[11px] text-accent font-bold hover:underline cursor-pointer"
            >
              Editar
            </button>
          )}
        </div>
        <p className="font-bold text-white text-sm">{data.zona || 'Zona seleccionada en mapa'}</p>
        {data.calle && <p className="text-gray-300 text-xs">{data.calle}</p>}
        {data.coordenadas && (
          <p className="text-[10px] text-emerald-400 font-mono">
            📍 Coordenadas fijadas: {data.coordenadas.lat.toFixed(4)}, {data.coordenadas.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* CARACTERÍSTICAS TÉCNICAS */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <span className="text-gray-400 text-[10px] block">Superficie</span>
          <span className="font-extrabold text-white">{data.supConstruida || '0'} m²</span>
        </div>
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <span className="text-gray-400 text-[10px] block">Habitaciones</span>
          <span className="font-extrabold text-white">{data.habitaciones || '0'} Dorms</span>
        </div>
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <span className="text-gray-400 text-[10px] block">Baños</span>
          <span className="font-extrabold text-white">{data.banos || '0'} Baños</span>
        </div>
      </div>

      {/* AMENIDADES SELECCIONADAS */}
      {data.amenidades.length > 0 && (
        <div className="space-y-1.5 text-xs">
          <span className="text-gray-400 text-[10px] uppercase font-bold block">Amenidades Incluidas</span>
          <div className="flex flex-wrap gap-1.5">
            {data.amenidades.map((am) => (
              <span key={am} className="text-[11px] bg-white/10 text-gray-200 px-2 py-0.5 rounded-md">
                ✓ {am}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* RESPALDO LEGAL */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-amber-300 font-bold uppercase block">Estado Legal</span>
          <span className="font-bold text-amber-100">
            {data.tieneFolio ? 'Cuenta con Folio Real Matriculado' : 'Documentación en trámite'}
          </span>
        </div>
        <span className="text-lg">⚖️</span>
      </div>

    </div>
  );
};
