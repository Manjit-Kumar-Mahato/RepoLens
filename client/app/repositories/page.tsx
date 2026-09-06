"use client";

import { RequireAuth } from "@/components/providers/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { OverviewRepository } from "@/components/repositories/overview-repository";

export default function RepositoryPage() {
  return (
    <RequireAuth>
      <AppShell hideHeader>
        <main className="min-h-svh p-6">
          <OverviewRepository />
        </main>
      </AppShell>
    </RequireAuth>
  );
}