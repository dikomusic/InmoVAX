/**
 * Store de Propiedades 100% Frontend (Puro Frontend con LocalStorage y Eventos Reactivos).
 * Conecta las publicaciones de los usuarios entre:
 * - Página Principal (/): Muestra los inmuebles publicados por el vendedor
 * - Portal del Vendedor (/vendedor): CRUD completo (Ver, Pausar, Editar y Eliminar)
 * - Formulario de Publicación (/publicar): Asocia nuevas propiedades al usuario en sesión
 * - Cabecera Navbar: Detección dinámica de 0 vs >=1 publicaciones por autor
 */

import { readStoredSession, saveStoredSession, emitStoreEvent } from './frontendStore';

export interface ManagedProperty {
  id: string;
  title: string;
  zone: string;
  address?: string;
  description?: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  price: string;
  views: number;
  inquiries: number;
  status: 'Activo' | 'En Validación Legal' | 'Pausado' | 'Cerrado';
  folioReal: string;
  assignedAdvisor: string;
  image: string;
  gallery?: string[];
  datePublished: string;
  authorEmail: string;
  authorName?: string;
  habitaciones?: number;
  banos?: number;
  metros?: number;
  estacionamientos?: number;
  amenidades?: string[];
  href?: string;
  esNuevo?: boolean;
}

export const PROPERTIES_STORAGE_KEY = 'inmovax-managed-properties-v3';

// Dos usuarios ficticios del sistema
export const DEMO_USERS = {
  vendedor: {
    name: 'Arq. Gonzalo Benítez',
    email: 'vendedor@inmovax.com',
    role: 'vendedor' as const,
    hasPublishedProperties: true,
    description: 'Tiene 4 propiedades publicadas en la plataforma (Aparece "Mi cuenta")'
  },
  comprador: {
    name: 'Carlos Mendoza',
    email: 'comprador@inmovax.com',
    role: 'comprador' as const,
    hasPublishedProperties: false,
    description: 'Usuario activo con 0 propiedades publicadas (NO aparece "Mi cuenta")'
  }
};

/**
 * Las 4 propiedades oficiales del usuario vendedor ficticio (Arq. Gonzalo Benítez)
 */
/**
 * Lista inicial vacía: el frontend se alimenta 100% de Supabase vía el backend en Bun
 */
export const DEFAULT_INITIAL_PROPERTIES: ManagedProperty[] = [];

/**
 * Validar si dos correos corresponden al mismo autor
 */
export const isMatchingSellerEmail = (emailA?: string, emailB?: string): boolean => {
  if (!emailA || !emailB) return false;
  const a = emailA.toLowerCase().trim();
  const b = emailB.toLowerCase().trim();
  if (a === b) return true;
  const sellerAliases = ['vendedor@inmovax.com', 'gonzalo.benitez@inmovax.com'];
  return sellerAliases.includes(a) && sellerAliases.includes(b);
};

let hasSyncedOnce = false;

export const syncPropertiesWithCloudBackend = async () => {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('http://127.0.0.1:4000/api/properties', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.properties && Array.isArray(json.properties)) {
        saveManagedProperties(json.properties);
      }
    }
  } catch {
    // Si el backend no está disponible temporalmente, se conserva la copia local
  }
};

/**
 * Consultar directamente las propiedades desde el backend en Bun (Supabase)
 */
export const fetchAllPropertiesFromBackend = async (): Promise<ManagedProperty[]> => {
  try {
    const res = await fetch('http://127.0.0.1:4000/api/properties', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.properties && Array.isArray(json.properties)) {
        saveManagedProperties(json.properties);
        return json.properties;
      }
    }
  } catch (err) {
    console.error('Error fetching properties from backend:', err);
  }
  return getAllManagedProperties();
};

/**
 * Obtener todas las propiedades publicadas activas en la plataforma
 */
export const getAllManagedProperties = (): ManagedProperty[] => {
  if (typeof window === 'undefined') return [];

  // Disparar sincronización en segundo plano con Bun y Supabase
  if (!hasSyncedOnce) {
    hasSyncedOnce = true;
    syncPropertiesWithCloudBackend();
  }

  const raw = window.localStorage.getItem(PROPERTIES_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const list = JSON.parse(raw) as ManagedProperty[];
    return list;
  } catch {
    return [];
  }
};

/**
 * Guardar lista de propiedades y notificar reactivamente a toda la app
 */
export const saveManagedProperties = (properties: ManagedProperty[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
  emitStoreEvent('properties-updated');
};

/**
 * Obtener propiedades filtradas por el correo del autor
 */
export const getPropertiesByAuthor = (authorEmail?: string): ManagedProperty[] => {
  if (!authorEmail) return [];
  const all = getAllManagedProperties();
  return all.filter((p) => isMatchingSellerEmail(p.authorEmail, authorEmail));
};

/**
 * Contar cuántas propiedades tiene publicadas un usuario específico
 */
export const countAuthorProperties = (authorEmail?: string): number => {
  return getPropertiesByAuthor(authorEmail).length;
};

/**
 * Verificar si el autor tiene 1 o más propiedades
 */
export const hasAuthorPublishedProperties = (authorEmail?: string): boolean => {
  return countAuthorProperties(authorEmail) > 0;
};

export type NewPropertyInput = {
  id?: string;
  title: string;
  zone: string;
  address?: string;
  description?: string;
  type: ManagedProperty['type'];
  price: string;
  image?: string;
  gallery?: string[];
  folioReal?: string;
  status?: ManagedProperty['status'];
  assignedAdvisor?: string;
  authorEmail?: string;
  authorName?: string;
  habitaciones?: number;
  banos?: number;
  metros?: number;
  estacionamientos?: number;
  amenidades?: string[];
};

/**
 * Crear / Publicar una nueva propiedad asociada al usuario actual
 */
export const addManagedProperty = async (data: NewPropertyInput): Promise<ManagedProperty> => {
  const all = getAllManagedProperties();
  const currentSession = readStoredSession();
  const authorEmail = data.authorEmail || currentSession?.email || 'vendedor@inmovax.com';
  const authorName = data.authorName || currentSession?.name || 'Arq. Gonzalo Benítez';

  const propId = data.id || `PROP-${Math.floor(100 + Math.random() * 900)}`;

  const rawType = data.type || 'Anticrético';
  const normalizedType = (rawType.toLowerCase().includes('anticr') || rawType.toLowerCase().includes('anticret'))
    ? 'Anticrético'
    : rawType.toLowerCase().includes('alquiler')
      ? 'Alquiler'
      : 'Venta';

  const newProperty: ManagedProperty = {
    id: propId,
    title: data.title,
    zone: data.zone,
    address: data.address || data.zone,
    description: data.description || '',
    type: normalizedType as ManagedProperty['type'],
    price: data.price,
    views: 1,
    inquiries: 0,
    status: data.status || 'Activo',
    folioReal: data.folioReal || `2.01.0.${Math.floor(10 + Math.random() * 89)}.${Math.floor(1000000 + Math.random() * 8999999)}`,
    assignedAdvisor: data.assignedAdvisor || 'Lic. Carlos Vega',
    image: data.image || '',
    gallery: data.gallery || (data.image && data.image.trim() !== '' ? [data.image] : []),
    datePublished: 'Publicado hoy',
    authorEmail,
    authorName,
    habitaciones: data.habitaciones,
    banos: data.banos,
    metros: data.metros,
    estacionamientos: data.estacionamientos,
    amenidades: data.amenidades || [],
    href: `/propiedad/${propId}`,
    esNuevo: true
  };

  const updated = [newProperty, ...all];
  saveManagedProperties(updated);

    // Sincronizar asíncronamente con el Backend en Bun y Supabase
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('http://127.0.0.1:4000/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newProperty.id,
            title: newProperty.title,
            description: `${data.description || `${newProperty.title} en ${newProperty.zone}`}\n\nCaracterísticas adicionales:\n- Parqueos: ${newProperty.estacionamientos || 0}\n- Amenidades: ${(newProperty.amenidades || []).length > 0 ? newProperty.amenidades?.join(', ') : 'Ninguna'}`,
            address: data.address || newProperty.zone,
            zone: newProperty.zone,
            type: normalizedType,
            price: newProperty.price,
            status: newProperty.status,
            folioReal: newProperty.folioReal,
          image: newProperty.image,
          gallery: newProperty.gallery,
          authorEmail: newProperty.authorEmail,
          authorName: newProperty.authorName || 'Vendedor InmoVAX',
          bedrooms: newProperty.habitaciones,
          bathrooms: newProperty.banos,
          areaSqm: newProperty.metros
        })
      });
      
      if (res.ok) {
        const fetchRes = await fetch('http://127.0.0.1:4000/api/properties');
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          if (json.properties) saveManagedProperties(json.properties);
        }
      } else {
        const errData = await res.json();
        console.error("Backend error on POST:", errData);
      }
    } catch (err) {
      console.error("Fetch error on POST:", err);
    }
  }

  // Actualizar sesión si es el usuario actual para activar "Mi cuenta"
  if (currentSession && isMatchingSellerEmail(currentSession.email, authorEmail)) {
    saveStoredSession({ ...currentSession, hasPublishedProperties: true });
  }

  return newProperty;
};

/**
 * Eliminar una propiedad por su ID (CRUD - Eliminar publicación)
 */
export const deleteManagedProperty = (propertyId: string): boolean => {
  const all = getAllManagedProperties();
  const target = all.find((p) => p.id === propertyId);
  const updated = all.filter((p) => p.id !== propertyId);
  saveManagedProperties(updated);

  // Si el usuario que borró era el de la sesión actual y ahora tiene 0 propiedades, apagar "Mi cuenta"
  const currentSession = readStoredSession();
  if (currentSession && target && isMatchingSellerEmail(target.authorEmail, currentSession.email)) {
    const remainingForAuthor = updated.filter((p) =>
      isMatchingSellerEmail(p.authorEmail, currentSession.email)
    );
    if (remainingForAuthor.length === 0) {
      saveStoredSession({ ...currentSession, hasPublishedProperties: false });
    }
  }

  // Sincronizar eliminación con el Backend en Bun y Supabase
  if (typeof window !== 'undefined') {
    fetch(`http://127.0.0.1:4000/api/properties/${encodeURIComponent(propertyId)}`, {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (res.ok) {
          const fetchRes = await fetch('http://127.0.0.1:4000/api/properties');
          if (fetchRes.ok) {
            const json = await fetchRes.json();
            if (json.properties) saveManagedProperties(json.properties);
          }
        }
      })
      .catch(() => {});
  }

  emitStoreEvent('properties-updated');
  return true;
};

/**
 * Actualizar una propiedad existente
 */
export const updateManagedProperty = (updated: ManagedProperty) => {
  const all = getAllManagedProperties();
  const next = all.map((p) => (p.id === updated.id ? updated : p));
  saveManagedProperties(next);
};

/**
 * Pausar o activar una propiedad
 */
export const togglePauseManagedProperty = (propertyId: string): string => {
  const all = getAllManagedProperties();
  let nextStatus = 'Activo';
  const next = all.map((p) => {
    if (p.id === propertyId) {
      nextStatus = p.status === 'Activo' ? 'Pausado' : 'Activo';
      return { ...p, status: nextStatus as ManagedProperty['status'] };
    }
    return p;
  });
  saveManagedProperties(next);

  // Sincronizar cambio de estado con el Backend en Bun y Supabase
  if (typeof window !== 'undefined') {
    fetch(`http://127.0.0.1:4000/api/properties/${encodeURIComponent(propertyId)}/toggle-pause`, {
      method: 'PATCH'
    }).catch(() => {});
  }

  return nextStatus;
};

/**
 * Sincronizar y recargar datos directamente desde el backend en Bun
 */
export const resetDemoData = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PROPERTIES_STORAGE_KEY);
  syncPropertiesWithCloudBackend();
  emitStoreEvent('properties-updated');
};
