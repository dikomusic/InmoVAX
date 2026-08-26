"use client";
import React, { useState } from 'react';

interface SellerHeaderProps {
  onToggleSidebar: () => void;
  onPublishClick: () => void;
  pendingOffersCount?: number;
}

export const SellerHeader = ({
  onToggleSidebar,
  onPublishClick,
  pendingOffersCount = 2
}: SellerHeaderProps) => {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-18 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
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
            Panel de Propietario / Vendedor
          </h1>
          <p className="text-xs text-content-muted hidden sm:block font-medium">
            Arq. Gonzalo Benítez • Inmuebles en La Paz, Bolivia
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* NOTIFICACIONES */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title="Mis notificaciones"
          >
            <span>🔔</span>
            {pendingOffersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="font-extrabold text-sm text-surface-dark">Notificaciones de tus Inmuebles</h4>
                <span 
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-bold text-primary cursor-pointer hover:underline"
                >
                  Cerrar
                </span>
              </div>
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                <div className="py-3 flex items-start gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Nueva oferta recibida ($us 42,000)</p>
                    <p className="text-[11px] text-gray-500">Depto Sopocachi - Dr. Marcelo Zeballos</p>
                    <span className="text-[10px] text-gray-400">Hace 15 min</span>
                  </div>
                </div>
                <div className="py-3 flex items-start gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Visita guiada agendada</p>
                    <p className="text-[11px] text-gray-500">Mañana 15:00 con Asesor Carlos Vega</p>
                    <span className="text-[10px] text-gray-400">Hace 1 hora</span>
                  </div>
                </div>
                <div className="py-3 flex items-start gap-3">
                  <span className="text-xl">⚖️</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Folio Real Validado</p>
                    <p className="text-[11px] text-gray-500">Certificado Alodial aprobado por InmoVax Legal</p>
                    <span className="text-[10px] text-gray-400">Ayer</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN PUBLICAR INMUEBLE */}
        <button
          type="button"
          onClick={onPublishClick}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>+</span> Publicar Inmueble
        </button>
      </div>
    </header>
  );
};
