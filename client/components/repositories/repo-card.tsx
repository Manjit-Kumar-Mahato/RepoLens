"use client";

import {
  ExternalLink,
  GitBranch,
  Lock,
  Sparkles,
  Unlock,
} from "lucide-react";

import type { Repository } from "@/lib/api";

import { RepositoryBadge } from "./repository-badge";
import { RepoStatus } from "./repo-status";

type RepoCardProps = {
  repo: Repository;
  onIndex?: (repoId: string) => void;
  indexing?: boolean;
};

function getLanguageClass(language: string | null) {
  if (!language) {
    return "bg-muted text-muted-foreground";
  }

  const value = language.toLowerCase();

  if (value === "javascript") {
    return "bg-yellow-400 text-black";
  }

  if (value === "typescript") {
    return "bg-blue-500 text-white";
  }

  if (value === "java") {
    return "bg-orange-500 text-white";
  }

  if (value === "python") {
    return "bg-blue-600 text-white";
  }

  if (value === "c++" || value === "cpp") {
    return "bg-blue-700 text-white";
  }

  if (value === "c") {
    return "bg-blue-500 text-white";
  }

  if (value === "go") {
    return "bg-cyan-500 text-white";
  }

  if (value === "rust") {
    return "bg-orange-600 text-white";
  }

  if (value === "php") {
    return "bg-indigo-500 text-white";
  }

  if (value === "kotlin") {
    return "bg-purple-500 text-white";
  }

  return "bg-muted text-muted-foreground";
}

function getLanguageShortName(language: string | null) {
  if (!language) {
    return "</>";
  }

  const value = language.toLowerCase();

  if (value === "javascript") return "JS";
  if (value === "typescript") return "TS";
  if (value === "python") return "PY";
  if (value === "java") return "JV";
  if (value === "kotlin") return "KT";
  if (value === "c++" || value === "cpp") return "C+";
  if (value === "c") return "C";
  if (value === "go") return "GO";
  if (value === "rust") return "RS";
  if (value === "php") return "PHP";

  return language.slice(0, 2).toUpperCase();
}

export function RepoCard({
  repo,
  onIndex,
  indexing = false,
}: RepoCardProps) {
  const languageClass = getLanguageClass(repo.language);
  const languageShortName = getLanguageShortName(repo.language);

  const isIndexing = repo.indexStatus === "INDEXING";
  const isReady = repo.indexStatus === "READY";

  return (
    <div className="group flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-lg">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${languageClass}`}
          >
            {languageShortName}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">
              {repo.owner}
            </p>

            <h3 className="truncate text-base font-semibold tracking-tight">
              {repo.name}
            </h3>
          </div>
        </div>

        <RepositoryBadge
          variant={
            isReady
              ? "success"
              : isIndexing
                ? "info"
                : repo.indexStatus === "FAILED"
                  ? "error"
                  : "default"
          }
        >
          {isReady
            ? "Ready"
            : isIndexing
              ? "Indexing"
              : repo.indexStatus === "FAILED"
                ? "Failed"
                : "Not indexed"}
        </RepositoryBadge>
      </div>

      {/* Description */}
      <div className="flex-1 px-5">
        <p className="line-clamp-3 min-h-[60px] text-sm leading-6 text-muted-foreground">
          {repo.description || "No description provided."}
        </p>

        {/* Metadata */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
            {repo.isPrivate ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}

            {repo.isPrivate ? "Private" : "Public"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
            <GitBranch className="h-3 w-3" />
            {repo.defaultBranch}
          </span>

          {repo.language && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full ${languageClass.split(" ")[0]}`}
              />
              {repo.language}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="mt-5">
          <RepoStatus repo={repo} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-border/60 px-5 py-4">
        {repo.htmlUrl ? (
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub
          </a>
        ) : (
          <span />
        )}

        {onIndex && (
          <button
            type="button"
            disabled={indexing || isIndexing}
            onClick={() => onIndex(repo.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />

            {indexing
              ? "Starting..."
              : isIndexing
                ? "Indexing..."
                : "Index"}
          </button>
        )}
      </div>
    </div>
  );
}