import { Hono } from 'hono';
import { supabase } from '../config/supabase';

export const chatRouter = new Hono();

const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash'
];

chatRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { messages = [], session = null } = body as {
      messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>;
      session?: { name?: string; email?: string } | null;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return c.json({ success: false, error: 'Mensajes requeridos' }, 400);
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const botName = process.env.NEXT_PUBLIC_BOT_NAME || 'InmoBot';
    const apiKey = process.env.GEMINI_API_KEY || '';

    // Búsqueda en Supabase
    let suggestedProperties: any[] = [];
    let propertiesContext = '';
    const q = lastUserMessage.toLowerCase();

    const isSearch = q.includes('departamento') || q.includes('casa') || 
                     q.includes('terreno') || q.includes('anticretico') || 
                     q.includes('alquiler') || q.includes('venta') || 
                     q.includes('sopocachi') || q.includes('calacoto') || 
                     q.includes('achumani') || q.includes('obrajes');

    if (isSearch) {
      try {
        let query = supabase
          .from('properties')
          .select('id, title, zone, city, price_amount, currency, bedrooms, area_sqm')
          .limit(4);

        if (q.includes('sopocachi')) query = query.ilike('zone', '%sopocachi%');
        else if (q.includes('calacoto')) query = query.ilike('zone', '%calacoto%');
        else if (q.includes('achumani')) query = query.ilike('zone', '%achumani%');
        else if (q.includes('obrajes')) query = query.ilike('zone', '%obrajes%');

        const { data: props } = await query;
        if (props && props.length > 0) {
          suggestedProperties = props.map((p: any) => ({
            id: p.id,
            title: p.title,
            zone: `${p.zone}, ${p.city || 'La Paz'}`,
            price: `${p.currency === 'BOB' ? 'Bs' : '$us'} ${Number(p.price_amount).toLocaleString()}`,
            bedrooms: p.bedrooms,
            areaSqm: p.area_sqm,
            href: `/propiedad/${p.id}`
          }));

          propertiesContext = `\n[INMUEBLES REALES DISPONIBLES EN INMOVAX]:\n` + 
            suggestedProperties.map(p => `- ${p.title} en ${p.zone} (${p.price}) | Enlace: ${p.href}`).join('\n');
        }
      } catch {}
    }

    const systemPrompt = `Eres ${botName}, el Asistente Virtual Inteligente oficial de InmoVAX en Bolivia.
Responde de forma amable, concisa y profesional. No utilices emojis en tus respuestas. Eres experto en el mercado inmobiliario boliviano (anticrético, venta y alquiler, requisitos de Folio Real y publicación con QR).
${propertiesContext}`;

    if (!apiKey) {
      return c.json({
        success: true,
        message: `¡Hola! Soy ${botName}, tu asistente inmobiliario en InmoVAX. ¿En qué te puedo asesorar hoy?`,
        suggestedProperties
      });
    }

    const contents: any[] = [
      { role: 'user', parts: [{ text: `[INSTRUCCIÓN DEL SISTEMA]:\n${systemPrompt}` }] },
      { role: 'model', parts: [{ text: `Entendido. Soy ${botName}, listo para asistir a los usuarios de InmoVAX.` }] }
    ];

    for (const msg of messages.slice(-6)) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    let botReply = '';
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents, generationConfig: { temperature: 0.6, maxOutputTokens: 800 } })
        });
        if (res.ok) {
          const data = await res.json();
          const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) {
            botReply = txt;
            break;
          }
        }
      } catch {}
    }

    if (!botReply) {
      botReply = `¡Hola! Soy **${botName}**. ¿Buscas comprar, alquilar o un anticrético en Bolivia? Cuéntame tu zona de preferencia o tu presupuesto y te ayudaré de inmediato.`;
    }

    return c.json({ success: true, message: botReply, suggestedProperties });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
