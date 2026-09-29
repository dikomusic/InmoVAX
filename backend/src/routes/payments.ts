import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';
import { requireAdmin } from '../middleware/auth';

export const paymentsRouter = new Hono();

// ==============================================================================
// 1. CONFIGURACIÓN DE PLANES DE PUBLICACIÓN (Precios 100% Configurables)
// ==============================================================================
export interface PublicationPlan {
  id: 'basico' | 'oro' | 'diamante';
  name: string;
  badgeColor: string;
  durationLabel: string;
  durationDays: number | null; // null = ¡Hasta que se venda o alquile!
  price: number;
  currency: 'USD' | 'BOB';
  exposure: string;
  features: {
    canalesInmoVAX: boolean;
    soporte: string;
  };
}

// Configuración predeterminada en memoria con persistencia en Supabase (si existe la tabla)
let defaultPlans: Record<string, PublicationPlan> = {
  basico: {
    id: 'basico',
    name: 'Básico',
    badgeColor: 'gray',
    durationLabel: '30 días',
    durationDays: 30,
    price: 25,
    currency: 'USD',
    exposure: 'Buena',
    features: {
      canalesInmoVAX: true,
      soporte: 'Online'
    }
  },
  oro: {
    id: 'oro',
    name: 'Oro',
    badgeColor: 'amber',
    durationLabel: '60 días',
    durationDays: 60,
    price: 45,
    currency: 'USD',
    exposure: 'Buena',
    features: {
      canalesInmoVAX: true,
      soporte: 'Online y telefónico'
    }
  },
  diamante: {
    id: 'diamante',
    name: 'Diamante',
    badgeColor: 'orange',
    durationLabel: '¡Hasta que se venda o alquile!',
    durationDays: null,
    price: 75,
    currency: 'USD',
    exposure: 'Máxima',
    features: {
      canalesInmoVAX: true,
      soporte: 'Asesor dedicado y telefónico'
    }
  }
};

// ==============================================================================
// 2. ALMACENAMIENTO DE ÓRDENES Y COMPROBANTES DE PAGO
// ==============================================================================
export interface PropertyPaymentOrder {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  sellerEmail: string;
  sellerName?: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  qrCodeData: string;
  receiptUrl?: string | null;
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'exento_vip';
  rejectionReason?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

// Almacén en memoria sincronizado con Supabase
export const inMemoryOrders: Map<string, PropertyPaymentOrder> = new Map();

// ==============================================================================
// 3. ENDPOINTS DE LA API
// ==============================================================================

// GET /api/payments/plans - Obtener todos los planes disponibles (precios configurables)
paymentsRouter.get('/plans', async (c) => {
  try {
    // Intentar leer desde Supabase si la tabla publication_plans está creada
    const { data: dbPlans, error } = await supabase.from('publication_plans').select('*');
    if (!error && dbPlans && dbPlans.length > 0) {
      const mapped = dbPlans.reduce((acc: any, p: any) => {
        acc[p.id] = {
          id: p.id,
          name: p.name,
          badgeColor: p.badge_color || (p.id === 'diamante' ? 'orange' : p.id === 'oro' ? 'amber' : 'gray'),
          durationLabel: p.duration_label,
          durationDays: p.duration_days,
          price: Number(p.price),
          currency: p.currency || 'USD',
          exposure: p.exposure_level || 'Buena',
          features: {
            canalesInmoVAX: true,
            reporteSemanal: true,
            tipsVenta: true,
            soporte: p.support_type || (p.id === 'diamante' ? 'Asesor dedicado' : 'Online')
          }
        };
        return acc;
      }, {});
      return c.json({ success: true, plans: mapped });
    }
  } catch {
    // Fallback silencioso a defaultPlans
  }

  return c.json({ success: true, plans: defaultPlans });
});

// PUT /api/payments/plans/:id - Configurar precio o duración de un plan (Administrador)
paymentsRouter.put('/plans/:id', requireAdmin, async (c) => {
  const planId = c.req.param('id');
  const body = await c.req.json();

  if (!defaultPlans[planId]) {
    return c.json({ success: false, error: 'Plan no encontrado' }, 404);
  }

  if (typeof body.price === 'number' && body.price >= 0) {
    defaultPlans[planId].price = body.price;
  }
  if (body.currency) {
    defaultPlans[planId].currency = body.currency;
  }
  if (body.durationLabel) {
    defaultPlans[planId].durationLabel = body.durationLabel;
  }

  try {
    await supabase.from('publication_plans').upsert({
      id: planId,
      name: defaultPlans[planId].name,
      price: defaultPlans[planId].price,
      currency: defaultPlans[planId].currency,
      duration_label: defaultPlans[planId].durationLabel,
      duration_days: defaultPlans[planId].durationDays,
      updated_at: new Date().toISOString()
    });
  } catch {
    // Continúa con la memoria
  }

  return c.json({ success: true, plan: defaultPlans[planId], message: 'Plan actualizado exitosamente' });
});

// Helper para activar propiedad en DB de forma compatible con UUID y Code
export async function activatePropertyInDb(propertyId: string) {
  try {
    const decoded = decodeURIComponent(propertyId).trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded);
    let q = supabase.from('properties').update({
      status_id: 1, // Activo
      updated_at: new Date().toISOString()
    });
    if (isUuid) {
      const { error } = await q.eq('id', decoded);
      if (error) console.error('Error updating property by id:', error);
    } else {
      const { error } = await q.ilike('code', decoded);
      if (error) console.error('Error updating property by code:', error);
    }
    return true;
  } catch (err) {
    console.error('Error activating property in DB:', err);
    return false;
  }
}

// POST /api/payments/create-order - Crear orden de pago y generar QR oficial
paymentsRouter.post('/create-order', async (c) => {
  const schema = z.object({
    propertyId: z.string(),
    propertyTitle: z.string().optional(),
    sellerEmail: z.string().email(),
    sellerName: z.string().optional(),
    planId: z.enum(['basico', 'oro', 'diamante'])
  });

  const body = await c.req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Datos de orden inválidos', details: parsed.error.format() }, 400);
  }

  const { propertyId, propertyTitle, sellerEmail, sellerName, planId } = parsed.data;
  const selectedPlan = defaultPlans[planId];
  const isVipUser = sellerEmail.toLowerCase().trim() === 'vip@inmovax.com' || sellerEmail.toLowerCase().trim() === 'admin@inmovax.com';

  const orderId = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  // Simulación de QR Simple Bolivia con datos bancarios reales de InmoVAX
  const qrData = `INMOVAX|BCP|CTA-201-50892341|BOB|${selectedPlan.price}|ORD-${orderId}|REF-INMUEBLE-${propertyId}`;

  const order: PropertyPaymentOrder = {
    id: orderId,
    propertyId,
    propertyTitle: propertyTitle || `Inmueble #${propertyId}`,
    sellerEmail,
    sellerName: sellerName || 'Propietario InmoVAX',
    planId,
    planName: selectedPlan.name,
    amount: selectedPlan.price,
    currency: selectedPlan.currency,
    qrCodeData: qrData,
    status: isVipUser ? 'exento_vip' : 'pendiente',
    receiptUrl: null,
    createdAt: new Date().toISOString()
  };

  inMemoryOrders.set(orderId, order);

  // Si es usuario VIP, auto-aprobar y activar la publicación inmediatamente
  if (isVipUser) {
    await activatePropertyInDb(propertyId);
  }

  return c.json({
    success: true,
    order,
    isExemptVip: isVipUser,
    message: isVipUser
      ? '¡Usuario VIP verificado! Tu publicación ha sido activada de forma 100% gratuita.'
      : 'Orden de pago generada exitosamente.'
  });
});

// POST /api/payments/upload-receipt - Registrar comprobante de transferencia bancaria
paymentsRouter.post('/upload-receipt', async (c) => {
  const schema = z.object({
    orderId: z.string(),
    receiptUrl: z.string().min(1, 'El comprobante es requerido')
  });

  const body = await c.req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'Comprobante inválido' }, 400);
  }

  const { orderId, receiptUrl } = parsed.data;
  const order = inMemoryOrders.get(orderId);
  if (!order) {
    return c.json({ success: false, error: 'Orden de pago no encontrada' }, 404);
  }

  order.receiptUrl = receiptUrl;
  order.status = 'pendiente';
  inMemoryOrders.set(orderId, order);

  return c.json({
    success: true,
    order,
    message: 'Comprobante recibido. El equipo administrativo revisará tu pago a la brevedad.'
  });
});

// GET /api/payments/admin/pending - Listar comprobantes pendientes para el Administrador
paymentsRouter.get('/admin/pending', requireAdmin, async (c) => {
  const orders = Array.from(inMemoryOrders.values()).filter(o => o.status === 'pendiente');
  return c.json({ success: true, count: orders.length, orders });
});

// GET /api/payments/admin/history - Listar comprobantes aprobados o revisados
paymentsRouter.get('/admin/history', requireAdmin, async (c) => {
  const orders = Array.from(inMemoryOrders.values()).filter(o => o.status === 'aprobado' || o.status === 'rechazado');
  return c.json({ success: true, count: orders.length, orders });
});

// POST /api/payments/admin/:id/approve - Aprobar pago y activar publicación
paymentsRouter.post('/admin/:id/approve', requireAdmin, async (c) => {
  const orderId = c.req.param('id');
  const order = inMemoryOrders.get(orderId);

  if (!order) {
    return c.json({ success: false, error: 'Orden no encontrada' }, 404);
  }

  order.status = 'aprobado';
  order.reviewedAt = new Date().toISOString();
  inMemoryOrders.set(orderId, order);

  // Activar propiedad en base de datos
  if (order.propertyId) {
    await activatePropertyInDb(order.propertyId);
  }

  return c.json({
    success: true,
    order,
    message: `Pago ${orderId} aprobado. La publicación ha sido activada con plan ${order.planName}.`
  });
});

// POST /api/payments/admin/:id/reject - Rechazar comprobante con motivo
paymentsRouter.post('/admin/:id/reject', requireAdmin, async (c) => {
  const orderId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const reason = body?.reason || 'Comprobante no válido o no coincide el monto transferido.';

  const order = inMemoryOrders.get(orderId);
  if (!order) {
    return c.json({ success: false, error: 'Orden no encontrada' }, 404);
  }

  order.status = 'rechazado';
  order.rejectionReason = reason;
  order.reviewedAt = new Date().toISOString();
  inMemoryOrders.set(orderId, order);

  return c.json({
    success: true,
    order,
    message: `Pago ${orderId} rechazado.`
  });
});

// PATCH /api/payments/order/:id/link-property - Vincular orden con inmueble recién creado
paymentsRouter.patch('/order/:id/link-property', async (c) => {
  const orderId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const order = inMemoryOrders.get(orderId);
  if (!order) {
    return c.json({ success: false, error: 'Orden no encontrada' }, 404);
  }

  if (body.propertyId) order.propertyId = body.propertyId;
  if (body.propertyTitle) order.propertyTitle = body.propertyTitle;
  inMemoryOrders.set(orderId, order);

  return c.json({ success: true, order });
});

// DELETE /api/payments/admin/orders/:id - Eliminar orden de pago de prueba
paymentsRouter.delete('/admin/orders/:id', async (c) => {
  const orderId = c.req.param('id');
  if (inMemoryOrders.has(orderId)) {
    inMemoryOrders.delete(orderId);
    return c.json({ success: true, message: `Orden ${orderId} eliminada` });
  }
  return c.json({ success: false, error: 'Orden no encontrada' }, 404);
});
