import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import logoDark from '../assets/logo_dark.png';
import logoWhite from '../assets/logo_white.png';

export default function LogoGraphic({ 
  className = '', 
  style = {}, 
  size = 48,
  variant // 'dark' or 'white'
}) {
  const { user } = useAuth();
  
  // Use explicit variant if provided, otherwise switch based on auth
  const logo = variant === 'white' ? logoWhite : (variant === 'dark' ? logoDark : (user ? logoWhite : logoDark));

  return (
    <div className={`logo-graphic-container ${className}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', ...style }}>
      <img 
        src={logo} 
        alt="SwiftPermit Logo" 
        style={{ 
          height: size * 1.5, 
          width: 'auto',
          objectFit: 'contain',
          flexShrink: 0 
        }} 
      />
    </div>
  );
}
