"use client";
import React, { useState } from 'react';
import { SellerOfferItem, SellerOffer } from '../molecules/SellerOfferItem';
import { Modal } from '../atoms/Modal';

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
  const [counterPrice, setCounterPrice] = useState('$us ');

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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* CABECERA */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-xl text-surface-dark">Bandeja de Ofertas y Propuestas Comerciales</h3>
          <p className="text-xs text-content-muted mt-0.5">Revisa las propuestas económicas que compradores y familias interesadas han enviado para tus inmuebles</p>
        </div>
        <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-xl whitespace-nowrap">
          {offers.filter(o => o.status === 'Pendiente').length} Ofertas Pendientes
        </span>
      </div>

      {/* LISTA DE OFERTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <SellerOfferItem
            key={offer.id}
            offer={offer}
            onAccept={onAcceptOffer}
            onReject={onRejectOffer}
            onCounterOffer={handleOpenCounterModal}
          />
        ))}
      </div>

      {offers.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm text-content-muted">
          <span className="text-4xl block mb-2">💬</span>
          <h4 className="font-extrabold text-surface-dark text-base">No tienes ofertas registradas actualmente</h4>
          <p className="text-xs text-content-muted mt-1">En cuanto un cliente envíe una propuesta sobre tus propiedades, aparecerá aquí.</p>
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
            <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Comprador:</span>
                <span className="font-extrabold text-surface-dark">{selectedOfferForCounter.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Oferta Propuesta por el Cliente:</span>
                <span className="font-black text-rose-600">{selectedOfferForCounter.offerAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Tu Precio Publicado Original:</span>
                <span className="font-black text-gray-900">{selectedOfferForCounter.initialPrice}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Tu Contrapropuesta Final ($us)</label>
              <input
                type="text"
                required
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder="$us 43,500"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
              />
              <p className="text-[11px] text-content-muted mt-1">El asesor oficial de InmoVax notificará inmediatamente al comprador por WhatsApp.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOfferForCounter(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow cursor-pointer active:scale-95"
              >
                Enviar Contraoferta
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
