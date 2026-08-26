"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard & Métricas', href: '/admin', icon: '📊' },
    { name: 'Gestión de Inmuebles', href: '/admin#propiedades', icon: '🏠', badge: '14' },
    { name: 'Revisión Legal / Folio Real', href: '/admin#legal', icon: '⚖️', badge: '3', badgeColor: 'bg-amber-500' },
    { name: 'Asesores & Citas', href: '/admin#asesores', icon: '👥', badge: '6' },
    { name: 'Transacciones & Anticréticos', href: '/admin#transacciones', icon: '💼' },
    { name: 'Configuración del Portal', href: '/admin#config', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex text-content-main font-sans">
      
      {/* SIDEBAR PARA MÓVILES (OVERLAY) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR PRINCIPAL */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-surface-dark text-content-inverse flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* PARTE SUPERIOR DEL SIDEBAR */}
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
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* INDICADOR DE MODO DEMO */}
          <div className="mx-4 my-4 p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-blue-200">Panel en Modo Desarrollo</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Simulación completa en memoria para evaluación académica.
            </p>
          </div>

          {/* MENÚ DE NAVEGACIÓN */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Módulos Administrativos
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-primary/80'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PARTE INFERIOR DEL SIDEBAR (PERFIL Y SALIR) */}
        <div className="p-4 border-t border-gray-800/80 space-y-3">
          {/* TARJETA DE USUARIO */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-white text-sm shadow">
              DC
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Daniel Catari</div>
              <div className="text-[11px] text-gray-400 truncate">Super Administrador</div>
            </div>
          </div>

          {/* BOTÓN VOLVER AL SITIO WEB */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-xs font-bold text-white rounded-xl transition-all border border-white/10"
          >
            <span>🌐</span> Ver Sitio Web Público
          </Link>

          {/* BOTÓN CERRAR SESIÓN */}
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
          >
            <span>🚪</span> Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER SUPERIOR */}
        <header className="h-18 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          {/* BOTÓN DE MENÚ HAMBURGUESA & TITULAR */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 text-content-main hover:bg-gray-200 cursor-pointer"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-surface-dark flex items-center gap-2">
                Centro de Control Inmobiliario
              </h1>
              <p className="text-xs text-content-muted hidden sm:block">
                Sede Central La Paz • InmoVax Portal v1.0
              </p>
            </div>
          </div>

          {/* HERRAMIENTAS RÁPIDAS (BÚSQUEDA Y NOTIFICACIONES) */}
          <div className="flex items-center gap-3">
            
            {/* BUSCADOR ADMIN */}
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder="Buscar propiedad, asesor o ID..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-content-main focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
              <span className="absolute left-3 top-2.5 text-xs text-gray-400">🔍</span>
            </div>

            {/* BOTÓN DE NOTIFICACIONES CON MENÚ SIMULADO */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                title="Notificaciones administrativas"
              >
                <span>🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h4 className="font-extrabold text-sm text-surface-dark">Alertas del Sistema (3)</h4>
                    <span className="text-[11px] font-bold text-primary cursor-pointer hover:underline">Marcar leídas</span>
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
                        <p className="text-xs font-bold text-gray-900">Nueva Cita de Visita Agendada</p>
                        <p className="text-[11px] text-gray-500">Casa en Achumani con Asesor Carlos Vega</p>
                        <span className="text-[10px] text-gray-400">Hace 45 min</span>
                      </div>
                    </div>
                    <div className="py-3 flex items-start gap-3">
                      <span className="text-xl">✨</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Nueva Propiedad para Publicar</p>
                        <p className="text-[11px] text-gray-500">Depto Calacoto subido por propietario</p>
                        <span className="text-[10px] text-gray-400">Hace 2 horas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN DE ACCIÓN RÁPIDA */}
            <Link
              href="/publicar"
              className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
            >
              <span>+</span> Publicar Inmueble
            </Link>
          </div>
        </header>

        {/* CONTENEDOR DE VISTA HIJA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
