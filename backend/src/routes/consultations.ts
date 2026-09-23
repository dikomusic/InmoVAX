import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';

export const consultationsRouter = new Hono();

export interface ChatMessageDto {
  id: string;
  senderEmail: string;
  senderName: string;
  senderRole: 'comprador' | 'vendedor';
  text: string;
  timestamp: string;
}

export interface ConsultationDto {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  propertyImage: string;
  propertyHref?: string;
  sellerEmail: string;
  sellerName: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  status: 'pendiente' | 'respondido';
  lastMessage: string;
  date: string;
  messages: ChatMessageDto[];
  unreadBySeller: number;
  unreadByBuyer: number;
}

function formatDate(isoStr?: string): string {
  if (!isoStr) return 'Reciente';
  try {
    const d = new Date(isoStr);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Hoy, ${time}`;
    }
    return `${d.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}, ${time}`;
  } catch {
    return 'Reciente';
  }
}

const newConsultationSchema = z.object({
  id: z.string().optional(),
  propertyId: z.string().optional(),
  propertyTitle: z.string().min(1, 'El título de la propiedad es requerido'),
  propertyLocation: z.string().optional().default('La Paz, Bolivia'),
  propertyPrice: z.string().optional().default('A convenir'),
  propertyImage: z.string().optional().default(''),
  propertyHref: z.string().optional(),
  sellerEmail: z.string().email().optional().default('vendedor@inmovax.com'),
  sellerName: z.string().optional().default('Propietario'),
  buyerEmail: z.string().min(3, 'Email del comprador requerido'),
  buyerName: z.string().min(1, 'Nombre del comprador requerido'),
  buyerPhone: z.string().optional(),
  messageText: z.string().min(1, 'El mensaje no puede estar vacío'),
});

// Helper para obtener UUID de la propiedad en Supabase
async function resolvePropertyUuid(rawIdOrCode?: string): Promise<{ id: string; code?: string; inquiries_count?: number } | null> {
  if (!rawIdOrCode) return null;
  const decoded = decodeURIComponent(rawIdOrCode).trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded);

  try {
    let query = supabase.from('properties').select('id, code, inquiries_count');
    if (isUuid) {
      query = query.eq('id', decoded);
    } else {
      query = query.ilike('code', decoded);
    }
    const { data } = await query.maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}

// 1. POST /api/consultations: Registrar consulta Comprador -> Vendedor en Supabase PostgreSQL
consultationsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = newConsultationSchema.parse(body);

    const now = new Date();
    const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = now.toISOString();

    const cleanSellerEmail = validated.sellerEmail.toLowerCase().trim();
    const cleanBuyerEmail = validated.buyerEmail.toLowerCase().trim();

    // 1. Resolver propiedad en Supabase e incrementar inquiries_count
    const propRecord = await resolvePropertyUuid(validated.propertyId);
    if (propRecord) {
      const nextCount = (propRecord.inquiries_count || 0) + 1;
      await supabase.from('properties').update({ inquiries_count: nextCount }).eq('id', propRecord.id);
    }

    const targetPropertyId = propRecord ? propRecord.id : null;

    // 2. Buscar si ya existe la consulta en Supabase
    let existingId: string | null = null;
    let existingUnread = 0;

    if (targetPropertyId) {
      const { data: existing } = await supabase
        .from('consultations')
        .select('id, unread_by_seller')
        .eq('property_id', targetPropertyId)
        .eq('buyer_email', cleanBuyerEmail)
        .maybeSingle();

      if (existing) {
        existingId = existing.id;
        existingUnread = existing.unread_by_seller || 0;
      }
    }

    const consultationId = existingId || validated.id || `cons-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    if (existingId) {
      // Actualizar conversación existente en Supabase
      const { error: updErr } = await supabase
        .from('consultations')
        .update({
          last_message: validated.messageText,
          updated_at: nowIso,
          status: 'pendiente',
          unread_by_seller: existingUnread + 1,
        })
        .eq('id', consultationId);

      if (updErr) {
        return c.json({ success: false, error: updErr.message }, 500);
      }
    } else {
      // Insertar nueva conversación en Supabase
      const { error: insErr } = await supabase
        .from('consultations')
        .insert({
          id: consultationId,
          property_id: targetPropertyId,
          property_title: validated.propertyTitle,
          property_location: validated.propertyLocation,
          property_price: validated.propertyPrice,
          property_image: validated.propertyImage,
          property_href: validated.propertyHref || (validated.propertyId ? `/propiedad/${validated.propertyId}` : null),
          seller_email: cleanSellerEmail,
          seller_name: validated.sellerName,
          buyer_email: cleanBuyerEmail,
          buyer_name: validated.buyerName,
          buyer_phone: validated.buyerPhone || null,
          status: 'pendiente',
          last_message: validated.messageText,
          unread_by_seller: 1,
          unread_by_buyer: 0,
          created_at: nowIso,
          updated_at: nowIso,
        });

      if (insErr) {
        return c.json({ success: false, error: insErr.message }, 500);
      }
    }

    // 3. Insertar el mensaje en Supabase
    const { error: msgErr } = await supabase
      .from('consultation_messages')
      .insert({
        id: messageId,
        consultation_id: consultationId,
        sender_email: cleanBuyerEmail,
        sender_name: validated.buyerName,
        sender_role: 'comprador',
        text: validated.messageText,
        timestamp: timeNow,
        created_at: nowIso,
      });

    if (msgErr) {
      return c.json({ success: false, error: msgErr.message }, 500);
    }

    // 4. Retornar consulta estructurada
    const dto: ConsultationDto = {
      id: consultationId,
      propertyId: validated.propertyId,
      propertyTitle: validated.propertyTitle,
      propertyLocation: validated.propertyLocation,
      propertyPrice: validated.propertyPrice,
      propertyImage: validated.propertyImage,
      propertyHref: validated.propertyHref || `/propiedad/${validated.propertyId}`,
      sellerEmail: cleanSellerEmail,
      sellerName: validated.sellerName,
      buyerEmail: cleanBuyerEmail,
      buyerName: validated.buyerName,
      buyerPhone: validated.buyerPhone,
      status: 'pendiente',
      lastMessage: validated.messageText,
      date: formatDate(nowIso),
      messages: [
        {
          id: messageId,
          senderEmail: cleanBuyerEmail,
          senderName: validated.buyerName,
          senderRole: 'comprador',
          text: validated.messageText,
          timestamp: timeNow,
        },
      ],
      unreadBySeller: existingUnread + 1,
      unreadByBuyer: 0,
    };

    return c.json({
      success: true,
      message: 'Consulta registrada exitosamente en Supabase PostgreSQL',
      consultation: dto,
    }, 201);
  } catch (error: any) {
    console.error('POST /api/consultations error:', error);
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: 'Validación fallida', details: error.errors }, 400);
    }
    return c.json({ success: false, error: error.message || 'Error al procesar la consulta en Supabase' }, 500);
  }
});

// 2. GET /api/consultations/seller/:email: Listar consultas desde Supabase
consultationsRouter.get('/seller/:email', async (c) => {
  const sellerEmail = decodeURIComponent(c.req.param('email')).toLowerCase().trim();

  try {
    // 1. Obtener consultas de Supabase por email de vendedor o fallback demo
    const { data: consRows, error: consErr } = await supabase
      .from('consultations')
      .select('*')
      .or(`seller_email.ilike.${sellerEmail},seller_email.ilike.vendedor@inmovax.com`)
      .order('updated_at', { ascending: false });

    if (consErr) {
      return c.json({ success: false, error: consErr.message, total: 0, consultations: [] });
    }

    if (!consRows || consRows.length === 0) {
      return c.json({ success: true, total: 0, consultations: [] });
    }

    // 2. Obtener mensajes asociados desde Supabase
    const consIds = consRows.map((r) => r.id);
    const { data: msgRows } = await supabase
      .from('consultation_messages')
      .select('*')
      .in('consultation_id', consIds)
      .order('created_at', { ascending: true });

    const messagesByConsId: Record<string, ChatMessageDto[]> = {};
    if (msgRows) {
      for (const m of msgRows) {
        if (!messagesByConsId[m.consultation_id]) {
          messagesByConsId[m.consultation_id] = [];
        }
        messagesByConsId[m.consultation_id].push({
          id: m.id,
          senderEmail: m.sender_email,
          senderName: m.sender_name,
          senderRole: m.sender_role as 'comprador' | 'vendedor',
          text: m.text,
          timestamp: m.timestamp,
        });
      }
    }

    // 3. Mapear a DTOs
    const consultations: ConsultationDto[] = consRows.map((row) => ({
      id: row.id,
      propertyId: row.property_id || undefined,
      propertyTitle: row.property_title,
      propertyLocation: row.property_location || '',
      propertyPrice: row.property_price || '',
      propertyImage: row.property_image || '',
      propertyHref: row.property_href || (row.property_id ? `/propiedad/${row.property_id}` : undefined),
      sellerEmail: row.seller_email,
      sellerName: row.seller_name || 'Vendedor InmoVAX',
      buyerEmail: row.buyer_email,
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone || undefined,
      status: row.status as 'pendiente' | 'respondido',
      lastMessage: row.last_message,
      date: formatDate(row.updated_at),
      messages: messagesByConsId[row.id] || [],
      unreadBySeller: row.unread_by_seller ?? 0,
      unreadByBuyer: row.unread_by_buyer ?? 0,
    }));

    return c.json({
      success: true,
      source: 'supabase-postgresql',
      total: consultations.length,
      consultations,
    });
  } catch (error: any) {
    console.error('GET /api/consultations/seller/:email error:', error);
    return c.json({ success: false, error: error.message, consultations: [] }, 500);
  }
});

// 3. GET /api/consultations/buyer/:email: Listar consultas enviadas por un comprador desde Supabase
consultationsRouter.get('/buyer/:email', async (c) => {
  const buyerEmail = decodeURIComponent(c.req.param('email')).toLowerCase().trim();

  try {
    const { data: consRows, error: consErr } = await supabase
      .from('consultations')
      .select('*')
      .ilike('buyer_email', buyerEmail)
      .order('updated_at', { ascending: false });

    if (consErr) {
      return c.json({ success: false, error: consErr.message, total: 0, consultations: [] });
    }

    if (!consRows || consRows.length === 0) {
      return c.json({ success: true, total: 0, consultations: [] });
    }

    const consIds = consRows.map((r) => r.id);
    const { data: msgRows } = await supabase
      .from('consultation_messages')
      .select('*')
      .in('consultation_id', consIds)
      .order('created_at', { ascending: true });

    const messagesByConsId: Record<string, ChatMessageDto[]> = {};
    if (msgRows) {
      for (const m of msgRows) {
        if (!messagesByConsId[m.consultation_id]) {
          messagesByConsId[m.consultation_id] = [];
        }
        messagesByConsId[m.consultation_id].push({
          id: m.id,
          senderEmail: m.sender_email,
          senderName: m.sender_name,
          senderRole: m.sender_role as 'comprador' | 'vendedor',
          text: m.text,
          timestamp: m.timestamp,
        });
      }
    }

    const consultations: ConsultationDto[] = consRows.map((row) => ({
      id: row.id,
      propertyId: row.property_id || undefined,
      propertyTitle: row.property_title,
      propertyLocation: row.property_location || '',
      propertyPrice: row.property_price || '',
      propertyImage: row.property_image || '',
      propertyHref: row.property_href || (row.property_id ? `/propiedad/${row.property_id}` : undefined),
      sellerEmail: row.seller_email,
      sellerName: row.seller_name || 'Vendedor InmoVAX',
      buyerEmail: row.buyer_email,
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone || undefined,
      status: row.status as 'pendiente' | 'respondido',
      lastMessage: row.last_message,
      date: formatDate(row.updated_at),
      messages: messagesByConsId[row.id] || [],
      unreadBySeller: row.unread_by_seller ?? 0,
      unreadByBuyer: row.unread_by_buyer ?? 0,
    }));

    return c.json({
      success: true,
      source: 'supabase-postgresql',
      total: consultations.length,
      consultations,
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message, consultations: [] }, 500);
  }
});

// 4. POST /api/consultations/:id/reply: Responder a una consulta existente en Supabase
consultationsRouter.post('/:id/reply', async (c) => {
  const consultationId = c.req.param('id');

  try {
    const body = await c.req.json();
    const replySchema = z.object({
      senderEmail: z.string().min(3),
      senderName: z.string().min(1),
      senderRole: z.enum(['vendedor', 'comprador']),
      replyText: z.string().min(1, 'El mensaje de respuesta no puede estar vacío'),
    });

    const validated = replySchema.parse(body);

    const { data: existing, error: findErr } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', consultationId)
      .maybeSingle();

    if (findErr || !existing) {
      return c.json({ success: false, error: 'Consulta no encontrada en Supabase' }, 404);
    }

    const now = new Date();
    const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = now.toISOString();
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newStatus = validated.senderRole === 'vendedor' ? 'respondido' : 'pendiente';

    // 1. Insertar mensaje en Supabase
    await supabase.from('consultation_messages').insert({
      id: messageId,
      consultation_id: consultationId,
      sender_email: validated.senderEmail.toLowerCase().trim(),
      sender_name: validated.senderName,
      sender_role: validated.senderRole,
      text: validated.replyText,
      timestamp: timeNow,
      created_at: nowIso,
    });

    // 2. Actualizar estado y último mensaje en Supabase
    const updatePayload: Record<string, any> = {
      last_message: validated.replyText,
      updated_at: nowIso,
      status: newStatus,
    };
    if (validated.senderRole === 'vendedor') {
      updatePayload.unread_by_buyer = (existing.unread_by_buyer || 0) + 1;
    } else {
      updatePayload.unread_by_seller = (existing.unread_by_seller || 0) + 1;
    }

    await supabase.from('consultations').update(updatePayload).eq('id', consultationId);

    // 3. Obtener todos los mensajes actualizados
    const { data: allMsgs } = await supabase
      .from('consultation_messages')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: true });

    const messages: ChatMessageDto[] = (allMsgs || []).map((m) => ({
      id: m.id,
      senderEmail: m.sender_email,
      senderName: m.sender_name,
      senderRole: m.sender_role as 'comprador' | 'vendedor',
      text: m.text,
      timestamp: m.timestamp,
    }));

    const dto: ConsultationDto = {
      id: existing.id,
      propertyId: existing.property_id || undefined,
      propertyTitle: existing.property_title,
      propertyLocation: existing.property_location || '',
      propertyPrice: existing.property_price || '',
      propertyImage: existing.property_image || '',
      propertyHref: existing.property_href || (existing.property_id ? `/propiedad/${existing.property_id}` : undefined),
      sellerEmail: existing.seller_email,
      sellerName: existing.seller_name || 'Vendedor InmoVAX',
      buyerEmail: existing.buyer_email,
      buyerName: existing.buyer_name,
      buyerPhone: existing.buyer_phone || undefined,
      status: newStatus,
      lastMessage: validated.replyText,
      date: formatDate(nowIso),
      messages,
      unreadBySeller: updatePayload.unread_by_seller ?? existing.unread_by_seller,
      unreadByBuyer: updatePayload.unread_by_buyer ?? existing.unread_by_buyer,
    };

    return c.json({
      success: true,
      message: 'Respuesta guardada con éxito en Supabase PostgreSQL',
      consultation: dto,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: 'Validación fallida', details: error.errors }, 400);
    }
    return c.json({ success: false, error: error.message || 'Error al responder' }, 500);
  }
});

// 5. GET /api/consultations/:id: Obtener una consulta individual con sus mensajes desde Supabase
consultationsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const { data: row, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !row) {
      return c.json({ success: false, error: 'Consulta no encontrada en Supabase' }, 404);
    }

    const { data: msgs } = await supabase
      .from('consultation_messages')
      .select('*')
      .eq('consultation_id', id)
      .order('created_at', { ascending: true });

    const messages: ChatMessageDto[] = (msgs || []).map((m) => ({
      id: m.id,
      senderEmail: m.sender_email,
      senderName: m.sender_name,
      senderRole: m.sender_role as 'comprador' | 'vendedor',
      text: m.text,
      timestamp: m.timestamp,
    }));

    const dto: ConsultationDto = {
      id: row.id,
      propertyId: row.property_id || undefined,
      propertyTitle: row.property_title,
      propertyLocation: row.property_location || '',
      propertyPrice: row.property_price || '',
      propertyImage: row.property_image || '',
      propertyHref: row.property_href || (row.property_id ? `/propiedad/${row.property_id}` : undefined),
      sellerEmail: row.seller_email,
      sellerName: row.seller_name || 'Vendedor InmoVAX',
      buyerEmail: row.buyer_email,
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone || undefined,
      status: row.status as 'pendiente' | 'respondido',
      lastMessage: row.last_message,
      date: formatDate(row.updated_at),
      messages,
      unreadBySeller: row.unread_by_seller ?? 0,
      unreadByBuyer: row.unread_by_buyer ?? 0,
    };

    return c.json({
      success: true,
      source: 'supabase-postgresql',
      consultation: dto,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
