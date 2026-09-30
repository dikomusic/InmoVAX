"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';
import { readStoredSession, saveStoredSession } from '@/lib/frontendStore';
import { addManagedProperty, ManagedProperty } from '@/lib/propertiesStore';
import { PublicationPlansModal } from '@/components/organisms/PublicationPlansModal';
import { linkPropertyToOrder, PaymentOrderResponse } from '@/lib/paymentsApi';
import { ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function PublicarPage() {
  const router = useRouter();
  const [createdProp, setCreatedProp] = React.useState<ManagedProperty | null>(null);
  
  // Paso 1: Orden de pago y plan confirmado
  const [confirmedOrder, setConfirmedOrder] = useState<PaymentOrderResponse['order'] | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(true);

  // Sesión del usuario
  const session = readStoredSession();
  const isVip = session?.email?.toLowerCase().trim() === 'vip@inmovax.com';

  const handlePublished = async (data: Parameters<NonNullable<React.ComponentProps<typeof PublishPropertyForm>['onSuccessCallback']>>[0]) => {
    let currentSession = readStoredSession();
    const isVipUser = currentSession?.email?.toLowerCase().trim() === 'vip@inmovax.com';
    if (!currentSession || !currentSession.email) {
      currentSession = {
        name: 'Usuario InmoVAX',
        email: 'usuario@inmovax.com',
        hasPublishedProperties: isVipUser,
        role: isVipUser ? 'vendedor' : 'comprador'
      };
      saveStoredSession(currentSession);
    } else {
      saveStoredSession({ 
        ...currentSession, 
        hasPublishedProperties: isVipUser, 
        role: isVipUser ? 'vendedor' : (currentSession.role || 'comprador') 
      });
    }

    const newProp = await addManagedProperty({
      title: `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
      zone: data.zona,
      address: data.calle || data.zona,
      description: data.descripcion || `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
      type: (data.operacion === 'anticretico' ? 'Anticrético' : data.operacion.charAt(0).toUpperCase() + data.operacion.slice(1)) as ManagedProperty['type'],
      price: `${data.moneda === 'usd' ? '$us' : 'Bs.'} ${data.precio}`,
      status: currentSession.email?.toLowerCase().trim() === 'vip@inmovax.com' ? 'Activo' : 'En Validación Legal',
      folioReal: data.folioReal,
      assignedAdvisor: 'Lic. Carlos Vega',
      image: data.imagenUrl || '',
      gallery: data.galeria || [],
      authorEmail: currentSession.email,
      authorName: currentSession.name,
      habitaciones: Number(data.habitaciones) || 3,
      banos: Number(data.banos) || 2,
      metros: Number(data.supConstruida) || 120,
      landAreaSqm: data.supTerreno ? Number(data.supTerreno) : null,
      estacionamientos: Number(data.parqueos) || 0,
      parkingSpots: Number(data.parqueos) || 0,
      amenidades: data.amenidades || [],
      amenities: data.amenidades || [],
      category: data.tipoInmueble ? (data.tipoInmueble.charAt(0).toUpperCase() + data.tipoInmueble.slice(1)) : 'Departamento',
      isNegotiable: data.negociable ?? false,
      latitude: data.coordenadas?.lat ?? null,
      longitude: data.coordenadas?.lng ?? null
    });

    // Vincular orden de pago registrada con el inmueble creado en la base de datos
    if (confirmedOrder && newProp) {
      await linkPropertyToOrder(confirmedOrder.id, newProp.id, newProp.title);
    }

    setCreatedProp(newProp);
    router.push(`/propiedad/${newProp.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-light py-12 px-4 sm:px-6">
      
      {/* CABECERA */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          {confirmedOrder ? 'Paso 2 de 2: Información del Inmueble' : 'Paso 1 de 2: Selección de Plan y Pago QR'}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-main mb-3">
          Publica tu inmueble con <span className="text-accent">InmoVAX</span>
        </h1>
        <p className="text-sm sm:text-base text-content-muted font-medium max-w-xl mx-auto">
          {confirmedOrder 
            ? 'Ingresa los datos, folio real y fotos de tu propiedad para enviar a validación legal.'
            : 'Primero elige el plan de publicación y realiza el pago con QR. Una vez confirmado, se habilitará el formulario de publicación.'}
        </p>
      </div>

      {/* BANNER DE PLAN CONFIRMADO (SI YA ENVIÓ EL PAGO) */}
      {confirmedOrder && (
        <div className="max-w-3xl mx-auto mb-6 bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Plan {confirmedOrder.planName}
                </span>
                <span className="text-xs font-bold text-content-muted">
                  {confirmedOrder.amount > 0 ? `U$S ${confirmedOrder.amount}` : '100% Exento VIP'}
                </span>
              </div>
              <p className="text-xs font-medium text-surface-dark mt-1">
                Comprobante registrado • <span className="font-mono text-content-muted text-[11px]">{confirmedOrder.id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPlanModalOpen(true)}
            className="text-xs font-bold text-accent hover:underline cursor-pointer shrink-0"
          >
            Cambiar Plan o Comprobante
          </button>
        </div>
      )}

      {/* SI NO HA CONFIRMADO EL PLAN: BANNER INFORMATIVO PARA ABRIR EL MODAL */}
      {!confirmedOrder && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-surface-dark mb-1">
              Planes de Publicación y Pagos QR
            </h3>
            <p className="text-xs text-content-muted max-w-md mx-auto leading-relaxed">
              En InmoVAX cobramos una tarifa única y transparente por publicación (Básico, Oro o Diamante) para garantizar igualdad de condiciones a todos los propietarios.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(true)}
              className="px-6 py-3.5 bg-accent hover:bg-accent/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
            >
              Ver Planes y Realizar Pago <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FORMULARIO DE PUBLICACIÓN: SE MUESTRA RECIÉN TRAS CONFIRMAR EL PLAN / PAGO */}
      {confirmedOrder && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <PublishPropertyForm onSuccessCallback={handlePublished} />
        </div>
      )}

      {/* PANTALLA FLOTANTE / MODAL DE PLANES Y PAGO QR */}
      <PublicationPlansModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        propertyId={confirmedOrder?.propertyId || 'draft-prop'}
        propertyTitle={confirmedOrder?.propertyTitle || 'Nueva Publicación InmoVAX'}
        onPlanConfirmed={(order) => {
          setConfirmedOrder(order);
          setIsPlanModalOpen(false);
        }}
        ctaText="Comprobante Enviado - Llenar Formulario de Inmueble →"
      />
    </div>
  );
}