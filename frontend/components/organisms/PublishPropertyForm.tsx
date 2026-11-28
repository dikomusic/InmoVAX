"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, Building2, Trees, Store, Briefcase, MapPin, DollarSign, 
  Sparkles, CheckCircle2, AlertCircle, ShieldCheck, Phone, User, 
  Trash2, Star, UploadCloud, ImagePlus, ArrowLeft, ArrowRight, 
  Info, Check
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { PropertyFormData } from '../molecules/PublishSummaryCard';
import { saveStoredSession, readStoredSession } from '@/lib/frontendStore';
import { API_BASE } from '@/lib/apiConfig';

interface PublishPropertyFormProps {
  isLoggedInSeller?: boolean;
  onSuccessCallback?: (data: PropertyFormData) => void;
}

const CIUDADES_BOLIVIA = [
  { value: 'La Paz', label: 'La Paz' },
  { value: 'El Alto', label: 'El Alto' },
  { value: 'Cochabamba', label: 'Cochabamba' },
  { value: 'Santa Cruz', label: 'Santa Cruz' },
  { value: 'Sucre', label: 'Sucre' },
  { value: 'Tarija', label: 'Tarija' },
  { value: 'Oruro', label: 'Oruro' },
  { value: 'Potosí', label: 'Potosí' },
  { value: 'Beni', label: 'Beni' },
  { value: 'Pando', label: 'Pando' }
];

const AMENIDADES_POR_TIPO: Record<string, string[]> = {
  casa: [
    'Jardín privado',
    'Parrillero / Churrasquera',
    'Patio trasero',
    'Garaje techado',
    'Gas domiciliario',
    'Calefón / Termotanque',
    'Tanque de agua / Bomba',
    'Pet Friendly (Mascotas)',
    'Sistema de alarma / Cámaras'
  ],
  departamento: [
    'Ascensor',
    'Seguridad 24/7',
    'Baulera',
    'Gas domiciliario',
    'Parrillero en terraza / Copropiedad',
    'Pet Friendly (Mascotas)',
    'Salón de eventos',
    'Cámaras de vigilancia'
  ],
  terreno: [
    'Agua potable instalada',
    'Luz eléctrica en puerta',
    'Alcantarillado',
    'Gas natural en la zona',
    'Papeles al día en DDRR',
    'Plano aprobado',
    'Murallado'
  ],
  oficina: [
    'Ascensor',
    'Seguridad 24/7',
    'Recepción / Conserjería',
    'Internet fibra óptica',
    'Parqueo de visitas',
    'Cámaras de vigilancia'
  ],
  local: [
    'Frente a calle principal',
    'Persianas metálicas de seguridad',
    'Baño privado',
    'Luz trifásica',
    'Depósito / Almacén',
    'Parqueo frontal'
  ]
};

export const PublishPropertyForm: React.FC<PublishPropertyFormProps> = ({
  isLoggedInSeller = false,
  onSuccessCallback
}) => {
  const router = useRouter();
  const [paso, setPaso] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Estado limpio: sin datos falsos precargados
  const [formData, setFormData] = useState<PropertyFormData>({
    operacion: 'venta',
    tipoInmueble: 'casa',
    ciudad: 'La Paz',
    moneda: 'usd',
    precio: '',
    negociable: true,
    titulo: '',
    descripcion: '',
    zona: '',
    calle: '',
    coordenadas: { lat: -16.5000, lng: -68.1500 },
    supConstruida: '',
    supTerreno: '',
    habitaciones: '',
    banos: '',
    parqueos: '',
    amenidades: [],
    folioReal: '',
    tieneFolio: false,
    fotosCount: 0,
    imagenUrl: '',
    galeria: [],
    contactoNombre: '',
    contactoTelefono: ''
  });

  // Cargar datos de contacto existentes si el usuario ya inició sesión
  useEffect(() => {
    const session = readStoredSession();
    if (session) {
      setFormData(prev => ({
        ...prev,
        contactoNombre: prev.contactoNombre || session.name || '',
        contactoTelefono: prev.contactoTelefono || ''
      }));
    }
  }, []);

  const toggleAmenidad = (amenidad: string) => {
    setFormData(prev => ({
      ...prev,
      amenidades: prev.amenidades.includes(amenidad)
        ? prev.amenidades.filter(a => a !== amenidad)
        : [...prev.amenidades, amenidad]
    }));
  };

  const handlePaso1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.precio || Number(formData.precio) <= 0) {
      alert('Por favor indica un precio válido para el inmueble.');
      return;
    }
    if (!formData.zona.trim()) {
      alert('Por favor indica la zona o barrio de la propiedad (ej: Calacoto, Sopocachi, Equipetrol).');
      return;
    }
    setPaso(2);
  };

  const handlePaso2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Asegurar sesión local de vendedor para gestionar su publicación
      const currentSession = readStoredSession();
      const authorEmail = currentSession?.email || 'propietario@inmovax.com';
      const authorName = formData.contactoNombre?.trim() || currentSession?.name || 'Propietario InmoVAX';

      saveStoredSession({
        name: authorName,
        email: authorEmail,
        hasPublishedProperties: true,
        role: currentSession?.role === 'admin' ? 'admin' : 'vendedor'
      });

      // 2. Invocar callback de guardado en la base de datos/store
      if (onSuccessCallback) {
        onSuccessCallback({
          ...formData,
          contactoNombre: authorName
        });
      }

      setIsCompleted(true);
    } catch (err) {
      console.error('Error al guardar publicación:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= PANTALLA DE ÉXITO =================
  if (isCompleted) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-emerald-100 max-w-3xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full border border-emerald-200">
            Publicación Exitosa • En Línea
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-3">
            ¡Tu propiedad ya está en InmoVAX!
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto font-medium">
            Tu {formData.tipoInmueble} en <strong>{formData.zona}, {formData.ciudad}</strong> se encuentra activo. Los interesados podrán contactarte directamente sin comisiones intermedias.
          </p>
        </div>

        {/* Resumen del inmueble */}
        <div className="p-5 bg-gray-50 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Modalidad:</span>
            <span className="font-extrabold text-gray-900 capitalize">{formData.operacion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Precio Fijado:</span>
            <span className="font-black text-emerald-600">
              {formData.moneda === 'usd' ? '$us' : 'Bs.'} {Number(formData.precio).toLocaleString('en-US')}
              {formData.negociable && ' (Negociable)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Contacto Directo:</span>
            <span className="font-bold text-gray-900">{formData.contactoNombre} {formData.contactoTelefono ? `(${formData.contactoTelefono})` : ''}</span>
          </div>
          {formData.folioReal && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Folio Real Registrado:</span>
              <span className="font-mono font-bold text-blue-600">{formData.folioReal}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/vendedor?tab=inmuebles"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 text-center"
          >
            Ir a Mi Portal de Propietario →
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all text-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const amenidadesDisponibles = AMENIDADES_POR_TIPO[formData.tipoInmueble] || AMENIDADES_POR_TIPO.casa;

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-4xl mx-auto text-left">
      
      {/* BARRA DE PROGRESO DE 3 PASOS */}
      <div className="mb-8">
        <div className="flex justify-between mb-2 px-1 text-xs sm:text-sm font-extrabold">
          <span className={paso >= 1 ? 'text-primary' : 'text-gray-400'}>
            1. Datos y Precio
          </span>
          <span className={paso >= 2 ? 'text-primary' : 'text-gray-400'}>
            2. Características
          </span>
          <span className={paso >= 3 ? 'text-primary' : 'text-gray-400'}>
            3. Fotos y Contacto
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full flex overflow-hidden">
          <div 
            className={`h-full bg-primary transition-all duration-300 ${
              paso === 1 ? 'w-1/3' : paso === 2 ? 'w-2/3' : 'w-full'
            }`} 
          />
        </div>
      </div>

      {/* ================= PASO 1: DATOS BÁSICOS Y PRECIO ================= */}
      {paso === 1 && (
        <form onSubmit={handlePaso1Next} className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950">
              ¿Qué tipo de inmueble estás publicando?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Selecciona la categoría y define la modalidad de tu oferta.
            </p>
          </div>

          {/* Selector visual de Tipo de Inmueble */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2.5">
              Tipo de Inmueble *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { key: 'casa', label: 'Casa', icon: Home },
                { key: 'departamento', label: 'Departamento', icon: Building2 },
                { key: 'terreno', label: 'Terreno', icon: Trees },
                { key: 'oficina', label: 'Oficina', icon: Briefcase },
                { key: 'local', label: 'Local Com.', icon: Store }
              ].map(item => {
                const IconComponent = item.icon;
                const isSelected = formData.tipoInmueble === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, tipoInmueble: item.key })}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary shadow-sm font-black'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-bold'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modalidad de Operación */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'venta', label: 'Quiero Vender', desc: 'Compraventa definitiva' },
              { key: 'anticretico', label: 'Quiero en Anticrético', desc: 'Capital con devolución total' },
              { key: 'alquiler', label: 'Quiero Alquilar', desc: 'Renta mensual' }
            ].map(op => {
              const isSelected = formData.operacion === op.key;
              return (
                <button
                  key={op.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, operacion: op.key })}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <span className="block font-black text-sm">{op.label}</span>
                  <span className="block text-[11px] text-gray-500 font-normal mt-0.5">{op.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Ciudad y Zona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Ciudad *
              </label>
              <Select
                value={formData.ciudad || 'La Paz'}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                options={CIUDADES_BOLIVIA}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Zona / Barrio *
              </label>
              <Input
                type="text"
                value={formData.zona}
                onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                placeholder="Ej. Sopocachi, Calacoto, Equipetrol, Sarco..."
                required
              />
            </div>
          </div>

          {/* Dirección o Referencia */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
              Dirección o Referencia
            </label>
            <Input
              type="text"
              value={formData.calle}
              onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
              placeholder="Ej. Calle 21 de Calacoto, Edif. Los Andes, frente al parque..."
            />
          </div>

          {/* Moneda y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Moneda
              </label>
              <Select
                value={formData.moneda}
                onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                options={[
                  { value: 'usd', label: '$us (Dólares)' },
                  { value: 'bs', label: 'Bs (Bolivianos)' }
                ]}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Precio {formData.operacion === 'alquiler' ? 'Mensual' : 'Total'} *
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  placeholder="Ej. 45000"
                  required
                  min="1"
                />
                <label className="flex items-center gap-2 shrink-0 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.negociable}
                    onChange={(e) => setFormData({ ...formData, negociable: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span>Negociable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Título y Descripción */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Título del Anuncio (Opcional)
              </label>
              <Input
                type="text"
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder={`Ej. Hermosa ${formData.tipoInmueble} con sol de mañana y acabados de lujo`}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Descripción Detallada
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe las principales cualidades del inmueble, iluminación, cercanía a transporte, colegios o servicios..."
                rows={3}
                className="w-full bg-white text-gray-900 rounded-xl p-3 border-2 border-gray-200 focus:border-primary outline-hidden text-sm transition-colors resize-none"
              />
            </div>
          </div>

          {/* Botón Siguiente */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary" className="h-12 px-8 rounded-full font-extrabold flex items-center gap-2">
              <span>Continuar a Características</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* ================= PASO 2: CARACTERÍSTICAS Y DISTRIBUCIÓN ================= */}
      {paso === 2 && (
        <form onSubmit={handlePaso2Next} className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950">
              Características de tu {formData.tipoInmueble}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Detalla superficies y comodidades para que los compradores conozcan tu propiedad.
            </p>
          </div>

          {/* CAMPOS ADAPTABLES SEGÚN TIPO */}
          {formData.tipoInmueble === 'terreno' ? (
            /* Campos específicos para Terreno */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Superficie del Terreno (m²) *
                </label>
                <Input
                  type="number"
                  value={formData.supTerreno || formData.supConstruida}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    supTerreno: e.target.value,
                    supConstruida: e.target.value 
                  })}
                  placeholder="Ej. 350"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Metros de Frente (m) (Opcional)
                </label>
                <Input
                  type="number"
                  placeholder="Ej. 12"
                />
              </div>
            </div>
          ) : (
            /* Campos para Casa, Departamento, Oficina o Local */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Sup. Construida (m²) *
                </label>
                <Input
                  type="number"
                  value={formData.supConstruida}
                  onChange={(e) => setFormData({ ...formData, supConstruida: e.target.value })}
                  placeholder="Ej. 120"
                  required
                />
              </div>

              {formData.tipoInmueble === 'casa' && (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                    Sup. Terreno (m²)
                  </label>
                  <Input
                    type="number"
                    value={formData.supTerreno || ''}
                    onChange={(e) => setFormData({ ...formData, supTerreno: e.target.value })}
                    placeholder="Ej. 250"
                  />
                </div>
              )}

              {formData.tipoInmueble !== 'local' && (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                    {formData.tipoInmueble === 'oficina' ? 'Ambientes' : 'Dormitorios'} *
                  </label>
                  <Input
                    type="number"
                    value={formData.habitaciones}
                    onChange={(e) => setFormData({ ...formData, habitaciones: e.target.value })}
                    placeholder="Ej. 3"
                    min="0"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Baños *
                </label>
                <Input
                  type="number"
                  value={formData.banos}
                  onChange={(e) => setFormData({ ...formData, banos: e.target.value })}
                  placeholder="Ej. 2"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Parqueos / Garaje
                </label>
                <Input
                  type="number"
                  value={formData.parqueos}
                  onChange={(e) => setFormData({ ...formData, parqueos: e.target.value })}
                  placeholder="Ej. 1"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* AMENIDADES CON UN CLIC */}
          <div className="pt-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2.5">
              Comodidades y Servicios Disponibles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {amenidadesDisponibles.map(am => {
                const isSelected = formData.amenidades.includes(am);
                return (
                  <button
                    key={am}
                    type="button"
                    onClick={() => toggleAmenidad(am)}
                    className={`px-3 py-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{am}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaso(1)}
              className="h-12 px-6 rounded-full font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="h-12 px-8 rounded-full font-extrabold flex items-center gap-2"
            >
              <span>Continuar a Fotos y Contacto</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* ================= PASO 3: FOTOS Y CONTACTO DIRECTO ================= */}
      {paso === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950">
              Fotografías y Datos de Contacto
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Las fotos aumentan en un 80% las consultas. Además, tus datos permitirán a los interesados contactarte de forma directa.
            </p>
          </div>

          {/* CARGA DE FOTOGRAFÍAS */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
              Fotografías del Inmueble (Opcional)
            </label>

            {formData.galeria.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {formData.galeria.map((url, idx) => {
                  const isCover = formData.imagenUrl === url || (!formData.imagenUrl && idx === 0);
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden border-2 bg-gray-50 h-32 group shadow-xs transition-all ${
                        isCover ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isCover && (
                        <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" /> Portada
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-2">
                        <div className="w-full flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const newGal = formData.galeria.filter((_, i) => i !== idx);
                              const newCover = isCover ? (newGal[0] || '') : formData.imagenUrl;
                              setFormData({
                                ...formData,
                                galeria: newGal,
                                imagenUrl: newCover,
                                fotosCount: newGal.length
                              });
                            }}
                            className="bg-red-600 text-white p-1 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imagenUrl: url })}
                            className="w-full bg-white text-gray-900 font-extrabold text-[11px] py-1 rounded-md shadow-xs text-center cursor-pointer"
                          >
                            Fijar Portada
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {uploadError && (
              <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50/60 hover:bg-blue-50/30 hover:border-primary transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2.5">
                <ImagePlus className="w-5 h-5" />
              </div>
              <p className="font-extrabold text-gray-900 text-xs sm:text-sm mb-1">
                Selecciona fotos desde tu teléfono o computadora
              </p>
              <p className="text-[11px] text-gray-500 mb-3">
                Formatos JPG o PNG. Puedes elegir varias al mismo tiempo.
              </p>
              
              <label className="inline-flex items-center gap-2 cursor-pointer bg-primary text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-xs">
                <UploadCloud className="w-4 h-4" />
                <span>Elegir Fotografías</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setUploadError(null);
                      const localPreviews = files.map(f => URL.createObjectURL(f));
                      setFormData(prev => ({
                        ...prev,
                        galeria: [...prev.galeria, ...localPreviews],
                        fotosCount: prev.galeria.length + files.length,
                        imagenUrl: prev.imagenUrl || localPreviews[0] || ''
                      }));

                      // Intento de upload al backend
                      setIsUploadingImage(true);
                      try {
                        const uploads = files.map(async file => {
                          const data = new FormData();
                          data.append('file', file);
                          const res = await fetch(`${API_BASE}/properties/upload`, {
                            method: 'POST',
                            body: data
                          });
                          const resData = await res.json();
                          return resData.url || null;
                        });
                        const results = await Promise.all(uploads);
                        const serverUrls = results.filter((url): url is string => Boolean(url));
                        if (serverUrls.length > 0) {
                          setFormData(prev => {
                            const withoutBlobs = prev.galeria.filter(u => !u.startsWith('blob:'));
                            const merged = [...withoutBlobs, ...serverUrls];
                            return {
                              ...prev,
                              galeria: merged,
                              imagenUrl: merged[0] || '',
                              fotosCount: merged.length
                            };
                          });
                        }
                      } catch {
                        // Mantener previsualización local para no interrumpir al usuario
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* DATOS DE CONTACTO DIRECTO */}
          <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Contacto Directo Comprador - Propietario</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Nombre del Propietario / Contacto *
                </label>
                <Input
                  type="text"
                  value={formData.contactoNombre}
                  onChange={(e) => setFormData({ ...formData, contactoNombre: e.target.value })}
                  placeholder="Ej. Arq. Marcelo Mendoza"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Teléfono / WhatsApp de Contacto *
                </label>
                <Input
                  type="text"
                  value={formData.contactoTelefono}
                  onChange={(e) => setFormData({ ...formData, contactoTelefono: e.target.value })}
                  placeholder="Ej. +591 70612345"
                  required
                />
              </div>
            </div>
          </div>

          {/* RESPALDO LEGAL (OPCIONAL PARA VERIFICACIÓN) */}
          <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-blue-900">
                Matrícula de Folio Real (Opcional)
              </label>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                Opcional • Insignia Verificada
              </span>
            </div>
            <Input
              type="text"
              value={formData.folioReal}
              onChange={(e) => setFormData({ 
                ...formData, 
                folioReal: e.target.value,
                tieneFolio: Boolean(e.target.value.trim()) 
              })}
              placeholder="Ej. 2.01.0.99.0018472"
            />
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Si cuentas con tu número de Folio Real en Derechos Reales puedes registrarlo para mostrar la insignia de verificación en tu ficha. Si no lo tienes a mano, puedes publicar y añadirlo más adelante.
            </p>
          </div>

          {/* Botones de navegación final */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaso(2)}
              className="h-12 px-6 rounded-full font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isUploadingImage}
              className="h-12 px-8 rounded-full font-black flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Inmueble Gratis'}</span>
            </Button>
          </div>
        </form>
      )}

    </div>
  );
};
