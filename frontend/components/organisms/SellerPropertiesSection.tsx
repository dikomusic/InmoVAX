"use client";
import React, { useState } from 'react';
import { Building2, Eye, MessageCircle, Sparkles, Filter } from 'lucide-react';
import { SellerPropertyCard, SellerProperty } from '../molecules/SellerPropertyCard';
import { AdminSearchFilter } from '../molecules/AdminSearchFilter';
import { Modal } from '../atoms/Modal';

interface SellerPropertiesSectionProps {
  properties: SellerProperty[];
  onTogglePause: (id: string) => void;
  onOpenPublishModal: () => void;
  onUpdateProperty: (property: SellerProperty) => void;
  onDeleteProperty?: (id: string) => void;
  onRequestDeleteProperty?: (property: SellerProperty) => void;
}

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
  const [editingProperty, setEditingProperty] = useState<SellerProperty | null>(null);

  const filtered = properties.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.folioReal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'todos' || p.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      onUpdateProperty(editingProperty);
      setEditingProperty(null);
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
            Administra tus publicaciones activas, pausa visibilidad o actualiza detalles comerciales.
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
            onEdit={(property) => setEditingProperty(property)}
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

      {/* MODAL EDICIÓN PROPIEDAD */}
      <Modal
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        title="Modificar Datos de la Publicación"
        subtitle="Actualiza el precio, zona o título de tu inmueble"
      >
        {editingProperty && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Título de la Publicación</label>
              <input
                type="text"
                required
                value={editingProperty.title}
                onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-dark mb-1">Precio</label>
                <input
                  type="text"
                  required
                  value={editingProperty.price}
                  onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-dark mb-1">Zona / Barrio</label>
                <input
                  type="text"
                  required
                  value={editingProperty.zone}
                  onChange={(e) => setEditingProperty({ ...editingProperty, zone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-extrabold bg-primary hover:bg-primary-hover text-white rounded-xl shadow cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
