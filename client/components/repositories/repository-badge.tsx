"use client";

import type { ReactNode } from "react";

type RepositoryBadgeProps = {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
};

export function RepositoryBadge({
  children,
  variant = "default",
}: RepositoryBadgeProps) {
  const variants = {
    default:
      "border border-border/70 bg-muted/50 text-muted-foreground",

    success:
      "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    warning:
      "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400",

    error:
      "border border-red-500/20 bg-red-500/10 text-red-400",

    info:
      "border border-blue-500/20 bg-blue-500/10 text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${variants[variant]}`}
    >
      {children}
    </span>
  );
}