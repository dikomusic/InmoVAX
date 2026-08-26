"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyCard } from "@/components/organisms/PropertyCard";
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState('Quiero Comprar');
  
  // Nuevo estado para controlar si la tarjetita de precios está abierta
  const [mostrarPrecios, setMostrarPrecios] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  
  // Referencia para cerrar el menú si hacemos clic afuera
  const preciosRef = useRef<HTMLDivElement>(null);

  const tabs = ['Quiero Vender', 'Quiero Comprar', 'Quiero Alquilar', 'Quiero Anticrético'];

  // Efecto para cerrar el popover de precios si haces clic en otra parte de la pantalla
  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (preciosRef.current && !preciosRef.current.contains(event.target as Node)) {
        setMostrarPrecios(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  return (
    <main className="min-h-screen">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex flex-col items-center justify-center px-4">
        
        <div className="absolute inset-0 z-0 bg-gray-900">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
            alt="Fondo Inmobiliaria"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center mt-10">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-10 drop-shadow-lg">
            Encuentra tu próximo hogar
          </h1>

          {/* TABS SUPERIORES */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActiva(tab)}
                className={`px-6 py-2.5 rounded-full border-2 text-sm sm:text-base font-bold transition-all ${
                  tabActiva === tab 
                    ? 'bg-white/20 border-white text-white backdrop-blur-md' 
                    : 'bg-black/20 border-white/50 text-white/90 hover:border-white hover:bg-white/10 backdrop-blur-md'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* BUSCADOR PRINCIPAL */}
          <div className="w-full bg-white rounded-3xl md:rounded-full p-2 md:p-3 flex flex-col md:flex-row items-center shadow-2xl">
            
            {/* Campo 1: Ciudades */}
            <div className="flex-1 w-full px-4 py-3 md:border-r border-gray-200 relative group">
              <select defaultValue="" className="w-full bg-transparent outline-none text-content-main font-medium appearance-none cursor-pointer">
                <option value="" disabled>Ciudades</option>
                <option value="lapaz">La Paz</option>
                <option value="elalto">El Alto</option>
                <option value="cochabamba">Cochabamba</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Campo 2: Tipo de Propiedad */}
            <div className="flex-1 w-full px-4 py-3 md:border-r border-gray-200 relative border-t md:border-t-0 group">
              <select defaultValue="" className="w-full bg-transparent outline-none text-content-main font-medium appearance-none cursor-pointer">
                <option value="" disabled>Tipo de Propiedad</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Campo 3: RANGO DE PRECIOS (Personalizado según tu imagen) */}
            <div className="flex-1 w-full relative border-t md:border-t-0" ref={preciosRef}>
              <button 
                onClick={() => setMostrarPrecios(!mostrarPrecios)}
                className="w-full h-full px-4 py-3 bg-transparent outline-none text-left flex justify-between items-center group cursor-pointer"
              >
                <span className={`font-medium ${precioMin || precioMax ? 'text-content-main' : 'text-gray-500'}`}>
                  {/* Si el usuario escribe algo, cambiamos el texto, si no, dice "Rango de precios" */}
                  {precioMin || precioMax 
                    ? `$${precioMin || '0'} - $${precioMax || '∞'}` 
                    : 'Rango de precios'}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${mostrarPrecios ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Tarjeta Flotante (Popover) de Mín y Máx */}
              {mostrarPrecios && (
                <div className="absolute top-full right-0 md:left-0 mt-4 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 w-full md:w-[280px] flex gap-3 animate-fade-in">
                  <input 
                    type="number" 
                    placeholder="Mín" 
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-content-main outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                  />
                  <input 
                    type="number" 
                    placeholder="Máx" 
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-content-main outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Botón de Buscar / Publicar */}
            <button 
              onClick={() => {
                if (tabActiva === 'Quiero Vender') {
                  router.push('/publicar');
                } else if (tabActiva === 'Quiero Anticrético') {
                  router.push('/anticretico/todos');
                } else if (tabActiva === 'Quiero Alquilar') {
                  router.push('/alquilar/todos');
                } else {
                  router.push('/comprar/todos');
                }
              }}
              className="w-full md:w-auto mt-2 md:mt-0 bg-primary hover:bg-primary-hover text-white p-4 md:px-6 md:h-16 rounded-3xl md:rounded-full transition-all flex items-center justify-center shadow-lg shrink-0 z-10 cursor-pointer active:scale-95 gap-2"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="font-extrabold text-sm whitespace-nowrap">
                {tabActiva === 'Quiero Vender' ? 'Publicar mi Inmueble' : 'Buscar Inmuebles'}
              </span>
            </button>

          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-extrabold text-content-main mb-10 border-l-4 border-accent pl-4">
          Propiedades Destacadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PropertyCard 
            titulo="Departamento de Lujo"
            precio="$us 45,000"
            ubicacion="Sopocachi, La Paz"
            habitaciones={3} banos={2} metros={120}
            tipoContrato="Anticrético" esNuevo={true}
          />
          <PropertyCard 
            titulo="Casa Minimalista"
            precio="$us 185,000"
            ubicacion="Calacoto, Zona Sur"
            habitaciones={4} banos={4} metros={350}
            tipoContrato="Venta" esNuevo={false}
          />
          <PropertyCard 
            titulo="Oficina Comercial"
            precio="Bs. 4,500 / mes"
            ubicacion="Miraflores, La Paz"
            habitaciones={1} banos={1} metros={60}
            tipoContrato="Alquiler" esNuevo={true}
          />
        </div>
      </section>
    </main>
  );
}