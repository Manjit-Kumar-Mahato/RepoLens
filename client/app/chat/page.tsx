"use client";

import Link from "next/link";
import {
  ArrowRight,
  FolderGit2,
  GitBranch,
  Library,
  Plus,
  RefreshCw,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { RequireAuth } from "@/components/providers/require-auth";
import {
  useRefreshRepos,
  useRepos,
} from "@/hooks/use-repos";

function ChatHome() {
  const reposQuery = useRepos();
  const refreshRepos = useRefreshRepos();

  const repos = reposQuery.data ?? [];

  /*
   * Chat is available only for repositories whose
   * indexing has completed successfully.
   */
  const indexedRepos = repos.filter(
    (repo) => repo.indexStatus === "READY"
  );

  return (
    <AppShell
      title="Chat with your code"
      description="Choose an indexed repository to start asking questions."
    >
      <div className="min-h-full">
        <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-10">

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/repositories"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Index a repository
            </Link>

            <button
              type="button"
              disabled={refreshRepos.isPending}
              onClick={() => refreshRepos.mutate()}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshRepos.isPending
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshRepos.isPending
                ? "Syncing..."
                : "Sync repositories"}
            </button>
          </div>

          {/* Repository section */}
          <section className="mt-10">

            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Your repositories
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Indexed repositories
                </h2>
              </div>

              {indexedRepos.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {indexedRepos.length}{" "}
                  {indexedRepos.length === 1
                    ? "repository"
                    : "repositories"}
                </span>
              )}
            </div>

            {/* Loading */}
            {reposQuery.isLoading && (
              <div className="overflow-hidden rounded-xl border border-border/70">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[76px] animate-pulse border-b border-border/60 bg-muted/20 last:border-b-0"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {reposQuery.isError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-semibold">
                  Could not load repositories
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {reposQuery.error instanceof Error
                    ? reposQuery.error.message
                    : "Something went wrong while loading your repositories."}
                </p>

                <button
                  type="button"
                  onClick={() => reposQuery.refetch()}
                  className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!reposQuery.isLoading &&
              !reposQuery.isError &&
              indexedRepos.length === 0 && (
                <div className="rounded-xl border border-dashed border-border/70 px-6 py-14 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                    <FolderGit2 className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    No indexed repositories
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Index a repository first. Once indexing is
                    complete, it will appear here and you can
                    chat with its code.
                  </p>

                  <Link
                    href="/repositories"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    Go to repositories
                  </Link>

                </div>
              )}

            {/* Indexed repositories */}
            {!reposQuery.isLoading &&
              !reposQuery.isError &&
              indexedRepos.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-border/70 bg-card/30">

                  {indexedRepos.map((repo, index) => (
                    <Link
                      key={repo.id}
                      href={`/chat/${repo.id}`}
                      className={`group flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-muted/40 ${
                        index !== indexedRepos.length - 1
                          ? "border-b border-border/60"
                          : ""
                      }`}
                    >

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                          <FolderGit2 className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground" />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-semibold">
                            {repo.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">

                            <span className="truncate">
                              {repo.fullName}
                            </span>

                            <span className="hidden items-center gap-1 sm:inline-flex">
                              <GitBranch className="h-3 w-3" />
                              {repo.defaultBranch}
                            </span>

                          </div>

                        </div>

                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />

                    </Link>
                  ))}

                </div>
              )}

          </section>
        </div>
      </div>
    </AppShell>
  );
}

export default function ChatPage() {
  return (
    <RequireAuth>
      <ChatHome />
    </RequireAuth>
  );
}