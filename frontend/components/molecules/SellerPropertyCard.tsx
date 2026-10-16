"use client";
import React from 'react';
import { Eye, MessageCircle, Pencil, Trash2, PauseCircle, PlayCircle, BarChart3, Building2, CreditCard, MapPin } from 'lucide-react';
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
      <div>
        {/* IMAGEN DE CABECERA Y BADGES */}
        <div className="relative h-42 w-full overflow-hidden bg-gray-100">
          {property.image && property.image.trim() !== '' ? (
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
              <Building2 className="w-9 h-9 mb-1 text-slate-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sin fotografía</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20 pointer-events-none" />

          {/* BADGE TIPO DE OPERACIÓN */}
          <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
            <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black shadow-xs ${
              property.type === 'Anticrético' ? 'bg-amber-400 text-slate-900' :
              property.type === 'Venta' ? 'bg-primary text-white' :
              'bg-purple-600 text-white'
            }`}>
              {property.type}
            </span>
          </div>

          {/* BADGE ESTADO (EN REVISIÓN / ACTIVO / PAUSADO) */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <SellerStatusBadge status={property.status} size="sm" className="shadow-xs backdrop-blur-xs" />
          </div>

          {/* BARRA INFERIOR DE IMAGEN */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-sm z-10">
            <span className="truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-white/80 shrink-0" />
              <span className="truncate text-[11px] font-bold">{property.zone}</span>
            </span>
            <span className="shrink-0 bg-black/45 backdrop-blur-xs px-2 py-0.5 rounded-md font-mono text-[10px] text-white/90 border border-white/10">
              ID: {property.id}
            </span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-4 space-y-2.5">
          {/* CATEGORÍA Y FECHA */}
          <div className="flex items-center justify-between text-[11px] text-content-muted font-bold">
            <span>{property.category || 'Departamento'}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{property.datePublished}</span>
          </div>

          {/* TÍTULO */}
          <h4 className="font-extrabold text-sm sm:text-base text-surface-dark line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h4>

          {/* PRECIO Y FOLIO REAL */}
          <div className="flex items-baseline justify-between gap-2 pt-0.5">
            <span className="text-xl font-black text-surface-dark tracking-tight">
              {property.price}
            </span>
            <span
              className="text-[11px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20 truncate max-w-[170px]"
              title={`Folio Real: ${property.folioReal}`}
            >
              Folio: {property.folioReal}
            </span>
          </div>

          {/* TIRA COMPACTA DE MÉTRICAS Y ASESOR */}
          <div className="bg-gray-50/90 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500" title="Visualizaciones">
                <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-extrabold text-surface-dark">{property.views}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500" title="Consultas recibidas">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-extrabold text-surface-dark">{property.inquiries}</span>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 truncate text-right max-w-[150px]" title={`Asesor: ${property.assignedAdvisor}`}>
              <span className="text-gray-400">Asesor: </span>
              <strong className="text-gray-800 font-bold truncate">{property.assignedAdvisor}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIONES OPTIMIZADA */}
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
        {/* ACCIONES DE INFORMACIÓN Y PLAN */}
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={() => onViewStats(property)}
            className="py-1.5 px-2.5 bg-white hover:bg-gray-100 text-surface-dark font-extrabold text-[11px] rounded-xl border border-gray-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
            title="Ver métricas de rendimiento"
          >
            <BarChart3 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">Rendimiento</span>
          </button>

          {onOpenPlanModal && (
            <button
              type="button"
              onClick={() => onOpenPlanModal(property)}
              className="py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-[11px] rounded-xl border border-amber-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
              title="Ver planes de publicación y pago QR"
            >
              <CreditCard className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Plan / QR</span>
            </button>
          )}
        </div>

        {/* ACCIONES DE CONTROL: EDITAR, PAUSAR/ACTIVAR, ELIMINAR */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={isPending}
            onClick={() => !isPending && onEdit(property)}
            className={`p-1.5 rounded-xl transition-colors border ${
              isPending
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                : 'bg-white hover:bg-blue-50 text-blue-600 border-gray-200 hover:border-blue-200 cursor-pointer shadow-2xs'
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
            className={`p-1.5 rounded-xl transition-colors border ${
              isPending
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                : property.status === 'Activo'
                ? 'bg-white hover:bg-amber-50 text-amber-700 border-gray-200 hover:border-amber-200 cursor-pointer shadow-2xs'
                : 'bg-white hover:bg-emerald-50 text-emerald-700 border-gray-200 hover:border-emerald-200 cursor-pointer shadow-2xs'
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
            className={`p-1.5 rounded-xl border transition-colors ${
              isPending
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                : 'bg-white hover:bg-rose-50 text-rose-600 border-gray-200 hover:border-rose-200 cursor-pointer shadow-2xs'
            }`}
            title={isPending ? 'Eliminación bloqueada mientras está en revisión' : 'Eliminar Publicación'}
            aria-label="Eliminar Publicación"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
