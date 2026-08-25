"use client";
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import dynamic from 'next/dynamic';
import { AddressAutocomplete } from '../molecules/AddressAutocomplete';
// Importamos el mapa de forma dinámica para que no rompa el renderizado del servidor (SSR) de Next.js
const MapPicker = dynamic(() => import('../molecules/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center font-bold text-gray-400">Cargando mapa interactivo...</div>
}); 
export const PublishPropertyForm = () => {
  const [paso, setPaso] = useState(1);
  const [coordenadas, setCoordenadas] = useState<{lat: number, lng: number} | null>(null);
  const [direccionFormateada, setDireccionFormateada] = useState("");
  const avanzar = () => setPaso(paso + 1);
  const retroceder = () => setPaso(paso - 1);

  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Al hacer un console.log, ESLint ya considera que la variable "está siendo usada"
    console.log("Datos listos para enviar a la Base de Datos:", {
      coordenadas,
      direccionFormateada
    });
    
    alert("¡Propiedad enviada a revisión exitosamente!");
  };

  return (
    <div className="bg-surface-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100 w-full max-w-4xl mx-auto text-left">
      
      {/* Indicador de Pasos (Progress Bar) */}
      <div className="mb-8">
        <div className="hidden sm:flex justify-between mb-2 px-2">
          <span className={`text-xs md:text-sm font-bold ${paso >= 1 ? 'text-primary' : 'text-content-muted'}`}>1. Principal</span>
          <span className={`text-xs md:text-sm font-bold ${paso >= 2 ? 'text-primary' : 'text-content-muted'}`}>2. Ubicación</span>
          <span className={`text-xs md:text-sm font-bold ${paso >= 3 ? 'text-primary' : 'text-content-muted'}`}>3. Características</span>
          <span className={`text-xs md:text-sm font-bold ${paso >= 4 ? 'text-primary' : 'text-content-muted'}`}>4. Multimedia & Legal</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full flex overflow-hidden">
          <div className={`h-full bg-primary transition-all duration-300 ${paso === 1 ? 'w-1/4' : paso === 2 ? 'w-2/4' : paso === 3 ? 'w-3/4' : 'w-full'}`}></div>
        </div>
      </div>

      <form onSubmit={paso === 4 ? enviarFormulario : (e) => { e.preventDefault(); avanzar(); }}>
        
        {/* ================= PASO 1: INFORMACIÓN PRINCIPAL ================= */}
        {paso === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-content-main mb-4 border-b pb-2">Información Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Tipo de Operación</label>
                <Select options={[
                  { value: 'anticretico', label: 'Anticrético' },
                  { value: 'venta', label: 'Venta' },
                  { value: 'alquiler', label: 'Alquiler' }
                ]} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Tipo de Inmueble</label>
                <Select options={[
                  { value: 'departamento', label: 'Departamento' },
                  { value: 'casa', label: 'Casa' },
                  { value: 'terreno', label: 'Terreno' },
                  { value: 'oficina', label: 'Oficina' },
                  { value: 'local', label: 'Local Comercial' }
                ]} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-content-main mb-2">Moneda</label>
                <Select options={[
                  { value: 'usd', label: '$us (Dólares)' },
                  { value: 'bs', label: 'Bs (Bolivianos)' }
                ]} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-content-main mb-2">Precio Base</label>
                <Input type="number" placeholder="Ej. 45000" required />
              </div>
              <div className="md:col-span-1 flex items-center h-13 px-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-content-main">
                  <input type="checkbox" className="w-5 h-5 accent-primary rounded cursor-pointer" />
                  Precio Negociable
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Descripción Comercial</label>
              <textarea 
                className="w-full bg-surface-white text-content-main rounded-lg py-3 px-4 outline-none border-2 border-gray-200 focus:border-primary resize-none h-28 transition-colors"
                placeholder="Ej. Hermoso departamento cálido con sol de mañana y vista a la ciudad..."
                required
              ></textarea>
            </div>
          </div>
        )}

        {/* ================= PASO 2: UBICACIÓN EXACTA ================= */}
        {paso === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-content-main mb-4 border-b pb-2">Ubicación Exacta</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">1. Busca tu Zona (Ej. Irpavi, Sopocachi)</label>
                <AddressAutocomplete 
                  placeholder="Escribe la zona para mover el mapa..." 
                  onAddressSelect={(lat, lng, address) => {
                    setCoordenadas({lat, lng});
                    setDireccionFormateada(address); 
                  }} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">2. Calle específica y número</label>
                <Input type="text" placeholder="Ej. Calle 10, Edificio Los Pinos, Piso 3" required />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mt-1 cursor-pointer text-sm font-medium text-content-muted">
                <input type="checkbox" className="w-4 h-4 accent-primary rounded cursor-pointer" />
                Ocultar calle exacta al público (Solo mostrar zona general)
              </label>
            </div>

            <div className="mt-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-content-main">3. Afina la ubicación (Arrastra el pin)</label>
              </div>
              
              <MapPicker 
                externalCenter={coordenadas}
                onLocationSelect={(lat, lng) => setCoordenadas({lat, lng})} 
              />
              <p className="text-xs text-content-muted mt-2">Puedes hacer clic en cualquier parte o arrastrar el pin para marcar la puerta exacta del inmueble.</p>
            </div>
          </div>
        )}

        {/* ================= PASO 3: CARACTERÍSTICAS ================= */}
        {paso === 3 && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-content-main mb-4 border-b pb-2">Características y Distribución</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-bold text-content-main mb-2">Sup. Construida (m²)</label>
                <Input type="number" placeholder="Ej. 120" required />
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm font-bold text-content-main mb-2">Sup. Terreno (m²) <span className="text-xs font-normal text-gray-400">Solo casas</span></label>
                <Input type="number" placeholder="Ej. 300" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Habitaciones</label>
                <Input type="number" placeholder="0" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Baños</label>
                <Input type="number" placeholder="0" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Parqueos</label>
                <Input type="number" placeholder="0" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-content-main mb-4">Amenidades (Selecciona las que apliquen)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Baulera', 'Ascensor', 'Seguridad 24/7', 'Parrillero', 'Jardín', 'Pet Friendly (Mascotas)'].map(amenidad => (
                  <label key={amenidad} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-surface-light transition-colors">
                    <input type="checkbox" className="w-5 h-5 accent-primary rounded cursor-pointer" />
                    <span className="text-sm font-bold text-content-main">{amenidad}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= PASO 4: MULTIMEDIA & LEGAL ================= */}
        {paso === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-content-main mb-4 border-b pb-2">Multimedia y Legal</h2>
            
            <div className="border-2 border-dashed border-primary/50 rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-4xl mb-3 block">📸</span>
              <p className="font-bold text-content-main mb-1">Sube al menos 5 fotos</p>
              <p className="text-sm text-content-muted mb-4">Fachada, sala, cocina, cuartos y baños.</p>
              <Button type="button" variant="outline">Seleccionar Archivos</Button>
            </div>

            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Enlace de Tour Virtual 3D (Opcional)</label>
              <Input type="url" placeholder="https://my.matterport.com/show/..." icon={<span className="text-xl">🥽</span>} />
            </div>

            <div className="bg-surface-light p-5 rounded-lg border border-gray-200 mt-6">
              <label className="block text-sm font-bold text-content-main mb-3">Estado Legal del Inmueble (Para Venta/Anticrético)</label>
              <div className="flex flex-col space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="legal" className="w-5 h-5 mt-0.5 accent-primary cursor-pointer" required />
                  <span className="text-sm font-medium">Sí, cuenta con Folio Real al día, sin gravámenes y con impuestos pagados.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="legal" className="w-5 h-5 mt-0.5 accent-primary cursor-pointer" />
                  <span className="text-sm font-medium">No, la documentación está en trámite o tiene un gravamen.</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Navegación Inferior */}
        <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
          {paso > 1 ? (
            <Button type="button" variant="ghost" onClick={retroceder}>
              ← Anterior
            </Button>
          ) : <div></div>}
          
          {paso < 4 ? (
            <Button type="submit" variant="primary">
              Siguiente Paso →
            </Button>
          ) : (
            <Button type="submit" variant="accent">
              Publicar Inmueble
            </Button>
          )}
        </div>

      </form>
    </div>
  );
};