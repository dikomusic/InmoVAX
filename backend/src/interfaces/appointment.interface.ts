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

export interface CreateAppointmentDTO {
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientPhone?: string;
  advisorId?: string;
  advisorName?: string;
  date?: string;
  time?: string;
  visitDate?: string;
  timeSlot?: string;
  notes?: string;
}
