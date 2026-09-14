"use client";

import type { Repository } from "@/lib/api";
import { getRepoProgress } from "@/hooks/use-repos";
import { RepositoryBadge } from "./repository-badge";

type RepoStatusProps = {
  repo: Repository;
};

export function RepoStatus({
  repo,
}: RepoStatusProps) {
  const progress = getRepoProgress(repo);

  let variant:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info" = "default";

  let label = "New";

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
      label = "Changes detected";
      break;
  }

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Status
        </span>

        <RepositoryBadge variant={variant}>
          {label}
        </RepositoryBadge>
      </div>

      {repo.indexStatus === "INDEXING" && (
        <div className="space-y-3">

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Indexing progress
            </span>

            <span className="font-medium">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {repo.filesProcessed} of{" "}
            {repo.filesTotal} files processed
          </p>
        </div>
      )}

      {repo.indexStatus === "READY" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Your repository is indexed and ready for AI
            conversations.
          </p>

          <p className="text-xs text-muted-foreground">
            {repo.filesTotal} files · {repo.chunkCount} chunks
          </p>
        </div>
      )}

      {repo.indexStatus === "PENDING" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Changes have been detected in the GitHub repository.
          </p>

          <p className="text-xs text-muted-foreground">
            Re-index the repository to update the AI knowledge base.
          </p>
        </div>
      )}

      {repo.indexStatus === "FAILED" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Indexing failed for this repository.
          </p>

          {repo.errorMessage && (
            <p className="line-clamp-3 text-xs text-red-400">
              {repo.errorMessage}
            </p>
          )}
        </div>
      )}

    </div>
  );
}