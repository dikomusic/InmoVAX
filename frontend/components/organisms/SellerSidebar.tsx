"use client";
import React from 'react';
import Link from 'next/link';

export type SellerTab = 'resumen' | 'inmuebles' | 'publicar' | 'ofertas' | 'citas' | 'documentos';

interface SellerSidebarProps {
  activeTab: SellerTab;
  onSelectTab: (tab: SellerTab) => void;
  isOpen: boolean;
  onClose: () => void;
  myPropertiesCount: number;
  offersCount: number;
  appointmentsCount: number;
}

export const SellerSidebar = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  myPropertiesCount,
  offersCount,
  appointmentsCount
}: SellerSidebarProps) => {
  const menuItems: { id: SellerTab; label: string; icon: string; badge?: string; badgeColor?: string }[] = [
    { id: 'resumen', label: 'Mi Panel General', icon: '📊' },
    { id: 'inmuebles', label: 'Mis Inmuebles Publicados', icon: '🏠', badge: String(myPropertiesCount) },
    { id: 'publicar', label: 'Publicar Nuevo Inmueble', icon: '➕' },
    { id: 'ofertas', label: 'Ofertas & Consultas', icon: '💬', badge: String(offersCount), badgeColor: 'bg-emerald-500' },
    { id: 'citas', label: 'Agenda de Visitas', icon: '📅', badge: String(appointmentsCount), badgeColor: 'bg-blue-500' },
    { id: 'documentos', label: 'Folios Reales & Contratos', icon: '📄' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#081229] text-content-inverse flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="p-6 border-b border-gray-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                <span className="text-accent">INMO</span>VAX
              </span>
              <span className="text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full tracking-wider">
                VENDEDOR
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

          {/* PERFIL VERIFICADO */}
          <div className="mx-4 my-4 p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-black text-sm">✓</span>
              <span className="text-xs font-bold text-emerald-200">Propietario Verificado</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              Folios Reales matriculados y respaldados legalmente.
            </p>
          </div>

          {/* MENÚ DE OPCIONES */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Mi Gestión de Inmuebles
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

        {/* PARTE INFERIOR: USUARIO Y ENLACES */}
        <div className="p-4 border-t border-gray-800/80 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-emerald-500 flex items-center justify-center font-black text-surface-dark text-sm shadow">
              GB
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Arq. Gonzalo Benítez</div>
              <div className="text-[11px] text-gray-400 truncate">Vendedor & Propietario</div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-xs font-bold text-white rounded-xl transition-all border border-white/10"
          >
            <span>🌐</span> Explorar Portal InmoVax
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
