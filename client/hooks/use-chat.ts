"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  api,
  type ChatMessage,
  type ChatSession,
} from "@/lib/api";

import {
  queryKeys,
} from "@/lib/query-keys";

import {
  streamChatMessage,
} from "@/lib/stream-chat";

import {
  toast,
} from "@/components/ui/toast";

/* ===============================================================
   LIST CHAT SESSIONS
   =============================================================== */

export function useChatSessions(
  repositoryId: string,
  enabled = true
) {
  return useQuery<ChatSession[]>({
    queryKey:
      queryKeys.chat.sessions(
        repositoryId
      ),

    queryFn: () =>
      api.listSessions(
        repositoryId
      ),

    enabled:
      Boolean(repositoryId) &&
      enabled,
  });
}

/* ===============================================================
   GET CHAT MESSAGES
   =============================================================== */

export function useChatMessages(
  sessionId: string | null
) {
  return useQuery<ChatMessage[]>({
    queryKey:
      queryKeys.chat.messages(
        sessionId ?? ""
      ),

    queryFn: () =>
      api.getMessages(
        sessionId!
      ),

    enabled:
      Boolean(sessionId),
  });
}

/* ===============================================================
   CREATE CHAT SESSION
   =============================================================== */

export function useCreateChatSession(
  repositoryId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      title?: string
    ) =>
      api.createSession(
        repositoryId,
        title
      ),

    onSuccess: (session) => {
      void queryClient.invalidateQueries({
        queryKey:
          queryKeys.chat.sessions(
            repositoryId
          ),
      });

      queryClient.setQueryData<
        ChatMessage[]
      >(
        queryKeys.chat.messages(
          session.id
        ),
        []
      );
    },

    onError: (error: Error) => {
      toast.add({
        title:
          "Could not create chat",

        description:
          error.message,

        type: "error",
      });
    },
  });
}

/* ===============================================================
   RENAME CHAT SESSION
   =============================================================== */

export function useRenameChatSession(
  repositoryId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      title,
    }: {
      sessionId: string;
      title: string;
    }) =>
      api.renameSession(
        sessionId,
        title
      ),

    onSuccess: (session) => {
      queryClient.setQueryData<
        ChatSession[]
      >(
        queryKeys.chat.sessions(
          repositoryId
        ),
        (sessions = []) =>
          sessions.map(
            (item: ChatSession) =>
              item.id === session.id
                ? {
                    ...item,
                    title:
                      session.title,
                  }
                : item
          )
      );
    },

    onError: (error: Error) => {
      toast.add({
        title:
          "Could not rename chat",

        description:
          error.message,

        type: "error",
      });
    },
  });
}

/* ===============================================================
   DELETE CHAT SESSION
   =============================================================== */

export function useDeleteChatSession(
  repositoryId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      sessionId: string
    ) =>
      api.deleteSession(
        sessionId
      ),

    onSuccess: (_, sessionId) => {
      queryClient.setQueryData<
        ChatSession[]
      >(
        queryKeys.chat.sessions(
          repositoryId
        ),
        (sessions = []) =>
          sessions.filter(
            (session: ChatSession) =>
              session.id !==
              sessionId
          )
      );

      queryClient.removeQueries({
        queryKey:
          queryKeys.chat.messages(
            sessionId
          ),
      });
    },

    onError: (error: Error) => {
      toast.add({
        title:
          "Could not delete chat",

        description:
          error.message,

        type: "error",
      });
    },
  });
}

/* ===============================================================
   STREAM CHAT
   =============================================================== */

export function useStreamChat(
  sessionId: string | null
) {
  const queryClient =
    useQueryClient();

  const [streaming, setStreaming] =
    useState(false);

  const [streamText, setStreamText] =
    useState("");

  const abortRef =
    useRef<AbortController | null>(
      null
    );

  const send = useCallback(
    async (
      content: string
    ) => {
      if (
        !sessionId ||
        !content.trim() ||
        streaming
      ) {
        return;
      }

      abortRef.current?.abort();

      const controller =
        new AbortController();

      abortRef.current =
        controller;

      const optimisticId =
        `temp-${Date.now()}`;

      const optimistic: ChatMessage =
        {
          id: optimisticId,
          role: "USER",
          content:
            content.trim(),
          citations: [],
          createdAt:
            new Date().toISOString(),
        };

      queryClient.setQueryData<
        ChatMessage[]
      >(
        queryKeys.chat.messages(
          sessionId
        ),
        (prev = []) => [
          ...prev,
          optimistic,
        ]
      );

      setStreaming(true);
      setStreamText("");

      try {
        await streamChatMessage(
          sessionId,
          content.trim(),
          {
            signal:
              controller.signal,

            onUserMessage:
              (message) => {
                queryClient.setQueryData<
                  ChatMessage[]
                >(
                  queryKeys.chat.messages(
                    sessionId
                  ),
                  (prev = []) => [
                    ...prev.filter(
                      (m) =>
                        m.id !==
                        optimisticId
                    ),
                    message,
                  ]
                );
              },

            onToken: (token) => {
              setStreamText(
                (prev) =>
                  prev + token
              );
            },

            onAssistantMessage:
              (message) => {
                queryClient.setQueryData<
                  ChatMessage[]
                >(
                  queryKeys.chat.messages(
                    sessionId
                  ),
                  (prev = []) => [
                    ...prev,
                    message,
                  ]
                );

                setStreamText("");
              },

            onDone: () => {
              /*
               * ChatView can invalidate the
               * session list after the message
               * finishes so an automatically
               * generated title appears.
               */
            },
          }
        );
      } catch (err) {
        if (
          err instanceof Error &&
          err.name ===
            "AbortError"
        ) {
          return;
        }

        toast.add({
          title:
            "Message failed",

          description:
            err instanceof Error
              ? err.message
              : "Unknown error",

          type: "error",
        });

        queryClient.setQueryData<
          ChatMessage[]
        >(
          queryKeys.chat.messages(
            sessionId
          ),
          (prev = []) =>
            prev.filter(
              (m) =>
                m.id !==
                optimisticId
            )
        );

        setStreamText("");
      } finally {
        setStreaming(false);
      }
    },
    [
      sessionId,
      streaming,
      queryClient,
    ]
  );

  const stop = useCallback(
    () => {
      abortRef.current?.abort();
      setStreaming(false);
    },
    []
  );

  return {
    send,
    stop,
    streaming,
    streamText,
  };
}