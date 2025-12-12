function tokens(text = '') {
  return String(text || '').toLowerCase().split(/\W+/).filter(Boolean);
}

function unique(arr: string[]) {
  return Array.from(new Set(arr));
}

function clamp(n: number, a = 0, b = 100) { return Math.max(a, Math.min(b, Math.round(n))); }

export function simpleGrammarScore(text: string) {
  if (!text) return 0;
  const sentences = text.split(/\.|\n|\?|!/).map(s => s.trim()).filter(Boolean);
  const avgLen = sentences.length ? Math.round(text.split(/\s+/).length / sentences.length) : 0;
  const penalty = Math.min(30, Math.max(0, (avgLen - 20) * 2));
  const issues = (text.match(/\.{2,}|,,+|!!+/g) || []).length * 2;
  const score = Math.max(0, 100 - penalty - issues);
  return clamp(score);
}

export function formattingStructureScore(text: string) {
  const headings = ['experience', 'work experience', 'projects', 'skills', 'education', 'summary', 'contact'];
  const present = headings.filter(h => text.toLowerCase().includes(h)).length;
  return clamp((present / headings.length) * 100);
}

export function impactAndMetricsScore(text: string) {
  const numMatches = (text.match(/\b\d{1,3}%|\b\d{1,6}\b/g) || []).length;
  return clamp(Math.min(100, numMatches * 12 + (numMatches > 0 ? 10 : 0)));
}

export function readabilityScore(text: string) {
  const sentences = text.split(/\.|\n|\?|!/).map(s => s.trim()).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const avgSentLen = sentences.length ? words / sentences.length : words;
  // Prefer 12-18 words per sentence
  const diff = Math.abs(avgSentLen - 15);
  const score = clamp(100 - diff * 6);
  return score;
}

export function keywordMatchScore(resume: string, jd: string) {
  const jdTokens = unique(tokens(jd));
  if (!jdTokens.length) return 50; // neutral when no JD
  const r = resume.toLowerCase();
  const matches = jdTokens.filter(t => r.includes(t)).length;
  return clamp((matches / jdTokens.length) * 100);
}

export function atsCompatibilityScore(scores: { keywordMatch: number; formattingStructure: number; impactAndMetrics: number; readability: number; grammarQuality: number; }) {
  // Weighted composite
  const { keywordMatch, formattingStructure, impactAndMetrics, readability, grammarQuality } = scores;
  const val = (keywordMatch * 0.36) + (formattingStructure * 0.2) + (impactAndMetrics * 0.16) + (readability * 0.14) + (grammarQuality * 0.14);
  return clamp(val);
}

export function extractTopSkills(resume: string, limit = 8) {
  const common = ['python','javascript','typescript','react','node','aws','docker','kubernetes','sql','java','c++','golang'];
  const t = tokens(resume);
  const counts: Record<string, number> = {};
  t.forEach(w => counts[w] = (counts[w] || 0) + 1);
  const skills = common.filter(c => c && resume.toLowerCase().includes(c)).slice(0, limit);
  if (skills.length) return skills;
  // Fallback: top tokens that look like tech words
  return unique(Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(e=>e[0]).slice(0,limit));
}

export function scoreResume(resumeText: string, jdText: string) {
  const grammarQuality = simpleGrammarScore(resumeText);
  const formattingStructure = formattingStructureScore(resumeText);
  const impactAndMetrics = impactAndMetricsScore(resumeText);
  const readability = readabilityScore(resumeText);
  const keywordMatch = keywordMatchScore(resumeText, jdText);
  const atsCompatibility = atsCompatibilityScore({ keywordMatch, formattingStructure, impactAndMetrics, readability, grammarQuality });

  const jdTokens = unique(tokens(jdText));
  const missingCriticalKeywords = jdTokens.filter(k => !resumeText.toLowerCase().includes(k)).slice(0, 12);

  const topSkills = extractTopSkills(resumeText);

  const overallVerdict = atsCompatibility > 75 ? 'Strong ATS & human match — likely to pass initial screens.' : (atsCompatibility > 50 ? 'Moderate — will need targeted keyword and metrics tuning.' : 'Weak — will likely be filtered out by ATS without improvements.');

  // Build detailedGuidelines sections (10 sections)
  const guidelines = [] as any[];

  guidelines.push({
    heading: '1. Resume Summary / Objective',
    whatATSLooksFor: 'Concise, keyword-rich summary at top; role/title & top skills.',
    whatToAdd: ['One-line title + 2-3 bullet summary using top skills', 'Include target role or industry keywords from JD'],
    whatToAvoid: ['Generic statements (e.g., "hardworking" without specifics)', 'Long paragraphs that ATS may deprioritize'],
    recommendedVocabulary: ['Experienced', 'Delivered', 'Built', 'Led', 'Designed'],
    exampleImprovement: {
      before: (resumeText.split('\n').slice(0,3).join(' ') || 'No summary present'),
      after: `Experienced ${topSkills[0] || 'software'} engineer focusing on ${topSkills.slice(0,3).join(', ')}; delivered measurable product and performance improvements.`
    }
  });

  guidelines.push({
    heading: '2. Skills Section (Technical & Soft Skills)',
    whatATSLooksFor: 'A dedicated skills list with comma-separated technical skills and frameworks.',
    whatToAdd: ['Top technical skills at the top in a single line', 'Separate soft skills and tools'],
    whatToAvoid: ['Embedding skills inside paragraph text only', 'Using images or tables for skills'],
    recommendedVocabulary: ['Proficient in', 'Experienced with', 'Skilled in'],
    exampleImprovement: {
      before: 'Skills: (scattered in bullets)'.slice(0,120),
      after: `Skills: ${topSkills.join(', ')}`
    }
  });

  guidelines.push({
    heading: '3. Work Experience',
    whatATSLooksFor: 'Role, Company, Dates, 3-5 bullet points per role with impact & metrics.',
    whatToAdd: ['Start bullets with strong action verbs', 'Add metrics (%/numbers) for each key achievement'],
    whatToAvoid: ['Vague responsibilities without outcomes', 'Personal pronouns (I, we)'],
    recommendedVocabulary: ['Reduced', 'Improved', 'Delivered', 'Scaled', 'Led'],
    exampleImprovement: {
      before: 'Worked on feature X and improved performance',
      after: 'Reduced response latency by 45% for Feature X by optimizing DB queries and introducing caching.'
    }
  });

  guidelines.push({
    heading: '4. Projects (Very Important for Students & Freshers)',
    whatATSLooksFor: 'Project name, short description, stack, and measurable outcome',
    whatToAdd: ['Tech stack and key contributions', 'One metric/outcome if possible'],
    whatToAvoid: ['Listing non-technical personal projects without outcomes', 'Missing links or repo references where appropriate'],
    recommendedVocabulary: ['Implemented', 'Architected', 'Designed'],
    exampleImprovement: {
      before: 'Built a web app for tracking tasks',
      after: 'Implemented a task-tracking web app using React/Node, reducing task lookup time by 60% for users.'
    }
  });

  guidelines.push({
    heading: '5. Achievements & Impact',
    whatATSLooksFor: 'Awards, recognitions, high-impact wins with quantification',
    whatToAdd: ['Top 2-3 achievements with metrics', 'Links to press, demos, or open-source where relevant'],
    whatToAvoid: ['Listing coursework as achievements for experienced hires', 'Boilerplate claims without evidence'],
    recommendedVocabulary: ['Awarded', 'Recognized', 'Top-performer'],
    exampleImprovement: { before: 'Received award', after: 'Awarded "Top Innovator" for reducing infra costs by 18%.' }
  });

  guidelines.push({
    heading: '6. Metrics, Numbers & Results',
    whatATSLooksFor: 'Concrete numbers (%, revenue, users, speedups) near achievements',
    whatToAdd: ['Exact percentages, timeframes, and baseline when possible', 'Concrete user/customer numbers'],
    whatToAvoid: ['Vague quantifiers like "significant" without numbers'],
    recommendedVocabulary: ['Increased by', 'Reduced by', 'Achieved'],
    exampleImprovement: { before: 'Improved retention', after: 'Increased 30-day retention from 12% to 24% in 6 months.' }
  });

  guidelines.push({
    heading: '7. Keywords & Job Description Alignment',
    whatATSLooksFor: 'Exact keywords from JD present in resume (skills, tools, certifications)',
    whatToAdd: ['Mirror the JD phrasing for critical skills', 'Add certification keywords if required'],
    whatToAvoid: ['Keyword stuffing that is irrelevant', 'Using images for critical keywords'],
    recommendedVocabulary: jdTokens.slice(0,15),
    exampleImprovement: { before: 'No explicit cloud mention', after: `Added: AWS, EC2, S3, CloudFormation` }
  });

  guidelines.push({
    heading: '8. Formatting, Layout & ATS Parsing',
    whatATSLooksFor: 'Simple headings (Experience, Skills, Education), no columns in PDFs, no images for text',
    whatToAdd: ['One-column layout', 'Standard headings and consistent dates format (MM/YYYY)'],
    whatToAvoid: ['Tables for key content', 'Custom fonts that break parsing'],
    recommendedVocabulary: ['Experience', 'Skills', 'Education'],
    exampleImprovement: { before: 'Two-column layout with image', after: 'Single-column text-only layout with clear headings' }
  });

  guidelines.push({
    heading: '9. Grammar, Tone & Professional Language',
    whatATSLooksFor: 'Professional tone, active voice, minimal typos',
    whatToAdd: ['Short action-led bullets', 'Consistent tense for past roles'],
    whatToAvoid: ['Casual language or emoticons', 'First-person narrative'],
    recommendedVocabulary: ['Led', 'Implemented', 'Managed', 'Designed'],
    exampleImprovement: { before: 'Did work on scaling system', after: 'Led system scaling to support 3x traffic growth.' }
  });

  guidelines.push({
    heading: '10. Overall ATS Optimization Strategy',
    whatATSLooksFor: 'Concise resume matching the JD with measurable impact and clear skills',
    whatToAdd: ['Top 3 JD keywords in summary and skills', '2-3 quantified achievements in most recent role'],
    whatToAvoid: ['Long generic resume without keywords', 'Missing headings or section labels'],
    recommendedVocabulary: ['Optimized', 'Launched', 'Scalable'],
    exampleImprovement: { before: 'Generic responsibilities', after: 'Launched payments feature that processed $2M in 3 months.' }
  });

  const topActionItems = [
    'Add 3-5 high-impact, quantified achievements in most recent role',
    'Add a concise summary with top 3 JD keywords and top skills',
    'Create a clear Skills section with comma-separated technical skills'
  ];

  const finalATSReadySummary = `Profile: ${topSkills.slice(0,4).join(', ') || 'Key skills'}; concise, metrics-driven highlights added. Tailor headline to role.`;

  return {
    scores: {
      atsCompatibility: atsCompatibility,
      grammarQuality,
      keywordMatch,
      impactAndMetrics,
      readability,
      formattingStructure,
    },
    overallVerdict,
    detailedGuidelines: guidelines,
    missingCriticalKeywords: missingCriticalKeywords.slice(0,20),
    topActionItems,
    finalATSReadySummary,
  } as const;
}

export type ATSReport = ReturnType<typeof scoreResume>;
