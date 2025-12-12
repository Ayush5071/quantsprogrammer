import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  scenarios: {
    mixed_traffic: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '2m', target: 150 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 10 },
      ],
      gracefulStop: '15s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1200'],
    checks: ['rate>0.98']
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const LOGIN_PATH = __ENV.LOGIN_PATH || '/api/auth/login';
const AUTH_EMAIL = __ENV.AUTH_EMAIL || 'test@example.com';
const AUTH_PASSWORD = __ENV.AUTH_PASSWORD || 'password123';

// Helper check for 200 + expected keys
function checkOk(res, name = 'call') {
  return check(res, {
    [`${name} status is 200`]: (r) => r.status === 200,
  });
}

export function setup() {
  // Attempt to login and get a token (customize path/payload as necessary). Some apps may use cookie sessions instead.
  try {
    const payload = JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD });
    const headers = { 'Content-Type': 'application/json' };
    const res = http.post(`${BASE_URL}${LOGIN_PATH}`, payload, { headers });

    if (res && res.status === 200) {
      // Try to read token (adapt according your server's response format)
      try {
        const body = res.json();
        const token = body?.token || body?.accessToken || null;
        if (token) {
          return { token };
        }
      } catch (err) {
        // fallback for cookie based login
        const cookies = res.headers['Set-Cookie'] || res.cookies || null;
        // return cookie header if present
        if (cookies) return { cookieHeader: cookies };
      }
    }
  } catch (err) {
    // ignore auth setup errors — tests will still run as unauthenticated
  }
  return {};
}

export default function (data) {
  const token = data.token || null;
  const cookieHeader = data.cookieHeader ? { Cookie: data.cookieHeader } : {};
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Weighted mixture via random number
  const r = Math.random();

  if (r < 0.6) {
    // Public reads (GET)
    const res = http.get(`${BASE_URL}/api/data`);
    checkOk(res, 'api-data');

    const res2 = http.get(`${BASE_URL}/api/top-interviews`);
    checkOk(res2, 'top-interviews');
  } else if (r < 0.9) {
    // Authenticated resource (user profile, protected read)
    const res = http.get(`${BASE_URL}/api/users/me`, { headers: { ...authHeader, ...cookieHeader } });
    checkOk(res, 'users-me');

    // Another read which may be auth-protected
    const res2 = http.get(`${BASE_URL}/api/resume`, { headers: { ...authHeader, ...cookieHeader } });
    checkOk(res2, 'resume');
  } else {
    // Write operations: POST and PUT
    const payload = JSON.stringify({ title: `Sample ${Math.random().toString(36).slice(2)}`, body: 'Sample content for load testing' });
    const headers = { 'Content-Type': 'application/json', ...authHeader, ...cookieHeader };

    // Create new roadmap item (replace endpoint if not present)
    const created = http.post(`${BASE_URL}/api/roadmap`, payload, { headers });
    checkOk(created, 'create-roadmap');

    // If created returned an id, attempt a quick update
    try {
      const id = created.json()?.id;
      if (id) {
        const putPayload = JSON.stringify({ title: `Updated ${Date.now()}` });
        const updated = http.put(`${BASE_URL}/api/roadmap/${id}`, putPayload, { headers });
        checkOk(updated, 'update-roadmap');
      }
    } catch (err) {
      // ignore
    }
  }

  // Don't hammer — small wait
  sleep(Math.random() * 1.5 + 0.5);
}

export function teardown(data) {
  // Optional: remove created data if necessary. This requires the `setup` to return created id which isn't implemented.
}
