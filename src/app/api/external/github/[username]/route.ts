import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubUserAndRepos } from '@/lib/server/githubFetch';
import { getCache, setCache } from '@/lib/server/cache';
import { allowRequest } from '@/lib/server/rateLimiter';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
    const key = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!allowRequest(`external:github:${key}`, 20, 60_000)) return NextResponse.json({ error: 'rate limit' }, { status: 429 });

    const cacheKey = `external:github:${username}`;
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const data = await fetchGitHubUserAndRepos(username);
    setCache(cacheKey, data, 5 * 60 * 1000);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'failed' }, { status: 500 });
  }
}

