"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Check, QrCode, Upload, ArrowRight, ShieldCheck, Download, Loader2, Sparkles, 
  TrendingUp, Camera, Scale, Zap, Crown, FileText, Phone
} from 'lucide-react';
import { 
  fetchPublicationPlans, 
  createPaymentOrder, 
  uploadPaymentReceipt, 
  PublicationPlanItem,
  PaymentOrderResponse,
  PlanType
} from '@/lib/paymentsApi';
import { readStoredSession } from '@/lib/frontendStore';

interface PublicationPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
  onSuccess?: () => void;
  onPlanConfirmed?: (order: PaymentOrderResponse['order']) => void;
  ctaText?: string;
}

export const PublicationPlansModal: React.FC<PublicationPlansModalProps> = ({
  isOpen,
  onClose,
  propertyId = 'draft-prop',
  propertyTitle = 'Inmueble en Publicación',
  onSuccess,
  onPlanConfirmed,
  ctaText
}) => {
  const [plans, setPlans] = useState<Record<string, PublicationPlanItem>>({});
  const [selectedPlanId, setSelectedPlanId] = useState<PlanType>('premium');
  const [step, setStep] = useState<'services' | 'qr_payment' | 'success'>('services');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Datos de la orden y archivos adjuntos
  const [currentOrder, setCurrentOrder] = useState<PaymentOrderResponse['order'] | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [folioPreview, setFolioPreview] = useState<string | null>(null);
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const session = readStoredSession();

  useEffect(() => {
    if (isOpen) {
      setStep('services');
      setErrorMessage(null);
      setReceiptPreview(null);
      setFolioPreview(null);
      fetchPublicationPlans().then(setPlans);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectService = async (planId: PlanType) => {
    setSelectedPlanId(planId);
    setLoading(true);
    setErrorMessage(null);

    const userEmail = session?.email || 'propietario@inmovax.com';
    const userName = session?.name || 'Propietario InmoVAX';

    try {
      const res = await createPaymentOrder({
        propertyId,
        propertyTitle,
        sellerEmail: userEmail,
        sellerName: userName,
        sellerPhone,
        planId
      });

      if (!res.success || !res.order) {
        setErrorMessage(res.error || 'No se pudo generar la orden de servicio');
        setLoading(false);
        return;
      }

      setCurrentOrder(res.order);
      setStep('qr_payment');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar el servicio seleccionado');
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFolioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFolioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmOrder = async () => {
    setErrorMessage(null);

    if (!receiptPreview) {
      setErrorMessage('Por favor adjunta la fotografía o captura de tu comprobante de depósito antes de enviar.');
      return;
    }

    setUploadingReceipt(true);

    try {
      let orderId = currentOrder?.id;

      if (!orderId) {
        const userEmail = session?.email || 'propietario@inmovax.com';
        const userName = session?.name || 'Propietario InmoVAX';
        const res = await createPaymentOrder({
          propertyId,
          propertyTitle,
          sellerEmail: userEmail,
          sellerName: userName,
          sellerPhone,
          planId: selectedPlanId
        });
        if (res.order) {
          orderId = res.order.id;
          setCurrentOrder(res.order);
        } else {
          orderId = `ORD-${Date.now()}`;
        }
      }

      const ok = await uploadPaymentReceipt({
        orderId,
        receiptUrl: receiptPreview,
        folioDocumentUrl: folioPreview || undefined,
        sellerPhone: sellerPhone || undefined
      });

      if (ok) {
        setStep('success');
        if (onPlanConfirmed && currentOrder) onPlanConfirmed(currentOrder);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage('Error al registrar el comprobante. Por favor intenta de nuevo.');
      }
    } catch {
      setErrorMessage('Error de conexión al cargar comprobante.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const selectedPlan = plans[selectedPlanId] || {
    id: selectedPlanId,
    name: selectedPlanId === 'premium' ? 'Plan Premium' : selectedPlanId,
    price: selectedPlanId === 'premium' ? 120 : selectedPlanId === 'abogado' ? 75 : selectedPlanId === 'fotografo' ? 60 : selectedPlanId === 'duo' ? 85 : 15,
    currency: 'USD'
  };

  const requiresFolio = selectedPlanId === 'abogado' || selectedPlanId === 'premium';
  const requiresPhotographer = selectedPlanId === 'fotografo' || selectedPlanId === 'duo' || selectedPlanId === 'premium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CABECERA DEL MODAL */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-surface-light via-white to-surface-light">
          <div>
            <span className="text-[11px] font-black tracking-wider text-amber-600 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Servicios Premium InmoVAX
            </span>
            <h2 className="text-base sm:text-xl font-black text-surface-dark mt-0.5">
              {step === 'services' && 'Vende o Alquila más Rápido y con Máxima Seguridad Legal'}
              {step === 'qr_payment' && 'Pago con QR Bancario y Envío de Comprobante'}
              {step === 'success' && '¡Servicio Solicitado Exitosamente!'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-content-muted hover:text-surface-dark hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">

          {/* MENSAJE DE ERROR */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl animate-in fade-in flex items-center gap-2">
              <X className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASO 1: SELECCIÓN DE LOS 5 SERVICIOS PROFESIONALES             */}
          {/* ============================================================== */}
          {step === 'services' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <p className="text-xs sm:text-sm text-content-muted font-medium">
                  Tu inmueble ya está publicado en el plan gratuito. Activa cualquiera de estos servicios para obtener ventaja competitiva en el mercado:
                </p>
              </div>

              {/* GRILLA DE SERVICIOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                
                {/* 1. PRIORIZACIÓN ($15) */}
                <div 
                  onClick={() => setSelectedPlanId('priorizacion')}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                    selectedPlanId === 'priorizacion'
                      ? 'border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
                        Visibilidad
                      </span>
                      <h4 className="text-sm font-black text-surface-dark mt-1">Priorización</h4>
                    </div>
                    <div className="text-xl font-black text-surface-dark">
                      $15 <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">
                      Coloca tu anuncio en los primeros lugares de búsquedas. Tráfico inmediato.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectService('priorizacion')}
                    disabled={loading}
                    className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Elegir por $15
                  </button>
                </div>

                {/* 2. FOTÓGRAFO ($60) */}
                <div 
                  onClick={() => setSelectedPlanId('fotografo')}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                    selectedPlanId === 'fotografo'
                      ? 'border-purple-500 bg-purple-50/40 shadow-md ring-2 ring-purple-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-100/60 px-2 py-0.5 rounded-md">
                        Impacto Visual
                      </span>
                      <h4 className="text-sm font-black text-surface-dark mt-1">Fotógrafo HD</h4>
                    </div>
                    <div className="text-xl font-black text-surface-dark">
                      $60 <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">
                      Sesión presencial a domicilio y edición profesional que triplica visitas.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectService('fotografo')}
                    disabled={loading}
                    className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Elegir por $60
                  </button>
                </div>

                {/* 3. SERVICIO DE ABOGADO ($75) */}
                <div 
                  onClick={() => setSelectedPlanId('abogado')}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                    selectedPlanId === 'abogado'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        Seguridad DDRR
                      </span>
                      <h4 className="text-sm font-black text-surface-dark mt-1">Abogado Notarial</h4>
                    </div>
                    <div className="text-xl font-black text-surface-dark">
                      $75 <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">
                      Auditoría del Folio Real + <strong>Sello verde &quot;Verificado Legalmente&quot;</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectService('abogado')}
                    disabled={loading}
                    className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Elegir por $75
                  </button>
                </div>

                {/* 4. PLAN DÚO ($85) */}
                <div 
                  onClick={() => setSelectedPlanId('duo')}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                    selectedPlanId === 'duo'
                      ? 'border-indigo-500 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-md">
                        Ahorras $10
                      </span>
                      <h4 className="text-sm font-black text-surface-dark mt-1">Plan Dúo</h4>
                    </div>
                    <div className="text-xl font-black text-surface-dark">
                      $85 <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">
                      Priorización destacada en búsquedas + Sesión fotográfica HD profesional.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectService('duo')}
                    disabled={loading}
                    className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Elegir por $85
                  </button>
                </div>

                {/* 5. PLAN PREMIUM ($120) - EL MÁS POPULAR */}
                <div 
                  onClick={() => setSelectedPlanId('premium')}
                  className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                    selectedPlanId === 'premium'
                      ? 'border-amber-500 bg-amber-50/50 shadow-xl ring-2 ring-amber-500/30'
                      : 'border-amber-300 hover:border-amber-400 bg-amber-50/20'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    ⭐ El más popular
                  </div>

                  <div className="space-y-3 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                        Ahorras $30
                      </span>
                      <h4 className="text-sm font-black text-surface-dark mt-1">Plan Premium</h4>
                    </div>
                    <div className="text-xl font-black text-amber-600">
                      $120 <span className="text-[10px] font-bold text-gray-400">USD</span>
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">
                      <strong>Todo Incluido:</strong> Priorización + Sello Verificado por Abogado + Fotógrafo HD.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectService('premium')}
                    disabled={loading}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Elegir por $120
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASO 2: PAGO MEDIANTE QR BANCARIO Y CARGA DE VOUCHER           */}
          {/* ============================================================== */}
          {step === 'qr_payment' && currentOrder && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              
              {/* RESUMEN DEL MONTO Y SERVICIO */}
              <div className="bg-surface-light border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                    Servicio Seleccionado
                  </span>
                  <h3 className="text-base font-black text-surface-dark">
                    {currentOrder.planName}
                  </h3>
                  <p className="text-xs text-content-muted">
                    Inmueble: <strong>{propertyTitle}</strong>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black text-emerald-600">
                    ${currentOrder.amount} USD
                  </span>
                  <p className="text-[11px] font-bold text-gray-400">
                    Equivalente a Bs. {Math.round(currentOrder.amount * 6.96)}
                  </p>
                </div>
              </div>

              {/* BLOQUE DE PAGO QR Y DATOS BANCARIOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-gray-50/80 p-5 rounded-3xl border border-gray-200">
                {/* QR Code Simulado Dinámico */}
                <div className="flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                  <div className="w-44 h-44 bg-white p-2 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                      <rect x="12" y="12" width="11" height="11"/>
                      <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                      <rect x="77" y="12" width="11" height="11"/>
                      <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                      <rect x="12" y="77" width="11" height="11"/>
                      <rect x="40" y="10" width="8" height="8"/>
                      <rect x="52" y="18" width="8" height="8"/>
                      <rect x="38" y="38" width="24" height="24" rx="4" fill="#059669"/>
                      <circle cx="50" cy="50" r="6" fill="#FFFFFF"/>
                      <rect x="70" y="45" width="10" height="8"/>
                      <rect x="45" y="72" width="15" height="6"/>
                      <rect x="72" y="72" width="18" height="18"/>
                    </svg>
                    <span className="text-[8px] tracking-widest text-gray-400 font-mono mt-1">
                      {currentOrder.id}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-600 mt-2">
                    Escanea con BCP, Banco Unión o BNB
                  </span>
                </div>

                {/* Datos de Transferencia */}
                <div className="text-xs space-y-2 text-surface-dark">
                  <h4 className="font-extrabold text-sm text-surface-dark mb-1">
                    Datos de Depósito Bancario
                  </h4>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Banco:</span>
                    <span className="font-bold">Banco Mercantil Santa Cruz</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">N° de Cuenta:</span>
                    <span className="font-mono font-black text-primary">4010-8923-01-92</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Titular:</span>
                    <span className="font-bold">InmoVAX Soluciones S.R.L.</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">NIT / Documento:</span>
                    <span className="font-mono font-bold">3049581028 (NIT)</span>
                  </div>
                </div>
              </div>

              {/* CAMPOS DE FORMULARIO: VOUCHER, FOLIO Y WHATSAPP */}
              <div className="space-y-4">
                
                {/* 1. Teléfono / WhatsApp de contacto */}
                <div>
                  <label className="block text-xs font-bold text-surface-dark mb-1">
                    Tu Teléfono o WhatsApp de Coordinación:
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Ej. +591 77201928"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-accent outline-hidden"
                    />
                  </div>
                  {requiresPhotographer && (
                    <span className="text-[11px] text-purple-700 font-medium mt-1 block">
                      * El fotógrafo profesional te contactará a este número para coordinar día y hora de la sesión.
                    </span>
                  )}
                </div>

                {/* 2. Carga del Comprobante (Voucher JPG/PNG) */}
                <div>
                  <label className="block text-xs font-bold text-surface-dark mb-1">
                    Sube la fotografía de tu Comprobante de Depósito (JPG/PNG):
                  </label>
                  <div className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex items-center justify-between gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVoucherFileChange}
                      className="text-xs text-content-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-dark file:text-white hover:file:bg-black cursor-pointer"
                    />
                    {receiptPreview && (
                      <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1 shrink-0">
                        <Check className="w-4 h-4 stroke-[2.5]" /> Voucher Listo
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Campo Condicional: Folio Real para Abogado / Premium */}
                {requiresFolio && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Documento de Folio Real / Información Rápida:</span>
                    </div>
                    <p className="text-[11px] text-emerald-800/90 leading-relaxed font-medium">
                      Para que nuestro abogado pueda auditar en Derechos Reales y otorgarte el <strong>Sello Verde &quot;Verificado Legalmente&quot;</strong>, adjunta una foto o PDF del documento:
                    </p>
                    <div className="border border-emerald-300 rounded-xl p-2.5 bg-white flex items-center justify-between gap-3">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFolioFileChange}
                        className="text-xs text-emerald-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                      />
                      {folioPreview && (
                        <span className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1 shrink-0">
                          <Check className="w-4 h-4 stroke-[2.5]" /> Folio Adjuntado
                        </span>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* MENSAJE DE ERROR VISIBLE */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <span className="font-bold">Atención:</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* BOTONES DE ACCIÓN */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('services')}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-xs text-content-muted hover:text-surface-dark hover:bg-gray-50 transition-all cursor-pointer"
                >
                  &larr; Volver a Servicios
                </button>
                <button
                  type="button"
                  disabled={uploadingReceipt}
                  onClick={handleConfirmOrder}
                  className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  {uploadingReceipt ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Enviando Comprobante...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Confirmar y Enviar Comprobante
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* PASO 3: CONFIRMACIÓN Y ÉXITO                                   */}
          {/* ============================================================== */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-surface-dark">
                ¡Comprobante y Solicitud Enviados!
              </h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Hemos registrado tu solicitud para el <strong>{selectedPlan.name}</strong>. En breve, el Administrador verificará el ingreso en la cuenta bancaria para activar el servicio en tu anuncio.
              </p>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (onPlanConfirmed && currentOrder) {
                      onPlanConfirmed(currentOrder);
                    }
                    onClose();
                  }}
                  className="w-full py-3.5 bg-surface-dark hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {ctaText || 'Listo, Volver a Mis Inmuebles →'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
