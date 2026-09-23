import { describe, test, expect } from "bun:test";
import { app } from "../index";
import { supabase } from "../config/supabase";

describe("Pruebas de Caja Negra y Caja Blanca - Sistema de Consultas P2P (Supabase PostgreSQL)", () => {
  const timestamp = Date.now();
  const testSellerEmail = `vendedor.test.${timestamp}@inmovax.com`;
  const testBuyerEmail = `comprador.test.${timestamp}@gmail.com`;
  let createdConsultationId = "";

  // ============================================================================
  // SECCIÓN 1: PRUEBAS DE CAJA NEGRA (Funcionalidad, Contratos de Entrada/Salida)
  // ============================================================================

  test("Caja Negra CN-01: POST /api/consultations - Comprador envía mensaje directo y recibe confirmación 201", async () => {
    const payload = {
      propertyId: "PROP-127",
      propertyTitle: "DEPARTAMENTO en Sopocachi, La Paz",
      propertyLocation: "Sopocachi, La Paz",
      propertyPrice: "$us 45,000",
      sellerEmail: testSellerEmail,
      sellerName: "Vendedor Test",
      buyerEmail: testBuyerEmail,
      buyerName: "Comprador Test",
      buyerPhone: "+591 70011223",
      messageText: "¿El departamento cuenta con gas domiciliario instalado?"
    };

    const req = new Request("http://localhost:4000/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(201);

    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.consultation).toBeDefined();
    expect(json.consultation.id).toBeDefined();
    expect(json.consultation.propertyTitle).toBe("DEPARTAMENTO en Sopocachi, La Paz");
    expect(json.consultation.buyerEmail).toBe(testBuyerEmail);
    expect(json.consultation.status).toBe("pendiente");
    expect(json.consultation.messages.length).toBe(1);
    expect(json.consultation.messages[0].text).toBe("¿El departamento cuenta con gas domiciliario instalado?");

    createdConsultationId = json.consultation.id;
  });

  test("Caja Negra CN-02: GET /api/consultations/seller/:email - Vendedor accede a su bandeja y recupera sus consultas", async () => {
    const req = new Request(`http://localhost:4000/api/consultations/seller/${encodeURIComponent(testSellerEmail)}`);
    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.source).toBe("supabase-postgresql");
    expect(Array.isArray(json.consultations)).toBe(true);
    expect(json.total).toBeGreaterThanOrEqual(1);

    const found = json.consultations.find((c: any) => c.id === createdConsultationId);
    expect(found).toBeDefined();
    expect(found.buyerName).toBe("Comprador Test");
  });

  test("Caja Negra CN-03: POST /api/consultations/:id/reply - Vendedor responde mensaje y el estado cambia a 'respondido'", async () => {
    const replyPayload = {
      senderEmail: testSellerEmail,
      senderName: "Vendedor Test",
      senderRole: "vendedor",
      replyText: "Hola, sí cuenta con instalación de gas domiciliario de YPFB."
    };

    const req = new Request(`http://localhost:4000/api/consultations/${createdConsultationId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(replyPayload)
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.consultation.status).toBe("respondido");
    expect(json.consultation.lastMessage).toBe("Hola, sí cuenta con instalación de gas domiciliario de YPFB.");
    expect(json.consultation.messages.length).toBe(2);
  });

  test("Caja Negra CN-04: GET /api/consultations/buyer/:email - Comprador visualiza el hilo completo con la respuesta", async () => {
    const req = new Request(`http://localhost:4000/api/consultations/buyer/${encodeURIComponent(testBuyerEmail)}`);
    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.total).toBeGreaterThanOrEqual(1);

    const found = json.consultations.find((c: any) => c.id === createdConsultationId);
    expect(found).toBeDefined();
    expect(found.messages.length).toBe(2);
    expect(found.messages[1].senderRole).toBe("vendedor");
  });

  test("Caja Negra CN-05: GET /api/consultations/:id - Lectura de conversación individual", async () => {
    const req = new Request(`http://localhost:4000/api/consultations/${createdConsultationId}`);
    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.consultation.id).toBe(createdConsultationId);
    expect(json.consultation.messages.length).toBe(2);
  });

  test("Caja Negra CN-06: Aislamiento de privacidad - Un vendedor ajeno no ve consultas de otros", async () => {
    const emailAjeno = "vendedor.completamente.desconocido@inmovax.com";
    const req = new Request(`http://localhost:4000/api/consultations/seller/${encodeURIComponent(emailAjeno)}`);
    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.total).toBe(0);
    expect(json.consultations.length).toBe(0);
  });

  // ============================================================================
  // SECCIÓN 2: PRUEBAS DE CAJA BLANCA (Lógica Interna, Tipos, Supabase & Ramas de Error)
  // ============================================================================

  test("Caja Blanca CB-01: Validación Zod - Objeto vacío debe ser rechazado con 400 sin colapsar el servidor", async () => {
    const req = new Request("http://localhost:4000/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
    expect(json.error).toBe("Validación fallida");
    expect(Array.isArray(json.details)).toBe(true);
  });

  test("Caja Blanca CB-02: Validación Zod - Email de vendedor malformado debe ser rechazado", async () => {
    const req = new Request("http://localhost:4000/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyTitle: "Casa en Calacoto",
        sellerEmail: "correo-no-valido",
        buyerEmail: "comprador@gmail.com",
        buyerName: "Carlos",
        messageText: "Hola"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
  });

  test("Caja Blanca CB-03: Rama 404 - Responder a una consulta inexistente en Supabase", async () => {
    const req = new Request("http://localhost:4000/api/consultations/cons-inexistente-999999/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderEmail: testSellerEmail,
        senderName: "Vendedor Test",
        senderRole: "vendedor",
        replyText: "Mensaje a la nada"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(404);

    const json = (await res.json()) as any;
    expect(json.success).toBe(false);
    expect(json.error).toContain("no encontrada");
  });

  test("Caja Blanca CB-04: Efecto secundario en Supabase - inquiries_count se incrementa en tabla properties", async () => {
    // 1. Obtener contador actual de inquiries_count en Supabase para PROP-127
    const { data: beforeProp } = await supabase
      .from("properties")
      .select("id, inquiries_count")
      .eq("code", "PROP-127")
      .single();

    const initialInquiries = beforeProp?.inquiries_count || 0;

    // 2. Ejecutar inserción de consulta referenciando PROP-127
    const req = new Request("http://localhost:4000/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: "PROP-127",
        propertyTitle: "DEPARTAMENTO en Sopocachi, La Paz",
        sellerEmail: testSellerEmail,
        buyerEmail: "otro.comprador@gmail.com",
        buyerName: "Otro Comprador",
        messageText: "¿Tiene parqueo incluido?"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(201);

    // 3. Verificar que en la base de datos Supabase el contador subió exactamente +1
    const { data: afterProp } = await supabase
      .from("properties")
      .select("inquiries_count")
      .eq("code", "PROP-127")
      .single();

    expect(afterProp?.inquiries_count).toBe(initialInquiries + 1);
  });

  test("Caja Blanca CB-05: Agrupación de hilo (Thread Collapsing) - Segundo mensaje del mismo comprador no duplica el hilo", async () => {
    // El comprador 'otro.comprador@gmail.com' envía un segundo mensaje para 'PROP-127'
    const req = new Request("http://localhost:4000/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: "PROP-127",
        propertyTitle: "DEPARTAMENTO en Sopocachi, La Paz",
        sellerEmail: testSellerEmail,
        buyerEmail: "otro.comprador@gmail.com",
        buyerName: "Otro Comprador",
        messageText: "Y además, ¿aceptan mascotas pequeñas?"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(201);

    // Comprobar en Supabase que sólo existe 1 consulta para este par (inmueble, comprador)
    const { data: propData } = await supabase.from("properties").select("id").eq("code", "PROP-127").single();
    const { data: consRows } = await supabase
      .from("consultations")
      .select("id")
      .eq("property_id", propData?.id)
      .eq("buyer_email", "otro.comprador@gmail.com");

    expect(consRows?.length).toBe(1);
  });
});
