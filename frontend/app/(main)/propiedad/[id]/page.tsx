import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export default async function PropiedadDetallePage({ params }: { params: Promise<{ id: string }> }) {
  // En el futuro, usaremos este 'id' para buscar los datos reales en tu base de datos
  const resolvedParams = await params;
  const propiedadId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-surface-light pb-20">
      
      {/* 1. GALERÍA DE FOTOS (Estilo Mosaico) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Anticrético</span>
              <span className="bg-gray-200 text-content-muted text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">ID: {propiedadId}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-main">Casa de Lujo Minimalista</h1>
            <p className="text-content-muted font-medium mt-1 flex items-center gap-2">
              <span>📍</span> Calacoto, Zona Sur, La Paz
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button variant="outline">Compartir</Button>
            <Button variant="outline">♡ Guardar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          {/* Foto Principal */}
          <div className="md:col-span-2 md:row-span-2 relative w-full h-full">
            <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop" alt="Fachada principal" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          {/* Fotos Secundarias */}
          <div className="hidden md:block relative w-full h-full">
            <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" alt="Sala de estar" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="hidden md:block relative w-full h-full rounded-tr-2xl">
            <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" alt="Cocina" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="hidden md:block relative w-full h-full">
            <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Baño" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="hidden md:block relative w-full h-full relative cursor-pointer group">
            <Image src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" alt="Jardín" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <span className="text-white font-extrabold text-lg">+12 Fotos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL Y BARRA LATERAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row gap-12">
        
        {/* Columna Izquierda: Detalles del Inmueble */}
        <div className="w-full lg:w-2/3">
          
          {/* Resumen de características */}
          <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200 mb-8">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-content-main">4</span>
              <span className="text-sm font-medium text-content-muted">Habitaciones</span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-content-main">3</span>
              <span className="text-sm font-medium text-content-muted">Baños</span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-content-main">400</span>
              <span className="text-sm font-medium text-content-muted">m² Construidos</span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-content-main">2</span>
              <span className="text-sm font-medium text-content-muted">Parqueos</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold text-content-main mb-4">Acerca de esta propiedad</h3>
            <p className="text-content-muted font-medium leading-relaxed">
              Hermosa casa soleada con diseño minimalista y amplios ventanales. Cuenta con acabados de primera calidad, pisos de madera tajibo y calefacción central. El jardín incluye un área de parrillero techado ideal para reuniones familiares.
              <br /><br />
              La documentación se encuentra completamente al día, con Folio Real saneado, sin gravámenes y listo para la firma del contrato de anticrético.
            </p>
          </div>

          {/* Amenidades */}
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold text-content-main mb-4">Amenidades</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Parrillero', 'Jardín privado', 'Seguridad 24/7', 'Pet Friendly', 'Calefacción', 'Baulera'].map((amenidad, idx) => (
                <div key={idx} className="flex items-center gap-2 text-content-main font-medium">
                  <span className="text-primary text-xl">✓</span> {amenidad}
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación (Simulación de mapa para lectura) */}
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold text-content-main mb-4">Ubicación</h3>
            <div className="w-full h-64 bg-gray-200 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-300">
              <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Mapa" fill className="object-cover opacity-50" />
              <div className="absolute bg-white px-4 py-2 rounded-xl shadow-lg font-extrabold text-content-main flex items-center gap-2">
                <span className="text-xl">📍</span> Zona Sur, Calacoto
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Tarjeta Flotante (Sticky Sidebar) */}
        <div className="w-full lg:w-1/3 relative">
          <div className="sticky top-8 bg-surface-white p-6 rounded-2xl shadow-xl border border-gray-100">
            
            <div className="mb-6">
              <span className="block text-sm font-bold text-content-muted uppercase tracking-wider mb-1">Precio del Anticrético</span>
              <h2 className="text-4xl font-extrabold text-content-main">$us 45,000</h2>
              <p className="text-sm font-medium text-green-600 mt-2">✓ Papeles al día (Verificado)</p>
            </div>

            <form className="space-y-4 border-t border-gray-100 pt-6">
              <h4 className="font-extrabold text-content-main text-lg mb-2">Contactar al Agente</h4>
              <Input type="text" placeholder="Tu nombre" required />
              <Input type="tel" placeholder="Tu celular" required />
              <textarea 
                className="w-full bg-surface-light text-content-main rounded-lg py-3 px-4 outline-none border-2 border-transparent focus:border-primary resize-none h-24"
                placeholder="Hola, me interesa agendar una visita para esta propiedad..."
              ></textarea>
              <Button type="button" variant="primary" fullWidth>
                Agendar Visita
              </Button>
              <Button type="button" variant="outline" fullWidth className="border-green-500 text-green-600 hover:bg-green-50">
                Contactar por WhatsApp
              </Button>
            </form>
            
          </div>
        </div>

      </div>
    </div>
  );
}