"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Menu, Bell, AlertTriangle, CreditCard, MessageSquare, Plus, CheckCircle2, Check } from 'lucide-react';
import { PropertyItem } from './AdminPropertiesSection';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onQuickPublish?: () => void;
  properties?: PropertyItem[];
  pendingPaymentsCount?: number;
  unreadMessagesCount?: number;
  onNavigateTab?: (tab: AdminTab) => void;
}

export const AdminHeader = ({
  onToggleSidebar,
  onQuickPublish,
  properties = [],
  pendingPaymentsCount = 0,
  unreadMessagesCount = 0,
  onNavigateTab
}: AdminHeaderProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [readAlertIds, setReadAlertIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('inmovax-admin-read-alerts');
        if (stored) setReadAlertIds(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Construir alertas reales dinámicas a partir de los datos vivos de la plataforma
  const realAlerts = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      time: string;
      icon: 'legal' | 'payment' | 'message';
      tab: AdminTab;
    }> = [];

    // 1. Alertas de verificación notarial de inmuebles reales
    const legalProps = (properties || []).filter(
      p => p.status === 'En Revisión Legal' || p.status === 'Pendiente' || p.folioReal === 'Sin Folio'
    );
    legalProps.slice(0, 3).forEach(p => {
      list.push({
        id: `prop-${p.id}`,
        title: p.folioReal === 'Sin Folio' ? 'Inmueble sin Folio Real verificado' : 'Validación Notarial Requerida',
        subtitle: `${p.title} (${p.zone})`,
        time: p.date || 'Reciente',
        icon: 'legal',
        tab: 'propiedades'
      });
    });

    // 2. Alertas de comprobantes QR de pago pendientes
    if (pendingPaymentsCount > 0) {
      list.push({
        id: 'alert-pending-payments',
        title: `${pendingPaymentsCount} Pago(s) QR Pendiente(s)`,
        subtitle: 'Comprobantes bancarios por validar en Tesorería',
        time: 'Hoy',
        icon: 'payment',
        tab: 'pagos'
      });
    }

    // 3. Alertas de mensajes de compradores sin responder
    if (unreadMessagesCount > 0) {
      list.push({
        id: 'alert-pending-messages',
        title: `${unreadMessagesCount} Consulta(s) sin atender`,
        subtitle: 'Mensajes directos de compradores interesados en inmuebles',
        time: 'Hoy',
        icon: 'message',
        tab: 'mensajes'
      });
    }

    return list;
  }, [properties, pendingPaymentsCount, unreadMessagesCount]);

  const unreadAlerts = realAlerts.filter(a => !readAlertIds.includes(a.id));

  const handleMarkAllAsRead = () => {
    const allIds = realAlerts.map(a => a.id);
    setReadAlertIds(allIds);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('inmovax-admin-read-alerts', JSON.stringify(allIds));
    }
  };

  const handleAlertClick = (tab: AdminTab, id: string) => {
    if (!readAlertIds.includes(id)) {
      const updated = [...readAlertIds, id];
      setReadAlertIds(updated);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('inmovax-admin-read-alerts', JSON.stringify(updated));
      }
    }
    setNotifOpen(false);
    if (onNavigateTab) onNavigateTab(tab);
  };

  return (
    <header className="h-18 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* BOTÓN MÓVIL Y TÍTULO */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-gray-100 text-content-main hover:bg-gray-200 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
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
            title="Notificaciones operativas reales"
          >
            <Bell className="w-4 h-4 text-gray-700" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h4 className="font-extrabold text-sm text-surface-dark">Alertas Notariales y Operativas</h4>
                  <span className="text-[10px] text-content-muted">
                    {unreadAlerts.length > 0 ? `${unreadAlerts.length} alerta(s) pendiente(s)` : 'Todo al día'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {unreadAlerts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Limpiar</span>
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {unreadAlerts.length > 0 ? (
                  unreadAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => handleAlertClick(alert.tab, alert.id)}
                      className="py-3 flex items-start gap-3 hover:bg-gray-50 px-2 rounded-xl cursor-pointer transition-colors"
                    >
                      {alert.icon === 'legal' && (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      {alert.icon === 'payment' && (
                        <CreditCard className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      {alert.icon === 'message' && (
                        <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{alert.title}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{alert.subtitle}</p>
                        <span className="text-[10px] text-gray-400">{alert.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">Sin alertas pendientes</p>
                    <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                      Todas las revisiones notariales, pagos y consultas están al día.
                    </p>
                  </div>
                )}
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
            <Plus className="w-4 h-4" />
            <span>Publicar Inmueble</span>
          </button>
        ) : (
          <Link
            href="/publicar"
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Inmueble</span>
          </Link>
        )}
      </div>
    </header>
  );
};

