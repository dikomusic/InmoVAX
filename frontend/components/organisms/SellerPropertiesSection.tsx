"use client";
import React, { useState } from 'react';
import { 
  Building2, 
  Eye, 
  MessageCircle, 
  Sparkles, 
  Pencil, 
  MapPin, 
  DollarSign, 
  Home, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Camera, 
  Loader2, 
  Check, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { SellerPropertyCard, SellerProperty } from '../molecules/SellerPropertyCard';
import { AdminSearchFilter } from '../molecules/AdminSearchFilter';
import { Modal } from '../atoms/Modal';

interface SellerPropertiesSectionProps {
  properties: SellerProperty[];
  onTogglePause: (id: string) => void;
  onOpenPublishModal: () => void;
  onUpdateProperty: (property: SellerProperty) => void | Promise<void>;
  onDeleteProperty?: (id: string) => void;
  onRequestDeleteProperty?: (property: SellerProperty) => void;
}

const AVAILABLE_AMENITIES = [
  'Ascensor',
  'Seguridad 24/7',
  'Parrillero',
  'Baulera',
  'Jardín',
  'Pet Friendly',
  'Gas Domiciliario',
  'Calefacción',
  'Piscina',
  'Gimnasio',
  'Lavandería',
  'Terraza',
  'Salón de Copropietarios'
];

const PROPERTY_CATEGORIES = [
  'Departamento',
  'Casa',
  'Terreno',
  'Oficina',
  'Local Comercial',

];

export const SellerPropertiesSection = ({
  properties,
  onTogglePause,
  onOpenPublishModal,
  onUpdateProperty,
  onDeleteProperty,
  onRequestDeleteProperty
}: SellerPropertiesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [selectedProperty, setSelectedProperty] = useState<SellerProperty | null>(null);
  
  // Estado para el modal de edición (REQ-13)
  const [editingProperty, setEditingProperty] = useState<SellerProperty | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'caracteristicas' | 'multimedia'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Campos editables locales
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Departamento');
  const [editType, setEditType] = useState<'Anticrético' | 'Venta' | 'Alquiler'>('Anticrético');
  const [editCurrency, setEditCurrency] = useState<'USD' | 'BOB'>('USD');
  const [editPriceAmount, setEditPriceAmount] = useState('');
  const [editIsNegotiable, setEditIsNegotiable] = useState(false);
  const [editZone, setEditZone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editLatitude, setEditLatitude] = useState('');
  const [editLongitude, setEditLongitude] = useState('');
  const [editBedrooms, setEditBedrooms] = useState('3');
  const [editBathrooms, setEditBathrooms] = useState('2');
  const [editAreaSqm, setEditAreaSqm] = useState('120');
  const [editLandAreaSqm, setEditLandAreaSqm] = useState('');
  const [editParking, setEditParking] = useState('1');
  const [editAmenities, setEditAmenities] = useState<string[]>([]);
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');

  const filtered = properties.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.folioReal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'todos' || p.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const startEditing = (prop: SellerProperty) => {
    setEditingProperty(prop);
    setActiveTab('general');
    setSaveSuccessMsg(null);
    setEditTitle(prop.title || '');
    setEditCategory(prop.category || 'Departamento');
    setEditType(prop.type || 'Anticrético');
    
    const isBob = prop.price?.toLowerCase().includes('bs') || false;
    setEditCurrency(isBob ? 'BOB' : 'USD');
    const cleanNum = (prop.price || '').replace(/[^0-9]/g, '');
    setEditPriceAmount(cleanNum || '0');
    setEditIsNegotiable(prop.isNegotiable ?? false);
    
    setEditZone(prop.zone || '');
    setEditAddress(prop.address || prop.zone || '');
    setEditLatitude(prop.latitude !== null && prop.latitude !== undefined ? String(prop.latitude) : '');
    setEditLongitude(prop.longitude !== null && prop.longitude !== undefined ? String(prop.longitude) : '');
    
    setEditBedrooms(prop.habitaciones !== undefined ? String(prop.habitaciones) : '3');
    setEditBathrooms(prop.banos !== undefined ? String(prop.banos) : '2');
    setEditAreaSqm(prop.metros !== undefined ? String(prop.metros) : '120');
    setEditLandAreaSqm(prop.landAreaSqm !== null && prop.landAreaSqm !== undefined ? String(prop.landAreaSqm) : '');
    setEditParking(prop.estacionamientos !== undefined ? String(prop.estacionamientos) : (prop.parkingSpots !== undefined ? String(prop.parkingSpots) : '0'));
    setEditAmenities(prop.amenidades || prop.amenities || []);
    setEditDescription(prop.description || '');
    setEditImage(prop.image || '');
  };

  const toggleAmenity = (amenity: string) => {
    setEditAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      const numPrice = Number(editPriceAmount.replace(/[^0-9]/g, '') || 0);
      const formattedPrice = `${editCurrency === 'USD' ? '$us ' : 'Bs. '}${numPrice.toLocaleString()}`;

      const updated: SellerProperty = {
        ...editingProperty,
        title: editTitle.trim(),
        category: editCategory,
        type: editType,
        price: formattedPrice,
        isNegotiable: editIsNegotiable,
        zone: editZone.trim(),
        address: editAddress.trim() || editZone.trim(),
        latitude: editLatitude.trim() !== '' ? Number(editLatitude) : null,
        longitude: editLongitude.trim() !== '' ? Number(editLongitude) : null,
        habitaciones: editBedrooms !== '' ? Math.max(0, Number(editBedrooms)) : undefined,
        banos: editBathrooms !== '' ? Math.max(0, Number(editBathrooms)) : undefined,
        metros: editAreaSqm !== '' ? Math.max(1, Number(editAreaSqm)) : undefined,
        landAreaSqm: editLandAreaSqm !== '' ? Math.max(0, Number(editLandAreaSqm)) : null,
        estacionamientos: editParking !== '' ? Math.max(0, Number(editParking)) : 0,
        parkingSpots: editParking !== '' ? Math.max(0, Number(editParking)) : 0,
        amenidades: editAmenities,
        amenities: editAmenities,
        description: editDescription.trim(),
        image: editImage.trim() || editingProperty.image,
      };

      await onUpdateProperty(updated);
      setSaveSuccessMsg('¡Cambios guardados exitosamente en la base de datos!');
      setTimeout(() => {
        setEditingProperty(null);
      }, 700);
    } catch (err) {
      console.error('Error al guardar edición de propiedad:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* CABECERA DE LA SECCIÓN */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-surface-dark tracking-tight">
            Mis Inmuebles Publicados
          </h2>
          <p className="text-xs text-content-muted mt-0.5">
            Administra tus publicaciones activas, pausa visibilidad o edita cualquier información comercial o física.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-blue-50 text-primary px-3 py-1.5 rounded-xl border border-blue-100">
            {properties.length} Inmuebles Totales
          </span>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Buscar por zona, título o Folio Real..."
        selectFilters={[
          {
            value: filterType,
            onChange: setFilterType,
            options: [
              { label: 'Todas las modalidades', value: 'todos' },
              { label: 'Anticrético', value: 'Anticrético' },
              { label: 'Venta', value: 'Venta' },
              { label: 'Alquiler', value: 'Alquiler' }
            ]
          }
        ]}
        actionButton={{
          label: "+ Publicar Inmueble",
          onClick: onOpenPublishModal
        }}
      />

      {/* GRID RESPONSIVO DE PROPIEDADES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {filtered.map((prop) => (
          <SellerPropertyCard
            key={prop.id}
            property={prop}
            onTogglePause={onTogglePause}
            onEdit={(property) => startEditing(property)}
            onViewStats={(property) => setSelectedProperty(property)}
            onDelete={onDeleteProperty}
            onRequestDelete={onRequestDeleteProperty}
          />
        ))}
      </div>

      {/* ESTADO VACÍO */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gray-100 shadow-sm text-content-muted space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary mx-auto">
            <Building2 className="h-7 w-7" />
          </div>
          <h4 className="font-extrabold text-surface-dark text-base">
            No se encontraron publicaciones
          </h4>
          <p className="text-xs text-content-muted max-w-sm mx-auto">
            {properties.length === 0
              ? 'Aún no tienes inmuebles publicados en InmoVAX. Comienza publicando tu primera propiedad con respaldo legal.'
              : 'No hay inmuebles que coincidan con los filtros seleccionados. Intenta restablecer la búsqueda.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenPublishModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>+ Publicar Nuevo Inmueble</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE RENDIMIENTO */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={`Rendimiento Comercial: ${selectedProperty?.title || ''}`}
        subtitle={`Zona: ${selectedProperty?.zone} • Folio: ${selectedProperty?.folioReal}`}
      >
        {selectedProperty && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-center border border-blue-100">
                <span className="flex items-center justify-center gap-1 text-2xl font-black text-primary">
                  <Eye className="h-5 w-5" /> {selectedProperty.views}
                </span>
                <span className="text-xs font-bold text-blue-950 mt-1 block">
                  Visualizaciones en Catálogo
                </span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl text-center border border-emerald-100">
                <span className="flex items-center justify-center gap-1 text-2xl font-black text-emerald-600">
                  <MessageCircle className="h-5 w-5" /> {selectedProperty.inquiries}
                </span>
                <span className="text-xs font-bold text-emerald-950 mt-1 block">
                  Clientes Interesados
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Asesor Oficial InmoVAX:</span>
                <span className="font-extrabold text-surface-dark">{selectedProperty.assignedAdvisor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Precio Oficial:</span>
                <span className="font-black text-primary text-sm">{selectedProperty.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Modalidad:</span>
                <span className="font-extrabold text-gray-800">{selectedProperty.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Estado Legal:</span>
                <span className="font-black text-emerald-700">{selectedProperty.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* REQ-13: MODAL COMPLETO DE EDICIÓN DE PROPIEDAD */}
      <Modal
        isOpen={!!editingProperty}
        onClose={() => !isSaving && setEditingProperty(null)}
        title="Editar Información del Inmueble Publicado"
        subtitle={`Código: ${editingProperty?.id || ''} • Folio: ${editingProperty?.folioReal || ''}`}
        maxWidth="3xl"
      >
        {editingProperty && (
          <form onSubmit={handleSaveEdit} className="space-y-5">
            {/* PESTAÑAS DE NAVEGACIÓN */}
            <div className="flex border-b border-gray-200 gap-1 sm:gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'general'
                    ? 'bg-blue-50 text-primary border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>1. Comercial & Tipo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ubicacion')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ubicacion'
                    ? 'bg-blue-50 text-primary border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Ubicación & Coordenadas</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('caracteristicas')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'caracteristicas'
                    ? 'bg-blue-50 text-primary border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>3. Espacios & Amenidades</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('multimedia')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'multimedia'
                    ? 'bg-blue-50 text-primary border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>4. Descripción & Legal</span>
              </button>
            </div>

            {/* TAB 1: COMERCIAL & TIPO */}
            {activeTab === 'general' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-surface-dark mb-1">
                    Título de la Publicación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Ej. Departamento soleado con vista en Sopocachi"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Categoría / Tipo de Inmueble
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none bg-white cursor-pointer"
                    >
                      {PROPERTY_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Modalidad de Contrato
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none bg-white cursor-pointer"
                    >
                      <option value="Anticrético">Anticrético</option>
                      <option value="Venta">Venta</option>
                      <option value="Alquiler">Alquiler</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-bold text-surface-dark mb-1">
                        Moneda
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditCurrency('USD')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            editCurrency === 'USD'
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          $us (Dólares)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditCurrency('BOB')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            editCurrency === 'BOB'
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Bs. (Bolivianos)
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-surface-dark mb-1">
                        Monto de Precio <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-black text-gray-500">
                          {editCurrency === 'USD' ? '$us' : 'Bs.'}
                        </span>
                        <input
                          type="text"
                          required
                          value={editPriceAmount}
                          onChange={(e) => setEditPriceAmount(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="45000"
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs font-black text-primary text-base focus:border-primary outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <input
                      type="checkbox"
                      id="editIsNegotiable"
                      checked={editIsNegotiable}
                      onChange={(e) => setEditIsNegotiable(e.target.checked)}
                      className="w-4 h-4 text-primary rounded cursor-pointer"
                    />
                    <label htmlFor="editIsNegotiable" className="text-xs font-bold text-gray-700 cursor-pointer">
                      El precio es negociable / conversable
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UBICACIÓN & COORDENADAS */}
            {activeTab === 'ubicacion' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Zona / Barrio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editZone}
                      onChange={(e) => setEditZone(e.target.value)}
                      placeholder="Ej. Sopocachi, Calacoto, Miraflores..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Dirección / Calle exacta
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Ej. Av. 20 de Octubre esq. Aspiazu #1420"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Compass className="w-4 h-4" />
                    <span className="text-xs font-black">Ubicación exacta</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                      <label className="block text-xs font-bold text-surface-dark mb-1">
                        En contruccion inge
                      </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ESPACIOS & AMENIDADES */}
            {activeTab === 'caracteristicas' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Habitaciones
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editBedrooms}
                      onChange={(e) => setEditBedrooms(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Baños
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={editBathrooms}
                      onChange={(e) => setEditBathrooms(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Parqueos / Autos
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={editParking}
                      onChange={(e) => setEditParking(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Sup. Construida (m²)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editAreaSqm}
                      onChange={(e) => setEditAreaSqm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-dark mb-1">
                      Sup. Terreno (m²) <span className="text-[10px] text-gray-400">(Opcional)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editLandAreaSqm}
                      onChange={(e) => setEditLandAreaSqm(e.target.value)}
                      placeholder="Ej. 250"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-dark mb-2">
                    Amenidades y Equipamiento
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AVAILABLE_AMENITIES.map((amenity) => {
                      const isChecked = editAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-blue-50 border-primary text-primary shadow-xs'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                            isChecked ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{amenity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DESCRIPCIÓN & MULTIMEDIA */}
            {activeTab === 'multimedia' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-surface-dark mb-1">
                    Descripción Comercial de la Propiedad
                  </label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Detalla iluminación, sol de mañana, acabados, vistas panorámicas, etc."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-dark mb-1">
                    URL de Fotografía Principal / Portada
                  </label>
                  <input
                    type="url"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
                  />
                  {editImage && (
                    <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-gray-200 relative">
                      <img src={editImage} alt="Vista previa" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* INFORMACIÓN LEGAL PROTEGIDA */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold">Datos con Respaldo Notarial (Solo Lectura)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-gray-500 font-bold block">Folio Real Registrado:</span>
                      <span className="font-mono font-black text-gray-800">{editingProperty.folioReal}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block">Asesor Legal Designado:</span>
                      <span className="font-black text-gray-800">{editingProperty.assignedAdvisor || 'Lic. Carlos Vega'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FEEDBACK DE ÉXITO */}
            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* BOTONES DE ACCIÓN */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex justify-center gap-2.5 w-full">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-black bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando en PostgreSQL...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
