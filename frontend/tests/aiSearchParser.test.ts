import { describe, expect, it } from 'bun:test';
import { parseAISearchQuery } from '../lib/aiSearchParser';

describe('aiSearchParser', () => {
  it('debe detectar anticrético de departamento en Sopocachi con precio máximo', () => {
    const result = parseAISearchQuery('Departamento en Sopocachi en anticrético menos de 50000');
    expect(result.operation).toBe('anticretico');
    expect(result.propertyType).toBe('departamentos');
    expect(result.location.toLowerCase()).toContain('sopocachi');
    expect(result.maxPrice).toBe(50000);
    expect(result.targetUrl).toContain('/anticretico/departamentos');
    expect(result.targetUrl).toContain('ciudad=lapaz');
    expect(result.targetUrl).toContain('max=50000');
  });

  it('debe detectar alquiler de casa con dormitorios en Calacoto', () => {
    const result = parseAISearchQuery('Busco casa en alquiler en Calacoto con 3 dormitorios');
    expect(result.operation).toBe('alquilar');
    expect(result.propertyType).toBe('casas');
    expect(result.location.toLowerCase()).toContain('calacoto');
    expect(result.bedrooms).toBe(3);
    expect(result.targetUrl).toContain('/alquilar/casas');
  });

  it('debe detectar compra de oficina en Santa Cruz con formato 80k', () => {
    const result = parseAISearchQuery('Oficina en venta en Equipetrol hasta 80k');
    expect(result.operation).toBe('comprar');
    expect(result.propertyType).toBe('oficinas');
    expect(result.location.toLowerCase()).toContain('equipetrol');
    expect(result.maxPrice).toBe(80000);
    expect(result.targetUrl).toContain('/comprar/oficinas');
  });

  it('debe manejar consultas genéricas sin crashear', () => {
    const result = parseAISearchQuery('');
    expect(result.operation).toBe('comprar');
    expect(result.propertyType).toBe('todos');
    expect(result.targetUrl).toBe('/comprar/todos');
  });
});
