"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onQuickPublish?: () => void;
}

export const AdminHeader = ({
  onToggleSidebar,
  onQuickPublish
}: AdminHeaderProps) => {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-18 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* BOTÓN MÓVIL Y TÍTULO */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-gray-100 text-content-main hover:bg-gray-200 cursor-pointer"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-surface-dark flex items-center gap-2">
            Centro de Control Inmobiliario
          </h1>
          <p className="text-xs text-content-muted hidden sm:block font-medium">
            Sede Central La Paz • InmoVax Core
          </p>
        </div>
      </div>

      {/* ACCIONES DEL HEADER */}
      <div className="flex items-center gap-3">
        {/* CENTRO DE NOTIFICACIONES */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title="Notificaciones operativas"
          >
            <span>🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="font-extrabold text-sm text-surface-dark">Alertas Notariales y Operativas</h4>
                <span 
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-bold text-primary cursor-pointer hover:underline"
                >
                  Cerrar
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                <div className="py-3 flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Folio Real requiere verificación</p>
                    <p className="text-[11px] text-gray-500">Anticrético en Sopocachi ($us 45,000)</p>
                    <span className="text-[10px] text-gray-400">Hace 12 min</span>
                  </div>
                </div>
                <div className="py-3 flex items-start gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Nueva Cita de Visita Confirmada</p>
                    <p className="text-[11px] text-gray-500">Casa en Achumani con Asesor Carlos Vega</p>
                    <span className="text-[10px] text-gray-400">Hace 45 min</span>
                  </div>
                </div>
                <div className="py-3 flex items-start gap-3">
                  <span className="text-xl">💼</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Contrato Notariado Registrado</p>
                    <p className="text-[11px] text-gray-500">Anticrético Calacoto (Comisión $us 1,500)</p>
                    <span className="text-[10px] text-gray-400">Hace 3 horas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCIÓN RÁPIDA */}
        {onQuickPublish ? (
          <button
            type="button"
            onClick={onQuickPublish}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>+</span> Publicar Inmueble
          </button>
        ) : (
          <Link
            href="/publicar"
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <span>+</span> Publicar Inmueble
          </Link>
        )}
      </div>
    </header>
  );
};
