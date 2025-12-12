import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractTextFromPDF, extractTextWithOCR } from '@/lib/server/pdfExtract';

function simpleGrammarScore(text: string) {
  if (!text) return 0;
  const sentences = text.split(/\.|\n|\?|!/).map(s => s.trim()).filter(Boolean);
  const avgLen = sentences.length ? Math.round(text.split(/\s+/).length / sentences.length) : 0;
  const penalty = Math.min(30, Math.max(0, (avgLen - 20) * 2));
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
  const lengthScore = Math.min(100, Math.max(20, Math.round(Math.min(1, resume.split(/\s+/).length / 300) * 100)));
  return Math.round((pct * 0.7) + (lengthScore * 0.3));
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const f = fd.get('file') as File | null;
    const jd = String(fd.get('jd') || '');
    if (!f) return NextResponse.json({ error: 'file required' }, { status: 400 });

    const ab = await f.arrayBuffer();
    const buf = Buffer.from(ab);

    let { text, pages } = await extractTextFromPDF(buf) as { text: string; pages: number };
    let ocrPerformed = false;
    if ((text || '').replace(/\s+/g, '').length < 200) {
      const o = await extractTextWithOCR(buf);
      text = o.text;
      pages = o.pages;
      ocrPerformed = true;
    }

    const grammarScore = simpleGrammarScore(text);
    const atsScore = simpleATSScore(text, jd);

    // Generate simple bullets and paragraphs deterministically
    const paragraphs = [
      `Summary: Resume appears ${text.split(/\s+/).length < 100 ? 'short' : 'adequate'} in length and ${ocrPerformed ? 'was OCR-processed' : 'contains selectable text'}.`,
      'Keywords: add more role-specific keywords from the job description, prioritize skills and tools.',
      'Achievements: quantify outcomes (e.g., improved X by Y%).',
      'Formatting: use simple, ATS-friendly layouts; avoid images or complex tables.',
      'Grammar: shorten long sentences and avoid repeated punctuation or ellipses.'
    ];

    const bullets = [
      { category: 'Keywords', items: jd ? jd.split(/\W+/).filter(Boolean).slice(0,10) : [] },
      { category: 'Formatting', items: ['Use standard fonts', 'Avoid headers/footers for important text', 'Prefer bullet points for achievements'] },
      { category: 'Achievements', items: ['Quantify results', 'Use active verbs', 'List tools and frameworks used with context'] },
      { category: 'Grammar', items: ['Shorten long sentences', 'Fix punctuation issues'] },
      { category: 'Structure', items: ['Contact + Summary + Experience + Education + Skills'] }
    ];

    const report = {
      atsScore: Math.round(atsScore),
      grammarScore: Math.round(grammarScore),
      paragraphs,
      bullets,
      summary: `ATS ${Math.round(atsScore)} / Grammar ${Math.round(grammarScore)}. Extracted ${text.split(/\s+/).length} words from ${pages} pages. OCR: ${ocrPerformed}`,
      extractedTextLength: text.length,
      ocrPerformed,
      pages,
    };

    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'processing failed' }, { status: 500 });
  }
}
