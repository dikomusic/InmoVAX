"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Función para crear un pin de precio con TUS COLORES
const createPriceIcon = (price: string) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background-color: #0B1B3D; 
        color: white; 
        font-weight: 800; 
        padding: 4px 8px; 
        border-radius: 8px; 
        border: 2px solid #FACC15;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        font-size: 12px;
        white-space: nowrap;
        position: relative;
      ">
        $us ${price}
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #FACC15;
        "></div>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 30], // Centrado en la punta de la flecha
  });
};

export const ResultsMap = () => {
  const center = { lat: -16.5000, lng: -68.1193 }; // La Paz

  // Propiedades de ejemplo para el mapa
  const propiedades = [
    { id: 1, lat: -16.5020, lng: -68.1210, precio: "155K", titulo: "Depto en Sopocachi" },
    { id: 2, lat: -16.5350, lng: -68.0920, precio: "320K", titulo: "Casa en Achumani" },
    { id: 3, lat: -16.5400, lng: -68.0850, precio: "450K", titulo: "Casa Lujo Calacoto" },
    { id: 4, lat: -16.4950, lng: -68.1350, precio: "85K",  titulo: "Oficina Centro" },
  ];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {propiedades.map((prop) => (
          <Marker key={prop.id} position={[prop.lat, prop.lng]} icon={createPriceIcon(prop.precio)}>
            <Popup>
              <div className="font-bold text-content-main">{prop.titulo}</div>
              <div className="text-primary font-extrabold">$us {prop.precio},000</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};