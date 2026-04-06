"use client";

import { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "@/providers/ThemeProvider";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { ChevronDownIcon, ChevronUpIcon } from "beacon-icons";

interface CollapsibleCodeProps {
  code: string;
  language?: string;
  /** Height of the collapsed state in px. Default 200. */
  collapsedHeight?: number;
  /** Buttons rendered in the top-right corner (copy, download, etc.) */
  actions?: React.ReactNode;
}

export function CollapsibleCode({
  code,
  language = "markdown",
  collapsedHeight = 200,
  actions,
}: CollapsibleCodeProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        {/* Action buttons (copy / download) */}
        {actions && (
          <div style={{
            display: "flex",
            gap: "var(--spacing-200)",
            position: "absolute",
            top: "var(--spacing-200)",
            right: "var(--spacing-200)",
            zIndex: 10,
          }}>
            {actions}
          </div>
        )}

        {/* Code wrapper with clip */}
        <div style={{
          position: "relative",
          maxHeight: expanded ? "none" : collapsedHeight,
          overflow: "hidden",
          borderRadius: "var(--corner-radius-200)",
          border: "var(--border-width-25) solid var(--border-strong-200)",
        }}>
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              padding: "var(--spacing-400)",
              backgroundColor: "var(--bg-page-secondary)",
              fontSize: "var(--fonts-body-small-text-size)",
              borderRadius: "var(--corner-radius-200)",
              border: "none",
              overflow: "visible",
            }}
            codeTagProps={{
              style: {
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              },
            }}
            PreTag="div"
          >
            {code}
          </SyntaxHighlighter>

          {/* Gradient fade — only when collapsed */}
          {!expanded && (
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 64,
              background: "linear-gradient(to bottom, transparent, var(--bg-page-secondary))",
              pointerEvents: "none",
              borderBottomLeftRadius: "var(--corner-radius-200)",
              borderBottomRightRadius: "var(--corner-radius-200)",
            }} />
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-100)",
          marginTop: "var(--spacing-200)",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-secondary)",
          fontSize: "var(--fonts-body-small-text-size)",
          color: "var(--fg-brand-primary)",
          fontWeight: 500,
        }}
        aria-expanded={expanded}
      >
        {expanded ? (
          <>
            See less <ChevronUpIcon size="xs" />
          </>
        ) : (
          <>
            See more <ChevronDownIcon size="xs" />
          </>
        )}
      </button>
    </div>
  );
}
