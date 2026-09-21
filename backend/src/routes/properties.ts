import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';
import { config } from '../config/env';

export const propertiesRouter = new Hono();

// Esquema Zod de Validación Estricta para Inmuebles
const propertyInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  description: z.string().optional(),
  zone: z.string().min(2, 'La zona es requerida').max(100),
  address: z.string().optional(),
  type: z.preprocess((val) => {
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase();
      if (s === 'anticretico' || s === 'anticrético') return 'Anticrético';
      if (s === 'venta') return 'Venta';
      if (s === 'alquiler') return 'Alquiler';
    }
    return val;
  }, z.enum(['Anticrético', 'Venta', 'Alquiler'])),
  price: z.string().min(1, 'El precio es requerido'),
  folioReal: z.string().min(3, 'El Folio Real es requerido'),
  image: z.string().optional().or(z.literal('')),
  gallery: z.array(z.string()).optional(),
  authorEmail: z.string().email('Correo de autor inválido'),
  authorName: z.string().min(2),
  assignedAdvisor: z.string().optional().default('Lic. Carlos Vega'),
  bedrooms: z.number().int().nonnegative().optional().default(3),
  bathrooms: z.number().int().nonnegative().optional().default(2),
  areaSqm: z.number().positive().optional().default(120),
  status: z.enum(['Activo', 'En Validación Legal', 'Pausado', 'Cerrado']).optional()
});

// Helper de mapeo desde Supabase a formato unificado
function mapDbProperty(dbProp: any) {
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

  const gallery: string[] = Array.isArray(dbProp.property_images)
    ? dbProp.property_images.map((img: any) => img.image_url).filter(Boolean)
    : [];

  const image = gallery[0] || dbProp.image || '';

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
    assignedAdvisor: 'Lic. Carlos Vega',
    image,
    gallery,
    habitaciones: dbProp.bedrooms !== null && dbProp.bedrooms !== undefined ? dbProp.bedrooms : undefined,
    banos: dbProp.bathrooms !== null && dbProp.bathrooms !== undefined ? dbProp.bathrooms : undefined,
    metros: dbProp.area_sqm !== null && dbProp.area_sqm !== undefined ? Number(dbProp.area_sqm) : undefined,
    href: `/propiedad/${code}`,
    datePublished: dbProp.created_at ? 'Publicado recientemente' : 'Publicado hace 4 días',
    authorEmail: dbProp.profiles?.email || 'vendedor@inmovax.com',
    authorName: dbProp.profiles?.full_name || 'Arq. Gonzalo Benítez'
  };
}

// Mapa de compatibilidad con IDs anteriores
const legacyCodeMap: Record<string, string> = {
  'prop-sopocachi-01': 'PROP-101',
  'prop-calacoto-01': 'PROP-102',
  'prop-casa-calacoto-02': 'PROP-103',
  'prop-oficina-miraflores-01': 'PROP-104',
};

// Helper seguro para buscar propiedad por id (UUID), code o slug de título
async function findPropertySafely(idOrCode: string) {
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

  // Fallback: si el identificador es un slug (ej: "departamento-en-sopocachi,-la-paz")
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

// 1. GET /api/properties: Listar inmuebles activos y gestionados
propertiesRouter.get('/', async (c) => {
  const type = c.req.query('type');
  const zone = c.req.query('zone');
  const q = c.req.query('q')?.toLowerCase();
  const statusParam = c.req.query('status'); // 'active' o por defecto todos [1, 2, 3]

  try {
    let query = supabase
      .from('properties')
      .select('*, property_images(image_url), profiles!properties_user_id_fkey(email, full_name)')
      .order('created_at', { ascending: false });

    if (statusParam === 'active') {
      query = query.eq('status_id', 1);
    } else {
      // Devuelve activos, en validación legal y pausados para mantener sincronizado el store
      query = query.in('status_id', [1, 2, 3]);
    }

    const { data, error } = await query;

    if (!error && data) {
      let mapped = data.map(mapDbProperty);

      if (type && type !== 'todos') {
        mapped = mapped.filter(p => p.type.toLowerCase() === type.toLowerCase());
      }
      if (zone) {
        mapped = mapped.filter(p => p.zone.toLowerCase().includes(zone.toLowerCase()));
      }
      if (q) {
        mapped = mapped.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.zone.toLowerCase().includes(q) ||
          p.folioReal.toLowerCase().includes(q)
        );
      }

      return c.json({
        source: 'supabase-postgresql',
        total: mapped.length,
        properties: mapped
      });
    }
  } catch (err) {
    console.error('Error fetching properties from Supabase:', err);
  }

  return c.json({ source: 'supabase-error', total: 0, properties: [] });
});

// 2. GET /api/properties/seller/:email: Inmuebles del vendedor
propertiesRouter.get('/seller/:email', async (c) => {
  const email = decodeURIComponent(c.req.param('email')).toLowerCase();

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(image_url), profiles!properties_user_id_fkey!inner(email, full_name)')
      .eq('profiles.email', email)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map(mapDbProperty);
      return c.json({
        source: 'supabase-postgresql',
        sellerEmail: email,
        total: mapped.length,
        properties: mapped
      });
    }
  } catch (err) {
    console.error('Error fetching seller properties:', err);
  }

  return c.json({ source: 'supabase-postgresql', sellerEmail: email, total: 0, properties: [] });
});

// 3. POST /api/properties: Registrar nuevo inmueble
propertiesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = propertyInputSchema.parse(body);

    // Obtener o crear id de perfil del vendedor en Supabase
    let userId = 'b0000000-0000-0000-0000-000000000001';
    const emailLower = validated.authorEmail.toLowerCase().trim();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', emailLower)
      .maybeSingle();

    if (profile) {
      userId = profile.id;
    } else {
      const newUserId = crypto.randomUUID();
      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          email: emailLower,
          full_name: validated.authorName || 'Vendedor InmoVAX',
          role_id: 3, // 3 = Vendedor
          is_verified: true
        })
        .select('id')
        .maybeSingle();

      if (newProfile && !profileErr) {
        userId = newProfile.id;
      }
    }

    // Extraer monto numérico del precio (evitando que el punto de "Bs." se tome como decimal)
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
    const statusId = validated.status ? (statusMap[validated.status] || 1) : 1;

    // Evitar colisión de clave única de Folio Real
    let folioRealToInsert = validated.folioReal;
    const { data: existingFolio } = await supabase
      .from('properties')
      .select('id')
      .eq('folio_real', folioRealToInsert)
      .maybeSingle();

    if (existingFolio) {
      folioRealToInsert = `${folioRealToInsert}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const { data: inserted, error } = await supabase
      .from('properties')
      .insert({
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
        area_sqm: validated.areaSqm
      })
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    // Insertar imágenes (múltiples o individual)
    const imagesToInsert = validated.gallery && validated.gallery.length > 0 
      ? validated.gallery 
      : (validated.image && validated.image.trim() !== '' ? [validated.image] : []);

    if (imagesToInsert.length > 0 && inserted) {
      const imageRecords = imagesToInsert.map((imgUrl, index) => ({
        property_id: inserted.id,
        image_url: imgUrl,
        is_cover: index === 0
      }));
      await supabase.from('property_images').insert(imageRecords);
    }

    return c.json({
      success: true,
      message: 'Inmueble registrado exitosamente en Supabase para auditoría legal con Folio Real',
      property: inserted
    }, 201);
  } catch (error) {
    console.error('POST /api/properties error details:', error);
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: 'Validación fallida', details: error.errors }, 400);
    }
    return c.json({ success: false, error: 'Error al procesar el inmueble', details: String(error) }, 500);
  }
});

// 3.5 POST /api/properties/upload: Subir imagen a Supabase Storage
propertiesRouter.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
      });

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return c.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// 4. PATCH /api/properties/:id/toggle-pause: Pausar o Reactivar inmueble
propertiesRouter.patch('/:id/toggle-pause', async (c) => {
  const idOrCode = c.req.param('id');
  const prop = await findPropertySafely(idOrCode);

  if (!prop) {
    return c.json({ success: false, error: 'Inmueble no encontrado' }, 404);
  }

  const nextStatusId = prop.status_id === 1 ? 3 : 1; // 1 = Activo, 3 = Pausado
  const nextStatusText = nextStatusId === 1 ? 'Activo' : 'Pausado';

  const { error } = await supabase
    .from('properties')
    .update({ status_id: nextStatusId })
    .eq('id', prop.id);

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  return c.json({
    success: true,
    message: `Inmueble cambiado a estado: ${nextStatusText}`,
    status: nextStatusText
  });
});

// 5. DELETE /api/properties/:id: Eliminar publicación
propertiesRouter.delete('/:id', async (c) => {
  const idOrCode = c.req.param('id');
  const prop = await findPropertySafely(idOrCode);

  if (!prop) {
    return c.json({ success: false, error: 'Inmueble no encontrado' }, 404);
  }

  // Eliminar imágenes y el inmueble (las demás tablas tienen ON DELETE CASCADE)
  await supabase.from('property_images').delete().eq('property_id', prop.id);
  const { error } = await supabase.from('properties').delete().eq('id', prop.id);

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  return c.json({
    success: true,
    message: `Publicación "${prop.title}" eliminada con éxito de Supabase`,
    deletedId: idOrCode
  });
});

// 6. GET /api/properties/:id: Obtener detalle completo de un inmueble individual
propertiesRouter.get('/:id', async (c) => {
  const idOrCode = c.req.param('id');
  const found = await findPropertySafely(idOrCode);

  if (!found) {
    return c.json({ success: false, error: 'Inmueble no encontrado en la base de datos' }, 404);
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(image_url), profiles!properties_user_id_fkey(email, full_name), legal_audits(*)')
    .eq('id', found.id)
    .single();

  if (error || !data) {
    return c.json({ success: false, error: 'Inmueble no encontrado' }, 404);
  }

  return c.json({
    success: true,
    source: 'supabase-postgresql',
    property: mapDbProperty(data)
  });
});

// 7. POST /api/properties/register-profile: Registrar o sincronizar perfil de usuario en Supabase (Google / Correo)
propertiesRouter.post('/register-profile', async (c) => {
  try {
    const body = await c.req.json();
    const email = body.email;
    if (!email) {
      return c.json({ success: false, error: 'Email requerido' }, 400);
    }

    const emailLower = email.toLowerCase().trim();
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', emailLower)
      .maybeSingle();

    if (existing) {
      return c.json({ success: true, profile: existing, message: 'Usuario ya existente' });
    }

    const newUserId = crypto.randomUUID();
    const { data: inserted, error } = await supabase
      .from('profiles')
      .insert({
        id: newUserId,
        email: emailLower,
        full_name: body.full_name || emailLower.split('@')[0],
        phone: body.phone || null,
        avatar_url: body.avatar_url || null,
        role_id: body.role_id || 2, // 2 = Comprador / Cliente por defecto
        is_verified: true
      })
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, profile: inserted, message: 'Perfil registrado en Supabase' });
  } catch (err) {
    return c.json({ success: false, error: String(err) }, 500);
  }
});

