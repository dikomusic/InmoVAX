"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SellerOfferItem, SellerOffer } from '../molecules/SellerOfferItem';
import { InternalChatModal } from '../molecules/InternalChatModal';
import { Modal } from '../atoms/Modal';
import {
  MessageCircle,
  Send,
  ArrowRightLeft,
  Building2,
  Clock,
  CheckCircle2,
  UserCheck,
  Sparkles
} from 'lucide-react';
import {
  ConsultationItem,
  CONSULTATIONS_KEY,
  getConsultationsForSeller,
  fetchConsultationsForSeller,
  readStoredSession
} from '@/lib/frontendStore';

interface SellerOffersSectionProps {
  offers: SellerOffer[];
  consultations?: ConsultationItem[];
  onAcceptOffer: (id: string) => void;
  onRejectOffer: (id: string) => void;
  onCounterOfferSubmit: (id: string, counterPrice: string) => void;
}

export const SellerOffersSection = ({
  offers,
  consultations: initialConsultations,
  onAcceptOffer,
  onRejectOffer,
  onCounterOfferSubmit
}: SellerOffersSectionProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'consultas' | 'ofertas'>('consultas');
  const [consultations, setConsultations] = useState<ConsultationItem[]>(initialConsultations || []);
  const [selectedConsultationForChat, setSelectedConsultationForChat] = useState<ConsultationItem | null>(null);

  // Modal de Contraoferta para ofertas formales
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<SellerOffer | null>(null);
  const [selectedOfferForChat, setSelectedOfferForChat] = useState<SellerOffer | null>(null);
  const [counterPrice, setCounterPrice] = useState('$us ');
  const [chatMessage, setChatMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({});

  const reloadConsultations = () => {
    const session = readStoredSession();
    if (session?.email) {
      fetchConsultationsForSeller(session.email)
        .then((cloud) => {
          setConsultations(cloud || []);
        })
        .catch(() => {
          const local = getConsultationsForSeller(session.email);
          setConsultations(local || []);
        });
    }
  };

  useEffect(() => {
    if (initialConsultations && initialConsultations.length > 0) {
      setConsultations(initialConsultations);
    }
    reloadConsultations();

    const handleUpdate = (e?: Event) => {
      const custom = e as CustomEvent<{ key?: string }>;
      if (custom?.detail?.key && custom.detail.key !== CONSULTATIONS_KEY) return;
      reloadConsultations();
    };
    window.addEventListener('inmovax:list-updated', handleUpdate);
    window.addEventListener('inmovax:new-inquiry', handleUpdate);

    // Polling reactivo cada 8s para sincronizar consultas
    const interval = setInterval(reloadConsultations, 8000);

    return () => {
      window.removeEventListener('inmovax:list-updated', handleUpdate);
      window.removeEventListener('inmovax:new-inquiry', handleUpdate);
      clearInterval(interval);
    };
  }, [initialConsultations]);

  const handleOpenCounterModal = (offer: SellerOffer) => {
    setSelectedOfferForCounter(offer);
    setCounterPrice(offer.initialPrice);
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOfferForCounter) {
      onCounterOfferSubmit(selectedOfferForCounter.id, counterPrice);
      setSelectedOfferForCounter(null);
    }
  };

  const handleSendChatMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOfferForChat || !chatMessage.trim()) return;
    setSentMessages((current) => ({
      ...current,
      [selectedOfferForChat.id]: [...(current[selectedOfferForChat.id] || []), chatMessage.trim()]
    }));
    setChatMessage('');
  };

  const pendingOffersCount = offers.filter(o => o.status === 'Pendiente').length;
  const pendingConsultationsCount = consultations.filter(c => c.status === 'pendiente').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. CABECERA & SELECTOR DE PESTAÑAS */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl text-surface-dark tracking-tight">
              Mensajes y Consultas de Compradores
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              Conversa directamente con compradores interesados en tus inmuebles publicados, sin comisiones ni intermediarios.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl whitespace-nowrap">
              {pendingConsultationsCount + pendingOffersCount} pendientes
            </span>
          </div>
        </div>

        {/* SUB-TABS INTERNOS */}
        <div className="flex border-b border-gray-100 gap-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('consultas')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'consultas'
                ? 'border-primary text-primary'
                : 'border-transparent text-content-muted hover:text-surface-dark'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mensajes Directos P2P</span>
            {consultations.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pendingConsultationsCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {consultations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ofertas')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'ofertas'
                ? 'border-primary text-primary'
                : 'border-transparent text-content-muted hover:text-surface-dark'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Propuestas Económicas</span>
            {offers.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary">
                {offers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. CONTENIDO SEGÚN SUB-TAB */}
      {activeSubTab === 'consultas' && (
        <div className="space-y-4">
          {consultations.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {consultations.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Fila Inmueble y Estado */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.propertyImage ? (
                          <div className="relative h-12 w-12 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                            <Image
                              src={item.propertyImage}
                              alt={item.propertyTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-surface-dark text-sm truncate">
                            {item.propertyTitle}
                          </h4>
                          <p className="text-xs text-emerald-600 font-black">
                            {item.propertyPrice} • <span className="text-content-muted font-normal">{item.propertyLocation}</span>
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        item.status === 'pendiente'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.status === 'pendiente' ? '● Pendiente' : '✓ Respondido'}
                      </span>
                    </div>

                    {/* Mensaje Recibido */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-surface-dark flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-primary" />
                          {item.buyerName || 'Comprador Interesado'}
                        </span>
                        <span className="text-[10px] text-content-muted">{item.date}</span>
                      </div>
                      <p className="text-content-main leading-relaxed italic">
                        &ldquo;{item.lastMessage}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-content-muted">
                      {item.messages && item.messages.length > 1
                        ? `${item.messages.length} mensajes en la conversación`
                        : 'Nuevo mensaje recibido'}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedConsultationForChat(item)}
                      className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Abrir Chat con Comprador</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gray-100 shadow-sm text-content-muted space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-surface-dark text-base">
                No tienes mensajes de compradores actualmente
              </h3>
              <p className="text-xs text-content-muted max-w-sm mx-auto">
                En cuanto un usuario comprador envíe una consulta desde la ficha de tus inmuebles, aparecerá aquí para que puedas responderle de inmediato.
              </p>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'ofertas' && (
        <div>
          {/* LISTA RESPONSIVA DE OFERTAS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {offers.map((offer) => (
              <SellerOfferItem
                key={offer.id}
                offer={offer}
                onAccept={onAcceptOffer}
                onReject={onRejectOffer}
                onCounterOffer={handleOpenCounterModal}
                onOpenChat={setSelectedOfferForChat}
              />
            ))}
          </div>

          {offers.length === 0 && (
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gray-100 shadow-sm text-content-muted space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mx-auto mb-2">
                <ArrowRightLeft className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-surface-dark text-base">
                No tienes ofertas formales registradas
              </h3>
              <p className="text-xs text-content-muted max-w-sm mx-auto">
                Las contrapropuestas y ofertas de compra o alquiler directo se mostrarán en esta sección.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CHAT INTERNO P2P (TELEGRAM / WHATSAPP STYLE) */}
      <InternalChatModal
        isOpen={!!selectedConsultationForChat}
        onClose={() => setSelectedConsultationForChat(null)}
        consultation={selectedConsultationForChat}
        currentUserRole="vendedor"
        onConsultationUpdated={(updated) => {
          setSelectedConsultationForChat(updated);
          reloadConsultations();
        }}
      />

      {/* MODAL DE CONTRAOFERTA ECONÓMICA */}
      <Modal
        isOpen={!!selectedOfferForCounter}
        onClose={() => setSelectedOfferForCounter(null)}
        title="Enviar Contraoferta al Comprador"
        subtitle={`Inmueble: ${selectedOfferForCounter?.propertyTitle}`}
      >
        {selectedOfferForCounter && (
          <form onSubmit={handleSendCounter} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Comprador interesado:</span>
                <span className="font-extrabold text-surface-dark">{selectedOfferForCounter.buyerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Oferta Propuesta por el Cliente:</span>
                <span className="font-black text-rose-600 text-sm">{selectedOfferForCounter.offerAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Tu Precio Publicado Original:</span>
                <span className="font-black text-gray-900">{selectedOfferForCounter.initialPrice}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">
                Tu Contrapropuesta Final ($us)
              </label>
              <input
                type="text"
                required
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder="$us 43,500"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
              />
              <p className="text-[11px] text-content-muted mt-1.5">
                La contraoferta se enviará directamente al comprador dentro de la plataforma InmoVAX.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOfferForCounter(null)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-extrabold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>Enviar Contraoferta</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL DE CHAT PARA OFERTAS FORMALES */}
      <Modal
        isOpen={!!selectedOfferForChat}
        onClose={() => setSelectedOfferForChat(null)}
        title="Conversación con Comprador"
        subtitle={selectedOfferForChat?.propertyTitle}
      >
        {selectedOfferForChat && (
          <div className="space-y-4">
            <div className="max-h-64 space-y-3 overflow-y-auto rounded-2xl bg-gray-50 p-4 text-xs sm:text-sm border border-gray-100">
              <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-white p-3 shadow-xs border border-gray-100">
                <p className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
                  {selectedOfferForChat.buyerName}
                </p>
                <p className="mt-1 text-content-main leading-relaxed">
                  {selectedOfferForChat.message}
                </p>
              </div>
              {(sentMessages[selectedOfferForChat.id] || []).map((message, index) => (
                <div
                  key={`${message}-${index}`}
                  className="ml-auto max-w-[85%] rounded-2xl rounded-tr-xs bg-primary p-3 text-white shadow-xs"
                >
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    Tú (Vendedor)
                  </p>
                  <p className="mt-0.5 leading-relaxed">{message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                placeholder="Escribe una respuesta al comprador..."
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-xs font-bold text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                const off = selectedOfferForChat;
                setSelectedOfferForChat(null);
                handleOpenCounterModal(off);
              }}
              className="w-full rounded-xl bg-blue-50 hover:bg-blue-100 py-2.5 text-xs font-extrabold text-primary transition-colors cursor-pointer"
            >
              Preparar contraoferta económica formal
            </button>
          </div>
        )}
      </Modal>

      {/* MODAL DE CHAT INTERNO P2P PARA CONSULTAS */}
      <InternalChatModal
        isOpen={!!selectedConsultationForChat}
        onClose={() => setSelectedConsultationForChat(null)}
        consultation={selectedConsultationForChat}
        currentUserRole="vendedor"
        onConsultationUpdated={(updated) => {
          setSelectedConsultationForChat(updated);
          reloadConsultations();
        }}
      />

    </div>
  );
};
