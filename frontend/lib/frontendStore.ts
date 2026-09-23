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

export interface ChatMessage {
  id: string;
  senderEmail: string;
  senderName: string;
  senderRole: 'comprador' | 'vendedor';
  text: string;
  timestamp: string;
}

export interface ConsultationItem {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  propertyImage: string;
  propertyHref?: string;
  sellerEmail?: string;
  sellerName?: string;
  buyerEmail?: string;
  buyerName?: string;
  buyerPhone?: string;
  // Compatibilidad hacia atrás
  advisorName?: string;
  advisorPhone?: string;
  advisorAvatar?: string;
  status: 'respondido' | 'pendiente' | 'visita_agendada';
  lastMessage: string;
  date: string;
  messages?: ChatMessage[];
  unreadBySeller?: number;
  unreadByBuyer?: number;
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

// Purga única de pruebas en el navegador del usuario al cargar
if (typeof window !== 'undefined') {
  try {
    const purgeDone = window.localStorage.getItem('inmovax-purged-tests-v4');
    if (!purgeDone) {
      window.localStorage.removeItem(CONSULTATIONS_KEY);
      window.localStorage.setItem('inmovax-purged-tests-v4', 'true');
    }
  } catch {}
}

export const readStoredList = <T,>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const value = window.localStorage.getItem(key);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as T[];
    if (key === CONSULTATIONS_KEY && Array.isArray(parsed)) {
      const cleaned = (parsed as unknown as ConsultationItem[]).filter((item) => {
        if (!item || !item.id) return false;
        if (item.id === 'cons-1' || item.id === 'cons-2' || item.id === 'cons-1790113153461') return false;
        return true;
      });
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

export const writeStoredList = <T,>(key: string, value: T[], emitEvent: boolean = true) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  if (emitEvent) {
    emitStoreEvent('list-updated', { key });
  }
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

/**
 * Enviar mensaje inicial Comprador -> Vendedor (REQ-34)
 */
export const sendP2PMessage = (
  params: {
    propertyId: string;
    propertyTitle: string;
    propertyLocation: string;
    propertyPrice: string;
    propertyImage: string;
    propertyHref: string;
    sellerEmail: string;
    sellerName: string;
    buyerEmail: string;
    buyerName: string;
    buyerPhone?: string;
    messageText: string;
  },
  syncRemote: boolean = false
): ConsultationItem => {
  const currentList = getStoredConsultations();
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateNow = 'Hoy, ' + timeNow;

  // Buscar si ya existe una conversación previa entre este comprador y vendedor para este inmueble
  const existingIndex = currentList.findIndex(
    (item) =>
      item.propertyId === params.propertyId &&
      item.buyerEmail?.toLowerCase() === params.buyerEmail.toLowerCase()
  );

  const newChatMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    senderEmail: params.buyerEmail,
    senderName: params.buyerName,
    senderRole: 'comprador',
    text: params.messageText,
    timestamp: timeNow
  };

  let targetConsultation: ConsultationItem;

  if (existingIndex >= 0) {
    const existing = currentList[existingIndex];
    targetConsultation = {
      ...existing,
      lastMessage: params.messageText,
      date: dateNow,
      status: 'pendiente',
      unreadBySeller: (existing.unreadBySeller || 0) + 1,
      messages: [...(existing.messages || []), newChatMessage]
    };
    currentList[existingIndex] = targetConsultation;
  } else {
    targetConsultation = {
      id: `cons-${Date.now()}`,
      propertyId: params.propertyId,
      propertyTitle: params.propertyTitle,
      propertyLocation: params.propertyLocation,
      propertyPrice: params.propertyPrice,
      propertyImage: params.propertyImage,
      propertyHref: params.propertyHref,
      sellerEmail: params.sellerEmail,
      sellerName: params.sellerName,
      buyerEmail: params.buyerEmail,
      buyerName: params.buyerName,
      buyerPhone: params.buyerPhone,
      advisorName: params.sellerName, // Compatibilidad UI
      advisorPhone: params.buyerPhone || '',
      status: 'pendiente',
      lastMessage: params.messageText,
      date: dateNow,
      messages: [newChatMessage],
      unreadBySeller: 1,
      unreadByBuyer: 0
    };
    currentList.unshift(targetConsultation);
  }

  writeStoredList(CONSULTATIONS_KEY, currentList);
  emitStoreEvent('list-updated', { key: CONSULTATIONS_KEY });
  emitStoreEvent('new-inquiry', { consultation: targetConsultation });

  // Sincronizar con el backend solo si se solicita explícitamente
  if (syncRemote) {
    const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api';

    fetch(`${apiBase}/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: params.propertyId,
        propertyTitle: params.propertyTitle,
        propertyLocation: params.propertyLocation,
        propertyPrice: params.propertyPrice,
        propertyImage: params.propertyImage,
        propertyHref: params.propertyHref,
        sellerEmail: params.sellerEmail,
        sellerName: params.sellerName,
        buyerEmail: params.buyerEmail,
        buyerName: params.buyerName,
        buyerPhone: params.buyerPhone,
        messageText: params.messageText
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.consultation) {
          const stored = getStoredConsultations();
          const idx = stored.findIndex((item) => item.id === targetConsultation.id);
          if (idx !== -1) {
            stored[idx] = { ...stored[idx], ...data.consultation };
            writeStoredList(CONSULTATIONS_KEY, stored);
          }
        }
      })
      .catch(() => {});
  }

  return targetConsultation;
};

/**
 * Responder mensaje en el chat Comprador <-> Vendedor (REQ-34)
 */
export const replyP2PMessage = (
  consultationId: string,
  replyText: string,
  senderRole: 'vendedor' | 'comprador',
  senderName: string,
  senderEmail: string,
  syncRemote: boolean = false
): ConsultationItem | null => {
  const currentList = getStoredConsultations();
  const index = currentList.findIndex((item) => item.id === consultationId);
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateNow = 'Hoy, ' + timeNow;

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    senderEmail,
    senderName,
    senderRole,
    text: replyText,
    timestamp: timeNow
  };

  let updated: ConsultationItem;
  if (index !== -1) {
    const item = currentList[index];
    updated = {
      ...item,
      lastMessage: replyText,
      date: dateNow,
      status: senderRole === 'vendedor' ? 'respondido' : 'pendiente',
      unreadByBuyer: senderRole === 'vendedor' ? (item.unreadByBuyer || 0) + 1 : item.unreadByBuyer,
      unreadBySeller: senderRole === 'comprador' ? (item.unreadBySeller || 0) + 1 : item.unreadBySeller,
      messages: [...(item.messages || []), newMsg]
    };
    currentList[index] = updated;
  } else {
    updated = {
      id: consultationId,
      propertyTitle: 'Consulta sobre Inmueble',
      propertyLocation: 'La Paz',
      propertyPrice: '',
      propertyImage: '',
      sellerEmail: senderRole === 'vendedor' ? senderEmail : 'vendedor@inmovax.com',
      buyerEmail: senderRole === 'comprador' ? senderEmail : 'comprador@inmovax.com',
      lastMessage: replyText,
      date: dateNow,
      status: senderRole === 'vendedor' ? 'respondido' : 'pendiente',
      messages: [newMsg],
      unreadByBuyer: senderRole === 'vendedor' ? 1 : 0,
      unreadBySeller: senderRole === 'comprador' ? 1 : 0
    };
    currentList.unshift(updated);
  }

  writeStoredList(CONSULTATIONS_KEY, currentList);
  emitStoreEvent('list-updated', { key: CONSULTATIONS_KEY });

  // Sincronizar respuesta con el backend solo si no fue enviado previamente
  if (syncRemote) {
    const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api';

    fetch(`${apiBase}/consultations/${encodeURIComponent(consultationId)}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderEmail,
        senderName,
        senderRole,
        replyText
      })
    }).catch(() => {
      // Conservar cambio local reactivo si el backend estuviera offline
    });
  }

  return updated;
};

// Control de peticiones concurrentes para evitar bucles o agotamiento de sockets
const inFlightSellerFetches = new Map<string, Promise<ConsultationItem[]>>();
const inFlightBuyerFetches = new Map<string, Promise<ConsultationItem[]>>();

/**
 * Cargar consultas de un vendedor desde PostgreSQL (Supabase) como única fuente de verdad
 */
export const fetchConsultationsForSeller = async (sellerEmail?: string): Promise<ConsultationItem[]> => {
  if (!sellerEmail) return [];
  const cleanEmail = sellerEmail.toLowerCase().trim();

  if (inFlightSellerFetches.has(cleanEmail)) {
    return inFlightSellerFetches.get(cleanEmail)!;
  }

  const promise = (async () => {
    const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api';

    try {
      const res = await fetch(`${apiBase}/consultations/seller/${encodeURIComponent(cleanEmail)}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.consultations)) {
          const cloudList: ConsultationItem[] = data.consultations;

          // PostgreSQL es la fuente definitiva de la verdad para este vendedor
          const all = getStoredConsultations();
          const others = all.filter((item) => {
            const sEmail = (item.sellerEmail || '').toLowerCase().trim();
            return sEmail && sEmail !== cleanEmail && sEmail !== 'vendedor@inmovax.com' && sEmail !== 'gonzalo.benitez@inmovax.com';
          });

          const updated = [...cloudList, ...others];
          // IMPORTANTE: emitEvent = false para no disparar eventos en bucle
          writeStoredList(CONSULTATIONS_KEY, updated, false);

          return cloudList;
        }
      }
    } catch {
      // Ignorar de forma segura caídas de red temporales
    } finally {
      inFlightSellerFetches.delete(cleanEmail);
    }

    return getConsultationsForSeller(cleanEmail);
  })();

  inFlightSellerFetches.set(cleanEmail, promise);
  return promise;
};

/**
 * Cargar consultas de un comprador desde PostgreSQL (Supabase)
 */
export const fetchConsultationsForBuyer = async (buyerEmail?: string): Promise<ConsultationItem[]> => {
  if (!buyerEmail) return [];
  const cleanEmail = buyerEmail.toLowerCase().trim();

  if (inFlightBuyerFetches.has(cleanEmail)) {
    return inFlightBuyerFetches.get(cleanEmail)!;
  }

  const promise = (async () => {
    const apiBase = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : 'http://localhost:4000/api';

    try {
      const res = await fetch(`${apiBase}/consultations/buyer/${encodeURIComponent(cleanEmail)}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.consultations)) {
          return data.consultations;
        }
      }
    } catch {
      // Silencioso en caso de error de red
    } finally {
      inFlightBuyerFetches.delete(cleanEmail);
    }

    return getConsultationsForBuyer(cleanEmail);
  })();

  inFlightBuyerFetches.set(cleanEmail, promise);
  return promise;
};

/**
 * Consultas pertenecientes a un vendedor (por su email o por propiedad)
 */
export const getConsultationsForSeller = (sellerEmail?: string): ConsultationItem[] => {
  if (!sellerEmail) return [];
  const cleanEmail = sellerEmail.toLowerCase().trim();
  const list = getStoredConsultations();
  const aliases = ['vendedor@inmovax.com', 'gonzalo.benitez@inmovax.com'];
  const isDemo = aliases.includes(cleanEmail);

  return list.filter((c) => {
    // 1. Coincidencia directa de email o alias
    if (c.sellerEmail) {
      const s = c.sellerEmail.toLowerCase().trim();
      if (s === cleanEmail) return true;
      if (isDemo && aliases.includes(s)) return true;

      // Si tiene propertyId, verificar si la propiedad fue creada por este vendedor
      if (typeof window !== 'undefined' && c.propertyId) {
        try {
          const raw = window.localStorage.getItem('inmovax-managed-properties-v3') || window.localStorage.getItem('inmovax-managed-properties');
          if (raw) {
            const props = JSON.parse(raw) as Array<{ id: string; authorEmail?: string }>;
            const found = props.find((p) => p.id === c.propertyId);
            if (found?.authorEmail && (found.authorEmail.toLowerCase().trim() === cleanEmail || (isDemo && aliases.includes(found.authorEmail.toLowerCase().trim())))) {
              return true;
            }
          }
        } catch {
          // ignorar error de parseo
        }
      }

      // Si estaba dirigido a otro vendedor distinto, no mostrar
      return false;
    }

    // 2. Si no tiene sellerEmail explícito pero el comprador es distinto al usuario actual
    if (!c.sellerEmail && c.buyerEmail && c.buyerEmail.toLowerCase().trim() !== cleanEmail) {
      return true;
    }

    return false;
  });
};

/**
 * Consultas realizadas por un comprador (por su email)
 */
export const getConsultationsForBuyer = (buyerEmail?: string): ConsultationItem[] => {
  if (!buyerEmail) return [];
  const cleanEmail = buyerEmail.toLowerCase().trim();
  const list = getStoredConsultations();
  return list.filter((c) => c.buyerEmail && c.buyerEmail.toLowerCase().trim() === cleanEmail);
};

