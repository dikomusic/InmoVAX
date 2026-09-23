import React from 'react';
import Image from 'next/image';
import { Check, Heart, MapPin, MessageCircle, Building2, ShieldCheck, CameraOff, Share2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { fetchPropertyById } from '@/components/data/propertyListings';
import Link from 'next/link';
import { ClientMap } from '@/components/molecules/ClientMap';
import { PropertyContactForm } from '@/components/molecules/PropertyContactForm';
import { PropertyViewTracker } from '@/components/atoms/PropertyViewTracker';

export default async function PropiedadDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const propiedadId = resolvedParams.id;
  const property = await fetchPropertyById(propiedadId);

  if (!property) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-surface-dark mb-2">Inmueble no encontrado</h1>
        <p className="text-sm text-content-muted max-w-md mb-6">
          La propiedad con identificador &quot;{propiedadId}&quot; no existe en la base de datos de InmoVAX o no está disponible.
        </p>
        <Link href="/comprar/todos">
          <Button variant="primary">Explorar Inmuebles Activos</Button>
        </Link>
      </div>
    );
  }

  const titulo = property.titulo;
  const ubicacion = property.ubicacion;
  const direccion = property.direccion || property.ubicacion;
  const precio = property.precio;
  const tipoContrato = property.tipoContrato;
  const habitaciones = property.habitaciones;
  const banos = property.banos;
  const metros = property.metros;
  const estacionamientos = property.estacionamientos;
  const folioReal = property.folioReal;

  // Extraer fotografías reales sin inventar imágenes de casas ficticias
  const galeria: string[] = property.galeria && property.galeria.length > 0
    ? property.galeria.filter((img) => typeof img === 'string' && img.trim() !== '')
    : (property.imagenUrl && property.imagenUrl.trim() !== '' ? [property.imagenUrl] : []);

  // Descripción real del autor o resumen fidedigno sin datos inventados
  const descripcion = property.descripcion && property.descripcion.trim() !== ''
    ? property.descripcion
    : `Inmueble en modalidad de ${tipoContrato.toLowerCase()} ubicado en ${ubicacion}. Documentación registrada con Folio Real ${folioReal || 'disponible para verificación notarial'}.`;

  // Amenidades reales seleccionadas por el propietario
  const amenidades: string[] = property.amenidades && property.amenidades.length > 0
    ? property.amenidades
    : [];

  return (
    <div className="min-h-screen bg-surface-light pb-20">
      <PropertyViewTracker
        propertyId={property.id}
        title={property.titulo}
        price={property.precio}
        location={property.ubicacion}
        imageUrl={property.imagenUrl}
      />
      
      {/* 1. CABECERA & GALERÍA DE FOTOS REALES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {tipoContrato}
              </span>
              <span className="bg-gray-200 text-content-muted text-xs font-mono font-bold px-3 py-1 rounded-full">
                ID: {property.id}
              </span>
              {folioReal && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  DDRR Verificado
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main">
              {titulo}
            </h1>
            <p className="text-content-muted font-medium mt-1 flex items-center gap-1.5 text-sm sm:text-base">
              <MapPin className="w-4 h-4 text-primary shrink-0" /> {direccion}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="text-xs sm:text-sm">
              <Share2 className="w-4 h-4 mr-1 inline" /> Compartir
            </Button>
            <Button variant="outline" className="text-xs sm:text-sm">
              <Heart className="w-4 h-4 mr-1 inline" /> Guardar
            </Button>
          </div>
        </div>

        {/* CONTENEDOR DE FOTOS REALES (CERO FOTOS FALSAS) */}
        {galeria.length === 0 ? (
          <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center p-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <CameraOff className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold text-content-main">Sin fotografías registradas</h3>
            <p className="text-xs sm:text-sm text-content-muted max-w-md mt-1 leading-relaxed">
              El propietario no adjuntó fotografías al momento de publicar. La información legal con Folio Real <span className="font-mono font-semibold text-slate-700">{folioReal || 'en trámite'}</span> y sus especificaciones están disponibles a continuación.
            </p>
          </div>
        ) : galeria.length === 1 ? (
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden bg-gray-100 shadow-md border border-gray-200">
            <Image
              src={galeria[0]}
              alt={`Fotografía de ${titulo}`}
              fill
              priority
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-md">
            <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {galeria.map((imgUrl, i) => (
                <div key={i} className="min-w-full h-full relative snap-center bg-gray-100 shrink-0">
                  <Image
                    src={imgUrl}
                    alt={`Fotografía ${i + 1} de ${titulo}`}
                    fill
                    priority={i === 0}
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                    {i + 1} / {galeria.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. CONTENIDO PRINCIPAL Y BARRA LATERAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row gap-10">
        
        {/* Columna Izquierda: Información Real del Inmueble */}
        <div className="w-full lg:w-2/3">
          
          {/* Resumen de características reales (sin inventar datos fijos) */}
          <div className="flex flex-wrap items-center gap-6 py-5 border-y border-gray-200 mb-8">
            {habitaciones !== undefined && (
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-content-main">{habitaciones}</span>
                <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">Habitaciones</span>
              </div>
            )}
            {habitaciones !== undefined && banos !== undefined && (
              <div className="w-px h-8 bg-gray-200" />
            )}
            {banos !== undefined && (
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-content-main">{banos}</span>
                <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">Baños</span>
              </div>
            )}
            {banos !== undefined && metros !== undefined && (
              <div className="w-px h-8 bg-gray-200" />
            )}
            {metros !== undefined && (
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-content-main">{metros}</span>
                <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">m² Construidos</span>
              </div>
            )}
            {estacionamientos !== undefined && estacionamientos > 0 && (
              <>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-content-main">{estacionamientos}</span>
                  <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">Parqueos</span>
                </div>
              </>
            )}
          </div>

          {/* Descripción Real */}
          <div className="mb-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-content-main mb-3">
              Descripción de la propiedad
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-content-main/80 font-medium leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {descripcion}
              </p>
            </div>
          </div>

          {/* Amenidades Reales (solo se muestran si el propietario seleccionó alguna) */}
          {amenidades.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-content-main mb-4">
                Amenidades incluidas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenidades.map((amenidad, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-gray-200 text-content-main font-semibold text-sm shadow-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ubicación y Respaldo Legal Real */}
          <div className="mb-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-content-main mb-4">
              Ubicación y Respaldo Legal
            </h3>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">Dirección del Inmueble</span>
                  <p className="text-base font-extrabold text-content-main mt-0.5">{direccion}</p>
                  <p className="text-sm font-medium text-content-muted">{ubicacion}, Bolivia</p>
                </div>
              </div>
              
              <div className="mt-4">
                <ClientMap 
                  readOnly={true} 
                  externalCenter={{ lat: -16.5000, lng: -68.1193 }} 
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-content-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Folio Real Registrado: <strong className="font-mono text-content-main">{folioReal || 'En trámite de validación'}</strong></span>
                </div>
                <span className="font-semibold text-primary">Plataforma InmoVAX</span>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Tarjeta Flotante de Contacto */}
        <div className="w-full lg:w-1/3 relative">
          <div className="sticky top-8 bg-surface-white p-6 rounded-2xl shadow-xl border border-gray-100">
            
            <div className="mb-6">
              <span className="block text-xs font-extrabold text-content-muted uppercase tracking-wider mb-1">
                Precio de Publicación
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main">
                {precio}
              </h2>
              {folioReal && (
                <p className="text-xs sm:text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Papeles al día (Verificado)
                </p>
              )}
            </div>

            <PropertyContactForm
              property={{
                id: property.id,
                titulo: property.titulo,
                precio: property.precio,
                ubicacion: property.ubicacion,
                imagenUrl: property.imagenUrl,
                autorEmail: property.autorEmail,
                autorNombre: property.autorNombre,
                asesor: property.asesor
              }}
            />
            
          </div>
        </div>

      </div>
    </div>
  );
}