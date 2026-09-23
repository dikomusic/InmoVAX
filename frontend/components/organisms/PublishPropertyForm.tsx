"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImagePlus, UploadCloud, X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { PublishSummaryCard, PropertyFormData } from '../molecules/PublishSummaryCard';
import dynamic from 'next/dynamic';
import { AddressAutocomplete } from '../molecules/AddressAutocomplete';
import { saveStoredSession, readStoredSession } from '@/lib/frontendStore';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

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
    folioReal: '2.01.0.12.3456789',
    tieneFolio: true,
    fotosCount: 0,
    imagenUrl: '',
    galeria: []
  });

  // Estado de autenticación en paso 5
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Estado Google
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGoogleOAuthDirect = async () => {
    setIsLoading(true);
    setGoogleError(null);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/vendedor`,
        },
      });

      if (error) {
        setGoogleError(error.message.includes('not enabled')
          ? 'Google OAuth no está activado aún en tu panel de Supabase. Habilítalo en Authentication -> Providers -> Google.'
          : error.message);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      setGoogleError(err?.message || 'Error al conectar con Google');
      setIsLoading(false);
    }
  };

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
    const currentSession = readStoredSession();
    if (isLoggedInSeller || (currentSession && currentSession.email)) {
      if (onSuccessCallback) {
        onSuccessCallback(formData);
      }
      setIsCompleted(true);
    } else {
      // Avanzar al paso 5 (Split View con Login a la derecha)
      setPaso(5);
    }
  };

  const handleAuthSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = authEmail.trim().toLowerCase();
    const cleanName = authName.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido para vincular tu inmueble.');
      return;
    }

    setIsLoading(true);

    try {
      // Registrar / sincronizar perfil en Supabase PostgreSQL
      await fetch('http://127.0.0.1:4000/api/properties/register-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          full_name: cleanName,
          role_id: 3 // Vendedor
        })
      });
    } catch (err) {
      console.warn('Registro local de perfil:', err);
    }

    const userSession = {
      name: cleanName,
      email: cleanEmail,
      hasPublishedProperties: true,
      role: 'vendedor' as const
    };
    saveStoredSession(userSession);
    setIsLoading(false);
    setIsCompleted(true);
    if (onSuccessCallback) {
      onSuccessCallback(formData);
    }
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
            className="shrink-0 text-left text-xs font-bold text-primary hover:underline cursor-pointer"
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

            {/* BOTÓN OFICIAL DE GOOGLE DIRECTO */}
            <button
              type="button"
              onClick={handleGoogleOAuthDirect}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-surface-dark border border-gray-300 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? 'Conectando con Google...' : 'Vincular y Publicar con Google'}</span>
            </button>

            {googleError && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold animate-in fade-in">
                ⚠️ {googleError}
              </div>
            )}

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-content-muted">O con correo y contraseña</span>
            </div>

            {/* SELECTOR LOGIN / REGISTRO */}
            <div className="flex border-b border-gray-100 pb-2 gap-4 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                  authMode === 'register' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Registrarme como Propietario
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                  authMode === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Iniciar Sesión
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
                      placeholder="Tu nombre y apellido"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">Teléfono / WhatsApp</label>
                    <Input
                      type="text"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+591 70000000"
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
                  placeholder="tu.correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-dark mb-1">Contraseña</label>
                <Input
                  type="password"
                  required
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  placeholder="Ingresa tu contraseña"
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
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
              <div className="sm:col-span-2 md:col-span-2">
                <label className="block text-sm font-bold text-content-main mb-2">Sup. Construida (m²)</label>
                <Input
                  type="number"
                  value={formData.supConstruida}
                  onChange={(e) => setFormData({ ...formData, supConstruida: e.target.value })}
                  placeholder="Ej. 120"
                  required 
                />
              </div>
              <div className="sm:col-span-2 md:col-span-3">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
            
            {/* Carga de fotografía real (Múltiple) */}
            <div>
              <label className="block text-sm font-bold text-content-main mb-2">
                Fotografías del Inmueble (Opcional)
              </label>
              
              {formData.galeria.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {formData.galeria.map((url, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-32 group shadow-sm">
                      <img
                        src={url}
                        alt={`Vista previa ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newGaleria = formData.galeria.filter((_, i) => i !== idx);
                            setFormData({ 
                              ...formData, 
                              galeria: newGaleria, 
                              fotosCount: newGaleria.length,
                              imagenUrl: newGaleria[0] || ''
                            });
                          }}
                          className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-blue-50/40 hover:border-primary transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <p className="font-extrabold text-content-main text-sm mb-1">
                  Cargar fotografías desde tu dispositivo
                </p>
                <p className="text-xs text-content-muted mb-4 max-w-sm mx-auto">
                  Formatos JPG o PNG. Selecciona uno o varios archivos a la vez.
                </p>
                
                <label className="inline-flex items-center gap-2 cursor-pointer bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                  <UploadCloud className="w-4 h-4" />
                  <span>Seleccionar archivos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        const tempUrls = files.map(f => URL.createObjectURL(f));
                        setFormData(prev => ({ 
                          ...prev, 
                          galeria: [...prev.galeria, ...tempUrls],
                          fotosCount: prev.galeria.length + files.length
                        }));
                        
                        setIsUploadingImage(true);
                        try {
                          const uploadPromises = files.map(async (file) => {
                            const uploadData = new FormData();
                            uploadData.append('file', file);
                            
                            const res = await fetch('http://127.0.0.1:4000/api/properties/upload', {
                              method: 'POST',
                              body: uploadData
                            });
                            const data = await res.json();
                            if (!data.success || !data.url) throw new Error(data.error);
                            return data.url;
                          });

                          const urls = await Promise.all(uploadPromises);
                          
                          setFormData(prev => {
                            const filteredGaleria = prev.galeria.filter(url => !url.startsWith('blob:'));
                            const newGaleria = [...filteredGaleria, ...urls];
                            return {
                              ...prev,
                              galeria: newGaleria,
                              imagenUrl: newGaleria[0] || '',
                              fotosCount: newGaleria.length
                            };
                          });
                        } catch (error) {
                          console.error('Error uploading images:', error);
                          alert('Hubo un error de conexión al subir las imágenes.');
                          // Remueve las blobs que fallaron
                          setFormData(prev => {
                            const newGaleria = prev.galeria.filter(url => !url.startsWith('blob:'));
                            return {
                              ...prev,
                              galeria: newGaleria,
                              imagenUrl: newGaleria[0] || '',
                              fotosCount: newGaleria.length
                            };
                          });
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }
                    }}
                  />
                </label>
              </div>
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
            <Button type="submit" variant="accent" disabled={isUploadingImage}>
              {isUploadingImage ? 'Subiendo imagen...' : isLoggedInSeller ? 'Publicar Inmueble Directamente' : 'Guardar y Continuar →'}
            </Button>
          )}
        </div>

      </form>
    </div>
  );
};