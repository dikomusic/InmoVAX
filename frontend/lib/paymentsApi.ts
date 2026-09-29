/**
 * Cliente de API para Planes de Publicación y Pagos QR en InmoVAX
 * Conecta con el Backend Bun (http://localhost:4000/api/payments)
 */

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000/api';

export interface PublicationPlanItem {
  id: 'basico' | 'oro' | 'diamante';
  name: string;
  badgeColor: string;
  durationLabel: string;
  durationDays: number | null;
  price: number;
  currency: 'USD' | 'BOB';
  exposure: string;
  features: {
    canalesInmoVAX: boolean;
    soporte: string;
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
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    qrCodeData: string;
    receiptUrl?: string | null;
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
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  qrCodeData: string;
  receiptUrl?: string | null;
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
      basico: {
        id: 'basico',
        name: 'Básico',
        badgeColor: 'gray',
        durationLabel: '30 días',
        durationDays: 30,
        price: 25,
        currency: 'USD',
        exposure: 'Buena',
        features: { canalesInmoVAX: true, soporte: 'Online' }
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
        features: { canalesInmoVAX: true, soporte: 'Online y telefónico' }
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
        features: { canalesInmoVAX: true, soporte: 'Asesor dedicado y telefónico' }
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
  planId: 'basico' | 'oro' | 'diamante';
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

export async function uploadPaymentReceipt(orderId: string, receiptUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/payments/upload-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, receiptUrl })
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
