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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    loadPuterScript().then(() => setPuterLoaded(true)).catch(() => setPuterLoaded(false));
  }, []);

  useEffect(() => {
    if (result) setActiveSection('summary');
  }, [result]);

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

      // Premium path: call server-side scoring (either PDF route was used earlier or send resume text)
      // If a file was uploaded we already handled it above; for pasted text send JSON to server
      if (resumeText) {
        const res = await fetch('/api/ats/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText, jd: jdText }) });
        if (!res.ok) throw new Error('Server analysis failed');
        const json = await res.json();
        setResult({ mode: 'premium', ...json });
        setLoading(false);
        return;
      }

      // fallback to Puter if no resume text (should be uncommon)
      if (!puterLoaded || !window.puter?.ai?.chat) {
        throw new Error('AI client not available');
      }

      const prompt = `You are an expert resume reviewer and ATS optimizer. Given the resume text below and the optional job description, provide a concise JSON report.`;
      const aiResponse = await window.puter.ai.chat(prompt, { model: 'claude-haiku-4-5' });
      // best-effort parse and display if CDN used
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
            try { return JSON.stringify(c); } catch (_) { return String(c); }
          }).join('\n\n');
        } else {
          try { text = JSON.stringify(msg); } catch (_) { text = String(msg); }
        }
      } else {
        text = String(aiResponse);
      }

      try {
        const parsed = JSON.parse(text);
        setResult({ mode: 'premium', ...parsed });
      } catch (e) {
        setResult({ mode: 'premium', summary: text });
      }
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
          {isPremium && (
            <button onClick={async () => {
              setError(null);
              setResult(null);
              setLoading(true);
              try {
                if (!resumeText) { setError('Please paste a resume for LLM review'); setLoading(false); return; }

                // Try Puter CDN first
                try {
                  await loadPuterScript();
                  if (!window.puter?.ai?.chat) throw new Error('Puter CDN not available');

                  const prompt = `You are a Senior ATS Engineer, Technical Recruiter, and Resume Coach\nwith experience screening resumes for FAANG, Tier-1 startups, and Fortune 500 companies.\n\nYour task is to deeply analyze:\n1) The provided RESUME\n2) The provided JOB DESCRIPTION (if present)\n\nYour response MUST be:\n- ATS-friendly\n- Recruiter-oriented\n- Brutally honest\n- Extremely actionable\n- Written as if advising a real hiring manager and candidate\n\nOUTPUT FORMAT (JSON ONLY)\n\n{ "scores": { "atsCompatibility": "number (0–100)", "grammarQuality": "number (0–100)", "keywordMatch": "number (0–100)", "impactAndMetrics": "number (0–100)", "readability": "number (0–100)", "formattingStructure": "number (0–100)" },\n\n  "overallVerdict": "1–2 line recruiter-style summary of how this resume would perform in ATS + human screening",\n\n  "jobDescriptionReview": { /* structured fields */ },\n\n  "detailedGuidelines": [ /* structured sections 1..10 */ ],\n\n  "missingCriticalKeywords": [],\n\n  "topActionItems": [],\n\n  "finalATSReadySummary": "Concise, ATS-optimized resume summary tailored to this JD"\n}\n\nResume:\n\n${resumeText}\n\nJob Description:\n\n${jdText}\n\nIMPORTANT RULES: Output valid JSON only (no markdown or extra text).`;

                  const aiResponse = await window.puter.ai.chat(prompt, { model: 'claude-haiku-4-5' });

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
                        try { return JSON.stringify(c); } catch (_) { return String(c); }
                      }).join('\n\n');
                    } else {
                      try { text = JSON.stringify(msg); } catch (_) { text = String(msg); }
                    }
                  } else {
                    text = String(aiResponse);
                  }

                  // Try parse JSON directly
                  let parsed: any = null;
                  try { parsed = JSON.parse(text); } catch (e) {
                    const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
                    if (m) {
                      try { parsed = JSON.parse(m[1]); } catch (e2) { parsed = null; }
                    }
                  }

                  if (parsed) {
                    setResult({ mode: 'premium', ...parsed });
                    setTimeout(() => document.getElementById('ats-results')?.scrollIntoView({behavior:'smooth'}), 120);
                    setLoading(false);
                    return;
                  } else {
                    // If Puter responded but not in JSON, show summary
                    setResult({ mode: 'premium', summary: text });
                    setTimeout(() => document.getElementById('ats-results')?.scrollIntoView({behavior:'smooth'}), 120);
                    setLoading(false);
                    return;
                  }
                } catch (e) {
                  // Puter CDN failed — do not fallback to server LLM; surface error to user
                  setError('Puter CDN failed: ' + (((e as any)?.message) || String(e)));
                  setLoading(false);
                  return;
                }

              } catch (outerErr:any) {
                setError(outerErr?.message || 'LLM failed');
              } finally { setLoading(false); }
            }} className="px-4 py-2 bg-indigo-600 rounded-md">LLM Review (Puter CDN)</button>
          )}
          <button onClick={() => { setResumeText(''); setJdText(''); setResult(null); }} className="px-3 py-2 bg-white/5 rounded">Reset</button>
        </div>

        {error && <div className="mt-4 text-red-400">{error}</div>}

        {result && (
          <div id="ats-results" className="mt-6 space-y-4">
            <div className="flex gap-6">
              <div className="w-72 hidden md:block">
                <div className="bg-[#06060a] p-3 rounded-lg border border-white/5 sticky top-24">
                  <div className="text-xs text-gray-400 mb-2">Report</div>
                  <button onClick={() => { document.getElementById('summary')?.scrollIntoView({behavior:'smooth'}); setActiveSection('summary'); }} className="block text-left text-sm text-gray-300 hover:text-white py-1">Summary</button>
                  <button onClick={() => { document.getElementById('jd-review')?.scrollIntoView({behavior:'smooth'}); setActiveSection('jd-review'); }} className="block text-left text-sm text-gray-300 hover:text-white py-1">Job Description</button>
                  <div className="text-xs text-gray-500 mt-2">Guidelines</div>
                  {result.detailedGuidelines?.map((g:any,i:number)=>(
                    <button key={i} onClick={() => { document.getElementById(`guideline-${i}`)?.scrollIntoView({behavior:'smooth'}); setActiveSection(`guideline-${i}`); }} className="block text-left text-sm text-gray-300 hover:text-white py-1">{g.heading}</button>
                  ))}
                  <button onClick={() => { document.getElementById('missing-keywords')?.scrollIntoView({behavior:'smooth'}); setActiveSection('missing-keywords'); }} className="block text-left text-sm text-gray-300 hover:text-white py-1">Missing Keywords</button>
                  <button onClick={() => { document.getElementById('top-actions')?.scrollIntoView({behavior:'smooth'}); setActiveSection('top-actions'); }} className="block text-left text-sm text-gray-300 hover:text-white py-1">Top Actions</button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div id="summary" className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">ATS Compatibility</div>
                      <div className="text-2xl font-bold">{result.scores?.atsCompatibility ?? result.scores?.ats ?? 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Grammar</div>
                      <div className="text-2xl font-bold">{result.scores?.grammarQuality ?? result.scores?.grammar ?? 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Keywords</div>
                      <div className="text-2xl font-bold">{result.scores?.keywordMatch ?? 'N/A'}</div>
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

                {result.jobDescriptionReview && (
                  <div id="jd-review" className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
                    <div className="text-sm text-gray-400 mb-2">Job Description Review</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm text-gray-200">Clarity: <strong className="text-white">{result.jobDescriptionReview.jdClarityScore}</strong></div>
                      <div className="text-sm text-gray-200">ATS Quality: <strong className="text-white">{result.jobDescriptionReview.jdATSQuality}</strong></div>
                      <div className="text-sm text-gray-200">Realism: <strong className="text-white">{result.jobDescriptionReview.jdRealism}</strong></div>
                    </div>
                    <div className="mt-3 text-sm text-gray-300">
                      <div className="font-semibold">Red Flags</div>
                      <ul className="list-disc ml-5 mt-1">{result.jobDescriptionReview.jdRedFlags.map((r:string,i:number)=>(<li key={i}>{r}</li>))}</ul>
                    </div>
                    {result.jobDescriptionReview.jdMissingDetails.length > 0 && (
                      <div className="mt-3 text-sm text-gray-300">
                        <div className="font-semibold">Missing Details</div>
                        <ul className="list-disc ml-5 mt-1">{result.jobDescriptionReview.jdMissingDetails.map((r:string,i:number)=>(<li key={i}>{r}</li>))}</ul>
                      </div>
                    )}
                  </div>
                )}

                {Array.isArray(result.detailedGuidelines) && result.detailedGuidelines.map((g:any,i:number)=> (
                  <div id={`guideline-${i}`} key={i} className={`bg-[#0b0b11] p-4 rounded-xl border border-white/5 transition ${activeSection===`guideline-${i}`? 'ring-2 ring-emerald-600':''}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400 font-semibold">{g.heading}</div>
                      <button onClick={() => { document.getElementById(`guideline-${i}`)?.scrollIntoView({behavior:'smooth'}); setActiveSection(`guideline-${i}`); }} className="text-xs text-gray-400 hover:text-white">View</button>
                    </div>
                    <div className="mt-2 text-sm text-gray-200">{g.whatATSLooksFor}</div>
                    <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-400">Add</div>
                        <ul className="list-disc ml-5 mt-1">{(g.whatToAdd||[]).map((a:string,ai:number)=>(<li key={ai}>{a}</li>))}</ul>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Avoid</div>
                        <ul className="list-disc ml-5 mt-1">{(g.whatToAvoid||[]).map((a:string,ai:number)=>(<li key={ai}>{a}</li>))}</ul>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Vocabulary</div>
                        <div className="mt-1 text-sm text-gray-200">{(g.recommendedVocabulary||[]).slice(0,8).join(', ')}</div>
                      </div>
                    </div>
                    {g.exampleImprovement && (
                      <div className="mt-3 text-sm bg-[#07070a] p-3 rounded">
                        <div className="text-xs text-gray-400">Example</div>
                        <div className="mt-1 text-sm text-gray-200"><strong>Before:</strong> {g.exampleImprovement.before}</div>
                        <div className="mt-1 text-sm text-gray-200"><strong>After:</strong> {g.exampleImprovement.after}</div>
                      </div>
                    )}
                  </div>
                ))}

                {result.missingCriticalKeywords && result.missingCriticalKeywords.length > 0 && (
                  <div id="missing-keywords" className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
                    <div className="text-sm text-gray-400 mb-2">Missing Critical Keywords</div>
                    <div className="flex flex-wrap gap-2">{result.missingCriticalKeywords.map((k:string,i:number)=>(<span key={i} className="bg-white/5 px-2 py-1 rounded text-sm text-gray-200">{k}</span>))}</div>
                  </div>
                )}

                {result.topActionItems && result.topActionItems.length > 0 && (
                  <div id="top-actions" className="bg-[#0b0b11] p-4 rounded-xl border border-white/5">
                    <div className="text-sm text-gray-400 mb-2">Top Action Items</div>
                    <ol className="list-decimal ml-5 text-sm text-gray-200">{result.topActionItems.map((t:string,i:number)=>(<li key={i}>{t}</li>))}</ol>
                  </div>
                )}

                {result.finalATSReadySummary && (
                  <div className="bg-gradient-to-r from-emerald-600/10 to-blue-500/5 p-4 rounded-xl border border-white/5">
                    <div className="text-sm text-gray-400">Final ATS-ready Summary</div>
                    <div className="mt-2 text-sm text-white">{result.finalATSReadySummary}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}      </div>
    </div>
  );
}
