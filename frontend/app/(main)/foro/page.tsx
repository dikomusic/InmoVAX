"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Plus, Search, ThumbsUp, MessageCircle, 
  ShieldCheck, FileText, Building2, Home, HelpCircle, 
  CheckCircle2, UserRound, ArrowRight, X, Clock, Flame
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { readStoredSession } from '@/lib/frontendStore';

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole?: string;
  text: string;
  date: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: 'Anticréticos' | 'Folio Real' | 'Compra / Venta' | 'Alquileres' | 'Seguridad Legal';
  authorName: string;
  authorEmail?: string;
  date: string;
  upvotes: number;
  comments: ForumComment[];
  isResolved?: boolean;
}

const FORUM_STORAGE_KEY = 'inmovax_forum_posts_v1';

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: '¿Qué hacer si el propietario no devuelve el dinero al terminar el contrato de anticrético?',
    content: 'Tengo un anticrético de $us 35,000 en Sopocachi que vence en dos meses. El propietario me indica que no tiene liquidez hasta que entre otro anticresista. ¿Qué pasos legales debo seguir y cómo me respalda la inscripción en Derechos Reales?',
    category: 'Anticréticos',
    authorName: 'Rodrigo Morales',
    date: 'Hace 2 horas',
    upvotes: 24,
    isResolved: false,
    comments: [
      {
        id: 'c-1',
        authorName: 'Dra. Patricia Claure (Abogada)',
        authorRole: 'Especialista Notarial',
        text: 'Si tu contrato fue registrado en Derechos Reales sobre el Folio Real, tienes privilegio de cobro e hipoteca legal sobre el inmueble. Debes enviar una carta notariada de requerimiento 60 días antes del vencimiento exigiendo la devolución total.',
        date: 'Hace 1 hora'
      },
      {
        id: 'c-2',
        authorName: 'Gonzalo Benítez',
        authorRole: 'Propietario',
        text: 'Es crucial nunca aceptar llaves ni desalojar el inmueble hasta que la devolución se efectivice por cheque de gerencia o transferencia comprobada.',
        date: 'Hace 45 min'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Cómo solicitar la Información Rápida en Derechos Reales antes de dar una seña',
    content: 'Hola a todos, estoy por comprar una casa en Achumani. El vendedor me muestra un Folio Real en papel, pero quiero verificar si tiene gravámenes vigentes o hipotecas bancarias. ¿Cuánto tarda el trámite de información rápida en La Paz?',
    category: 'Folio Real',
    authorName: 'Valeria Sotomayor',
    date: 'Ayer',
    upvotes: 18,
    isResolved: true,
    comments: [
      {
        id: 'c-3',
        authorName: 'Equipo Legal InmoVAX',
        authorRole: 'Plataforma',
        text: 'El certificado de información rápida (con código QR y firma digital) se emite en 24 a 48 horas en Derechos Reales. No entregues ningún depósito de seña sin este documento actualizado a la fecha.',
        date: 'Ayer'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Experiencia vendiendo directo con cartel QR vs agencia inmobiliaria tradicional',
    content: 'Comparto mi experiencia: publiqué mi departamento en Sopocachi en InmoVAX e instalé el letrero con código QR en mi balcón. En dos semanas recibí 11 mensajes directos de personas que pasaban por la calle y lo vendí sin pagar el 4% que me pedían las inmobiliarias.',
    category: 'Compra / Venta',
    authorName: 'Arq. Marcelo Arispe',
    date: 'Hace 3 días',
    upvotes: 42,
    isResolved: true,
    comments: [
      {
        id: 'c-4',
        authorName: 'Carlos Vega',
        text: 'Excelente dato Marcelo. Es absurdo regalar miles de dólares en comisión solo por poner un anuncio.',
        date: 'Hace 2 días'
      }
    ]
  },
  {
    id: 'post-4',
    title: '¿Las mascotas pueden ser prohibidas en contratos de alquiler en edificios?',
    content: 'Queremos alquilar un departamento en Calacoto y el reglamento interno del edificio dice que no admiten perros pequeños. ¿Esto es legal bajo la normativa civil boliviana?',
    category: 'Alquileres',
    authorName: 'Sofía Camacho',
    date: 'Hace 4 días',
    upvotes: 15,
    isResolved: false,
    comments: [
      {
        id: 'c-5',
        authorName: 'Lic. Fernando Gutiérrez',
        text: 'Los reglamentos de copropiedad aprobados por asamblea de copropietarios e inscritos en Derechos Reales tienen fuerza de ley entre partes. Lo recomendable es pactarlo expresamente por escrito en el contrato de alquiler.',
        date: 'Hace 3 días'
      }
    ]
  }
];

const CATEGORIES = [
  'Todos',
  'Anticréticos',
  'Folio Real',
  'Compra / Venta',
  'Alquileres',
  'Seguridad Legal'
];

export default function ForoPage() {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeExpandedPostId, setActiveExpandedPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [postId: string]: string }>({});

  // Campos para nuevo tema
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('Anticréticos');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  // Cargar temas desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(FORUM_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch {}

      const session = readStoredSession();
      if (session?.name) {
        setNewAuthor(session.name);
      }
    }
  }, []);

  const savePosts = (updated: ForumPost[]) => {
    setPosts(updated);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      authorName: newAuthor.trim() || 'Usuario InmoVAX',
      date: 'Recién publicado',
      upvotes: 1,
      comments: []
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Limpiar formulario y cerrar modal
    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
  };

  const handleUpvote = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, upvotes: p.upvotes + 1 };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleAddReply = (postId: string) => {
    const text = (replyText[postId] || '').trim();
    if (!text) return;

    const session = readStoredSession();
    const authorName = session?.name || 'Miembro de la Comunidad';

    const newComment: ForumComment = {
      id: `comm-${Date.now()}`,
      authorName,
      text,
      date: 'Hace un momento'
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    savePosts(updated);
    setReplyText(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* CABECERA DEL FORO */}
        <div className="bg-gradient-to-r from-surface-dark via-gray-900 to-primary rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Comunidad Inmobiliaria y Legal de Bolivia</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Foro InmoVAX: Experiencias, Leyes y Consultas Directas
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              No somos una agencia inmobiliaria tradicional. Este es el espacio comunitario donde propietarios, inquilinos y compradores resuelven dudas sobre anticréticos, Folio Real, trámites notariales y precios en Bolivia sin intermediarios.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="accent"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Consulta en el Foro</span>
              </Button>

              <Link href="/asesores">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <span>Asesoría Notarial</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Categorías */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Campo de búsqueda */}
          <div className="relative min-w-[240px] md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el foro..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* LISTA DE DEBATES */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-extrabold text-base text-gray-800">No se encontraron temas</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No hay publicaciones que coincidan con los criterios seleccionados. ¡Sé el primero en iniciar esta conversación!
              </p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <span>Crear Consulta</span>
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isExpanded = activeExpandedPostId === post.id;
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-50 text-primary px-2.5 py-1 rounded-md border border-blue-100">
                          {post.category}
                        </span>
                        {post.isResolved && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Orientación Verificada
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.date}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer"
                          onClick={() => setActiveExpandedPostId(isExpanded ? null : post.id)}>
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Votos y botón de apoyo */}
                    <div className="flex sm:flex-col items-center gap-2 self-start shrink-0">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-primary border border-gray-200 transition-colors text-xs font-bold cursor-pointer"
                        title="Votar por este tema"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setActiveExpandedPostId(isExpanded ? null : post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors text-xs font-bold cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>

                  {/* Autor y botón para ver respuestas */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {post.authorName.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-700">{post.authorName}</span>
                    </div>

                    <button
                      onClick={() => setActiveExpandedPostId(isExpanded ? null : post.id)}
                      className="text-primary hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Ocultar respuestas' : `Ver respuestas (${post.comments.length})`}</span>
                    </button>
                  </div>

                  {/* SECCIÓN EXPANDIBLE DE COMENTARIOS Y RESPUESTAS */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in fade-in duration-150">
                      <div className="space-y-3">
                        {post.comments.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">Aún no hay respuestas en este debate. ¡Sé el primero en aportar!</p>
                        ) : (
                          post.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 border border-gray-100">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">{comment.authorName}</span>
                                  {comment.authorRole && (
                                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                                      {comment.authorRole}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400">{comment.date}</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{comment.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Formulario para añadir respuesta */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={replyText[post.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                          placeholder="Escribe tu respuesta u opinión..."
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-primary focus:bg-white"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddReply(post.id);
                            }
                          }}
                        />
                        <Button
                          variant="primary"
                          onClick={() => handleAddReply(post.id)}
                          className="shrink-0 text-xs py-2 px-4"
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* MODAL PARA CREAR NUEVO TEMA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-100 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-black text-lg text-gray-900">Iniciar Consulta en el Foro</h3>
                <p className="text-xs text-gray-500">Recibe orientación de propietarios, inquilinos y abogados de Bolivia</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título de la consulta</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: ¿Qué cláusulas no deben faltar en un anticrético en La Paz?"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ForumPost['category'])}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="Anticréticos">Anticréticos</option>
                    <option value="Folio Real">Folio Real</option>
                    <option value="Compra / Venta">Compra / Venta</option>
                    <option value="Alquileres">Alquileres</option>
                    <option value="Seguridad Legal">Seguridad Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tu nombre o alias</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detalle de la consulta o situación</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe la situación, zona o dudas que tengas para recibir orientación detallada..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Publicar en el Foro
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
