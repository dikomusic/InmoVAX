"use client";
import React, { useState } from 'react';
import { AdminSearchFilter } from '../molecules/AdminSearchFilter';
import { Modal } from '../atoms/Modal';

export interface PropertyItem {
  id: string;
  title: string;
  zone: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  price: string;
  status: 'Publicado' | 'En Revisión Legal' | 'Pendiente' | 'Pausado';
  advisor: string;
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
    advisor: 'Carlos Vega',
    folioReal: '2.01.0.99.0018472',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    rooms: 3,
    area: '140 m²',
    description: 'Excelente iluminación natural y acabados de primera calidad.'
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      zone: 'Sopocachi, La Paz',
      type: 'Anticrético',
      price: '$us 50,000',
      status: 'Publicado',
      advisor: 'Carlos Vega',
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
      advisor: prop.advisor,
      folioReal: prop.folioReal,
      image: prop.image,
      rooms: prop.rooms,
      area: prop.area,
      description: prop.description || 'Inmueble auditado por InmoVax.'
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
                          prop.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* CABECERA Y FILTROS */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Buscar por zona, título, ID o Folio Real..."
        selectFilters={[
          {
            value: filterType,
            onChange: setFilterType,
            options: [
              { label: 'Todos los Tipos', value: 'todos' },
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
          label: "+ Registrar Inmueble",
          onClick: handleOpenCreateModal
        }}
      />

      {/* TABLA DINÁMICA DE PROPIEDADES */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Inmueble</th>
                <th className="py-3.5 px-4">Modalidad</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4">Folio Real</th>
                <th className="py-3.5 px-4">Asesor Asignado</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-blue-50/40 transition-colors">
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <div className="font-extrabold text-surface-dark truncate">{prop.title}</div>
                        <div className="text-[11px] text-content-muted truncate">{prop.zone} • {prop.area} • {prop.rooms} dorms</div>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {prop.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${
                      prop.type === 'Anticrético' ? 'bg-amber-100 text-amber-800' :
                      prop.type === 'Venta' ? 'bg-blue-100 text-primary' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {prop.type}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-surface-dark text-sm">
                    {prop.price}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-mono text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                      {prop.folioReal}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-gray-700 font-semibold">
                    {prop.advisor}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      prop.status === 'Publicado' ? 'bg-emerald-100 text-emerald-800' :
                      prop.status === 'En Revisión Legal' ? 'bg-amber-100 text-amber-800' :
                      prop.status === 'Pendiente' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      ● {prop.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedProperty(prop)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalles"
                      >
                        👁️
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(prop)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-lg transition-colors cursor-pointer"
                        title="Editar Inmueble"
                      >
                        ✏️
                      </button>

                      {prop.status !== 'Publicado' ? (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(prop.id, 'Publicado')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          title="Aprobar y Publicar"
                        >
                          ✓ Publicar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(prop.id, 'Pausado')}
                          className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          title="Pausar"
                        >
                          ⏸ Pausar
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeleteProperty(prop.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar Registro"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 text-content-muted">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-bold">No se encontraron propiedades con los filtros seleccionados.</p>
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
          <div className="space-y-4">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              className="w-full h-64 rounded-2xl object-cover shadow-md"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Modalidad</span>
                <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.type}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Precio</span>
                <span className="text-xs font-extrabold text-primary">{selectedProperty.price}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Superficie</span>
                <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.area}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Ambientes</span>
                <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.rooms} Dorms</span>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Folio Real Matriculado:</span>
                <span className="font-mono font-black text-primary">{selectedProperty.folioReal}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Asesor a Cargo:</span>
                <span className="font-bold text-gray-900">{selectedProperty.advisor}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Estado de Publicación:</span>
                <span className="font-bold text-emerald-700">{selectedProperty.status}</span>
              </div>
            </div>

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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  ✓ Publicar Inmueble
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedProperty.id, 'Pausado');
                    setSelectedProperty(prev => prev ? { ...prev, status: 'Pausado' } : null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                >
                  ⏸ Pausar Publicación
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
              <label className="block text-xs font-bold text-surface-dark mb-1">Folio Real Oficial</label>
              <input
                type="text"
                required
                value={formData.folioReal}
                onChange={(e) => setFormData({ ...formData, folioReal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-dark mb-1">Asesor Asignado</label>
              <select
                value={formData.advisor}
                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold focus:border-primary outline-none cursor-pointer"
              >
                <option value="Carlos Vega">Carlos Vega</option>
                <option value="Mariana Ríos">Mariana Ríos</option>
                <option value="Andrea Morales">Andrea Morales</option>
              </select>
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow cursor-pointer"
            >
              {editingId ? 'Guardar Cambios' : 'Registrar Inmueble'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
