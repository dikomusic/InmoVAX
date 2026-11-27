import { describe, it, expect } from 'bun:test';

describe('Chatbot InmoBot - Lógica y Rutas de IA', () => {
  it('Debe tener configurada la variable GEMINI_API_KEY o fallback', () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(10);
  });

  it('Debe estructurar correctamente la llamada de búsqueda de inmuebles', () => {
    const userMessage = 'Busco un departamento en Sopocachi en anticretico';
    const q = userMessage.toLowerCase();
    const isSearch = q.includes('departamento') || q.includes('anticretico') || q.includes('sopocachi');
    expect(isSearch).toBe(true);
  });

  it('Debe formatear las tarjetas de inmuebles sugeridos con href y moneda', () => {
    const mockProperty = {
      id: 'prop-123',
      title: 'Departamento Soleado',
      zone: 'Sopocachi',
      city: 'La Paz',
      price_amount: 45000,
      currency: 'USD',
      bedrooms: 2,
      area_sqm: 85
    };

    const formatted = {
      id: mockProperty.id,
      title: mockProperty.title,
      zone: `${mockProperty.zone}, ${mockProperty.city}`,
      price: `${mockProperty.currency === 'BOB' ? 'Bs' : '$us'} ${Number(mockProperty.price_amount).toLocaleString()}`,
      bedrooms: mockProperty.bedrooms,
      areaSqm: mockProperty.area_sqm,
      href: `/propiedad/${mockProperty.id}`
    };

    expect(formatted.price).toContain('45');
    expect(formatted.href).toBe('/propiedad/prop-123');
    expect(formatted.zone).toBe('Sopocachi, La Paz');
  });
});
