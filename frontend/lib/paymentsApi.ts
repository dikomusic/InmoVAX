/**
 * Cliente de API para Planes de Publicación y Pagos QR en InmoVAX
 * Conecta con el Backend Bun (http://localhost:4000/api/payments)
 */

import { API_BASE } from './apiConfig';

export type PlanType = 'priorizacion' | 'fotografo' | 'abogado' | 'duo' | 'premium' | 'basico' | 'oro' | 'diamante';

export interface PublicationPlanItem {
  id: PlanType;
  name: string;
  badgeColor: string;
  durationLabel: string;
  durationDays: number | null;
  price: number;
  currency: 'USD' | 'BOB';
  exposure: string;
  isPopular?: boolean;
  description?: string;
  features: {
    canalesInmoVAX: boolean;
    soporte: string;
    priorizacion?: boolean;
    fotografo?: boolean;
    abogado?: boolean;
    selloVerificado?: boolean;
  };
}

export interface PaymentOrderResponse {
  success: boolean;
  order?: {
    id: string;
    propertyId: string;
    propertyTitle?: string;
    sellerEmail: string;
    sellerName?: string;
    sellerPhone?: string;
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    qrCodeData: string;
    receiptUrl?: string | null;
    folioDocumentUrl?: string | null;
    status: 'pendiente' | 'aprobado' | 'rechazado' | 'exento_vip';
    createdAt: string;
  };
  isExemptVip?: boolean;
  message?: string;
  error?: string;
}

export interface AdminPendingOrder {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  sellerEmail: string;
  sellerName?: string;
  sellerPhone?: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  qrCodeData: string;
  receiptUrl?: string | null;
  folioDocumentUrl?: string | null;
  lawyerStatus?: 'pendiente' | 'aprobado' | 'rechazado';
  photographerStatus?: 'no_aplica' | 'pendiente' | 'completado';
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'exento_vip';
  rejectionReason?: string | null;
  createdAt: string;
}

export const PAYMENTS_STORAGE_KEY = 'inmovax-payment-orders-v3';

const INITIAL_MOCK_ORDERS: AdminPendingOrder[] = [
  {
    id: 'ORD-7819',
    propertyId: 'LPZ-101',
    propertyTitle: 'Residencia de Lujo con Jardín Privado en Calacoto',
    sellerEmail: 'vendedor@inmovax.com',
    sellerName: 'Arq. Gonzalo Benítez Soliz',
    sellerPhone: '+591 76543210',
    planId: 'premium',
    planName: 'Plan Premium (Todo Incluido)',
    amount: 120,
    currency: 'USD',
    qrCodeData: 'inmovax-qr-ORD-7819',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    folioDocumentUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
    lawyerStatus: 'pendiente',
    photographerStatus: 'pendiente',
    status: 'pendiente',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'ORD-6542',
    propertyId: 'LPZ-102',
    propertyTitle: 'Departamento Soleado en Calacoto sobre Av. Ballivián',
    sellerEmail: 'valeria.quiroga@inmovax.com',
    sellerName: 'Lic. Valeria Quiroga Flores',
    sellerPhone: '+591 77218945',
    planId: 'abogado',
    planName: 'Servicio de Abogado (DDRR)',
    amount: 75,
    currency: 'USD',
    qrCodeData: 'inmovax-qr-ORD-6542',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    folioDocumentUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
    lawyerStatus: 'pendiente',
    photographerStatus: 'no_aplica',
    status: 'pendiente',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'ORD-5120',
    propertyId: 'LPZ-103',
    propertyTitle: 'Casa Familiar con Patio Soleado en Calacoto Calle 24',
    sellerEmail: 'carlos.siles@inmovax.com',
    sellerName: 'Ing. Carlos Eduardo Siles',
    sellerPhone: '+591 70654321',
    planId: 'priorizacion',
    planName: 'Priorización de Anuncio',
    amount: 15,
    currency: 'USD',
    qrCodeData: 'inmovax-qr-ORD-5120',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    lawyerStatus: 'aprobado',
    photographerStatus: 'no_aplica',
    status: 'aprobado',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

export function getStoredPaymentOrders(): AdminPendingOrder[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_ORDERS;
  const raw = window.localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
    return INITIAL_MOCK_ORDERS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_ORDERS;
  } catch {
    return INITIAL_MOCK_ORDERS;
  }
}

export function saveStoredPaymentOrders(orders: AdminPendingOrder[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('payment-orders-updated'));
}

export async function fetchPublicationPlans(): Promise<Record<string, PublicationPlanItem>> {
  try {
    const res = await fetch(`${API_BASE}/payments/plans`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.plans || {};
  } catch (err) {
    console.warn('[paymentsApi] Fallback a planes por defecto:', err);
    return {
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
        features: { canalesInmoVAX: true, soporte: 'Online', priorizacion: true }
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
        description: 'Sesión fotográfica HD a domicilio y edición profesional que multiplica por 3 las visitas.',
        features: { canalesInmoVAX: true, soporte: 'Coordinación telefónica', fotografo: true }
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
        features: { canalesInmoVAX: true, soporte: 'Asesor Notarial dedicado', abogado: true, selloVerificado: true }
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
        description: 'Combina máxima visibilidad en búsquedas y fotografías profesionales de alto impacto.',
        features: { canalesInmoVAX: true, soporte: 'Online y telefónico', priorizacion: true, fotografo: true }
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
        features: { canalesInmoVAX: true, soporte: 'Asesor dedicado y telefónico', priorizacion: true, fotografo: true, abogado: true, selloVerificado: true }
      }
    };
  }
}

function getAdminAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('inmovax-token') : null;
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (adminKey) {
    headers['x-admin-key'] = adminKey;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function updatePublicationPlanPrice(
  planId: string,
  price: number,
  currency: 'USD' | 'BOB' = 'USD'
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/plans/${planId}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ price, currency })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function createPaymentOrder(payload: {
  propertyId: string;
  propertyTitle?: string;
  sellerEmail: string;
  sellerName?: string;
  sellerPhone?: string;
  planId: PlanType;
}): Promise<PaymentOrderResponse> {
  const plans = await fetchPublicationPlans();
  const selectedPlan = plans[payload.planId] || {
    id: payload.planId,
    name: payload.planId === 'premium' ? 'Plan Premium (Todo Incluido)' : payload.planId.toUpperCase(),
    price: payload.planId === 'abogado' ? 75 : (payload.planId === 'priorizacion' ? 15 : 60),
    currency: 'USD'
  };

  const newOrder: AdminPendingOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    propertyId: payload.propertyId,
    propertyTitle: payload.propertyTitle || 'Inmueble en Publicación',
    sellerEmail: payload.sellerEmail,
    sellerName: payload.sellerName || payload.sellerEmail.split('@')[0],
    sellerPhone: payload.sellerPhone || '+591 76543210',
    planId: payload.planId,
    planName: selectedPlan.name,
    amount: selectedPlan.price,
    currency: selectedPlan.currency || 'USD',
    qrCodeData: `inmovax-payment-${Date.now()}`,
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  };

  const currentList = getStoredPaymentOrders();
  saveStoredPaymentOrders([newOrder, ...currentList]);

  try {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.order) {
        return data;
      }
    }
  } catch {}

  return {
    success: true,
    order: newOrder
  };
}

export async function uploadPaymentReceipt(payload: {
  orderId: string;
  receiptUrl: string;
  folioDocumentUrl?: string;
  sellerPhone?: string;
} | string, receiptUrlArg?: string): Promise<boolean> {
  const orderId = typeof payload === 'string' ? payload : payload.orderId;
  const receiptUrl = typeof payload === 'string' ? (receiptUrlArg || '') : payload.receiptUrl;
  const folioDocumentUrl = typeof payload === 'object' ? payload.folioDocumentUrl : undefined;
  const sellerPhone = typeof payload === 'object' ? payload.sellerPhone : undefined;

  const currentList = getStoredPaymentOrders();
  const idx = currentList.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    currentList[idx] = {
      ...currentList[idx],
      receiptUrl: receiptUrl || currentList[idx].receiptUrl,
      folioDocumentUrl: folioDocumentUrl || currentList[idx].folioDocumentUrl,
      sellerPhone: sellerPhone || currentList[idx].sellerPhone,
      status: 'pendiente'
    };
    saveStoredPaymentOrders(currentList);
  }

  try {
    const body = typeof payload === 'string' 
      ? { orderId: payload, receiptUrl: receiptUrlArg || '' }
      : payload;

    const res = await fetch(`${API_BASE}/payments/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function fetchAdminPendingPayments(): Promise<AdminPendingOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/pending`, {
      headers: getAdminAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
        const local = getStoredPaymentOrders().filter(o => o.status === 'pendiente');
        const apiIds = new Set(data.orders.map((o: any) => o.id));
        const onlyLocal = local.filter(o => !apiIds.has(o.id));
        return [...data.orders, ...onlyLocal];
      }
    }
  } catch {}
  return getStoredPaymentOrders().filter(o => o.status === 'pendiente');
}

export async function fetchAdminHistoryPayments(): Promise<AdminPendingOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/history`, {
      headers: getAdminAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
        const local = getStoredPaymentOrders().filter(o => o.status === 'aprobado' || o.status === 'rechazado');
        const apiIds = new Set(data.orders.map((o: any) => o.id));
        const onlyLocal = local.filter(o => !apiIds.has(o.id));
        return [...data.orders, ...onlyLocal];
      }
    }
  } catch {}
  return getStoredPaymentOrders().filter(o => o.status === 'aprobado' || o.status === 'rechazado');
}

export async function approvePaymentOrder(orderId: string): Promise<boolean> {
  const currentList = getStoredPaymentOrders();
  const idx = currentList.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    currentList[idx] = {
      ...currentList[idx],
      status: 'aprobado',
      lawyerStatus: 'aprobado'
    };
    saveStoredPaymentOrders(currentList);
  }

  try {
    const res = await fetch(`${API_BASE}/payments/admin/${orderId}/approve`, {
      method: 'POST',
      headers: getAdminAuthHeaders()
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function rejectPaymentOrder(orderId: string, reason?: string): Promise<boolean> {
  const currentList = getStoredPaymentOrders();
  const idx = currentList.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    currentList[idx] = {
      ...currentList[idx],
      status: 'rechazado',
      rejectionReason: reason || 'Comprobante no válido o ilegible'
    };
    saveStoredPaymentOrders(currentList);
  }

  try {
    const res = await fetch(`${API_BASE}/payments/admin/${orderId}/reject`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function updateOperationalStatus(orderId: string, updates: {
  lawyerStatus?: 'pendiente' | 'aprobado' | 'rechazado';
  photographerStatus?: 'no_aplica' | 'pendiente' | 'completado';
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/review`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ orderId, ...updates })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function linkPropertyToOrder(orderId: string, propertyId: string, propertyTitle: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/order/${orderId}/link-property`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, propertyTitle })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteAdminPaymentOrder(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders()
    });
    return res.ok;
  } catch {
    return false;
  }
}
