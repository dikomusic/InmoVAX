"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Diamond, Key, Clock, Megaphone, 
  Headphones, QrCode, Upload, ArrowRight, ShieldCheck, Download, Loader2, Sparkles
} from 'lucide-react';
import { 
  fetchPublicationPlans, 
  createPaymentOrder, 
  uploadPaymentReceipt, 
  PublicationPlanItem,
  PaymentOrderResponse
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
  const [selectedPlanId, setSelectedPlanId] = useState<'basico' | 'oro' | 'diamante'>('oro');
  const [step, setStep] = useState<'compare' | 'qr_payment' | 'success'>('compare');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Orden de pago actual
  const [currentOrder, setCurrentOrder] = useState<PaymentOrderResponse['order'] | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Detección de cuenta VIP de prueba
  const session = readStoredSession();
  const isVipUser = session?.email?.toLowerCase().trim() === 'vip@inmovax.com';

  useEffect(() => {
    if (isOpen) {
      setStep('compare');
      setErrorMessage(null);
      setReceiptPreview(null);
      fetchPublicationPlans().then(setPlans);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlanAndContinue = async (planId: 'basico' | 'oro' | 'diamante') => {
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
        planId
      });

      if (!res.success || !res.order) {
        setErrorMessage(res.error || 'No se pudo generar la orden de pago');
        setLoading(false);
        return;
      }

      setCurrentOrder(res.order);

      // Si es usuario VIP, salta directo al éxito (publicación gratis)
      if (res.isExemptVip || res.order.status === 'exento_vip') {
        setStep('success');
        if (onPlanConfirmed) onPlanConfirmed(res.order);
        if (onSuccess) onSuccess();
      } else {
        setStep('qr_payment');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar el plan seleccionado');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!currentOrder) return;
    if (!receiptPreview) {
      setErrorMessage('Por favor adjunta una captura o foto de tu comprobante de pago.');
      return;
    }

    setUploadingReceipt(true);
    setErrorMessage(null);

    try {
      const ok = await uploadPaymentReceipt(currentOrder.id, receiptPreview);
      if (ok) {
        setStep('success');
        if (onPlanConfirmed) onPlanConfirmed(currentOrder);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage('Error al enviar el comprobante. Por favor intenta de nuevo.');
      }
    } catch {
      setErrorMessage('Error de conexión al cargar comprobante.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const activePlanData = plans[selectedPlanId] || {
    name: selectedPlanId === 'diamante' ? 'Diamante' : selectedPlanId === 'oro' ? 'Oro' : 'Básico',
    price: selectedPlanId === 'diamante' ? 75 : selectedPlanId === 'oro' ? 45 : 25,
    currency: 'USD',
    durationLabel: selectedPlanId === 'diamante' ? '¡Hasta que se venda o alquile!' : selectedPlanId === 'oro' ? '60 días' : '30 días'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-surface-light">
          <div>
            <span className="text-[11px] font-black tracking-wider text-accent uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> InmoVAX Publicaciones
            </span>
            <h2 className="text-base sm:text-lg font-black text-surface-dark">
              {step === 'compare' && 'Elige el Plan para tu Publicación'}
              {step === 'qr_payment' && 'Pago mediante Código QR Bancario'}
              {step === 'success' && '¡Publicación Lista y Registrada!'}
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

        {/* Banner especial si el usuario es VIP */}
        {isVipUser && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-amber-900 text-xs font-bold">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Cuenta VIP Reconocida (<strong>{session?.email}</strong>) • Tienes publicaciones 100% gratuitas</span>
            </span>
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              Exento de Pago
            </span>
          </div>
        )}

        {/* Contenido Dinámico con Scroll si es necesario */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-in fade-in flex items-center gap-2">
              <X className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASO 1: PANTALLA FLOTANTE COMPARATIVA (TABLA ESTILO INFOCASAS)  */}
          {/* ============================================================== */}
          {step === 'compare' && (
            <div className="space-y-4">
              <p className="text-xs text-content-muted text-center sm:text-left">
                Publica tu inmueble con las mejores condiciones. Selecciona la duración y nivel de difusión que prefieras:
              </p>

              {/* Contenedor Adaptable / Multipantallas */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
                <table className="w-full text-left border-collapse min-w-[620px]">
                  <thead>
                    <tr>
                      <th className="p-3.5 sm:p-4 text-xs font-black text-content-main bg-gray-50 border-r border-b border-gray-200 w-1/4">
                        Características
                      </th>
                      {/* Básico */}
                      <th className="p-3.5 sm:p-4 text-center text-white bg-slate-500 font-extrabold text-sm border-r border-b border-gray-200 w-1/4">
                        Básico
                      </th>
                      {/* Oro */}
                      <th className="p-3.5 sm:p-4 text-center text-white bg-[#F59E0B] font-extrabold text-sm border-r border-b border-gray-200 w-1/4">
                        Oro
                      </th>
                      {/* Diamante */}
                      <th className="p-3.5 sm:p-4 text-center text-white bg-[#EA580C] font-extrabold text-sm border-b border-gray-200 w-1/4">
                        <span className="flex items-center justify-center gap-1.5">
                          <Diamond className="w-4 h-4 fill-white" /> Diamante
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-gray-200 bg-white">
                    {/* Fila 1: Exposición */}
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 sm:p-3.5 font-bold text-surface-dark border-r border-gray-200 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-accent shrink-0" />
                        <span>Exposición dentro del listado particulares</span>
                      </td>
                      <td className="p-3 text-center border-r border-gray-200 text-content-main font-bold">
                        Buena
                      </td>
                      <td className="p-3 text-center border-r border-gray-200 text-content-main font-bold">
                        Buena
                      </td>
                      <td className="p-3 text-center text-[#EA580C] font-black">
                        Máxima
                      </td>
                    </tr>

                    {/* Fila 2: Duración */}
                    <tr className="hover:bg-gray-50/50 transition-colors bg-surface-light/40">
                      <td className="p-3 sm:p-3.5 font-bold text-surface-dark border-r border-gray-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span>Duración</span>
                      </td>
                      <td className="p-3 text-center border-r border-gray-200 font-semibold text-surface-dark">
                        30 días
                      </td>
                      <td className="p-3 text-center border-r border-gray-200 font-semibold text-surface-dark">
                        60 días
                      </td>
                      <td className="p-3 text-center text-[#EA580C] font-black">
                        <span className="flex items-center justify-center gap-1">
                          <Key className="w-3.5 h-3.5" /> ¡Hasta que se venda o alquile!
                        </span>
                      </td>
                    </tr>

                    {/* Fila 3: Difusión */}
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 sm:p-3.5 font-bold text-surface-dark border-r border-gray-200 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-accent shrink-0" />
                        <span>Difusión en los canales de InmoVAX</span>
                      </td>
                      <td className="p-3 text-center border-r border-gray-200">
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-3" />
                      </td>
                      <td className="p-3 text-center border-r border-gray-200">
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-3" />
                      </td>
                      <td className="p-3 text-center">
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-3" />
                      </td>
                    </tr>

                    {/* Fila 4: Soporte */}
                    <tr className="hover:bg-gray-50/50 transition-colors bg-surface-light/40">
                      <td className="p-3 sm:p-3.5 font-bold text-surface-dark border-r border-gray-200 flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-accent shrink-0" />
                        <span>Soporte online y telefónico</span>
                      </td>
                      <td className="p-3 text-center border-r border-gray-200">
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-3" />
                      </td>
                      <td className="p-3 text-center border-r border-gray-200">
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-3" />
                      </td>
                      <td className="p-3 text-center">
                        <Check className="w-4 h-4 text-emerald-600 mx-auto stroke-3" />
                      </td>
                    </tr>

                    {/* Fila 7: PRECIOS (Configurables y SIN "IVA incluido") */}
                    <tr className="bg-gray-50/80 font-black">
                      <td className="p-3 sm:p-4 text-xs font-black text-surface-dark border-r border-gray-200">
                        Inversión
                      </td>
                      {/* Precio Básico */}
                      <td className="p-3 sm:p-4 text-center border-r border-gray-200">
                        <span className="text-base sm:text-lg text-slate-800 font-black">
                          U$S {plans.basico?.price || 25}
                        </span>
                      </td>
                      {/* Precio Oro */}
                      <td className="p-3 sm:p-4 text-center border-r border-gray-200">
                        <span className="text-base sm:text-lg text-amber-700 font-black">
                          U$S {plans.oro?.price || 45}
                        </span>
                      </td>
                      {/* Precio Diamante */}
                      <td className="p-3 sm:p-4 text-center">
                        <span className="text-base sm:text-lg text-[#EA580C] font-black">
                          U$S {plans.diamante?.price || 75}
                        </span>
                      </td>
                    </tr>

                    {/* Fila 8: BOTONES "Continuar >" */}
                    <tr>
                      <td className="p-3 border-r border-gray-200 bg-gray-50"></td>
                      {/* Botón Básico */}
                      <td className="p-3 border-r border-gray-200">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectPlanAndContinue('basico')}
                          className="w-full py-2.5 px-3 bg-[#EA580C] hover:bg-[#D44A05] text-white text-xs font-black rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-98"
                        >
                          Continuar &gt;
                        </button>
                      </td>
                      {/* Botón Oro */}
                      <td className="p-3 border-r border-gray-200">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectPlanAndContinue('oro')}
                          className="w-full py-2.5 px-3 bg-[#EA580C] hover:bg-[#D44A05] text-white text-xs font-black rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-98"
                        >
                          Continuar &gt;
                        </button>
                      </td>
                      {/* Botón Diamante */}
                      <td className="p-3">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectPlanAndContinue('diamante')}
                          className="w-full py-2.5 px-3 bg-[#EA580C] hover:bg-[#D44A05] text-white text-xs font-black rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-98"
                        >
                          Continuar &gt;
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASO 2: PAGO QR Y CARGA DEL COMPROBANTE                       */}
          {/* ============================================================== */}
          {step === 'qr_payment' && currentOrder && (
            <div className="space-y-6 max-w-lg mx-auto text-center animate-in zoom-in-95 duration-150">
              
              {/* Tarjeta Resumen */}
              <div className="bg-surface-light border border-gray-200 rounded-2xl p-4 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent">Plan Seleccionado</span>
                  <h3 className="text-base font-black text-surface-dark">{activePlanData.name} ({activePlanData.durationLabel})</h3>
                  <p className="text-xs text-content-muted">Inmueble: {propertyTitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-content-muted block">Monto a pagar</span>
                  <span className="text-xl font-black text-surface-dark">
                    U$S {activePlanData.price}
                  </span>
                </div>
              </div>

              {/* QR Oficial */}
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center">
                <div className="w-52 h-52 bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
                  {/* Gráfica del QR simulado con SVG nítido */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="12" y="12" width="11" height="11"/>
                    <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="77" y="12" width="11" height="11"/>
                    <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="12" y="77" width="11" height="11"/>
                    <rect x="40" y="10" width="8" height="8"/>
                    <rect x="52" y="18" width="8" height="8"/>
                    <rect x="38" y="38" width="24" height="24" rx="4" fill="#F59E0B"/>
                    <circle cx="50" cy="50" r="6" fill="#0F172A"/>
                    <rect x="70" y="45" width="10" height="8"/>
                    <rect x="45" y="72" width="15" height="6"/>
                    <rect x="72" y="72" width="18" height="18"/>
                  </svg>
                  <span className="absolute bottom-1 text-[8px] tracking-widest text-gray-400 font-mono">
                    {currentOrder.id}
                  </span>
                </div>

                <div className="mt-3 text-xs text-content-muted">
                  <p className="font-bold text-surface-dark">Escanea con tu app bancaria (BCP, Banco Unión, BNB)</p>
                  <p className="text-[11px]">Beneficiario: InmoVAX S.R.L. • Cuenta Corriente</p>
                </div>
              </div>

              {/* Sección de Carga de Comprobante */}
              <div className="text-left space-y-2">
                <label className="block text-xs font-bold text-surface-dark">
                  Carga el comprobante de transferencia bancaria:
                </label>
                
                <div className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex items-center justify-between gap-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="text-xs text-content-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-dark file:text-white hover:file:bg-black cursor-pointer"
                  />
                  {receiptPreview && (
                    <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5" /> Adjuntado
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('compare')}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-xs text-content-muted hover:text-surface-dark hover:bg-gray-50 transition-all cursor-pointer"
                >
                  &larr; Cambiar de Plan
                </button>
                <button
                  type="button"
                  disabled={uploadingReceipt}
                  onClick={handleConfirmReceipt}
                  className="flex-2 py-3 bg-[#EA580C] hover:bg-[#D44A05] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {uploadingReceipt ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Enviando comprobante...
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
          {/* PASO 3: ÉXITO Y CONFIRMACIÓN                                   */}
          {/* ============================================================== */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-150">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-3" />
              </div>
              <h3 className="text-xl font-black text-surface-dark">
                {isVipUser ? '¡Inmueble Activado Exitosamente!' : '¡Comprobante Recibido con Éxito!'}
              </h3>
              <p className="text-xs text-content-muted leading-relaxed">
                {isVipUser ? (
                  'Tu cuenta VIP cuenta con publicaciones gratuitas garantizadas. Tu propiedad se encuentra activa en el catálogo.'
                ) : (
                  `Hemos registrado tu orden para el plan ${activePlanData.name}. El equipo administrativo verificará el comprobante bancario en breve para publicar tu inmueble.`
                )}
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
                  className="w-full py-3 bg-surface-dark hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {ctaText || (isVipUser ? 'Continuar a Publicar Inmueble →' : 'Comprobante Enviado - Continuar a Publicar →')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
