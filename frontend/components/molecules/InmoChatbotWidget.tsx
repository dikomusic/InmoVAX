"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, X, Send, Bot, Sparkles, RotateCcw, 
  Building2, MapPin, ExternalLink, ChevronDown, PhoneCall,
  Heart, Home, HelpCircle, Check, Copy, Flame, ShieldCheck
} from 'lucide-react';
import { readStoredSession } from '@/lib/frontendStore';

export interface PropertyCardItem {
  id: string;
  title: string;
  zone: string;
  price: string;
  bedrooms?: number;
  areaSqm?: number;
  imageUrl?: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedProperties?: PropertyCardItem[];
  timestamp: string;
}

const STORAGE_KEY = 'inmovax_chatbot_history_v1';

const QUICK_CATEGORIES = [
  { label: "🏢 Sopocachi", query: "Busco departamentos en Sopocachi en venta o anticrético" },
  { label: "🏡 Calacoto / Sur", query: "Busco casas o departamentos en zona Sur Calacoto o Achumani" },
  { label: "📑 Anticréticos", query: "¿Cómo funciona un contrato de anticrético en Bolivia y qué garantías tiene?" },
  { label: "🛡️ Folio Real", query: "¿Cómo me aseguro que un inmueble no tenga gravámenes o hipotecas?" },
  { label: "📢 Publicar Inmueble", query: "¿Qué planes tienen para publicar un inmueble con QR?" }
];

export const InmoChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [botName, setBotName] = useState('InmoBot');
  const [activeModel, setActiveModel] = useState('Gemini 3 Flash');
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar historial y configuración al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = process.env.NEXT_PUBLIC_BOT_NAME || 'InmoBot';
      setBotName(name);

      try {
        const saved = window.sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {}

      // Mensaje de bienvenida inicial cálido y amigable
      const session = readStoredSession();
      const userName = session?.name ? ` ${session.name}` : '';
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `¡Hola${userName}! 👋 Soy **${name}**, tu asesor inmobiliario inteligente en InmoVAX.\n\nEstoy aquí para hacerte la vida más fácil: puedo **encontrar tu hogar soñado**, explicarte cómo funciona un **anticrético legal** en Bolivia o ayudarte a **publicar tu inmueble** en minutos.\n\n¿Qué te gustaría ver hoy?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Guardar en sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Scroll automático hacia abajo al recibir mensajes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: timeNow
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const session = readStoredSession();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          session: session ? { name: session.name, email: session.email, role: session.role } : null
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.model) {
          const prettyModel = data.model
            .replace('gemini-', 'Gemini ')
            .replace('-preview', '')
            .replace('-latest', ' (Latest)')
            .replace('fallback-inmovax', 'InmoVAX Engine');
          setActiveModel(prettyModel);
        }
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message || '¡Con gusto! ¿Tienes alguna otra duda o consulta?',
          suggestedProperties: data.suggestedProperties || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Error en el servidor');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Disculpa, hubo una pequeña pausa en la conexión. ¿Podrías reiterar tu consulta? Si prefieres, también puedes hablar directamente con nuestro equipo de atención humana por WhatsApp.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    const session = readStoredSession();
    const userName = session?.name ? ` ${session.name}` : '';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `¡Listo${userName}! Empezamos de nuevo con la pizarra limpia. ✨ ¿Qué propiedad o duda tienes en mente?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Formato amigable de negritas y saltos de línea
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className={`${line.trim() === '' ? 'h-2' : 'min-h-[1.25rem]'} leading-relaxed`}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* BOTÓN FLOTANTE AMIGABLE */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="relative flex flex-col items-end">
            
            {/* Globo de bienvenida tipo cómic */}
            {showTooltip && (
              <div className="relative mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div 
                  onClick={() => setIsOpen(true)}
                  className="group flex items-center gap-2.5 px-4 py-2.5 bg-white text-gray-800 text-xs font-semibold rounded-2xl shadow-xl border border-blue-100 hover:border-primary/50 cursor-pointer transition-all hover:scale-102"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900 flex items-center gap-1">
                      ¿Buscas casa o anticrético?
                      <span className="text-amber-500">✨</span>
                    </p>
                    <p className="text-[10px] text-gray-500 font-normal">Chatea conmigo en vivo con IA</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(false);
                    }}
                    className="text-gray-300 hover:text-gray-500 p-1 rounded-full ml-1"
                    title="Cerrar sugerencia"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {/* Flecha del globo */}
                <div className="absolute right-7 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-blue-100 rotate-45"></div>
              </div>
            )}

            {/* Botón principal circular con mascota */}
            <button
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              aria-label="Abrir asistente inmobiliario InmoBot"
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-primary to-indigo-500 text-white shadow-xl hover:shadow-2xl hover:shadow-primary/40 hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center relative cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></span>
            </button>
          </div>
        )}

        {/* VENTANA DEL CHATBOT - DISEÑO MODERNO Y CÁLIDO */}
        {isOpen && (
          <div className="w-[94vw] sm:w-[420px] h-[610px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* CABECERA CÁLIDA Y PROFESIONAL */}
            <div className="bg-gradient-to-r from-blue-600 via-primary to-indigo-600 p-4 text-white flex items-center justify-between relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-primary rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base tracking-tight">{botName}</h3>
                    <span className="text-[10px] bg-white/20 backdrop-blur-md text-blue-100 px-2 py-0.5 rounded-full font-bold border border-white/20">
                      {activeModel}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100/90 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    Tu asesor personal en InmoVAX
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleReset}
                  title="Reiniciar conversación"
                  className="p-2 text-blue-100 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar chat"
                  className="p-2 text-blue-100 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ÁREA DE MENSAJES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 via-white to-gray-50/50">
              
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar del bot en cada respuesta */}
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-500 to-primary text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs relative group ${
                      m.role === 'user'
                        ? 'bg-gradient-to-tr from-primary to-blue-600 text-white rounded-br-xs shadow-blue-500/10'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs shadow-gray-200/50'
                    }`}
                  >
                    {renderFormattedText(m.content)}

                    {/* TARJETAS INTERACTIVAS DE INMUEBLES */}
                    {m.suggestedProperties && m.suggestedProperties.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                          <span className="flex items-center gap-1 text-primary">
                            <Home className="w-3.5 h-3.5" />
                            Propiedades sugeridas:
                          </span>
                          <span className="text-[10px] text-gray-400">Verificadas</span>
                        </div>

                        <div className="space-y-2">
                          {m.suggestedProperties.map((prop) => (
                            <Link
                              key={prop.id}
                              href={prop.href}
                              className="flex items-center gap-3 p-2.5 bg-gray-50/80 hover:bg-blue-50/80 rounded-2xl border border-gray-200/70 hover:border-primary/40 transition-all duration-200 group/card block shadow-2xs"
                            >
                              <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden shrink-0 relative shadow-2xs">
                                {prop.imageUrl ? (
                                  <img 
                                    src={prop.imageUrl} 
                                    alt={prop.title} 
                                    className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-300" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Building2 className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[12px] text-gray-900 truncate group-hover/card:text-primary transition-colors">
                                  {prop.title}
                                </h4>
                                <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                  {prop.zone}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[12px] font-extrabold text-primary">
                                    {prop.price}
                                  </span>
                                  {prop.bedrooms ? (
                                    <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200/60 font-medium">
                                      🛏️ {prop.bedrooms} dorm.
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="w-7 h-7 rounded-xl bg-white group-hover/card:bg-primary group-hover/card:text-white text-gray-400 flex items-center justify-center shrink-0 border border-gray-200/60 group-hover/card:border-primary transition-all ml-1">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp y botón de copiar */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[9px]">
                      <span className={m.role === 'user' ? 'text-blue-100' : 'text-gray-400'}>
                        {m.timestamp}
                      </span>
                      {m.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(m.content, m.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 flex items-center gap-1 cursor-pointer"
                          title="Copiar respuesta"
                        >
                          {copiedId === m.id ? (
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Copiado
                            </span>
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* INDICADOR AMIGABLE DE PENSANDO */}
              {isLoading && (
                <div className="flex items-center gap-2.5 text-xs text-gray-500 animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-500 to-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4 animate-spin [animation-duration:3s]" />
                  </div>
                  <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="font-medium text-gray-600">InmoBot está buscando las mejores opciones...</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* BOTONES DE SUGERENCIA RÁPIDA (CARROUSEL HORIZONTAL) */}
            <div className="px-3.5 py-2.5 bg-white border-t border-gray-100 overflow-x-auto flex gap-2 scrollbar-none">
              {QUICK_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(cat.query)}
                  disabled={isLoading}
                  className="shrink-0 text-[11px] bg-blue-50/70 hover:bg-blue-100/80 hover:text-primary text-gray-700 px-3 py-1.5 rounded-xl transition-all duration-150 font-semibold border border-blue-100 hover:border-blue-300 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* CAJA DE TEXTO Y ACCIONES INFERIORES */}
            <div className="p-3 bg-white border-t border-gray-100 shadow-inner">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe aquí tu duda o qué inmueble buscas..."
                    disabled={isLoading}
                    className="w-full pl-4 pr-3 py-3 bg-gray-50/80 border border-gray-200/80 rounded-2xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Enviar mensaje"
                  className="w-11 h-11 bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-2xl shadow-md shadow-primary/20 transition-all disabled:opacity-40 disabled:hover:bg-primary cursor-pointer shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* PIE DE PÁGINA AMIGABLE */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] px-1 text-gray-400">
                <span className="flex items-center gap-1 font-medium text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Asesoría Verificada
                </span>
                <a
                  href="https://wa.me/59170011223?text=Hola,%20quisiera%20conversar%20con%20un%20asesor%20humano%20de%20InmoVAX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/70 px-2.5 py-1 rounded-lg transition-colors border border-emerald-200/50"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  Asesor Humano WhatsApp
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};
