"use client";

import {
  ExternalLink,
  LogOut,
  User,
} from "lucide-react";

import { RequireAuth } from "@/components/providers/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  useCurrentUser,
  useLogout,
} from "@/hooks/use-auth";

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) {
    return (
      <RequireAuth>
        <AppShell
          title="Settings"
          description="Profile, appearance, and account preferences"
        >
          <div className="mx-auto w-full max-w-4xl p-4 md:p-8">
            <div className="space-y-6">
              <SettingsSkeleton />
              <SettingsSkeleton />
              <SettingsSkeleton />
            </div>
          </div>
        </AppShell>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AppShell
        title="Settings"
        description="Profile, appearance, and account preferences"
      >
        <div className="h-full overflow-auto">
          <div className="mx-auto w-full max-w-4xl p-4 md:p-8">
            <div className="space-y-6">

              {/* Profile */}
              <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
                <div className="mb-6">
                  <h2 className="font-heading text-lg font-semibold">
                    Profile
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Your GitHub account connected to RepoLens.
                  </p>
                </div>

                {user && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={
                              user.displayName ||
                              user.gitUsername
                            }
                            className="size-full object-cover"
                          />
                        ) : (
                          <User className="size-7 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-heading text-base font-semibold">
                          {user.displayName ||
                            user.gitUsername}
                        </h3>

                        <p className="truncate text-sm text-muted-foreground">
                          @{user.gitUsername}
                        </p>
                      </div>
                    </div>

                    <div className="my-6 border-t" />

                    <div className="space-y-4">
                      <SettingRow
                        label="Display name"
                        value={
                          user.displayName ||
                          user.gitUsername
                        }
                      />

                      <SettingRow
                        label="GitHub username"
                        value={`@${user.gitUsername}`}
                      />

                      <SettingRow
                        label="Authentication"
                        value={
                          <span className="inline-flex items-center gap-2">
                            <GitHubIcon className="size-4" />
                            GitHub OAuth
                          </span>
                        }
                      />
                    </div>
                  </>
                )}
              </section>

              {/* Appearance */}
              <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
                <div className="mb-6">
                  <h2 className="font-heading text-lg font-semibold">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Customize how RepoLens looks on your device.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      Dark mode
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Switch between light and dark themes.
                    </p>
                  </div>

                  <ModeToggle />
                </div>

                <div className="my-5 border-t" />

                <div>
                  <h3 className="text-sm font-medium">
                    Theme selector
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Current theme: dark
                  </p>
                </div>
              </section>

              {/* Account Actions */}
              <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
                <div className="mb-6">
                  <h2 className="font-heading text-lg font-semibold">
                    Account actions
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your session and connected GitHub
                    account.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {user && (
                    <Button
                      variant="outline"
                      render={
                        <a
                          href={`https://github.com/${user.gitUsername}`}
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                    >
                      <GitHubIcon data-icon="inline-start" />

                      Manage on GitHub

                      <ExternalLink
                        data-icon="inline-end"
                      />
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                  >
                    <LogOut data-icon="inline-start" />

                    {logout.isPending
                      ? "Logging out..."
                      : "Log out"}
                  </Button>
                </div>
              </section>

            </div>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

function SettingRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-medium sm:text-right">
        {value}
      </span>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-card p-6">
      <div className="h-5 w-32 rounded bg-muted" />

      <div className="mt-3 h-4 w-64 rounded bg-muted" />

      <div className="mt-6 h-16 rounded bg-muted" />
    </div>
  );
}

function GitHubIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16v3.2c0 .3.21.65.79.54A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}