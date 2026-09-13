"use client";

import {
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type { Repository } from "@/lib/api";

import {
  useChatSessions,
  useCreateChatSession,
  useDeleteChatSession,
  useRenameChatSession,
} from "@/hooks/use-chat";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatSidebarProps = {
  repo: Repository;
  sessionId: string | null;
  onSelectSession: (
    sessionId: string | null
  ) => void;
};

export function ChatSidebar({
  repo,
  sessionId,
  onSelectSession,
}: ChatSidebarProps) {
  const ready =
    repo.indexStatus === "READY";

  const sessionsQuery =
    useChatSessions(
      repo.id,
      ready
    );

  const createSession =
    useCreateChatSession(
      repo.id
    );

  const renameSession =
    useRenameChatSession(
      repo.id
    );

  const deleteSession =
    useDeleteChatSession(
      repo.id
    );

  const sessions =
    sessionsQuery.data ?? [];

  /* =============================================================
     CREATE NEW CHAT
     ============================================================= */

  const handleCreateSession =
    () => {
      if (
        !ready ||
        createSession.isPending
      ) {
        return;
      }

      createSession.mutate(
        undefined,
        {
          onSuccess: (session) => {
            onSelectSession(
              session.id
            );
          },
        }
      );
    };

  /* =============================================================
     RENAME CHAT
     ============================================================= */

  const handleRename = (
    chatSessionId: string,
    currentTitle: string
  ) => {
    const value =
      window.prompt(
        "Rename chat",
        currentTitle
      );

    if (value === null) {
      return;
    }

    const title =
      value.trim();

    if (!title) {
      return;
    }

    if (
      title === currentTitle
    ) {
      return;
    }

    renameSession.mutate({
      sessionId:
        chatSessionId,
      title,
    });
  };

  /* =============================================================
     DELETE CHAT
     ============================================================= */

  const handleDelete = (
    deletedSessionId: string,
    title: string
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${title}"?\n\nThis will permanently delete this chat and all of its messages.`
      );

    if (!confirmed) {
      return;
    }

    deleteSession.mutate(
      deletedSessionId,
      {
        onSuccess: () => {
          /*
           * Only change the selected chat
           * if the chat that was deleted was
           * actually the currently selected one.
           */
          if (
            deletedSessionId !==
            sessionId
          ) {
            return;
          }

          /*
           * Find the remaining chats.
           */
          const remaining =
            sessions.filter(
              (session) =>
                session.id !==
                deletedSessionId
            );

          /*
           * Select the first remaining chat.
           * If there are no chats left,
           * select null.
           */
          onSelectSession(
            remaining[0]?.id ??
              null
          );
        },
      }
    );
  };

  /* =============================================================
     UI
     ============================================================= */

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-b bg-muted/20 md:w-72 md:border-b-0 md:border-r">
      {/* =========================================================
          HEADER
         ========================================================= */}

      <div className="shrink-0 p-4">
        <div className="min-w-0">
          <h2 className="font-heading text-sm font-semibold">
            Chats
          </h2>

          <p className="truncate text-xs text-muted-foreground">
            {repo.name}
          </p>
        </div>

        {/* =======================================================
            NEW CHAT BUTTON
           ======================================================= */}

        <Button
          type="button"
          onClick={
            handleCreateSession
          }
          disabled={
            !ready ||
            createSession.isPending
          }
          className="mt-3 w-full bg-orange-600 text-white hover:bg-orange-700"
        >
          {createSession.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus />
          )}

          New Chat
        </Button>
      </div>

      <Separator />

      {/* =========================================================
          CHAT LIST
         ========================================================= */}

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-1 p-2">
          {/* =====================================================
              LOADING
             ===================================================== */}

          {sessionsQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />

              Loading chats...
            </div>
          ) : sessions.length === 0 ? (
            /* ===================================================
               EMPTY
               =================================================== */

            <div className="flex flex-col items-center px-4 py-10 text-center">
              <MessageSquare className="mb-3 size-6 text-muted-foreground" />

              <p className="text-sm font-medium">
                No chats yet
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Start a new chat to ask
                questions about this
                repository.
              </p>
            </div>
          ) : (
            /* ===================================================
               CHAT SESSIONS
               =================================================== */

            sessions.map(
              (session) => {
                const selected =
                  session.id ===
                  sessionId;

                const title =
                  session.title?.trim() ||
                  "New Chat";

                return (
                  <div
                    key={session.id}
                    className={[
                      "group flex w-full items-start rounded-xl transition-colors",
                      selected
                        ? "bg-muted"
                        : "hover:bg-muted/60",
                    ].join(" ")}
                  >
                    {/* =========================================
                        CHAT SELECT BUTTON
                       ========================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        onSelectSession(
                          session.id
                        )
                      }
                      className="flex min-w-0 flex-1 items-start gap-3 px-3 py-2.5 text-left"
                    >
                      <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {title}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatSessionDate(
                            session.updatedAt ??
                              session.createdAt
                          )}
                        </p>
                      </div>
                    </button>

                    {/* =========================================
                        THREE DOT MENU
                       ========================================= */}

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            aria-label={`Options for ${title}`}
                            className="mr-1 mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 focus:opacity-100"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-40"
                      >
                        {/* Rename */}

                        <DropdownMenuItem
                          onClick={() =>
                            handleRename(
                              session.id,
                              title
                            )
                          }
                        >
                          <Pencil />

                          Rename
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Delete */}

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            handleDelete(
                              session.id,
                              title
                            )
                          }
                        >
                          <Trash2 />

                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              }
            )
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

/* ===============================================================
   DATE FORMATTER
   =============================================================== */

function formatSessionDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  ).format(date);
}