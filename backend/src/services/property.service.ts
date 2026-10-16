/**
 * Servicio de Inmuebles y Propiedades (Capa de Lógica de Negocio)
 * InmoVAX Backend - Patrón Servicio
 */

import { PropertyRepository, mapDbPropertyToDto } from '../repositories/property.repository';
import { UserRepository } from '../repositories/user.repository';
import { PaymentRepository } from '../repositories/payment.repository';
import { IProperty, ICreatePropertyDTO, IUpdatePropertyDTO } from '../interfaces/property.interface';
import { supabase } from '../config/supabase';

export class PropertyService {
  /**
   * REQ-08: Listar inmuebles disponibles con filtros comerciales
   */
  static async listProperties(params: { type?: string; zone?: string; q?: string; status?: string }): Promise<IProperty[]> {
    const { data, error } = await PropertyRepository.findAll(params);
    if (error || !data) return [];
    return data.map(mapDbPropertyToDto);
  }

  /**
   * REQ-08: Obtener detalle completo de un inmueble individual
   */
  static async getPropertyById(idOrCode: string): Promise<IProperty | null> {
    const data = await PropertyRepository.findByIdWithDetails(idOrCode);
    if (!data) return null;

    // Incrementar visualizaciones en segundo plano
    PropertyRepository.incrementViews(data.id, data.views_count || 0).then();
    data.views_count = (data.views_count || 0) + 1;

    return mapDbPropertyToDto(data);
  }

  /**
   * Listar inmuebles de un vendedor por correo
   */
  static async getSellerProperties(email: string): Promise<IProperty[]> {
    const { data, error } = await PropertyRepository.findBySellerEmail(email);
    if (error || !data) return [];
    return data.map(mapDbPropertyToDto);
  }

  /**
   * REQ-07: Registrar nuevo inmueble para validación legal y Folio Real
   */
  static async createProperty(validated: ICreatePropertyDTO): Promise<IProperty> {
    const emailLower = validated.authorEmail.toLowerCase().trim();

    // 1. Resolver usuario propietario
    let userId: string;
    const profile = await UserRepository.findByEmail(emailLower);

    if (profile) {
      userId = profile.id;
    } else {
      const newUserId = crypto.randomUUID();
      const { data: newProfile } = await UserRepository.upsertProfile({
        id: newUserId,
        email: emailLower,
        full_name: validated.authorName || 'Usuario InmoVAX',
        role_id: 2, // Rol base cliente/comprador
        is_verified: true
      });
      userId = newProfile?.id || newUserId;
    }

    // 2. Extraer monto numérico del precio
    const cleanNumber = validated.price.replace(/[^0-9]/g, '');
    const numericPrice = parseFloat(cleanNumber) || 50000;
    const currency = validated.price.includes('Bs') ? 'BOB' : 'USD';
    const typeId = validated.type === 'Anticrético' ? 1 : validated.type === 'Venta' ? 2 : 3;
    const code = validated.id || `PROP-${Math.floor(100 + Math.random() * 900)}`;

    const statusMap: Record<string, number> = {
      'Activo': 1,
      'En Validación Legal': 2,
      'Pausado': 3,
      'Cerrado': 4
    };

    // Todo inmueble nuevo ingresa por defecto en Validación Legal (status_id: 2)
    const defaultStatus = 2;
    const statusId = validated.status ? (statusMap[validated.status] || defaultStatus) : defaultStatus;

    // 3. Evitar colisión de Folio Real
    let folioRealToInsert = validated.folioReal;
    const existingFolio = await PropertyRepository.findByFolioReal(folioRealToInsert);
    if (existingFolio.data) {
      folioRealToInsert = `${folioRealToInsert}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // 4. Crear registro en base de datos
    const { data: inserted, error } = await PropertyRepository.create({
      code,
      user_id: userId,
      title: validated.title,
      description: validated.description || `${validated.title} en ${validated.zone}`,
      address: validated.address || validated.zone,
      zone: validated.zone,
      type_id: typeId,
      status_id: statusId,
      price_amount: numericPrice,
      currency,
      folio_real: folioRealToInsert,
      bedrooms: validated.bedrooms,
      bathrooms: validated.bathrooms,
      area_sqm: validated.areaSqm,
      category: validated.category,
      is_negotiable: validated.isNegotiable,
      latitude: validated.latitude ?? null,
      longitude: validated.longitude ?? null,
      land_area_sqm: validated.landAreaSqm ?? null,
      parking_spots: validated.parkingSpots,
      amenities: validated.amenities
    });

    if (error || !inserted) {
      throw new Error(error?.message || 'Error al insertar el inmueble.');
    }

    // 5. Insertar imágenes asociadas
    const imagesToInsert = validated.gallery && validated.gallery.length > 0
      ? validated.gallery
      : (validated.image && validated.image.trim() !== '' ? [validated.image] : []);

    if (imagesToInsert.length > 0) {
      const imageRecords = imagesToInsert.map((imgUrl, index) => ({
        property_id: inserted.id,
        image_url: imgUrl,
        is_cover: validated.image ? imgUrl === validated.image : index === 0,
        display_order: index
      }));
      await PropertyRepository.insertImages(imageRecords);
    }

    return mapDbPropertyToDto(inserted);
  }

  /**
   * Pausar o Reactivar inmueble
   */
  static async togglePause(idOrCode: string): Promise<string> {
    const prop = await PropertyRepository.findSafely(idOrCode);
    if (!prop) {
      const notFoundError: any = new Error('Inmueble no encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    if (prop.status_id === 2) {
      const badReqError: any = new Error(
        'La propiedad se encuentra en validación legal pendiente de aprobación por el Administrador. No puede ser pausada ni activada hasta su aprobación.'
      );
      badReqError.statusCode = 400;
      throw badReqError;
    }

    const nextStatusId = prop.status_id === 1 ? 3 : 1;
    const nextStatusText = nextStatusId === 1 ? 'Activo' : 'Pausado';

    const { error } = await PropertyRepository.updateStatus(prop.id, nextStatusId);
    if (error) throw new Error(error.message);

    return nextStatusText;
  }

  /**
   * Actualizar estado de aprobación del inmueble
   */
  static async updateStatus(idOrCode: string, targetStatus: string): Promise<{ status: string; statusId: number }> {
    const prop = await PropertyRepository.findSafely(idOrCode);
    if (!prop) {
      const notFoundError: any = new Error('Inmueble no encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const statusMap: Record<string, number> = {
      'Activo': 1,
      'Publicado': 1,
      'En Validación Legal': 2,
      'En Revisión Legal': 2,
      'Pendiente': 2,
      'Pausado': 3,
      'Cerrado': 4
    };

    const nextStatusId = statusMap[targetStatus] || 1;
    const { error } = await PropertyRepository.updateStatus(prop.id, nextStatusId);
    if (error) throw new Error(error.message);

    // Sincronizar órdenes de pago en memoria/repositorio
    const ordersMap = PaymentRepository.getOrdersMap();
    for (const [orderId, order] of ordersMap.entries()) {
      if (order.propertyId === prop.id || (prop.code && order.propertyId === prop.code)) {
        if (nextStatusId === 1) {
          order.status = 'aprobado';
          order.reviewedAt = new Date().toISOString();
        } else if (nextStatusId === 3 || nextStatusId === 4) {
          order.status = 'rechazado';
        }
        ordersMap.set(orderId, order);
      }
    }

    return { status: targetStatus, statusId: nextStatusId };
  }

  /**
   * REQ-13: Editar información de un inmueble publicado
   */
  static async updateProperty(idOrCode: string, validated: IUpdatePropertyDTO): Promise<IProperty | null> {
    const prop = await PropertyRepository.findSafely(idOrCode);
    if (!prop) {
      const notFoundError: any = new Error('Inmueble no encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (validated.title !== undefined) updatePayload.title = validated.title;
    if (validated.description !== undefined) updatePayload.description = validated.description;
    if (validated.category !== undefined) updatePayload.category = validated.category;
    if (validated.isNegotiable !== undefined) updatePayload.is_negotiable = validated.isNegotiable;
    if (validated.zone !== undefined) updatePayload.zone = validated.zone;
    if (validated.address !== undefined) updatePayload.address = validated.address;
    if (validated.latitude !== undefined) updatePayload.latitude = validated.latitude;
    if (validated.longitude !== undefined) updatePayload.longitude = validated.longitude;
    if (validated.bedrooms !== undefined) updatePayload.bedrooms = validated.bedrooms;
    if (validated.bathrooms !== undefined) updatePayload.bathrooms = validated.bathrooms;
    if (validated.areaSqm !== undefined) updatePayload.area_sqm = validated.areaSqm;
    if (validated.landAreaSqm !== undefined) updatePayload.land_area_sqm = validated.landAreaSqm;
    if (validated.parkingSpots !== undefined) updatePayload.parking_spots = validated.parkingSpots;
    if (validated.amenities !== undefined) updatePayload.amenities = validated.amenities;

    if (validated.type !== undefined) {
      updatePayload.type_id = validated.type === 'Anticrético' ? 1 : validated.type === 'Venta' ? 2 : 3;
    }

    if (validated.price !== undefined) {
      const cleanNumber = validated.price.replace(/[^0-9]/g, '');
      const numericPrice = parseFloat(cleanNumber);
      if (!isNaN(numericPrice) && numericPrice > 0) {
        updatePayload.price_amount = numericPrice;
        updatePayload.currency = validated.price.includes('Bs') ? 'BOB' : 'USD';
      }
    }

    if (validated.status !== undefined) {
      const statusMap: Record<string, number> = {
        'Activo': 1,
        'En Validación Legal': 2,
        'Pausado': 3,
        'Cerrado': 4
      };
      updatePayload.status_id = statusMap[validated.status] || 1;
    }

    const { error: updateErr } = await PropertyRepository.update(prop.id, updatePayload);
    if (updateErr) throw new Error(updateErr.message);

    // Actualizar galería de imágenes
    if (validated.gallery && validated.gallery.length > 0) {
      const newImages = validated.gallery.map((url, idx) => ({
        property_id: prop.id,
        image_url: url,
        is_cover: validated.image ? url === validated.image : idx === 0,
        display_order: idx
      }));
      await PropertyRepository.updateImages(prop.id, newImages);
    } else if (validated.image && validated.image.trim() !== '') {
      await PropertyRepository.updateImages(prop.id, [{
        property_id: prop.id,
        image_url: validated.image,
        is_cover: true,
        display_order: 0
      }]);
    }

    return await this.getPropertyById(prop.id);
  }

  /**
   * Eliminar publicación y sus dependencias
   */
  static async deleteProperty(idOrCode: string): Promise<{ title: string; id: string }> {
    const prop = await PropertyRepository.findSafely(idOrCode);
    if (!prop) {
      const notFoundError: any = new Error('Inmueble no encontrado');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    // 1. Limpiar órdenes de pago asociadas
    PaymentRepository.deleteOrdersByProperty(prop.id);
    if (prop.code) {
      PaymentRepository.deleteOrdersByProperty(prop.code);
    }

    // 2. Eliminar de la base de datos
    const { error } = await PropertyRepository.delete(prop.id);
    if (error) throw new Error(error.message);

    return { title: prop.title, id: idOrCode };
  }
}
