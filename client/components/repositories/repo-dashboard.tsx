"use client";

import Link from "next/link";

import {
  useIndexStatus,
  useRepository,
  useStartIndexing,
} from "@/hooks/use-repos";

import { RepositoryBadge } from "./repository-badge";
import { RepositoryErrorAlert } from "./repository-error-alert";
import { RepositoryHeader } from "./repository-header";
import { RepoStatus } from "./repo-status";

type RepoDashboardProps = {
  repoId: string;
};

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
      <div className="space-y-6">
        <RepositoryHeader />

        <div className="flex min-h-64 items-center justify-center rounded-xl border">
          <p className="text-sm text-muted-foreground">
            Loading repository...
          </p>
        </div>
      </div>
    );
  }

  if (repoQuery.isError || !repoQuery.data) {
    return (
      <div className="space-y-6">
        <RepositoryHeader />

        <RepositoryErrorAlert
          message={
            repoQuery.error instanceof Error
              ? repoQuery.error.message
              : "Repository could not be loaded."
          }
          onRetry={() => repoQuery.refetch()}
        />
      </div>
    );
  }

  const repo = repoQuery.data;

  const isIndexing =
    repo.indexStatus === "INDEXING";

  const isPending =
    repo.indexStatus === "PENDING";

  const isFailed =
    repo.indexStatus === "FAILED";

  return (
    <div className="space-y-6">

      {/* Back link */}
      <div>
        <Link
          href="/repositories"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to repositories
        </Link>
      </div>

      {/* Header */}
      <RepositoryHeader
        title={repo.name}
        description={repo.fullName}
        action={
          <div className="flex gap-2">

            {repo.htmlUrl && (
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                GitHub
              </a>
            )}

            <button
              type="button"
              disabled={
                startIndexing.isPending ||
                isIndexing
              }
              onClick={() =>
                startIndexing.mutate(repo.id)
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isIndexing
                ? "Indexing..."
                : startIndexing.isPending
                  ? "Starting..."
                  : isPending
                    ? "Re-index"
                    : isFailed
                      ? "Retry indexing"
                      : "Start indexing"}
            </button>

          </div>
        }
      />

      {/* Repository information + status */}
      <div className="grid gap-5 lg:grid-cols-3">

        <div className="rounded-xl border p-5 lg:col-span-2">

          <div className="flex items-center justify-between">

            <h2 className="font-semibold">
              Repository information
            </h2>

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

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs text-muted-foreground">
                Owner
              </p>

              <p className="mt-1 font-medium">
                {repo.owner}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Default branch
              </p>

              <p className="mt-1 font-medium">
                {repo.defaultBranch}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Language
              </p>

              <p className="mt-1 font-medium">
                {repo.language || "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                GitHub repository ID
              </p>

              <p className="mt-1 font-medium">
                {repo.githubRepoId}
              </p>
            </div>

          </div>

          {repo.description && (
            <div className="mt-6 border-t pt-5">

              <p className="text-xs text-muted-foreground">
                Description
              </p>

              <p className="mt-2 text-sm">
                {repo.description}
              </p>

            </div>
          )}

        </div>

        {/* Index status */}
        <div className="rounded-xl border p-5">

          <h2 className="font-semibold">
            Index status
          </h2>

          <div className="mt-5">
            <RepoStatus repo={repo} />
          </div>

          {statusQuery.isFetching && (
            <p className="mt-4 text-xs text-muted-foreground">
              Updating status...
            </p>
          )}

        </div>

      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            Total files
          </p>

          <p className="mt-2 text-2xl font-bold">
            {repo.filesTotal}
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            Processed files
          </p>

          <p className="mt-2 text-2xl font-bold">
            {repo.filesProcessed}
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            Chunks
          </p>

          <p className="mt-2 text-2xl font-bold">
            {repo.chunkCount}
          </p>

        </div>

      </div>

    </div>
  );
}