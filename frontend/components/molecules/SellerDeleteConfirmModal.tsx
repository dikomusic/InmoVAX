"use client";
import React from 'react';
import { AlertTriangle, Trash2, X, Building2 } from 'lucide-react';
import { SellerProperty } from './SellerPropertyCard';

interface SellerDeleteConfirmModalProps {
  isOpen: boolean;
  property: SellerProperty | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const SellerDeleteConfirmModal = ({
  isOpen,
  property,
  onClose,
  onConfirm
}: SellerDeleteConfirmModalProps) => {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* CABECERA ROJA / ALERTA */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="delete-modal-title" className="text-base font-extrabold text-gray-900 leading-tight">
              ¿Eliminar publicación?
            </h3>
            <p className="text-xs text-rose-700/90 mt-0.5 font-medium">
              Esta acción no se puede deshacer y dará de baja el inmueble del catálogo público.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* DETALLES DEL INMUEBLE A ELIMINAR */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            {property.image && property.image.trim() !== '' ? (
              <img
                src={property.image}
                alt={property.title}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0 text-slate-400">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {property.type}
              </span>
              <h4 className="font-extrabold text-xs sm:text-sm text-surface-dark truncate mt-1">
                {property.title}
              </h4>
              <p className="text-xs text-content-muted truncate">{property.zone}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-black text-gray-900">{property.price}</span>
                <span className="text-[10px] text-gray-500 font-mono">Folio: {property.folioReal}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-800">
              <Building2 className="h-4 w-4 shrink-0" />
              Impacto de la eliminación:
            </p>
            <ul className="list-disc list-inside text-[11px] text-amber-800/90 pl-1 space-y-0.5">
              <li>El inmueble dejará de mostrarse en la página principal y búsquedas.</li>
              <li>Si no tienes más inmuebles publicados, la opción "Mi cuenta" se ocultará de la cabecera.</li>
              <li>Se cancelarán las consultas activas vinculadas a este inmueble.</li>
            </ul>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Sí, eliminar publicación</span>
          </button>
        </div>
      </div>
    </div>
  );
};
