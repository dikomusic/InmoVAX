/**
 * Modelos de Entrada y Validación Zod para Favoritos
 * InmoVAX Backend - Capa de Modelos (Zod)
 */

import { z } from 'zod';

export const addFavoriteSchema = z.object({
  userId: z.string().min(1, 'El identificador de usuario es requerido'),
  propertyId: z.string().min(1, 'El identificador del inmueble es requerido')
});

export const removeFavoriteSchema = z.object({
  userId: z.string().optional(),
  propertyId: z.string().optional()
});

export type AddFavoriteModel = z.infer<typeof addFavoriteSchema>;
export type RemoveFavoriteModel = z.infer<typeof removeFavoriteSchema>;
