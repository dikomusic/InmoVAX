import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, MessageSquare, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const SERVICES = [
  {
    icon: Sparkles,
    badge: "Inteligencia Artificial",
    title: "Búsqueda Inteligente con IA",
    description: "Encuentra inmuebles en segundos escribiendo en lenguaje natural. Nuestra IA analiza zonas, tipo de contrato (anticrético, venta o alquiler), presupuesto y dormitorios para darte opciones exactas al instante.",
    linkText: "Probar búsqueda inteligente",
    href: "#buscador-principal"
  },
  {
    icon: ShieldCheck,
    badge: "Seguridad Jurídica",
    title: "Verificación de Folio Real y Notarial",
    description: "Auditamos la titularidad legítima y antecedentes en Derechos Reales para blindar tu anticrético o compraventa frente a estafas, gravámenes o hipotecas ocultas.",
    linkText: "Servicios notariales",
    href: "/asesores"
  },
  {
    icon: MessageSquare,
    badge: "Sin Comisiones del 3% al 7%",
    title: "Mensajería Directa Comprador - Propietario",
    description: "Plataforma P2P donde ambas partes negocian de forma transparente. Conserva el 100% del valor de tu patrimonio sin intermediarios abusivos.",
    linkText: "Explorar inmuebles",
    href: "/comprar/todos"
  },
  {
    icon: Users,
    badge: "Comunidad Activa",
    title: "Foro Inmobiliario y Legal de Bolivia",
    description: "Espacio abierto para consultar dudas reales sobre cláusulas de anticrético, devolución de capital, alquileres y experiencias con otros propietarios e inquilinos.",
    linkText: "Entrar al Foro",
    href: "/foro"
  }
];


export const PlatformServicesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ENCABEZADO */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-primary text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Plataforma Tecnológica de Servicios • No somos agencia tradicional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
            Todo lo que necesitas para operar tu inmueble de forma directa y segura.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            A diferencia de las inmobiliarias tradicionales que cobran comisiones excesivas por intermediar, InmoVAX te entrega las herramientas tecnológicas y el respaldo notarial para que cierres tu negocio directamente entre partes.
          </p>
        </div>

        {/* GRILLA DE SERVICIOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div 
                key={idx}
                className="bg-gray-50/70 hover:bg-white rounded-3xl p-6 border border-gray-200/70 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-primary group-hover:text-white text-primary border border-gray-200/80 group-hover:border-primary flex items-center justify-center transition-colors shadow-2xs">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block mb-1">
                      {srv.badge}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 leading-snug group-hover:text-primary transition-colors">
                      {srv.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200/60">
                  <Link 
                    href={srv.href}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:text-primary-hover transition-colors"
                  >
                    <span>{srv.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
