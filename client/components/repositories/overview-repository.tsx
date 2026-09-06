"use client";

import { RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  useRepos,
  useRefreshRepos,
  useStartIndexing,
} from "@/hooks/use-repos";

import { RepoCard } from "./repo-card";
import { RepositoryHeader } from "./repository-header";
import { RepositoryErrorAlert } from "./repository-error-alert";

type VisibilityFilter = "ALL" | "PUBLIC" | "PRIVATE";

type StatusFilter =
  | "ALL"
  | "READY"
  | "INDEXING"
  | "PENDING"
  | "FAILED";

export function OverviewRepository() {
  const reposQuery = useRepos();
  const refreshRepos = useRefreshRepos();
  const startIndexing = useStartIndexing();

  const [search, setSearch] = useState("");
  const [visibility, setVisibility] =
    useState<VisibilityFilter>("ALL");

  const [status, setStatus] =
    useState<StatusFilter>("ALL");

  const repos = reposQuery.data ?? [];

  const totalRepos = repos.length;

  const indexedRepos = repos.filter(
    (repo) => repo.indexStatus === "READY"
  ).length;

  const indexingRepos = repos.filter(
    (repo) => repo.indexStatus === "INDEXING"
  ).length;

  const filteredRepos = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return repos.filter((repo) => {
      if (
        visibility === "PUBLIC" &&
        repo.isPrivate
      ) {
        return false;
      }

      if (
        visibility === "PRIVATE" &&
        !repo.isPrivate
      ) {
        return false;
      }

      if (
        status !== "ALL" &&
        repo.indexStatus !== status
      ) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return (
        repo.name
          .toLowerCase()
          .includes(searchValue) ||
        repo.fullName
          .toLowerCase()
          .includes(searchValue) ||
        repo.owner
          .toLowerCase()
          .includes(searchValue) ||
        (repo.language ?? "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [repos, search, visibility, status]);

  if (reposQuery.isLoading) {
    return (
      <div className="space-y-6">
        <RepositoryHeader
          title="Repositories"
          description="Manage your GitHub repositories and indexing."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-[280px] animate-pulse rounded-2xl border bg-muted/20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (reposQuery.isError) {
    return (
      <div className="space-y-6">
        <RepositoryHeader
          title="Repositories"
          description="Manage your GitHub repositories and indexing."
        />

        <RepositoryErrorAlert
          message={
            reposQuery.error instanceof Error
              ? reposQuery.error.message
              : "Unable to load repositories."
          }
          onRetry={() => reposQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <RepositoryHeader
        title="Repositories"
        description={`${totalRepos} connected · ${indexedRepos} ready`}
        action={
          <button
            type="button"
            disabled={refreshRepos.isPending}
            onClick={() => refreshRepos.mutate()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
              : "Sync"}
          </button>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card/30 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Connected
          </p>

          <p className="mt-1 text-2xl font-bold">
            {totalRepos}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/30 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Ready
          </p>

          <p className="mt-1 text-2xl font-bold">
            {indexedRepos}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/30 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Indexing
          </p>

          <p className="mt-1 text-2xl font-bold">
            {indexingRepos}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search repositories..."
            className="h-10 w-full rounded-lg border border-border/70 bg-background/50 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Visibility */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Visibility
            </span>

            <FilterButton
              active={visibility === "ALL"}
              onClick={() =>
                setVisibility("ALL")
              }
            >
              All
            </FilterButton>

            <FilterButton
              active={visibility === "PUBLIC"}
              onClick={() =>
                setVisibility("PUBLIC")
              }
            >
              Public
            </FilterButton>

            <FilterButton
              active={visibility === "PRIVATE"}
              onClick={() =>
                setVisibility("PRIVATE")
              }
            >
              Private
            </FilterButton>
          </div>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Status
            </span>

            <FilterButton
              active={status === "ALL"}
              onClick={() =>
                setStatus("ALL")
              }
            >
              All
            </FilterButton>

            <FilterButton
              active={status === "READY"}
              onClick={() =>
                setStatus("READY")
              }
            >
              Ready
            </FilterButton>

            <FilterButton
              active={status === "INDEXING"}
              onClick={() =>
                setStatus("INDEXING")
              }
            >
              Indexing
            </FilterButton>

            <FilterButton
              active={status === "PENDING"}
              onClick={() =>
                setStatus("PENDING")
              }
            >
              New
            </FilterButton>

            <FilterButton
              active={status === "FAILED"}
              onClick={() =>
                setStatus("FAILED")
              }
            >
              Failed
            </FilterButton>
          </div>
        </div>
      </div>

      {/* Repository Grid */}
      {filteredRepos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 px-6 py-16 text-center">
          {repos.length === 0 ? (
            <>
              <h2 className="text-lg font-semibold">
                No repositories found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Click Sync to fetch your latest
                repositories from GitHub.
              </p>

              <button
                type="button"
                disabled={refreshRepos.isPending}
                onClick={() =>
                  refreshRepos.mutate()
                }
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {refreshRepos.isPending
                  ? "Syncing..."
                  : "Sync repositories"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">
                No matching repositories
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setVisibility("ALL");
                  setStatus("ALL");
                }}
                className="mt-5 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRepos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              indexing={
                startIndexing.isPending &&
                startIndexing.variables === repo.id
              }
              onIndex={(repoId) =>
                startIndexing.mutate(repoId)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

type FilterButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function FilterButton({
  active,
  children,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}