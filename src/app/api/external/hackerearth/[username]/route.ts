import { NextRequest, NextResponse } from 'next/server';
import fetchWithTimeout from '@/lib/server/fetchWithTimeout';
import { getCache, setCache } from '@/lib/server/cache';
import { allowRequest } from '@/lib/server/rateLimiter';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
    const cacheKey = `external:hackerearth:${username}`;
    const key = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!allowRequest(`external:hackerearth:${key}`, 6, 60_000)) return NextResponse.json({ error: 'rate limit' }, { status: 429 });
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const url = `https://www.hackerearth.com/@${encodeURIComponent(username)}`;
    const res = await fetchWithTimeout(url, { headers: { Accept: 'text/html' } }, 20000);
    if (!res.ok) return NextResponse.json({ error: 'unavailable' }, { status: 500 });
    const html = await res.text();
    try {
      const { load } = await import('cheerio');
      const $ = load(html as string);
      const solvesText = $('div.profile-stats, .problems-solved').first().text() || '';
      const solvesMatch = solvesText.match(/(\d[\d,]*)/);
      const ratingText = $('.rating, .profile-rating').first().text() || '';
      const ratingMatch = ratingText.match(/(\d+)/);
      const result = { username, problemsSolved: solvesMatch ? Number(solvesMatch[1].replace(/,/g,'')) : undefined, rating: ratingMatch ? Number(ratingMatch[1]) : undefined, rawHtml: html.slice(0,2000) };
      setCache(cacheKey, result, 5 * 60 * 1000);
      return NextResponse.json(result);
    } catch (e) {
      const solvesMatch = html.match(/Problems Solved\s*:\s*([0-9,]+)/i);
      const ratingMatch = html.match(/rating\s*(\d+)/i);
      const result = { username, problemsSolved: solvesMatch ? Number(solvesMatch[1].replace(/,/g,'')) : undefined, rating: ratingMatch ? Number(ratingMatch[1]) : undefined, rawHtml: html.slice(0,2000) };
      setCache(cacheKey, result, 5 * 60 * 1000);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'failed' }, { status: 500 });
  }
}

