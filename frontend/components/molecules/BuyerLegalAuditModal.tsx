"use client";

import React, { useState } from 'react';
import { ShieldCheck, X, Upload, CheckCircle2, Copy, Check, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { createPaymentOrder, uploadPaymentReceipt } from '@/lib/paymentsApi';
import { readStoredSession } from '@/lib/frontendStore';

interface BuyerLegalAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    folioReal?: string;
    price: string;
    location: string;
  };
}

export const BuyerLegalAuditModal = ({
  isOpen,
  onClose,
  property
}: BuyerLegalAuditModalProps) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('10000049281723');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!buyerName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!buyerPhone.trim()) {
      setErrorMsg('Por favor ingresa tu número de WhatsApp para enviarte el informe legal.');
      return;
    }
    if (!receiptFile && !receiptPreview) {
      setErrorMsg('Debes adjuntar el comprobante o captura de la transferencia bancaria.');
      return;
    }

    setIsSubmitting(true);
    try {
      const receiptUrl = receiptPreview || `https://inmovax.com/vouchers/${Date.now()}_audit.jpg`;
      const session = readStoredSession();

      const orderRes = await createPaymentOrder({
        propertyId: property.id,
        propertyTitle: property.title,
        sellerEmail: session?.email || 'comprador@inmovax.com',
        sellerName: buyerName,
        sellerPhone: buyerPhone,
        planId: 'abogado'
      });

      const orderId = orderRes.order?.id || `ORD-${Date.now()}`;
      await uploadPaymentReceipt({
        orderId,
        receiptUrl,
        sellerPhone: `${buyerPhone} (Comprador: ${buyerName})`
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al registrar tu solicitud. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setReceiptFile(null);
    setReceiptPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* CABECERA */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">
                Seguridad Jurídica Comprador
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Revisión Legal en Derechos Reales
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">
                  ¡Solicitud de Auditoría Registrada!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Hemos recibido tu comprobante de <strong>$75 USD (Bs. 522)</strong>. Nuestro abogado especialista asignado verificará el Folio Real en Derechos Reales y te enviará el dictamen certificado a tu WhatsApp <strong>{buyerPhone}</strong>.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Inmueble:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[220px]">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Folio Real auditado:</span>
                  <span className="font-mono font-bold text-slate-800">{property.folioReal || 'Registrado en sistema'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Plazo de entrega:</span>
                  <span className="font-bold text-emerald-700">24 a 48 horas hábiles</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Entendido y Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* RESUMEN DEL SERVICIO */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                    Servicio de Auditoría Notarial
                  </span>
                  <span className="text-base font-black text-emerald-800">
                    $75 USD <span className="text-xs font-bold text-emerald-600">/ Bs. 522</span>
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Evita estafas, gravámenes ocultos, hipotecas bancarias impagas y el delito de estelionato. Un abogado colegiado de InmoVAX acude directamente a Derechos Reales para auditar los papeles antes de que realices ningún pago al vendedor.
                </p>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-900 font-bold">
                  <span>Inmueble: {property.title}</span>
                  <span className="font-mono">ID: {property.id}</span>
                </div>
              </div>

              {/* DATOS DEL COMPRADOR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-800 font-medium outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número de WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 70612345"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-800 font-medium outline-none transition-all"
                  />
                </div>
              </div>

              {/* PASO QR DE PAGO */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-800 block">
                  Paso 1: Realiza la transferencia bancaria oficial
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200/80">
                  <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=inmovax-pago-abogado-75usd"
                      alt="QR de Pago InmoVAX"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 text-center sm:text-left flex-1">
                    <div className="font-extrabold text-slate-900 text-sm">
                      InmoVAX Soluciones Inmobiliarias S.R.L.
                    </div>
                    <div>
                      <span className="text-slate-400">Banco: </span>
                      <strong className="text-slate-800">Banco Nacional de Bolivia (BNB)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Cuenta Corriente: </span>
                      <strong className="font-mono text-slate-900">10000049281723</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Monto exacto: </span>
                      <strong className="text-emerald-700 font-black">$75 USD o Bs. 522</strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Cuenta copiada' : 'Copiar número de cuenta'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PASO SUBIR COMPROBANTE */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Paso 2: Adjunta la captura o comprobante de transferencia *
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {receiptPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="text-left text-xs">
                        <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                          {receiptFile?.name || 'Comprobante adjuntado'}
                        </span>
                        <span className="text-emerald-700 text-[11px] font-semibold">
                          Comprobante cargado correctamente (Clic para cambiar)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className="w-7 h-7 text-slate-400 mb-0.5" />
                      <span className="text-xs font-bold text-slate-800">
                        Haz clic o arrastra tu comprobante bancario
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Formatos soportados: JPG, PNG o PDF (Máx. 10MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* MENSAJE DE ERROR */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* BOTONES DE ACCIÓN */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Procesando solicitud...</span>
                  ) : (
                    <>
                      <span>Confirmar y Enviar Solicitud</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
