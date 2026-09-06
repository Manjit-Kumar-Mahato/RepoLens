"use client";

import type { ReactNode } from "react";

type RepositoryHeaderProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function RepositoryHeader({
  title = "Dashboard",
  description = "Manage and explore your GitHub repositories.",
  action,
}: RepositoryHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}