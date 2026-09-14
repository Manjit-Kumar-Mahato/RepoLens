"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

import {
  useIndexStatus,
  useRepository,
  useStartIndexing,
} from "@/hooks/use-repos";

import { AppShell } from "@/components/layout/app-shell";
import { RepositoryBadge } from "./repository-badge";
import { RepositoryErrorAlert } from "./repository-error-alert";
import { RepoStatus } from "./repo-status";

type RepoDashboardProps = {
  repoId: string;
};

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.05c.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.67.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function RepoDashboard({
  repoId,
}: RepoDashboardProps) {
  const repoQuery = useRepository(repoId);

  const statusQuery = useIndexStatus(
    repoId,
    repoQuery.data?.indexStatus === "INDEXING"
  );

  const startIndexing = useStartIndexing();

  if (repoQuery.isLoading) {
    return (
      <AppShell
        title="Repository"
        description="Loading repository..."
      >
        <div className="mx-auto w-full max-w-6xl p-6">
          <div className="flex min-h-96 items-center justify-center rounded-2xl border bg-card/40">
            <p className="text-sm text-muted-foreground">
              Loading repository...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (repoQuery.isError || !repoQuery.data) {
    return (
      <AppShell
        title="Repository"
        description="Repository unavailable"
      >
        <div className="mx-auto w-full max-w-6xl p-6">
          <RepositoryErrorAlert
            message={
              repoQuery.error instanceof Error
                ? repoQuery.error.message
                : "Repository could not be loaded."
            }
            onRetry={() => repoQuery.refetch()}
          />
        </div>
      </AppShell>
    );
  }

  const repo = repoQuery.data;

  const isIndexing = repo.indexStatus === "INDEXING";
  const isPending = repo.indexStatus === "PENDING";
  const isFailed = repo.indexStatus === "FAILED";
  const isReady = repo.indexStatus === "READY";

  const handleIndex = () => {
    startIndexing.mutate(repo.id);
  };

  return (
    <AppShell
      title={repo.name}
      description={repo.fullName}
      actions={
        <Link
          href={`/chat/${repo.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-7xl space-y-6 p-6">

        {/* Back */}
        <Link
          href="/repositories"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to repositories
        </Link>

        {/* Repository header */}
        <section className="rounded-2xl border bg-card/40 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <GitBranch className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="truncate text-2xl font-bold tracking-tight">
                      {repo.name}
                    </h1>

                    <RepositoryBadge
                      variant={
                        isReady
                          ? "success"
                          : isIndexing
                            ? "info"
                            : isFailed
                              ? "error"
                              : "warning"
                      }
                    >
                      {isReady
                        ? "Ready"
                        : isIndexing
                          ? "Indexing"
                          : isFailed
                            ? "Failed"
                            : "Changes detected"}
                    </RepositoryBadge>

                  </div>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {repo.fullName}
                  </p>
                </div>

              </div>

              {repo.description && (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {repo.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">

              {repo.htmlUrl && (
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  <GitHubIcon />
                  GitHub
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <button
                type="button"
                disabled={
                  startIndexing.isPending ||
                  isIndexing
                }
                onClick={handleIndex}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={
                    isIndexing
                      ? "h-4 w-4 animate-spin"
                      : "h-4 w-4"
                  }
                />

                {isIndexing
                  ? "Indexing..."
                  : startIndexing.isPending
                    ? "Starting..."
                    : isPending
                      ? "Re-index"
                      : isFailed
                        ? "Retry indexing"
                        : "Re-index"}
              </button>

            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border bg-card/40 p-5">
            <p className="text-sm text-muted-foreground">
              Total files
            </p>

            <p className="mt-2 text-3xl font-bold">
              {repo.filesTotal}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Files discovered
            </p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-5">
            <p className="text-sm text-muted-foreground">
              Processed files
            </p>

            <p className="mt-2 text-3xl font-bold">
              {repo.filesProcessed}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Files indexed
            </p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-5">
            <p className="text-sm text-muted-foreground">
              Chunks
            </p>

            <p className="mt-2 text-3xl font-bold">
              {repo.chunkCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Vectorized code chunks
            </p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-5">
            <p className="text-sm text-muted-foreground">
              Branch
            </p>

            <p className="mt-2 flex items-center gap-2 text-xl font-bold">
              <GitBranch className="h-5 w-5 text-muted-foreground" />
              {repo.defaultBranch}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Default branch
            </p>
          </div>

        </section>

        {/* Repository information + Index status */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* Repository information */}
          <div className="rounded-2xl border bg-card/40 p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold">
                  Repository information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Details about this connected GitHub repository.
                </p>
              </div>

              <RepositoryBadge
                variant={
                  repo.isPrivate
                    ? "warning"
                    : "default"
                }
              >
                {repo.isPrivate
                  ? "Private"
                  : "Public"}
              </RepositoryBadge>

            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Owner
                </p>

                <p className="mt-2 font-medium">
                  {repo.owner}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Repository
                </p>

                <p className="mt-2 font-medium">
                  {repo.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Default branch
                </p>

                <p className="mt-2 flex items-center gap-2 font-medium">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  {repo.defaultBranch}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Language
                </p>

                <p className="mt-2 font-medium">
                  {repo.language || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Visibility
                </p>

                <p className="mt-2 font-medium">
                  {repo.isPrivate
                    ? "Private"
                    : "Public"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  GitHub repository ID
                </p>

                <p className="mt-2 font-medium">
                  {repo.githubRepoId}
                </p>
              </div>

            </div>
          </div>

          {/* Index status */}
          <div className="rounded-2xl border bg-card/40 p-6">

            <div>
              <h2 className="text-lg font-semibold">
                Index status
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Current RepoLens indexing state.
              </p>
            </div>

            <div className="mt-6">
              <RepoStatus repo={repo} />
            </div>

            {statusQuery.isFetching && (
              <p className="mt-5 text-xs text-muted-foreground">
                Updating status...
              </p>
            )}

          </div>

        </section>

        {/* Repository version */}
        <section className="rounded-2xl border bg-card/40 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Repository version
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                The GitHub version currently represented in your
                RepoLens index.
              </p>
            </div>

            <div className="text-left md:text-right">

              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Indexed commit
              </p>

              <p className="mt-2 font-mono text-sm font-medium">
                {repo.indexedCommitSha
                  ? repo.indexedCommitSha.slice(0, 12)
                  : "Not available"}
              </p>

            </div>

          </div>

          {isPending && (
            <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

              <p className="text-sm font-medium">
                Repository changes detected
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                This repository has changed since the last successful
                indexing. Re-index it to update the AI knowledge base.
              </p>

            </div>
          )}

          {isReady && (
            <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/5 p-4">

              <p className="text-sm font-medium">
                Repository is up to date
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your RepoLens index represents the latest synchronized
                repository version.
              </p>

            </div>
          )}

        </section>

        {/* Last indexed */}
        <section className="flex flex-col gap-4 rounded-2xl border bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium">
              Last successful indexing
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {repo.indexedAt
                ? new Date(repo.indexedAt).toLocaleString()
                : "This repository has not been indexed yet."}
            </p>
          </div>

          <Link
            href={`/chat/${repo.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <MessageSquare className="h-4 w-4" />
            Chat with this repository
          </Link>

        </section>

      </div>
    </AppShell>
  );
}