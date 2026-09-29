import React from 'react';
import { Scale, Check, CheckCircle2, XCircle } from 'lucide-react';

export interface LegalProperty {
  id: string;
  title: string;
  zone: string;
  price: string;
  folioReal: string;
  image: string;
  advisor: string;
  status: string;
  alodialStatus: 'Vigente' | 'En Trámite' | 'Observado';
  taxesYear: number;
}

interface LegalDocItemProps {
  property: LegalProperty;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LegalDocItem = ({
  property,
  onApprove,
  onReject
}: LegalDocItemProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
            {property.id}
          </span>
          <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
            ● {property.status}
          </span>
        </div>

        <div className="flex gap-4 mb-4">
          {property.image && property.image.trim() !== '' ? (
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" 
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0 text-amber-700">
              <Scale className="w-8 h-8 text-amber-700" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-extrabold text-surface-dark text-sm truncate">{property.title}</h4>
            <p className="text-xs text-content-muted mt-0.5 truncate">{property.zone}</p>
            <p className="text-sm font-black text-primary mt-1">Monto Anticrético: {property.price}</p>
          </div>
        </div>

        {/* CHECKLIST LEGAL TÉCNICO */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 border border-gray-100">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-700">Folio Real Matriculado:</span>
            <span className="font-mono text-primary font-black">{property.folioReal}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Certificado Alodial (DDRR):</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> {property.alodialStatus}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Impuestos Municipales:</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Gestión {property.taxesYear} Cancelada
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>Asesor a Cargo:</span>
            <span className="text-gray-900 font-bold">{property.advisor}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onApprove(property.id)}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow cursor-pointer text-center active:scale-95 inline-flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Validar y Habilitar</span>
        </button>
        <button
          type="button"
          onClick={() => onReject(property.id)}
          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer active:scale-95 inline-flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          <span>Observar</span>
        </button>
      </div>
    </div>
  );
};
