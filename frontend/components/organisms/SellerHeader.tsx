"use client";
import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { BrandLogo } from '../atoms/BrandLogo';

interface SellerHeaderProps {
  onToggleSidebar: () => void;
  onPublishClick?: () => void;
  userName?: string;
  activeTabTitle?: string;
}

/**
 * SellerHeader:
 * Se muestra EXCLUSIVAMENTE en dispositivos móviles y pantallas pequeñas (< lg)
 * para albergar el logo y el botón de menú (3 rayas) sin duplicar la información
 * que la barra lateral ya muestra en escritorio.
 */
export const SellerHeader = ({
  onToggleSidebar
}: SellerHeaderProps) => {
  return (
    <header className="lg:hidden sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 flex items-center justify-between shadow-2xs">
      {/* LOGO A LA IZQUIERDA */}
      <Link href="/" className="flex items-center gap-2" aria-label="Ir a la página principal de InmoVAX">
        <BrandLogo />
      </Link>

      {/* BOTÓN DE 3 RAYAS (HAMBURGUESA) A LA DERECHA */}
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Abrir menú de navegación"
        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-surface-dark transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
};
