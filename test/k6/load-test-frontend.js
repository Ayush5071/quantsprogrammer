import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  scenarios: {
    basic_page_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '45s', target: 25 },
        { duration: '1m', target: 70 },
        { duration: '1m', target: 25 },
        { duration: '30s', target: 5 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1200'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

function checkOk(res) {
  return check(res, {
    'status is 200': (r) => r.status === 200,
    'content-type html': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/html'),
  });
}

export default function () {
  // Load home page
  const homepage = http.get(`${BASE_URL}/`);
  checkOk(homepage);

  // Load navrion page (your new section)
  const navrion = http.get(`${BASE_URL}/navrion`);
  checkOk(navrion);

  // Optionally, hit a few static assets to simulate fully-loaded page (images/css/js)
  // NOTE: These paths must exist (or remove if not present).
  const assets = http.batch([
    [`${BASE_URL}/public/assets/some-image.jpg`, 'GET'],
    [`${BASE_URL}/assets/home/some-hero.jpg`, 'GET'],
  ]);

  // wait like a real user
  sleep(Math.random() * 3 + 1);
}
