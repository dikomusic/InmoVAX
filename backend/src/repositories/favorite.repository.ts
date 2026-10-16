/**
 * Repositorio de Favoritos (Capa de Acceso a Datos - DAL)
 * InmoVAX Backend - Patrón Repositorio
 */

import { supabase } from '../config/supabase';

export class FavoriteRepository {
  /**
   * Obtener todos los inmuebles favoritos de un usuario con sus relaciones
   */
  static async findByUserId(userId: string) {
    return await supabase
      .from('favorites')
      .select(`
        created_at,
        property_id,
        user_id,
        properties (
          id,
          code,
          title,
          description,
          category,
          price_amount,
          currency,
          zone,
          city,
          address,
          type_id,
          status_id,
          bedrooms,
          bathrooms,
          area_sqm,
          amenities,
          created_at,
          property_images (image_url, is_cover)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  }

  /**
   * Guardar o actualizar un favorito
   */
  static async add(userId: string, propertyId: string) {
    return await supabase
      .from('favorites')
      .upsert({
        user_id: userId,
        property_id: propertyId,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id,property_id' })
      .select()
      .maybeSingle();
  }

  /**
   * Eliminar un favorito
   */
  static async remove(userId: string, propertyId: string) {
    return await supabase
      .from('favorites')
      .delete()
      .match({
        user_id: userId,
        property_id: propertyId
      });
  }

  /**
   * Verificar si un inmueble ya está en la lista de favoritos de un usuario
   */
  static async checkIsFavorite(userId: string, propertyId: string): Promise<boolean> {
    const { data } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    return Boolean(data);
  }
}
