import { Hono } from 'hono';
import { supabase } from '../config/supabase';

export const chatRouter = new Hono();

const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash'
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
Responde de forma amable, concisa y profesional. REGLA ESTRICTA: No utilices emojis ni emoticonos en tus respuestas. Eres experto en el mercado inmobiliario boliviano (anticrético, venta y alquiler, verificación en Derechos Reales y publicación directa sin comisiones).
${propertiesContext}`;

    if (!apiKey) {
      return c.json({
        success: true,
        message: `¡Hola! Soy ${botName}, tu asistente inmobiliario en InmoVAX. ¿En qué te puedo asesorar hoy?`,
        suggestedProperties
      });
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    const recentMessages = messages.slice(-8);

    for (const msg of recentMessages) {
      const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
      if (contents.length === 0 && role !== 'user') continue;

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n${msg.content}`;
      } else {
        contents.push({ role, parts: [{ text: msg.content }] });
      }
    }

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: lastUserMessage || 'Hola' }] });
    }

    let botReply = '';
    let usedModel = '';
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) {
            botReply = txt;
            usedModel = model;
            break;
          }
        }
      } catch {}
    }

    if (!botReply) {
      botReply = `¡Hola! Soy **${botName}**. ¿Buscas comprar, alquilar o un anticrético en Bolivia? Cuéntame tu zona de preferencia o tu presupuesto y te ayudaré de inmediato.`;
    }

    return c.json({ success: true, message: botReply, suggestedProperties, model: usedModel });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
