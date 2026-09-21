"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  Clock3,
  Heart,
  LogOut,
  MessageCircle,
  UserRound,
  ShieldCheck,
  Building2
} from 'lucide-react';
import {
  FrontendSession,
  hasUserPublishedProperties,
  readStoredList,
  FAVORITES_KEY,
  HISTORY_KEY,
  CONSULTATIONS_KEY,
  ConsultationItem
} from '@/lib/frontendStore';

export type AccountActivity = 'notifications' | 'favorites' | 'history' | 'consultations';

interface AccountMenuProps {
  session: FrontendSession;
  onLogout: () => void;
  onOpenActivity: (activity: AccountActivity) => void;
}

export const AccountMenu = ({ session, onLogout, onOpenActivity }: AccountMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dynamic counts for badges
  const [counts, setCounts] = useState({
    favorites: 0,
    history: 0,
    consultations: 0
  });

  const [hasPublished, setHasPublished] = useState(() => hasUserPublishedProperties(session));
  const isAdmin = session.role === 'admin' || session.email.includes('admin');

  const updateCounts = () => {
    if (typeof window === 'undefined') return;
    const favs = readStoredList(FAVORITES_KEY).length;
    const hist = readStoredList(HISTORY_KEY).length;
    const cons = readStoredList(CONSULTATIONS_KEY).length;
    setCounts({ favorites: favs, history: hist, consultations: cons });
    setHasPublished(hasUserPublishedProperties(session));
  };

  useEffect(() => {
    updateCounts();

    const handleEvent = () => updateCounts();
    window.addEventListener('inmovax:list-updated', handleEvent);
    window.addEventListener('inmovax:session-updated', handleEvent);
    window.addEventListener('inmovax:properties-updated', handleEvent);

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);

    return () => {
      window.removeEventListener('inmovax:list-updated', handleEvent);
      window.removeEventListener('inmovax:session-updated', handleEvent);
      window.removeEventListener('inmovax:properties-updated', handleEvent);
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, [session]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="Menú de usuario"
        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-bold text-content-inverse transition-colors hover:bg-white/10"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-black text-content-main ring-2 ring-white/20 shadow-sm">
          {session.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="hidden max-w-[120px] truncate text-xs sm:text-sm md:block">
          {session.name}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-content-inverse/70 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop en pantallas móviles para evitar desbordes y cerrar al tocar fuera */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="fixed left-3 right-3 top-[4.25rem] z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white p-2.5 text-content-main shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:max-w-72 sm:p-2">
            {/* User info Header */}
            <div className="border-b border-gray-100 px-3 py-2.5 bg-surface-light/50 rounded-xl mb-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-black text-content-main">{session.name}</p>
              {hasPublished ? (
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-accent/20 text-content-main font-bold text-[10px]">
                  Con publicaciones
                </span>
              ) : (
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-gray-100 text-content-muted font-bold text-[10px]">
                  Activo (0 pub.)
                </span>
              )}
            </div>
            <p className="truncate text-xs text-content-muted mt-0.5">{session.email}</p>
          </div>

          <div className="space-y-0.5 py-1">
            {/* CONDICIÓN CLAVE: "Mi cuenta" SOLO si tiene 1 o más propiedades publicadas */}
            {hasPublished && (
              <Link
                href="/vendedor"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-content-main hover:bg-surface-light group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-accent/20 text-primary">
                    <UserRound aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>Mi cuenta</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Portal
                </span>
              </Link>
            )}

            {/* Si es administrador, acceso directo a /admin */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-purple-700 hover:bg-purple-50 group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                    <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>Panel Administrador</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-purple-200 text-purple-800">
                  Admin
                </span>
              </Link>
            )}

            {/* Favoritos */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenActivity('favorites');
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-content-main hover:bg-surface-light transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded-lg bg-rose-50 text-rose-600">
                  <Heart aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>Favoritos</span>
              </div>
              {counts.favorites > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-100 px-1.5 text-[11px] font-extrabold text-rose-700">
                  {counts.favorites}
                </span>
              )}
            </button>

            {/* Historial */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenActivity('history');
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-content-main hover:bg-surface-light transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                  <Clock3 aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>Historial</span>
              </div>
              {counts.history > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-100 px-1.5 text-[11px] font-extrabold text-blue-700">
                  {counts.history}
                </span>
              )}
            </button>

            {/* Consultas */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpenActivity('consultations');
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-content-main hover:bg-surface-light transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                </span>
                <span>Consultas</span>
              </div>
              {counts.consultations > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-100 px-1.5 text-[11px] font-extrabold text-emerald-700">
                  {counts.consultations}
                </span>
              )}
            </button>
          </div>

          <div className="pt-1 mt-1 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </>
    )}
  </div>
  );
};

export const BuyerNotifications = ({ onOpen }: { onOpen: () => void }) => {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = () => {
      const consultations = readStoredList<ConsultationItem>(CONSULTATIONS_KEY);
      const unread = consultations.some((c) => c.status === 'respondido');
      setHasUnread(unread);
    };
    checkUnread();
    window.addEventListener('inmovax:list-updated', checkUnread);
    return () => window.removeEventListener('inmovax:list-updated', checkUnread);
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Abrir notificaciones"
      className="relative rounded-xl p-2 text-content-inverse hover:bg-white/10 transition-colors"
    >
      <Bell aria-hidden="true" className="h-5 w-5" />
      {hasUnread && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface-dark animate-pulse" />
      )}
    </button>
  );
};
