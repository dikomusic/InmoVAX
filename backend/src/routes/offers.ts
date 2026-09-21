import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';

export const offersRouter = new Hono();

const typeMap: Record<number, 'Anticrético' | 'Venta' | 'Alquiler'> = {
  1: 'Anticrético',
  2: 'Venta',
  3: 'Alquiler'
};

function mapDbOffer(dbOffer: any) {
  const prop = dbOffer.properties || {};
  const pricePrefix = dbOffer.currency === 'USD' ? '$us ' : 'Bs. ';
  const offerAmount = `${pricePrefix}${Number(dbOffer.offer_amount).toLocaleString()}`;
  const initialPrice = `${pricePrefix}${Number(dbOffer.initial_price).toLocaleString()}`;
  const type = typeMap[prop.type_id] || 'Anticrético';

  return {
    id: dbOffer.id,
    code: dbOffer.code || `OFR-${dbOffer.id.slice(0, 5).toUpperCase()}`,
    propertyTitle: prop.title || 'Inmueble InmoVAX',
    buyerName: dbOffer.buyer_name,
    buyerPhone: dbOffer.buyer_phone,
    offerAmount,
    initialPrice,
    date: dbOffer.created_at
      ? new Date(dbOffer.created_at).toLocaleDateString('es-BO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Reciente',
    message: dbOffer.message || '',
    status: dbOffer.status || 'Pendiente',
    type
  };
}

// 1. GET /api/offers: Obtener ofertas reales desde PostgreSQL
offersRouter.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*, properties(title, price_amount, currency, type_id)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map(mapDbOffer);
      return c.json({
        source: 'supabase-postgresql',
        total: mapped.length,
        pending: mapped.filter(o => o.status === 'Pendiente').length,
        offers: mapped
      });
    }
  } catch (err) {
    console.error('Error fetching offers from Supabase:', err);
  }

  return c.json({ source: 'supabase-postgresql', total: 0, pending: 0, offers: [] });
});

// 2. PATCH /api/offers/:id/accept: Aceptar oferta en base de datos
offersRouter.patch('/:id/accept', async (c) => {
  const id = c.req.param('id');

  try {
    const { data: updated, error } = await supabase
      .from('offers')
      .update({ status: 'Aceptada' })
      .eq('id', id)
      .select('*, properties(title, price_amount, currency, type_id)')
      .maybeSingle();

    if (error || !updated) {
      return c.json({ success: false, error: 'Oferta no encontrada o error al actualizar' }, 404);
    }

    return c.json({
      success: true,
      message: 'Oferta aceptada formalmente. Asesor notarial coordinará la minuta.',
      offer: mapDbOffer(updated)
    });
  } catch (err) {
    return c.json({ success: false, error: 'Error al procesar aceptación' }, 500);
  }
});

// 3. PATCH /api/offers/:id/reject: Rechazar oferta en base de datos
offersRouter.patch('/:id/reject', async (c) => {
  const id = c.req.param('id');

  try {
    const { data: updated, error } = await supabase
      .from('offers')
      .update({ status: 'Rechazada' })
      .eq('id', id)
      .select('*, properties(title, price_amount, currency, type_id)')
      .maybeSingle();

    if (error || !updated) {
      return c.json({ success: false, error: 'Oferta no encontrada o error al actualizar' }, 404);
    }

    return c.json({
      success: true,
      message: 'Oferta rechazada.',
      offer: mapDbOffer(updated)
    });
  } catch (err) {
    return c.json({ success: false, error: 'Error al procesar rechazo' }, 500);
  }
});

// 4. PATCH /api/offers/:id/counter: Contraofertar en base de datos
const counterSchema = z.object({
  counterPrice: z.string().min(2)
});

offersRouter.patch('/:id/counter', async (c) => {
  const id = c.req.param('id');

  try {
    const body = await c.req.json();
    const { counterPrice } = counterSchema.parse(body);
    const numericAmount = parseFloat(counterPrice.replace(/[^0-9]/g, '')) || 50000;

    const { data: updated, error } = await supabase
      .from('offers')
      .update({
        status: 'Contraofertada',
        offer_amount: numericAmount
      })
      .eq('id', id)
      .select('*, properties(title, price_amount, currency, type_id)')
      .maybeSingle();

    if (error || !updated) {
      return c.json({ success: false, error: 'Oferta no encontrada o error al actualizar' }, 404);
    }

    return c.json({
      success: true,
      message: `Contraoferta enviada al comprador por ${counterPrice}`,
      offer: mapDbOffer(updated)
    });
  } catch (error) {
    return c.json({ success: false, error: 'Precio de contraoferta inválido' }, 400);
  }
});
