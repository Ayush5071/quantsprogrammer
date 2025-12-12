import { NextRequest, NextResponse } from 'next/server';
import fetchWithTimeout from '@/lib/server/fetchWithTimeout';
import { getCache, setCache } from '@/lib/server/cache';
import { allowRequest } from '@/lib/server/rateLimiter';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
    const cacheKey = `external:hackerrank:${username}`;
    const key = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!allowRequest(`external:hackerrank:${key}`, 6, 60_000)) return NextResponse.json({ error: 'rate limit' }, { status: 429 });
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    // HackerRank API is unreliable; best-effort parse
    const url = `https://www.hackerrank.com/${encodeURIComponent(username)}`;
    const res = await fetchWithTimeout(url, { headers: { Accept: 'text/html' } }, 20000);
    if (!res.ok) return NextResponse.json({ error: 'unavailable' }, { status: 500 });
    const html = await res.text();
    try {
      const { load } = await import('cheerio');
      const $ = load(html as string);
      const solvesText = $('div.hr-problems-solved, .problems-solved, .challenge-solved-count').first().text() || '';
      const solvesMatch = solvesText.match(/(\d[\d,]*)/);
      const solves = solvesMatch ? Number(solvesMatch[1].replace(/,/g, '')) : 0;
      const badges = $('.badge-card').map((i, el) => $(el).text().trim()).get();
      const result = { username, problemsSolved: solves, badges: badges || [], rawHtml: html.slice(0,2000) };
      setCache(cacheKey, result, 5 * 60 * 1000);
      return NextResponse.json(result);
    } catch (e) {
      const solves = (html.match(/Problems Solved\s*:\s*([0-9,]+)/i) || [])[1];
      const badges = Array.from(html.matchAll(/class=\"badge-card.*?>(.*?)<\//g)).map(m=>m[1].trim());
      const result = { username, problemsSolved: solves ? Number(solves.replace(/,/g,'')) : 0, badges: badges || [], rawHtml: html.slice(0,2000) };
      setCache(cacheKey, result, 5 * 60 * 1000);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'failed' }, { status: 500 });
  }
}

