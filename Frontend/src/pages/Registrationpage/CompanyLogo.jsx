/**
 * CompanyLogo.jsx — AspireNext Edu Tech Brand Logo Component
 * Vector SVG brand mark with animated graduate figures, scroll, and academic stars.
 */

import React from 'react';

export default function CompanyLogo({ width = 48, height = 48, className = "" }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`company-logo-svg ${className}`}
    >
      <style>{`
        .star-center { animation: starPulse 2.5s infinite ease-in-out; transform-origin: 100px 34px; }
        .star-left { animation: starFloat 3s infinite ease-in-out 0.4s; transform-origin: 48px 64px; }
        .star-right { animation: starFloat 3s infinite ease-in-out 0.8s; transform-origin: 152px 64px; }
        .scroll-ribbon { animation: ribbonShimmer 2s infinite ease-in-out; }
        @keyframes starPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.25) rotate(12deg); opacity: 0.85; }
        }
        @keyframes starFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-3px) scale(1.15); opacity: 1; }
        }
        @keyframes ribbonShimmer {
          0%, 100% { fill: #DC2626; }
          50% { fill: #EF4444; }
        }
      `}</style>

      <polygon className="star-center" points="100,18 104,30 117,30 107,38 111,50 100,42 89,50 93,38 83,30 96,30" fill="#2563EB" />
      <polygon className="star-left" points="48,52 51,61 60,61 52,67 55,76 48,70 41,76 44,67 36,61 45,61" fill="#9CA3AF" />
      <polygon className="star-right" points="152,52 155,61 164,61 156,67 159,76 152,70 145,76 148,67 140,61 149,61" fill="#9CA3AF" />
      
      <circle cx="76" cy="78" r="16" fill="#3B5998" />
      <path d="M76,96 C64,96 36,88 28,85 L32,93 C44,101 68,110 70,126 L55,188 L74,188 L92,136 C94,122 92,106 86,96 Z" fill="#3B5998" />
      
      <g transform="translate(12, 66) rotate(-22)">
        <rect x="0" y="0" width="13" height="38" rx="3" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <rect className="scroll-ribbon" x="0" y="15" width="13" height="8" fill="#DC2626" />
      </g>

      <circle cx="126" cy="72" r="16" fill="#1E2A78" />
      <path d="M126,90 C138,94 164,80 174,70 L168,78 C148,96 136,115 134,130 L140,188 L122,188 L114,120 C111,105 116,94 126,90 Z" fill="#1E2A78" />
      <path d="M126,90 C120,68 128,48 132,40 L140,44 C135,56 130,73 128,90 Z" fill="#1E2A78" />

      <g transform="translate(110, 20)">
        <polygon points="26,4 50,14 26,24 2,14" fill="#1F2937" />
        <polygon points="26,6 46,14 26,22 6,14" fill="#374151" />
        <path d="M14,16 L14,24 C14,27 38,27 38,24 L38,16 Z" fill="#111827" />
        <path d="M26,14 Q19,20 15,27" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="15" cy="28" r="1.5" fill="#9CA3AF" />
      </g>
    </svg>
  );
}
