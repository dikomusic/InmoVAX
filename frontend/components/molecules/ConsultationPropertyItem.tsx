"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, ExternalLink, MessageCircle } from 'lucide-react';
import { ActivityStatusBadge } from '../atoms/ActivityStatusBadge';
import { ConsultationItem } from '@/lib/frontendStore';
import { InternalChatModal } from './InternalChatModal';

interface ConsultationPropertyItemProps {
  consultation: ConsultationItem;
  onNavigate?: () => void;
  onConsultationUpdated?: (updated: ConsultationItem) => void;
}

export const ConsultationPropertyItem = ({
  consultation,
  onNavigate,
  onConsultationUpdated
}: ConsultationPropertyItemProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<ConsultationItem>(consultation);

  const propertyHref = activeConsultation.propertyHref || `/propiedad/${encodeURIComponent(activeConsultation.propertyTitle.toLowerCase().replace(/\s+/g, '-'))}`;
  const sellerDisplayName = activeConsultation.sellerName || activeConsultation.advisorName || 'Propietario / Vendedor';

  const handleUpdate = (updated: ConsultationItem) => {
    setActiveConsultation(updated);
    if (onConsultationUpdated) onConsultationUpdated(updated);
  };

  return (
    <>
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:border-accent/40 hover:shadow-md transition-all">
        {/* Property & Status Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {activeConsultation.propertyImage ? (
                <Image
                  src={activeConsultation.propertyImage}
                  alt={activeConsultation.propertyTitle}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                  Foto
                </div>
              )}
            </div>

            <div className="min-w-0">
              <Link
                href={propertyHref}
                onClick={onNavigate}
                className="text-xs sm:text-sm font-extrabold text-content-main hover:text-primary transition-colors line-clamp-1"
              >
                {activeConsultation.propertyTitle}
              </Link>
              <p className="text-[11px] text-content-muted truncate mt-0.5">
                {activeConsultation.propertyLocation} • <span className="font-bold text-content-main">{activeConsultation.propertyPrice}</span>
              </p>
            </div>
          </div>

          <ActivityStatusBadge status={activeConsultation.status} className="shrink-0" />
        </div>

        {/* Message preview block */}
        <div className="bg-surface-light rounded-xl p-3 text-xs border border-gray-100">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {sellerDisplayName.slice(0, 1)}
            </div>
            <span className="font-extrabold text-content-main truncate">{sellerDisplayName}</span>
            <span className="text-[10px] text-content-muted ml-auto shrink-0">{activeConsultation.date}</span>
          </div>
          <p className="text-content-muted italic line-clamp-2 leading-relaxed">
            &ldquo;{activeConsultation.lastMessage}&rdquo;
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <Link
            href={propertyHref}
            onClick={onNavigate}
            className="inline-flex items-center gap-1 text-xs font-bold text-content-muted hover:text-primary transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Ver inmueble</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Abrir Chat Interno</span>
          </button>
        </div>
      </div>

      <InternalChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        consultation={activeConsultation}
        currentUserRole="comprador"
        onConsultationUpdated={handleUpdate}
      />
    </>
  );
};
