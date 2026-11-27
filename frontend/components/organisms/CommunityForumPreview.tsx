import React from 'react';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const FEATURED_DISCUSSIONS = [
  {
    id: 'post-1',
    category: 'Anticréticos',
    title: '¿Qué hacer si el propietario no devuelve el dinero al terminar el contrato de anticrético?',
    excerpt: 'Pasos legales para exigir la restitución del capital y cómo te protege la hipoteca legal inscrita en Derechos Reales.',
    replies: 2,
    upvotes: 24,
    date: 'Hace 2 horas'
  },
  {
    id: 'post-2',
    category: 'Folio Real',
    title: 'Cómo solicitar la Información Rápida en Derechos Reales antes de dar una seña',
    excerpt: 'Recomendaciones prácticas para constatar la inexistencia de gravámenes, embargos o hipotecas sobre el inmueble.',
    replies: 1,
    upvotes: 18,
    date: 'Ayer'
  },
  {
    id: 'post-3',
    category: 'Compra / Venta Directa',
    title: 'Experiencia vendiendo directo con cartel QR vs agencia inmobiliaria tradicional',
    excerpt: 'Testimonio de un propietario en Sopocachi que cerró la venta de su departamento sin pagar el 4% de comisión.',
    replies: 1,
    upvotes: 42,
    date: 'Hace 3 días'
  }
];

export const CommunityForumPreview: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50/70 border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-primary text-xs font-black uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Foro Abierto de la Comunidad</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Últimas Consultas y Debates Inmobiliarios
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Resuelve dudas con propietarios, inquilinos y abogados de Bolivia antes de firmar cualquier contrato.
            </p>
          </div>

          <Link href="/foro">
            <Button variant="primary" className="self-start sm:self-auto flex items-center gap-2 text-xs sm:text-sm">
              <span>Ver todo el Foro</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* TARJETAS DE DEBATES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_DISCUSSIONS.map((item) => (
            <Link
              key={item.id}
              href="/foro"
              className="bg-white rounded-3xl p-6 border border-gray-200/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group block"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-extrabold uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {item.category}
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                  {item.upvotes} votos
                </span>

                <span className="text-primary font-bold flex items-center gap-1">
                  <span>{item.replies} respuestas</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
