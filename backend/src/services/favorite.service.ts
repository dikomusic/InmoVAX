/**
 * Servicio de Favoritos (Capa de Lógica de Negocio)
 * InmoVAX Backend - Patrón Servicio
 */

import { FavoriteRepository } from '../repositories/favorite.repository';
import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { IFavoriteItem, IFavoriteResponse } from '../interfaces/favorite.interface';

const defaultImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
];

const typeMap: Record<number, string> = {
  1: 'Anticrético',
  2: 'Venta',
  3: 'Alquiler'
};

export class FavoriteService {
  /**
   * Resolver UUID del usuario a partir de UUID o correo
   */
  static async resolveUserId(identifier: string): Promise<string | null> {
    const clean = identifier.trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
    if (isUuid) return clean;

    const profile = await UserRepository.findByEmail(clean);
    return profile?.id || null;
  }

  /**
   * Resolver UUID de la propiedad a partir de UUID, código (PROP-XXX) o slug
   */
  static async resolvePropertyId(propIdentifier: string): Promise<string | null> {
    const clean = decodeURIComponent(propIdentifier).trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
    if (isUuid) return clean;

    const found = await PropertyRepository.findSafely(clean);
    return found?.id || null;
  }

  /**
   * REQ-32: Obtener listado formateado de favoritos de un usuario
   */
  static async getUserFavorites(userIdentifier: string): Promise<IFavoriteResponse> {
    const userId = await this.resolveUserId(userIdentifier);
    if (!userId) {
      return { total: 0, favorites: [], propertyIds: [] };
    }

    const { data: favs, error } = await FavoriteRepository.findByUserId(userId);
    if (error || !favs) {
      throw new Error(`Error al consultar favoritos: ${error?.message}`);
    }

    const propertyIds: string[] = [];

    const mappedFavorites: IFavoriteItem[] = favs
      .filter((f: any) => f.properties)
      .map((f: any, index: number) => {
        const p: any = f.properties;
        const pId = p.id;
        const pCode = p.code || `PROP-${index + 100}`;
        propertyIds.push(pId);
        if (pCode) propertyIds.push(pCode);

        let imgUrl = defaultImages[index % defaultImages.length];
        if (Array.isArray(p.property_images) && p.property_images.length > 0) {
          const featured = p.property_images.find((pi: any) => pi.is_cover);
          imgUrl = (featured || p.property_images[0]).image_url || imgUrl;
        }

        const currencySymbol = p.currency === 'BOB' ? 'Bs. ' : '$us ';
        const priceFormatted = `${currencySymbol}${Number(p.price_amount || 0).toLocaleString('es-BO')}`;

        return {
          id: pId,
          code: pCode,
          title: p.title || 'Propiedad en InmoVAX',
          price: priceFormatted,
          location: p.zone || p.city || p.address || 'La Paz',
          imageUrl: imgUrl,
          contractType: typeMap[p.type_id] || 'Anticrético',
          href: `/propiedad/${pCode}`,
          addedAt: f.created_at,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          areaSqm: p.area_sqm
        };
      });

    return {
      total: mappedFavorites.length,
      favorites: mappedFavorites,
      propertyIds
    };
  }

  /**
   * REQ-31: Guardar un inmueble en favoritos
   */
  static async addFavorite(userIdentifier: string, propIdentifier: string) {
    const userId = await this.resolveUserId(userIdentifier);
    if (!userId) {
      const err: any = new Error('No se encontró el usuario en InmoVAX. Inicie sesión para guardar favoritos.');
      err.statusCode = 404;
      throw err;
    }

    const propertyId = await this.resolvePropertyId(propIdentifier);
    if (!propertyId) {
      const err: any = new Error('El inmueble seleccionado no existe o ya no está disponible.');
      err.statusCode = 404;
      throw err;
    }

    const { data, error } = await FavoriteRepository.add(userId, propertyId);
    if (error) {
      throw new Error(`Error al guardar en favoritos: ${error.message}`);
    }

    return data;
  }

  /**
   * REQ-33: Eliminar inmueble de favoritos
   */
  static async removeFavorite(userIdentifier: string, propIdentifier: string) {
    const userId = await this.resolveUserId(userIdentifier);
    const propertyId = await this.resolvePropertyId(propIdentifier);

    if (!userId || !propertyId) {
      return; // Idempotente
    }

    const { error } = await FavoriteRepository.remove(userId, propertyId);
    if (error) {
      throw new Error(`Error al eliminar de favoritos: ${error.message}`);
    }
  }

  /**
   * Verificar si un inmueble es favorito de un usuario
   */
  static async checkIsFavorite(userIdentifier: string, propIdentifier: string): Promise<boolean> {
    const userId = await this.resolveUserId(userIdentifier);
    const propertyId = await this.resolvePropertyId(propIdentifier);

    if (!userId || !propertyId) return false;

    return await FavoriteRepository.checkIsFavorite(userId, propertyId);
  }
}
