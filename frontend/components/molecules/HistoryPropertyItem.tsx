import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, X, ArrowUpRight } from 'lucide-react';
import { HistoryItem } from '@/lib/frontendStore';

interface HistoryPropertyItemProps {
  item: HistoryItem;
  onRemove: (identifier: string) => void;
  onNavigate?: () => void;
}

export const HistoryPropertyItem = ({ item, onRemove, onNavigate }: HistoryPropertyItemProps) => {
  const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop';
  const href = item.href || `/propiedad/${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`;

  return (
    <div className="group flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="64px"
          />
        </div>

        <div className="min-w-0">
          <Link
            href={href}
            onClick={onNavigate}
            className="text-xs sm:text-sm font-extrabold text-content-main hover:text-primary transition-colors line-clamp-1 flex items-center gap-1"
          >
            <span>{item.title}</span>
            <ArrowUpRight className="h-3 w-3 text-gray-400 group-hover:text-primary shrink-0" />
          </Link>

          {item.location && (
            <p className="flex items-center gap-1 text-[11px] text-content-muted mt-0.5">
              <MapPin className="h-3 w-3 shrink-0 text-accent" />
              <span className="truncate">{item.location}</span>
            </p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-black text-content-main">
              {item.price || 'Ver detalles'}
            </span>
            <span className="text-[10px] text-content-muted flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              <span>{item.visitedAt || 'Visto recientemente'}</span>
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id || item.href || item.title)}
        aria-label={`Eliminar ${item.title} del historial`}
        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
        title="Quitar del historial"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
