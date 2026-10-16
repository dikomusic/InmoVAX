/**
 * Repositorio de Inmuebles / Propiedades (Capa de Acceso a Datos - DAL)
 * InmoVAX Backend - Patrón Repositorio
 */

import { supabase } from '../config/supabase';
import { IProperty, ICreatePropertyDTO, IUpdatePropertyDTO, IPropertyFilter } from '../interfaces/property.interface';

// Mapeador de datos desde la estructura relacional de Supabase al DTO de InmoVAX
export function mapDbPropertyToDto(dbProp: any): IProperty {
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

  const coverImg = Array.isArray(dbProp.property_images)
    ? dbProp.property_images.find((img: any) => img.is_cover)?.image_url
    : null;

  const gallery: string[] = Array.isArray(dbProp.property_images)
    ? dbProp.property_images.map((img: any) => img.image_url).filter(Boolean)
    : [];

  const image = coverImg || gallery[0] || dbProp.image || '';
  const pricePrefix = dbProp.currency === 'USD' ? '$us ' : 'Bs. ';
  const price = `${pricePrefix}${Number(dbProp.price_amount).toLocaleString()}`;
  const code = dbProp.code || dbProp.id;

  return {
    id: code,
    title: dbProp.title,
    zone: dbProp.zone,
    address: dbProp.address || dbProp.zone,
    description: dbProp.description || '',
    type: typeMap[dbProp.type_id] || 'Anticrético',
    price,
    views: dbProp.views_count ?? 0,
    inquiries: dbProp.inquiries_count ?? 0,
    status: statusMap[dbProp.status_id] || 'Activo',
    folioReal: dbProp.folio_real,
    assignedAdvisor: dbProp.profiles?.full_name || 'Propietario',
    sellerName: dbProp.profiles?.full_name || 'Propietario InmoVAX',
    sellerPhone: dbProp.profiles?.phone || '',
    sellerEmail: dbProp.profiles?.email || '',
    image,
    gallery,
    category: dbProp.category || 'Departamento',
    isNegotiable: dbProp.is_negotiable ?? false,
    latitude: dbProp.latitude !== null && dbProp.latitude !== undefined ? Number(dbProp.latitude) : null,
    longitude: dbProp.longitude !== null && dbProp.longitude !== undefined ? Number(dbProp.longitude) : null,
    habitaciones: dbProp.bedrooms !== null && dbProp.bedrooms !== undefined ? dbProp.bedrooms : undefined,
    banos: dbProp.bathrooms !== null && dbProp.bathrooms !== undefined ? dbProp.bathrooms : undefined,
    metros: dbProp.area_sqm !== null && dbProp.area_sqm !== undefined ? Number(dbProp.area_sqm) : undefined,
    landAreaSqm: dbProp.land_area_sqm !== null && dbProp.land_area_sqm !== undefined ? Number(dbProp.land_area_sqm) : undefined,
    parkingSpots: dbProp.parking_spots ?? 0,
    estacionamientos: dbProp.parking_spots ?? 0,
    amenities: Array.isArray(dbProp.amenities) ? dbProp.amenities : [],
    amenidades: Array.isArray(dbProp.amenities) ? dbProp.amenities : [],
    href: `/propiedad/${code}`,
    datePublished: dbProp.created_at ? 'Publicado recientemente' : 'Publicado hace 4 días',
    authorEmail: dbProp.profiles?.email || '',
    authorName: dbProp.profiles?.full_name || 'Propietario'
  };
}

const legacyCodeMap: Record<string, string> = {
  'prop-sopocachi-01': 'PROP-101',
  'prop-calacoto-01': 'PROP-102',
  'prop-casa-calacoto-02': 'PROP-103',
  'prop-oficina-miraflores-01': 'PROP-104',
};

export class PropertyRepository {
  /**
   * Buscar propiedad de forma segura por id (UUID), código (PROP-XXX) o slug
   */
  static async findSafely(idOrCode: string) {
    const decoded = decodeURIComponent(idOrCode).trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded);
    const targetCode = legacyCodeMap[decoded.toLowerCase()] || legacyCodeMap[decoded] || decoded;

    let query = supabase.from('properties').select('id, title, code, status_id');
    if (isUuid) {
      query = query.or(`id.eq.${decoded},code.ilike.${decoded}`);
    } else {
      query = query.or(`code.ilike.${decoded},code.ilike.${targetCode}`);
    }
    const { data } = await query.maybeSingle();
    if (data) return data;

    // Búsqueda por slug en caso de identificadores descriptivos
    const cleanTitle = decoded.replace(/-/g, ' ').replace(/[,%]/g, '').trim();
    if (cleanTitle.length >= 4) {
      const { data: titleMatch } = await supabase
        .from('properties')
        .select('id, title, code, status_id')
        .ilike('title', `%${cleanTitle.slice(0, 15)}%`)
        .limit(1)
        .maybeSingle();
      if (titleMatch) return titleMatch;
    }

    return null;
  }

  /**
   * Obtener detalle completo de un inmueble individual incluyendo imágenes, perfil y auditorías
   */
  static async findByIdWithDetails(idOrCode: string) {
    const found = await this.findSafely(idOrCode);
    if (!found) return null;

    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(image_url), profiles!properties_user_id_fkey(email, full_name), legal_audits(*)')
      .eq('id', found.id)
      .single();

    if (error || !data) return null;
    return data;
  }

  /**
   * Listar inmuebles según estado y filtros comerciales en PostgreSQL
   */
  static async findAll(params?: { status?: string; type?: string; zone?: string; q?: string }) {
    let query = supabase
      .from('properties')
      .select('*, property_images(image_url), profiles!properties_user_id_fkey(email, full_name)')
      .order('created_at', { ascending: false });

    if (params?.status === 'all') {
      query = query.in('status_id', [1, 2, 3]);
    } else {
      query = query.eq('status_id', 1);
    }

    if (params?.type && params.type !== 'todos') {
      const typeIdMap: Record<string, number> = {
        'anticrético': 1,
        'anticretico': 1,
        'venta': 2,
        'alquiler': 3
      };
      const tid = typeIdMap[params.type.toLowerCase()];
      if (tid) {
        query = query.eq('type_id', tid);
      }
    }

    if (params?.zone) {
      query = query.ilike('zone', `%${params.zone.trim()}%`);
    }

    if (params?.q) {
      const cleanQ = params.q.trim();
      query = query.or(`title.ilike.%${cleanQ}%,zone.ilike.%${cleanQ}%,folio_real.ilike.%${cleanQ}%`);
    }

    return await query;
  }

  /**
   * Listar inmuebles publicados por un vendedor dado su email
   */
  static async findBySellerEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    return await supabase
      .from('properties')
      .select('*, property_images(image_url), profiles!properties_user_id_fkey!inner(email, full_name)')
      .ilike('profiles.email', cleanEmail)
      .order('created_at', { ascending: false });
  }

  /**
   * Verificar si ya existe un folio real registrado
   */
  static async findByFolioReal(folioReal: string) {
    return await supabase
      .from('properties')
      .select('id, folio_real')
      .eq('folio_real', folioReal)
      .maybeSingle();
  }

  /**
   * Insertar una nueva propiedad con sus datos relacionales
   */
  static async create(payload: Record<string, any>) {
    return await supabase
      .from('properties')
      .insert(payload)
      .select()
      .single();
  }

  /**
   * Insertar registros de imágenes asociadas a una propiedad
   */
  static async insertImages(images: Array<{ property_id: string; image_url: string; is_cover: boolean; display_order: number }>) {
    return await supabase.from('property_images').insert(images);
  }

  /**
   * Reemplazar o actualizar imágenes de una propiedad
   */
  static async updateImages(propertyId: string, images: Array<{ property_id: string; image_url: string; is_cover: boolean; display_order: number }>) {
    await supabase.from('property_images').delete().eq('property_id', propertyId);
    if (images.length > 0) {
      await supabase.from('property_images').insert(images);
    }
  }

  /**
   * Actualizar campos de una propiedad existente
   */
  static async update(id: string, payload: Record<string, any>) {
    return await supabase
      .from('properties')
      .update(payload)
      .eq('id', id);
  }

  /**
   * Actualizar estado de aprobación de una propiedad
   */
  static async updateStatus(id: string, statusId: number) {
    return await supabase
      .from('properties')
      .update({
        status_id: statusId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  }

  /**
   * Incrementar contador de visualizaciones
   */
  static async incrementViews(id: string, currentViews: number) {
    return await supabase
      .from('properties')
      .update({ views_count: currentViews + 1 })
      .eq('id', id);
  }

  /**
   * Incrementar contador de consultas
   */
  static async incrementInquiries(id: string, currentInquiries: number) {
    return await supabase
      .from('properties')
      .update({ inquiries_count: currentInquiries + 1 })
      .eq('id', id);
  }

  /**
   * Eliminar propiedad y sus dependencias relacionales
   */
  static async delete(id: string) {
    await supabase.from('property_images').delete().eq('property_id', id);
    await supabase.from('favorites').delete().eq('property_id', id);
    await supabase.from('legal_audits').delete().eq('property_id', id);
    return await supabase.from('properties').delete().eq('id', id);
  }
}
