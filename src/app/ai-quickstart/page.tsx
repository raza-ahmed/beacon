"use client";

import { useMemo } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

const tocItems: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "step-1", label: "Step 1 — Scaffold" },
];

const step1Prompt = `Create a new Next.js project from scratch in the current empty folder with the following exact setup:

## Package.json
Use these exact versions for all dependencies:

Dependencies:
- next: ^16.2.2
- react: ^19.2.4
- react-dom: ^19.2.4
- framer-motion: ^12.38.0
- beacon-ui: latest
- beacon-icons: latest

Dev dependencies:
- typescript: ^6.0.2
- @types/node: ^25.5.2
- @types/react: ^19.2.14
- @types/react-dom: ^19.2.3

Scripts:
- dev: next dev
- build: next build
- export: next build
- start: next start
- lint: next lint

## Project Structure
Create the following folder structure:
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    ui/        (empty folder with .gitkeep)
  lib/
    utils.ts   (empty for now)

public/        (empty)

## Files to create

1. tsconfig.json — standard Next.js TypeScript config with path alias @ pointing to src/

2. next.config.ts — minimal config, no extra options needed

3. src/app/layout.tsx — root layout with html and body tags, import globals.css, no extra providers yet

4. src/app/page.tsx — minimal homepage, just a div with "Hello World" to confirm it works

5. src/app/globals.css — just CSS reset and body margin: 0

6. .gitignore — standard Next.js gitignore including:
   - node_modules
   - .next
   - out
   - .env
   - .env.local
   - .env*.local
   - npm-debug.log*
   - .DS_Store
   - *.pem
   - .vercel

## Instructions
- Do NOT run npm install
- Do NOT add Tailwind, ESLint config, or any other libraries
- Do NOT add any extra boilerplate or comments
- Keep every file as minimal as possible
- Just scaffold the files and folders, I will install and extend manually`;

export default function AiQuickstartPage() {
  const { theme } = useTheme();
  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  return (
    <PageLayout tocItems={tocItems} currentPath="/ai-quickstart">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">AI Quickstart</h3>
          <p className="ds-content__subtitle">
            Step-by-step prompts to scaffold a production-ready project from scratch using Beacon components and icons.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Each step below is a ready-to-use prompt. Copy it, open your AI assistant of choice, and paste it in. Work through the steps in order — each one builds on the previous.
          </p>
          <ul className="ds-content__bullet-list">
            <li>Prompts are designed to work with any LLM — Claude, ChatGPT, Gemini, Cursor, or similar tools</li>
            <li>Run each prompt inside your project folder unless the step says otherwise</li>
            <li>
              Package versions in the prompts reflect a tested baseline — always verify against the official{" "}
              <a href="https://nextjs.org/docs" className="ds-content__link" target="_blank" rel="noopener noreferrer">Next.js</a>,{" "}
              <a href="https://react.dev" className="ds-content__link" target="_blank" rel="noopener noreferrer">React</a>, and{" "}
              <a href="https://www.framer.com/motion/introduction/" className="ds-content__link" target="_blank" rel="noopener noreferrer">Framer Motion</a>{" "}
              documentation before using in production
            </li>
            <li>Do not skip steps — each one sets up a foundation the next step depends on</li>
          </ul>
        </section>

        <section id="step-1" className="ds-content__section">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-300)", marginBottom: "var(--spacing-400)" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "var(--spacing-600)",
              height: "var(--spacing-600)",
              borderRadius: "50%",
              backgroundColor: "var(--bg-brand-primary)",
              color: "var(--fg-on-brand)",
              fontFamily: "var(--font-primary)",
              fontSize: "var(--fonts-body-small-text-size)",
              fontWeight: 600,
              flexShrink: 0,
            }}>1</span>
            <h6 className="ds-content__section-title" style={{ margin: 0 }}>Scaffold the Project</h6>
          </div>

          <p className="ds-content__text">
            Start from a completely empty folder. This prompt creates the full Next.js project structure with all config files — nothing more, nothing less.
          </p>

          <div style={{
            backgroundColor: "var(--bg-page-secondary)",
            border: "var(--border-width-25) solid var(--border-strong-100)",
            borderRadius: "var(--corner-radius-200)",
            padding: "var(--spacing-400)",
            marginTop: "var(--spacing-400)",
            marginBottom: "var(--spacing-500)",
          }}>
            <p style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--fonts-body-small-text-size)",
              lineHeight: "var(--fonts-body-small-line-height)",
              color: "var(--fg-neutral-secondary)",
              margin: 0,
              marginBottom: "var(--spacing-200)",
              fontWeight: 600,
            }}>Before you run this prompt</p>
            <ul style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--fonts-body-small-text-size)",
              lineHeight: "var(--fonts-body-small-line-height)",
              color: "var(--fg-neutral-secondary)",
              margin: 0,
              paddingLeft: "var(--spacing-500)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-100)",
            }}>
              <li>Create a new, completely empty folder first and open it in your code editor or terminal before running this prompt</li>
              <li>
                The package versions listed are a tested baseline — they may be outdated. Cross-check with the{" "}
                <a href="https://nextjs.org/docs" className="ds-content__link" target="_blank" rel="noopener noreferrer">Next.js</a>,{" "}
                <a href="https://react.dev" className="ds-content__link" target="_blank" rel="noopener noreferrer">React</a>, and{" "}
                <a href="https://www.framer.com/motion/introduction/" className="ds-content__link" target="_blank" rel="noopener noreferrer">Framer Motion</a>{" "}
                docs for the latest stable versions before proceeding
              </li>
              <li><code>beacon-ui</code> and <code>beacon-icons</code> are set to <code>latest</code> — always use the latest version of Beacon</li>
              <li>This step only scaffolds files. Do not run <code>npm install</code> yet — that is covered in the next step</li>
            </ul>
          </div>

          <div className="ds-content__code-container">
            <div className="ds-content__code-copy-button">
              <CodeCopyButton code={step1Prompt} style={{ position: "relative", top: 0, right: 0 }} />
            </div>
            <SyntaxHighlighter
              language="markdown"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                padding: "var(--spacing-400)",
                backgroundColor: "var(--bg-page-secondary)",
                fontSize: "var(--fonts-body-small-text-size)",
                borderRadius: "var(--corner-radius-200)",
                border: "var(--border-width-25) solid var(--border-strong-200)",
                overflow: "auto",
              }}
              codeTagProps={{
                style: {
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                },
              }}
              PreTag="div"
            >
              {step1Prompt}
            </SyntaxHighlighter>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
