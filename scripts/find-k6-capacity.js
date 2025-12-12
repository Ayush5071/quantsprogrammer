#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const processSummary = require('./process-k6-summary.js'); // we'll import the local parser

const args = require('minimist')(process.argv.slice(2));

if (!args.script) args.script = 'test/k6/load-test-stress-api.js';
if (!args.url) args.url = process.env.BASE_URL || 'http://localhost:3000';
if (!args.min) args.min = 1;
if (!args.max) args.max = 500;
if (!args.duration) args.duration = '30s';
if (!args.thresholdP95) args.thresholdP95 = 1500; // ms
if (!args.maxErrRate) args.maxErrRate = 0.01; // 1%

const dockerCmd = (vus, outFileHost, outFileContainer) => {
  // Quote environment variables in Docker so long URLs/spaces are handled
  const env = [
    `-e "BASE_URL=${args.url}"`,
    `-e "VUS=${vus}"`,
    `-e "DURATION=${args.duration}"`,
  ].join(' ');
  // Use a fixed container-side file path (outFileContainer) and host path will be outFileHost
  return `docker run --rm -v "${process.cwd()}:/src" -w /src ${env} loadimpact/k6 run ${args.script} --summary-export=${outFileContainer}`;
};

function checkMetrics(outFile, p95Threshold, errThreshold) {
  const parsed = require('./process-k6-summary.js').parseSummarySync(outFile);
  // Find p95 for http_req_duration
  const httpReq = parsed.data.find(m => m.metric === 'http_req_duration');
  const httpFailed = parsed.data.find(m => m.metric === 'http_req_failed');
  const p95 = httpReq ? httpReq.p95 || httpReq.avg || 0 : 0;
  const errRate = httpFailed ? httpFailed.avg || 0 : 0;
  // Assuming http_req_failed.avg is a rate percentage in some cases, otherwise we try to read as a 0-1
  return { p95: p95, errRate: errRate, ok: (p95 <= p95Threshold && errRate <= errThreshold) };
}

(async function main() {
  let low = parseInt(args.min, 10);
  let high = parseInt(args.max, 10);
  let best = low;
  const outDir = process.cwd();
  console.log(`Finding capacity between ${low} and ${high} VUs`);

  while (low <= high) {
    const mid = Math.ceil((low + high) / 2);
    console.log(`Testing ${mid} VUs`);
    const outFileHost = path.join(outDir, 'k6-summary.json');
    const outFileContainer = '/src/k6-summary.json';
    try {
      execSync(dockerCmd(mid, outFileHost, outFileContainer), { stdio: 'inherit', maxBuffer: 1024 * 1024 * 10 });
    } catch (err) {
      // k6 exits non-zero if thresholds are breached, still we should parse summary
      console.log('k6 returned non-zero exit code (likely thresholds breached)');
    }

    // Parse summary
    const metrics = require('./process-k6-summary.js').parseSummarySync(outFileHost);
    const httpReq = metrics.data.find(m => m.metric === 'http_req_duration');
    const httpFailed = metrics.data.find(m => m.metric === 'http_req_failed');
    const p95 = httpReq ? httpReq.p95 || httpReq.avg : 0;
    const errRate = httpFailed ? httpFailed.avg || httpFailed.count || 0 : 0;

    const ok = p95 <= args.thresholdP95 && errRate <= args.maxErrRate;

    console.log(`Results: p95=${p95}ms, errRate=${errRate}, ok=${ok}`);

    if (ok) {
      best = mid; // mid is valid
      low = mid + 1; // look for higher valid
    } else {
      high = mid - 1; // too high
    }

    // Small delay between runs
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`Estimated max stable VUs: ${best}`);
})();
