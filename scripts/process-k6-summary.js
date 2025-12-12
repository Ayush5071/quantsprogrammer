#!/usr/bin/env node

// A minimal processor for k6 summary JSON that extracts a small set of key metrics
// and optionally POSTs them to a configured endpoint (e.g., a pushgateway or custom collector).

const fs = require('fs');
const path = require('path');
const url = process.env.K6_UPLOAD_URL || null;
const inputPath = process.argv[2] || 'k6-summary.json';

function parseSummary(summaryPath) {
  if (!fs.existsSync(summaryPath)) {
    console.error('Summary file not found:', summaryPath);
    process.exit(2);
  }
  const raw = fs.readFileSync(summaryPath, 'utf-8');
  const j = JSON.parse(raw);
  const metrics = j.metrics || {};
  const out = [];
  for (const [key, val] of Object.entries(metrics)) {
    const metricName = key;
    const { type, contains, values, thresholds, checks } = val;
    // Focus on common gauge-like values: p(95), p(99), avg, count
    const record = {
      metric: metricName,
      type: type || null,
      count: val?.values?.count || val?.count || val?.total || 0,
      avg: val?.values?.avg || val?.avg || null,
      p95: val?.values?.['p(95)'] || val?.p95 || null,
      p99: val?.values?.['p(99)'] || val?.p99 || null,
    };
    out.push(record);
  }
  return { data: out, raw: j };
}

function parseSummarySync(summaryPath) {
  return parseSummary(summaryPath);
}

async function publish(summaryObj) {
  if (!url) {
    return console.log('No K6_UPLOAD_URL provided. Will write to k6-summary-out.json instead.');
  }

  try {
    const fetch = require('node-fetch');
    const payload = JSON.stringify(summaryObj);
    console.log('Posting summary to', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    console.log('Status:', res.status);
    if (res.status >= 400) console.error(await res.text());
  } catch (err) {
    console.error('Error while posting summary:', err.message);
  }
}

async function main() {
  const summaryFullPath = path.resolve(process.cwd(), inputPath);
  const parsed = parseSummary(summaryFullPath);
  const outPath = path.join(path.dirname(summaryFullPath), 'k6-summary-out.json');
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf-8');
  console.log('Wrote processed summary to', outPath);
  if (url) await publish(parsed);
}

// Only run main if this file is executed directly. When required by other scripts
// (like the find-k6-capacity tool) we will not auto-run main; instead, exports are used.
if (require.main === module) {
  main();
}

// Export helpers when required by other scripts.
module.exports = { parseSummary, parseSummarySync };
