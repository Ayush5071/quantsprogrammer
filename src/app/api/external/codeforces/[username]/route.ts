import { NextRequest, NextResponse } from 'next/server';
import fetchWithTimeout from '@/lib/server/fetchWithTimeout';
import { getCache, setCache } from '@/lib/server/cache';
import { allowRequest } from '@/lib/server/rateLimiter';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
    const cacheKey = `external:codeforces:${username}`;
    const key = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!allowRequest(`external:codeforces:${key}`, 12, 60_000)) return NextResponse.json({ error: 'rate limit' }, { status: 429 });
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const infoUrl = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`;
    const statusUrl = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`;
    const ratingUrl = `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(username)}`;

    const [infoRes, statusRes, ratingRes] = await Promise.allSettled([
      fetchWithTimeout(infoUrl, {}, 15000),
      fetchWithTimeout(statusUrl, {}, 25000),
      fetchWithTimeout(ratingUrl, {}, 15000),
    ]);

    const out: any = { username };
    if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
      const j = await infoRes.value.json(); out.info = j.result?.[0] ?? null;
    }
    if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
      const sj = await statusRes.value.json(); out.submissions = sj.result ?? [];
      const solved = new Set<string>();
      out.submissions.forEach((s:any)=> { if (s.verdict === 'OK') solved.add(`${s.problem.contestId}-${s.problem.index}`); });
      out.problemsSolved = solved.size;
    }
    if (ratingRes.status === 'fulfilled' && ratingRes.value.ok) {
      const rj = await ratingRes.value.json(); out.ratingHistory = rj.result ?? [];
      out.contests = out.ratingHistory.length;
    }
    const result = { username, rating: out.info?.rating ?? 0, maxRating: out.info?.maxRating ?? 0, rank: out.info?.rank ?? 'unrated', problemsSolved: out.problemsSolved ?? 0, submissions: out.submissions ?? [], contests: out.contests ?? 0 };
    setCache(cacheKey, result, 5 * 60 * 1000);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'failed' }, { status: 500 });
  }
}

