/**
 * Controlador de Favoritos
 * InmoVAX Backend - Patrón Controlador (Capa de Presentación / HTTP)
 */

import { Context } from 'hono';
import { z } from 'zod';
import { FavoriteService } from '../services/favorite.service';
import { addFavoriteSchema } from '../models/favorite.model';

export class FavoriteController {
  /**
   * GET /api/favorites: Consultar lista de favoritos
   */
  static async getFavorites(c: Context) {
    const queryUser = c.req.query('userId') || c.req.query('email') || c.req.header('x-user-email') || '';

    if (!queryUser) {
      return c.json({
        success: false,
        error: 'El identificador de usuario (userId o email) es requerido para consultar favoritos.'
      }, 400);
    }

    try {
      const result = await FavoriteService.getUserFavorites(queryUser);
      return c.json({
        success: true,
        total: result.total,
        favorites: result.favorites,
        propertyIds: result.propertyIds
      });
    } catch (err: any) {
      return c.json({
        success: false,
        error: err.message || 'Error al consultar favoritos.',
        favorites: [],
        propertyIds: []
      }, 500);
    }
  }

  /**
   * POST /api/favorites: Guardar inmueble en favoritos
   */
  static async addFavorite(c: Context) {
    try {
      const body = await c.req.json();
      const validated = addFavoriteSchema.parse(body);
      const data = await FavoriteService.addFavorite(validated.userId, validated.propertyId);

      return c.json({
        success: true,
        message: 'Inmueble guardado en tus favoritos exitosamente.',
        data
      }, 201);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({
          success: false,
          error: err.errors[0]?.message || 'Datos de favorito inválidos.'
        }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message || 'Error al agregar a favoritos.' }, status);
    }
  }

  /**
   * DELETE /api/favorites/:propertyId?: Eliminar inmueble de favoritos
   */
  static async removeFavorite(c: Context) {
    try {
      const paramProp = c.req.param('propertyId') || '';
      const queryUser = c.req.query('userId') || c.req.query('email') || '';
      const queryProp = c.req.query('propertyId') || '';

      let body: any = {};
      try {
        body = await c.req.json();
      } catch {}

      const targetUser = body.userId || queryUser;
      const targetProp = paramProp || body.propertyId || queryProp;

      if (!targetUser || !targetProp) {
        return c.json({
          success: false,
          error: 'Se requiere userId y propertyId para eliminar de favoritos.'
        }, 400);
      }

      await FavoriteService.removeFavorite(targetUser, targetProp);

      return c.json({
        success: true,
        message: 'Inmueble eliminado de favoritos exitosamente.'
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message || 'Error al eliminar de favoritos.' }, 500);
    }
  }

  /**
   * GET /api/favorites/check: Verificar si una propiedad es favorita
   */
  static async checkFavorite(c: Context) {
    const user = c.req.query('userId') || c.req.query('email') || '';
    const prop = c.req.query('propertyId') || '';

    if (!user || !prop) {
      return c.json({ success: true, isFavorite: false });
    }

    try {
      const isFavorite = await FavoriteService.checkIsFavorite(user, prop);
      return c.json({ success: true, isFavorite });
    } catch {
      return c.json({ success: true, isFavorite: false });
    }
  }
}
