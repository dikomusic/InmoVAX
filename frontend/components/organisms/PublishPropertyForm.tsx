"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { PublishSummaryCard, PropertyFormData } from '../molecules/PublishSummaryCard';
import dynamic from 'next/dynamic';
import { AddressAutocomplete } from '../molecules/AddressAutocomplete';

const MapPicker = dynamic(() => import('../molecules/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center font-bold text-gray-400">Cargando mapa interactivo...</div>
}); 

interface PublishPropertyFormProps {
  isLoggedInSeller?: boolean;
  onSuccessCallback?: (data: PropertyFormData) => void;
}

export const PublishPropertyForm = ({
  isLoggedInSeller = false,
  onSuccessCallback
}: PublishPropertyFormProps) => {
  const router = useRouter();
  const [paso, setPaso] = useState<number>(1);
  
  // Estado completo del formulario para no perder ningún dato
  const [formData, setFormData] = useState<PropertyFormData>({
    operacion: 'anticretico',
    tipoInmueble: 'departamento',
    moneda: 'usd',
    precio: '45000',
    negociable: true,
    descripcion: 'Hermoso departamento con sol de mañana, amplios ventanales y vista al Illimani.',
    zona: 'Sopocachi, La Paz',
    calle: 'Av. 20 de Octubre esq. Guachalla, Edificio Los Andes',
    coordenadas: { lat: -16.5020, lng: -68.1210 },
    supConstruida: '120',
    supTerreno: '',
    habitaciones: '3',
    banos: '2',
    parqueos: '1',
    amenidades: ['Ascensor', 'Seguridad 24/7', 'Parrillero'],
    folioReal: '2.01.0.99.0018472',
    tieneFolio: true,
    fotosCount: 6
  });

  // Estado de autenticación en paso 5
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('gonzalo.benitez@inmovax.com');
  const [authPass, setAuthPass] = useState('••••••••');
  const [authName, setAuthName] = useState('Arq. Gonzalo Benítez');
  const [authPhone, setAuthPhone] = useState('+591 77201928');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const avanzar = () => setPaso(prev => prev + 1);
  const retroceder = () => setPaso(prev => Math.max(1, prev - 1));

  const toggleAmenidad = (amenidad: string) => {
    setFormData(prev => ({
      ...prev,
      amenidades: prev.amenidades.includes(amenidad)
        ? prev.amenidades.filter(a => a !== amenidad)
        : [...prev.amenidades, amenidad]
    }));
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggedInSeller) {
      if (onSuccessCallback) {
        onSuccessCallback(formData);
      }
      setIsCompleted(true);
    } else {
      // Avanzar al paso 5 (Split View con Login a la derecha)
      setPaso(5);
    }
  };

  const handleAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);
      if (onSuccessCallback) {
        onSuccessCallback(formData);
      }
    }, 600);
  };

  // PANTALLA DE ÉXITO FINAL
  if (isCompleted) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-3xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
          ✓
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Inmueble Vinculado a tu Cuenta
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-dark mt-3">
            ¡Publicación Registrada Exitosamente!
          </h2>
          <p className="text-sm text-content-muted mt-2 max-w-lg mx-auto font-medium">
            Tu inmueble en <strong>{formData.zona}</strong> ({formData.operacion}) ha sido guardado y enviado al departamento notarial de InmoVax para habilitar el sello de verificación.
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Propietario:</span>
            <span className="font-extrabold text-surface-dark">{authName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Precio Fijado:</span>
            <span className="font-black text-primary">$us {formData.precio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Folio Real Registrado:</span>
            <span className="font-mono font-bold text-gray-700">{formData.folioReal}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/vendedor')}
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Ir a Mi Panel de Vendedor →
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-surface-dark text-xs font-extrabold rounded-xl transition-colors text-center"
          >
            Ver Portal Público
          </Link>
        </div>
      </div>
    );
  }

  // ================= PASO 5: SPLIT VIEW (RESUMEN IZQUIERDA + LOGIN/REGISTRO DERECHA) =================
  if (paso === 5) {
    return (
      <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-300">
        
        {/* ENCABEZADO DE REQUISITO */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="font-extrabold text-sm text-surface-dark">Paso Final de Seguridad: Asigna tu Inmueble</h4>
              <p className="text-xs text-content-muted">Tus datos están guardados intactos. Inicia sesión o regístrate para publicarlo en tu cuenta.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaso(4)}
            className="text-xs font-bold text-primary hover:underline cursor-pointer whitespace-nowrap"
          >
            ← Volver al formulario
          </button>
        </div>

        {/* ESTRUCTURA SPLIT (2 COLUMNAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: RESUMEN DE PROPIEDAD */}
          <div className="lg:col-span-6 w-full space-y-4">
            <PublishSummaryCard
              data={formData}
              onEditStep={(step) => setPaso(step)}
            />
          </div>

          {/* COLUMNA DERECHA: INICIAR SESIÓN / REGISTRO */}
          <div className="lg:col-span-6 w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            
            {/* BOTÓN RÁPIDO DE VENDEDOR */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Cuenta Verificada de Propietario</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-emerald-950 font-bold">¿Ya tienes cuenta como vendedor en InmoVax?</p>
              <button
                type="button"
                onClick={() => handleAuthSubmit()}
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer text-center"
              >
                {isLoading ? 'Vinculando...' : '⚡ Continuar como Gonzalo Benítez (Vendedor)'}
              </button>
            </div>

            {/* SELECTOR LOGIN / REGISTRO */}
            <div className="flex border-b border-gray-100 pb-2 gap-4 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                  authMode === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                  authMode === 'register' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Registrarme como Propietario
              </button>
            </div>

            {/* FORMULARIO DE ACCESO / REGISTRO */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">Nombre Completo</label>
                    <Input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Arq. Gonzalo Benítez"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">Teléfono / WhatsApp</label>
                    <Input
                      type="text"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+591 77201928"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-surface-dark mb-1">Correo Electrónico</label>
                <Input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="gonzalo.benitez@inmovax.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-dark mb-1">Contraseña</label>
                <Input
                  type="password"
                  required
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                  {isLoading 
                    ? 'Guardando publicación...' 
                    : authMode === 'login' 
                      ? 'Iniciar Sesión y Publicar Inmueble' 
                      : 'Crear Cuenta y Publicar Inmueble'}
                </Button>
              </div>
            </form>

          </div>

        </div>

      </div>
    );
  }

  // ================= PASOS 1 A 4: ASISTENTE DE PUBLICACIÓN =================
  return (
    <div className="bg-surface-white p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-4xl mx-auto text-left">
      
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

      <form onSubmit={paso === 4 ? handleStep4Submit : (e) => { e.preventDefault(); avanzar(); }}>
        
        {/* ================= PASO 1: INFORMACIÓN PRINCIPAL ================= */}
        {paso === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-content-main mb-4 border-b pb-2">Información Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Tipo de Operación</label>
                <Select
                  value={formData.operacion}
                  onChange={(e) => setFormData({ ...formData, operacion: e.target.value })}
                  options={[
                    { value: 'anticretico', label: 'Anticrético' },
                    { value: 'venta', label: 'Venta' },
                    { value: 'alquiler', label: 'Alquiler' }
                  ]}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Tipo de Inmueble</label>
                <Select
                  value={formData.tipoInmueble}
                  onChange={(e) => setFormData({ ...formData, tipoInmueble: e.target.value })}
                  options={[
                    { value: 'departamento', label: 'Departamento' },
                    { value: 'casa', label: 'Casa' },
                    { value: 'terreno', label: 'Terreno' },
                    { value: 'oficina', label: 'Oficina' },
                    { value: 'local', label: 'Local Comercial' }
                  ]}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-content-main mb-2">Moneda</label>
                <Select
                  value={formData.moneda}
                  onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                  options={[
                    { value: 'usd', label: '$us (Dólares)' },
                    { value: 'bs', label: 'Bs (Bolivianos)' }
                  ]} 
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-content-main mb-2">Precio Base</label>
                <Input
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  placeholder="Ej. 45000"
                  required 
                />
              </div>
              <div className="md:col-span-1 flex items-center h-13 px-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-content-main">
                  <input
                    type="checkbox"
                    checked={formData.negociable}
                    onChange={(e) => setFormData({ ...formData, negociable: e.target.checked })}
                    className="w-5 h-5 accent-primary rounded cursor-pointer" 
                  />
                  Precio Negociable
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Descripción Comercial</label>
              <textarea 
                className="w-full bg-surface-white text-content-main rounded-lg py-3 px-4 outline-none border-2 border-gray-200 focus:border-primary resize-none h-28 transition-colors"
                placeholder="Ej. Hermoso departamento cálido con sol de mañana y vista a la ciudad..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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
                <label className="block text-sm font-bold text-content-main mb-2">1. Busca tu Zona (Ej. Sopocachi, Calacoto)</label>
                <AddressAutocomplete 
                  placeholder="Escribe la zona para centrar el mapa..." 
                  onAddressSelect={(lat, lng, address) => {
                    setFormData(prev => ({
                      ...prev,
                      coordenadas: { lat, lng },
                      zona: address
                    }));
                  }} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">2. Calle específica y edificio</label>
                <Input
                  type="text"
                  value={formData.calle}
                  onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                  placeholder="Ej. Calle 10, Edificio Los Pinos, Piso 3"
                  required 
                />
              </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-content-main">3. Afina la ubicación (Arrastra el pin en La Paz)</label>
              </div>
              
              <MapPicker 
                externalCenter={formData.coordenadas}
                onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, coordenadas: { lat, lng } }))} 
              />
              <p className="text-xs text-content-muted mt-2">Puedes hacer clic en el mapa o mover el pin para indicar el ingreso exacto.</p>
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
                <Input
                  type="number"
                  value={formData.supConstruida}
                  onChange={(e) => setFormData({ ...formData, supConstruida: e.target.value })}
                  placeholder="Ej. 120"
                  required 
                />
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm font-bold text-content-main mb-2">Sup. Terreno (m²) <span className="text-xs font-normal text-gray-400">Solo casas</span></label>
                <Input
                  type="number"
                  value={formData.supTerreno || ''}
                  onChange={(e) => setFormData({ ...formData, supTerreno: e.target.value })}
                  placeholder="Ej. 300" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Habitaciones</label>
                <Input
                  type="number"
                  value={formData.habitaciones}
                  onChange={(e) => setFormData({ ...formData, habitaciones: e.target.value })}
                  placeholder="3"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Baños</label>
                <Input
                  type="number"
                  value={formData.banos}
                  onChange={(e) => setFormData({ ...formData, banos: e.target.value })}
                  placeholder="2"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-content-main mb-2">Parqueos</label>
                <Input
                  type="number"
                  value={formData.parqueos}
                  onChange={(e) => setFormData({ ...formData, parqueos: e.target.value })}
                  placeholder="1"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-content-main mb-4">Amenidades Incluidas</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Baulera', 'Ascensor', 'Seguridad 24/7', 'Parrillero', 'Jardín', 'Pet Friendly (Mascotas)'].map(amenidad => (
                  <label key={amenidad} className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-surface-light transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.amenidades.includes(amenidad)}
                      onChange={() => toggleAmenidad(amenidad)}
                      className="w-5 h-5 accent-primary rounded cursor-pointer" 
                    />
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
            <h2 className="text-2xl font-extrabold text-content-main mb-4 border-b pb-2">Multimedia y Respaldo Legal</h2>
            
            <div className="border-2 border-dashed border-primary/50 rounded-2xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-4xl mb-3 block">📸</span>
              <p className="font-bold text-content-main mb-1">Archivos y Fotografías Listas</p>
              <p className="text-sm text-content-muted mb-4">{formData.fotosCount} fotos seleccionadas (Fachada, sala, cocina, cuartos y baños).</p>
              <Button type="button" variant="outline">Administrar Fotografías</Button>
            </div>

            <div>
              <label className="block text-sm font-bold text-content-main mb-2">Matrícula Folio Real (DDRR)</label>
              <Input
                type="text"
                value={formData.folioReal}
                onChange={(e) => setFormData({ ...formData, folioReal: e.target.value })}
                placeholder="2.01.0.99.0018472"
                required
              />
            </div>

            <div className="bg-surface-light p-5 rounded-2xl border border-gray-200 mt-6">
              <label className="block text-sm font-bold text-content-main mb-3">Declaración Legal del Propietario</label>
              <div className="flex flex-col space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="legal"
                    checked={formData.tieneFolio}
                    onChange={() => setFormData({ ...formData, tieneFolio: true })}
                    className="w-5 h-5 mt-0.5 accent-primary cursor-pointer" 
                    required 
                  />
                  <span className="text-sm font-medium">Sí, cuenta con Folio Real al día, sin gravámenes y con impuestos pagados.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="legal"
                    checked={!formData.tieneFolio}
                    onChange={() => setFormData({ ...formData, tieneFolio: false })}
                    className="w-5 h-5 mt-0.5 accent-primary cursor-pointer" 
                  />
                  <span className="text-sm font-medium">No, la documentación está en trámite notarial o tiene un gravamen en proceso.</span>
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
              {isLoggedInSeller ? 'Publicar Inmueble Directamente' : 'Guardar y Continuar →'}
            </Button>
          )}
        </div>

      </form>
    </div>
  );
};