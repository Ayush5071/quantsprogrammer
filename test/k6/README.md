# k6 Performance & Load Tests

This folder contains simple k6 scripts to run load tests for the application.

Files:
- `load-test-api.js` - A sample API-focused load test that sends GET requests to some example API endpoints.
- `load-test-frontend.js` - A sample front-end page load test that loads `/` and `/navrion`.

Notes & Configuration
- `BASE_URL` can be provided at runtime using the `BASE_URL` environment variable. If not provided, the scripts default to `http://localhost:3000`.

Examples
- Run using a local k6 installation (recommended):

  ```powershell
  # Install k6 (one-time)
  choco install k6

  # Run API test
  k6 run test/k6/load-test-api.js

  # Run frontend test
  k6 run test/k6/load-test-frontend.js
  ```

- Run using Docker (useful if you don't want to install k6 locally):

  ```powershell
  # On Windows PowerShell
  docker run --rm -v "${PWD}:/src" -w /src loadimpact/k6 run test/k6/load-test-api.js

  # On macOS or Linux
  docker run --rm -v $(pwd):/src -w /src loadimpact/k6 run test/k6/load-test-api.js
  ```

- Set BASE_URL to test an environment
  ```powershell
  # PowerShell
  $env:BASE_URL = "https://www.your-deployed-site.com"
  k6 run test/k6/load-test-api.js
  ```

Recommendations
- Start small (low VUs and short durations) and increase gradually so you don't unintentionally DoS your own staging environment.
- If you have auth-protected endpoints, add a `setup()` step that logs in once and shares an auth token to use in test functions.
- Convert tests into multiple scenarios for more realistic mixes of traffic (a mix of read-only, write, and asset hits).
- Add k6 Cloud integration or run as a GitHub Action for scheduled or PR-based performance checks.

Next Steps
- Add authentication support if you want to hit authenticated routes.
- Add more realistic page asset lists to `load-test-frontend.js` to simulate real page loading.
- Add a small CI job to run a short smoke test using k6 on PRs.

Auth / mixed workloads example
 - `load-test-auth-api.js` demonstrates how to do an authenticated setup step and share a token or cookie header. It's a mixed workload (GET reads + protected GET + POST/PUT writes) using weights.

Processing results
 - k6 can produce a JSON summary using the `--summary-export` flag. For convenience, there's a small Node script at `scripts/process-k6-summary.js` that reads the generated `k6-summary.json`, writes a processed version to `k6-summary-out.json`, and optionally POSTs to an endpoint if `K6_UPLOAD_URL` is set.

Example run with summary export and processing
```powershell
# Run the auth/mixed test and export the summary
k6 run test/k6/load-test-auth-api.js --summary-export=k6-summary.json

# Process and (optionally) upload
node scripts/process-k6-summary.js k6-summary.json
```

Find capacity via binary search
```
```powershell
# This runs the Docker-based find-capacity script that binary searches the number of VUs where thresholds start to fail.
node scripts/find-k6-capacity.js --script test/k6/load-test-stress-api.js --url https://your-site.example --min 1 --max 200 --duration 20s --thresholdP95 1200 --maxErrRate 0.01
```