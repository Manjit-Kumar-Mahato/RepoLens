"use client";

import { Fragment, useState } from "react";
import {
  Check,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import "./chat-markdown.css";

type ChatMarkdownProps = {
  content: string;
};

function renderInline(text: string) {
  const parts = text.split(
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  );

  return parts.map((part, index) => {
    if (
      part.startsWith("`") &&
      part.endsWith("`")
    ) {
      return (
        <code key={index}>
          {part.slice(1, -1)}
        </code>
      );
    }

    if (
      part.startsWith("**") &&
      part.endsWith("**")
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*")
    ) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      );
    }

    return (
      <Fragment key={index}>
        {part}
      </Fragment>
    );
  });
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard may be unavailable in some environments.
    }
  };

  return (
    <div className="chat-code-block">
      <div className="chat-code-header">
        <span className="chat-code-language">
          {language || "code"}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          className="chat-code-copy"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check />
              Copied
            </>
          ) : (
            <>
              <Copy />
              Copy
            </>
          )}
        </Button>
      </div>

      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ChatMarkdown({
  content,
}: ChatMarkdownProps) {
  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n");

  const elements: React.ReactNode[] = [];

  let codeLines: string[] = [];
  let codeLanguage = "";
  let inCodeBlock = false;

  const flushCodeBlock = () => {
    if (!inCodeBlock) {
      return;
    }

    elements.push(
      <CodeBlock
        key={`code-${elements.length}`}
        code={codeLines.join("\n")}
        language={codeLanguage}
      />
    );

    codeLines = [];
    codeLanguage = "";
    inCodeBlock = false;
  };

  for (
    let index = 0;
    index < lines.length;
    index++
  ) {
    const line = lines[index];

    /*
     * Fenced code block:
     *
     * ```java
     * public class Main {}
     * ```
     */
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        inCodeBlock = true;

        codeLines = [];

        codeLanguage = line
          .trim()
          .slice(3)
          .trim();
      }

      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      elements.push(
        <div
          key={`space-${index}`}
          className="h-2"
        />
      );

      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index}>
          {renderInline(line.slice(4))}
        </h3>
      );

      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index}>
          {renderInline(line.slice(3))}
        </h2>
      );

      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index}>
          {renderInline(line.slice(2))}
        </h1>
      );

      continue;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={index}>
          {renderInline(line.slice(2))}
        </blockquote>
      );

      continue;
    }

    /*
     * Unordered list
     */
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];

      let current = index;

      while (
        current < lines.length &&
        /^[-*]\s+/.test(lines[current])
      ) {
        items.push(
          lines[current].replace(
            /^[-*]\s+/,
            ""
          )
        );

        current++;
      }

      elements.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

      index = current - 1;

      continue;
    }

    /*
     * Ordered list
     */
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];

      let current = index;

      while (
        current < lines.length &&
        /^\d+\.\s+/.test(lines[current])
      ) {
        items.push(
          lines[current].replace(
            /^\d+\.\s+/,
            ""
          )
        );

        current++;
      }

      elements.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );

      index = current - 1;

      continue;
    }

    if (line.trim() === "---") {
      elements.push(
        <hr key={index} />
      );

      continue;
    }

    elements.push(
      <p key={index}>
        {renderInline(line)}
      </p>
    );
  }

  /*
   * This is important for streaming responses.
   * If Gemini has started a code block but hasn't
   * sent the closing ``` yet, still render it.
   */
  if (inCodeBlock) {
    flushCodeBlock();
  }

  return (
    <div className="chat-markdown">
      {elements}
    </div>
  );
}