import React from 'react';

interface PoliceUniformProps {
  type: 'patrol' | 'traffic' | 'swat' | 'coast';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const PoliceUniform: React.FC<PoliceUniformProps> = ({
  type,
  width = "100%",
  height = "100%",
  className = ""
}) => {
  // Common viewport 0 0 400 300
  // Hollow curve in center top: from (150, 0) to (250, 0) curving down to (200, 80)
  switch (type) {
    case 'patrol':
      return (
        <svg viewBox="0 0 400 300" width={width} height={height} className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Main Navy Torso */}
          <path d="M 40 300 L 40 250 Q 40 140 100 120 L 150 90 Q 200 160 250 90 L 300 120 Q 360 140 360 250 L 360 300 Z" fill="#1e3a8a" stroke="#172554" strokeWidth="4" />
          
          {/* Light Blue Shirt Insert */}
          <polygon points="150,90 200,150 250,90 200,90" fill="#93c5fd" />
          
          {/* Gold Tie */}
          <polygon points="190,120 210,120 215,220 200,245 185,220" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          
          {/* Shoulder Epaulets (Gold) */}
          <path d="M 60 115 L 120 95 L 130 110 L 70 130 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <path d="M 340 115 L 280 95 L 270 110 L 330 130 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          
          {/* Collar Wings */}
          <path d="M 130 95 L 175 130 L 185, 100 Z" fill="#1e40af" stroke="#1d4ed8" strokeWidth="2" />
          <path d="M 270 95 L 225 130 L 215, 100 Z" fill="#1e40af" stroke="#1d4ed8" strokeWidth="2" />
          
          {/* Golden Badge on Left Chest */}
          {/* Star Shape centered at X: 110, Y: 170 */}
          <path d="M 110 152 L 115 163 L 127 165 L 118 174 L 120 186 L 110 180 L 100 186 L 102 174 L 93 165 L 105 163 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="110" cy="170" r="4" fill="#ef4444" />
          
          {/* Pocket on Right Chest */}
          <path d="M 260 160 L 310 160 L 310 210 L 285 225 L 260 210 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="3" />
          <path d="M 260 160 L 285 175 L 310 160" fill="none" stroke="#1e3a8a" strokeWidth="3" />
          
          {/* Whistle Silver Chain */}
          <path d="M 200 150 Q 240 160 270 180" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="3 3" />
        </svg>
      );

    case 'traffic':
      return (
        <svg viewBox="0 0 400 300" width={width} height={height} className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Main Fluorescent Neon Vest */}
          <path d="M 40 300 L 40 250 Q 40 140 100 120 L 150 90 Q 200 160 250 90 L 300 120 Q 360 140 360 250 L 360 300 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="4" />
          
          {/* White Inner Shirt Insert */}
          <polygon points="150,90 200,140 250,90 200,90" fill="#f8fafc" />
          
          {/* Black Tie */}
          <polygon points="192,105 208,105 212,190 200,210 188,190" fill="#1e293b" />
          
          {/* Silver Reflective Bands */}
          <path d="M 75 180 Q 200 200 325 180 L 330 215 Q 200 235 70 215 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 98 135 L 132 155 L 115 190 L 82 170 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 302 135 L 268 155 L 285 190 L 318 170 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />

          {/* Traffic Police Badging */}
          <circle cx="115" cy="155" r="12" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          {/* Winged Emblem inside circle */}
          <path d="M 108 155 Q 115 151 122 155 Q 115 159 108 155" fill="#facc15" />
          
          {/* Whistle hanging around neck */}
          <circle cx="200" cy="155" r="7" fill="#64748b" />
          <path d="M 197 155 L 197 185 L 203 185 L 203 155 Z" fill="#64748b" />
          {/* Whistle string cord */}
          <path d="M 175 110 Q 200 135 225 110" fill="none" stroke="#dc2626" strokeWidth="3" />
        </svg>
      );

    case 'swat':
      return (
        <svg viewBox="0 0 400 300" width={width} height={height} className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Tactical Charcoal Vest */}
          <path d="M 40 300 L 40 250 Q 40 140 100 120 L 150 90 Q 200 165 250 90 L 300 120 Q 360 140 360 250 L 360 300 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="4" />
          
          {/* Inner Black T-shirt */}
          <polygon points="150,90 200,155 250,90 200,90" fill="#020617" />
          
          {/* Tactical Shoulder Straps */}
          <rect x="75" y="112" width="30" height="40" rx="3" fill="#334155" transform="rotate(-15 75 112)" />
          <rect x="295" y="112" width="30" height="40" rx="3" fill="#334155" transform="rotate(15 295 112)" />
          
          {/* Heavy Duty Chest Straps / Molle Grid */}
          <line x1="100" y1="180" x2="300" y2="180" stroke="#0f172a" strokeWidth="8" />
          <line x1="100" y1="215" x2="300" y2="215" stroke="#0f172a" strokeWidth="8" />
          
          {/* Molle Pouches on vest */}
          <rect x="110" y="230" width="50" height="50" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
          <rect x="175" y="230" width="50" height="50" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
          <rect x="240" y="230" width="50" height="50" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />

          {/* 특공대 Wordmark Label */}
          <rect x="155" y="145" width="90" height="26" rx="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="200" y="163" fill="#0f172a" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">특공대</text>
          
          {/* Tactical radio mic clip */}
          <path d="M 85 160 L 98 160 L 98 185 L 85 185 Z" fill="#020617" />
          <circle cx="91" cy="172" r="4" fill="#64748b" />
          {/* Spiral Wire */}
          <path d="M 91 185 C 80 200 110 215 95 230" fill="none" stroke="#020617" strokeWidth="2" />
        </svg>
      );

    case 'coast':
      return (
        <svg viewBox="0 0 400 300" width={width} height={height} className={className} xmlns="http://www.w3.org/2000/svg">
          {/* White Coast Guard Blouse */}
          <path d="M 40 300 L 40 250 Q 40 140 100 120 L 150 90 Q 200 160 250 90 L 300 120 Q 360 140 360 250 L 360 300 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="4" />
          
          {/* Dark Navy Square Sailor Collar Insert */}
          <polygon points="148,85 200,145 252,85" fill="#1e3a8a" />
          {/* Collar white piping line */}
          <polyline points="152,85 200,135 248,85" fill="none" stroke="#ffffff" strokeWidth="2" />
          
          {/* Orange Life Jacket / Harness Straps */}
          <path d="M 80 122 C 80 160 100 270 120 300" fill="none" stroke="#f97316" strokeWidth="15" strokeLinecap="round" />
          <path d="M 320 122 C 320 160 300 270 280 300" fill="none" stroke="#f97316" strokeWidth="15" strokeLinecap="round" />
          {/* Buckles */}
          <rect x="100" y="210" width="22" height="15" fill="#fbbf24" stroke="#d97706" />
          <rect x="278" y="210" width="22" height="15" fill="#fbbf24" stroke="#d97706" />
          <line x1="110" y1="217" x2="290" y2="217" stroke="#1e293b" strokeWidth="3" />

          {/* Special Anchor Badge Pin */}
          <circle cx="106" cy="165" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          {/* Anchor */}
          <path d="M 106 156 L 106 172 M 100 160 L 112 160 M 102 168 Q 106 175 110 168" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
};
