"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyCard } from '../organisms/PropertyCard';
import { ManagedProperty } from '@/lib/propertiesStore';

interface PropertyCarouselProps {
  properties: ManagedProperty[];
}

export const PropertyCarousel = ({ properties }: PropertyCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Calcular índice aproximado
    const itemWidth = clientWidth / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    if (itemWidth > 0) {
      const idx = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(idx, properties.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [properties]);

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    // Desplazar por el ancho visible de una o varias tarjetas
    const scrollAmount = direction === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const itemWidth = clientWidth / visibleCards;
    scrollRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
  };

  if (!properties || properties.length === 0) return null;

  return (
    <div className="relative w-full max-w-full group">
      {/* Botón Flecha Izquierda */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy('left')}
          aria-label="Ver propiedades anteriores"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/95 text-surface-dark shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-gray-100 cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft className="h-6 w-6 text-surface-dark" />
        </button>
      )}

      {/* Botón Flecha Derecha */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy('right')}
          aria-label="Ver siguientes propiedades"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/95 text-surface-dark shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-gray-100 cursor-pointer backdrop-blur-xs"
        >
          <ChevronRight className="h-6 w-6 text-surface-dark" />
        </button>
      )}

      {/* Contenedor con Scroll Horizontal Táctil y Smooth */}
      <div
        ref={scrollRef}
        className="w-full flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333333%-16px)] shrink-0 snap-start transition-all"
          >
            <PropertyCard
              id={prop.id}
              titulo={prop.title}
              precio={prop.price}
              ubicacion={prop.zone}
              habitaciones={prop.habitaciones ?? 3}
              banos={prop.banos ?? 2}
              metros={prop.metros ?? 120}
              tipoContrato={prop.type}
              esNuevo={prop.esNuevo ?? true}
              href={`/propiedad/${prop.id}`}
              imagenUrl={prop.image}
            />
          </div>
        ))}
      </div>

      {/* Indicadores de Páginas (Puntos / Dots) */}
      <div className="flex justify-center items-center gap-2 pt-2">
        {properties.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Ir a propiedad ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? 'w-6 bg-primary'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
