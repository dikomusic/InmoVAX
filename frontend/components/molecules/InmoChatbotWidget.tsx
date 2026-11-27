"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, X, Send, Bot, Sparkles, RotateCcw, 
  Building2, MapPin, ExternalLink, ChevronDown, PhoneCall 
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

const INITIAL_PROMPTS = [
  "🏠 Buscar departamentos en Sopocachi",
  "📑 ¿Cómo funciona el anticrético en Bolivia?",
  "🛡️ ¿Cómo verifican el Folio Real?",
  "📢 ¿Cómo publico mi inmueble con QR?"
];

export const InmoChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [botName, setBotName] = useState('InmoBot');
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

      // Mensaje de bienvenida inicial
      const session = readStoredSession();
      const greeting = session?.name ? `¡Hola ${session.name}!` : '¡Hola!';
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `${greeting} Soy **${name}**, tu asesor inmobiliario inteligente en InmoVAX.\n\nPuedo ayudarte a buscar inmuebles en anticrético, venta o alquiler en La Paz y toda Bolivia, explicarte requisitos legales o guiarte para publicar tu propiedad. ¿En qué te puedo colaborar hoy?`,
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
      // Intentar primero con la ruta Next.js interna /api/chat
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
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message || 'Estoy a tu servicio. ¿Tienes alguna otra consulta?',
          suggestedProperties: data.suggestedProperties || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('Error en el servidor');
      }
    } catch {
      // Fallback amigable si la red fallara
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Disculpa, en este momento estoy actualizando la información de nuestros inmuebles. Puedes explorar todas nuestras opciones en la barra superior o escribirnos directamente a nuestro WhatsApp oficial de atención.`,
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
    const greeting = session?.name ? `¡Hola ${session.name}!` : '¡Hola!';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `${greeting} Conversación reiniciada. ¿Qué propiedad o información de InmoVAX te gustaría consultar ahora?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Renderizado formateado de texto con soporte para negrita y saltos
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Reemplazo básico de **negrita**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className={`${line.trim() === '' ? 'h-2' : 'min-h-[1.2rem]'} leading-relaxed`}>
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
      {/* BOTÓN FLOTANTE */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="relative group">
            {/* Tooltip flotante animado */}
            <div 
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2 mb-3 px-4 py-2 bg-white text-surface-dark text-xs font-semibold rounded-2xl shadow-xl border border-gray-100 cursor-pointer hover:border-primary transition-all animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>¿Buscas inmueble? Pregúntale a {botName}</span>
            </div>

            <button
              onClick={() => {
                setIsOpen(true);
                setHasUnread(false);
              }}
              aria-label="Abrir Asistente Virtual InmoBot"
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative cursor-pointer"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </button>
          </div>
        )}

        {/* VENTANA DEL CHATBOT */}
        {isOpen && (
          <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
            
            {/* CABECERA */}
            <div className="bg-gradient-to-r from-surface-dark via-gray-900 to-primary p-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Bot className="w-5 h-5 text-blue-300" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-surface-dark rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-tight">{botName}</h3>
                    <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded-md font-medium border border-blue-400/20">
                      IA Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    En línea • Asistente InmoVAX
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reiniciar conversación"
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar chat"
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CUERPO DE MENSAJES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-xs ${
                      m.role === 'user'
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-xs'
                    }`}
                  >
                    {renderFormattedText(m.content)}

                    {/* TARJETAS DE INMUEBLES SUGERIDOS */}
                    {m.suggestedProperties && m.suggestedProperties.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Inmuebles sugeridos:
                        </span>
                        <div className="space-y-2">
                          {m.suggestedProperties.map((prop) => (
                            <Link
                              key={prop.id}
                              href={prop.href}
                              className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-blue-50/60 rounded-xl border border-gray-200/60 hover:border-blue-200 transition-all group block"
                            >
                              <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                                {prop.imageUrl ? (
                                  <img 
                                    src={prop.imageUrl} 
                                    alt={prop.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Building2 className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[11px] text-gray-900 truncate group-hover:text-primary">
                                  {prop.title}
                                </h4>
                                <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  {prop.zone}
                                </p>
                                <span className="text-[11px] font-extrabold text-primary block mt-0.5">
                                  {prop.price}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary shrink-0 mr-1" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className={`text-[9px] block text-right mt-1.5 ${m.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* INDICADOR DE ESCRIBIENDO */}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* PREGUNTAS RÁPIDAS (SIEMPRE DISPONIBLES) */}
            {messages.length <= 3 && (
              <div className="px-3 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 scrollbar-none">
                {INITIAL_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="shrink-0 text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-primary text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium border border-gray-200/50 cursor-pointer disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* INPUT DE ENVÍO */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre inmuebles, anticrético..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Enviar mensaje"
                  className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:hover:bg-primary cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* ENLACE RÁPIDO A WHATSAPP */}
              <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-gray-400 px-1">
                <span>InmoVAX IA Asistente</span>
                <a
                  href="https://wa.me/59170011223?text=Hola,%20deseo%20asesoría%20sobre%20un%20inmueble%20en%20InmoVAX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                >
                  <PhoneCall className="w-2.5 h-2.5" />
                  Hablar con asesor humano
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};
