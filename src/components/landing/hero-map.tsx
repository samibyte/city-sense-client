const ROUTE_PATH = "M 600 440 C 540 400, 500 340, 430 300 S 320 230, 250 190";

/**
 * Top-down stylized city grid with live request pins and a dispatch route.
 * Purely decorative illustration backing the hero operations console.
 */
export function CityMap() {
  return (
    <svg
      viewBox="0 0 720 520"
      className="h-auto w-full"
      role="img"
      aria-label="Stylized city grid showing live civic request locations and a dispatch route"
    >
      <defs>
        <linearGradient id="city-river" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="45%" stopColor="#2dd4bf" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="city-route" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <radialGradient id="city-pin">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
        <pattern
          id="city-streets"
          width="46"
          height="46"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 46 0 H 0 V 46"
            fill="none"
            stroke="rgba(210,235,224,0.045)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="720" height="520" fill="url(#city-streets)" />

      {/* City blocks */}
      <g
        fill="rgba(210,235,224,0.028)"
        stroke="rgba(210,235,224,0.06)"
        strokeWidth="1"
      >
        <rect x="40" y="40" width="80" height="60" rx="7" />
        <rect x="160" y="40" width="150" height="60" rx="7" />
        <rect x="360" y="36" width="150" height="70" rx="7" />
        <rect x="580" y="44" width="110" height="60" rx="7" />
        <rect x="40" y="150" width="80" height="120" rx="7" />
        <rect x="160" y="150" width="150" height="120" rx="7" />
        <rect x="360" y="140" width="150" height="130" rx="7" />
        <rect x="580" y="150" width="110" height="120" rx="7" />
        <rect x="40" y="300" width="80" height="110" rx="7" />
        <rect x="160" y="300" width="150" height="110" rx="7" />
        <rect x="360" y="300" width="150" height="110" rx="7" />
        <rect x="580" y="300" width="110" height="110" rx="7" />
        <rect x="40" y="440" width="200" height="58" rx="7" />
        <rect x="260" y="440" width="150" height="58" rx="7" />
        <rect x="440" y="440" width="120" height="58" rx="7" />
        <rect x="590" y="440" width="100" height="58" rx="7" />
      </g>

      {/* Avenues */}
      <g stroke="rgba(210,235,224,0.09)" strokeWidth="6" strokeLinecap="round">
        <path d="M 0 120 H 720" />
        <path d="M 0 300 H 720" />
        <path d="M 0 440 H 720" />
        <path d="M 140 0 V 520" />
        <path d="M 340 0 V 520" />
        <path d="M 540 0 V 520" />
      </g>

      {/* River */}
      <path
        d="M -30 478 C 90 424, 60 300, 170 262 S 380 140, 750 42"
        fill="none"
        stroke="url(#city-river)"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <path
        d="M -30 478 C 90 424, 60 300, 170 262 S 380 140, 750 42"
        fill="none"
        stroke="rgba(153,246,228,0.28)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Park */}
      <ellipse
        cx="628"
        cy="352"
        rx="66"
        ry="46"
        fill="#34d399"
        opacity="0.07"
      />
      <circle cx="610" cy="346" r="7" fill="#34d399" opacity="0.14" />
      <circle cx="640" cy="360" r="9" fill="#34d399" opacity="0.12" />
      <circle cx="628" cy="332" r="5" fill="#34d399" opacity="0.16" />

      {/* Dispatch route */}
      <path
        d={ROUTE_PATH}
        fill="none"
        stroke="url(#city-route)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="7 9"
        className="animate-route-dash"
        opacity="0.9"
      />

      {/* Resolver base */}
      <g>
        <circle cx="600" cy="440" r="10" fill="#2dd4bf" opacity="0.14" />
        <rect
          x="589"
          y="429"
          width="22"
          height="22"
          rx="7"
          fill="rgba(45,212,191,0.18)"
          stroke="#2dd4bf"
          strokeWidth="1.4"
        />
        <circle cx="600" cy="440" r="3.4" fill="#99f6e4" />
      </g>

      {/* Secondary pins */}
      <g>
        <circle cx="470" cy="300" r="9" fill="#2dd4bf" opacity="0.12" />
        <circle
          cx="470"
          cy="300"
          r="4.5"
          fill="#2dd4bf"
          stroke="#ecfdf5"
          strokeWidth="1.2"
        />
        <circle cx="330" cy="410" r="9" fill="#2dd4bf" opacity="0.12" />
        <circle
          cx="330"
          cy="410"
          r="4.5"
          fill="#2dd4bf"
          stroke="#ecfdf5"
          strokeWidth="1.2"
        />
      </g>

      {/* Active request pin */}
      <g>
        <circle
          cx="250"
          cy="190"
          r="11"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.6"
          className="animate-pulse-ring"
          style={{ transformOrigin: "250px 190px" }}
        />
        <circle
          cx="250"
          cy="190"
          r="11"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.6"
          className="animate-pulse-ring"
          style={{ transformOrigin: "250px 190px", animationDelay: "1.3s" }}
        />
        <circle cx="250" cy="190" r="15" fill="#34d399" opacity="0.16" />
        <circle
          cx="250"
          cy="190"
          r="6.5"
          fill="url(#city-pin)"
          stroke="#ecfdf5"
          strokeWidth="1.6"
        />
      </g>

      {/* Unit travelling along the dispatch route */}
      <circle r="4.5" fill="#d1fae5" className="motion-dot">
        <animateMotion dur="6s" repeatCount="indefinite" path={ROUTE_PATH} />
      </circle>
    </svg>
  );
}
