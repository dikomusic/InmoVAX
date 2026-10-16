import { Hono } from 'hono';
import { AppointmentController } from '../controllers/appointment.controller';

export const appointmentsRouter = new Hono();

appointmentsRouter.get('/', AppointmentController.getAppointments);
appointmentsRouter.post('/', AppointmentController.createAppointment);

export type { Appointment } from '../interfaces/appointment.interface';
