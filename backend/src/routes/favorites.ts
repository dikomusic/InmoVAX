import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';

export const favoritesRouter = new Hono();

// Helper para resolver el user_id de Supabase a partir de UUID o Correo Electrónico
async function resolveUserId(identifier: string): Promise<string | null> {
  const clean = identifier.trim().toLowerCase();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

  if (isUuid) {
    return clean;
  }

  // Buscar por email en profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', clean)
    .maybeSingle();

  if (profile) {
    return profile.id;
  }

  // Buscar en auth.users
  const { data: authList } = await supabase.auth.admin.listUsers();
  const matched = authList?.users?.find(u => u.email?.toLowerCase() === clean);
  if (matched) {
    return matched.id;
  }

  return null;
}

// Helper para resolver el property_id (UUID) a partir de UUID o código/slug (ej: "PROP-101")
async function resolvePropertyId(propIdentifier: string): Promise<string | null> {
  const clean = decodeURIComponent(propIdentifier).trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

  if (isUuid) {
    return clean;
  }

  // Buscar por code
  const { data: byCode } = await supabase
    .from('properties')
    .select('id')
    .ilike('code', clean)
    .maybeSingle();

  if (byCode) {
    return byCode.id;
  }

  // Buscar por slug o parte del título
  const titleClean = clean.replace(/-/g, ' ').replace(/[,%]/g, '').trim();
  if (titleClean.length >= 4) {
    const { data: byTitle } = await supabase
      .from('properties')
      .select('id')
      .ilike('title', `%${titleClean.slice(0, 15)}%`)
      .limit(1)
      .maybeSingle();

    if (byTitle) {
      return byTitle.id;
    }
  }

  return null;
}

/**
 * REQ-32: Consultar lista de inmuebles favoritos de un usuario
 * GET /api/favorites?userId=... o ?email=...
 */
favoritesRouter.get('/', async (c) => {
  try {
    const queryUser = c.req.query('userId') || c.req.query('email') || c.req.header('x-user-email');

    if (!queryUser) {
      return c.json({
        success: false,
        error: 'El identificador de usuario (userId o email) es requerido para consultar favoritos.'
      }, 400);
    }

    const userId = await resolveUserId(queryUser);
    if (!userId) {
      return c.json({
        success: true,
        total: 0,
        favorites: [],
        propertyIds: []
      });
    }

    // Consulta con join a la tabla properties
    const { data: favs, error } = await supabase
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

    if (error) {
      return c.json({
        success: false,
        error: `Error al consultar favoritos: ${error.message}`,
        favorites: [],
        propertyIds: []
      }, 500);
    }

    const typeMap: Record<number, string> = {
      1: 'Anticrético',
      2: 'Venta',
      3: 'Alquiler'
    };

    const defaultImages = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
    ];

    const propertyIds: string[] = [];

    const mappedFavorites = (favs || [])
      .filter(f => f.properties)
      .map((f, index) => {
        const p: any = f.properties;
        const pId = p.id;
        const pCode = p.code || `PROP-${index + 100}`;
        propertyIds.push(pId);
        if (pCode) propertyIds.push(pCode);

        // Imagen destacada
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

    return c.json({
      success: true,
      total: mappedFavorites.length,
      favorites: mappedFavorites,
      propertyIds
    });

  } catch (err: any) {
    return c.json({
      success: false,
      error: err.message || 'Error interno al consultar favoritos.'
    }, 500);
  }
});

const addFavoriteSchema = z.object({
  userId: z.string().min(1, 'El identificador de usuario es requerido'),
  propertyId: z.string().min(1, 'El identificador del inmueble es requerido')
});

/**
 * REQ-31: Guardar inmueble en favoritos
 * POST /api/favorites
 */
favoritesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = addFavoriteSchema.parse(body);

    const resolvedUser = await resolveUserId(validated.userId);
    if (!resolvedUser) {
      return c.json({
        success: false,
        error: 'No se encontró el usuario en InmoVAX. Inicie sesión para guardar favoritos.'
      }, 404);
    }

    const resolvedProp = await resolvePropertyId(validated.propertyId);
    if (!resolvedProp) {
      return c.json({
        success: false,
        error: 'El inmueble seleccionado no existe o ya no está disponible.'
      }, 404);
    }

    // Insertar o actualizar registro en public.favorites
    const { data, error } = await supabase
      .from('favorites')
      .upsert({
        user_id: resolvedUser,
        property_id: resolvedProp,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id,property_id' })
      .select();

    if (error) {
      return c.json({
        success: false,
        error: `Error al guardar en favoritos: ${error.message}`
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Inmueble guardado en tus favoritos exitosamente.',
      data: data?.[0]
    }, 201);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return c.json({
        success: false,
        error: err.errors[0]?.message || 'Datos de favorito inválidos.'
      }, 400);
    }
    return c.json({
      success: false,
      error: err.message || 'Error al agregar a favoritos.'
    }, 500);
  }
});

/**
 * REQ-33: Eliminar inmueble de favoritos
 * DELETE /api/favorites/:propertyId?userId=... o DELETE con body { userId, propertyId }
 */
favoritesRouter.delete('/:propertyId?', async (c) => {
  try {
    const paramProp = c.req.param('propertyId');
    const queryUser = c.req.query('userId') || c.req.query('email');
    const queryProp = c.req.query('propertyId');

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

    const resolvedUser = await resolveUserId(targetUser);
    const resolvedProp = await resolvePropertyId(targetProp);

    if (!resolvedUser || !resolvedProp) {
      // Si no existe, consideramos la eliminación idempotente
      return c.json({
        success: true,
        message: 'Inmueble removido de favoritos.'
      });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({
        user_id: resolvedUser,
        property_id: resolvedProp
      });

    if (error) {
      return c.json({
        success: false,
        error: `Error al eliminar de favoritos: ${error.message}`
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Inmueble eliminado de favoritos exitosamente.'
    });

  } catch (err: any) {
    return c.json({
      success: false,
      error: err.message || 'Error al eliminar de favoritos.'
    }, 500);
  }
});

/**
 * GET /api/favorites/check: Verificar si una propiedad específica es favorita de un usuario
 */
favoritesRouter.get('/check', async (c) => {
  try {
    const user = c.req.query('userId') || c.req.query('email');
    const prop = c.req.query('propertyId');

    if (!user || !prop) {
      return c.json({ success: true, isFavorite: false });
    }

    const resolvedUser = await resolveUserId(user);
    const resolvedProp = await resolvePropertyId(prop);

    if (!resolvedUser || !resolvedProp) {
      return c.json({ success: true, isFavorite: false });
    }

    const { data } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', resolvedUser)
      .eq('property_id', resolvedProp)
      .maybeSingle();

    return c.json({
      success: true,
      isFavorite: Boolean(data)
    });
  } catch {
    return c.json({ success: true, isFavorite: false });
  }
});
