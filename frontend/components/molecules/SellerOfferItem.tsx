"use client";
import React from 'react';
import {
  Check,
  X,
  ArrowRightLeft,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Phone
} from 'lucide-react';

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
  onOpenChat: (offer: SellerOffer) => void;
}

export const SellerOfferItem = ({
  offer,
  onAccept,
  onReject,
  onCounterOffer,
  onOpenChat
}: SellerOfferItemProps) => {
  const statusConfig: Record<
    SellerOffer['status'],
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Pendiente: {
      label: 'Pendiente de Respuesta',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="h-3 w-3 text-amber-600" />
    },
    Aceptada: {
      label: 'Oferta Aceptada',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-600" />
    },
    Contraofertada: {
      label: 'Contraoferta Enviada',
      bg: 'bg-blue-50',
      text: 'text-primary',
      border: 'border-blue-200',
      icon: <ArrowRightLeft className="h-3 w-3 text-primary" />
    },
    Rechazada: {
      label: 'Oferta Desestimada',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <XCircle className="h-3 w-3 text-rose-600" />
    }
  };

  const currentStatus = statusConfig[offer.status] || {
    label: offer.status,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: <HelpCircle className="h-3 w-3 text-gray-500" />
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
      <div className="space-y-3">
        {/* CABECERA CON TIPO Y ESTADO */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg">
              {offer.type}
            </span>
            <span className="text-xs font-mono text-gray-400">{offer.date}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
          >
            {currentStatus.icon}
            <span>{currentStatus.label}</span>
          </div>
        </div>

        {/* TÍTULO DEL INMUEBLE E INTERESADO */}
        <div>
          <h4 className="font-extrabold text-sm sm:text-base text-surface-dark leading-snug">
            {offer.propertyTitle}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-content-muted">
            <span>Interesado:</span>
            <strong className="text-gray-900 font-bold">{offer.buyerName}</strong>
            <a
              href={`tel:${offer.buyerPhone}`}
              className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[11px]"
            >
              <Phone className="h-3 w-3" />
              <span>{offer.buyerPhone}</span>
            </a>
          </div>
        </div>

        {/* COMPARACIÓN DE PRECIOS */}
        <div className="bg-gray-50/90 rounded-2xl p-3 sm:p-3.5 grid grid-cols-2 gap-2 text-xs border border-gray-100">
          <div className="border-r border-gray-200/60 pr-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">
              Precio Publicado
            </span>
            <span className="font-bold text-gray-700 line-through text-xs sm:text-sm block mt-0.5">
              {offer.initialPrice}
            </span>
          </div>
          <div className="pl-1">
            <span className="text-[10px] text-primary uppercase font-black block">
              Oferta Propuesta
            </span>
            <span className="font-black text-emerald-600 text-sm sm:text-base block mt-0.5">
              {offer.offerAmount}
            </span>
          </div>
        </div>

        {/* MENSAJE DEL COMPRADOR */}
        {offer.message && (
          <p className="text-xs text-gray-600 italic bg-blue-50/40 p-3 rounded-2xl border border-blue-100/50 leading-relaxed">
            &ldquo;{offer.message}&rdquo;
          </p>
        )}
      </div>

      {/* ACCIONES PARA OFERTAS PENDIENTES (ADAPTABLE A CUALQUIER ANCHO) */}
      {offer.status === 'Pendiente' ? (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {/* FILA 1: DECISIÓN ECONÓMICA */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAccept(offer.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Check className="h-4 w-4 shrink-0" />
              <span className="truncate">Aceptar Oferta</span>
            </button>

            <button
              type="button"
              onClick={() => onCounterOffer(offer)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-primary font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer active:scale-95"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Contraofertar</span>
            </button>
          </div>

          {/* FILA 2: COMUNICACIÓN Y DESCARTE */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenChat(offer)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-surface-dark font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span className="truncate">Abrir chat</span>
            </button>

            <button
              type="button"
              onClick={() => onReject(offer.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200/80 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span className="truncate">Desestimar</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-content-muted">
          <span>Esta propuesta ya fue procesada.</span>
          <button
            type="button"
            onClick={() => onOpenChat(offer)}
            className="text-primary font-bold hover:underline flex items-center gap-1"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Ver historial</span>
          </button>
        </div>
      )}
    </div>
  );
};
