/**
 * Cliente de API para el Portal del Vendedor InmoVAX
 * Conecta de forma directa con el Backend Bun (http://localhost:4000)
 * y la base de datos PostgreSQL de Supabase.
 */

import { SellerOffer } from '@/components/molecules/SellerOfferItem';
import { SellerAppointment } from '@/components/organisms/SellerAppointmentsSection';
import { SellerNotificationItem } from '@/components/molecules/SellerNotifications';
import { SellerProperty } from '@/components/molecules/SellerPropertyCard';

const API_BASE = 'http://localhost:4000/api';

/**
 * Obtener publicaciones del vendedor en vivo desde Supabase
 */
export async function fetchSellerProperties(email: string): Promise<SellerProperty[]> {
  if (!email) return [];
  try {
    const res = await fetch(`${API_BASE}/properties/seller/${encodeURIComponent(email)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching seller properties from backend:', error);
    return [];
  }
}

/**
 * Obtener ofertas recibidas para las propiedades del vendedor
 */
export async function fetchSellerOffers(): Promise<SellerOffer[]> {
  try {
    const res = await fetch(`${API_BASE}/offers`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.offers || [];
  } catch (error) {
    console.error('Error fetching offers from backend:', error);
    return [];
  }
}

/**
 * Aceptar una oferta en Supabase
 */
export async function acceptSellerOffer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/offers/${encodeURIComponent(id)}/accept`, {
      method: 'PATCH'
    });
    return res.ok;
  } catch (error) {
    console.error('Error accepting offer:', error);
    return false;
  }
}

/**
 * Rechazar una oferta en Supabase
 */
export async function rejectSellerOffer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/offers/${encodeURIComponent(id)}/reject`, {
      method: 'PATCH'
    });
    return res.ok;
  } catch (error) {
    console.error('Error rejecting offer:', error);
    return false;
  }
}

/**
 * Enviar contraoferta en Supabase
 */
export async function counterSellerOffer(id: string, counterAmount: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/offers/${encodeURIComponent(id)}/counter`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ counterAmount })
    });
    return res.ok;
  } catch (error) {
    console.error('Error sending counter offer:', error);
    return false;
  }
}

/**
 * Obtener citas presenciales agendadas para el vendedor
 */
export async function fetchSellerAppointments(): Promise<SellerAppointment[]> {
  try {
    const res = await fetch(`${API_BASE}/appointments`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.appointments || [];
  } catch (error) {
    console.error('Error fetching appointments from backend:', error);
    return [];
  }
}

/**
 * Agendar nueva visita presencial en Supabase
 */
export async function createSellerAppointment(payload: {
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientPhone: string;
  advisorId?: string;
  advisorName?: string;
  date: string;
  time: string;
  notes?: string;
}): Promise<SellerAppointment | null> {
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.appointment || null;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
}

/**
 * Obtener notificaciones y eventos agregados desde Supabase
 */
export async function fetchSellerNotifications(): Promise<SellerNotificationItem[]> {
  try {
    const res = await fetch(`${API_BASE}/notifications`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications from backend:', error);
    return [];
  }
}
