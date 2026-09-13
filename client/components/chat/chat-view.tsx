"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft } from "lucide-react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { IndexingState } from "@/components/chat/indexing-state";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useChatMessages,
  useChatSessions,
  useCreateChatSession,
  useRenameChatSession,
  useStreamChat,
} from "@/hooks/use-chat";

import {
  useIndexStatus,
  useRepository,
} from "@/hooks/use-repos";

/* ===============================================================
   CREATE CHAT TITLE FROM FIRST QUESTION
   =============================================================== */

function createChatTitle(
  question: string
) {
  const words = question
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) =>
      word.replace(
        /^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g,
        ""
      )
    )
    .filter(Boolean);

  if (words.length === 0) {
    return "New Chat";
  }

  return words
    .slice(0, 2)
    .join(" ");
}

export function ChatView({
  repoId,
}: {
  repoId: string;
}) {
  /* =============================================================
     REPOSITORY
     ============================================================= */

  const repoQuery =
    useRepository(repoId);

  const isIndexing =
    repoQuery.data?.indexStatus ===
    "INDEXING";

  const statusQuery =
    useIndexStatus(
      repoId,
      isIndexing ||
        repoQuery.data?.indexStatus ===
          "PENDING"
    );

  const indexStatus =
    statusQuery.data?.indexStatus ??
    repoQuery.data?.indexStatus;

  const ready =
    indexStatus === "READY";

  /* =============================================================
     CHAT SESSIONS
     ============================================================= */

  const sessionsQuery =
    useChatSessions(
      repoId,
      ready
    );

  const createSession =
    useCreateChatSession(
      repoId
    );

  const renameSession =
    useRenameChatSession(
      repoId
    );

  const [
    selectedSessionId,
    setSelectedSessionId,
  ] = useState<string | null>(
    null
  );

  const autoCreateRef =
    useRef(false);

  /*
   * Prevent the automatic title-generation
   * effect from firing more than once for
   * the same session.
   */
  const renamedSessionsRef =
    useRef(
      new Set<string>()
    );

  const sessionId =
    selectedSessionId ??
    sessionsQuery.data?.[0]?.id ??
    null;

  const selectedSession =
    sessionsQuery.data?.find(
      (session) =>
        session.id === sessionId
    );

  /* =============================================================
     CHAT MESSAGES
     ============================================================= */

  const messagesQuery =
    useChatMessages(
      sessionId
    );

  const {
    send,
    stop,
    streaming,
    streamText,
  } = useStreamChat(
    sessionId
  );

  /* =============================================================
     AUTOMATICALLY CREATE FIRST CHAT
     ============================================================= */

  useEffect(() => {
    if (
      !ready ||
      sessionsQuery.isLoading
    ) {
      return;
    }

    if (
      sessionsQuery.data &&
      sessionsQuery.data.length > 0
    ) {
      return;
    }

    if (
      !sessionsQuery.isSuccess ||
      (sessionsQuery.data?.length ??
        0) > 0 ||
      autoCreateRef.current
    ) {
      return;
    }

    autoCreateRef.current =
      true;

    createSession.mutate(
      undefined,
      {
        onSuccess: (
          session
        ) => {
          setSelectedSessionId(
            session.id
          );
        },

        onError: () => {
          autoCreateRef.current =
            false;
        },
      }
    );
  }, [
    ready,
    sessionsQuery.isLoading,
    sessionsQuery.isSuccess,
    sessionsQuery.data,
    createSession,
  ]);

  /* =============================================================
     AUTOMATIC CHAT TITLE
     ============================================================= */

  useEffect(() => {
    if (
      !sessionId ||
      !selectedSession ||
      !messagesQuery.data ||
      messagesQuery.data.length === 0
    ) {
      return;
    }

    /*
     * Only automatically rename chats
     * which still have the default title.
     */
    if (
      selectedSession.title
        .trim()
        .toLowerCase() !==
      "new chat"
    ) {
      return;
    }

    /*
     * Don't rename the same session twice.
     */
    if (
      renamedSessionsRef.current.has(
        sessionId
      )
    ) {
      return;
    }

    /*
     * Find the first USER message.
     */
    const firstUserMessage =
      messagesQuery.data.find(
        (message) =>
          message.role ===
          "USER"
      );

    if (!firstUserMessage) {
      return;
    }

    const title =
      createChatTitle(
        firstUserMessage.content
      );

    if (
      !title ||
      title === "New Chat"
    ) {
      return;
    }

    renamedSessionsRef.current.add(
      sessionId
    );

    renameSession.mutate({
      sessionId,
      title,
    });
  }, [
    sessionId,
    selectedSession,
    messagesQuery.data,
    renameSession,
  ]);

  /* =============================================================
     LOADING
     ============================================================= */

  if (repoQuery.isLoading) {
    return (
      <AppShell
        title="Loading chat..."
      >
        <div className="grid flex-1 gap-4 p-4 md:grid-cols-[18rem_1fr]">
          <Skeleton className="min-h-80 rounded-2xl" />

          <Skeleton className="min-h-80 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  /* =============================================================
     REPOSITORY ERROR
     ============================================================= */

  if (
    repoQuery.isError ||
    !repoQuery.data
  ) {
    return (
      <AppShell
        title="Repository unavailable"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
          <p className="text-sm text-muted-foreground">
            {(repoQuery.error as Error)
              ?.message ??
              "Repository not found"}
          </p>

          <Button
            nativeButton={false}
            render={
              <Link href="/dashboard" />
            }
          >
            Back to dashboard
          </Button>
        </div>
      </AppShell>
    );
  }

  const repo =
    repoQuery.data;

  /* =============================================================
     MAIN CHAT PAGE
     ============================================================= */

  return (
    <AppShell
      title={repo.fullName}
      description={
        ready
          ? "Ask questions grounded in this repository"
          : "Waiting for indexing to finish"
      }
      actions={
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/dashboard" />
          }
        >
          <ArrowLeft data-icon="inline-start" />
          Repos
        </Button>
      }
    >
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {/* =====================================================
            CHAT SIDEBAR
            ===================================================== */}

        <ChatSidebar
          repo={{
            ...repo,

            indexStatus:
              indexStatus ??
              repo.indexStatus,

            filesProcessed:
              statusQuery.data
                ?.filesProcessed ??
              repo.filesProcessed,

            filesTotal:
              statusQuery.data
                ?.filesTotal ??
              repo.filesTotal,

            chunkCount:
              statusQuery.data
                ?.chunkCount ??
              repo.chunkCount,

            errorMessage:
              statusQuery.data
                ?.errorMessage ??
              repo.errorMessage,
          }}
          sessionId={
            sessionId
          }
          onSelectSession={
            setSelectedSessionId
          }
        />

        {/* =====================================================
            MAIN CHAT AREA
            ===================================================== */}

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!ready ? (
            <IndexingState
              repo={repo}
              status={
                statusQuery.data
              }
            />
          ) : (
            <>
              <ChatMessages
                repo={repo}
                messages={
                  messagesQuery.data ??
                  []
                }
                streamText={
                  streamText
                }
                isLoading={
                  messagesQuery.isLoading
                }
              />

              <ChatComposer
                disabled={
                  !sessionId
                }
                streaming={
                  streaming
                }
                onSend={send}
                onStop={stop}
              />
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}