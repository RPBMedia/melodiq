import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MelodIQ home"
      className={`font-display font-bold tracking-tight transition-opacity hover:opacity-80 ${className}`}
    >
      <span className="text-ink">Melod</span>
      <span className="grad-text">IQ</span>
    </Link>
  );
}
