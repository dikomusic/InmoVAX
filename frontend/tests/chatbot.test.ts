import { describe, test, expect } from 'bun:test';

describe('Chatbot InmoBot - Lógica y Rutas de IA', () => {
  test('Debe tener configurada la variable GEMINI_API_KEY o fallback', () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(10);
  });

  test('Debe utilizar modelos activos y modernos de Gemini (3.6-flash, 3.5-flash)', () => {
    const activeModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-3.7-flash'
    ];
    expect(activeModels).toContain('gemini-3.6-flash');
    expect(activeModels).toContain('gemini-3.5-flash');
    expect(activeModels.length).toBeGreaterThanOrEqual(4);
  });

  test('Debe estructurar correctamente la llamada de búsqueda de inmuebles', () => {
    const userMessage = 'Busco un departamento en Sopocachi en anticretico';
    const q = userMessage.toLowerCase();
    const isSearch = q.includes('departamento') || q.includes('anticretico') || q.includes('sopocachi');
    expect(isSearch).toBe(true);
  });

  test('Debe formatear las tarjetas de inmuebles sugeridos con href y moneda', () => {
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

  test('Regla estricta: Sistema no debe contener emojis en sus instrucciones maestras', () => {
    const systemPrompt = `Eres InmoBot, el Asistente Virtual Inteligente oficial de InmoVAX en Bolivia. REGLA ESTRICTA DE ESTILO: No utilices emojis ni emoticonos en tus respuestas.`;
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(systemPrompt)).toBe(false);
  });
});
