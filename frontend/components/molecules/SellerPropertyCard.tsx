"use client";
import React from 'react';
import { Eye, MessageCircle, Pencil, Trash2, PauseCircle, PlayCircle, BarChart3, Building2, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { SellerStatusBadge, SellerPropertyStatus } from '../atoms/SellerStatusBadge';

export interface SellerProperty {
  id: string;
  title: string;
  zone: string;
  address?: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  price: string;
  views: number;
  inquiries: number;
  status: SellerPropertyStatus;
  folioReal: string;
  assignedAdvisor: string;
  image: string;
  gallery?: string[];
  datePublished: string;
  authorEmail?: string;
  authorName?: string;
  category?: string;
  isNegotiable?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  habitaciones?: number;
  banos?: number;
  metros?: number;
  landAreaSqm?: number | null;
  estacionamientos?: number;
  parkingSpots?: number;
  amenidades?: string[];
  amenities?: string[];
  description?: string;
  href?: string;
  publicationPlan?: 'basico' | 'oro' | 'diamante';
  isPaid?: boolean;
}

interface SellerPropertyCardProps {
  property: SellerProperty;
  onTogglePause: (id: string) => void;
  onEdit: (property: SellerProperty) => void;
  onViewStats: (property: SellerProperty) => void;
  onDelete?: (id: string) => void;
  onRequestDelete?: (property: SellerProperty) => void;
  onOpenPlanModal?: (property: SellerProperty) => void;
}

export const SellerPropertyCard = ({
  property,
  onTogglePause,
  onEdit,
  onViewStats,
  onDelete,
  onRequestDelete,
  onOpenPlanModal
}: SellerPropertyCardProps) => {
  const isPending = property.status === 'En Validación Legal';

  const handleDeleteClick = () => {
    if (onRequestDelete) {
      onRequestDelete(property);
    } else if (onDelete) {
      onDelete(property.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* IMAGEN DE CABECERA Y BADGES */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {property.image && property.image.trim() !== '' ? (
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
              <Building2 className="w-10 h-10 mb-1 text-slate-300" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Sin fotografía</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/20 pointer-events-none" />

          {/* BADGE TIPO DE OPERACIÓN */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide shadow-sm ${
              property.type === 'Anticrético' ? 'bg-amber-400 text-slate-950' :
              property.type === 'Venta' ? 'bg-blue-600 text-white' :
              'bg-purple-600 text-white'
            }`}>
              {property.type}
            </span>
          </div>

          {/* BADGE ESTADO */}
          <div className="absolute top-3 right-3 z-10">
            <SellerStatusBadge status={property.status} size="sm" />
          </div>

          {/* BARRA INFERIOR DE IMAGEN */}
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-xs z-10 gap-2">
            <span className="truncate flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate text-xs font-bold text-white/95 drop-shadow-sm">{property.zone}</span>
            </span>
            <span className="shrink-0 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-mono text-[10px] font-bold text-white/95 border border-white/20">
              ID: {property.id}
            </span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* CATEGORÍA Y FECHA */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500">
              {property.category || 'Departamento'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {property.datePublished}
            </span>
          </div>

          {/* TÍTULO */}
          <h4
            className="font-bold text-[15px] sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]"
            title={property.title}
          >
            {property.title}
          </h4>

          {/* PRECIO Y FOLIO REAL */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {property.price}
            </span>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium max-w-[170px] shrink-0"
              title={`Folio Real: ${property.folioReal}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                <span className="font-bold text-slate-600">Folio:</span> {property.folioReal}
              </span>
            </div>
          </div>

          {/* TIRA DE MÉTRICAS */}
          <div className="bg-slate-50/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-around text-xs border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600" title="Visualizaciones en catálogo">
              <Eye className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-black text-slate-900 text-sm">{property.views}</span>
              <span className="text-[11px] text-slate-400 font-medium">visitas</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600" title="Mensajes directos de interesados">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-black text-slate-900 text-sm">{property.inquiries}</span>
              <span className="text-[11px] text-slate-400 font-medium">consultas</span>
            </div>
            {property.metros ? (
              <>
                <div className="h-4 w-px bg-slate-200" />
                <div className="text-[11px] text-slate-600 font-bold">
                  {property.metros} m²
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR DE ACCIONES - 2 NIVELES PERFECTAMENTE RESPONSIVOS */}
      <div className="p-3 sm:p-4 bg-slate-50/70 border-t border-slate-100 space-y-2.5">
        {/* Nivel 1: El Botón de Upsell Destacado (Ancho Completo, Sin Solapamiento) */}
        {onOpenPlanModal && (
          <button
            type="button"
            onClick={() => onOpenPlanModal(property)}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-black text-xs sm:text-[13px] rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 group/btn"
            title="Priorizar anuncio, contratar fotógrafo profesional o auditar con abogado"
          >
            <Sparkles className="h-4 w-4 text-amber-200 fill-amber-200 shrink-0 group-hover/btn:rotate-12 transition-transform" />
            <span className="tracking-wide">Vender más rápido y seguro</span>
          </button>
        )}

        {/* Nivel 2: Rendimiento a la izquierda y Controles de gestión a la derecha */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onViewStats(property)}
            className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
            title="Ver métricas de rendimiento"
          >
            <BarChart3 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Rendimiento</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              disabled={isPending}
              onClick={() => !isPending && onEdit(property)}
              className={`p-2 rounded-xl transition-all border ${
                isPending
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200 hover:border-blue-300 cursor-pointer shadow-2xs active:scale-95'
              }`}
              title={isPending ? 'Edición bloqueada: en revisión por administración' : 'Editar Inmueble'}
              aria-label="Editar Inmueble"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => !isPending && onTogglePause(property.id)}
              className={`p-2 rounded-xl transition-all border ${
                isPending
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                  : property.status === 'Activo'
                  ? 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-600 border-slate-200 hover:border-amber-300 cursor-pointer shadow-2xs active:scale-95'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 border-slate-200 hover:border-emerald-300 cursor-pointer shadow-2xs active:scale-95'
              }`}
              title={
                isPending
                  ? 'Controles de pausa/activación bloqueados mientras está en revisión'
                  : property.status === 'Activo'
                  ? 'Pausar publicación temporalmente'
                  : 'Reactivar publicación en catálogo'
              }
              aria-label={property.status === 'Activo' ? 'Pausar publicación' : 'Activar publicación'}
            >
              {property.status === 'Activo' ? (
                <PauseCircle className="h-3.5 w-3.5" />
              ) : (
                <PlayCircle className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => !isPending && handleDeleteClick()}
              className={`p-2 rounded-xl border transition-all ${
                isPending
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-300 cursor-pointer shadow-2xs active:scale-95'
              }`}
              title={isPending ? 'Eliminación bloqueada mientras está en revisión' : 'Eliminar Publicación'}
              aria-label="Eliminar Publicación"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
