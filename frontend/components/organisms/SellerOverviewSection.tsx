"use client";
import React from 'react';
import { StatCard } from '../atoms/StatCard';
import { SellerTab } from './SellerSidebar';
import { SellerOffer } from '../molecules/SellerOfferItem';
import { SellerProperty } from '../molecules/SellerPropertyCard';

interface SellerOverviewSectionProps {
  properties: SellerProperty[];
  offers: SellerOffer[];
  onNavigateTab: (tab: SellerTab) => void;
}

export const SellerOverviewSection = ({
  properties,
  offers,
  onNavigateTab
}: SellerOverviewSectionProps) => {
  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const pendingOffers = offers.filter(o => o.status === 'Pendiente');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* BANNER PROPIETARIO */}
      <div className="bg-gradient-to-r from-[#081229] via-[#0E204A] to-[#081229] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-gray-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
            <span>🏠</span> Portal del Propietario InmoVax
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Hola, <span className="text-accent">Gonzalo Benítez</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Controla las visualizaciones, citas de visita presencial y ofertas de compra o anticrético de tus inmuebles en La Paz.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* KPIS DEL PROPIETARIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Mis Inmuebles Activos"
          value={properties.length}
          subtitle="En catálogo con Folio Real"
          icon="🏠"
          trend="100% Verificados"
          trendType="positive"
          bgColor="bg-blue-50 text-primary"
        />

        <StatCard
          title="Visualizaciones Totales"
          value={totalViews}
          subtitle="Interesados en tus propiedades"
          icon="👁️"
          trend="+34% esta semana"
          trendType="positive"
          bgColor="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Ofertas Recibidas"
          value={offers.length}
          subtitle={`${pendingOffers.length} ofertas por responder`}
          icon="💰"
          trend={pendingOffers.length > 0 ? "Nuevas Propuestas" : "Al día"}
          trendType={pendingOffers.length > 0 ? "urgent" : "positive"}
          bgColor="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Seguridad Jurídica"
          value="100%"
          subtitle="Respaldo notarial InmoVax"
          icon="⚖️"
          trend="Folios Auditados"
          trendType="positive"
          bgColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* SECCIONES RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INMUEBLE DESTACADO */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-surface-dark">Estado de mis Publicaciones</h3>
              <p className="text-xs text-content-muted">Monitoreo del desempeño comercial de tus inmuebles</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('inmuebles')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Ver todas ({properties.length}) →
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {properties.slice(0, 3).map((prop) => (
              <div key={prop.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={prop.image} alt={prop.title} className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-surface-dark">{prop.title}</h4>
                    <p className="text-xs text-content-muted">{prop.zone} • {prop.price}</p>
                    <span className="text-[10px] text-primary font-bold">Folio: {prop.folioReal}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="text-xs">
                    <span className="font-black text-surface-dark block">{prop.views} vistas</span>
                    <span className="text-[11px] text-emerald-600 font-bold">{prop.inquiries} consultas</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    ● {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BANDEJA DE OFERTAS URGENTES */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-surface-dark">Propuestas Recientes</h3>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {pendingOffers.length} Pendientes
              </span>
            </div>

            <div className="space-y-3">
              {offers.slice(0, 2).map((offer) => (
                <div key={offer.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-surface-dark truncate">{offer.buyerName}</span>
                    <span className="font-black text-emerald-600">{offer.offerAmount}</span>
                  </div>
                  <p className="text-[11px] text-content-muted truncate">{offer.propertyTitle}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('ofertas')}
            className="w-full mt-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer text-center active:scale-95"
          >
            Revisar Ofertas Completas →
          </button>
        </div>

      </div>

    </div>
  );
};
