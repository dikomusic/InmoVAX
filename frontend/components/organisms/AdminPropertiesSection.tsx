"use client";
import React, { useState } from 'react';
import { AdminSearchFilter } from '../molecules/AdminSearchFilter';
import { Modal } from '../atoms/Modal';
import { 
  Building2, Search, Plus, Eye, Edit3, Trash2, CheckCircle2, 
  PauseCircle, Play, ShieldCheck, MapPin, DollarSign, BedDouble, 
  Maximize2, User, FileText, Check, X, Filter, Sparkles, Clock, AlertCircle, Phone
} from 'lucide-react';

export interface PropertyItem {
  id: string;
  title: string;
  zone: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  price: string;
  status: 'Publicado' | 'En Revisión Legal' | 'Pendiente' | 'Pausado';
  ownerName: string;
  ownerContact?: string;
  folioReal: string;
  image: string;
  date: string;
  rooms: number;
  area: string;
  description?: string;
}

interface AdminPropertiesSectionProps {
  properties: PropertyItem[];
  onUpdateStatus: (id: string, newStatus: PropertyItem['status']) => void;
  onDeleteProperty: (id: string) => void;
  onAddProperty: (property: PropertyItem) => void;
  onEditProperty: (property: PropertyItem) => void;
}

export const AdminPropertiesSection = ({
  properties,
  onUpdateStatus,
  onDeleteProperty,
  onAddProperty,
  onEditProperty
}: AdminPropertiesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  
  // Modal de detalle/inspección
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  
  // Modal de creación/edición
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    zone: 'Sopocachi, La Paz',
    type: 'Anticrético' as PropertyItem['type'],
    price: '$us 45,000',
    status: 'Publicado' as PropertyItem['status'],
    ownerName: 'Propietario InmoVAX',
    ownerContact: '+591 76543210',
    folioReal: '2.01.0.99.0018472',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    rooms: 3,
    area: '140 m²',
    description: 'Excelente iluminación natural y acabados de primera calidad.'
  });

  // Métricas calculadas para la cabecera
  const totalCount = properties.length;
  const publishedCount = properties.filter(p => p.status === 'Publicado').length;
  const legalReviewCount = properties.filter(p => p.status === 'En Revisión Legal').length;
  const pendingOrPausedCount = properties.filter(p => p.status === 'Pendiente' || p.status === 'Pausado').length;

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      zone: 'Sopocachi, La Paz',
      type: 'Anticrético',
      price: '$us 50,000',
      status: 'Publicado',
      ownerName: 'Propietario InmoVAX',
      ownerContact: '+591 76543210',
      folioReal: '2.01.0.99.00' + Math.floor(1000 + Math.random() * 9000),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      rooms: 3,
      area: '120 m²',
      description: 'Inmueble con excelente ubicación en zona residencial.'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (prop: PropertyItem) => {
    setEditingId(prop.id);
    setFormData({
      title: prop.title,
      zone: prop.zone,
      type: prop.type,
      price: prop.price,
      status: prop.status,
      ownerName: prop.ownerName || 'Propietario InmoVAX',
      ownerContact: prop.ownerContact || '+591 76543210',
      folioReal: prop.folioReal,
      image: prop.image,
      rooms: prop.rooms,
      area: prop.area,
      description: prop.description || 'Inmueble publicado en InmoVax.'
    });
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditProperty({
        id: editingId,
        ...formData,
        date: 'Actualizado hoy'
      });
    } else {
      const newId = `PROP-${Math.floor(105 + Math.random() * 890)}`;
      onAddProperty({
        id: newId,
        ...formData,
        date: 'Registrado hoy'
      });
    }
    setIsFormModalOpen(false);
  };

  const filteredProperties = properties.filter(prop => {
    const matchesType = filterType === 'todos' || prop.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'todos' || prop.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prop.folioReal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (prop.ownerName && prop.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          prop.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* TARJETAS DE RESUMEN RÁPIDO / KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Inmuebles */}
        <div 
          onClick={() => setFilterStatus('todos')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'todos' 
              ? 'bg-blue-50/60 border-primary/30 ring-2 ring-primary/20 shadow-xs' 
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Inmuebles</span>
            <div className="p-2 rounded-xl bg-blue-100/60 text-primary">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-surface-dark">{totalCount}</span>
            <span className="text-[10px] text-gray-400 font-semibold">en portafolio</span>
          </div>
        </div>

        {/* Publicados Activos */}
        <div 
          onClick={() => setFilterStatus('Publicado')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'Publicado' 
              ? 'bg-emerald-50/60 border-emerald-500/30 ring-2 ring-emerald-500/20 shadow-xs' 
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Activos en Catálogo</span>
            <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{publishedCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">visibles al público</span>
          </div>
        </div>

        {/* En Revisión Legal */}
        <div 
          onClick={() => setFilterStatus('En Revisión Legal')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'En Revisión Legal' 
              ? 'bg-amber-50/60 border-amber-500/30 ring-2 ring-amber-500/20 shadow-xs' 
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Revisión Pendiente</span>
            <div className="p-2 rounded-xl bg-amber-100/60 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">{legalReviewCount}</span>
            <span className="text-[10px] text-amber-700 font-semibold">por verificar</span>
          </div>
        </div>

        {/* Pausados / Pendientes */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'Pausado' ? 'todos' : 'Pausado')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'Pausado' || filterStatus === 'Pendiente'
              ? 'bg-slate-100/80 border-slate-400/30 ring-2 ring-slate-400/20 shadow-xs' 
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Pausados / Espera</span>
            <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
              <PauseCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-surface-dark">{pendingOrPausedCount}</span>
            <span className="text-[10px] text-gray-400 font-semibold">inactivos</span>
          </div>
        </div>

      </div>

      {/* CABECERA Y FILTROS */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Buscar por título, zona, ID o propietario..."
        selectFilters={[
          {
            value: filterType,
            onChange: setFilterType,
            options: [
              { label: 'Todas las Modalidades', value: 'todos' },
              { label: 'Anticrético', value: 'Anticrético' },
              { label: 'Venta', value: 'Venta' },
              { label: 'Alquiler', value: 'Alquiler' }
            ]
          },
          {
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { label: 'Todos los Estados', value: 'todos' },
              { label: 'Publicado', value: 'Publicado' },
              { label: 'En Revisión Legal', value: 'En Revisión Legal' },
              { label: 'Pendiente', value: 'Pendiente' },
              { label: 'Pausado', value: 'Pausado' }
            ]
          }
        ]}
        actionButton={{
          label: "Registrar Inmueble",
          icon: <Plus className="w-4 h-4" />,
          onClick: handleOpenCreateModal
        }}
      />

      {/* TABLA DINÁMICA DE PROPIEDADES */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-gray-200/80 text-gray-500 font-black uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4">Inmueble</th>
                <th className="py-4 px-4">Modalidad</th>
                <th className="py-4 px-4">Precio</th>
                <th className="py-4 px-4">Folio Real</th>
                <th className="py-4 px-4">Propietario / Contacto</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors group">
                  
                  {/* Celda Inmueble */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {prop.image && prop.image.trim() !== '' ? (
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-13 h-13 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs group-hover:scale-102 transition-transform"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0 text-slate-400">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 max-w-xs">
                        <div className="font-black text-surface-dark truncate text-xs hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedProperty(prop)}>
                          {prop.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-content-muted mt-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                          <span className="truncate">{prop.zone}</span>
                          <span>•</span>
                          <span className="shrink-0">{prop.area}</span>
                          <span>•</span>
                          <span className="shrink-0">{prop.rooms} dorms</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 border border-gray-200 px-1.5 py-0.2 rounded">
                            {prop.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Celda Modalidad */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wide border ${
                      prop.type === 'Anticrético' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : prop.type === 'Venta' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-blue-50 text-primary border-blue-200'
                    }`}>
                      {prop.type}
                    </span>
                  </td>

                  {/* Celda Precio */}
                  <td className="py-4 px-4 font-black text-surface-dark text-sm whitespace-nowrap">
                    {prop.price}
                  </td>

                  {/* Celda Folio Real */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-gray-800 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span>{prop.folioReal || 'Sin Folio'}</span>
                    </div>
                  </td>

                  {/* Celda Propietario / Contacto */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-primary shrink-0">
                        {(prop.ownerName || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-gray-800 font-bold text-xs block">{prop.ownerName || 'Propietario InmoVAX'}</span>
                        {prop.ownerContact && (
                          <span className="text-gray-400 text-[10px] block">{prop.ownerContact}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Celda Estado */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${
                      prop.status === 'Publicado' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : prop.status === 'En Revisión Legal' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : prop.status === 'Pendiente' 
                        ? 'bg-sky-50 text-sky-800 border-sky-200' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        prop.status === 'Publicado' ? 'bg-emerald-500' :
                        prop.status === 'En Revisión Legal' ? 'bg-amber-500' :
                        prop.status === 'Pendiente' ? 'bg-sky-500' : 'bg-gray-400'
                      }`} />
                      {prop.status}
                    </span>
                  </td>

                  {/* Celda Acciones */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Botón Ver Detalle */}
                      <button
                        type="button"
                        onClick={() => setSelectedProperty(prop)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Botón Editar */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(prop)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-lg transition-colors cursor-pointer"
                        title="Editar Inmueble"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Botón Publicar / Pausar */}
                      {prop.status !== 'Publicado' ? (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(prop.id, 'Publicado')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                          title="Aprobar y Publicar en el Catálogo"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Publicar</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(prop.id, 'Pausado')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer active:scale-95"
                          title="Pausar Publicación"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </button>
                      )}

                      {/* Botón Eliminar */}
                      <button
                        type="button"
                        onClick={() => onDeleteProperty(prop.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar Registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado Vacío */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16 px-4 text-content-muted">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Search className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-surface-dark mb-1">No se encontraron propiedades</p>
            <p className="text-xs text-content-muted max-w-sm mx-auto mb-4">
              Ningún inmueble coincide con los términos de búsqueda o filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setFilterType('todos'); setFilterStatus('todos'); }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLE Y REVISIÓN */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.title || 'Detalle del Inmueble'}
        subtitle={`${selectedProperty?.zone} • ID: ${selectedProperty?.id}`}
      >
        {selectedProperty && (
          <div className="space-y-5">
            {selectedProperty.image && selectedProperty.image.trim() !== '' ? (
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-64 rounded-2xl object-cover shadow-md border border-gray-200"
              />
            ) : (
              <div className="w-full h-48 rounded-2xl bg-slate-100 border border-gray-200 flex flex-col items-center justify-center text-slate-400">
                <Building2 className="w-10 h-10 mb-1" />
                <span className="text-xs font-semibold text-slate-500">Sin fotografía adjunta</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Modalidad</span>
                <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.type}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Precio</span>
                <span className="text-xs font-extrabold text-primary">{selectedProperty.price}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Superficie</span>
                <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.area}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ambientes</span>
                <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.rooms} Dorms</span>
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Propietario / Contacto:
                </span>
                <span className="font-bold text-gray-900">{selectedProperty.ownerName || 'Propietario InmoVAX'}</span>
              </div>
              {selectedProperty.ownerContact && (
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" /> Teléfono / WhatsApp:
                  </span>
                  <span className="font-mono text-gray-800 font-bold">{selectedProperty.ownerContact}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Folio Real:
                </span>
                <span className="font-mono font-black text-primary">{selectedProperty.folioReal || 'Sin Folio'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Estado de Publicación:
                </span>
                <span className="font-bold text-emerald-700">{selectedProperty.status}</span>
              </div>
            </div>

            {selectedProperty.description && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Descripción</span>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{selectedProperty.description}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cerrar
              </button>
              {selectedProperty.status !== 'Publicado' ? (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedProperty.id, 'Publicado');
                    setSelectedProperty(prev => prev ? { ...prev, status: 'Publicado' } : null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publicar Inmueble</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedProperty.id, 'Pausado');
                    setSelectedProperty(prev => prev ? { ...prev, status: 'Pausado' } : null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer transition-all shadow-xs"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Pausar Publicación</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingId ? 'Editar Inmueble' : 'Registrar Nuevo Inmueble'}
        subtitle="Complete los datos para mantener actualizado el inventario oficial"
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-surface-dark mb-1">Título del Inmueble</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Departamento de Lujo en Sopocachi"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Zona / Ciudad</label>
              <input
                type="text"
                required
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Modalidad</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyItem['type'] })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none cursor-pointer"
              >
                <option value="Anticrético">Anticrético</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Precio ($us)</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Superficie</label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Dormitorios</label>
              <input
                type="number"
                required
                min={1}
                max={10}
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Propietario / Vendedor</label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Ej: Ing. Gonzalo Benítez"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Teléfono / WhatsApp Dueño</label>
              <input
                type="text"
                value={formData.ownerContact}
                onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                placeholder="+591 76543210"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Folio Real Oficial</label>
              <input
                type="text"
                value={formData.folioReal}
                onChange={(e) => setFormData({ ...formData, folioReal: e.target.value })}
                placeholder="2.01.0.XX.XXXXXXX (Opcional)"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">URL Fotografía</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs cursor-pointer active:scale-95"
            >
              {editingId ? 'Guardar Cambios' : 'Registrar Inmueble'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
