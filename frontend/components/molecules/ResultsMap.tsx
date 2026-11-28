"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { PropertyListing } from '@/components/data/propertyListings';
import { resolvePropertyCoordinates, LA_PAZ_ZONE_COORDINATES } from '@/lib/geoCoordinates';
import { MapPin, BedDouble, Bath, Maximize2, ExternalLink } from 'lucide-react';

interface ResultsMapProps {
  properties?: PropertyListing[];
  selectedPropertyId?: string;
  onSelectProperty?: (id: string) => void;
  className?: string;
}

// Formateador compacto de precio para el pin
const formatCompactPrice = (priceStr: string, moneda: string = 'USD') => {
  const digits = priceStr.replace(/[^0-9]/g, '');
  const num = Number(digits);
  if (!num || isNaN(num)) return priceStr.slice(0, 10);
  
  const prefix = moneda === 'BOB' || priceStr.toLowerCase().includes('bs') ? 'Bs' : '$us';
  if (num >= 1000000) {
    return `${prefix} ${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${prefix} ${Math.round(num / 1000)}K`;
  }
  return `${prefix} ${num}`;
};

// Creador de pines interactivos de acuerdo al tipo de contrato
const createPinIcon = (label: string, contractType: string, isSelected: boolean = false) => {
  let bgColor = '#0B1B3D'; // Default Venta (Navy)
  let borderColor = '#FACC15'; // Gold
  let textColor = '#FFFFFF';

  const lower = contractType.toLowerCase();
  if (lower.includes('anticr')) {
    bgColor = '#047857'; // Emerald 700
    borderColor = '#FDE047'; // Bright Yellow
  } else if (lower.includes('alquiler')) {
    bgColor = '#024EFF'; // InmoVAX Royal Blue
    borderColor = '#FFFFFF';
  }

  const selectedRing = isSelected ? 'box-shadow: 0 0 0 4px #024EFF, 0 8px 16px rgba(0,0,0,0.4); transform: scale(1.12);' : 'box-shadow: 0 4px 10px rgba(0,0,0,0.3);';

  return L.divIcon({
    className: 'custom-property-pin',
    html: `
      <div style="
        background-color: ${bgColor}; 
        color: ${textColor}; 
        font-weight: 800; 
        padding: 5px 10px; 
        border-radius: 9999px; 
        border: 2px solid ${borderColor};
        ${selectedRing}
        font-size: 11px;
        white-space: nowrap;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease;
        cursor: pointer;
      ">
        <span>${label}</span>
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${bgColor};
        "></div>
      </div>
    `,
    iconSize: [84, 32],
    iconAnchor: [42, 32],
    popupAnchor: [0, -32]
  });
};

// Componente para reajustar tamaño de Leaflet y auto-encuadrar coordenadas
function MapController({
  properties,
  selectedPropertyId
}: {
  properties: PropertyListing[];
  selectedPropertyId?: string;
}) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  // Asegura que las baldosas de Leaflet calculen correctamente las dimensiones de pantalla
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // Encuadre inicial o al cambiar de catálogo
  useEffect(() => {
    if (properties.length === 0) return;

    const coords = properties.map((p) => resolvePropertyCoordinates(p));
    const validCoords = coords.filter((c) => !isNaN(c.lat) && !isNaN(c.lng));

    if (validCoords.length === 0) return;

    // Si hay una propiedad seleccionada, enfocarla directamente
    if (selectedPropertyId) {
      const selected = properties.find((p) => p.id === selectedPropertyId);
      if (selected) {
        const c = resolvePropertyCoordinates(selected);
        map.flyTo([c.lat, c.lng], 16, { animate: true, duration: 1 });
        return;
      }
    }

    // Encuadrar todas las propiedades con padding generoso
    const bounds = L.latLngBounds(validCoords.map((c) => [c.lat, c.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: hasFittedRef.current
      });
      hasFittedRef.current = true;
    }
  }, [properties, selectedPropertyId, map]);

  return null;
}

export const ResultsMap: React.FC<ResultsMapProps> = ({
  properties = [],
  selectedPropertyId,
  onSelectProperty,
  className = ''
}) => {
  const defaultCenter = LA_PAZ_ZONE_COORDINATES['la paz'];

  // Procesar cada propiedad con sus coordenadas reales y pin formateado
  const mapItems = useMemo(() => {
    return properties.map((prop) => {
      const coords = resolvePropertyCoordinates(prop);
      const compactPrice = formatCompactPrice(prop.precio, prop.moneda);
      return {
        prop,
        coords,
        compactPrice
      };
    });
  }, [properties]);

  return (
    <div className={`relative w-full h-full min-h-[380px] bg-slate-100 ${className}`}>
      {/* Barra superior de control y conteo */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 text-xs font-black text-surface-dark flex items-center gap-2 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{mapItems.length} inmuebles en mapa</span>
        </div>
      </div>

      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController properties={properties} selectedPropertyId={selectedPropertyId} />

        {mapItems.map(({ prop, coords, compactPrice }) => {
          const isSelected = selectedPropertyId === prop.id;
          const pinIcon = createPinIcon(compactPrice, prop.tipoContrato, isSelected);

          return (
            <Marker
              key={prop.id}
              position={[coords.lat, coords.lng]}
              icon={pinIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectProperty) onSelectProperty(prop.id);
                }
              }}
            >
              <Popup className="custom-leaflet-popup" minWidth={260} maxWidth={300}>
                <div className="p-0 overflow-hidden rounded-xl font-sans text-left">
                  {/* Imagen de cabecera del inmueble */}
                  {prop.imagenUrl && (
                    <div className="relative w-full h-32 bg-slate-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prop.imagenUrl}
                        alt={prop.titulo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-dark/90 text-white shadow-xs">
                        {prop.tipoContrato}
                      </span>
                      {prop.isVerified && (
                        <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                          Legal DDRR
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    <p className="text-xs font-bold text-content-muted flex items-center gap-1 mb-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      {prop.ubicacion || prop.direccion || 'La Paz'}
                    </p>

                    <h4 className="text-sm font-extrabold text-surface-dark line-clamp-1 mb-2">
                      {prop.titulo}
                    </h4>

                    {/* Especificaciones */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mb-3 border-y border-slate-100 py-1.5">
                      {prop.habitaciones !== undefined && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-slate-400" /> {prop.habitaciones} dorms
                        </span>
                      )}
                      {prop.banos !== undefined && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.banos} bñ
                        </span>
                      )}
                      {prop.metros && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {prop.metros} m²
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-content-muted block font-semibold">Precio</span>
                        <span className="text-base font-black text-primary">
                          {prop.precio}
                        </span>
                      </div>

                      <Link
                        href={`/propiedad/${prop.id}`}
                        className="inline-flex items-center gap-1 text-xs font-black bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        <span>Ver Inmueble</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
