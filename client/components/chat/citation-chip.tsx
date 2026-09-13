"use client";

import {
  ExternalLink,
  FileCode2,
} from "lucide-react";

import type {
  Citation,
  Repository,
} from "@/lib/api";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CitationChipProps = {
  citation: Citation;
  repo: Repository;
};

function getGithubUrl(
  repo: Repository,
  citation: Citation
) {
  const branch =
    repo.defaultBranch || "main";

  const filePath = citation.filePath
    .split("/")
    .map((part) =>
      encodeURIComponent(part)
    )
    .join("/");

  let url =
    `https://github.com/${encodeURIComponent(
      repo.owner
    )}/${encodeURIComponent(
      repo.name
    )}/blob/${encodeURIComponent(
      branch
    )}/${filePath}`;

  if (citation.startLine != null) {
    const start = citation.startLine;

    if (
      citation.endLine != null &&
      citation.endLine !== citation.startLine
    ) {
      url += `#L${start}-L${citation.endLine}`;
    } else {
      url += `#L${start}`;
    }
  }

  return url;
}

export function CitationChip({
  citation,
  repo,
}: CitationChipProps) {
  const lineLabel =
    citation.startLine != null
      ? citation.endLine != null &&
        citation.endLine !==
          citation.startLine
        ? `L${citation.startLine}-L${citation.endLine}`
        : `L${citation.startLine}`
      : null;

  const label = lineLabel
    ? `${citation.filePath}:${lineLabel}`
    : citation.filePath;

  const githubUrl = getGithubUrl(
    repo,
    citation
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-normal text-foreground transition-colors hover:bg-muted"
            />
          }
        >
          <FileCode2 className="size-3.5 shrink-0" />

          <span className="max-w-52 truncate">
            {label}
          </span>

          <ExternalLink className="size-3 shrink-0 opacity-60" />
        </TooltipTrigger>

        <TooltipContent>
          <div className="flex max-w-sm flex-col gap-1">
            <span className="font-medium">
              Open on GitHub
            </span>

            <span className="text-background/70">
              {citation.filePath}
            </span>

            {lineLabel && (
              <span className="text-background/70">
                {lineLabel}
              </span>
            )}

            {citation.language && (
              <span className="text-background/70">
                {citation.language}
              </span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}