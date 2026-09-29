/**
 * Cliente API para Gestión de Favoritos en InmoVAX
 * Conecta con el Backend Bun (http://localhost:4000/api/favorites) y Supabase PostgreSQL (public.favorites)
 * REQ-31: Guardar inmueble en favoritos
 * REQ-32: Consultar lista de inmuebles favoritos
 * REQ-33: Eliminar inmueble de favoritos
 */

import { FavoriteItem } from './frontendStore';

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000/api';

export interface FavoritesResponse {
  success: boolean;
  total: number;
  favorites: FavoriteItem[];
  propertyIds: string[];
  error?: string;
}

/**
 * REQ-32: Consultar lista de favoritos del usuario desde Supabase
 */
export async function fetchUserFavorites(userIdentifier: string): Promise<FavoritesResponse> {
  try {
    const clean = encodeURIComponent(userIdentifier.trim().toLowerCase());
    const res = await fetch(`${API_BASE}/favorites?userId=${clean}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, total: 0, favorites: [], propertyIds: [], error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return {
      success: true,
      total: data.total || 0,
      favorites: data.favorites || [],
      propertyIds: data.propertyIds || []
    };
  } catch (err: any) {
    return {
      success: false,
      total: 0,
      favorites: [],
      propertyIds: [],
      error: err?.message || 'Error de conexión'
    };
  }
}

/**
 * REQ-31: Guardar inmueble en la tabla public.favorites de Supabase
 */
export async function addFavoriteApi(userIdentifier: string, propertyIdentifier: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userIdentifier.trim().toLowerCase(),
        propertyId: propertyIdentifier.trim()
      })
    });

    const data = await res.json().catch(() => ({}));
    return res.ok && data.success;
  } catch {
    return false;
  }
}

/**
 * REQ-33: Eliminar inmueble de la tabla public.favorites de Supabase
 */
export async function removeFavoriteApi(userIdentifier: string, propertyIdentifier: string): Promise<boolean> {
  try {
    const cleanProp = encodeURIComponent(propertyIdentifier.trim());
    const cleanUser = encodeURIComponent(userIdentifier.trim().toLowerCase());
    const res = await fetch(`${API_BASE}/favorites/${cleanProp}?userId=${cleanUser}`, {
      method: 'DELETE'
    });

    const data = await res.json().catch(() => ({}));
    return res.ok && data.success;
  } catch {
    return false;
  }
}

/**
 * Verificar si un inmueble específico está en favoritos del usuario
 */
export async function checkIsFavoriteApi(userIdentifier: string, propertyIdentifier: string): Promise<boolean> {
  try {
    const cleanProp = encodeURIComponent(propertyIdentifier.trim());
    const cleanUser = encodeURIComponent(userIdentifier.trim().toLowerCase());
    const res = await fetch(`${API_BASE}/favorites/check?userId=${cleanUser}&propertyId=${cleanProp}`, {
      cache: 'no-store'
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.isFavorite);
  } catch {
    return false;
  }
}
