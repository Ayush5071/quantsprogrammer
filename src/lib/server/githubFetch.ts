import { NextRequest } from 'next/server';
import fetchWithTimeout from './fetchWithTimeout';
import { getCache, setCache } from './cache';

const DEFAULT_TTL = 5 * 60 * 1000; // 5m

export async function fetchGitHubUserAndRepos(username: string) {
  const cacheKey = `github:user:${username}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `token ${token}`;

  // Fetch user and repos in parallel
  const userUrl = `https://api.github.com/users/${encodeURIComponent(username)}`;
  const reposUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100`;
  const eventsUrl = `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100`;

  const [uRes, rRes, eRes] = await Promise.allSettled([
    fetchWithTimeout(userUrl, { headers }, 15000),
    fetchWithTimeout(reposUrl, { headers }, 20000),
    fetchWithTimeout(eventsUrl, { headers }, 20000),
  ]);

  const output: any = { username };
  if (uRes.status === 'fulfilled' && uRes.value.ok) output.user = await uRes.value.json();
  if (rRes.status === 'fulfilled' && rRes.value.ok) output.repos = await rRes.value.json();
  if (eRes.status === 'fulfilled' && eRes.value.ok) output.events = await eRes.value.json();

  // Aggregate language bytes
  const languageMap: Record<string, number> = {};
  if (Array.isArray(output.repos)) {
    for (const r of output.repos) {
      const langUrl = r.languages_url;
      try {
        const lr = await fetchWithTimeout(langUrl, { headers }, 12000);
        if (lr.ok) {
          const langJson = await lr.json();
          Object.entries(langJson).forEach(([k, v]) => {
            languageMap[k] = (languageMap[k] || 0) + (typeof v === 'number' ? v : Number(v || 0));
          });
        }
      } catch (e) {}
    }
  }

  const topLanguages = Object.entries(languageMap).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([language, bytes])=>({language, bytes}));

  // Estimate commits from events
  const eventsByDay: Record<string, number> = {};
  if (Array.isArray(output.events)) {
    for (const ev of output.events) {
      const dt = new Date(ev.created_at).toISOString().slice(0,10);
      eventsByDay[dt] = (eventsByDay[dt] || 0) + 1;
    }
  }

  const repoCommitCounts = Array.isArray(output.repos) ? output.repos.slice(0,50).map((r: any) => ({ repo: r.full_name, commitCount: null, stars: r.stargazers_count || 0, size: r.size || 0, html_url: r.html_url })) : [];
  const totalStars = Array.isArray(output.repos) ? output.repos.reduce((s:number,r:any)=> s + (r.stargazers_count||0),0) : 0;
  const totalRepos = output.repos?.length ?? 0;

  const result = { ...output, topLanguages, eventsByDay, repoCommitCounts, totalStars, totalRepos };
  setCache(cacheKey, result, DEFAULT_TTL);
  return result;
}

export default { fetchGitHubUserAndRepos };
