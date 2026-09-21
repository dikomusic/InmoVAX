"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Clock3,
  MessageCircle,
  UserRound,
  LogOut,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { BrandLogo } from '../atoms/BrandLogo';
import { NavDropdown, DropdownItem } from '../molecules/NavDropdown';
import {
  AccountMenu,
  BuyerNotifications,
  AccountActivity
} from '../molecules/AccountMenu';
import { AccountActivityDialog } from '../molecules/AccountActivityDialog';
import { LoginDialog } from '../molecules/LoginDialog';
import {
  FrontendSession,
  readStoredSession,
  removeStoredSession,
  hasUserPublishedProperties,
  readStoredList,
  FAVORITES_KEY,
  HISTORY_KEY,
  CONSULTATIONS_KEY,
  saveStoredSession
} from '@/lib/frontendStore';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [activity, setActivity] = useState<AccountActivity | null>(null);
  const [session, setSession] = useState<FrontendSession | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'register'>('login');
  const [loginReason, setLoginReason] = useState<'favorites' | 'history' | 'consultations' | 'general'>('general');

  const [counts, setCounts] = useState({
    favorites: 0,
    history: 0,
    consultations: 0
  });

  const syncState = () => {
    if (typeof window === 'undefined') return;
    const currentSession = readStoredSession();
    setSession(currentSession);
    const favs = readStoredList(FAVORITES_KEY).length;
    const hist = readStoredList(HISTORY_KEY).length;
    const cons = readStoredList(CONSULTATIONS_KEY).length;
    setCounts({ favorites: favs, history: hist, consultations: cons });
  };

  useEffect(() => {
    syncState();

    const handleSessionUpdated = () => syncState();
    const handleListUpdated = () => syncState();

    const handleRequireLogin = (e: Event) => {
      const customEvent = e as CustomEvent<{ reason?: 'favorites' | 'history' | 'consultations' | 'general' }>;
      setLoginReason(customEvent.detail?.reason || 'favorites');
      setLoginModalMode('login');
      setLoginModalOpen(true);
    };

    window.addEventListener('inmovax:session-updated', handleSessionUpdated);
    window.addEventListener('inmovax:list-updated', handleListUpdated);
    window.addEventListener('inmovax:properties-updated', handleSessionUpdated);
    window.addEventListener('inmovax:require-login', handleRequireLogin);

    // Sincronizar sesión con Supabase Auth (ej. tras login con Google OAuth)
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session: supaSession } }) => {
      if (supaSession?.user) {
        const email = supaSession.user.email || '';
        const name = supaSession.user.user_metadata?.full_name || email.split('@')[0];
        const isAdmin = email === 'admin@inmovax.com';
        const current = readStoredSession();
        if (!current || current.email !== email) {
          const newSession: FrontendSession = {
            name: isAdmin ? 'Super Administrador InmoVAX' : name,
            email,
            hasPublishedProperties: isAdmin,
            role: isAdmin ? 'admin' : 'comprador'
          };
          saveStoredSession(newSession);
          setSession(newSession);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supaSession) => {
      if (supaSession?.user) {
        const email = supaSession.user.email || '';
        const name = supaSession.user.user_metadata?.full_name || email.split('@')[0];
        const isAdmin = email === 'admin@inmovax.com';
        const newSession: FrontendSession = {
          name: isAdmin ? 'Super Administrador InmoVAX' : name,
          email,
          hasPublishedProperties: isAdmin,
          role: isAdmin ? 'admin' : 'comprador'
        };
        saveStoredSession(newSession);
        setSession(newSession);
      }
    });

    return () => {
      window.removeEventListener('inmovax:session-updated', handleSessionUpdated);
      window.removeEventListener('inmovax:list-updated', handleListUpdated);
      window.removeEventListener('inmovax:properties-updated', handleSessionUpdated);
      window.removeEventListener('inmovax:require-login', handleRequireLogin);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    removeStoredSession();
    setSession(null);
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } catch {}
  };

  const hasPublished = hasUserPublishedProperties(session);
  const isAdmin = session?.role === 'admin' || session?.email?.includes('admin');

  const menuComprar: DropdownItem[] = [
    { label: 'Comprar', isHeader: true },
    { label: '', isDivider: true },
    { label: 'Casas', href: '/comprar/casas' },
    { label: 'Departamentos', href: '/comprar/departamentos' },
    { label: 'Terrenos', href: '/comprar/terrenos' },
    { label: 'Oficinas', href: '/comprar/oficinas' },
    { label: 'Locales comerciales', href: '/comprar/locales' },
    { label: 'Todos los inmuebles', href: '/comprar/todos' },
  ];

  const menuAlquilar: DropdownItem[] = [
    { label: 'Alquilar', isHeader: true },
    { label: '', isDivider: true },
    { label: 'Casas', href: '/alquilar/casas' },
    { label: 'Departamentos', href: '/alquilar/departamentos' },
    { label: 'Oficinas', href: '/alquilar/oficinas' },
    { label: 'Locales comerciales', href: '/alquilar/locales' },
    { label: 'Todos los inmuebles', href: '/alquilar/todos' },
  ];

  const menuAnticretico: DropdownItem[] = [
    { label: 'Anticrético', isHeader: true },
    { label: '', isDivider: true },
    { label: 'Casas', href: '/anticretico/casas' },
    { label: 'Departamentos', href: '/anticretico/departamentos' },
    { label: 'Oficinas', href: '/anticretico/oficinas' },
    { label: 'Locales comerciales', href: '/anticretico/locales' },
    { label: 'Todos los inmuebles', href: '/anticretico/todos' },
  ];

  const menuMas: DropdownItem[] = [
    { label: 'Más', isHeader: true },
    { label: '', isDivider: true },
    { label: ' Nuestros asesores', href: '/asesores' },
    { label: ' Oficinas', href: '/oficinas' },
    { label: ' Nosotros', href: '/nosotros' },
    { label: ' Trabaja con nosotros', href: '/empleo' },
    { label: ' Contacto', href: '/contacto' },
  ];

  return (
    <nav className="bg-surface-dark w-full sticky top-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 xl:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* 1. LOGO */}
        <Link href="/" className="shrink-0" aria-label="Ir al inicio de InmoVAX">
          <BrandLogo />
        </Link>

        {/* 2. ENLACES CENTRALES (Desktop) */}
        <div className="hidden lg:flex space-x-6 items-center">
          <NavDropdown title="Comprar" items={menuComprar} />
          <NavDropdown title="Alquilar" items={menuAlquilar} />
          <NavDropdown title="Anticrético" items={menuAnticretico} />

          <Link href="/proyectos" className="text-content-inverse hover:text-accent font-medium transition-colors">
            Proyectos
          </Link>

          <NavDropdown title="Más" items={menuMas} />
        </div>

        {/* 3. BOTONES DE ACCIÓN Y MENÚ */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link href="/publicar" className="hidden sm:block">
            <Button variant="accent">Publicar</Button>
          </Link>

          {/* ROL / ESTADO EN DESKTOP */}
          {session ? (
            <>
              <BuyerNotifications onOpen={() => setActivity('notifications')} />
              <AccountMenu session={session} onLogout={handleLogout} onOpenActivity={setActivity} />
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setLoginReason('general');
                  setLoginModalMode('login');
                  setLoginModalOpen(true);
                }}
                className="rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-content-inverse hover:bg-white/10 transition-colors cursor-pointer"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginReason('general');
                  setLoginModalMode('register');
                  setLoginModalOpen(true);
                }}
                className="rounded-xl px-3 py-1.5 text-xs sm:text-sm font-extrabold bg-white/10 hover:bg-white/20 text-content-inverse transition-colors cursor-pointer border border-white/20"
              >
                Crear Cuenta
              </button>
            </div>
          )}

          {/* Botón hamburguesa (Solo visible en pantallas chicas lg:hidden) */}
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            className="lg:hidden text-content-inverse hover:text-accent p-2 rounded-xl hover:bg-white/10 focus:outline-none transition-colors"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 4. MENÚ DESPLEGABLE MÓVIL RESPONSIVE */}
      {menuAbierto && (
        <div className="lg:hidden bg-surface-dark/98 backdrop-blur-md border-t border-gray-800 absolute w-full left-0 shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] z-50 animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col px-5 py-5 space-y-5">
            {/* TARJETA DE ESTADO / USUARIO EN MÓVIL */}
            {session ? (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-content-inverse space-y-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-black text-content-main ring-2 ring-white/20">
                    {session.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-sm truncate">{session.name}</p>
                    <p className="text-xs text-content-inverse/60 truncate">{session.email}</p>
                  </div>
                  {hasPublished ? (
                    <span className="text-[10px] uppercase font-black bg-accent text-content-main px-2 py-0.5 rounded-full">
                      &ge;1 Inmueble
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold bg-white/10 text-content-inverse/70 px-2 py-0.5 rounded-full">
                      0 Publicados
                    </span>
                  )}
                </div>

                {/* CONDICIÓN CLAVE EN MÓVIL: "Mi cuenta" SOLO si tiene 1 o más inmuebles */}
                {hasPublished && (
                  <Link
                    href="/vendedor"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl bg-accent text-content-main font-extrabold text-sm shadow-sm hover:brightness-105 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      <span>Mi cuenta (Portal de Inmuebles)</span>
                    </div>
                    <span className="text-xs">&rarr;</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-sm hover:bg-purple-700 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Panel Administrador</span>
                    </div>
                    <span className="text-xs">&rarr;</span>
                  </Link>
                )}

                {/* Accesos rápidos táctiles a Favoritos, Historial y Consultas */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAbierto(false);
                      setActivity('favorites');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
                  >
                    <div className="relative mb-1">
                      <Heart className="h-4 w-4 text-rose-400" />
                      {counts.favorites > 0 && (
                        <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white px-1">
                          {counts.favorites}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-content-inverse/90">Favoritos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuAbierto(false);
                      setActivity('history');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
                  >
                    <div className="relative mb-1">
                      <Clock3 className="h-4 w-4 text-blue-400" />
                      {counts.history > 0 && (
                        <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-blue-500 text-[9px] font-black text-white px-1">
                          {counts.history}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-content-inverse/90">Historial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuAbierto(false);
                      setActivity('consultations');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
                  >
                    <div className="relative mb-1">
                      <MessageCircle className="h-4 w-4 text-emerald-400" />
                      {counts.consultations > 0 && (
                        <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-black text-white px-1">
                          {counts.consultations}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-content-inverse/90">Consultas</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuAbierto(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full p-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-content-inverse flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-sm">Bienvenido a InmoVAX</p>
                  <p className="text-xs text-content-inverse/60 mt-0.5">Inicia sesión para activar favoritos y consultas</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuAbierto(false);
                    setLoginReason('general');
                    setLoginModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-white text-surface-dark font-extrabold text-xs rounded-xl hover:bg-white/90 transition-colors shrink-0 shadow-sm"
                >
                  Ingresar
                </button>
              </div>
            )}

            {/* Acordeones de Navegación */}
            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-lg cursor-pointer list-none">
                Comprar <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-3 space-y-2.5 border-l-2 border-gray-700">
                {menuComprar.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium text-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-lg cursor-pointer list-none">
                Alquilar <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-3 space-y-2.5 border-l-2 border-gray-700">
                {menuAlquilar.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium text-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-lg cursor-pointer list-none">
                Anticrético <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-3 space-y-2.5 border-l-2 border-gray-700">
                {menuAnticretico.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium text-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            <Link href="/proyectos" onClick={() => setMenuAbierto(false)} className="text-content-inverse font-bold text-lg hover:text-accent">
              Proyectos
            </Link>

            <details className="group">
              <summary className="flex justify-between items-center text-content-inverse font-bold text-lg cursor-pointer list-none">
                Más información <span className="transition group-open:rotate-180 text-accent">▼</span>
              </summary>
              <div className="flex flex-col pl-4 mt-3 space-y-2.5 border-l-2 border-gray-700">
                {menuMas.filter(i => i.href).map((item, idx) => (
                  <Link key={idx} href={item.href!} onClick={() => setMenuAbierto(false)} className="text-content-inverse/80 hover:text-accent font-medium text-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            {/* Separador */}
            <div className="h-px bg-gray-800 my-1"></div>

            {/* Botón Publicar para móvil */}
            <Link href="/publicar" onClick={() => setMenuAbierto(false)}>
              <Button variant="accent" fullWidth>
                Publicar mi Propiedad
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Diálogo de actividades (Favoritos, Historial, Consultas, Notificaciones) */}
      <AccountActivityDialog activity={activity} onClose={() => setActivity(null)} />

      {/* Diálogo de inicio de sesión reactivo (para visitantes o acceso general) */}
      <LoginDialog
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialMode={loginModalMode}
        onLogin={(newSession) => {
          setSession(newSession);
        }}
        reason={loginReason}
      />
    </nav>
  );
};