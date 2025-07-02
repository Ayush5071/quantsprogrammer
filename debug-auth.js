// Debug script to test authentication
// Run this in the browser console after logging in

console.log('=== Authentication Debug ===');

// Check for token in cookies
const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split('=');
  acc[key] = value;
  return acc;
}, {});

console.log('All cookies:', cookies);
console.log('Token cookie:', cookies.token || 'NOT FOUND');

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

// Check current URL
console.log('Current URL:', window.location.href);
