"use client";
// 1. Eliminamos 'useState' y 'useRef' que ya no usaremos
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customPinIcon = L.divIcon({
  html: `<div style="margin-top:-32px; margin-left:-16px;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E11D48" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#FFFFFF"/></svg></div>`,
  className: 'bg-transparent',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

interface MapPickerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  externalCenter?: { lat: number; lng: number } | null;
  readOnly?: boolean;
}

const LocationMarker = ({ onLocationSelect, externalCenter, readOnly }: MapPickerProps) => {
  const map = useMap();

  // 2. Ya no usamos setPosition, solo volamos hacia la coordenada que manda el papá
  useEffect(() => {
    if (externalCenter) {
      map.flyTo(externalCenter, 15, { animate: true, duration: 1.5 });
    }
  }, [externalCenter, map]);

  useMapEvents({
    click(e) {
      if (!readOnly && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  const eventHandlers = useMemo(() => ({
    // 3. Cambiamos el "any" por el tipo correcto de Leaflet: L.DragEndEvent
    dragend(e: L.DragEndEvent) {
      if (readOnly || !onLocationSelect) return;
      const marker = e.target;
      const position = marker.getLatLng();
      // Le mandamos las nuevas coordenadas al papá cuando terminas de arrastrar
      onLocationSelect(position.lat, position.lng);
    },
  }), [onLocationSelect, readOnly]);

  // Usamos externalCenter directamente como la única fuente de la verdad
  return externalCenter ? (
    <Marker 
      draggable={!readOnly} 
      eventHandlers={eventHandlers} 
      position={externalCenter} 
      icon={customPinIcon} 
    />
  ) : null;
};

const MapPicker = ({ onLocationSelect, externalCenter, readOnly }: MapPickerProps) => {
  const defaultCenter = { lat: -16.5000, lng: -68.1193 };

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-gray-200 z-0 relative">
      <MapContainer center={externalCenter || defaultCenter} zoom={externalCenter ? 15 : 13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onLocationSelect={onLocationSelect} externalCenter={externalCenter} readOnly={readOnly} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;