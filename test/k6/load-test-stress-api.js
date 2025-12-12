import http from 'k6/http';
import { check, sleep } from 'k6';

// Read VUs and duration from env; if not set, default to smaller values.
const VUS = parseInt(__ENV.VUS || '50', 10);
const DUR = __ENV.DURATION || '30s';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: VUS,
  duration: DUR,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

function checkOk(res, name = "call") {
  return check(res, {
    [`${name} status is 200`]: (r) => r.status === 200,
  });
}

export default function () {
  // Mix of endpoints to simulate realistic traffic for API
  const r = Math.random();
  if (r < 0.7) {
    // simple read
    const res = http.get(`${BASE_URL}/api/data`);
    checkOk(res, 'api-data');
  } else if (r < 0.9) {
    // heavier read
    const res = http.get(`${BASE_URL}/api/top-interviews`);
    checkOk(res, 'top-interviews');
  } else {
    // a write path that is commonly used
    try {
      const payload = JSON.stringify({ name: `Load Test ${Math.random()}` });
      const headers = { 'Content-Type': 'application/json' };
      const create = http.post(`${BASE_URL}/api/roadmap`, payload, { headers });
      checkOk(create, 'create-roadmap');
    } catch (err) {
      // in case write doesn't exist
    }
  }

  sleep(Math.random() * 1.2 + 0.2);
}
