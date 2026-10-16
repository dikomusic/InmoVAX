/**
 * Rutas de Inmuebles Favoritos
 * InmoVAX Backend - Enrutador Delgado (Delegación a Controladores)
 */

import { Hono } from 'hono';
import { FavoriteController } from '../controllers/favorite.controller';

export const favoritesRouter = new Hono();

// Consultar lista y verificar estado
favoritesRouter.get('/', FavoriteController.getFavorites);
favoritesRouter.get('/check', FavoriteController.checkFavorite);

// Agregar y eliminar de favoritos
favoritesRouter.post('/', FavoriteController.addFavorite);
favoritesRouter.delete('/:propertyId?', FavoriteController.removeFavorite);
