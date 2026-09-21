"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Clock3,
  Heart,
  MessageCircle,
  Trash2,
  Building,
  Sparkles,
  Search
} from 'lucide-react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { FavoritePropertyItem } from './FavoritePropertyItem';
import { HistoryPropertyItem } from './HistoryPropertyItem';
import { ConsultationPropertyItem } from './ConsultationPropertyItem';
import {
  AccountActivity,
  FAVORITES_KEY,
  HISTORY_KEY,
  FavoriteItem,
  HistoryItem,
  ConsultationItem,
  getStoredConsultations,
  readStoredList,
  writeStoredList
} from '@/lib/frontendStore';

interface AccountActivityDialogProps {
  activity: AccountActivity | null;
  onClose: () => void;
}

export { type AccountActivity };

export const AccountActivityDialog = ({ activity, onClose }: AccountActivityDialogProps) => {
  const [currentTab, setCurrentTab] = useState<AccountActivity>('favorites');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);

  // Synchronize when activity opens or changes
  useEffect(() => {
    if (activity) {
      setCurrentTab(activity);
    }
  }, [activity]);

  // Load lists
  const loadData = () => {
    if (typeof window === 'undefined') return;
    setFavorites(readStoredList<FavoriteItem>(FAVORITES_KEY));
    setHistory(readStoredList<HistoryItem>(HISTORY_KEY));
    setConsultations(getStoredConsultations());
  };

  useEffect(() => {
    loadData();
    const handleListUpdate = () => loadData();
    window.addEventListener('inmovax:list-updated', handleListUpdate);
    return () => window.removeEventListener('inmovax:list-updated', handleListUpdate);
  }, []);

  const handleRemoveFavorite = (identifier: string) => {
    const updated = favorites.filter((item) => {
      const key = item.id || item.href || item.title;
      return key !== identifier && item.title !== identifier;
    });
    setFavorites(updated);
    writeStoredList(FAVORITES_KEY, updated);
  };

  const handleRemoveHistory = (identifier: string) => {
    const updated = history.filter((item) => {
      const key = item.id || item.href || item.title;
      return key !== identifier && item.title !== identifier;
    });
    setHistory(updated);
    writeStoredList(HISTORY_KEY, updated);
  };

  const handleClearHistory = () => {
    setHistory([]);
    writeStoredList(HISTORY_KEY, []);
  };

  if (!activity) return null;

  return (
    <Modal
      isOpen={!!activity}
      onClose={onClose}
      title="Centro de Actividad InmoVAX"
      subtitle="Gestiona tus propiedades favoritas, historial de navegación y consultas."
      maxWidth="2xl"
    >
      <div className="flex flex-col space-y-4">
        {/* Pestañas superiores estilizadas y responsivas */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-light rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setCurrentTab('favorites')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl whitespace-nowrap transition-all ${
              currentTab === 'favorites'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            <Heart className={`h-4 w-4 ${currentTab === 'favorites' ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favoritos</span>
            {favorites.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px]">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl whitespace-nowrap transition-all ${
              currentTab === 'history'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            <Clock3 className="h-4 w-4 text-blue-500" />
            <span>Historial</span>
            {history.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px]">
                {history.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('consultations')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl whitespace-nowrap transition-all ${
              currentTab === 'consultations'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>Consultas</span>
            {consultations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">
                {consultations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('notifications')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl whitespace-nowrap transition-all ${
              currentTab === 'notifications'
                ? 'bg-white text-accent shadow-sm'
                : 'text-content-muted hover:text-content-main'
            }`}
          >
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Avisos</span>
          </button>
        </div>

        {/* Contenido principal por Pestaña */}
        <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1 space-y-3">
          {/* TAB 1: FAVORITOS */}
          {currentTab === 'favorites' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-content-muted">
                  {favorites.length} {favorites.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}
                </span>
                {favorites.length > 0 && (
                  <Link
                    href="/comprar/todos"
                    onClick={onClose}
                    className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Explorar más</span>
                    <Search className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {favorites.length > 0 ? (
                <div className="space-y-2.5">
                  {favorites.map((fav, index) => (
                    <FavoritePropertyItem
                      key={`${fav.title}-${index}`}
                      item={fav}
                      onRemove={handleRemoveFavorite}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 rounded-3xl bg-surface-light border border-dashed border-gray-200">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-500 mx-auto mb-3 shadow-inner">
                    <Heart className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-content-main">No tienes favoritos aún</h4>
                  <p className="text-xs text-content-muted max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                    Guarda las propiedades que más te interesen haciendo clic en el corazón para compararlas o consultarlas cuando quieras.
                  </p>
                  <Link href="/comprar/todos" onClick={onClose}>
                    <Button variant="accent" className="py-2 px-4 text-xs">
                      Explorar Inmuebles
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORIAL */}
          {currentTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-content-muted">
                  Inmuebles visitados recientemente ({history.length})
                </span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Borrar historial</span>
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((hist, index) => (
                    <HistoryPropertyItem
                      key={`${hist.title}-${index}`}
                      item={hist}
                      onRemove={handleRemoveHistory}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 rounded-3xl bg-surface-light border border-dashed border-gray-200">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-500 mx-auto mb-3 shadow-inner">
                    <Clock3 className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-content-main">Tu historial está vacío</h4>
                  <p className="text-xs text-content-muted max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                    Las fichas de propiedades que abras mientras navegas por InmoVAX se guardarán aquí para fácil acceso.
                  </p>
                  <Link href="/comprar/todos" onClick={onClose}>
                    <Button variant="outline" className="py-2 px-4 text-xs">
                      Ver Propiedades Destacadas
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONSULTAS */}
          {currentTab === 'consultations' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-content-muted">
                  Mensajes y citas con asesores ({consultations.length})
                </span>
              </div>

              {consultations.length > 0 ? (
                <div className="space-y-3">
                  {consultations.map((cons) => (
                    <ConsultationPropertyItem
                      key={cons.id}
                      consultation={cons}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 rounded-3xl bg-surface-light border border-dashed border-gray-200">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-500 mx-auto mb-3 shadow-inner">
                    <MessageCircle className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-content-main">No tienes consultas activas</h4>
                  <p className="text-xs text-content-muted max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                    Cuando consultes o agendes una visita en la ficha de un inmueble, podrás seguir la respuesta del asesor aquí.
                  </p>
                  <Link href="/asesores" onClick={onClose}>
                    <Button variant="primary" className="py-2 px-4 text-xs">
                      Conoce a Nuestros Asesores
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTIFICACIONES */}
          {currentTab === 'notifications' && (
            <div className="space-y-3">
              {consultations.filter(c => c.status === 'respondido').length > 0 ? (
                <>
                  <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/70 text-content-main flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500 text-white shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-extrabold text-blue-950">Sistema de Alertas InmoVAX</h5>
                      <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                        Aquí verás las respuestas de tus asesores y novedades en tiempo real.
                      </p>
                    </div>
                  </div>

                  {consultations
                    .filter(c => c.status === 'respondido')
                    .map((cons) => (
                      <div key={`notif-${cons.id}`} className="p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-accent/20 text-content-main shrink-0 mt-0.5">
                          <Building className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-content-main">Respuesta de Asesor ({cons.advisorName})</span>
                            <span className="text-[10px] text-content-muted">{cons.date}</span>
                          </div>
                          <p className="text-xs text-content-muted mt-1 line-clamp-2">
                            &ldquo;{cons.lastMessage}&rdquo;
                          </p>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-center py-10 px-4 rounded-3xl bg-surface-light border border-dashed border-gray-200">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-500 mx-auto mb-3 shadow-inner">
                    <Bell className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-content-main">No tienes avisos pendientes</h4>
                  <p className="text-xs text-content-muted max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                    Te notificaremos aquí cuando un asesor responda a tus consultas, se agende una visita o haya novedades en tus propiedades.
                  </p>
                  <Link href="/comprar/todos" onClick={onClose}>
                    <Button variant="outline" className="py-2 px-4 text-xs">
                      Explorar Inmuebles
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
