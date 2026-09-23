"use client";

import { useEffect, useRef } from 'react';
import { incrementPropertyViews } from '@/lib/propertiesStore';
import { readStoredList, writeStoredList, HISTORY_KEY, HistoryItem } from '@/lib/frontendStore';

interface PropertyViewTrackerProps {
  propertyId: string;
  title?: string;
  price?: string;
  location?: string;
  imageUrl?: string;
}

export const PropertyViewTracker = ({
  propertyId,
  title,
  price,
  location,
  imageUrl
}: PropertyViewTrackerProps) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current || !propertyId) return;
    hasTracked.current = true;

    // 1. Incrementar contador de visualizaciones del inmueble
    incrementPropertyViews(propertyId);

    // 2. Guardar en el historial de navegación del usuario
    if (title) {
      const history = readStoredList<HistoryItem>(HISTORY_KEY);
      const cleanHistory = history.filter((h) => h.id !== propertyId);
      const newEntry: HistoryItem = {
        id: propertyId,
        title,
        price,
        location,
        imageUrl,
        href: `/propiedad/${propertyId}`,
        visitedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      writeStoredList(HISTORY_KEY, [newEntry, ...cleanHistory]);
    }
  }, [propertyId, title, price, location, imageUrl]);

  return null;
};
