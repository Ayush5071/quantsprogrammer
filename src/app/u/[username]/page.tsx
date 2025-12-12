import React from 'react';
import ProfileDashboardClient from '@/components/ui/ProfileDashboardClient';

export const dynamic = 'force-dynamic';

// Server-side page: fetch public profile and platform data in parallel
export default async function UProfilePage({ params }: { params: { username: string } }) {
  const username = params.username;

  // fetch public profile (server-side)
  const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/users/profile/${encodeURIComponent(username)}`, { cache: 'no-store' }).catch(() => null);
  const profileJson = profileRes && profileRes.ok ? await profileRes.json() : null;
  const profile = profileJson?.profile ?? null;

  if (!profile) {
    return (<div className="min-h-screen flex items-center justify-center text-red-400">Profile not found</div>);
  }

  // build fetches for connected platforms
  const base = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/external`;
  const toFetch: { key: string; url: string }[] = [];
  if (profile.codingProfiles?.github?.connected && profile.codingProfiles.github.username) toFetch.push({ key: 'github', url: `${base}/github/${encodeURIComponent(profile.codingProfiles.github.username)}` });
  if (profile.codingProfiles?.leetcode?.connected && profile.codingProfiles.leetcode.username) toFetch.push({ key: 'leetcode', url: `${base}/leetcode/${encodeURIComponent(profile.codingProfiles.leetcode.username)}` });
  if (profile.codingProfiles?.codeforces?.connected && profile.codingProfiles.codeforces.username) toFetch.push({ key: 'codeforces', url: `${base}/codeforces/${encodeURIComponent(profile.codingProfiles.codeforces.username)}` });
  if (profile.codingProfiles?.codechef?.connected && profile.codingProfiles.codechef.username) toFetch.push({ key: 'codechef', url: `${base}/codechef/${encodeURIComponent(profile.codingProfiles.codechef.username)}` });
  if (profile.codingProfiles?.hackerrank?.connected && profile.codingProfiles.hackerrank.username) toFetch.push({ key: 'hackerrank', url: `${base}/hackerrank/${encodeURIComponent(profile.codingProfiles.hackerrank.username)}` });
  if (profile.codingProfiles?.hackerearth?.connected && profile.codingProfiles.hackerearth.username) toFetch.push({ key: 'hackerearth', url: `${base}/hackerearth/${encodeURIComponent(profile.codingProfiles.hackerearth.username)}` });
  // fetch external platform data in parallel (server-side)
  const settled = await Promise.allSettled(toFetch.map(t => fetch(t.url, { cache: 'no-store' })));
  const results: Record<string, any> = {};
  for (let i = 0; i < toFetch.length; i++) {
    const key = toFetch[i].key;
    const r = settled[i];
    if (r.status === 'fulfilled' && r.value.ok) {
      try { results[key] = await r.value.json(); } catch (e) { results[key] = null; }
    } else {
      results[key] = null;
    }
  }

  return (
    // render client dashboard with data passed as props
    <ProfileDashboardClient profile={profile} githubData={results.github} leetData={results.leetcode} cfData={results.codeforces} ccData={results.codechef} hrData={results.hackerrank} heData={results.hackerearth} />
  );
}
