"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  Bot,
  User,
} from "lucide-react";

import type {
  ChatMessage,
  Repository,
} from "@/lib/api";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMarkdown } from "./chat-markdown";
import { CitationChip } from "./citation-chip";

type ChatMessagesProps = {
  repo: Repository;
  messages: ChatMessage[];
  streamText: string;
  isLoading?: boolean;
};

export function ChatMessages({
  repo,
  messages,
  streamText,
  isLoading = false,
}: ChatMessagesProps) {
  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, streamText]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
        {messages.length === 0 &&
        !streamText ? (
          <EmptyChat repo={repo} />
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              repo={repo}
            />
          ))
        )}

        {streamText && (
          <StreamingMessage
            content={streamText}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

function EmptyChat({
  repo,
}: {
  repo: Repository;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border bg-muted/50">
        <Bot className="size-6 text-muted-foreground" />
      </div>

      <h2 className="font-heading text-lg font-semibold">
        Ask about {repo.name}
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ask questions about the code,
        architecture, files, functions,
        dependencies, or anything else
        inside this repository.
      </p>
    </div>
  );
}

function MessageItem({
  message,
  repo,
}: {
  message: ChatMessage;
  repo: Repository;
}) {
  const isUser =
    message.role === "USER";

  return (
    <article
      className={
        isUser
          ? "flex justify-end"
          : "flex justify-start"
      }
    >
      <div
        className={
          isUser
            ? "flex max-w-[85%] flex-row-reverse items-start gap-3 md:max-w-[75%]"
            : "flex max-w-[90%] items-start gap-3 md:max-w-[80%]"
        }
      >
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
          {isUser ? (
            <User className="size-4" />
          ) : (
            <Bot className="size-4" />
          )}
        </div>

        <div
          className={
            isUser
              ? "min-w-0 rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-primary-foreground"
              : "min-w-0 px-1 py-1"
          }
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {message.content}
            </p>
          ) : (
            <ChatMarkdown
              content={message.content}
            />
          )}

          {!isUser &&
            message.citations.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {message.citations.map(
                  (citation, index) => (
                    <CitationChip
                      key={`${citation.filePath}-${citation.startLine}-${citation.endLine}-${index}`}
                      citation={citation}
                      repo={repo}
                    />
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </article>
  );
}

function StreamingMessage({
  content,
}: {
  content: string;
}) {
  return (
    <article className="flex justify-start">
      <div className="flex max-w-[90%] items-start gap-3 md:max-w-[80%]">
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
          <Bot className="size-4" />
        </div>

        <div className="min-w-0 px-1 py-1">
          <ChatMarkdown
            content={content}
          />

          <span className="mt-2 inline-block h-4 w-1 animate-pulse rounded-full bg-current align-middle opacity-60" />
        </div>
      </div>
    </article>
  );
}