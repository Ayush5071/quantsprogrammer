import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  scenarios: {
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '1m', target: 150 },
        { duration: '45s', target: 50 },
        { duration: '30s', target: 10 },
      ],
      gracefulStop: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

function checkOk(res) {
  return check(res, {
    'status is 200': (r) => r.status === 200,
    'body not empty': (r) => r.body && r.body.length > 0,
  });
}

export default function () {
  // Basic cold health check
  const h1 = http.get(`${BASE_URL}/api/debug-token`);
  checkOk(h1);

  // Hit common endpoints that should be friendly to public clients
  const h2 = http.get(`${BASE_URL}/api/data`);
  checkOk(h2);

  const h3 = http.get(`${BASE_URL}/api/top-interviews`);
  checkOk(h3);

  // small random sleep to simulate real user like timings
  sleep(Math.random() * 2 + 0.5);
}

export function teardown(data) {
  // noop - kept for completeness
}
