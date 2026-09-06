"use client";

import type { Repository } from "@/lib/api";
import { getRepoProgress } from "@/hooks/use-repos";
import { RepositoryBadge } from "./repository-badge";

type RepoStatusProps = {
  repo: Repository;
};

export function RepoStatus({ repo }: RepoStatusProps) {
  const progress = getRepoProgress(repo);

  let variant:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info" = "default";

  let label: string = repo.indexStatus;

  switch (repo.indexStatus) {
    case "INDEXING":
      variant = "info";
      label = "Indexing";
      break;

    case "READY":
      variant = "success";
      label = "Ready";
      break;

    case "FAILED":
      variant = "error";
      label = "Failed";
      break;

    case "PENDING":
      variant = "warning";
      label = "New";
      break;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Status
        </span>

        <RepositoryBadge variant={variant}>
          {label}
        </RepositoryBadge>
      </div>

      {repo.indexStatus === "INDEXING" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {repo.filesProcessed} / {repo.filesTotal} files
            </span>

            <span>{progress}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {repo.indexStatus === "READY" && (
        <p className="text-xs text-muted-foreground">
          {repo.filesTotal} files · {repo.chunkCount} chunks
        </p>
      )}

      {repo.indexStatus === "FAILED" &&
        repo.errorMessage && (
          <p className="line-clamp-2 text-xs text-red-400">
            {repo.errorMessage}
          </p>
        )}
    </div>
  );
}