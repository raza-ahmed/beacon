"use client";

import { useState, useMemo } from "react";
import { CopyIcon, CheckIcon } from "./icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { useTheme } from "@/providers/ThemeProvider";

interface AnimationShowcaseProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
  category?: string;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "true");
  el.style.position = "absolute";
  el.style.left = "0";
  el.style.top = "0";
  el.style.transform = "translateX(-100%)";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export function AnimationShowcase({
  title,
  description,
  code,
  children,
  category,
}: AnimationShowcaseProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const handleCopyCode = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ds-animation-showcase">
      <div className="ds-animation-showcase__header">
        <div className="ds-animation-showcase__header-top">
          <h6 className="ds-animation-showcase__title">{title}</h6>
          {category && (
            <span className="ds-animation-showcase__category">{category}</span>
          )}
        </div>
        {description && (
          <p className="ds-animation-showcase__description">{description}</p>
        )}
      </div>
      <div className="ds-animation-showcase__content">
        <div className="ds-animation-showcase__preview">
          <div className="ds-animation-showcase__preview-canvas">{children}</div>
        </div>
        <div className="ds-animation-showcase__code">
          <button
            type="button"
            className="ds-animation-showcase__copy-button"
            onClick={handleCopyCode}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <CheckIcon size="xs" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon size="xs" />
                <span>Copy</span>
              </>
            )}
          </button>
          <SyntaxHighlighter
            language="tsx"
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              padding: "var(--spacing-300)",
              backgroundColor: "var(--bg-page-secondary)",
              fontSize: "var(--fonts-body-small-text-size)",
              borderRadius: 0,
              border: "none",
              flex: 1,
              width: "100%",
              height: "100%",
              overflow: "auto",
            } as React.CSSProperties}
            codeTagProps={{
              style: {
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              },
            }}
            PreTag="div"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

