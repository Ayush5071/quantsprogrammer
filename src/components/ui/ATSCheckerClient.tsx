"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Heatmap from './Heatmap';

declare global {
  interface Window { puter?: any; }
}

function loadPuterScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no-window'));
    if ((window as any).puter) return resolve();
    const s = document.createElement('script');
    s.src = 'https://js.puter.com/v2/';
    s.async = true;
    s.onload = () => setTimeout(() => resolve(), 50);
    s.onerror = (e) => reject(new Error('failed to load puter CDN'));
    document.head.appendChild(s);
  });
}

function simpleGrammarScore(text: string) {
  if (!text) return 0;
  const sentences = text.split(/\.|\n|\?|!/).map(s => s.trim()).filter(Boolean);
  const avgLen = sentences.length ? Math.round(text.split(/\s+/).length / sentences.length) : 0;
  // penalty for long sentences
  const penalty = Math.min(30, Math.max(0, (avgLen - 20) * 2));
  // basic spell-like heuristic: repeated punctuation
  const issues = (text.match(/\.{2,}|,,+|!!+/g) || []).length * 2;
  const score = Math.max(0, 100 - penalty - issues);
  return score;
}

function simpleATSScore(resume: string, jd: string) {
  if (!resume) return 0;
  const jdWords = (jd || '').toLowerCase().split(/\W+/).filter(Boolean);
  const resumeWords = resume.toLowerCase();
  const matches = jdWords.filter(w => resumeWords.includes(w)).length;
  const pct = jdWords.length ? Math.round((matches / jdWords.length) * 100) : 30;
  // length heuristic
  const lengthScore = Math.min(100, Math.max(20, Math.round(Math.min(1, resume.split(/\s+/).length / 300) * 100)));
  return Math.round((pct * 0.7) + (lengthScore * 0.3));
}

export default function ATSCheckerClient() {
  const [puterLoaded, setPuterLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isPremium, setIsPremium] = useState<boolean>(() => typeof window !== 'undefined' && !!localStorage.getItem('ats_premium'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPuterScript().then(() => setPuterLoaded(true)).catch(() => setPuterLoaded(false));
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setResumeFile(f);
    if (f.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => setResumeText(String(reader.result || ''));
      reader.readAsText(f);
    } else {
      // for pdfs we will upload to server on analysis
      setResumeText('');
    }
  }

  async function analyze() {
    setError(null);
    setResult(null);
    if (!resumeText && !resumeFile) { setError('Please paste or upload a resume.'); return; }
    setLoading(true);

    try {
      if (!isPremium) {
        // Limited free analysis (scores + short suggestions)
        const grammar = simpleGrammarScore(resumeText);
        const ats = simpleATSScore(resumeText, jdText);
        const suggestions = [];
        if (grammar < 70) suggestions.push('Consider shortening long sentences and fixing repeated punctuation.');
        if (ats < 60) suggestions.push('Add more keywords from the job description and quantify achievements.');
        setResult({ mode: 'free', scores: { grammar, ats }, suggestions, short: 'Upgrade to Premium for full 5-paragraph rewrite and in-depth scoring.' });
        setLoading(false);
        return;
      }

      // If a PDF file was provided, upload to server for extraction + scoring
      if (resumeFile && resumeFile.type === 'application/pdf') {
        const fd = new FormData();
        fd.append('file', resumeFile);
        fd.append('jd', jdText || '');
        const res = await fetch('/api/ats/process', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Upload failed');
        const json = await res.json();
        // Set result directly (server returns strict JSON report)
        setResult({ mode: 'premium', ...json });
        setLoading(false);
        return;
      }

      // Premium path: use Puter CDN's AI chat
      if (!puterLoaded || !window.puter?.ai?.chat) {
        throw new Error('AI client not available');
      }

      const prompt = `You are an expert resume reviewer and ATS optimizer. Given the resume text below and the optional job description, provide:
1) A single-line ATS compatibility score (0-100)
2) A single-line Grammar score (0-100)
3) Five detailed paragraphs each with actionable edits and a short before/after example where appropriate
4) A bulleted list of quick improvements grouped by: Keywords, Formatting, Achievements, Grammar, Structure

Respond as JSON with keys: atsScore, grammarScore, paragraphs (array of 5 strings), bullets (array), summary (short text).

Resume:\n\n${resumeText}\n\nJob Description:\n\n${jdText}\n
`;

      // call puter.ai.chat via CDN
      const aiResponse = await window.puter.ai.chat(prompt, { model: 'claude-haiku-4-5' });

      // Extract text robustly from different Puter response shapes
      let text = '';
      if (typeof aiResponse === 'string') {
        text = aiResponse;
      } else if (aiResponse?.text && typeof aiResponse.text === 'string') {
        text = aiResponse.text;
      } else if (aiResponse?.message) {
        const msg = aiResponse.message;
        if (typeof msg === 'string') {
          text = msg;
        } else if (Array.isArray(msg?.content)) {
          text = msg.content.map((c: any) => {
            if (typeof c === 'string') return c;
            if (typeof c?.text === 'string') return c.text;
            // sometimes content items are objects (json blocks) — stringify safely
            try { return JSON.stringify(c); } catch (_) { return String(c); }
          }).join('\n\n');
        } else {
          // fallback to a string
          try { text = JSON.stringify(msg); } catch (_) { text = String(msg); }
        }
      } else {
        text = String(aiResponse);
      }

      // try to parse JSON from text
      let parsed: any = null;
      try { parsed = JSON.parse(text); } catch (e) {
        // if not JSON, wrap in a fallback
        parsed = { atsScore: 0, grammarScore: 0, paragraphs: [text], bullets: [], summary: text };
      }

      // Normalize parsed fields to ensure strings (avoid rendering objects directly)
      const normalizeString = (v: any) => (v == null ? '' : (typeof v === 'string' ? v : JSON.stringify(v)));
      const normalized = {
        atsScore: parsed.atsScore ?? parsed.ats ?? parsed.scores?.ats ?? 0,
        grammarScore: parsed.grammarScore ?? parsed.scores?.grammar ?? 0,
        summary: normalizeString(parsed.summary ?? parsed.short ?? parsed.summaryText),
        paragraphs: Array.isArray(parsed.paragraphs) ? parsed.paragraphs.map((p: any) => normalizeString(p)) : [normalizeString(parsed.paragraphs ?? parsed.text ?? parsed.body ?? '')],
        bullets: Array.isArray(parsed.bullets) ? parsed.bullets.map((b: any) => normalizeString(b)) : [],
      };

      setResult({ mode: 'premium', ...normalized });
    } catch (e: any) {
      setError(e?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  function handlePurchase() {
    // Simple simulated purchase flow; replace with real checkout in production
    const ok = confirm('Purchase Premium ATS Checker for ₹10?');
    if (!ok) return;
    localStorage.setItem('ats_premium', '1');
    setIsPremium(true);
    alert('Purchase successful — Premium unlocked!');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">ATS Checker</h1>
          <div>
            <button onClick={() => { if (!isPremium) handlePurchase(); else alert('You are premium'); }} className="px-4 py-2 bg-emerald-600 rounded-md">{isPremium ? 'Premium Active' : 'Upgrade ₹10'}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
            <div className="text-sm text-gray-400 mb-2">Resume (paste or upload .txt/.pdf text)</div>
            <textarea value={resumeText} onChange={(e)=>setResumeText(e.target.value)} rows={12} className="w-full bg-[#07070a] p-3 rounded-md text-sm" />
            <div className="mt-2 flex items-center gap-2">
              <input type="file" accept=".txt,.pdf" onChange={handleFile} />
              <button onClick={() => { setResumeText(''); setResumeFile(null); }} className="px-3 py-1 bg-white/5 rounded">Clear</button>
            </div>
            {resumeFile && <div className="mt-2 text-xs text-gray-400">Selected file: {resumeFile.name}</div>}
          </div>

          <div className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
            <div className="text-sm text-gray-400 mb-2">Job Description (optional)</div>
            <textarea value={jdText} onChange={(e)=>setJdText(e.target.value)} rows={12} className="w-full bg-[#07070a] p-3 rounded-md text-sm" />
            <div className="mt-3 text-xs text-gray-400">Providing the JD improves keyword-matching and ATS suggestions.</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={analyze} disabled={loading} className="px-4 py-2 bg-emerald-600 rounded-md">{loading ? 'Analyzing...' : (isPremium ? 'Analyze (Premium)' : 'Analyze (Free)')}</button>
          <button onClick={() => { setResumeText(''); setJdText(''); setResult(null); }} className="px-3 py-2 bg-white/5 rounded">Reset</button>
        </div>

        {error && <div className="mt-4 text-red-400">{error}</div>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">ATS Score</div>
                  <div className="text-2xl font-bold">{result.scores?.ats ?? result.atsScore ?? 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Grammar Score</div>
                  <div className="text-2xl font-bold">{result.scores?.grammar ?? result.grammarScore ?? 'N/A'}</div>
                </div>
              </div>
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-3 text-sm text-gray-300">
                  <div className="font-semibold">Quick suggestions:</div>
                  <ul className="list-disc ml-5 mt-1">{result.suggestions.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ul>
                </div>
              )}
              {result.summary && <div className="mt-3 text-sm text-gray-300">{result.summary}</div>}
            </div>

            {result.paragraphs && result.paragraphs.length > 0 && (
              <div className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
                <div className="text-sm text-gray-400 mb-2">Detailed suggestions</div>
                <div className="space-y-3">{result.paragraphs.map((p:string,i:number)=> (<div key={i} className="text-sm text-gray-200">{p}</div>))}</div>
              </div>
            )}

            {result.bullets && result.bullets.length > 0 && (
              <div className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
                <div className="text-sm text-gray-400 mb-2">Actionable bullets</div>
                <ul className="list-disc ml-5 text-sm text-gray-200">{result.bullets.map((b:string,i:number)=>(<li key={i}>{b}</li>))}</ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
