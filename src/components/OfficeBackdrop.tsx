import React from 'react';

export const OfficeBackdrop: React.FC = () => {
  return (
    <div
      id="office-backdrop"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Deep teal gradient ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#003842] via-[#004854] to-[#002830]" />

      {/* Stylized Office Silhouette Art matching screenshot 1, 2, 4 */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-35"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#023b45" />
            <stop offset="100%" stopColor="#00252c" />
          </linearGradient>
          <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#064855" />
            <stop offset="100%" stopColor="#012b33" />
          </linearGradient>
        </defs>

        {/* City Skyline Silhouette */}
        <g id="skyline" opacity="0.45" fill="url(#buildingGrad)">
          {/* Building blocks */}
          <rect x="10" y="160" width="45" height="260" />
          <rect x="35" y="130" width="30" height="290" />
          <rect x="75" y="190" width="40" height="230" />
          <rect x="125" y="140" width="55" height="280" />
          {/* Spire */}
          <rect x="145" y="110" width="8" height="30" />
          <rect x="190" y="170" width="45" height="250" />
          <rect x="245" y="120" width="60" height="300" />
          <polygon points="275,85 270,120 280,120" />
          <rect x="315" y="165" width="40" height="255" />
          <rect x="360" y="180" width="50" height="240" />

          {/* Tiny window dots */}
          <circle cx="45" cy="150" r="1.5" fill="#13a3b8" opacity="0.3" />
          <circle cx="45" cy="170" r="1.5" fill="#13a3b8" opacity="0.3" />
          <circle cx="140" cy="160" r="1.5" fill="#13a3b8" opacity="0.3" />
          <circle cx="160" cy="190" r="1.5" fill="#13a3b8" opacity="0.3" />
          <circle cx="265" cy="140" r="1.5" fill="#13a3b8" opacity="0.3" />
          <circle cx="280" cy="170" r="1.5" fill="#13a3b8" opacity="0.3" />
        </g>

        {/* Horizontal Terrace / Balcony Divider Bar */}
        <line x1="0" y1="420" x2="400" y2="420" stroke="#002127" strokeWidth="3" opacity="0.8" />

        {/* Left Chair Silhouette */}
        <g id="chair-left" fill="#002d35" opacity="0.85">
          <path d="M 40,410 C 20,410 10,450 10,530 C 10,580 30,590 65,590 L 75,590 C 85,590 95,575 95,545 L 85,545 C 80,565 72,570 55,570 C 35,570 30,545 30,510 L 60,510 C 75,510 80,480 80,440 C 80,415 65,410 40,410 Z" />
          {/* Chair Legs */}
          <line x1="30" y1="585" x2="15" y2="730" stroke="#00242b" strokeWidth="5" strokeLinecap="round" />
          <line x1="75" y1="585" x2="95" y2="730" stroke="#00242b" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Right Chair Silhouette */}
        <g id="chair-right" fill="#002d35" opacity="0.85">
          <path d="M 360,410 C 380,410 390,450 390,530 C 390,580 370,590 335,590 L 325,590 C 315,590 305,575 305,545 L 315,545 C 320,565 328,570 345,570 C 365,570 370,545 370,510 L 340,510 C 325,510 320,480 320,440 C 320,415 335,410 360,410 Z" />
          {/* Chair Legs */}
          <line x1="370" y1="585" x2="385" y2="730" stroke="#00242b" strokeWidth="5" strokeLinecap="round" />
          <line x1="325" y1="585" x2="305" y2="730" stroke="#00242b" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Cafe Table Center */}
        <g id="table-group" fill="#00262d">
          {/* Round table surface edge */}
          <ellipse cx="200" cy="520" rx="100" ry="12" fill="#03333d" opacity="0.9" />
          <path d="M 100,520 L 300,520 L 290,530 L 110,530 Z" fill="#001d22" />

          {/* Central Pedestal Stem */}
          <rect x="194" y="530" width="12" height="150" fill="#012228" />

          {/* Pedestal Base */}
          <path d="M 194,660 L 140,730 L 260,730 L 206,660 Z" fill="#001a1f" />
        </g>

        {/* Laptop on Table */}
        <g id="laptop" fill="#063e4a">
          {/* Screen open at angle */}
          <path d="M 155,440 L 245,440 L 255,515 L 145,515 Z" fill="#074857" stroke="#012b33" strokeWidth="2" />
          {/* Screen inner glow */}
          <ellipse cx="200" cy="478" rx="8" ry="8" fill="#0bb9ce" opacity="0.4" />
          {/* Keyboard base */}
          <polygon points="140,515 260,515 270,525 130,525" fill="#022e36" />
        </g>

        {/* Coffee Cups on Table */}
        <g id="coffee-left" fill="#053e49">
          <rect x="115" y="495" width="14" height="24" rx="2" />
          <rect x="113" y="493" width="18" height="3" rx="1" fill="#085463" />
        </g>
        <g id="coffee-right" fill="#053e49">
          <rect x="270" y="495" width="14" height="24" rx="2" />
          <rect x="268" y="493" width="18" height="3" rx="1" fill="#085463" />
        </g>

        {/* Briefcase on Floor */}
        <g id="briefcase">
          {/* Handle */}
          <path d="M 235,690 C 235,678 265,678 265,690" stroke="#001e24" strokeWidth="4" fill="none" />
          {/* Case body */}
          <rect x="215" y="690" width="70" height="52" rx="4" fill="#022e36" stroke="#001c22" strokeWidth="2" />
          {/* Accent clasp */}
          <rect x="245" y="700" width="10" height="6" fill="#0d6170" rx="1" />
        </g>
      </svg>
    </div>
  );
};
