import { NextRequest, NextResponse } from 'next/server';
import fetchWithTimeout from '@/lib/server/fetchWithTimeout';
import { getCache, setCache } from '@/lib/server/cache';
import { allowRequest } from '@/lib/server/rateLimiter';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
    const cacheKey = `external:leetcode:${username}`;
    const key = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!allowRequest(`external:leetcode:${key}`, 12, 60_000)) return NextResponse.json({ error: 'rate limit' }, { status: 429 });
    const cached = getCache<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile { ranking }
          submitStatsGlobal { acSubmissionNum { difficulty count } }
          userCalendar { submissionCalendar }
        }
      }
    `;
    const res = await fetchWithTimeout('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    }, 20000);

    if (!res.ok) return NextResponse.json({ error: 'leetcode failed', status: res.status }, { status: 500 });
    const json = await res.json();
    const matched = json?.data?.matchedUser ?? null;
    // calendar to arr
    let calendarArr: Array<{ day: string; value: number }> = [];
    try {
      const calendarObj = matched?.userCalendar?.submissionCalendar ?? null;
      if (calendarObj && typeof calendarObj === 'object') {
        Object.entries(calendarObj).forEach(([k, v]) => {
          const epoch = Number(k);
          if (!isNaN(epoch)) {
            const d = new Date(epoch * 1000).toISOString().slice(0, 10);
            calendarArr.push({ day: d, value: Number(v || 0) });
          }
        });
      }
    } catch (e) {}

    const result = {
      username,
      ranking: matched?.profile?.ranking ?? 0,
      totalSolved: matched?.submitStatsGlobal?.acSubmissionNum?.reduce((acc:any, cur:any)=> acc + (cur.count||0),0) ?? 0,
      easy: matched?.submitStatsGlobal?.acSubmissionNum?.find((s:any)=>s.difficulty=='Easy')?.count ?? 0,
      medium: matched?.submitStatsGlobal?.acSubmissionNum?.find((s:any)=>s.difficulty=='Medium')?.count ?? 0,
      hard: matched?.submitStatsGlobal?.acSubmissionNum?.find((s:any)=>s.difficulty=='Hard')?.count ?? 0,
      calendarArr,
      raw: json,
    };
    setCache(cacheKey, result, 5 * 60 * 1000);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 });
  }
}

