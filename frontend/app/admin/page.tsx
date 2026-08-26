"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface Property {
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
}

interface Advisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  activeProperties: number;
  rating: number;
  avatar: string;
}

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  propertyTitle: string;
  date: string;
  time: string;
  advisorName: string;
  status: 'Confirmada' | 'Pendiente' | 'Completada';
}

const INITIAL_PROPERTIES: Property[] = [
  {
    id: "PROP-104",
    title: "Departamento de Lujo con Terraza Panorámica",
    zone: "Sopocachi, La Paz",
    type: "Anticrético",
    price: "$us 45,000",
    status: "En Revisión Legal",
    advisor: "Carlos Vega",
    folioReal: "2.01.0.99.0018472",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    date: "Hoy, 10:30 AM",
    rooms: 3,
    area: "140 m²"
  },
  {
    id: "PROP-103",
    title: "Casa Familiar con Jardín y Parrillero",
    zone: "Achumani, La Paz",
    type: "Venta",
    price: "$us 320,000",
    status: "Publicado",
    advisor: "Mariana Ríos",
    folioReal: "2.01.4.12.0049182",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    date: "Ayer",
    rooms: 4,
    area: "320 m²"
  },
  {
    id: "PROP-102",
    title: "Penthouse Exclusivo con Vista al Illimani",
    zone: "Calacoto, La Paz",
    type: "Anticrético",
    price: "$us 75,000",
    status: "Pendiente",
    advisor: "Carlos Vega",
    folioReal: "2.01.1.05.0083719",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    date: "24 Ago 2026",
    rooms: 3,
    area: "185 m²"
  },
  {
    id: "PROP-101",
    title: "Oficina Corporativa Torre Empresarial",
    zone: "San Jorge, La Paz",
    type: "Alquiler",
    price: "$us 1,200/mes",
    status: "Publicado",
    advisor: "Andrea Morales",
    folioReal: "2.01.0.88.0029314",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    date: "22 Ago 2026",
    rooms: 2,
    area: "90 m²"
  },
  {
    id: "PROP-100",
    title: "Monoambiente Amoblado para Ejecutivos",
    zone: "Miraflores, La Paz",
    type: "Alquiler",
    price: "$us 450/mes",
    status: "Publicado",
    advisor: "Mariana Ríos",
    folioReal: "2.01.2.33.0019283",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    date: "20 Ago 2026",
    rooms: 1,
    area: "48 m²"
  }
];

const INITIAL_ADVISORS: Advisor[] = [
  {
    id: "ADV-1",
    name: "Carlos Vega",
    email: "carlos.vega@inmovax.com",
    phone: "+591 76543210",
    zone: "Zona Sur & Sopocachi",
    activeProperties: 8,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "ADV-2",
    name: "Mariana Ríos",
    email: "mariana.rios@inmovax.com",
    phone: "+591 71234567",
    zone: "Achumani & Calacoto",
    activeProperties: 6,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "ADV-3",
    name: "Andrea Morales",
    email: "andrea.morales@inmovax.com",
    phone: "+591 78901234",
    zone: "Centro & San Jorge",
    activeProperties: 4,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-1",
    clientName: "Lic. Roberto Quiroga",
    clientPhone: "+591 77201928",
    propertyTitle: "Anticrético Sopocachi ($us 45,000)",
    date: "Hoy",
    time: "15:00",
    advisorName: "Carlos Vega",
    status: "Confirmada"
  },
  {
    id: "APT-2",
    clientName: "Arq. Patricia Paredes",
    clientPhone: "+591 70619283",
    propertyTitle: "Casa Achumani ($us 320,000)",
    date: "Mañana",
    time: "10:30",
    advisorName: "Mariana Ríos",
    status: "Pendiente"
  },
  {
    id: "APT-3",
    clientName: "Dr. Fernando Morales",
    clientPhone: "+591 72039485",
    propertyTitle: "Oficina San Jorge ($us 1,200)",
    date: "28 Ago",
    time: "16:00",
    advisorName: "Andrea Morales",
    status: "Confirmada"
  }
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'propiedades' | 'legal' | 'asesores'>('resumen');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const cambiarEstadoPropiedad = (id: string, nuevoEstado: Property['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: nuevoEstado } : p));
    showToast(`✅ Propiedad ${id} actualizada a: ${nuevoEstado}`);
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(prev => prev ? { ...prev, status: nuevoEstado } : null);
    }
  };

  const eliminarPropiedad = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro del sistema?")) {
      setProperties(prev => prev.filter(p => p.id !== id));
      showToast(`🗑️ Propiedad ${id} eliminada correctamente.`);
      setSelectedProperty(null);
    }
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

  const anticreticosEnRevision = properties.filter(p => p.type === 'Anticrético' && (p.status === 'En Revisión Legal' || p.status === 'Pendiente'));

  return (
    <div className="space-y-8">

      {/* NOTIFICACIÓN TOAST FLOTANTE */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-bounce">
          <span className="text-accent font-black">⚡ InmoVax Core:</span>
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* BANNER DE BIENVENIDA ADMINISTRATIVA */}
      <div className="bg-gradient-to-r from-surface-dark via-[#0C1A4A] to-surface-dark rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-gray-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-black uppercase tracking-wider mb-3">
            <span>🛡️</span> Portal de Administración Central
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Bienvenido, <span className="text-accent">Daniel Catari</span>
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Panel de supervisión en tiempo real de transacciones inmobiliarias, validación de gravámenes/Folio Real y control de asesores en La Paz.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* PESTAÑAS PRINCIPALES DEL PANEL */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('resumen')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'resumen'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white text-content-muted hover:text-content-main hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span>📊</span> Resumen & Métricas
        </button>

        <button
          onClick={() => setActiveTab('propiedades')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'propiedades'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white text-content-muted hover:text-content-main hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span>🏠</span> Propiedades & Publicaciones
          <span className="ml-1 text-[10px] bg-accent text-surface-dark px-1.5 py-0.5 rounded-md font-black">
            {properties.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white text-content-muted hover:text-content-main hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span>⚖️</span> Revisión Legal Folio Real
          {anticreticosEnRevision.length > 0 && (
            <span className="ml-1 text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-md font-black animate-pulse">
              {anticreticosEnRevision.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('asesores')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'asesores'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white text-content-muted hover:text-content-main hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span>👥</span> Asesores & Citas
          <span className="ml-1 text-[10px] bg-blue-100 text-primary px-1.5 py-0.5 rounded-md font-black">
            {INITIAL_APPOINTMENTS.length}
          </span>
        </button>
      </div>

      {/* CONTENIDO 1: RESUMEN / METRICAS */}
      {activeTab === 'resumen' && (
        <div className="space-y-8">
          
          {/* TARJETAS KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-xl font-black">
                  🏠
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  +12% este mes
                </span>
              </div>
              <p className="text-xs font-bold text-content-muted uppercase tracking-wider">Inmuebles Activos</p>
              <h3 className="text-3xl font-black text-surface-dark mt-1">28</h3>
              <p className="text-[11px] text-content-muted mt-2">14 en venta • 8 anticréticos • 6 alquiler</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black">
                  ⚖️
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                  Prioridad Alta
                </span>
              </div>
              <p className="text-xs font-bold text-content-muted uppercase tracking-wider">Revisión Folio Real</p>
              <h3 className="text-3xl font-black text-surface-dark mt-1">{anticreticosEnRevision.length}</h3>
              <p className="text-[11px] text-content-muted mt-2">Documentos pendientes de firma legal</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
                  💰
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  +18.4%
                </span>
              </div>
              <p className="text-xs font-bold text-content-muted uppercase tracking-wider">Volumen Transaccional</p>
              <h3 className="text-3xl font-black text-surface-dark mt-1">$us 440K</h3>
              <p className="text-[11px] text-content-muted mt-2">Capital en anticréticos gestionados</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-black">
                  👥
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                  100% activos
                </span>
              </div>
              <p className="text-xs font-bold text-content-muted uppercase tracking-wider">Equipo de Asesores</p>
              <h3 className="text-3xl font-black text-surface-dark mt-1">{INITIAL_ADVISORS.length}</h3>
              <p className="text-[11px] text-content-muted mt-2">Calificación promedio: 4.86 ⭐</p>
            </div>

          </div>

          {/* SECCIÓN DE ACTIVIDAD Y DISTRIBUCIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GRÁFICO CONCEPTUAL DE DISTRIBUCIÓN */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-extrabold text-base text-surface-dark">Demanda Inmobiliaria por Zona (La Paz)</h3>
                  <p className="text-xs text-content-muted">Consultas de clientes en los últimos 30 días</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  Actualizado en vivo
                </span>
              </div>

              {/* BARRAS DE PROGRESO DE ZONAS */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-content-main">Sopocachi (Anticréticos y Departamentos)</span>
                    <span className="text-primary font-black">42% (128 solicitudes)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-content-main">Calacoto & San Miguel (Ventas de Casas y Deptos)</span>
                    <span className="text-accent font-black">28% (84 solicitudes)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-accent h-3 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-content-main">Achumani & Los Pinos (Casas familiares)</span>
                    <span className="text-emerald-500 font-black">18% (55 solicitudes)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-content-main">Centro & San Jorge (Oficinas y Monoambientes)</span>
                    <span className="text-purple-500 font-black">12% (36 solicitudes)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-content-muted font-medium">
                <span>💡 InmoVax Analytics: El 65% del tráfico busca anticréticos seguros con Folio Real.</span>
                <button onClick={() => setActiveTab('propiedades')} className="font-bold text-primary hover:underline cursor-pointer">
                  Ver listado completo →
                </button>
              </div>
            </div>

            {/* PANEL DE CITAS RECIENTES */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base text-surface-dark">Próximas Visitas Agendadas</h3>
                  <span className="text-[10px] bg-blue-50 text-primary font-bold px-2 py-0.5 rounded-full">
                    {INITIAL_APPOINTMENTS.length} Citas
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {INITIAL_APPOINTMENTS.map((apt) => (
                    <div key={apt.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-surface-dark">{apt.clientName}</span>
                        <span className="text-[10px] font-black bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          {apt.date} • {apt.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-muted mt-0.5">{apt.propertyTitle}</p>
                      <p className="text-[10px] text-primary font-bold mt-1">Asesor: {apt.advisorName}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('asesores')}
                className="w-full mt-4 py-2.5 text-xs font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center cursor-pointer"
              >
                Gestionar Agenda Completa
              </button>
            </div>

          </div>

        </div>
      )}

      {/* CONTENIDO 2: GESTIÓN DE PROPIEDADES */}
      {activeTab === 'propiedades' && (
        <div className="space-y-6">
          
          {/* BARRA DE HERRAMIENTAS Y FILTROS */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* BUSCADOR */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por zona, título o Folio Real..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none"
              />
              <span className="absolute left-3 top-3 text-xs text-gray-400">🔍</span>
            </div>

            {/* FILTROS DESPLEGABLES */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer"
              >
                <option value="todos">Todos los Tipos</option>
                <option value="Anticrético">Anticrético</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer"
              >
                <option value="todos">Todos los Estados</option>
                <option value="Publicado">Publicado</option>
                <option value="En Revisión Legal">En Revisión Legal</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pausado">Pausado</option>
              </select>

              <Link
                href="/publicar"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm"
              >
                + Nuevo Inmueble
              </Link>
            </div>

          </div>

          {/* TABLA DINÁMICA DE PROPIEDADES */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Inmueble</th>
                    <th className="py-3.5 px-4">Tipo</th>
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
                            <div className="text-[11px] text-content-muted truncate">{prop.zone} • {prop.area} • {prop.rooms} dorm</div>
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
                          prop.status === 'En Revisión Legal' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          prop.status === 'Pendiente' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          ● {prop.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProperty(prop)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                            title="Ver detalles e inspeccionar"
                          >
                            👁️
                          </button>

                          {prop.status !== 'Publicado' && (
                            <button
                              onClick={() => cambiarEstadoPropiedad(prop.id, 'Publicado')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="Aprobar y publicar de inmediato"
                            >
                              ✓ Aprobar
                            </button>
                          )}

                          {prop.status === 'Publicado' && (
                            <button
                              onClick={() => cambiarEstadoPropiedad(prop.id, 'Pausado')}
                              className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              title="Pausar publicación"
                            >
                              ⏸ Pausar
                            </button>
                          )}

                          <button
                            onClick={() => eliminarPropiedad(prop.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar registro"
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

        </div>
      )}

      {/* CONTENIDO 3: REVISIÓN LEGAL / FOLIO REAL */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-amber-900 flex items-center gap-2">
                <span>🛡️</span> Módulo de Verificación Notarial y Folio Real (InmoVax Legal)
              </h3>
              <p className="text-xs text-amber-800 mt-1 font-medium">
                Garantía para el mercado de anticréticos en Bolivia. Ningún inmueble en anticrético se publica sin validación alodial previa.
              </p>
            </div>
            <span className="text-xs font-black bg-amber-500 text-white px-3 py-1.5 rounded-xl whitespace-nowrap shadow-sm">
              {anticreticosEnRevision.length} Inmuebles por verificar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {anticreticosEnRevision.map((prop) => (
              <div key={prop.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                      {prop.id}
                    </span>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      {prop.status}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <img src={prop.image} alt={prop.title} className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
                    <div>
                      <h4 className="font-extrabold text-surface-dark text-sm">{prop.title}</h4>
                      <p className="text-xs text-content-muted mt-0.5">{prop.zone}</p>
                      <p className="text-sm font-black text-primary mt-1">Monto Anticrético: {prop.price}</p>
                    </div>
                  </div>

                  {/* CHECKLIST LEGAL SIMULADO */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 border border-gray-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700">Folio Real Matriculado:</span>
                      <span className="font-mono text-primary font-black">{prop.folioReal}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                      <span>Certificado Alodial (Derechos Reales):</span>
                      <span className="text-emerald-600 font-bold">✓ Libre de Gravamen</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                      <span>Impuestos al Día (GAMLP):</span>
                      <span className="text-emerald-600 font-bold">✓ Gestión 2025 Pagada</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                      <span>Asesor Responsable:</span>
                      <span className="text-gray-900 font-bold">{prop.advisor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => cambiarEstadoPropiedad(prop.id, 'Publicado')}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow cursor-pointer text-center"
                  >
                    ✓ Validar y Publicar
                  </button>
                  <button
                    onClick={() => cambiarEstadoPropiedad(prop.id, 'Pausado')}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    ✕ Rechazar Documento
                  </button>
                </div>

              </div>
            ))}
          </div>

          {anticreticosEnRevision.length === 0 && (
            <div className="bg-white text-center py-16 rounded-2xl border border-gray-100 text-content-muted">
              <span className="text-4xl block mb-2">🎉</span>
              <h4 className="font-extrabold text-surface-dark text-base">Todos los Folios Reales están al día</h4>
              <p className="text-xs mt-1">No hay anticréticos pendientes de validación legal en este momento.</p>
            </div>
          )}

        </div>
      )}

      {/* CONTENIDO 4: ASESORES Y CITAS */}
      {activeTab === 'asesores' && (
        <div className="space-y-8">
          
          {/* TARJETAS DE ASESORES */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-surface-dark">Equipo de Asesores Inmobiliarios</h3>
                <p className="text-xs text-content-muted">Agentes certificados por InmoVax para visitas y contratos</p>
              </div>
              <button 
                onClick={() => showToast("Funcionalidad para registrar nuevo asesor habilitada.")}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                + Añadir Asesor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INITIAL_ADVISORS.map((adv) => (
                <div key={adv.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <img
                    src={adv.avatar}
                    alt={adv.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-md mb-4"
                  />
                  <h4 className="font-extrabold text-base text-surface-dark">{adv.name}</h4>
                  <p className="text-xs text-primary font-bold mt-0.5">{adv.zone}</p>
                  
                  <div className="flex items-center gap-1 my-3 bg-amber-50 px-3 py-1 rounded-full text-amber-800 text-xs font-black">
                    <span>⭐</span> {adv.rating} / 5.0 (Excelente)
                  </div>

                  <div className="w-full border-t border-gray-100 pt-4 mt-2 grid grid-cols-2 gap-2 text-left text-xs text-gray-600">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Propiedades</span>
                      <span className="font-black text-surface-dark text-sm">{adv.activeProperties} activas</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Contacto</span>
                      <span className="font-bold text-gray-900 truncate block">{adv.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Citas asignadas a ${adv.name} visualizadas.`)}
                    className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-primary font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Ver Agenda de Citas
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TABLA DE CITAS AGENDADAS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-extrabold text-base text-surface-dark mb-4">Agenda de Visitas Inmobiliarias</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Teléfono</th>
                    <th className="py-3 px-4">Propiedad de Interés</th>
                    <th className="py-3 px-4">Fecha y Hora</th>
                    <th className="py-3 px-4">Asesor Asignado</th>
                    <th className="py-3 px-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {INITIAL_APPOINTMENTS.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 font-bold text-surface-dark">{apt.clientName}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-600">{apt.clientPhone}</td>
                      <td className="py-3.5 px-4 text-primary font-bold">{apt.propertyTitle}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">{apt.date} a las {apt.time}</td>
                      <td className="py-3.5 px-4 text-gray-700">{apt.advisorName}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          apt.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODAL DE DETALLE Y REVISIÓN DE INMUEBLE */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedProperty.id}
                </span>
                <h3 className="text-xl font-extrabold text-surface-dark mt-2">{selectedProperty.title}</h3>
                <p className="text-xs text-content-muted">{selectedProperty.zone}</p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-6 space-y-4">
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
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Habitaciones</span>
                  <span className="text-xs font-extrabold text-surface-dark">{selectedProperty.rooms} Dorms</span>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">Folio Real Oficial:</span>
                  <span className="font-mono font-black text-primary">{selectedProperty.folioReal}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="font-bold text-gray-700">Asesor a Cargo:</span>
                  <span className="font-bold text-gray-900">{selectedProperty.advisor}</span>
                </div>
              </div>
            </div>

            {/* ACCIONES DEL MODAL */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              {selectedProperty.status !== 'Publicado' && (
                <button
                  onClick={() => cambiarEstadoPropiedad(selectedProperty.id, 'Publicado')}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
                >
                  ✓ Aprobar y Publicar
                </button>
              )}

              {selectedProperty.status === 'Publicado' && (
                <button
                  onClick={() => cambiarEstadoPropiedad(selectedProperty.id, 'Pausado')}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all cursor-pointer"
                >
                  ⏸ Pausar Publicación
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
