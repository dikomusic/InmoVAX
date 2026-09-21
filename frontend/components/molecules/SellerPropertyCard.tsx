"use client";
import React from 'react';
import { Eye, MessageCircle, Pencil, Trash2, PauseCircle, PlayCircle, BarChart3, Building2 } from 'lucide-react';
import { SellerStatusBadge, SellerPropertyStatus } from '../atoms/SellerStatusBadge';

export interface SellerProperty {
  id: string;
  title: string;
  zone: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  price: string;
  views: number;
  inquiries: number;
  status: SellerPropertyStatus;
  folioReal: string;
  assignedAdvisor: string;
  image: string;
  datePublished: string;
  authorEmail?: string;
}

interface SellerPropertyCardProps {
  property: SellerProperty;
  onTogglePause: (id: string) => void;
  onEdit: (property: SellerProperty) => void;
  onViewStats: (property: SellerProperty) => void;
  onDelete?: (id: string) => void;
  onRequestDelete?: (property: SellerProperty) => void;
}

export const SellerPropertyCard = ({
  property,
  onTogglePause,
  onEdit,
  onViewStats,
  onDelete,
  onRequestDelete
}: SellerPropertyCardProps) => {
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
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {property.image && property.image.trim() !== '' ? (
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
              <Building2 className="w-10 h-10 mb-1" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sin fotografía</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* BADGE TIPO DE OPERACIÓN */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-md ${
              property.type === 'Anticrético' ? 'bg-amber-400 text-slate-900' :
              property.type === 'Venta' ? 'bg-primary text-white' :
              'bg-purple-600 text-white'
            }`}>
              {property.type}
            </span>
          </div>

          {/* BADGE ESTADO LEGAL */}
          <div className="absolute top-3 right-3 z-10">
            <SellerStatusBadge status={property.status} size="sm" className="shadow-md" />
          </div>

          {/* BARRA INFERIOR DE IMAGEN */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold drop-shadow-sm z-10">
            <span className="truncate">{property.zone}</span>
            <span className="shrink-0 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-mono text-[10px]">
              ID: {property.id}
            </span>
          </div>
        </div>

        {/* CONTENIDO Y MÉTRICAS */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {property.datePublished}
            </span>
            <h4 className="font-black text-sm sm:text-base text-surface-dark line-clamp-1 mt-0.5 group-hover:text-primary transition-colors">
              {property.title}
            </h4>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-xl font-black text-surface-dark tracking-tight">
                {property.price}
              </span>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                Folio: {property.folioReal}
              </span>
            </div>
          </div>

          {/* MÉTRICAS DE VISUALIZACIONES Y CONSULTAS */}
          <div className="bg-gray-50 rounded-2xl p-2.5 sm:p-3 grid grid-cols-2 gap-2 text-center text-xs border border-gray-100">
            <div className="border-r border-gray-200/60 pr-1">
              <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-wider">
                Visualizaciones
              </span>
              <span className="flex items-center justify-center gap-1 font-black text-surface-dark text-sm mt-0.5">
                <Eye className="h-3.5 w-3.5 text-blue-600" /> {property.views}
              </span>
            </div>
            <div className="pl-1">
              <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-wider">
                Consultas
              </span>
              <span className="flex items-center justify-center gap-1 font-black text-emerald-600 text-sm mt-0.5">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> {property.inquiries}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
            <span>Asesor asignado:</span>
            <strong className="text-gray-900 font-bold">{property.assignedAdvisor}</strong>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIONES RESPONSIVA */}
      <div className="p-3 sm:p-4 bg-gray-50/80 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewStats(property)}
          className="flex-1 min-w-[120px] py-2 px-3 bg-white hover:bg-gray-100 text-surface-dark font-extrabold text-xs rounded-xl border border-gray-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          <span>Rendimiento</span>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(property)}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-primary rounded-xl transition-colors cursor-pointer border border-blue-100"
            title="Editar Inmueble"
            aria-label="Editar Inmueble"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onTogglePause(property.id)}
            className={`px-2.5 py-2 text-xs font-extrabold rounded-xl transition-colors cursor-pointer border flex items-center gap-1 ${
              property.status === 'Activo'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title={property.status === 'Activo' ? 'Pausar publicación temporalmente' : 'Reactivar publicación'}
          >
            {property.status === 'Activo' ? (
              <>
                <PauseCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pausar</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Activar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-2 sm:px-2.5 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
            title="Eliminar Publicación"
            aria-label="Eliminar Publicación"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
