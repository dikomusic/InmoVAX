"use client";
import React, { useState } from 'react';
import { LegalDocItem, LegalProperty } from '../molecules/LegalDocItem';
import { Modal } from '../atoms/Modal';

interface AdminLegalSectionProps {
  legalItems: LegalProperty[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AdminLegalSection = ({
  legalItems,
  onApprove,
  onReject
}: AdminLegalSectionProps) => {
  const [selectedAudit, setSelectedAudit] = useState<LegalProperty | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* BANNER NOTARIAL LEGAL */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <span>🛡️</span> Departamento Legal Notarial • InmoVax Legal
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-950">
            Auditoría de Folios Reales y Gravámenes
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/80 mt-1 font-medium leading-relaxed">
            Protocolo de seguridad para Bolivia: Ningún inmueble en anticrético se publica sin verificación previa de su folio real matriculado, gravámenes en Derechos Reales (DDRR) e impuestos GAMLP al día.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xs border border-amber-200 p-4 rounded-2xl text-center shrink-0 shadow-sm">
          <span className="text-3xl font-black text-amber-600 block">{legalItems.length}</span>
          <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wider">Por Auditar</span>
        </div>
      </div>

      {/* GRID DE INMUEBLES POR AUDITAR */}
      {legalItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalItems.map((item) => (
            <LegalDocItem
              key={item.id}
              property={item}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white text-center py-20 rounded-3xl border border-gray-100 shadow-sm text-content-muted">
          <span className="text-5xl block mb-3">⚖️</span>
          <h4 className="font-extrabold text-surface-dark text-lg">Todos los Folios Reales están auditados</h4>
          <p className="text-xs text-content-muted mt-1 max-w-md mx-auto font-medium">
            No existen anticréticos pendientes de validación documental. Todas las publicaciones vigentes cuentan con respaldo jurídico.
          </p>
        </div>
      )}

      {/* REGISTRO DE NORMATIVA */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="font-extrabold text-sm text-surface-dark mb-3">Requisitos Obligatorios para Anticréticos InmoVax:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 font-medium">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-black text-primary block mb-1">1. Folio Real Actualizado</span>
            Verificación de titularidad sin hipotecas preferenciales ni anotaciones preventivas.
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-black text-primary block mb-1">2. Certificado Alodial</span>
            Emisión de Derechos Reales con menos de 30 días de antigüedad.
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="font-black text-primary block mb-1">3. Impuestos GAMLP</span>
            Comprobante de pago del impuesto a la propiedad de bienes inmuebles al día.
          </div>
        </div>
      </div>

    </div>
  );
};
