"use client";
import React, { useState } from 'react';

export const FilterSidebar = () => {
  // Estado para el interruptor (Toggle) del Mapa
  const [mostrarMapa, setMostrarMapa] = useState(true);

  // Lista de filtros desplegables simples para no repetir código
  const selectFilters = [
    "Ingresa Ubicación, Asesor, Oficina, ID",
    "Casa, Casa en Condominio",
    "Tipo Operación",
    "Número Total de Habitaciones",
    "Dormitorios",
    "Baños",
    "Estacionamientos",
    "Alberca",
    "Mascotas",
    "Clasificación"
  ];

  return (
    <aside className="w-full flex flex-col pb-10">
      
      {/* Título */}
      <h3 className="text-2xl font-extrabold text-content-main mb-4">Filtros</h3>

      {/* Toggle de Mapa */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setMostrarMapa(!mostrarMapa)}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1 ${mostrarMapa ? 'bg-[#D4C3A3]' : 'bg-gray-300'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${mostrarMapa ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
        <span className="text-sm text-content-main font-medium">Mapa</span>
      </div>

      {/* Lista de Selects (Desplegables) */}
      <div className="flex flex-col gap-2.5 mb-6">
        {selectFilters.map((placeholder, index) => (
          <div key={index} className="relative">
            <select className="w-full appearance-none border border-gray-300 text-gray-600 text-sm rounded-md px-3 py-2 outline-none focus:border-primary bg-white cursor-pointer">
              <option value="">{placeholder}</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        ))}
        
        {/* Select Especial de Moneda (con la X) */}
        <div className="relative flex items-center border border-gray-300 rounded-md bg-white pr-2 focus-within:border-primary">
          <select className="w-full appearance-none text-gray-600 text-sm bg-transparent px-3 py-2 outline-none cursor-pointer">
            <option value="usd">USD</option>
            <option value="bs">BOB</option>
          </select>
          <button className="text-gray-300 hover:text-gray-500 px-1 font-bold">×</button>
          <div className="pointer-events-none text-gray-400 pl-1 border-l border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Sección: PRECIO */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">Precio</label>
        <div className="flex gap-2 mb-2">
          <input type="number" placeholder="Desde" className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400" />
          <input type="number" placeholder="Hasta" className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400" />
        </div>
        <button className="w-full border border-gray-300 rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Aplicar
        </button>
      </div>

      {/* Sección: TERRENO */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">Terreno</label>
        <div className="flex gap-2 mb-2">
          <input type="number" placeholder="Desde" className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400" />
          <input type="number" placeholder="Hasta" className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400" />
        </div>
        <div className="flex gap-2">
          <div className="relative w-1/3">
            <select className="w-full appearance-none border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary bg-white cursor-pointer">
              <option value="m2">M²</option>
              <option value="ha">Ha</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <button className="w-2/3 border border-gray-300 rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Aplicar
          </button>
        </div>
      </div>

      {/* Sección: CONSTRUCCIÓN */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">Construcción</label>
        <div className="flex gap-2 mb-2">
          <input type="number" placeholder="Desde" className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400" />
          <input type="number" placeholder="Hasta" className="w-1/2 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary placeholder:text-gray-400" />
        </div>
        <div className="flex gap-2">
          <div className="relative w-1/3">
            <select className="w-full appearance-none border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary bg-white cursor-pointer">
              <option value="m2">M²</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <button className="w-2/3 border border-gray-300 rounded-md py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Aplicar
          </button>
        </div>
      </div>

    </aside>
  );
};  