"use client";

import type { Repository } from "@/lib/api";

type IndexingStateProps = {
  repo: Repository;
  status?: {
    repositoryId: string;
    indexStatus: Repository["indexStatus"];
    filesTotal: number;
    filesProcessed: number;
    chunkCount: number;
    indexedAt: string | null;
    errorMessage: string | null;
  };
};

export function IndexingState({
  repo,
  status,
}: IndexingStateProps) {
  const indexStatus =
    status?.indexStatus ?? repo.indexStatus;

  const filesProcessed =
    status?.filesProcessed ??
    repo.filesProcessed;

  const filesTotal =
    status?.filesTotal ??
    repo.filesTotal;

  const errorMessage =
    status?.errorMessage ??
    repo.errorMessage;

  const progress = filesTotal
    ? Math.min(
        100,
        Math.round(
          (filesProcessed / filesTotal) * 100
        )
      )
    : 0;

  if (indexStatus === "FAILED") {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mb-4 text-3xl">
            ⚠️
          </div>

          <h2 className="font-heading text-lg font-semibold">
            Indexing failed
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {errorMessage ??
              "Something went wrong while indexing this repository."}
          </p>
        </div>
      </div>
    );
  }

  if (indexStatus === "READY") {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-3xl">
            ✓
          </div>

          <h2 className="font-heading text-lg font-semibold">
            Repository ready
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your repository has been indexed and is
            ready for questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mb-4 text-3xl">
            {indexStatus === "INDEXING"
              ? "⟳"
              : "◌"}
          </div>

          <h2 className="font-heading text-lg font-semibold">
            {indexStatus === "INDEXING"
              ? "Indexing repository..."
              : "Waiting for indexing"}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {indexStatus === "INDEXING"
              ? "We're processing your repository. This page will update automatically."
              : "The repository needs to be indexed before you can chat with the code."}
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Files processed
            </span>

            <span className="font-medium">
              {filesProcessed} / {filesTotal}
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

          <p className="mt-2 text-center text-xs text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
}