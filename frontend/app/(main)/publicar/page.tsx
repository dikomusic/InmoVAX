"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublishPropertyForm } from '@/components/organisms/PublishPropertyForm';
import { readStoredSession, saveStoredSession } from '@/lib/frontendStore';
import { addManagedProperty, ManagedProperty } from '@/lib/propertiesStore';
import { CheckCircle2, Sparkles, Home, Eye, PlusCircle, TrendingUp, DollarSign } from 'lucide-react';

export default function PublicarPage() {
  const router = useRouter();
  const [createdProp, setCreatedProp] = useState<ManagedProperty | null>(null);

  const handlePublished = async (data: Parameters<NonNullable<React.ComponentProps<typeof PublishPropertyForm>['onSuccessCallback']>>[0]) => {
    let currentSession = readStoredSession();
    if (!currentSession || !currentSession.email) {
      currentSession = {
        name: 'Propietario InmoVAX',
        email: 'propietario@inmovax.com',
        hasPublishedProperties: true,
        role: 'vendedor'
      };
      saveStoredSession(currentSession);
    } else {
      saveStoredSession({ 
        ...currentSession, 
        hasPublishedProperties: true, 
        role: currentSession.role === 'admin' ? 'admin' : 'vendedor' 
      });
    }

    const newProp = await addManagedProperty({
      title: `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
      zone: data.zona,
      address: data.calle || data.zona,
      description: data.descripcion || `${data.tipoInmueble.toUpperCase()} en ${data.zona}`,
      type: (data.operacion === 'anticretico' ? 'Anticrético' : data.operacion.charAt(0).toUpperCase() + data.operacion.slice(1)) as ManagedProperty['type'],
      price: `${data.moneda === 'usd' ? '$us' : 'Bs.'} ${data.precio}`,
      status: 'Activo', // Publicación inmediata en Plan Gratuito
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

    setCreatedProp(newProp);
  };

  return (
    <div className="min-h-screen bg-surface-light py-10 px-4 sm:px-6">
      
      {/* CABECERA PRINCIPAL */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Publicación 100% Gratuita • Cero Comisiones
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-main mb-3">
          Publica tu inmueble con <span className="text-accent">InmoVAX</span>
        </h1>
        <p className="text-sm sm:text-base text-content-muted font-medium max-w-xl mx-auto">
          Completa los datos de tu propiedad y publícala gratis al instante. Sin intermediarios, sin comisiones ocultas y con control total desde tu panel.
        </p>
      </div>

      {/* PANTALLA DE ÉXITO FINAL (MODELO FREEMIUM) */}
      {createdProp ? (
        <div className="max-w-2xl mx-auto bg-white border border-emerald-100 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Plan Gratuito Activo • En Línea
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-content-main">
              ¡Felicidades, tu inmueble está publicado!
            </h2>
            <p className="text-sm text-content-muted max-w-lg mx-auto">
              Tu propiedad en <strong>{createdProp.zone}</strong> ya se encuentra activa y visible públicamente para miles de compradores e inquilinos en Bolivia.
            </p>
          </div>

          {/* BANNER MOTIVACIONAL DE AHORRO CERO COMISIONES */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 border border-emerald-200 rounded-2xl text-left flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-900">
                Ahorro Estimado: ~$4,000 USD en Comisiones
              </h4>
              <p className="text-xs text-emerald-800/90 font-medium mt-0.5 leading-relaxed">
                Al publicar directamente en InmoVAX sin intermediarios tradicionales, te estás ahorrando el 3% al 7% de tu patrimonio que se llevan las inmobiliarias.
              </p>
            </div>
          </div>

          {/* TARJETA RESUMEN DEL INMUEBLE */}
          <div className="bg-surface-light rounded-2xl p-4 sm:p-5 border border-gray-100 text-left space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                  {createdProp.type} • {createdProp.category || 'Inmueble'}
                </span>
                <h4 className="font-extrabold text-base text-content-main mt-0.5">
                  {createdProp.title}
                </h4>
                <p className="text-xs text-content-muted mt-0.5">
                  {createdProp.zone}
                </p>
              </div>
              <span className="text-lg font-black text-content-main shrink-0">
                {createdProp.price}
              </span>
            </div>

            <div className="border-t border-gray-200/60 pt-3 flex flex-wrap items-center justify-between text-xs text-content-muted">
              <span>Folio Real: <strong className="text-content-main font-mono">{createdProp.folioReal || 'No provisto'}</strong></span>
              <span>Estado: <strong className="text-emerald-700 font-bold">Activo y Visible</strong></span>
            </div>
          </div>

          {/* MENSAJE DE UPSELL / VENTA ADICIONAL */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-left flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">¿Quieres vender o alquilar más rápido y seguro?</span> Desde tu panel de control puedes destacar tu anuncio en primeros lugares o solicitar la auditoría legal con Folio Real para obtener el sello verde de verificación.
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/vendedor?tab=inmuebles')}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95"
            >
              <Home className="w-4 h-4" /> Ir a Mis Inmuebles en el Portal
            </button>
            <Link
              href={`/propiedad/${createdProp.id}`}
              className="w-full sm:w-auto px-5 py-3.5 bg-surface-light hover:bg-gray-100 text-content-main font-bold text-xs uppercase tracking-wider rounded-xl border border-gray-200 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Ver Anuncio Publicado
            </Link>
            <button
              type="button"
              onClick={() => setCreatedProp(null)}
              className="w-full sm:w-auto px-4 py-3.5 text-content-muted hover:text-content-main font-bold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Publicar Otro
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <PublishPropertyForm onSuccessCallback={handlePublished} />
        </div>
      )}
    </div>
  );
}