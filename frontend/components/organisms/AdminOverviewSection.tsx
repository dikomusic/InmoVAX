"use client";
import React from 'react';
import { StatCard } from '../atoms/StatCard';
import { AdminTab } from './AdminSidebar';
import { 
  Building2, CreditCard, CheckCircle2, Clock, 
  ArrowRight, ShieldCheck, DollarSign, Sparkles 
} from 'lucide-react';

interface AdminOverviewSectionProps {
  propertiesCount: number;
  publishedCount: number;
  pendingPaymentsCount: number;
  approvedPaymentsCount: number;
  revenueTotal: number;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverviewSection = ({
  propertiesCount,
  publishedCount,
  pendingPaymentsCount,
  approvedPaymentsCount,
  revenueTotal,
  onNavigateTab
}: AdminOverviewSectionProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* BANNER DE BIENVENIDA */}
      <div className="bg-gradient-to-r from-surface-dark via-[#0C1A4A] to-surface-dark rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-gray-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-black uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-accent" /> Panel Central InmoVax
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Control Operativo de la <span className="text-accent">Plataforma Web</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Supervisa en tiempo real las publicaciones de inmuebles, comprobantes de pago QR y la actividad de los usuarios.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* TARJETAS KPI ESENCIALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Inmuebles en Catálogo"
          value={propertiesCount}
          subtitle="Inventario total registrado"
          icon={<Building2 className="h-5 w-5" />}
          trend={`${publishedCount} activos en web`}
          trendType="positive"
          bgColor="bg-blue-50 text-primary"
        />

        <StatCard
          title="Comprobantes por Aprobar"
          value={pendingPaymentsCount}
          subtitle="Pagos QR pendientes de revisión"
          icon={<Clock className="h-5 w-5" />}
          trend={pendingPaymentsCount > 0 ? "Requiere acción inmediata" : "Al día"}
          trendType={pendingPaymentsCount > 0 ? "urgent" : "positive"}
          bgColor={pendingPaymentsCount > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}
        />

        <StatCard
          title="Publicaciones Aprobadas"
          value={approvedPaymentsCount}
          subtitle="Planes confirmados por QR"
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend="Publicaciones validadas"
          trendType="positive"
          bgColor="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Ingresos Recaudados"
          value={`$us ${revenueTotal.toLocaleString()}`}
          subtitle="Total por venta de planes de publicación"
          icon={<CreditCard className="h-5 w-5" />}
          trend="Ingreso directo a cuenta"
          trendType="neutral"
          bgColor="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ACCIONES RÁPIDAS Y ENLACES DIRECTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MÓDULO 1: GESTIÓN DE INMUEBLES */}
        <div 
          onClick={() => onNavigateTab('propiedades')}
          className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-surface-dark mb-1 group-hover:text-primary transition-colors">
              Gestión de Inmuebles
            </h3>
            <p className="text-xs text-content-muted leading-relaxed mb-4">
              Visualiza el inventario completo, publica o pausa inmuebles, edita precios y zonas, o elimina propiedades obsoletas.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-bold text-primary">
            <span>Administrar Catálogo ({propertiesCount} propiedades)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* MÓDULO 2: PLANES Y PAGOS QR */}
        <div 
          onClick={() => onNavigateTab('pagos')}
          className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-amber-100 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-surface-dark mb-1 group-hover:text-amber-700 transition-colors">
              Planes y Pagos QR
            </h3>
            <p className="text-xs text-content-muted leading-relaxed mb-4">
              Revisa los comprobantes bancarios subidos por los propietarios, aprueba órdenes para publicar automáticamente y configura los precios de los planes.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-bold text-amber-700">
            <span>
              {pendingPaymentsCount > 0 
                ? `Revisar ${pendingPaymentsCount} pago(s) pendiente(s)` 
                : 'Ver historial de pagos y configuración'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
};
