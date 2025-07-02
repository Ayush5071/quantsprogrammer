// Debug script to test authentication
// Run this in the browser console after logging in

console.log('=== Authentication Debug ===');

// Check for token in cookies (Note: httpOnly cookies won't show here)
const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split('=');
  acc[key] = value;
  return acc;
}, {});

console.log('All cookies (visible to JS):', cookies);
console.log('Token cookie (httpOnly, so may show NOT FOUND):', cookies.token || 'NOT FOUND - this is EXPECTED for httpOnly cookies');

// Check localStorage
console.log('localStorage token:', localStorage.getItem('token') || 'NOT FOUND');

// Test API call
fetch('/api/users/me')
  .then(res => {
    console.log('API Response Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('API Response Data:', data);
  })
  .catch(err => {
    console.error('API Error:', err);
  });

// Test auth status with our debug endpoint
fetch('/api/test-auth')
  .then(res => res.json())
  .then(data => {
    console.log('Auth Test API:', data);
  })
  .catch(err => {
    console.error('Auth Test Error:', err);
  });

// Check current URL
console.log('Current URL:', window.location.href);
