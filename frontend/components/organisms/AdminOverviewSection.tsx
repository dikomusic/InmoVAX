"use client";
import React from 'react';
import { StatCard } from '../atoms/StatCard';
import { AdminTab } from './AdminSidebar';
import { Building2, Scale, CircleDollarSign, Users } from 'lucide-react';

interface AdminOverviewSectionProps {
  propertiesCount: number;
  pendingLegalCount: number;
  advisorsCount: number;
  transactionsVolume: string;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverviewSection = ({
  propertiesCount,
  pendingLegalCount,
  advisorsCount,
  transactionsVolume,
  onNavigateTab
}: AdminOverviewSectionProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* BANNER DE BIENVENIDA */}
      <div className="bg-gradient-to-r from-surface-dark via-[#0C1A4A] to-surface-dark rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-gray-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-black uppercase tracking-wider mb-3">
            <span>🛡️</span> Centro de Operaciones Inmobiliarias
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Panel Central, <span className="text-accent">Daniel Catari</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Supervisión integral del mercado inmobiliario, validación notarial de Folio Real y gestión de contratos en La Paz, Bolivia.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Inmuebles en Catálogo"
          value={propertiesCount}
          subtitle="14 en venta • 8 anticréticos • 6 alquiler"
          icon={<Building2 className="h-5 w-5" />}
          trend="+12% este mes"
          trendType="positive"
          bgColor="bg-blue-50 text-primary"
        />

        <StatCard
          title="Revisión Folio Real"
          value={pendingLegalCount}
          subtitle="Documentos alodiales pendientes"
          icon={<Scale className="h-5 w-5" />}
          trend={pendingLegalCount > 0 ? "Prioridad Alta" : "Al día"}
          trendType={pendingLegalCount > 0 ? "urgent" : "positive"}
          bgColor="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Volumen Transaccional"
          value={transactionsVolume}
          subtitle="Capital en anticréticos gestionados"
          icon={<CircleDollarSign className="h-5 w-5" />}
          trend="+18.4%"
          trendType="positive"
          bgColor="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Equipo de Asesores"
          value={advisorsCount}
          subtitle="Calificación promedio: 4.86 / 5"
          icon={<Users className="h-5 w-5" />}
          trend="100% operativos"
          trendType="neutral"
          bgColor="bg-purple-50 text-purple-600"
        />
      </div>

      {/* GRÁFICOS Y ESTADÍSTICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DEMANDA POR ZONAS */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-base text-surface-dark">Demanda Inmobiliaria por Zona (La Paz)</h3>
              <p className="text-xs text-content-muted">Consultas y transacciones registradas en los últimos 30 días</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
              Estadísticas Reales
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-content-main">Sopocachi (Anticréticos y Departamentos)</span>
                <span className="text-primary font-black">42% (128 solicitudes)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-content-main">Calacoto & San Miguel (Ventas de Casas y Penthouses)</span>
                <span className="text-accent font-black">28% (84 solicitudes)</span>
              </div>
              <div className="w-full bg-accent h-3 rounded-full" style={{ width: '28%' }}></div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-content-main">Achumani & Los Pinos (Casas familiares)</span>
                <span className="text-emerald-500 font-black">18% (55 solicitudes)</span>
              </div>
              <div className="w-full bg-emerald-500 h-3 rounded-full" style={{ width: '18%' }}></div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-content-main">Centro & San Jorge (Oficinas y Monoambientes)</span>
                <span className="text-purple-500 font-black">12% (36 solicitudes)</span>
              </div>
              <div className="w-full bg-purple-500 h-3 rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-content-muted font-medium">
            <span>💡 InmoVax Intelligence: El 65% del tráfico busca anticréticos con respaldo de Folio Real.</span>
            <button 
              type="button"
              onClick={() => onNavigateTab('propiedades')} 
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              Ver catálogo completo →
            </button>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS Y CITAS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-surface-dark">Módulos Directos</h3>
            </div>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onNavigateTab('legal')}
                className="w-full p-3.5 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <span>⚖️</span> Auditoría de Folios Reales
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">Validar certificados alodiales pendientes</p>
                </div>
                <span className="text-xs font-bold text-amber-800">→</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('transacciones')}
                className="w-full p-3.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <span>💼</span> Libro de Transacciones
                  </h4>
                  <p className="text-[11px] text-blue-800 mt-0.5">Registro notarial y liquidación de comisiones</p>
                </div>
                <span className="text-xs font-bold text-primary">→</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('asesores')}
                className="w-full p-3.5 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                    <span>👥</span> Asignación de Asesores
                  </h4>
                  <p className="text-[11px] text-purple-800 mt-0.5">Coordinar visitas y cobertura de zonas</p>
                </div>
                <span className="text-xs font-bold text-purple-800">→</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => onNavigateTab('configuracion')}
              className="text-xs font-bold text-content-muted hover:text-primary transition-colors cursor-pointer"
            >
              ⚙️ Ajustar parámetros del portal
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
