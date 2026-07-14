import React from "react";

interface IconProps {
  size?: number;
  style?: React.CSSProperties;
}

export const PlatinumIcon: React.FC<IconProps> = ({ size = 16, style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
      <defs>
        <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e8f0" />
          <stop offset="50%" stopColor="#9cb4cc" />
          <stop offset="100%" stopColor="#5c7a99" />
        </linearGradient>
        <linearGradient id="platBorder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#3b5266" />
        </linearGradient>
      </defs>
      {/* Octagonal outer ring */}
      <polygon
        points="12,2 19,5 22,12 19,19 12,22 5,19 2,12 5,5"
        fill="url(#platGrad)"
        stroke="url(#platBorder)"
        strokeWidth="1.5"
      />
      {/* Inner octagon */}
      <polygon
        points="12,5 17,7 19,12 17,17 12,19 7,17 5,12 7,7"
        fill="#1a2b3c"
        stroke="#ffffff"
        strokeWidth="0.8"
        opacity="0.8"
      />
      {/* Center symbol: Warframe logo style vertical split diamond */}
      <path
        d="M12,7 L15,12 L12,17 L9,12 Z"
        fill="#9cb4cc"
        stroke="#ffffff"
        strokeWidth="0.8"
      />
      <line x1="12" y1="7" x2="12" y2="17" stroke="#1a2b3c" strokeWidth="0.8" />
    </svg>
  );
};

export const RelicIcon: React.FC<IconProps> = ({ size = 20, style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
      <defs>
        <linearGradient id="relicGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe699" />
          <stop offset="60%" stopColor="#d4a343" />
          <stop offset="100%" stopColor="#805d1a" />
        </linearGradient>
      </defs>
      {/* Rounded oval base of the cabbage relic */}
      <path
        d="M12,2 C7,2 4,6 4,11 C4,16 7,22 12,22 C17,22 20,16 20,11 C20,6 17,2 12,2 Z"
        fill="url(#relicGold)"
        stroke="#0d1117"
        strokeWidth="1"
      />
      {/* Outer ribs/details of the Orokin relic */}
      <path
        d="M4,11 C6,13 18,13 20,11"
        stroke="#1a1e24"
        strokeWidth="1.2"
        strokeDasharray="1 2"
      />
      <path
        d="M7,5 C9,8 15,8 17,5"
        stroke="#1a1e24"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M8,18 C10,16 14,16 16,18"
        stroke="#1a1e24"
        strokeWidth="1"
        fill="none"
      />
      {/* Glowing core/eyes */}
      <circle cx="12" cy="11" r="3" fill="#00ffff" opacity="0.8" />
      <circle cx="12" cy="11" r="1.5" fill="#ffffff" />
    </svg>
  );
};
