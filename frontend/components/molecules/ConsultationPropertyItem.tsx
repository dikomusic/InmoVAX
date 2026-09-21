import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Phone, ExternalLink } from 'lucide-react';
import { ActivityStatusBadge } from '../atoms/ActivityStatusBadge';
import { ConsultationItem } from '@/lib/frontendStore';

interface ConsultationPropertyItemProps {
  consultation: ConsultationItem;
  onNavigate?: () => void;
}

export const ConsultationPropertyItem = ({ consultation, onNavigate }: ConsultationPropertyItemProps) => {
  const propertyHref = consultation.propertyHref || `/propiedad/${encodeURIComponent(consultation.propertyTitle.toLowerCase().replace(/\s+/g, '-'))}`;
  const whatsappUrl = `https://wa.me/${consultation.advisorPhone}?text=${encodeURIComponent(
    `Hola ${consultation.advisorName}, consulto por la propiedad "${consultation.propertyTitle}" en InmoVAX.`
  )}`;

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:border-accent/40 hover:shadow-md transition-all">
      {/* Property & Status Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={consultation.propertyImage}
              alt={consultation.propertyTitle}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>

          <div className="min-w-0">
            <Link
              href={propertyHref}
              onClick={onNavigate}
              className="text-xs sm:text-sm font-extrabold text-content-main hover:text-primary transition-colors line-clamp-1"
            >
              {consultation.propertyTitle}
            </Link>
            <p className="text-[11px] text-content-muted truncate mt-0.5">
              {consultation.propertyLocation} • <span className="font-bold text-content-main">{consultation.propertyPrice}</span>
            </p>
          </div>
        </div>

        <ActivityStatusBadge status={consultation.status} className="shrink-0" />
      </div>

      {/* Message preview block */}
      <div className="bg-surface-light rounded-xl p-3 text-xs border border-gray-100">
        <div className="flex items-center gap-2 mb-1.5">
          {consultation.advisorAvatar ? (
            <div className="relative h-5 w-5 rounded-full overflow-hidden shrink-0">
              <Image src={consultation.advisorAvatar} alt={consultation.advisorName} fill className="object-cover" />
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {consultation.advisorName.slice(0, 1)}
            </div>
          )}
          <span className="font-extrabold text-content-main truncate">{consultation.advisorName}</span>
          <span className="text-[10px] text-content-muted ml-auto shrink-0">{consultation.date}</span>
        </div>
        <p className="text-content-muted italic line-clamp-2 leading-relaxed">
          &ldquo;{consultation.lastMessage}&rdquo;
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

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          <Phone className="h-3 w-3" />
          <span>Chatear por WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
