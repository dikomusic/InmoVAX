"use client";

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { BuyerLegalAuditModal } from './BuyerLegalAuditModal';

interface PropertyLegalSecurityBoxProps {
  property: {
    id: string;
    title: string;
    folioReal?: string;
    price: string;
    location: string;
    isVerified?: boolean;
    status?: string;
  };
}

export const PropertyLegalSecurityBox = ({ property }: PropertyLegalSecurityBoxProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isVerified = Boolean(property.isVerified || property.status === 'Verificado');

  if (isVerified) {
    return (
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 mt-4 shadow-2xs">
        <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
              Verificado Legalmente
            </span>
            <span className="bg-emerald-200/60 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Auditoría DDRR Aprobada
            </span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed font-medium mt-1">
            La documentación y el Folio Real de este inmueble han sido auditados directamente en Derechos Reales por el equipo legal notarial de InmoVAX. Inmueble libre de gravámenes, hipotecas y riesgo de estelionato.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-3 mt-4 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
              Advertencia de Seguridad
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium mt-1">
              Esta propiedad no ha sido verificada legalmente. Para evitar el delito de estelionato y estafas, te recomendamos realizar una auditoría de los papeles antes de pagar.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-200" />
          <span>Solicitar Revisión Legal ($75 USD)</span>
        </button>
      </div>

      <BuyerLegalAuditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
      />
    </>
  );
};
