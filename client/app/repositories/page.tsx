"use client";

import { RequireAuth } from "@/components/providers/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { OverviewRepository } from "@/components/repositories/overview-repository";

export default function RepositoryPage() {
  return (
    <RequireAuth>
      <AppShell hideHeader>
        <div className="min-h-full p-6">
          <OverviewRepository />
        </div>
      </AppShell>
    </RequireAuth>
  );
}