import React from 'react';

export default function LogoGraphic({ 
  className = '', 
  style = {}, 
  size = 48 
}) {
  return (
    <div className={`logo-graphic-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', ...style }}>
      <svg width={size * 1.25} height={size * 1.25} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {/* Radar/Arc Grid (Teal) */}
        <path d="M 10 90 A 80 80 0 0 1 90 10" fill="none" stroke="var(--emerald)" strokeWidth="8" strokeDasharray="16 4" strokeLinecap="round" />
        <path d="M 24 90 A 66 66 0 0 1 90 24" fill="none" stroke="var(--emerald)" strokeWidth="3.5" />
        <path d="M 38 90 A 52 52 0 0 1 90 38" fill="none" stroke="var(--emerald)" strokeWidth="2" />
        
        {/* Grid internal lines */}
        <line x1="16" y1="62" x2="42" y2="70" stroke="var(--emerald)" strokeWidth="2" />
        <line x1="33" y1="33" x2="54" y2="48" stroke="var(--emerald)" strokeWidth="2" />
        <line x1="62" y1="16" x2="70" y2="42" stroke="var(--emerald)" strokeWidth="2" />

        {/* Buildings (inherits parent color) */}
        <rect x="35" y="40" width="16" height="50" fill="none" stroke="currentColor" strokeWidth="4.5" />
        <rect x="55" y="55" width="10" height="35" fill="none" stroke="currentColor" strokeWidth="4.5" />
        <line x1="20" y1="90" x2="80" y2="90" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />

        {/* Rocket overlapping */}
        <g transform="translate(10, -5) rotate(35, 40, 60)">
          {/* Flame */}
          <path d="M 32 60 Q 40 85 48 60 Q 40 68 32 60 Z" fill="var(--emerald)" />
          {/* Main Body */}
          <path d="M 40 15 Q 52 40 46 60 L 34 60 Q 28 40 40 15 Z" fill="currentColor" />
          {/* Fins */}
          <path d="M 34 48 L 20 62 L 34 56 Z" fill="currentColor" />
          <path d="M 46 48 L 60 62 L 46 56 Z" fill="currentColor" />
          {/* Window */}
          <circle cx="40" cy="40" r="5" fill="var(--white)" stroke="var(--emerald)" strokeWidth="2.5" />
        </g>
      </svg>
      {/* Typography matches layout */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: `${size * 0.65}px`, fontWeight: 800, color: 'currentColor', lineHeight: 1, letterSpacing: '-0.02em', display: 'flex' }}>
          <span style={{ color: 'var(--emerald)' }}>Swift</span>Permit
        </div>
        <div style={{ fontSize: `${size * 0.2}px`, fontWeight: 700, opacity: 0.65, letterSpacing: '0.08em', marginTop: '4px' }}>
          BUILDING PERMIT ACCELERATOR
        </div>
      </div>
    </div>
  );
}
