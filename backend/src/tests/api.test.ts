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
});
