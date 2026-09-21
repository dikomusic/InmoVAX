"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center font-bold text-gray-400">
      Cargando mapa interactivo...
    </div>
  )
});

export const ClientMap = (props: any) => {
  return <MapPicker {...props} />;
};
