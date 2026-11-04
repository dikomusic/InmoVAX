/**
 * Cliente de API para Planes de Publicación y Pagos QR en InmoVAX
 * Conecta con el Backend Bun (http://localhost:4000/api/payments)
 */

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000/api';

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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-key': 'AdminInmoVAX#2026'
  };
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
  try {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error de conexión al crear orden de pago' };
  }
}

export async function uploadPaymentReceipt(payload: {
  orderId: string;
  receiptUrl: string;
  folioDocumentUrl?: string;
  sellerPhone?: string;
} | string, receiptUrlArg?: string): Promise<boolean> {
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
    return false;
  }
}

export async function fetchAdminPendingPayments(): Promise<AdminPendingOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/pending`, {
      headers: getAdminAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [];
  }
}

export async function fetchAdminHistoryPayments(): Promise<AdminPendingOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/history`, {
      headers: getAdminAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [];
  }
}

export async function approvePaymentOrder(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/${orderId}/approve`, {
      method: 'POST',
      headers: getAdminAuthHeaders()
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function rejectPaymentOrder(orderId: string, reason?: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/admin/${orderId}/reject`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return res.ok;
  } catch {
    return false;
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
