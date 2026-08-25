"use client";
import React, { useState, useEffect } from 'react';

// Interfaz ampliada para recibir los detalles de la dirección
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  name: string;
  type: string;
  address?: {
    city?: string;
    state?: string;
    town?: string;
  };
}

interface AddressAutocompleteProps {
  onAddressSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
}

// Función para traducir el tipo de lugar que nos devuelve el mapa
const traducirTipoLugar = (tipo: string) => {
  const diccionario: Record<string, string> = {
    suburb: 'Barrio',
    residential: 'Zona Residencial',
    administrative: 'Departamento / Municipio',
    city: 'Ciudad',
    town: 'Población',
    road: 'Calle / Avenida',
    commercial: 'Zona Comercial',
  };
  return diccionario[tipo] || 'Ubicación';
};

export const AddressAutocomplete = ({ onAddressSelect, placeholder }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 1) {
        setIsSearching(true);
        try {
          // Agregamos "&addressdetails=1" para obtener ciudad y tipo de lugar
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', La Paz, Bolivia')}&limit=8&addressdetails=1`);
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error buscando dirección:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    // Formateamos un nombre limpio para el input
    const ubicacionPrincipal = result.address?.city || result.address?.town || result.address?.state || 'La Paz';
    const nombreLimpio = `${result.name}, ${ubicacionPrincipal}`;
    
    setQuery(nombreLimpio);
    setShowDropdown(false);
    onAddressSelect(lat, lon, nombreLimpio);
  };

  const limpiarBusqueda = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full z-50">
      
      {/* Contenedor del Input con ícono X */}
      <div className="relative flex items-center w-full">
        <input 
          type="text" 
          placeholder={placeholder || "Ej. Obrajes, Calle 1"} 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-surface-white text-content-main rounded-lg py-3 pl-4 pr-10 outline-none border-2 border-gray-200 focus:border-primary transition-colors"
          required
        />
        {/* Botón X para borrar */}
        {query && (
          <button 
            type="button" 
            onClick={limpiarBusqueda}
            className="absolute right-3 text-gray-400 hover:text-gray-600 font-bold"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Lista desplegable estilo Airbnb / Imagen de referencia */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-md shadow-xl overflow-y-auto max-h-64 z-50 
                       [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
          {results.map((result, index) => {
            
            // Extraemos datos para mostrar
            const ubicacionPrincipal = result.address?.city || result.address?.town || result.address?.state || 'La Paz';
            const titulo = `${result.name}, ${ubicacionPrincipal}`;
            const subtitulo = traducirTipoLugar(result.type);

            return (
              <li 
                key={index}
                onClick={() => handleSelect(result)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-surface-light cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
              >
                {/* Ícono de Pin delineado (Outline) */}
                <div className="text-gray-500 shrink-0">
                  <svg xmlns="http://www.htm" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                
                {/* Textos */}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-800 truncate">{titulo}</span>
                  <span className="text-xs text-gray-500 truncate">{subtitulo}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
      {isSearching && <p className="text-xs text-primary mt-1 absolute font-bold">Buscando zonas...</p>}
    </div>
  );
};