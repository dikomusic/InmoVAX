"use client";
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Clock, CheckCircle2, Search, Mail, 
  Phone, ArrowUpRight, Building2, Check, ExternalLink 
} from 'lucide-react';

export interface ConsultationItem {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  propertyPrice?: string;
  sellerEmail?: string;
  sellerName?: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  status: 'pendiente' | 'respondido';
  lastMessage: string;
  date: string;
}

export const AdminMessagesSection: React.FC = () => {
  const [messages, setMessages] = useState<ConsultationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [loading, setLoading] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/consultations');
      const data = await res.json();
      if (data.consultations && data.consultations.length > 0) {
        setMessages(data.consultations);
      } else {
        // Fallback demostrativo
        setMessages([
          {
            id: "msg-101",
            propertyTitle: "Departamento en Sopocachi (Terraza)",
            propertyPrice: "$us 45,000",
            buyerName: "Rodrigo Morales",
            buyerEmail: "rodrigo.morales@gmail.com",
            buyerPhone: "+591 76543210",
            status: "pendiente",
            lastMessage: "Buenas tardes, quisiera saber si aceptan pago con crédito bancario pre-aprobado.",
            date: "Hoy, 15:30"
          },
          {
            id: "msg-102",
            propertyTitle: "Casa Familiar en Achumani",
            propertyPrice: "$us 320,000",
            buyerName: "Patricia Claure",
            buyerEmail: "patricia.claure@hotmail.com",
            buyerPhone: "+591 71234567",
            status: "respondido",
            lastMessage: "¿Tienen disponible el plano de construcción y gravámenes al día?",
            date: "Ayer, 18:20"
          }
        ]);
      }
    } catch {
      setMessages([
        {
          id: "msg-101",
          propertyTitle: "Departamento en Sopocachi (Terraza)",
          propertyPrice: "$us 45,000",
          buyerName: "Rodrigo Morales",
          buyerEmail: "rodrigo.morales@gmail.com",
          buyerPhone: "+591 76543210",
          status: "pendiente",
          lastMessage: "Buenas tardes, quisiera saber si aceptan pago con crédito bancario pre-aprobado.",
          date: "Hoy, 15:30"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleStatus = (id: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'pendiente' ? 'respondido' : 'pendiente' };
      }
      return m;
    }));
  };

  const filtered = messages.filter(m => {
    const matchStatus = filterStatus === 'todos' || m.status === filterStatus;
    const matchSearch = m.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalCount = messages.length;
  const pendingCount = messages.filter(m => m.status === 'pendiente').length;
  const answeredCount = messages.filter(m => m.status === 'respondido').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* KPIS DE MENSAJES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Consultas</span>
            <div className="p-2 rounded-xl bg-blue-100/60 text-primary">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-surface-dark">{totalCount}</span>
            <span className="text-[10px] text-gray-400 font-semibold">recibidas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Por Atender</span>
            <div className="p-2 rounded-xl bg-amber-100/60 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
            <span className="text-[10px] text-amber-700 font-semibold">pendientes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Atendidas</span>
            <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{answeredCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">completadas</span>
          </div>
        </div>

      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente, correo o contenido..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-400"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Solo Pendientes</option>
            <option value="respondido">Solo Atendidos</option>
          </select>
        </div>
      </div>

      {/* LISTA DE MENSAJES */}
      <div className="space-y-3">
        {filtered.map((msg) => (
          <div 
            key={msg.id} 
            className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-xs text-surface-dark">{msg.buyerName}</span>
                <span className="text-[11px] text-gray-400 font-mono">• {msg.buyerEmail}</span>
                {msg.buyerPhone && (
                  <span className="text-[11px] text-gray-500 font-mono">• {msg.buyerPhone}</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  msg.status === 'pendiente' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {msg.status === 'pendiente' ? 'Pendiente' : 'Atendido'}
                </span>
                <span className="text-[10px] text-gray-400 ml-auto">{msg.date}</span>
              </div>

              {msg.propertyTitle && (
                <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-lg">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Inmueble: {msg.propertyTitle}</span>
                  {msg.propertyPrice && <span className="text-gray-600 font-medium">({msg.propertyPrice})</span>}
                </div>
              )}

              <p className="text-xs text-gray-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{msg.lastMessage}"
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
              
              {/* Botón WhatsApp directo */}
              {msg.buyerPhone && (
                <a
                  href={`https://wa.me/${msg.buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${msg.buyerName}, te contacto desde InmoVAX respecto a tu consulta sobre ${msg.propertyTitle || 'un inmueble'}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}

              {/* Botón Enviar Correo */}
              <a
                href={`mailto:${msg.buyerEmail}?subject=${encodeURIComponent(`Respuesta a tu consulta en InmoVAX`)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Correo</span>
              </a>

              {/* Toggle de estado */}
              <button
                type="button"
                onClick={() => handleToggleStatus(msg.id)}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  msg.status === 'pendiente' 
                    ? 'text-emerald-700 hover:bg-emerald-50' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>{msg.status === 'pendiente' ? 'Marcar Atendido' : 'Marcar Pendiente'}</span>
              </button>

            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-content-muted shadow-xs">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="font-bold text-xs text-surface-dark">No hay mensajes con el filtro actual</p>
          </div>
        )}
      </div>

    </div>
  );
};
