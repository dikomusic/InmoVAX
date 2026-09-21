"use client";
import React from 'react';
import { StatCard } from '../atoms/StatCard';
import { SellerTab } from './SellerSidebar';
import { SellerOffer } from '../molecules/SellerOfferItem';
import { SellerProperty } from '../molecules/SellerPropertyCard';
import { SellerNotifications, SellerNotificationItem } from '../molecules/SellerNotifications';
import { SellerStatusBadge } from '../atoms/SellerStatusBadge';
import { Building2, Eye, CircleDollarSign, Scale, Trash2, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

interface SellerOverviewSectionProps {
  properties: SellerProperty[];
  offers: SellerOffer[];
  notifications?: SellerNotificationItem[];
  onNavigateTab: (tab: SellerTab) => void;
  onDeleteProperty?: (id: string) => void;
  onRequestDeleteProperty?: (property: SellerProperty) => void;
  onOpenPublishModal?: () => void;
  userName?: string;
}

export const SellerOverviewSection = ({
  properties,
  offers,
  notifications,
  onNavigateTab,
  onDeleteProperty,
  onRequestDeleteProperty,
  onOpenPublishModal,
  userName = 'Gonzalo Benítez'
}: SellerOverviewSectionProps) => {
  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const pendingOffers = offers.filter(o => o.status === 'Pendiente');

  const handleDelete = (property: SellerProperty) => {
    if (onRequestDeleteProperty) {
      onRequestDeleteProperty(property);
    } else if (onDeleteProperty) {
      onDeleteProperty(property.id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* BANNER PROPIETARIO */}
      <div className="bg-gradient-to-br from-[#081229] via-[#0D1F47] to-[#081229] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-gray-800">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal Oficial del Propietario InmoVAX
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Hola, <span className="text-accent">{userName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
            Controla las visualizaciones, citas presenciales y propuestas de anticrético, venta o alquiler de tus inmuebles en La Paz con respaldo legal en Derechos Reales.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onOpenPublishModal && (
              <button
                type="button"
                onClick={onOpenPublishModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Publicar Nuevo Inmueble</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateTab('inmuebles')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <span>Ver mis publicaciones ({properties.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent pointer-events-none" />
      </div>

      <SellerNotifications
        pendingOffersCount={pendingOffers.length}
        notifications={notifications}
      />

      {/* KPIS DEL PROPIETARIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Mis Inmuebles Activos"
          value={properties.length}
          subtitle="En catálogo con Folio Real"
          icon={<Building2 className="h-5 w-5" />}
          trend="100% Verificados"
          trendType="positive"
          bgColor="bg-blue-50 text-primary"
        />

        <StatCard
          title="Visualizaciones Totales"
          value={totalViews}
          subtitle="Interesados en tus propiedades"
          icon={<Eye className="h-5 w-5" />}
          trend="+34% este mes"
          trendType="positive"
          bgColor="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Ofertas Recibidas"
          value={offers.length}
          subtitle={`${pendingOffers.length} ofertas por responder`}
          icon={<CircleDollarSign className="h-5 w-5" />}
          trend={pendingOffers.length > 0 ? "Nuevas Propuestas" : "Al día"}
          trendType={pendingOffers.length > 0 ? "urgent" : "positive"}
          bgColor="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Seguridad Jurídica"
          value="100%"
          subtitle="Respaldo notarial InmoVax"
          icon={<Scale className="h-5 w-5" />}
          trend="Folios Auditados"
          trendType="positive"
          bgColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* SECCIONES RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INMUEBLES RECIENTES */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-surface-dark">Estado de mis Publicaciones</h3>
              <p className="text-xs text-content-muted">Monitoreo comercial directo y opciones de gestión</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('inmuebles')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Ver todas ({properties.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <Building2 className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-600">No tienes inmuebles publicados actualmente.</p>
              {onOpenPublishModal && (
                <button
                  type="button"
                  onClick={onOpenPublishModal}
                  className="px-4 py-2 bg-primary text-white text-xs font-extrabold rounded-xl"
                >
                  + Publicar mi primer inmueble
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {properties.slice(0, 4).map((prop) => (
                <div key={prop.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {prop.image && prop.image.trim() !== '' ? (
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-gray-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-surface-dark truncate">{prop.title}</h4>
                      <p className="text-xs text-content-muted">{prop.zone} • <strong className="text-gray-800">{prop.price}</strong></p>
                      <span className="text-[10px] text-primary font-bold">Folio: {prop.folioReal}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <div className="text-right text-xs">
                      <span className="font-black text-surface-dark block">{prop.views} vistas</span>
                      <span className="text-[11px] text-emerald-600 font-bold">{prop.inquiries} consultas</span>
                    </div>
                    <SellerStatusBadge status={prop.status} size="sm" />
                    {(onRequestDeleteProperty || onDeleteProperty) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(prop)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 transition-colors shrink-0 cursor-pointer"
                        title="Eliminar publicación"
                        aria-label={`Eliminar publicación ${prop.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BANDEJA DE OFERTAS RECIENTES */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-surface-dark">Propuestas Recientes</h3>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {pendingOffers.length} Pendientes
              </span>
            </div>

            <div className="space-y-3">
              {offers.slice(0, 3).map((offer) => (
                <div key={offer.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-surface-dark truncate">{offer.buyerName}</span>
                    <span className="font-black text-emerald-600">{offer.offerAmount}</span>
                  </div>
                  <p className="text-[11px] text-content-muted truncate">{offer.propertyTitle}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
                    <span>{offer.date}</span>
                    <span className="font-bold text-primary">{offer.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('consultas')}
            className="w-full mt-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer text-center active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Revisar Ofertas Completas</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
