"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function DashboardCard({
  href,
  title,
  desc,
  icon,
  accent,
  index = 0,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="card group relative block overflow-hidden p-5 active:scale-[0.98] transition-transform"
      >
        <div
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70"
          style={{ background: accent }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ background: accent }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted">{desc}</p>
          </div>
          <span className="ml-auto text-muted transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
