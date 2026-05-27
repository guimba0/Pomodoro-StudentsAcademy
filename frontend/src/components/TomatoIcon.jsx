export default function TomatoIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="tomateCorpo" cx="42%" cy="32%" r="58%">
          <stop offset="0%" stopColor="#FF6B4A" />
          <stop offset="25%" stopColor="#F54538" />
          <stop offset="60%" stopColor="#D92D20" />
          <stop offset="100%" stopColor="#991B14" />
        </radialGradient>
        <radialGradient id="tomateBrilho" cx="32%" cy="25%" r="28%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="tomateSombra" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="110" rx="38" ry="8" fill="url(#tomateSombra)" />

      <path
        d="M60 22 C25 22 8 40 8 62 C8 84 22 102 60 102 C98 102 112 84 112 62 C112 40 95 22 60 22Z"
        fill="url(#tomateCorpo)"
      />

      <path
        d="M60 22 C58 28 55 32 50 34 C55 35 58 35 60 34 C62 35 65 35 70 34 C65 32 62 28 60 22Z"
        fill="rgba(0,0,0,0.08)"
      />

      <path
        d="M60 22 C25 22 8 40 8 62 C8 84 22 102 60 102 C98 102 112 84 112 62 C112 40 95 22 60 22Z"
        fill="url(#tomateBrilho)"
      />

      <ellipse cx="40" cy="44" rx="10" ry="6" fill="rgba(255,255,255,0.08)" transform="rotate(-25 40 44)" />

      <path d="M60 24 C58 16 50 10 42 8 C39 7 38 9 40 11 C44 13 52 18 56 24" fill="#4A7A2E" />
      <path d="M60 24 C62 16 70 10 78 8 C81 7 82 9 80 11 C76 13 68 18 64 24" fill="#4A7A2E" />
      <path d="M60 24 C56 14 46 6 36 4 C32 3 31 6 35 8 C41 11 52 16 58 24" fill="#5A9A3E" />
      <path d="M60 24 C64 14 74 6 84 4 C88 3 89 6 85 8 C79 11 68 16 62 24" fill="#5A9A3E" />
      <path d="M60 24 C60 14 60 8 60 5 C58 5 57 8 57 12 C57 16 58 20 59 24" fill="#3D7A26" />

      <path
        d="M60 24 C58 17 56 12 56 6 C57 4 59 3 60 4 C61 5 62 7 61 12 C60 16 60 20 60 24"
        fill="#2D5A1A"
      />
    </svg>
  )
}
