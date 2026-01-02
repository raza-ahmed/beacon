"use client";

import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { useTheme } from "@/providers/ThemeProvider";
import { CodeCopyButton } from "./CodeCopyButton";

interface AnimationShowcaseProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
  category?: string;
}


export function AnimationShowcase({
  title,
  description,
  code,
  children,
  category,
}: AnimationShowcaseProps) {
  const { theme } = useTheme();
  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

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
          <CodeCopyButton code={code} />
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

