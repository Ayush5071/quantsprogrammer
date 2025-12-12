"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Heatmap from './Heatmap';

type Day = { day: string; value: number };

export default function ProfileDashboardClient({ profile, githubData, leetData, cfData, ccData, hrData, heData }: any) {
  // derived
  const languageMap: Record<string, number> = {};
  if (githubData?.topLanguages) {
    githubData.topLanguages.forEach((l: any) => { languageMap[l.language] = (languageMap[l.language] || 0) + (l.bytes || l.count || 0); });
  } else if (githubData?.repoLanguages) {
    githubData.repoLanguages.forEach((rl: any) => { Object.entries(rl.languages || {}).forEach(([k,v])=>{ languageMap[k] = (languageMap[k]||0) + Number(v||0); }); });
  }
  const topLanguages = Object.entries(languageMap).map(([language, bytes])=>({language, bytes})).sort((a,b)=>b.bytes-a.bytes).slice(0,12);

  const topRepos = githubData?.repoCommitCounts?.length ? githubData.repoCommitCounts.sort((a:any,b:any)=>((b.commitCount||0)*3 + (b.stars||0)) - ((a.commitCount||0)*3 + (a.stars||0))).slice(0,2) : (githubData?.repos||[]).sort((a:any,b:any)=>(b.stargazers_count||0)-(a.stargazers_count||0)).slice(0,2).map((r:any)=>({ repo: r.full_name, stars: r.stargazers_count, html_url: r.html_url, commitCount: r.commitCount ?? null, languages: r.languages }));

  // heatmaps
  const githubHeatmap: Day[] = githubData?.eventsByDay ? Object.entries(githubData.eventsByDay).map(([day,val])=>({ day, value: Number(val)||0 })) : [];

  const combinedMap: Record<string, number> = {};
  (leetData?.calendarArr||[]).forEach((d:any)=>{ combinedMap[d.day] = (combinedMap[d.day]||0) + (d.value||0); });
  (cfData?.submissions||[]).forEach((s:any)=>{ try{ const d=new Date((s.creationTimeSeconds? s.creationTimeSeconds*1000: s.creationTimeSeconds)).toISOString().slice(0,10); combinedMap[d] = (combinedMap[d]||0)+1;}catch(e){} });
  const combinedArr = Object.entries(combinedMap).map(([day, value])=>({ day, value }));

  const achievements: any[] = [];
  if (Array.isArray(profile.achievements)) achievements.push(...profile.achievements);
  if (leetData?.matched?.funFacts) achievements.push(...leetData.matched.funFacts);
  if (hrData?.badges) achievements.push(...hrData.badges);
  if (topRepos.length) achievements.push(...topRepos.map((r:any)=>({ title: r.repo || r.name, type: 'repo' })));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0b0b11] border border-white/5 rounded-2xl p-6 flex gap-6 items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/5">
            {profile.profilePhoto?.url ? <Image src={profile.profilePhoto.url} alt={profile.fullName || profile.username} width={112} height={112} className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-4xl font-bold">{(profile.username||'?')[0].toUpperCase()}</div>}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold">{profile.fullName || profile.username}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-sm text-gray-400">@{profile.username}</div>
              <div className="text-xs text-gray-500">•</div>
              <div className="text-sm text-green-400">{profile.isPublicProfile ? 'Public' : 'Private'}</div>
            </div>
            <p className="mt-3 text-sm text-gray-300 max-w-2xl">{profile.bio ?? 'No bio provided.'}</p>
          </div>

          <div className="w-72">
            <div className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
              <div className="text-xs text-gray-400">GitHub Repos</div>
              <div className="text-2xl font-bold">{(githubData?.totalRepos ?? profile.codingProfiles?.github?.stats?.publicRepos ?? 0).toLocaleString()}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-xs text-gray-400">Commits</div>
                  <div className="font-semibold">{(githubData?.repoCommitCounts?.reduce((s:any,r:any)=>s+(r.commitCount||0),0) ?? profile.codingProfiles?.github?.stats?.totalCommits ?? 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Stars</div>
                  <div className="font-semibold">{(githubData?.totalStars ?? profile.codingProfiles?.github?.stats?.totalStars ?? 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Followers</div>
                  <div className="font-semibold">{(githubData?.user?.followers ?? profile.codingProfiles?.github?.stats?.followers ?? 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111118] p-4 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold mb-3">Connected Platforms</h3>
              <div className="space-y-3">
                {['github','leetcode','codeforces','codechef','hackerrank','hackerearth'].map((plat)=>{
                  const p = profile.codingProfiles?.[plat];
                  if (!p || !p.connected) return null;
                  const solves = p.stats?.totalSolved ?? p.stats?.problemsSolved ?? 0;
                  const rating = p.stats?.rating ?? p.stats?.ranking ?? p.stats?.contestRating ?? '-';
                  return (<div key={plat} className="flex items-center justify-between bg-[#0b0b11] p-3 rounded-lg border border-white/5"><div><div className="text-sm font-semibold capitalize">{plat}</div><div className="text-xs text-gray-400">@{p.username}</div></div><div className="text-right"><div className="text-sm text-gray-400">Solves</div><div className="font-bold">{solves}</div><div className="text-xs text-gray-400 mt-1">Rating: {rating}</div></div></div>);
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111118] p-4 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold mb-3">Top Languages</h3>
              {topLanguages.length === 0 ? (<div className="text-sm text-gray-400">No language data available.</div>) : (<div className="space-y-3">{topLanguages.map((l:any,idx:number)=>{ const pct = Math.min(100, Math.round((l.bytes/(topLanguages[0]?.bytes||1))*100)); return (<div key={idx} className="flex items-center gap-3"><div className="w-28 text-xs text-gray-300">{l.language}</div><div className="flex-1 bg-[#0b0b11] rounded-full h-3 overflow-hidden"><div className="h-3" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#16a34a,#059669)' }} /></div><div className="w-10 text-right text-xs">{l.bytes.toLocaleString()}</div></div>); })}</div>)}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111118] p-4 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold mb-3">Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0b0b11] p-3 rounded-lg text-center"><div className="text-xs text-gray-400">Total Solved</div><div className="text-2xl font-bold">{(profile.stats?.totalProblemsSolved ?? 0).toLocaleString()}</div></div>
                <div className="bg-[#0b0b11] p-3 rounded-lg text-center"><div className="text-xs text-gray-400">Connected</div><div className="text-2xl font-bold">{(profile.stats?.connectedPlatforms ?? 0).toLocaleString()}</div></div>
                <div className="bg-[#0b0b11] p-3 rounded-lg text-center"><div className="text-xs text-gray-400">GitHub Stars</div><div className="text-2xl font-bold">{(profile.stats?.githubStars ?? 0).toLocaleString()}</div></div>
                <div className="bg-[#0b0b11] p-3 rounded-lg text-center"><div className="text-xs text-gray-400">LeetCode Rank</div><div className="text-2xl font-bold">{(profile.stats?.leetcodeRanking ?? 0).toLocaleString()}</div></div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111118] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Activity Heatmaps</h3><div className="text-sm text-gray-400">last 30 days • green = more activity</div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><div className="text-sm text-gray-300 mb-3">GitHub Contribution-like</div><div className="bg-[#0b0b11] p-3 rounded-lg border border-white/5"><div className="p-1"><Heatmap days={githubHeatmap} size={10} color="#10b981" /></div><div className="text-xs text-gray-400 mt-2">GitHub-only contribution estimate.</div></div></div>
                <div><div className="text-sm text-gray-300 mb-3">Combined Platforms</div><div className="bg-[#0b0b11] p-3 rounded-lg border border-white/5"><div className="p-1"><Heatmap days={combinedArr} size={10} color="#34d399" /></div><div className="text-xs text-gray-400 mt-2">Combined activity across connected platforms (estimate).</div></div></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111118] p-4 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold mb-3">Projects & Repos (GitHub)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="p-3 bg-[#0b0b11] rounded-lg border border-white/5"><div className="text-xs text-gray-400">Total Repos</div><div className="text-2xl font-bold">{(githubData?.totalRepos ?? 0).toLocaleString()}</div></div><div className="p-3 bg-[#0b0b11] rounded-lg border border-white/5"><div className="text-xs text-gray-400">Top Language</div><div className="text-2xl font-bold">{topLanguages[0]?.language ?? '—'}</div></div><div className="p-3 bg-[#0b0b11] rounded-lg border border-white/5"><div className="text-xs text-gray-400">Stars</div><div className="text-2xl font-bold">{(githubData?.totalStars ?? 0).toLocaleString()}</div></div></div>
              <div className="mt-4">{topRepos.length === 0 ? (<div className="text-sm text-gray-400">No top repos found.</div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{topRepos.map((r:any,idx:number)=>(<div key={idx} className="p-3 bg-[#0b0b11] rounded-lg border border-white/5"><a href={r.html_url ?? `https://github.com/${r.repo}`} target="_blank" rel="noreferrer" className="text-blue-400 font-semibold break-all">{r.repo ?? r.full_name}</a><div className="text-xs text-gray-400 mt-1">Commits: {r.commitCount ?? 'N/A'} • Stars: {r.stars ?? 'N/A'}</div>{r.languages && Object.keys(r.languages||{}).length>0 && (<div className="text-xs text-gray-300 mt-2">Languages: {Object.keys(r.languages).join(', ')}</div>)}</div>))}</div>)}</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111118] p-4 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold mb-3">Achievements & Badges</h3>
              <div className="flex flex-wrap gap-3">{achievements.length ? achievements.slice(0,8).map((a:any,i:number)=>(<div key={i} className="p-3 bg-[#0b0b11] rounded-lg border border-white/5 text-sm">{typeof a === 'string' ? a : a.title || a}</div>)) : (<div className="text-sm text-gray-400">No achievements available to display.</div>)}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
