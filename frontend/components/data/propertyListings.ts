import { PropertyCardProps } from '../organisms/PropertyCard';
import { getAllManagedProperties, ManagedProperty } from '@/lib/propertiesStore';
import { API_BASE } from '@/lib/apiConfig';

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
  isVerified?: boolean;
  latitude?: number | null;
  longitude?: number | null;
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
  // Extraer valor numérico del precio eliminando prefijos de moneda (evita que el punto de "Bs." se interprete como decimal)
  const rawPrice = (mp.price || '').trim();
  const moneda: 'USD' | 'BOB' = rawPrice.toLowerCase().includes('bs') ? 'BOB' : 'USD';
  const cleanPriceStr = rawPrice.replace(/^(bs\.?|\$us|usd)\s*/i, '').replace(/,/g, '');
  const rawDigits = cleanPriceStr.replace(/[^0-9.]/g, '');
  const precioNumerico = Number(rawDigits) || 0;

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
    amenidades: mp.amenidades || [],
    isVerified: Boolean(mp.isVerified),
    latitude: mp.latitude !== undefined && mp.latitude !== null ? Number(mp.latitude) : null,
    longitude: mp.longitude !== undefined && mp.longitude !== null ? Number(mp.longitude) : null
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

  // 1. Intentar consultar el backend en Bun
  try {
    const res = await fetch(`${API_BASE}/properties/${encodeURIComponent(normalizedId)}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.property) {
        return managedPropertyToListing(json.property);
      }
    }
  } catch {}

  // 2. Consulta directa a Supabase (PostgreSQL) para SSR y Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalizedId);
      
      let query = supabase.from('properties').select('*, property_images(*), profiles:profiles!properties_user_id_fkey(*)');
      if (isUuid) {
        query = query.eq('id', normalizedId);
      } else {
        query = query.ilike('code', normalizedId);
      }

      const { data } = await query.maybeSingle();
      if (data) {
        const typeMap: Record<number, 'Anticrético' | 'Venta' | 'Alquiler'> = {
          1: 'Anticrético',
          2: 'Venta',
          3: 'Alquiler'
        };
        const statusMap: Record<number, 'Activo' | 'En Validación Legal' | 'Pausado' | 'Cerrado'> = {
          1: 'Activo',
          2: 'En Validación Legal',
          3: 'Pausado',
          4: 'Cerrado'
        };

        const coverImg = Array.isArray(data.property_images)
          ? data.property_images.find((img: any) => img.is_cover)?.image_url
          : null;
        const gallery: string[] = Array.isArray(data.property_images)
          ? data.property_images.map((img: any) => img.image_url).filter(Boolean)
          : [];
        const image = coverImg || gallery[0] || data.image || '';
        const pricePrefix = data.currency === 'USD' ? '$us ' : 'Bs. ';
        const price = `${pricePrefix}${Number(data.price_amount).toLocaleString()}`;
        const code = data.code || data.id;

        const mp: ManagedProperty = {
          id: code,
          title: data.title,
          zone: data.zone,
          address: data.address || data.zone,
          description: data.description || '',
          type: typeMap[data.type_id] || 'Anticrético',
          price,
          views: data.views_count ?? 0,
          inquiries: data.inquiries_count ?? 0,
          status: statusMap[data.status_id] || 'Activo',
          folioReal: data.folio_real || '',
          assignedAdvisor: data.profiles?.full_name || 'Propietario',
          image,
          gallery,
          category: data.category || 'Departamento',
          isNegotiable: data.is_negotiable ?? false,
          latitude: data.latitude !== null && data.latitude !== undefined ? Number(data.latitude) : null,
          longitude: data.longitude !== null && data.longitude !== undefined ? Number(data.longitude) : null,
          habitaciones: data.bedrooms ?? undefined,
          banos: data.bathrooms ?? undefined,
          metros: data.area_sqm ? Number(data.area_sqm) : undefined,
          landAreaSqm: data.land_area_sqm ? Number(data.land_area_sqm) : null,
          estacionamientos: data.parking_spots ?? 0,
          parkingSpots: data.parking_spots ?? 0,
          amenidades: Array.isArray(data.amenities) ? data.amenities : [],
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          href: `/propiedad/${code}`,
          datePublished: data.created_at ? 'Publicado recientemente' : 'Publicado hace 4 días',
          authorEmail: data.profiles?.email || '',
          authorName: data.profiles?.full_name || 'Propietario',
          isVerified: Boolean(data.is_verified)
        };
        return managedPropertyToListing(mp);
      }
    } catch (err) {
      console.error('Direct Supabase fetch error in fetchPropertyById:', err);
    }
  }

  const local = getPropertyById(normalizedId);
  return local || null;
};