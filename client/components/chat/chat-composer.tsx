"use client";

import {
  FormEvent,
  KeyboardEvent,
  useState,
} from "react";
import {
  ArrowUp,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatComposerProps = {
  disabled?: boolean;
  streaming?: boolean;
  onSend: (content: string) => void | Promise<void>;
  onStop?: () => void;
};

export function ChatComposer({
  disabled = false,
  streaming = false,
  onSend,
  onStop,
}: ChatComposerProps) {
  const [content, setContent] = useState("");

  const submit = async () => {
    const value = content.trim();

    console.log("CHAT COMPOSER SUBMIT:", {
      value,
      disabled,
      streaming,
    });

    if (!value || disabled || streaming) {
      console.log("CHAT COMPOSER BLOCKED");
      return;
    }

    setContent("");

    console.log("CALLING onSend:", value);

    await onSend(value);

    console.log("onSend FINISHED");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await submit();
  };

  const handleKeyDown = async (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      await submit();
    }
  };

  return (
    <div className="border-t bg-background/95 p-4 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-4xl"
      >
        <div className="relative rounded-2xl border bg-muted/30 p-2 shadow-sm transition-colors focus-within:border-ring">
          <Textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={disabled || streaming}
            placeholder={
              disabled
                ? "Select a chat session..."
                : "Ask a question about this repository..."
            }
            className="min-h-20 resize-none border-0 bg-transparent pr-14 shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
          />

          <div className="absolute right-2 bottom-2">
            {streaming ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={onStop}
                aria-label="Stop generating"
              >
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon-sm"
                disabled={
                  disabled || !content.trim()
                }
                aria-label="Send message"
              >
                <ArrowUp />
              </Button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
}