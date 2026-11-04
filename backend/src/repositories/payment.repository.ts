/**
 * Repositorio de Pagos y Planes de Publicación (Capa de Acceso a Datos - DAL)
 * InmoVAX Backend - Patrón Repositorio
 */

import { supabase } from '../config/supabase';
import { IPublicationPlan, PropertyPaymentOrder, IReviewPaymentDTO } from '../interfaces/payment.interface';

// Configuración predeterminada de planes
let publicationPlans: Record<string, IPublicationPlan> = {
  priorizacion: {
    id: 'priorizacion',
    name: 'Priorización de Anuncio',
    badgeColor: 'blue',
    durationLabel: 'Primeros lugares en búsquedas',
    durationDays: 30,
    price: 15,
    currency: 'USD',
    exposure: 'Alta',
    description: 'Coloca tu inmueble en la parte superior de las búsquedas para generar tráfico y llamadas inmediatas.',
    features: {
      canalesInmoVAX: true,
      soporte: 'Online',
      priorizacion: true,
      fotografo: false,
      abogado: false,
      selloVerificado: false,
    }
  },
  fotografo: {
    id: 'fotografo',
    name: 'Fotógrafo Profesional',
    badgeColor: 'purple',
    durationLabel: 'Sesión a domicilio',
    durationDays: null,
    price: 60,
    currency: 'USD',
    exposure: 'Alta',
    description: 'Sesión fotográfica HD a domicilio y edición profesional que multiplica por 3 las visitas de interesados.',
    features: {
      canalesInmoVAX: true,
      soporte: 'Coordinación telefónica',
      priorizacion: false,
      fotografo: true,
      abogado: false,
      selloVerificado: false,
    }
  },
  abogado: {
    id: 'abogado',
    name: 'Servicio de Abogado (DDRR)',
    badgeColor: 'emerald',
    durationLabel: 'Auditoría legal completa',
    durationDays: null,
    price: 75,
    currency: 'USD',
    exposure: 'Alta',
    description: 'Revisión minuciosa del Folio Real en Derechos Reales + Sello verde "Verificado Legalmente".',
    features: {
      canalesInmoVAX: true,
      soporte: 'Asesor Notarial dedicado',
      priorizacion: false,
      fotografo: false,
      abogado: true,
      selloVerificado: true,
    }
  },
  duo: {
    id: 'duo',
    name: 'Plan Dúo (Priorización + Fotos)',
    badgeColor: 'indigo',
    durationLabel: 'Priorización + Sesión HD',
    durationDays: 45,
    price: 85,
    currency: 'USD',
    exposure: 'Muy Alta',
    description: 'Combina máxima visibilidad en búsquedas y fotografías profesionales de alto impacto visual.',
    features: {
      canalesInmoVAX: true,
      soporte: 'Online y telefónico',
      priorizacion: true,
      fotografo: true,
      abogado: false,
      selloVerificado: false,
    }
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium (Todo Incluido)',
    badgeColor: 'amber',
    durationLabel: 'Priorización + Abogado + Fotos',
    durationDays: null,
    price: 120,
    currency: 'USD',
    exposure: 'Máxima',
    isPopular: true,
    description: 'El paquete definitivo: Priorización en búsquedas + Fotógrafo profesional HD + Sello verde de Verificación Legal.',
    features: {
      canalesInmoVAX: true,
      soporte: 'Asesor dedicado y telefónico',
      priorizacion: true,
      fotografo: true,
      abogado: true,
      selloVerificado: true,
    }
  },
  // Retrocompatibilidad
  basico: {
    id: 'basico',
    name: 'Básico',
    badgeColor: 'gray',
    durationLabel: '30 días',
    durationDays: 30,
    price: 15,
    currency: 'USD',
    exposure: 'Buena',
    features: {
      canalesInmoVAX: true,
      soporte: 'Online'
    }
  },
  oro: {
    id: 'oro',
    name: 'Oro',
    badgeColor: 'amber',
    durationLabel: '60 días',
    durationDays: 60,
    price: 45,
    currency: 'USD',
    exposure: 'Buena',
    features: {
      canalesInmoVAX: true,
      soporte: 'Online y telefónico'
    }
  },
  diamante: {
    id: 'diamante',
    name: 'Diamante',
    badgeColor: 'orange',
    durationLabel: '¡Hasta que se venda o alquile!',
    durationDays: null,
    price: 75,
    currency: 'USD',
    exposure: 'Máxima',
    features: {
      canalesInmoVAX: true,
      soporte: 'Asesor dedicado'
    }
  }
};

// Almacén seguro para órdenes de pago
const paymentOrdersMap = new Map<string, PropertyPaymentOrder>();

export class PaymentRepository {
  /**
   * Obtener todos los planes configurados
   */
  static getPlans(): Record<string, IPublicationPlan> {
    return { ...publicationPlans };
  }

  /**
   * Obtener un plan específico por ID
   */
  static getPlanById(planId: string): IPublicationPlan | undefined {
    return publicationPlans[planId];
  }

  /**
   * Actualizar configuración de un plan (solo Super Administrador)
   */
  static updatePlan(planId: string, updates: Partial<IPublicationPlan>): IPublicationPlan | null {
    if (!publicationPlans[planId]) return null;
    publicationPlans[planId] = {
      ...publicationPlans[planId],
      ...updates
    };
    return publicationPlans[planId];
  }

  /**
   * Crear una nueva orden de pago
   */
  static saveOrder(order: PropertyPaymentOrder): PropertyPaymentOrder {
    paymentOrdersMap.set(order.id, order);
    return order;
  }

  /**
   * Buscar orden por su identificador
   */
  static findOrderById(orderId: string): PropertyPaymentOrder | undefined {
    return paymentOrdersMap.get(orderId);
  }

  /**
   * Listar todas las órdenes de pago (para panel administrativo)
   */
  static findAllOrders(statusFilter?: string): PropertyPaymentOrder[] {
    const list = Array.from(paymentOrdersMap.values());
    if (statusFilter && statusFilter !== 'todos') {
      return list.filter(o => o.status === statusFilter);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Buscar órdenes asociadas a un vendedor por su correo
   */
  static findOrdersBySeller(sellerEmail: string): PropertyPaymentOrder[] {
    const cleanEmail = sellerEmail.toLowerCase().trim();
    return Array.from(paymentOrdersMap.values())
      .filter(o => o.sellerEmail.toLowerCase().trim() === cleanEmail)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Buscar orden asociada a una propiedad específica
   */
  static findOrderByPropertyId(propertyId: string): PropertyPaymentOrder | undefined {
    return Array.from(paymentOrdersMap.values()).find(o => o.propertyId === propertyId);
  }

  /**
   * Actualizar estado o comprobante de una orden
   */
  static updateOrder(orderId: string, updates: Partial<PropertyPaymentOrder>): PropertyPaymentOrder | null {
    const order = paymentOrdersMap.get(orderId);
    if (!order) return null;

    const updated = { ...order, ...updates };
    paymentOrdersMap.set(orderId, updated);
    return updated;
  }

  /**
   * Eliminar órdenes asociadas a una propiedad (p. ej. al borrar la propiedad)
   */
  static deleteOrdersByProperty(propertyId: string): void {
    for (const [id, order] of paymentOrdersMap.entries()) {
      if (order.propertyId === propertyId) {
        paymentOrdersMap.delete(id);
      }
    }
  }

  /**
   * Exportar referencia directa del mapa para sincronización retrocompatible
   */
  static getOrdersMap(): Map<string, PropertyPaymentOrder> {
    return paymentOrdersMap;
  }
}
