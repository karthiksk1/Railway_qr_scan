import * as React from "react";

const ProfessionalBanner = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1200 250"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Official Banner"
    role="img"
    {...props}
  >
    <defs>
      {/* A more professional blue gradient */}
      <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(210, 70%, 30%)' }} />
        <stop offset="100%" style={{ stopColor: 'hsl(220, 80%, 50%)' }} />
      </linearGradient>

      {/* A subtle glow/shadow for depth */}
      <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* A gradient for the train body to give it a metallic, 3D look */}
      <linearGradient id="trainBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#D1D5DB' }} />
        <stop offset="50%" style={{ stopColor: '#E5E7EB' }} />
        <stop offset="100%" style={{ stopColor: '#9CA3AF' }} />
      </linearGradient>

      {/* A gradient for the window to simulate reflection */}
      <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4B5563', stopOpacity: 0.9 }} />
        <stop offset="100%" style={{ stopColor: '#1F2937', stopOpacity: 0.95 }} />
      </linearGradient>
    </defs>

    {/* Main Background */}
    <rect width="1200" height="250" fill="url(#bannerGradient)" />

    {/* Subtle background grid lines for a technical feel */}
    <g opacity="0.05" fill="none" stroke="white" strokeWidth="1">
      <path d="M-100,50 L1300,50" />
      <path d="M-100,100 L1300,100" />
      <path d="M-100,150 L1300,150" />
      <path d="M-100,200 L1300,200" />
    </g>

    {/* Left: Realistic Logo Placeholder */}
    <g transform="translate(80, 65)">
      <circle cx="60" cy="60" r="60" fill="white" opacity="0.1" />
      <circle cx="60" cy="60" r="55" fill="#ffffff" />
      <circle cx="60" cy="60" r="52" fill="hsl(215, 50%, 95%)" />
      <circle cx="60" cy="60" r="48" fill="white" />
      <text
        x="60"
        y="75"
        fontFamily="'Segoe UI', system-ui, sans-serif"
        fontSize="36"
        fontWeight="bold"
        fill="hsl(215, 60%, 45%)"
        textAnchor="middle"
      >
        RQR
      </text>
      <text
        x="60"
        y="98"
        fontFamily="'Segoe UI', system-ui, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="hsl(215, 30%, 55%)"
        textAnchor="middle"
        letterSpacing="1"
      >
        Indian Railways
      </text>
    </g>

    {/* Center: Title and Subtitle */}
    <g fill="white" fontFamily="'Segoe UI', system-ui, sans-serif" textAnchor="middle">
      <text x="600" y="105" fontSize="60" fontWeight="bold" letterSpacing="-1.5" textShadow="0 2px 5px rgba(0,0,0,0.25)">
        Rail-QR
      </text>
      <text x="600" y="145" fontSize="24" fontWeight="500" opacity="0.9" letterSpacing="0.5">
        AI-Driven QR Tracking for Rail Fittings
      </text>
    </g>

    {/* Right: Realistic Railway Scene */}
    <g transform="translate(880, 60)">
      {/* Background Train (far) */}
      <g transform="translate(120, 80) scale(0.5)" opacity="0.4">
        <path d="M 20,40 C 40,30 60,30 80,40 L 250,40 L 250,110 L 20,110 Q 10,85 20,40 Z" fill="url(#trainBodyGradient)" />
        <path d="M 30,45 L 100,45 L 100,80 L 30,80 Z" fill="url(#windowGradient)" />
        <rect x="110" y="45" width="50" height="35" rx="2" fill="url(#windowGradient)" />
        <rect x="170" y="45" width="50" height="35" rx="2" fill="url(#windowGradient)" />
      </g>

      {/* Tracks with perspective */}
      <path d="M-20 200 L100 130 L200 130 L320 200 Z" fill="white" opacity="0.05" />
      <path d="M-20 190 Q150,135 320,190" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2" />
      <path d="M-20 195 Q150,142 320,195" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2" />
      <path d="M25,138 L-5,192 M55,138 L25,193 M85,138 L55,194 M115,138 L85,195 M145,138 L115,196 M175,138 L145,197" stroke="white" strokeWidth="1.5" opacity="0.15" />

      {/* Main Train (foreground) */}
      <g transform="translate(0, 40)">
        {/* Train Body */}
        <path d="M 20,40 C 40,30 60,30 80,40 L 250,40 L 250,110 L 20,110 Q 10,85 20,40 Z" fill="url(#trainBodyGradient)" />
        
        {/* Highlight on top */}
        <path d="M 80,40 L 250,40 L 250,45 L 80,45 C 60,45 45,40 30,42" fill="white" opacity="0.4" />

        {/* Cockpit Window */}
        <path d="M 30,45 C 45,45 60,40 75,40 L 120,40 L 120,80 L 30,80 Z" fill="url(#windowGradient)" />
        
        {/* Window Reflection */}
        <path d="M 35,48 L 115,48 L 115,53 L 40,53 Z" fill="white" opacity="0.15" />

        {/* Passenger Windows */}
        <rect x="130" y="45" width="50" height="35" rx="2" fill="url(#windowGradient)" />
        <rect x="190" y="45" width="50" height="35" rx="2" fill="url(#windowGradient)" />

        {/* Bottom chassis */}
        <rect x="15" y="110" width="240" height="15" rx="2" fill="#4B5563" />
        
        {/* Wheels */}
        <g fill="#374151" stroke="#6B7280" strokeWidth="2">
          <circle cx="60" cy="125" r="10" />
          <circle cx="100" cy="125" r="10" />
          <circle cx="180" cy="125" r="10" />
          <circle cx="220" cy="125" r="10" />
        </g>
      </g>
    </g>
  </svg>
);

export default ProfessionalBanner;