export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      <span className="text-ink">Melod</span>
      <span className="grad-text">IQ</span>
    </span>
  );
}
