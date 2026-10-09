const PARTICLES = [
  {
    left: "8%",
    top: "22%",
    size: 3,
    delay: 0,
    duration: 9,
    driftX: "26px",
    driftY: "-30px",
    opacity: 0.5,
  },
  {
    left: "16%",
    top: "68%",
    size: 2,
    delay: 1.4,
    duration: 11,
    driftX: "-20px",
    driftY: "-38px",
    opacity: 0.4,
  },
  {
    left: "24%",
    top: "38%",
    size: 4,
    delay: 0.8,
    duration: 10,
    driftX: "34px",
    driftY: "-22px",
    opacity: 0.35,
  },
  {
    left: "33%",
    top: "82%",
    size: 2,
    delay: 2.2,
    duration: 12,
    driftX: "-28px",
    driftY: "-30px",
    opacity: 0.45,
  },
  {
    left: "44%",
    top: "12%",
    size: 3,
    delay: 0.4,
    duration: 9,
    driftX: "22px",
    driftY: "-34px",
    opacity: 0.5,
  },
  {
    left: "52%",
    top: "58%",
    size: 2,
    delay: 1.8,
    duration: 10,
    driftX: "-24px",
    driftY: "-26px",
    opacity: 0.3,
  },
  {
    left: "61%",
    top: "30%",
    size: 4,
    delay: 2.6,
    duration: 12,
    driftX: "30px",
    driftY: "-36px",
    opacity: 0.4,
  },
  {
    left: "70%",
    top: "74%",
    size: 2,
    delay: 1.1,
    duration: 9,
    driftX: "-18px",
    driftY: "-30px",
    opacity: 0.45,
  },
  {
    left: "78%",
    top: "18%",
    size: 3,
    delay: 0.2,
    duration: 11,
    driftX: "26px",
    driftY: "-28px",
    opacity: 0.5,
  },
  {
    left: "86%",
    top: "52%",
    size: 2,
    delay: 2.9,
    duration: 10,
    driftX: "-26px",
    driftY: "-34px",
    opacity: 0.35,
  },
  {
    left: "92%",
    top: "84%",
    size: 3,
    delay: 1.6,
    duration: 12,
    driftX: "20px",
    driftY: "-24px",
    opacity: 0.4,
  },
  {
    left: "48%",
    top: "88%",
    size: 2,
    delay: 3.2,
    duration: 11,
    driftX: "-22px",
    driftY: "-28px",
    opacity: 0.3,
  },
];

/**
 * Fixed, layered atmosphere for the landing page: deep brand-tinted
 * base, aurora glows, a fine street grid, drifting particles and film
 * grain. Purely decorative — always aria-hidden.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-landing-bg" />

      {/* Aurora glows */}
      <div className="absolute -top-40 -left-40 size-[34rem] rounded-full bg-primary/14 blur-[130px] animate-pan" />
      <div className="absolute top-24 -right-48 size-[38rem] rounded-full bg-secondary/12 blur-[150px]" />
      <div className="absolute -bottom-56 left-1/4 size-[36rem] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="absolute top-1/3 left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-teal-400/8 blur-[120px]" />

      {/* Street grid, masked to a soft pool */}
      <div className="landing-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_38%,black,transparent)] opacity-70" />

      {/* Drifting particles */}
      {PARTICLES.map((p) => (
        <span
          key={`${p.left}-${p.top}-${p.duration}`}
          className="absolute rounded-full bg-emerald-200/70 animate-drift"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift-x": p.driftX,
              "--drift-y": p.driftY,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Film grain */}
      <div className="landing-noise absolute inset-0" />
    </div>
  );
}
