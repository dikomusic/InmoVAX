"use client";
import React, { useState } from 'react';
import { SellerPropertyCard, SellerProperty } from '../molecules/SellerPropertyCard';
import { AdminSearchFilter } from '../molecules/AdminSearchFilter';
import { Modal } from '../atoms/Modal';

interface SellerPropertiesSectionProps {
  properties: SellerProperty[];
  onTogglePause: (id: string) => void;
  onOpenPublishModal: () => void;
  onUpdateProperty: (property: SellerProperty) => void;
}

export const SellerPropertiesSection = ({
  properties,
  onTogglePause,
  onOpenPublishModal,
  onUpdateProperty
}: SellerPropertiesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [selectedProperty, setSelectedProperty] = useState<SellerProperty | null>(null);
  const [editingProperty, setEditingProperty] = useState<SellerProperty | null>(null);

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      
      {/* FILTROS */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Buscar en mis inmuebles por zona o título..."
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

      {/* LISTA DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <SellerPropertyCard
            key={prop.id}
            property={prop}
            onTogglePause={onTogglePause}
            onEdit={(property) => setEditingProperty(property)}
            onViewStats={(property) => setSelectedProperty(property)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm text-content-muted">
          <span className="text-4xl block mb-2">🏠</span>
          <h4 className="font-extrabold text-surface-dark text-base">No hay inmuebles que coincidan</h4>
          <p className="text-xs text-content-muted mt-1">Prueba cambiando los términos de búsqueda o registra una nueva publicación.</p>
        </div>
      )}

      {/* MODAL DE RENDIMIENTO */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={`Rendimiento Comercial: ${selectedProperty?.title}`}
        subtitle={`Zona: ${selectedProperty?.zone} • Folio: ${selectedProperty?.folioReal}`}
      >
        {selectedProperty && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-center">
                <span className="text-2xl font-black text-primary block">👁️ {selectedProperty.views}</span>
                <span className="text-xs font-bold text-blue-950 mt-1 block">Visualizaciones en el Portal</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                <span className="text-2xl font-black text-emerald-600 block">💬 {selectedProperty.inquiries}</span>
                <span className="text-xs font-bold text-emerald-950 mt-1 block">Clientes Interesados</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Asesor Responsable:</span>
                <span className="font-extrabold text-surface-dark">{selectedProperty.assignedAdvisor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Precio Oficial:</span>
                <span className="font-black text-primary text-sm">{selectedProperty.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-bold">Estado en Catálogo:</span>
                <span className="font-black text-emerald-700">{selectedProperty.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
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
        subtitle="Actualiza el precio, descripción o detalles de tu inmueble"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-dark mb-1">Precio ($us)</label>
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

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow cursor-pointer"
              >
                Guardar Modificaciones
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
