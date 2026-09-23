import { Hono } from 'hono';
import { z } from 'zod';
import { supabase } from '../config/supabase';

export const appointmentsRouter = new Hono();

export interface Appointment {
  id: string;
  propertyTitle: string;
  clientName: string;
  clientPhone: string;
  advisorName: string;
  date: string;
  time: string;
  status: 'Confirmada' | 'Realizada' | 'Reprogramada';
}

function formatDisplayDate(dateStr: string): string {
  try {
    const visitDate = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (visitDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (visitDate.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return visitDate.toLocaleDateString('es-BO', { month: 'short', day: 'numeric' });
    }
  } catch {
    return dateStr;
  }
}

function mapDbAppointment(dbApt: any): Appointment {
  const prop = dbApt.properties || {};
  const advisor = dbApt.advisors || {};

  return {
    id: dbApt.id,
    propertyTitle: prop.title || 'Inmueble InmoVAX',
    clientName: dbApt.client_name,
    clientPhone: dbApt.client_phone,
    advisorName: advisor.full_name || 'Lic. Carlos Vega (Asesor)',
    date: formatDisplayDate(dbApt.visit_date),
    time: dbApt.time_slot,
    status: dbApt.status || 'Confirmada'
  };
}

const newAppointmentSchema = z.object({
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  clientName: z.string().min(1, 'El nombre es requerido'),
  clientPhone: z.string().optional().default('No provisto'),
  advisorId: z.string().optional(),
  advisorName: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  visitDate: z.string().optional(),
  timeSlot: z.string().optional(),
  notes: z.string().optional()
});

// 1. GET /api/appointments: Obtener citas reales desde PostgreSQL
appointmentsRouter.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, properties(title), advisors(full_name)')
      .order('visit_date', { ascending: true });

    if (!error && data) {
      const mapped = data.map(mapDbAppointment);
      return c.json({
        source: 'supabase-postgresql',
        total: mapped.length,
        appointments: mapped
      });
    }
  } catch (err) {
    console.error('Error fetching appointments from Supabase:', err);
  }

  return c.json({ source: 'supabase-postgresql', total: 0, appointments: [] });
});

// 2. POST /api/appointments: Crear nueva cita en PostgreSQL
appointmentsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = newAppointmentSchema.parse(body);

    const inputDate = validated.date || validated.visitDate || 'Hoy';
    const inputTime = validated.time || validated.timeSlot || '10:30 AM';

    // Determinar property_id UUID válido para PostgreSQL
    let propertyId: string | null = null;
    const rawPropId = validated.propertyId;

    if (rawPropId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawPropId);
      if (isUuid) {
        propertyId = rawPropId;
      } else {
        // Buscar por código (ej. PROP-127)
        const { data: propFound } = await supabase
          .from('properties')
          .select('id, inquiries_count')
          .eq('code', rawPropId)
          .maybeSingle();

        if (propFound) {
          propertyId = propFound.id;
          // Incrementar contador de consultas en Supabase
          await supabase
            .from('properties')
            .update({ inquiries_count: (propFound.inquiries_count || 0) + 1 })
            .eq('id', propFound.id);
        }
      }
    }

    if (!propertyId) {
      const { data: firstProp } = await supabase.from('properties').select('id, inquiries_count').limit(1).single();
      propertyId = firstProp?.id || 'c0000000-0000-0000-0000-000000000001';
      if (firstProp) {
        await supabase
          .from('properties')
          .update({ inquiries_count: (firstProp.inquiries_count || 0) + 1 })
          .eq('id', firstProp.id);
      }
    }

    // Determinar advisor_id
    let advisorId = validated.advisorId;
    if (!advisorId) {
      const { data: firstAdvisor } = await supabase.from('advisors').select('id').limit(1).single();
      advisorId = firstAdvisor?.id || 'a0000000-0000-0000-0000-000000000001';
    }

    // Formatear fecha para PostgreSQL DATE (YYYY-MM-DD)
    let visitDate = inputDate;
    const now = new Date();
    if (inputDate.toLowerCase() === 'hoy') {
      visitDate = now.toISOString().split('T')[0];
    } else if (inputDate.toLowerCase() === 'mañana') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      visitDate = tomorrow.toISOString().split('T')[0];
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      visitDate = tomorrow.toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        property_id: propertyId,
        advisor_id: advisorId,
        client_name: validated.clientName,
        client_phone: validated.clientPhone,
        visit_date: visitDate,
        time_slot: inputTime,
        status: 'Confirmada',
        notes: validated.notes || null
      })
      .select('*, properties(title), advisors(full_name)')
      .single();

    if (error) {
      console.error('Error inserting appointment into Supabase:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({
      success: true,
      message: 'Visita agendada exitosamente con acompañamiento oficial de InmoVAX en DDRR',
      appointment: mapDbAppointment(data)
    }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Datos de cita inválidos' }, 400);
  }
});
