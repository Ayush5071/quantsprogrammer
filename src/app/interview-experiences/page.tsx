"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import useCurrentUser from "@/lib/useCurrentUser";
import { motion } from "framer-motion";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InterviewExperiencesPage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useCurrentUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/interview-experience");
        const exps = res.data.experiences || [];
        setExperiences(exps);

        const companies = Array.from(new Set(exps.map((e: any) => (e.company || "").trim()).filter(Boolean))) as string[];
        const tags = Array.from(new Set(exps.flatMap((e:any) => (e.tags || []).map((t:string)=>t.trim())).filter(Boolean))) as string[];
        setAvailableCompanies(companies);
        setAvailableTags(tags);
      } catch (err) {
        setExperiences([]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = experiences.filter(exp => {
    if (companyFilter && exp.company && exp.company.toLowerCase().indexOf(companyFilter.toLowerCase()) === -1) return false;
    if (tagFilter && !(exp.tags || []).map((t:string)=>t.toLowerCase()).includes(tagFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (exp.title || "").toLowerCase().includes(q) ||
        (exp.subtitle || "").toLowerCase().includes(q) ||
        (exp.author || "").toLowerCase().includes(q) ||
        (exp.company || "").toLowerCase().includes(q) ||
        (exp.content || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const canSubmit = !!user;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-3">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-blue-300">Community Experiences</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Interview Experiences</h1>
            <p className="text-gray-400 mt-2">Community-shared interview stories and tips — approved by admins.</p>
          </div>
          <div>
            <Link href={canSubmit ? '/interview-experiences/add' : '/auth/login-required'} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
              <span className="text-lg font-bold">+</span>
              Add your interview experience
            </Link>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search experiences by title, author or company..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#111118] border border-white/10 rounded-xl text-white" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <select value={companyFilter} onChange={(e)=>setCompanyFilter(e.target.value)} className="p-2 bg-[#111118] border border-white/10 rounded-lg text-white">
              <option value="">All companies</option>
              {availableCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={tagFilter} onChange={(e)=>setTagFilter(e.target.value)} className="p-2 bg-[#111118] border border-white/10 rounded-lg text-white">
              <option value="">All tags</option>
              {availableTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 text-gray-400"><BookOpen className="w-4 h-4 text-blue-400" /> <span>{experiences.length} Experiences</span></div>
          <div className="flex items-center gap-2 text-gray-400"><Sparkles className="w-4 h-4 text-pink-400" /> <span>Community Powered</span></div>
        </div>

        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">No experiences found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exp, index) => (
              <motion.article key={exp._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="group relative p-6 bg-[#111118] border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer" onClick={() => router.push(`/interview-experiences/${exp._id}`)}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">Experience</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">{exp.company || 'General'}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-pink-300 transition-colors">{exp.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{exp.subtitle || exp.content?.replace(/<[^>]+>/g, '').slice(0, 120) + '...'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">{(exp.author || 'U').charAt(0).toUpperCase()}</div>
                    <span className="text-sm text-gray-300">{exp.author || exp.authorId?.username}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-400">{new Date(exp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(exp.tags || []).slice(0,3).map((t:string)=> <span key={t} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">{t}</span>)}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// end of file
