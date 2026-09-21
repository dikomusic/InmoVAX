"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, ArrowUpRight, Building2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { PropertyStats } from '../molecules/PropertyStats';
import {
  FAVORITES_KEY,
  HISTORY_KEY,
  readStoredList,
  writeStoredList,
  readStoredSession,
  emitStoreEvent,
  FavoriteItem,
  HistoryItem
} from '@/lib/frontendStore';

export interface PropertyCardProps {
  id?: string;
  titulo: string;
  precio: string;
  ubicacion: string;
  habitaciones?: number;
  banos?: number;
  metros?: number;
  tipoContrato: 'Venta' | 'Alquiler' | 'Anticrético';
  esNuevo?: boolean;
  imagenUrl?: string;
  href?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  imagePriority?: boolean;
}

export const PropertyCard = ({
  id,
  titulo,
  precio,
  ubicacion,
  habitaciones = 0,
  banos = 0,
  metros = 0,
  tipoContrato,
  esNuevo = false,
  imagenUrl = '',
  href = '#',
  isFavorite = false,
  onFavoriteToggle,
  imagePriority = false
}: PropertyCardProps) => {
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  // Identificador prioritario único para evitar colisiones entre propiedades con mismo título
  const resolvedId = id || (href && href !== '#' ? href : '');

  const matchesProperty = (item: { id?: string; href?: string; title?: string; imageUrl?: string }) => {
    if (resolvedId && item.id && item.id === resolvedId) return true;
    if (href && href !== '#' && item.href && item.href === href) return true;
    if (resolvedId && item.href && item.href.includes(resolvedId)) return true;
    if (item.id && href && href !== '#' && href.includes(item.id)) return true;
    // Si no tienen IDs o hrefs únicos, comparar título E imagen
    if (!resolvedId && (!href || href === '#')) {
      return item.title === titulo && item.imageUrl === imagenUrl;
    }
    return false;
  };

  useEffect(() => {
    const isFav = readStoredList<FavoriteItem>(FAVORITES_KEY).some(matchesProperty);
    setLocalFavorite(isFav);

    const handleUpdate = () => {
      const updatedFav = readStoredList<FavoriteItem>(FAVORITES_KEY).some(matchesProperty);
      setLocalFavorite(updatedFav);
    };

    window.addEventListener('inmovax:list-updated', handleUpdate);
    return () => window.removeEventListener('inmovax:list-updated', handleUpdate);
  }, [resolvedId, href, titulo, imagenUrl]);

  const favorite = onFavoriteToggle ? isFavorite : localFavorite;

  const toggleFavorite = () => {
    const session = readStoredSession();
    
    // REGLA: El visitante NO puede dar me gusta y requiere iniciar sesión
    if (!session) {
      emitStoreEvent('require-login', {
        reason: 'favorites',
        title: titulo
      });
      return;
    }

    const nextFavorite = !favorite;
    setLocalFavorite(nextFavorite);
    const favorites = readStoredList<FavoriteItem>(FAVORITES_KEY);

    if (nextFavorite) {
      const newFav: FavoriteItem = {
        id: resolvedId || href,
        title: titulo,
        price: precio,
        location: ubicacion,
        imageUrl: imagenUrl,
        contractType: tipoContrato,
        href,
        addedAt: 'Hoy'
      };
      const cleaned = favorites.filter((item) => !matchesProperty(item));
      writeStoredList(FAVORITES_KEY, [...cleaned, newFav]);
    } else {
      const cleaned = favorites.filter((item) => !matchesProperty(item));
      writeStoredList(FAVORITES_KEY, cleaned);
    }

    onFavoriteToggle?.();
  };

  const registerVisit = () => {
    const history = readStoredList<HistoryItem>(HISTORY_KEY);
    const newEntry: HistoryItem = {
      id: resolvedId || href,
      title: titulo,
      price: precio,
      location: ubicacion,
      imageUrl: imagenUrl,
      contractType: tipoContrato,
      href,
      visitedAt: 'Reciente'
    };
    const cleaned = history.filter((item) => !matchesProperty(item));
    writeStoredList(HISTORY_KEY, [newEntry, ...cleaned].slice(0, 20));
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-surface-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-64">
        {imagenUrl && imagenUrl.trim() !== '' ? (
          <Link href={href} onClick={registerVisit} className="block w-full h-full">
            <Image
              src={imagenUrl}
              alt={`Foto de ${titulo}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={imagePriority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ) : (
          <Link href={href} onClick={registerVisit} className="flex flex-col items-center justify-center w-full h-full bg-slate-100 text-slate-400 group-hover:bg-slate-200/80 transition-colors">
            <Building2 className="h-12 w-12 stroke-[1.5] mb-2 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sin fotografía</span>
          </Link>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 pointer-events-none">
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {esNuevo && <Badge text="Nuevo" variant="accent" />}
            <Badge text={tipoContrato} variant="primary" />
          </div>
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={favorite ? `Quitar ${titulo} de favoritos` : `Guardar ${titulo} en favoritos`}
            aria-pressed={favorite}
            className={`pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/95 shadow-md transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
              favorite ? 'text-rose-600' : 'text-content-main hover:text-rose-600'
            }`}
          >
            <Heart aria-hidden="true" className="h-5 w-5" fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
      </div>

      <div className="flex grow flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <Link href={href} onClick={registerVisit} className="group/title">
            <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-content-main group-hover/title:text-primary transition-colors">
              {titulo}
            </h3>
          </Link>
          <ArrowUpRight aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-primary" />
        </div>
        <p className="mb-4 flex items-center gap-1.5 text-sm font-medium text-content-muted">
          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{ubicacion}</span>
        </p>
        <p className="mb-4 text-2xl font-black tracking-tight text-primary">{precio}</p>

        <PropertyStats bedrooms={habitaciones} bathrooms={banos} area={metros} />

        <div className="mt-auto">
          <Link
            href={href}
            onClick={registerVisit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-center font-bold text-content-inverse shadow-md transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Ver detalles
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};