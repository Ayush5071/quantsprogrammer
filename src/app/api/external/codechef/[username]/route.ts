import { NextRequest, NextResponse } from 'next/server';
import fetchWithTimeout from '@/lib/server/fetchWithTimeout';
import { getCache, setCache } from '@/lib/server/cache';
import { allowRequest } from '@/lib/server/rateLimiter';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
    const cacheKey = `external:codechef:${username}`;
    const key = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!allowRequest(`external:codechef:${key}`, 6, 60_000)) return NextResponse.json({ error: 'rate limit' }, { status: 429 });
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    // Use unofficial API or scrape; best-effort via codechef-api.vercel.app
    const apiUrl = `https://codechef-api.vercel.app/handle/${encodeURIComponent(username)}`;
    let result: any = null;
    try {
      const res = await fetchWithTimeout(apiUrl, {}, 15000);
      if (res.ok) {
        const json = await res.json();
        if (json.success === false) return NextResponse.json({ error: 'not found' }, { status: 404 });
        result = { username, rating: json.currentRating || 0, stars: json.stars || null, globalRank: json.globalRank || null, problemsSolved: json.fullysolvedcount || 0, raw: json };
        setCache(cacheKey, result, 5 * 60 * 1000);
        return NextResponse.json(result);
      }
    } catch (err) {
      // fallback to HTML scraping via fetchWithTimeout and DOM parsing (server side)
    }

    // Fallback scrape using cheerio for robustness
    const url = `https://www.codechef.com/users/${encodeURIComponent(username)}`;
    const htmlRes = await fetchWithTimeout(url, { headers: { Accept: 'text/html' } }, 20000);
    if (!htmlRes.ok) return NextResponse.json({ error: 'codechef error'}, { status: 500 });
    const html = await htmlRes.text();
    try {
      const { load } = await import('cheerio');
      const $ = load(html as string);
      const ratingText = $('.rating-number').first().text().trim();
      const rating = ratingText ? Number(ratingText.replace(/,/g, '')) : 0;
      const solvedText = $('section.problems-solved, .problems-solved').first().text() || '';
      const solvedMatch = solvedText.match(/(\d[\d,]*)/);
      const problemsSolved = solvedMatch ? Number(solvedMatch[1].replace(/,/g, '')) : 0;
      result = { username, rating, problemsSolved };
      setCache(cacheKey, result, 5 * 60 * 1000);
      return NextResponse.json(result);
    } catch (e) {
      const ratingMatch = html.match(/rating\s*([0-9]+)/i);
      const solvedMatch = html.match(/Fully Solved\s*:\s*([0-9,]+)/i);
      result = { username, rating: ratingMatch ? Number(ratingMatch[1]) : 0, problemsSolved: solvedMatch ? Number(solvedMatch[1].replace(/,/g, '')) : 0 };
      setCache(cacheKey, result, 5 * 60 * 1000);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'failed' }, { status: 500 });
  }
}

