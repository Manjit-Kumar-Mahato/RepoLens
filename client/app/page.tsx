"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Braces,
  FolderGit2,
  GitBranch,
  MessageSquareCode,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getGithubLoginUrl } from "@/lib/api";

const features = [
  {
    icon: FolderGit2,
    title: "Explore repositories",
    description:
      "Connect your GitHub account and get a clear view of the repositories you work with.",
  },
  {
    icon: MessageSquareCode,
    title: "Chat with your code",
    description:
      "Ask questions about your codebase and get answers grounded in your actual repository.",
  },
  {
    icon: Sparkles,
    title: "AI-powered understanding",
    description:
      "Use retrieval-augmented generation to find the right parts of your code before answering.",
  },
];

const steps = [
  {
    number: "01",
    icon: GitHubIcon,
    title: "Connect GitHub",
    description:
      "Sign in securely and give RepoLens access to your repositories.",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "Index your code",
    description:
      "Your repository is processed and organized so relevant code can be found quickly.",
  },
  {
    number: "03",
    icon: Bot,
    title: "Ask questions",
    description:
      "Talk to your codebase naturally and get contextual answers with citations.",
  },
];

export default function Home() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_l_c_h/0.14),transparent_65%)]" />

        <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </a>

            <a
              href="#about"
              className="transition-colors hover:text-foreground"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />

            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })
              )}
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="size-3.5" />
                AI-powered repository intelligence
              </div>

              <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Understand your codebase
                <span className="block text-primary">
                  without digging through it.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                RepoLens connects to GitHub, understands your repositories,
                and lets you ask questions about your code using
                retrieval-augmented AI.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={getGithubLoginUrl()}
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),
                    "group gap-2"
                  )}
                >
                  <GitHubIcon className="size-5" />
                  Continue with GitHub
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>

                <a
                  href="#how-it-works"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })
                  )}
                >
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  GitHub OAuth
                </span>

                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  RAG-powered
                </span>

                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Repository-aware
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle,oklch(from_var(--primary)_l_c_h/0.14),transparent_65%)]" />

              <div className="overflow-hidden rounded-2xl border bg-card/80 shadow-2xl shadow-foreground/5 backdrop-blur">
                <div className="flex h-11 items-center gap-2 border-b px-4">
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />

                  <div className="ml-3 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                    <FolderGit2 className="size-3.5" />
                    repolens
                  </div>
                </div>

                <div className="grid min-h-[390px] md:grid-cols-[150px_1fr]">
                  <div className="hidden border-r bg-muted/20 p-4 md:block">
                    <div className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Repository
                    </div>

                    <div className="space-y-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 text-foreground">
                        <FolderGit2 className="size-3.5" />
                        src
                      </div>

                      <div className="flex items-center gap-2 pl-4">
                        <Braces className="size-3.5" />
                        auth
                      </div>

                      <div className="flex items-center gap-2 pl-4">
                        <Braces className="size-3.5" />
                        api
                      </div>

                      <div className="flex items-center gap-2 pl-4">
                        <Braces className="size-3.5" />
                        chat
                      </div>

                      <div className="flex items-center gap-2">
                        <FolderGit2 className="size-3.5" />
                        components
                      </div>

                      <div className="flex items-center gap-2">
                        <FolderGit2 className="size-3.5" />
                        lib
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="border-b px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Terminal className="size-4 text-primary" />
                        Ask RepoLens
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Ask anything about this repository
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div className="space-y-5">
                        <div className="ml-auto max-w-[85%] rounded-xl bg-primary/10 px-4 py-3 text-sm">
                          How does authentication work in this project?
                        </div>

                        <div className="max-w-[92%] rounded-xl border bg-muted/30 px-4 py-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-medium">
                            <Bot className="size-4 text-primary" />
                            RepoLens
                          </div>

                          <p className="text-sm leading-6 text-muted-foreground">
                            Authentication is handled through GitHub OAuth.
                            After the callback, the application stores the
                            authenticated user and uses the session to protect
                            repository-related routes.
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-md border bg-background px-2 py-1 text-[10px] text-muted-foreground">
                              auth.ts
                            </span>

                            <span className="rounded-md border bg-background px-2 py-1 text-[10px] text-muted-foreground">
                              oauth.ts
                            </span>

                            <span className="rounded-md border bg-background px-2 py-1 text-[10px] text-muted-foreground">
                              user-service.ts
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
                        <Search className="size-4 text-muted-foreground" />

                        <span className="flex-1 text-xs text-muted-foreground">
                          Ask about your code...
                        </span>

                        <div className="rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
                          Ask
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="border-y bg-muted/20">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">
              Built for developers
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Your repository, easier to understand.
            </h2>

            <p className="mt-4 text-muted-foreground">
              RepoLens brings your code, search, and AI assistance together
              in one developer-focused workspace.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            Simple workflow
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            From repository to answers.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Connect your code once, then let RepoLens help you navigate it.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-card shadow-sm">
                  <Icon className="size-6 text-primary" />
                </div>

                <div className="mt-4 text-xs font-semibold tracking-widest text-primary">
                  {step.number}
                </div>

                <h3 className="mt-2 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="about" className="px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-card">
          <div className="relative px-6 py-16 text-center sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(from_var(--primary)_l_c_h/0.12),transparent_65%)]" />

            <div className="relative">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Braces className="size-6" />
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Stop searching.
                <br />
                Start understanding.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                RepoLens is designed to make large codebases easier to
                explore, understand, and discuss.
              </p>

              <a
                href={getGithubLoginUrl()}
                className={cn(
                  buttonVariants({
                    size: "lg",
                  }),
                  "group mt-8 gap-2"
                )}
              >
                <GitHubIcon className="size-5" />
                Connect with GitHub
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <BrandMark />

          <p>Built to make your codebase easier to understand.</p>
        </div>
      </footer>
    </main>
  );
}