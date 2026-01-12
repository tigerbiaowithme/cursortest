import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, getCountryFromIP, getLanguageFromCountry } from '@/lib/geoip';

// 标记为动态路由，因为使用了 request.headers
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const country = getCountryFromIP(ip);
    const language = getLanguageFromCountry(country);

    return NextResponse.json({
      ip,
      country,
      language,
    });
  } catch (error) {
    console.error('Location detection error:', error);
    return NextResponse.json(
      { language: 'en', country: 'US' },
      { status: 200 }
    );
  }
}
