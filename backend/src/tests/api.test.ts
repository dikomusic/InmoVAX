import { describe, test, expect } from "bun:test";
import { app } from "../index";

describe("Pruebas Unitarias y de Caja Blanca / Caja Negra - Backend InmoVAX", () => {
  // CAJA NEGRA: Health Check Endpoint
  test("Caja Negra: GET /health responde status 200 y JSON con ok", async () => {
    const req = new Request("http://localhost:4000/health");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.status).toBe("ok");
    expect(json.service).toBe("InmoVAX API Server");
  });

  // CAJA NEGRA: Listado de propiedades
  test("Caja Negra: GET /api/properties responde 200 y retorna estructura con properties array", async () => {
    const req = new Request("http://localhost:4000/api/properties");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json).toHaveProperty("properties");
    expect(Array.isArray(json.properties)).toBe(true);
  });

  // CAJA BLANCA: Manejo de entrada inválida en POST /api/properties (Input Validation)
  test("Caja Blanca: POST /api/properties con objeto vacío no debe colapsar el backend", async () => {
    const req = new Request("http://localhost:4000/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const res = await app.fetch(req);
    // Debe responder con código de error controlado (400, 422 o 500 estructurado)
    expect(res.status >= 400).toBe(true);
    const json = (await res.json()) as any;
    expect(json).toHaveProperty("error");
  });

  // CAJA NEGRA: Endpoint de Notificaciones
  test("Caja Negra: GET /api/notifications responde con lista estructurada", async () => {
    const req = new Request("http://localhost:4000/api/notifications");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json).toHaveProperty("notifications");
    expect(Array.isArray(json.notifications)).toBe(true);
  });

  // CAJA BLANCA: Verificación de Cabeceras de Seguridad (Security Headers)
  test("Caja Blanca: Toda respuesta debe incluir cabeceras de protección (X-Frame-Options, nosniff)", async () => {
    const req = new Request("http://localhost:4000/health");
    const res = await app.fetch(req);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  // CAJA NEGRA: Rutas 404
  test("Caja Negra: Endpoint inexistente debe responder 404", async () => {
    const req = new Request("http://localhost:4000/api/non-existent-route-xyz");
    const res = await app.fetch(req);
    expect(res.status).toBe(404);
  });

  // REQ-13: Edición de inmueble publicado - Inmueble inexistente retorna 404
  test("REQ-13 Caja Negra: PATCH /api/properties/:id con ID inexistente retorna 404", async () => {
    const req = new Request("http://localhost:4000/api/properties/inmueble-fantasma-99999", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Nuevo Título Inexistente"
      })
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(404);
    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
  });

  // REQ-13: Edición de inmueble publicado - Validación fallida retorna 400
  test("REQ-13 Caja Blanca: PATCH /api/properties/:id con modalidad inválida retorna 400", async () => {
    // Obtener propiedad existente dinámicamente
    const listReq = new Request("http://localhost:4000/api/properties");
    const listRes = await app.fetch(listReq);
    const listJson = (await listRes.json()) as any;
    const existingId = listJson.properties[0]?.id || "PROP-127";

    const req = new Request(`http://localhost:4000/api/properties/${existingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ModalidadDesconocida"
      })
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
  });

  // REQ-13: Edición de inmueble publicado - Actualización exitosa en Supabase PostgreSQL
  test("REQ-13 Caja Negra: PATCH /api/properties/:id actualiza datos comerciales y físicos en Supabase", async () => {
    // Obtener propiedad existente dinámicamente
    const listReq = new Request("http://localhost:4000/api/properties");
    const listRes = await app.fetch(listReq);
    const listJson = (await listRes.json()) as any;
    const existingId = listJson.properties[0]?.id || "PROP-127";

    const req = new Request(`http://localhost:4000/api/properties/${existingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Departamento Elegante y Soleado en Sopocachi Actualizado",
        category: "Departamento",
        price: "$us 49,500",
        isNegotiable: true,
        bedrooms: 3,
        bathrooms: 2,
        areaSqm: 125,
        parkingSpots: 1,
        amenities: ["Ascensor", "Seguridad 24/7", "Parrillero"]
      })
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.property).toBeDefined();
    expect(json.property.title).toBe("Departamento Elegante y Soleado en Sopocachi Actualizado");
    expect(json.property.category).toBe("Departamento");
    expect(json.property.isNegotiable).toBe(true);
    expect(json.property.habitaciones).toBe(3);
  });
});
