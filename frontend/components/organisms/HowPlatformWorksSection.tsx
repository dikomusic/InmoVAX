import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export const HowPlatformWorksSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-surface-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* ENCABEZADO */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-accent">
            Simple • Transparente • Sin intermediarios
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            ¿Cómo funciona InmoVAX?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
            Tres pasos para operar tu anticrético, venta o alquiler protegiendo tu patrimonio y ahorrando miles de dólares en comisiones inmobiliarias.
          </p>
        </div>

        {/* 3 PASOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PASO 1 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-4 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-black text-lg border border-accent/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Busca con IA o Publica en Minutos</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Utiliza nuestra búsqueda inteligente con IA en lenguaje natural para dar con el inmueble exacto, o publica tu propiedad directamente sin trámites burocráticos.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-accent">
              <Sparkles className="w-4 h-4" />
              <span>Búsqueda Inteligente</span>
            </div>
          </div>


          {/* PASO 2 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-4 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black text-lg border border-blue-400/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Chatea directo con interesados</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Recibe consultas directas a tu WhatsApp o por la mensajería interna de InmoVAX. Negocias de persona a persona sin agentes que inflen el precio.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-blue-300">
              <MessageCircle className="w-4 h-4" />
              <span>Negociación P2P libre</span>
            </div>
          </div>

          {/* PASO 3 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-4 hover:border-emerald-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-400/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Cierra con respaldo legal y 0% comisión</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Nuestro equipo notarial audita el Folio Real en Derechos Reales y redacta tu contrato para que tu anticrético o venta quede 100% blindado legalmente.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Verificación en Derechos Reales</span>
            </div>
          </div>

        </div>

        {/* CTA INFERIOR */}
        <div className="text-center pt-4">
          <Link href="/publicar">
            <Button variant="accent" className="px-8 py-3.5 text-sm font-extrabold shadow-xl">
              <span>Publicar mi Inmueble sin Comisiones</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
