import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Modelos oficiales y activos de Gemini ordenados por velocidad y disponibilidad
const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash'
];

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], session = null } = body as {
      messages: ChatMessage[];
      session?: { name?: string; email?: string; role?: string } | null;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lista de mensajes requerida' },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const botName = process.env.NEXT_PUBLIC_BOT_NAME || 'InmoBot';
    const apiKey = process.env.GEMINI_API_KEY || '';

    // 1. Búsqueda contextual de inmuebles en Supabase
    let suggestedProperties: any[] = [];
    let propertiesContext = '';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Palabras clave de búsqueda
        const q = lastUserMessage.toLowerCase();
        const isSearchIntent = q.includes('departamento') || q.includes('casa') || 
                               q.includes('terreno') || q.includes('anticretico') || 
                               q.includes('alquiler') || q.includes('venta') || 
                               q.includes('sopocachi') || q.includes('calacoto') || 
                               q.includes('achumani') || q.includes('obrajes') || 
                               q.includes('precio') || q.includes('dormitorio') ||
                               q.includes('habitacion') || q.includes('zona');

        if (isSearchIntent) {
          // Extraer posibles filtros
          let query = supabase
            .from('properties')
            .select(`
              id,
              code,
              title,
              description,
              zone,
              city,
              price_amount,
              currency,
              bedrooms,
              bathrooms,
              area_sqm,
              category,
              property_images (
                image_url,
                is_cover
              )
            `)
            .limit(4);

          // Filtro por zona común si se menciona
          if (q.includes('sopocachi')) query = query.ilike('zone', '%sopocachi%');
          else if (q.includes('calacoto')) query = query.ilike('zone', '%calacoto%');
          else if (q.includes('achumani')) query = query.ilike('zone', '%achumani%');
          else if (q.includes('obrajes')) query = query.ilike('zone', '%obrajes%');

          const { data: props } = await query;

          if (props && props.length > 0) {
            suggestedProperties = props.map((p: any) => {
              const coverImg = p.property_images?.find((img: any) => img.is_cover)?.image_url 
                || p.property_images?.[0]?.image_url 
                || '/images/property-placeholder.jpg';

              return {
                id: p.id,
                title: p.title,
                zone: `${p.zone}, ${p.city || 'La Paz'}`,
                price: `${p.currency === 'BOB' ? 'Bs' : '$us'} ${Number(p.price_amount).toLocaleString()}`,
                bedrooms: p.bedrooms,
                areaSqm: p.area_sqm,
                imageUrl: coverImg,
                href: `/propiedad/${p.id}`
              };
            });

            propertiesContext = `\n[INMUEBLES REALES DISPONIBLES EN INMOVAX]:\n` + 
              suggestedProperties.map(p => 
                `- ${p.title} en ${p.zone} | Precio: ${p.price} | Dormitorios: ${p.bedrooms} | Enlace: ${p.href}`
              ).join('\n');
          }
        }
      } catch (err) {
        console.warn('Error al buscar inmuebles en Supabase para el chat:', err);
      }
    }

    // 2. Definición del System Prompt experto en InmoVAX y Bolivia
    const userNameGreeting = session?.name ? `El usuario actual se llama ${session.name}.` : '';
    const systemPrompt = `Eres ${botName}, el Asistente Virtual Inteligente oficial de InmoVAX, la plataforma líder de bienes raíces en Bolivia (especializada en Anticréticos, Ventas y Alquileres verificados).

${userNameGreeting}

TU PERSONALIDAD Y TONO:
- Amable, cordial, profesional, ágil y transparente.
- Respuestas concisas, bien estructuradas con viñetas o negritas cuando sea útil.
- REGLA ESTRICTA DE ESTILO: No utilices emojis ni emoticonos en tus respuestas. Mantén una comunicación profesional y limpia.
- Hablas con propiedad sobre el mercado boliviano (zonas como Sopocachi, Calacoto, Achumani, Obrajes, Miraflores, Equipetrol, etc., y monedas \$us y Bs).

CONOCIMIENTOS CLAVE DE INMOVAX Y BOLIVIA:
1. ANTICRÉTICO: Explicar que en Bolivia es un contrato bilateral donde el anticresista entrega un capital al propietario sin intereses y recibe el uso pacífico de la vivienda. Al finalizar el plazo, el propietario debe devolver el 100% del capital íntegro. InmoVAX exige que cuente con Folio Real vigente y registro en Derechos Reales para evitar estafas.
2. FOLIO REAL Y NOTARIAL: InmoVAX asesora y ayuda a verificar antecedentes dominiales, gravámenes e hipotecas para que las operaciones sean completamente seguras.
3. PUBLICAR UN INMUEBLE: Cualquier propietario puede publicar gratis y sin comisión inmobiliaria del 3% al 7% desde /publicar o el botón "+ Publicar Inmueble". Ofrecemos conexión directa P2P con compradores e inquilinos mediante mensajería y búsqueda inteligente con IA.
4. BÚSQUEDA INTELIGENTE CON IA: En la portada de InmoVAX los usuarios pueden buscar directamente en lenguaje natural (ej: "departamento en Sopocachi en anticrético menos de $us 50,000").
5. RECOMENDACIÓN DE INMUEBLES: Si el contexto contiene inmuebles disponibles, menciónalos de forma atractiva indicando sus ventajas. No inventes propiedades ficticias si no están en la lista; invita a usar los filtros de búsqueda o contactar a un asesor.

${propertiesContext}
`;

    // 3. Si no hay API key configurada, responder con fallback amigable
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        message: `¡Hola! Soy **${botName}**, tu asesor inmobiliario en InmoVAX. Estoy aquí para ayudarte a encontrar inmuebles en venta, alquiler o anticrético, y resolver cualquier duda legal o notarial en Bolivia. ¿Qué tipo de propiedad estás buscando hoy?`,
        suggestedProperties
      });
    }

    // 4. Formatear historial para Gemini garantizando roles alternados válidos
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    const recentMessages = messages.slice(-8);

    for (const msg of recentMessages) {
      const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
      // Gemini requiere que el primer mensaje en contents sea de rol 'user'
      if (contents.length === 0 && role !== 'user') continue;

      // Si hay mensajes consecutivos del mismo rol, unificar el texto
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n${msg.content}`;
      } else {
        contents.push({ role, parts: [{ text: msg.content }] });
      }
    }

    // Si por alguna razón contents quedó vacío, asegurar al menos la última consulta
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: lastUserMessage || 'Hola' }]
      });
    }

    // 5. Invocar Gemini con rotación de modelos y system_instruction oficial
    let botReply = '';
    let usedModel = '';
    let lastError: any = null;

    for (const model of GEMINI_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }]
            },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 800,
              topP: 0.95
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            botReply = candidateText;
            usedModel = model;
            break; // Éxito con este modelo
          }
        } else {
          const errDetail = await response.text();
          lastError = `${model} HTTP ${response.status}: ${errDetail.slice(0, 150)}`;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    // 6. Si todos los modelos de Gemini fallaron temporalmente
    if (!botReply) {
      console.warn('Fallo llamada a Gemini API:', lastError);
      botReply = `¡Hola! Soy **${botName}**. En este momento estoy consultando nuestra base de datos en InmoVAX. Puedo ayudarte a buscar departamentos o casas en anticrético, alquiler y venta en La Paz y otras ciudades de Bolivia, o explicarte cómo publicar tu inmueble. ¿En qué zona o qué presupuesto tienes en mente?`;
      usedModel = 'fallback-inmovax';
    }

    return NextResponse.json({
      success: true,
      message: botReply,
      suggestedProperties,
      model: usedModel
    });


  } catch (error: any) {
    console.error('Error general en /api/chat:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al procesar el mensaje',
        message: 'Disculpa, hubo una pequeña intermitencia. ¿Podrías reiterar tu consulta?'
      },
      { status: 500 }
    );
  }
}
