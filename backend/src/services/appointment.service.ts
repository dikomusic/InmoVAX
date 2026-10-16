import { AppointmentRepository } from '../repositories/appointment.repository';
import { Appointment, CreateAppointmentDTO } from '../interfaces/appointment.interface';

export class AppointmentService {
  private static formatDisplayDate(dateStr: string): string {
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

  static mapDbAppointment(dbApt: any): Appointment {
    const prop = dbApt.properties || {};
    const advisor = dbApt.advisors || {};

    return {
      id: dbApt.id,
      propertyTitle: prop.title || 'Inmueble InmoVAX',
      clientName: dbApt.client_name,
      clientPhone: dbApt.client_phone,
      advisorName: advisor.full_name || 'Lic. Carlos Vega (Asesor)',
      date: AppointmentService.formatDisplayDate(dbApt.visit_date),
      time: dbApt.time_slot,
      status: dbApt.status || 'Confirmada',
    };
  }

  static async listAppointments(): Promise<{ total: number; appointments: Appointment[] }> {
    try {
      const { data, error } = await AppointmentRepository.findAll();
      if (!error && data) {
        const mapped = data.map(AppointmentService.mapDbAppointment);
        return { total: mapped.length, appointments: mapped };
      }
    } catch (err) {
      console.error('Error fetching appointments from Supabase:', err);
    }
    return { total: 0, appointments: [] };
  }

  static async scheduleAppointment(dto: CreateAppointmentDTO): Promise<Appointment> {
    const inputDate = dto.date || dto.visitDate || 'Hoy';
    const inputTime = dto.time || dto.timeSlot || '10:30 AM';

    // Determinar property_id UUID válido para PostgreSQL
    let propertyId: string | null = null;
    const rawPropId = dto.propertyId;

    if (rawPropId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawPropId);
      if (isUuid) {
        propertyId = rawPropId;
      } else {
        const { data: propFound } = await AppointmentRepository.findPropertyByCode(rawPropId);
        if (propFound) {
          propertyId = propFound.id;
          await AppointmentRepository.incrementPropertyInquiries(propFound.id, propFound.inquiries_count || 0);
        }
      }
    }

    if (!propertyId) {
      const { data: firstProp } = await AppointmentRepository.getFirstProperty();
      propertyId = firstProp?.id || 'c0000000-0000-0000-0000-000000000001';
      if (firstProp) {
        await AppointmentRepository.incrementPropertyInquiries(firstProp.id, firstProp.inquiries_count || 0);
      }
    }

    let advisorId = dto.advisorId;
    if (!advisorId) {
      const { data: firstAdvisor } = await AppointmentRepository.getFirstAdvisor();
      advisorId = firstAdvisor?.id || 'a0000000-0000-0000-0000-000000000001';
    }

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

    const { data, error } = await AppointmentRepository.create({
      property_id: propertyId || 'c0000000-0000-0000-0000-000000000001',
      advisor_id: advisorId || 'a0000000-0000-0000-0000-000000000001',
      client_name: dto.clientName,
      client_phone: dto.clientPhone || 'No provisto',
      visit_date: visitDate,
      time_slot: inputTime,
      status: 'Confirmada',
      notes: dto.notes || null,
    });

    if (error || !data) {
      throw new Error(error?.message || 'Error al registrar la cita en Supabase');
    }

    return AppointmentService.mapDbAppointment(data);
  }
}
