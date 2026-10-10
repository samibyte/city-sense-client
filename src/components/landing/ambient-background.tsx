export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="landing-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
    </div>
  );
}
