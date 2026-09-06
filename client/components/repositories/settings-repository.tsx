"use client";

import {
  useCurrentUser,
  useLogout,
} from "@/hooks/use-auth";

export function SettingsRepository() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Settings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your RepoLens account.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">
            Loading account information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your RepoLens account.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-semibold">
          GitHub account
        </h2>

        <div className="mt-5 flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {user?.displayName?.charAt(0) ?? "U"}
            </div>
          )}

          <div>
            <p className="font-medium">
              {user?.displayName ?? "Unknown user"}
            </p>

            <p className="text-sm text-muted-foreground">
              @{user?.gitUsername ?? "unknown"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-semibold">
          Account
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign out of your RepoLens account.
        </p>

        <button
          type="button"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="mt-4 rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
        >
          {logout.isPending ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}