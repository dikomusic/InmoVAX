"use client";
import React, { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { CheckCircle2, FileText, Scale } from 'lucide-react';

export interface SellerDoc {
  id: string;
  propertyTitle: string;
  docType: 'Folio Real' | 'Certificado Alodial' | 'Impuesto GAMLP' | 'Minuta Notariada';
  folioNumber: string;
  status: 'Auditado & Vigente' | 'En Trámite Notarial';
  updatedDate: string;
}

const INITIAL_DOCS: SellerDoc[] = [
  {
    id: "DOC-1",
    propertyTitle: "Departamento Sopocachi con Terraza",
    docType: "Folio Real",
    folioNumber: "2.01.0.99.0018472",
    status: "Auditado & Vigente",
    updatedDate: "20 Ago 2026"
  },
  {
    id: "DOC-2",
    propertyTitle: "Departamento Sopocachi con Terraza",
    docType: "Certificado Alodial",
    folioNumber: "DDRR-LPZ-2026-918",
    status: "Auditado & Vigente",
    updatedDate: "20 Ago 2026"
  },
  {
    id: "DOC-3",
    propertyTitle: "Penthouse Calacoto Vista al Illimani",
    docType: "Folio Real",
    folioNumber: "2.01.1.05.0083719",
    status: "Auditado & Vigente",
    updatedDate: "24 Ago 2026"
  },
  {
    id: "DOC-4",
    propertyTitle: "Penthouse Calacoto Vista al Illimani",
    docType: "Minuta Notariada",
    folioNumber: "MIN-2026-042",
    status: "En Trámite Notarial",
    updatedDate: "25 Ago 2026"
  }
];

export const SellerDocumentsSection = () => {
  const [docs, setDocs] = useState<SellerDoc[]>(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<SellerDoc | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* CABECERA */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Scale aria-hidden="true" className="h-4 w-4" /> Bóveda Legal del Propietario
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-950">
            Respaldo de Folios Reales & Minutas Notariadas
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/80 mt-1 font-medium leading-relaxed">
            Todos tus documentos están auditados y vinculados a tus propiedades para garantizar transacciones 100% seguras ante notarios de fe pública en Bolivia.
          </p>
        </div>

        <div className="bg-white/90 border border-amber-200 p-4 rounded-2xl text-center shrink-0 shadow-xs">
          <span className="text-3xl font-black text-amber-600 block">{docs.length}</span>
          <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wider">Documentos Activos</span>
        </div>
      </div>

      {/* LISTADO DE DOCUMENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-lg">
                  <FileText aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" /> {doc.docType}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{doc.status}</span>
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-extrabold text-sm text-surface-dark">{doc.propertyTitle}</h4>
                <p className="text-xs font-mono font-bold text-gray-700 mt-1">Matrícula / Registro: {doc.folioNumber}</p>
                <p className="text-[11px] text-content-muted mt-0.5">Última validación notarial: {doc.updatedDate}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDoc(doc)}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-surface-dark font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Inspeccionar Certificado Notarial
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DOCUMENTO */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={`Expediente Legal: ${selectedDoc?.docType}`}
        subtitle={`Inmueble: ${selectedDoc?.propertyTitle}`}
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Tipo Documental:</span>
                <span className="font-extrabold text-surface-dark">{selectedDoc.docType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Matrícula Folio Real:</span>
                <span className="font-mono font-black text-primary text-sm">{selectedDoc.folioNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Estado en Derechos Reales:</span>
                <span className="font-bold text-emerald-700">{selectedDoc.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Fecha de Verificación:</span>
                <span className="font-medium text-gray-800">{selectedDoc.updatedDate}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-medium">
              <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Certificado libre de gravamen, hipotecas pendientes ni órdenes judiciales.</span>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
