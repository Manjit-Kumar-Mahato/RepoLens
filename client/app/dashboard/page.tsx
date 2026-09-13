"use client";

import { RequireAuth } from "@/components/providers/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <AppShell hideHeader>
        <div className="min-h-full p-6">
          <OverviewDashboard />
        </div>
      </AppShell>
    </RequireAuth>
  );
}