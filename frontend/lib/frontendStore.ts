export type AccountActivity = 'notifications' | 'favorites' | 'history' | 'consultations';

export interface FrontendSession {
  name: string;
  email: string;
  hasPublishedProperties: boolean;
  role?: 'visitante' | 'comprador' | 'vendedor' | 'admin';
}

export interface FavoriteItem {
  id?: string;
  title: string;
  price?: string;
  location?: string;
  imageUrl?: string;
  contractType?: string;
  href?: string;
  addedAt?: string;
}

export interface HistoryItem {
  id?: string;
  title: string;
  price?: string;
  location?: string;
  imageUrl?: string;
  contractType?: string;
  href?: string;
  visitedAt?: string;
}

export interface ConsultationItem {
  id: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  propertyImage: string;
  advisorName: string;
  advisorPhone: string;
  advisorAvatar?: string;
  status: 'respondido' | 'pendiente' | 'visita_agendada';
  lastMessage: string;
  date: string;
  propertyHref?: string;
}

export const SESSION_KEY = 'inmovax-session';
export const FAVORITES_KEY = 'inmovax-favorites';
export const HISTORY_KEY = 'inmovax-history';
export const PROPERTIES_KEY = 'inmovax-properties';
export const CONSULTATIONS_KEY = 'inmovax-consultations';

export const readStoredSession = (): FrontendSession | null => {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(SESSION_KEY);
  return value ? (JSON.parse(value) as FrontendSession) : null;
};

export const saveStoredSession = (session: FrontendSession) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitStoreEvent('session-updated');
};

export const removeStoredSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
  emitStoreEvent('session-updated');
};

export const markSellerAccess = (session: FrontendSession): FrontendSession => {
  const sellerSession: FrontendSession = { ...session, hasPublishedProperties: true };
  saveStoredSession(sellerSession);
  return sellerSession;
};

export const readStoredList = <T,>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const value = window.localStorage.getItem(key);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as T[];
    if (key === CONSULTATIONS_KEY && Array.isArray(parsed)) {
      // Purgar consultas demo heredadas de pruebas (cons-1, cons-2)
      const cleaned = (parsed as unknown as ConsultationItem[]).filter(
        (item) => item && item.id !== 'cons-1' && item.id !== 'cons-2'
      );
      if (cleaned.length !== parsed.length) {
        window.localStorage.setItem(key, JSON.stringify(cleaned));
      }
      return cleaned as unknown as T[];
    }
    return parsed;
  } catch {
    return [];
  }
};

export const writeStoredList = <T,>(key: string, value: T[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  emitStoreEvent('list-updated', { key });
};

/**
 * Event emitter to synchronize components instantly across tabs / dialogs
 */
export const emitStoreEvent = (type: string, detail?: unknown) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(`inmovax:${type}`, { detail }));
};

/**
 * Comprobar si el usuario actual tiene 1 o más propiedades publicadas a su nombre
 */
export const hasUserPublishedProperties = (session?: FrontendSession | null): boolean => {
  if (!session || !session.email) return false;
  if (session.hasPublishedProperties === true || session.role === 'vendedor') return true;

  try {
    const userEmail = session.email.toLowerCase().trim();
    if (userEmail === 'vendedor@inmovax.com' || userEmail === 'gonzalo.benitez@inmovax.com') {
      return true;
    }

    // Comprobar tanto la clave actual v3 como la anterior
    const raw = typeof window !== 'undefined' 
      ? (window.localStorage.getItem('inmovax-managed-properties-v3') || window.localStorage.getItem('inmovax-managed-properties'))
      : null;

    if (!raw) return false;
    const list = JSON.parse(raw) as Array<{ authorEmail?: string }>;
    return list.some((p) => p.authorEmail && p.authorEmail.toLowerCase().trim() === userEmail);
  } catch {
    return false;
  }
};

/**
 * Las cuentas nuevas empiezan con 0 consultas reales
 */
export const getInitialConsultations = (): ConsultationItem[] => {
  return [];
};

export const getStoredConsultations = (): ConsultationItem[] => {
  return readStoredList<ConsultationItem>(CONSULTATIONS_KEY);
};
