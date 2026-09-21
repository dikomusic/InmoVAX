"use client";
import React from 'react';

interface SellerPortalTemplateProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  notificationToast?: React.ReactNode;
  modals?: React.ReactNode;
}

export const SellerPortalTemplate = ({
  sidebar,
  header,
  children,
  notificationToast,
  modals
}: SellerPortalTemplateProps) => {
  return (
    <div className="flex min-h-screen bg-slate-50/70 text-surface-dark selection:bg-primary selection:text-white font-sans antialiased">
      {/* SIDEBAR ORGANISM (FIJO EN ESCRITORIO >= lg, CAJÓN DESLIZANTE EN MÓVIL < lg) */}
      {sidebar}

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* HEADER EXCLUSIVAMENTE MÓVIL (EN ESCRITORIO SE OCULTA PARA EVITAR DUPLICIDAD) */}
        {header}

        {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* TOAST FLOTANTE */}
      {notificationToast}

      {/* MODALES DEL PORTAL */}
      {modals}
    </div>
  );
};
