"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, ShieldAlert, Search, MessageSquare, 
  Ban, CheckCircle2, Building2, Phone, Mail, Sparkles 
} from 'lucide-react';

export interface UserItem {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'Administrador' | 'Vendedor' | 'Cliente';
  status: 'Activo' | 'Suspendido';
  propertiesCount: number;
  createdAt?: string;
}

export const AdminUsersSection: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getAdminHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('inmovax-token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-admin-key': 'AdminInmoVAX#2026'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/users', {
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        setUsers(data.users);
      } else {
        // Fallback datos locales si aún no hay usuarios en backend
        setUsers([
          {
            id: "usr-admin-01",
            fullName: "Daniel Catari",
            email: "admin@inmovax.com",
            phone: "+591 76543210",
            role: "Administrador",
            status: "Activo",
            propertiesCount: 8,
            createdAt: "2026-09-01"
          },
          {
            id: "usr-demo-02",
            fullName: "Carlos Eduardo Mendoza",
            email: "vendedor@inmovax.com",
            phone: "+591 71234567",
            role: "Vendedor",
            status: "Activo",
            propertiesCount: 4,
            createdAt: "2026-09-15"
          },
          {
            id: "usr-client-03",
            fullName: "Mariana Alarcón",
            email: "mariana.alarcon@gmail.com",
            phone: "+591 79876543",
            role: "Cliente",
            status: "Activo",
            propertiesCount: 1,
            createdAt: "2026-09-22"
          }
        ]);
      }
    } catch {
      // Fallback
      setUsers([
        {
          id: "usr-admin-01",
          fullName: "Daniel Catari",
          email: "admin@inmovax.com",
          phone: "+591 76543210",
          role: "Administrador",
          status: "Activo",
          propertiesCount: 8,
          createdAt: "2026-09-01"
        },
        {
          id: "usr-demo-02",
          fullName: "Carlos Eduardo Mendoza",
          email: "vendedor@inmovax.com",
          phone: "+591 71234567",
          role: "Vendedor",
          status: "Activo",
          propertiesCount: 4,
          createdAt: "2026-09-15"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === 'Activo' ? 'Suspendido' : 'Activo';
    if (!confirm(`¿Deseas cambiar el estado de ${user.fullName} a ${nextStatus}?`)) return;

    setActionLoading(user.id);
    // Optimista
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));

    try {
      await fetch(`http://localhost:4000/api/auth/users/${user.id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {}
    setActionLoading(null);
  };

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'todos' || u.role.toLowerCase() === filterRole.toLowerCase();
    const matchStatus = filterStatus === 'todos' || u.status.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.phone.includes(searchQuery);
    return matchRole && matchStatus && matchSearch;
  });

  const totalUsers = users.length;
  const activeSellers = users.filter(u => u.role === 'Vendedor').length;
  const activeClients = users.filter(u => u.role === 'Cliente').length;
  const suspendedUsers = users.filter(u => u.status === 'Suspendido').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* KPIS DE USUARIOS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Usuarios</span>
            <div className="p-2 rounded-xl bg-blue-100/60 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-surface-dark">{totalUsers}</span>
            <span className="text-[10px] text-gray-400 font-semibold">en plataforma</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Vendedores</span>
            <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{activeSellers}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">publicando</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Clientes</span>
            <div className="p-2 rounded-xl bg-blue-50 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-surface-dark">{activeClients}</span>
            <span className="text-[10px] text-gray-400 font-semibold">compradores</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Suspendidos</span>
            <div className="p-2 rounded-xl bg-rose-100/60 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-800">{suspendedUsers}</span>
            <span className="text-[10px] text-rose-600 font-semibold">bloqueados</span>
          </div>
        </div>

      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o celular..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-400"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer"
          >
            <option value="todos">Todos los Roles</option>
            <option value="Vendedor">Vendedores</option>
            <option value="Cliente">Clientes</option>
            <option value="Administrador">Administradores</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer"
          >
            <option value="todos">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Suspendido">Suspendidos</option>
          </select>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-gray-200/80 text-gray-500 font-black uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4">Usuario</th>
                <th className="py-4 px-4">Contacto</th>
                <th className="py-4 px-4">Rol en Web</th>
                <th className="py-4 px-4 text-center">Inmuebles</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Celda Nombre */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-white text-xs shrink-0 shadow-2xs">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-surface-dark text-xs">{user.fullName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">ID: {user.id.slice(0, 12)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Celda Contacto */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <div className="text-gray-800 font-bold flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="text-gray-500 text-[11px] flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Celda Rol */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black border ${
                      user.role === 'Administrador'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : user.role === 'Vendedor'
                        ? 'bg-blue-50 text-primary border-blue-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Celda Inmuebles */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" />
                      <span>{user.propertiesCount}</span>
                    </span>
                  </td>

                  {/* Celda Estado */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${
                      user.status === 'Activo'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {user.status}
                    </span>
                  </td>

                  {/* Celda Acciones */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* WhatsApp directo si tiene teléfono */}
                      {user.phone && user.phone !== 'Sin registrar' && (
                        <a
                          href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                          title="Contactar por WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Botón Bloquear / Desbloquear */}
                      {user.role !== 'Administrador' && (
                        <button
                          type="button"
                          disabled={actionLoading === user.id}
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            user.status === 'Activo'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                          title={user.status === 'Activo' ? 'Suspender acceso' : 'Reactivar usuario'}
                        >
                          {user.status === 'Activo' ? (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>Suspender</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reactivar</span>
                            </>
                          )}
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-content-muted">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="font-bold text-xs text-surface-dark">No se encontraron usuarios</p>
          </div>
        )}
      </div>

    </div>
  );
};
