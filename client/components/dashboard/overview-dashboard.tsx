"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FolderGit2,
  GitBranch,
  MessageSquare,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-auth";
import { useRepos } from "@/hooks/use-repos";

export function OverviewDashboard() {
  const { data: user } = useCurrentUser();
  const reposQuery = useRepos();

  const repos = reposQuery.data ?? [];

  const totalRepos = repos.length;

  const readyRepos = repos.filter(
    (repo) => repo.indexStatus === "READY"
  ).length;

  const indexingRepos = repos.filter(
    (repo) => repo.indexStatus === "INDEXING"
  ).length;

  const failedRepos = repos.filter(
    (repo) => repo.indexStatus === "FAILED"
  ).length;

  const pendingRepos = repos.filter(
    (repo) => repo.indexStatus === "PENDING"
  ).length;

  const displayName =
    user?.displayName ||
    user?.gitUsername ||
    "there";

  const recentRepos = repos.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Welcome to RepoLens
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Welcome back, {displayName} 👋
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Explore your repositories, index your codebase,
              and chat with your code using RepoLens.
            </p>
          </div>

          <Link
            href="/repositories"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <FolderGit2 className="size-4" />
            View repositories
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Repositories
            </p>

            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <FolderGit2 className="size-4" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {totalRepos}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Connected to RepoLens
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Indexed
            </p>

            <div className="flex size-9 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {readyRepos}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Ready for code chat
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Indexing
            </p>

            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Zap className="size-4" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {indexingRepos}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Currently being processed
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Attention
            </p>

            <div className="flex size-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              <TriangleAlert className="size-4" />
            </div>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {failedRepos + pendingRepos}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            New or failed repositories
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Jump into the things you are most likely to do.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/repositories"
            className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderGit2 className="size-5" />
              </div>

              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              Manage repositories
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              View, sync, and index your GitHub repositories.
            </p>
          </Link>

          <Link
            href="/chat"
            className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <MessageSquare className="size-5" />
              </div>

              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              Chat with your code
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Ask questions about your indexed codebase.
            </p>
          </Link>

          <Link
            href="/repositories"
            className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                <Sparkles className="size-5" />
              </div>

              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              Start indexing
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Index a repository to unlock AI-powered code chat.
            </p>
          </Link>
        </div>
      </section>

      {/* Getting started */}
      {totalRepos > 0 && readyRepos === 0 && (
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Get started with RepoLens
                </h2>

                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  You have connected repositories, but none are
                  indexed yet. Index a repository to make its
                  code searchable and available for AI-powered
                  conversations.
                </p>
              </div>
            </div>

            <Link
              href="/repositories"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Index a repository
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Recent repositories */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Recent repositories
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your recently connected repositories.
            </p>
          </div>

          {totalRepos > 0 && (
            <Link
              href="/repositories"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {reposQuery.isLoading ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Loading repositories...
            </p>
          </div>
        ) : recentRepos.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <FolderGit2 className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">
              No repositories connected
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Sync your GitHub repositories to get started.
            </p>

            <Link
              href="/repositories"
              className="mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Go to repositories
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repositories/${repo.id}`}
                className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:bg-muted/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted font-semibold">
                    {repo.name.charAt(0).toUpperCase()}
                  </div>

                  <span
                    className={
                      repo.indexStatus === "READY"
                        ? "rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400"
                        : repo.indexStatus === "INDEXING"
                          ? "rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                          : repo.indexStatus === "FAILED"
                            ? "rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400"
                            : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {repo.indexStatus}
                  </span>
                </div>

                <h3 className="mt-4 truncate font-semibold group-hover:text-primary">
                  {repo.name}
                </h3>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {repo.fullName}
                </p>

                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <GitBranch className="size-3.5" />
                    {repo.defaultBranch}
                  </span>

                  {repo.language && (
                    <span>{repo.language}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}