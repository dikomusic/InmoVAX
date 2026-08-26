import React from 'react';

export interface SellerOffer {
  id: string;
  propertyTitle: string;
  buyerName: string;
  buyerPhone: string;
  offerAmount: string;
  initialPrice: string;
  date: string;
  message: string;
  status: 'Pendiente' | 'Aceptada' | 'Contraofertada' | 'Rechazada';
  type: 'Anticrético' | 'Venta' | 'Alquiler';
}

interface SellerOfferItemProps {
  offer: SellerOffer;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCounterOffer: (offer: SellerOffer) => void;
}

export const SellerOfferItem = ({
  offer,
  onAccept,
  onReject,
  onCounterOffer
}: SellerOfferItemProps) => {
  const statusStyles = {
    Pendiente: 'bg-amber-50 text-amber-800 border-amber-200',
    Aceptada: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Contraofertada: 'bg-blue-50 text-primary border-blue-200',
    Rechazada: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
              {offer.type}
            </span>
            <span className="text-xs font-mono text-gray-400 ml-2">{offer.date}</span>
          </div>
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${statusStyles[offer.status]}`}>
            ● {offer.status}
          </span>
        </div>

        <div className="mt-3">
          <h4 className="font-extrabold text-sm text-surface-dark">{offer.propertyTitle}</h4>
          <p className="text-xs text-content-muted mt-0.5 font-medium">Interesado: <strong className="text-gray-900">{offer.buyerName}</strong> ({offer.buyerPhone})</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3.5 my-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Precio Publicado</span>
            <span className="font-bold text-gray-700 line-through">{offer.initialPrice}</span>
          </div>
          <div>
            <span className="text-[10px] text-primary uppercase font-black block">Oferta Propuesta</span>
            <span className="font-black text-emerald-600 text-sm">{offer.offerAmount}</span>
          </div>
        </div>

        {offer.message && (
          <p className="text-xs text-gray-600 italic bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/50">
            &ldquo;{offer.message}&rdquo;
          </p>
        )}
      </div>

      {offer.status === 'Pendiente' && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onAccept(offer.id)}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            ✓ Aceptar Oferta
          </button>
          <button
            type="button"
            onClick={() => onCounterOffer(offer)}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-primary font-extrabold text-xs rounded-xl transition-colors cursor-pointer active:scale-95"
          >
            Contraofertar
          </button>
          <button
            type="button"
            onClick={() => onReject(offer.id)}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Rechazar Oferta"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
