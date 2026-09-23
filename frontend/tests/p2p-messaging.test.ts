import { describe, test, expect, beforeEach } from "bun:test";

// Mock de entorno de almacenamiento para pruebas en Bun
const storage: Record<string, string> = {};
if (typeof (globalThis as any).window === 'undefined') {
  (globalThis as any).window = {
    localStorage: {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, val: string) => { storage[key] = val; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
    },
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  (globalThis as any).CustomEvent = class {
    type: string;
    detail: any;
    constructor(type: string, opts?: any) {
      this.type = type;
      this.detail = opts?.detail;
    }
  };
}

import {
  sendP2PMessage,
  replyP2PMessage,
  getConsultationsForSeller,
  getConsultationsForBuyer,
  CONSULTATIONS_KEY
} from "../lib/frontendStore";

describe("REQ-34: Pruebas Unitarias - Mensajería Directa P2P Comprador <-> Vendedor", () => {
  beforeEach(() => {
    (globalThis as any).window.localStorage.clear();
  });

  test("1. Comprador envía mensaje directo: Debe registrar conversación con inmueble y estado pendiente", () => {
    const consultation = sendP2PMessage({
      propertyId: "PROP-101",
      propertyTitle: "Penthouse en Calacoto",
      propertyLocation: "Calacoto, La Paz",
      propertyPrice: "$us 250,000",
      propertyImage: "https://ejemplo.com/foto.jpg",
      propertyHref: "/propiedad/PROP-101",
      sellerEmail: "vendedor@inmovax.com",
      sellerName: "Gonzalo Benítez",
      buyerEmail: "comprador@inmovax.com",
      buyerName: "Juan Pérez",
      buyerPhone: "70123456",
      messageText: "¿El precio es negociable si pago al contado?"
    });

    expect(consultation.id).toBeDefined();
    expect(consultation.propertyId).toBe("PROP-101");
    expect(consultation.sellerEmail).toBe("vendedor@inmovax.com");
    expect(consultation.buyerEmail).toBe("comprador@inmovax.com");
    expect(consultation.status).toBe("pendiente");
    expect(consultation.lastMessage).toBe("¿El precio es negociable si pago al contado?");
    expect(consultation.messages?.length).toBe(1);
    expect(consultation.messages?.[0].senderRole).toBe("comprador");
    expect(consultation.messages?.[0].text).toBe("¿El precio es negociable si pago al contado?");
  });

  test("2. Vendedor consulta su bandeja: Debe filtrar únicamente las consultas dirigidas a su email", () => {
    sendP2PMessage({
      propertyId: "PROP-101",
      propertyTitle: "Penthouse en Calacoto",
      propertyLocation: "Calacoto",
      propertyPrice: "$us 250,000",
      propertyImage: "",
      propertyHref: "/propiedad/PROP-101",
      sellerEmail: "gonzalo.benitez@inmovax.com",
      sellerName: "Gonzalo Benítez",
      buyerEmail: "comprador1@inmovax.com",
      buyerName: "Ana Silva",
      messageText: "Hola Gonzalo, deseo coordinar visita."
    });

    sendP2PMessage({
      propertyId: "PROP-999",
      propertyTitle: "Terreno en Achumani",
      propertyLocation: "Achumani",
      propertyPrice: "$us 80,000",
      propertyImage: "",
      propertyHref: "/propiedad/PROP-999",
      sellerEmail: "otro.vendedor@gmail.com",
      sellerName: "Pedro Roca",
      buyerEmail: "comprador2@inmovax.com",
      buyerName: "Carlos Soto",
      messageText: "Hola Pedro, ¿acepta permuta?"
    });

    const consultasGonzalo = getConsultationsForSeller("vendedor@inmovax.com");
    expect(consultasGonzalo.length).toBe(1);
    expect(consultasGonzalo[0].propertyTitle).toBe("Penthouse en Calacoto");
    expect(consultasGonzalo[0].buyerName).toBe("Ana Silva");
  });

  test("3. Vendedor responde mensaje: Se añade respuesta al hilo, cambia estado a 'respondido'", () => {
    const consultation = sendP2PMessage({
      propertyId: "PROP-101",
      propertyTitle: "Penthouse en Calacoto",
      propertyLocation: "Calacoto",
      propertyPrice: "$us 250,000",
      propertyImage: "",
      propertyHref: "/propiedad/PROP-101",
      sellerEmail: "vendedor@inmovax.com",
      sellerName: "Gonzalo Benítez",
      buyerEmail: "comprador@inmovax.com",
      buyerName: "Juan Pérez",
      messageText: "¿Tiene parqueo incluido?"
    });

    const updated = replyP2PMessage(
      consultation.id,
      "Hola Juan, sí, incluye 2 parqueos techados y baulera.",
      "vendedor",
      "Gonzalo Benítez",
      "vendedor@inmovax.com"
    );

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("respondido");
    expect(updated?.messages?.length).toBe(2);
    expect(updated?.messages?.[1].senderRole).toBe("vendedor");
    expect(updated?.messages?.[1].text).toBe("Hola Juan, sí, incluye 2 parqueos techados y baulera.");
    expect(updated?.lastMessage).toBe("Hola Juan, sí, incluye 2 parqueos techados y baulera.");
  });

  test("4. Comprador consulta sus mensajes: Puede ver el historial y las respuestas del vendedor", () => {
    const consultation = sendP2PMessage({
      propertyId: "PROP-101",
      propertyTitle: "Penthouse en Calacoto",
      propertyLocation: "Calacoto",
      propertyPrice: "$us 250,000",
      propertyImage: "",
      propertyHref: "/propiedad/PROP-101",
      sellerEmail: "vendedor@inmovax.com",
      sellerName: "Gonzalo Benítez",
      buyerEmail: "juan.comprador@correo.com",
      buyerName: "Juan Comprador",
      messageText: "¿Acepta financiamiento con Banco Bisa?"
    });

    replyP2PMessage(
      consultation.id,
      "Sí Juan, los papeles están al día y califica para cualquier banco.",
      "vendedor",
      "Gonzalo Benítez",
      "vendedor@inmovax.com"
    );

    const consultasComprador = getConsultationsForBuyer("juan.comprador@correo.com");
    expect(consultasComprador.length).toBe(1);
    expect(consultasComprador[0].status).toBe("respondido");
    expect(consultasComprador[0].messages?.length).toBe(2);
    expect(consultasComprador[0].messages?.[1].text).toContain("califica para cualquier banco");
  });
});
