import { describe, test, expect } from "bun:test";
import { managedPropertyToListing } from "../components/data/propertyListings";
import { ManagedProperty } from "../lib/propertiesStore";

const createMockProp = (overrides: Partial<ManagedProperty> = {}): ManagedProperty => ({
  id: "PROP-001",
  title: "Departamento en Sopocachi",
  zone: "Sopocachi, La Paz",
  type: "Anticrético",
  price: "$us 45,000",
  views: 10,
  inquiries: 2,
  status: "Activo",
  folioReal: "2.01.0.12.3456789",
  assignedAdvisor: "Lic. Andrea Morales",
  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  authorEmail: "test@example.com",
  authorName: "Juan Perez",
  datePublished: "Publicado hoy",
  ...overrides,
});

describe("Pruebas de Caja Blanca - Lógica de Negocio y Transformación Frontend", () => {
  test("managedPropertyToListing debe extraer precio numérico y moneda correctamente", () => {
    const mockPropUSD = createMockProp({
      id: "PROP-001",
      title: "Departamento en Sopocachi",
      zone: "Sopocachi, La Paz",
      type: "Anticrético",
      price: "$us 45,000",
    });

    const listing = managedPropertyToListing(mockPropUSD);
    expect(listing.id).toBe("PROP-001");
    expect(listing.precioNumerico).toBe(45000);
    expect(listing.moneda).toBe("USD");
    expect(listing.tipo).toBe("departamentos");
    expect(listing.href).toBe("/propiedad/PROP-001");
  });

  test("managedPropertyToListing debe inferir tipo 'casas' cuando el título incluye 'casa' o 'residencia'", () => {
    const mockCasa = createMockProp({
      id: "PROP-002",
      title: "Hermosa Casa en Calacoto",
      zone: "Calacoto, Zona Sur",
      type: "Venta",
      price: "$us 250,000",
      folioReal: "2.01.0.12.9876543",
    });

    const listing = managedPropertyToListing(mockCasa);
    expect(listing.tipo).toBe("casas");
  });

  test("managedPropertyToListing debe inferir moneda BOB cuando el precio incluye 'Bs'", () => {
    const mockBs = createMockProp({
      id: "PROP-003",
      title: "Oficina en Miraflores",
      zone: "Miraflores",
      type: "Alquiler",
      price: "Bs. 3,500",
      folioReal: "2.01.0.12.1122334",
    });

    const listing = managedPropertyToListing(mockBs);
    expect(listing.moneda).toBe("BOB");
    expect(listing.precioNumerico).toBe(3500);
    expect(listing.tipo).toBe("oficinas");
  });

  test("Caja Blanca: Si el precio viene malformado o vacío, no debe colapsar con NaN", () => {
    const mockBrokenPrice = createMockProp({
      id: "PROP-004",
      title: "Terreno en Achumani",
      zone: "Achumani",
      type: "Venta",
      price: "A convenir / Negociable",
      folioReal: "2.01.0.12.9988776",
    });

    const listing = managedPropertyToListing(mockBrokenPrice);
    expect(listing.precioNumerico).toBe(0);
    expect(isNaN(listing.precioNumerico)).toBe(false);
  });
});
