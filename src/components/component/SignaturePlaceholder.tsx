import React from 'react';

export default function SignaturePlaceholder({ width=200, text='Authorized Signatory' }:{ width?: number, text?: string }) {
  return (
    <svg viewBox="0 0 300 60" className="w-[200px] h-12" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sigG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1a365d', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#2c5282', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1a365d', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fontFamily="Caveat, 'Brush Script MT', cursive" fontSize="26" fill="url(#sigG)">{text}</text>
    </svg>
  );
}
