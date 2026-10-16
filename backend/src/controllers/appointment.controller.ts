import { Context } from 'hono';
import { AppointmentService } from '../services/appointment.service';
import { newAppointmentSchema } from '../models/appointment.model';

export class AppointmentController {
  static async getAppointments(c: Context) {
    const result = await AppointmentService.listAppointments();
    return c.json({
      source: 'supabase-postgresql',
      total: result.total,
      appointments: result.appointments,
    });
  }

  static async createAppointment(c: Context) {
    try {
      const body = await c.req.json();
      const validated = newAppointmentSchema.parse(body);
      const appointment = await AppointmentService.scheduleAppointment(validated);

      return c.json({
        success: true,
        message: 'Visita agendada exitosamente con acompañamiento oficial de InmoVAX en DDRR',
        appointment,
      }, 201);
    } catch (error: any) {
      return c.json({ success: false, error: error.message || 'Datos de cita inválidos' }, 400);
    }
  }
}
