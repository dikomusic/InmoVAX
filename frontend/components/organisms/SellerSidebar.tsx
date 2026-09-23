"use client";
import React from 'react';
import Link from 'next/link';
import { CalendarDays, ClipboardList, FileText, Home, LogOut, MessageCircle, Plus, X, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../atoms/BrandLogo';

export type SellerTab = 'resumen' | 'favoritos' | 'historial' | 'consultas' | 'inmuebles' | 'citas' | 'documentos';

interface SellerSidebarProps {
  activeTab: SellerTab;
  onSelectTab: (tab: SellerTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onPublishClick: () => void;
  myPropertiesCount?: number;
  appointmentsCount?: number;
  consultationsCount?: number;
  userName?: string;
  userEmail?: string;
}

export const SellerSidebar = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  myPropertiesCount,
  appointmentsCount,
  consultationsCount,
  onPublishClick,
  userName = 'Arq. Gonzalo Benítez',
  userEmail = 'vendedor@inmovax.com'
}: SellerSidebarProps) => {
  const menuItems: {
    id: SellerTab;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'resumen', label: 'Mi Panel General', Icon: ClipboardList },
    {
      id: 'inmuebles',
      label: 'Mis Inmuebles Publicados',
      Icon: Home,
      badge: myPropertiesCount !== undefined ? String(myPropertiesCount) : undefined
    },
    {
      id: 'consultas',
      label: 'Consultas & Ofertas',
      Icon: MessageCircle,
      badge: consultationsCount !== undefined && consultationsCount > 0 ? String(consultationsCount) : undefined,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'citas',
      label: 'Agenda y Visitas',
      Icon: CalendarDays,
      badge: appointmentsCount !== undefined ? String(appointmentsCount) : undefined,
      badgeColor: 'bg-blue-500'
    },
    { id: 'documentos', label: 'Folio Real y Minutas', Icon: FileText }
  ];

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'GB';

  return (
    <>
      {/* BACKDROP PARA DISPOSITIVOS MÓVILES */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ASIDE BARRA LATERAL */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col justify-between border-r border-gray-800 bg-[#081229] text-white transition-transform duration-300 ease-in-out lg:sticky lg:w-72 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* LOGO INMOVAX */}
          <div className="p-5 sm:p-6 border-b border-gray-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar barra lateral"
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* PERFIL DEL VENDEDOR */}
          <div className="mx-4 my-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-accent to-emerald-500 font-black text-sm text-slate-900 shadow">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-extrabold text-white">{userName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">
                  Vendedor Verificado
                </span>
              </div>
            </div>
          </div>

          {/* MENÚ DE OPCIONES */}
          <nav className="px-3 space-y-1 mt-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Mi Gestión de Inmuebles
            </div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.Icon;
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
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span suppressHydrationWarning className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white shrink-0 ${item.badgeColor || 'bg-primary/80'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* PARTE INFERIOR: ACCIÓN PUBLICAR Y REGRESO */}
        <div className="p-4 border-t border-gray-800/80 space-y-2.5 bg-[#060e20]">
          <button
            type="button"
            onClick={() => {
              onPublishClick();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary-hover text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Publicar Inmueble</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-400" />
            <span>Volver a InmoVAX</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
