import { NextRequest, NextResponse } from 'next/server';
import { parseAISearchQuery } from '@/lib/aiSearchParser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body?.query === 'string' ? body.query : '';

    const parsed = parseAISearchQuery(query);

    return NextResponse.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error('Error en API /api/search/ai:', error);
    return NextResponse.json(
      { success: false, error: 'Error procesando búsqueda inteligente' },
      { status: 500 }
    );
  }
}
