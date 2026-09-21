"use client";
import React, { useState } from 'react';
import { SellerOfferItem, SellerOffer } from '../molecules/SellerOfferItem';
import { Modal } from '../atoms/Modal';
import { MessageCircle, Send, ArrowRightLeft } from 'lucide-react';

interface SellerOffersSectionProps {
  offers: SellerOffer[];
  onAcceptOffer: (id: string) => void;
  onRejectOffer: (id: string) => void;
  onCounterOfferSubmit: (id: string, counterPrice: string) => void;
}

export const SellerOffersSection = ({
  offers,
  onAcceptOffer,
  onRejectOffer,
  onCounterOfferSubmit
}: SellerOffersSectionProps) => {
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<SellerOffer | null>(null);
  const [selectedOfferForChat, setSelectedOfferForChat] = useState<SellerOffer | null>(null);
  const [counterPrice, setCounterPrice] = useState('$us ');
  const [chatMessage, setChatMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<Record<string, string[]>>({});

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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* CABECERA */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-xl sm:text-2xl text-surface-dark tracking-tight">
            Consultas y Propuestas Económicas
          </h2>
          <p className="text-xs text-content-muted mt-0.5">
            Negocia el precio de tus inmuebles directamente con compradores y coordina visitas presenciales.
          </p>
        </div>
        <span className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl whitespace-nowrap shrink-0">
          {pendingOffersCount} conversaciones pendientes
        </span>
      </div>

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
            <MessageCircle className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-surface-dark text-base">
            No tienes ofertas registradas actualmente
          </h3>
          <p className="text-xs text-content-muted max-w-sm mx-auto">
            En cuanto un cliente envíe una propuesta sobre tus propiedades, aparecerá aquí para que puedas aceptarla o contraofertar.
          </p>
        </div>
      )}

      {/* MODAL DE CONTRAOFERTA */}
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
                El asesor oficial de InmoVAX notificará inmediatamente al comprador por WhatsApp.
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

      {/* MODAL DE CHAT */}
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

    </div>
  );
};
