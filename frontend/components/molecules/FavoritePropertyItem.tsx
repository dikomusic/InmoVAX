import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Trash2, ExternalLink } from 'lucide-react';
import { FavoriteItem } from '@/lib/frontendStore';

interface FavoritePropertyItemProps {
  item: FavoriteItem;
  onRemove: (identifier: string) => void;
  onNavigate?: () => void;
}

export const FavoritePropertyItem = ({ item, onRemove, onNavigate }: FavoritePropertyItemProps) => {
  const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop';
  const href = item.href || `/propiedad/${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`;

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:border-accent/40 hover:shadow-md transition-all">
      {/* Thumbnail */}
      <div className="relative h-28 sm:h-20 w-full sm:w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 120px"
        />
        {item.contractType && (
          <span className="absolute top-1.5 left-1.5 bg-primary/90 text-content-inverse text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
            {item.contractType}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={href}
            onClick={onNavigate}
            className="text-sm sm:text-base font-extrabold text-content-main hover:text-primary transition-colors line-clamp-1"
          >
            {item.title}
          </Link>
        </div>

        {item.location && (
          <p className="flex items-center gap-1 text-xs text-content-muted mt-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">{item.location}</span>
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm sm:text-base font-black text-content-main">
            {item.price || 'Consultar precio'}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={href}
              onClick={onNavigate}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors px-2.5 py-1 rounded-lg hover:bg-primary/5"
            >
              <span>Ver ficha</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id || item.href || item.title);
              }}
              aria-label={`Eliminar ${item.title} de favoritos`}
              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Quitar de favoritos"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
