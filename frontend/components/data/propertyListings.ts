import { PropertyCardProps } from '../organisms/PropertyCard';
import { getAllManagedProperties, ManagedProperty } from '@/lib/propertiesStore';

export type PropertyOperation = 'Venta' | 'Alquiler' | 'Anticrético';

export interface PropertyListing extends Omit<PropertyCardProps, 'href'> {
  id: string;
  href: string;
  tipo: 'casas' | 'departamentos' | 'terrenos' | 'oficinas' | 'locales';
  ciudad: 'lapaz' | 'santacruz' | 'cochabamba' | 'elalto';
  precioNumerico: number; // En USD para comparaciones uniformes
  moneda: 'USD' | 'BOB';
  estacionamientos?: number;
  alberca?: boolean;
  mascotas?: boolean;
  clasificacion?: 'Premium' | 'Estándar' | 'Oportunidad';
  terrenoM2?: number;
  construccionM2?: number;
  fechaPublicacion?: string;
  descripcion?: string;
  direccion?: string;
  folioReal?: string;
  asesor?: string;
  autorEmail?: string;
  autorNombre?: string;
  galeria?: string[];
  amenidades?: string[];
}

export const operationLabels: Record<PropertyOperation, string> = {
  Venta: 'En Venta',
  Alquiler: 'En Alquiler',
  'Anticrético': 'En Anticrético'
};

// Lista vacía: todas las propiedades se consultan directamente de Supabase / Bun
export const propertyListingsData: Record<PropertyOperation, PropertyListing[]> = {
  Venta: [],
  Alquiler: [],
  'Anticrético': []
};

/**
 * Convierte un objeto ManagedProperty (del backend/Supabase) al formato PropertyListing del catálogo
 */
export function managedPropertyToListing(mp: ManagedProperty): PropertyListing {
  // Extraer valor numérico del precio
  const rawDigits = (mp.price || '').replace(/[^0-9.]/g, '');
  const precioNumerico = Number(rawDigits) || 0;
  const moneda: 'USD' | 'BOB' = (mp.price || '').includes('Bs') ? 'BOB' : 'USD';

  // Inferencia de tipo de inmueble por título
  const text = `${mp.title} ${mp.zone}`.toLowerCase();
  let tipo: PropertyListing['tipo'] = 'departamentos';
  if (text.includes('casa') || text.includes('residencia') || text.includes('chalet')) {
    tipo = 'casas';
  } else if (text.includes('oficina') || text.includes('corporativ')) {
    tipo = 'oficinas';
  } else if (text.includes('terreno') || text.includes('lote')) {
    tipo = 'terrenos';
  } else if (text.includes('local') || text.includes('comercial')) {
    tipo = 'locales';
  }

  // Inferencia de ciudad
  const z = (mp.zone || '').toLowerCase();
  let ciudad: PropertyListing['ciudad'] = 'lapaz';
  if (z.includes('santa cruz') || z.includes('equipetrol')) ciudad = 'santacruz';
  else if (z.includes('cochabamba')) ciudad = 'cochabamba';
  else if (z.includes('el alto')) ciudad = 'elalto';

  const galeria: string[] = mp.gallery && mp.gallery.length > 0
    ? mp.gallery
    : (mp.image && mp.image.trim() !== '' ? [mp.image] : []);

  return {
    id: mp.id,
    titulo: mp.title,
    precio: mp.price,
    precioNumerico,
    moneda,
    ubicacion: mp.zone,
    ciudad,
    tipo,
    habitaciones: mp.habitaciones,
    banos: mp.banos,
    metros: mp.metros,
    estacionamientos: mp.estacionamientos,
    alberca: false,
    mascotas: true,
    clasificacion: 'Premium',
    tipoContrato: mp.type,
    esNuevo: mp.esNuevo ?? true,
    href: `/propiedad/${mp.id}`,
    imagenUrl: mp.image || '',
    fechaPublicacion: mp.datePublished,
    descripcion: mp.description,
    direccion: mp.address || mp.zone,
    folioReal: mp.folioReal,
    asesor: mp.assignedAdvisor,
    autorEmail: mp.authorEmail,
    autorNombre: mp.authorName,
    galeria,
    amenidades: mp.amenidades || []
  };
}

/**
 * Buscar un inmueble por ID en el almacén reactivo
 */
export const getPropertyById = (id: string): PropertyListing | undefined => {
  if (!id) return undefined;
  const normalizedId = decodeURIComponent(id).trim().toLowerCase();

  const managed = getAllManagedProperties();
  const foundManaged = managed.find((item) => {
    const itemId = item.id.toLowerCase();
    const itemHref = (item.href || '').toLowerCase();
    const itemTitleSlug = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[,%]/g, '');
    const cleanNormalized = normalizedId.replace(/[,%]/g, '');
    return (
      itemId === normalizedId ||
      itemHref === `/propiedad/${normalizedId}` ||
      itemHref.endsWith(`/${normalizedId}`) ||
      itemId.replace('prop-', '') === normalizedId ||
      itemTitleSlug === cleanNormalized ||
      itemTitleSlug.includes(cleanNormalized) ||
      cleanNormalized.includes(itemTitleSlug)
    );
  });

  if (foundManaged) {
    return managedPropertyToListing(foundManaged);
  }

  return undefined;
};

/**
 * Buscar un inmueble por ID directamente desde el backend en Bun (Supabase)
 */
export const fetchPropertyById = async (id: string): Promise<PropertyListing | null> => {
  if (!id) return null;
  const normalizedId = decodeURIComponent(id).trim();

  try {
    const res = await fetch(`http://127.0.0.1:4000/api/properties/${encodeURIComponent(normalizedId)}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.property) {
        return managedPropertyToListing(json.property);
      }
    }
  } catch (err) {
    console.error('Error fetching property from backend:', err);
  }

  const local = getPropertyById(normalizedId);
  return local || null;
};