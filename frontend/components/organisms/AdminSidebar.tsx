"use client";
import React from 'react';
import Link from 'next/link';

export type AdminTab = 'resumen' | 'propiedades' | 'legal' | 'asesores' | 'transacciones' | 'configuracion';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  pendingLegalCount?: number;
  propertiesCount?: number;
}

export const AdminSidebar = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  pendingLegalCount = 3,
  propertiesCount = 14
}: AdminSidebarProps) => {
  const menuItems: { id: AdminTab; label: string; icon: string; badge?: string; badgeColor?: string }[] = [
    { id: 'resumen', label: 'Dashboard & Métricas', icon: '📊' },
    { id: 'propiedades', label: 'Gestión de Inmuebles', icon: '🏠', badge: String(propertiesCount) },
    { id: 'legal', label: 'Revisión Legal / Folio Real', icon: '⚖️', badge: String(pendingLegalCount), badgeColor: 'bg-amber-500' },
    { id: 'asesores', label: 'Asesores & Citas', icon: '👥', badge: '3' },
    { id: 'transacciones', label: 'Transacciones & Anticréticos', icon: '💼' },
    { id: 'configuracion', label: 'Configuración del Portal', icon: '⚙️' },
  ];

  return (
    <>
      {/* OVERLAY MÓVIL */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-surface-dark text-content-inverse flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* PARTE SUPERIOR */}
        <div>
          {/* LOGO & BRAND */}
          <div className="p-6 border-b border-gray-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                <span className="text-accent">INMO</span>VAX
              </span>
              <span className="text-[10px] uppercase font-extrabold bg-primary/30 text-blue-300 border border-primary/40 px-2 py-0.5 rounded-full tracking-wider">
                ADMIN
              </span>
            </Link>
            <button 
              type="button"
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* INDICADOR DE ESTADO DEL SISTEMA */}
          <div className="mx-4 my-4 p-3.5 bg-blue-950/60 border border-blue-800/60 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-blue-100">Portal Operativo Activo</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Centro de supervisión y gestión centralizada.
            </p>
          </div>

          {/* MENÚ DE NAVEGACIÓN */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Módulos del Sistema
            </div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-primary/80'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* PARTE INFERIOR (PERFIL Y ACCIONES) */}
        <div className="p-4 border-t border-gray-800/80 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-white text-sm shadow">
              DC
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Daniel Catari</div>
              <div className="text-[11px] text-gray-400 truncate">Super Administrador</div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-xs font-bold text-white rounded-xl transition-all border border-white/10"
          >
            <span>🌐</span> Ver Portal Web
          </Link>

          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
          >
            <span>🚪</span> Cerrar Sesión
          </Link>
        </div>
      </aside>
    </>
  );
};
