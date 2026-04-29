"use client";

import { CodeCopyButton } from "@/components/CodeCopyButton";
import { CodeDownloadButton } from "@/components/CodeDownloadButton";
import { CollapsibleCode } from "@/components/CollapsibleCode";
import { PageLayout, type TocItem } from "@/components";
import { Avatar } from "beacon-ui";

const tocItems: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "step-1", label: "Step 1: Scaffold" },
  { id: "step-2", label: "Step 2: Install & Verify" },
  { id: "step-3", label: "Step 3: Design Consistency" },
];

const step2Prompt = `The project has already been scaffolded with all files and package.json.
Now do the following steps in order:

## Step 1 — Install dependencies
Run:
npm install

## Step 2 — Fix any peer dependency or version conflicts
After install, check the terminal output for any warnings or errors.
If there are peer dependency conflicts, resolve them automatically.
Do NOT downgrade next, react, or react-dom.

## Step 3 — Verify the dev server runs
Run:
npm run dev

Confirm the dev server starts successfully on localhost:3000 with no errors.
If there are TypeScript or config errors, fix them before moving on.

## Step 4 — Verify the build works
Stop the dev server, then run:
npm run build

Confirm the build completes with no errors.
If there are any errors, fix them and re-run until the build is clean.

## Step 5 — Report back
Once everything is working, give me a summary of:
- All installed package versions (from node_modules, not package.json)
- Any conflicts you resolved and how
- Confirmation that dev server and build both pass
- Any warnings I should know about

## Instructions
- Do NOT add or remove any packages I didn't ask for
- Do NOT modify the project structure
- Do NOT add any code beyond what's already scaffolded
- Fix only what's broken, nothing else`;

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

const instructionFileContent = `# Beacon Design System — AI Coding Instructions

## Core Rules
- All style values must use CSS variables: \`var(--bg-primary)\`
- Never use hard-coded values: no hex codes, pixel values, or arbitrary durations
- All components must work in light and dark themes
- Named exports only: \`export function ComponentName()\` — never default exports
- TypeScript interfaces for all props — no \`any\`

## Token Reference
- Spacing: \`var(--spacing-100)\` → \`var(--spacing-900)\`
- Backgrounds: \`var(--bg-primary)\`, \`var(--bg-page-secondary)\`, \`var(--util-overlay-medium)\`
- Foreground: \`var(--fg-neutral)\`, \`var(--fg-neutral-secondary)\`
- Borders: \`var(--border-strong-100)\`, \`var(--border-strong-200)\`
- Typography: \`var(--fonts-body-small-text-size)\`, \`var(--heading-h6-text-size)\`, \`var(--font-secondary)\`
- Corner radius: \`var(--corner-radius-100)\` → \`var(--corner-radius-400)\`
- Border width: \`var(--border-width-25)\`, \`var(--border-width-50)\`

## Beacon Packages
- Components: \`import { Button, Avatar, Card } from "beacon-ui"\`
- Icons: \`import { SearchIcon, CopyIcon } from "beacon-icons"\`
- Never recreate components that already exist in \`beacon-ui\`
- Always use \`latest\` for Beacon packages

## Component Patterns
- Extend HTML props with \`ComponentPropsWithRef<"element">\`
- Call \`useThemeSafe()\` at component start for theme access
- Inline styles using \`React.CSSProperties\` — all values via tokens
- Use \`useMemo\` for computed styles
- Use \`framer-motion\` for animations

## Accessibility
- WCAG 2.1 AA compliance required
- Proper ARIA attributes, keyboard navigation, focus management
- Test in both light and dark themes
- Support all color variants: primary, success, warning, critical

## Project Structure
- Components: \`packages/beacon-ui/src/components/[ComponentName].tsx\`
- Documentation: \`src/app/components/[component-name]/page.tsx\`
- Figma tokens exported to \`Design Tokens Figma/\` — run \`npm run build:tokens\` after updates`;

const vsCodeSettings = `{
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".github/copilot-instructions.md" }
  ],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative"
}`;

export default function AiQuickstartPage() {
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
          <Avatar
          size="sm"
          type="text"
          color="neutral"
          isRound
          hasStroke
          initials="1"
        />
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


          <CollapsibleCode
            code={step1Prompt}
            language="markdown"
            actions={<CodeCopyButton code={step1Prompt} style={{ position: "relative", top: 0, right: 0 }} />}
          />
        </section>

        <section id="step-2" className="ds-content__section">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-300)", marginBottom: "var(--spacing-400)" }}>
          <Avatar
          size="sm"
          type="text"
          color="neutral"
          isRound
          hasStroke
          initials="2"
        />
            <h6 className="ds-content__section-title" style={{ margin: 0 }}>Install & Verify</h6>
          </div>

          <p className="ds-content__text">
            With the project scaffolded, run this prompt to install dependencies, resolve any conflicts, and confirm both the dev server and production build work correctly.
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
              <li>Make sure Step 1 is complete — all project files must be scaffolded before running this</li>
              <li>Run this prompt from inside your project folder with your AI assistant open in that same directory</li>
              <li>The AI will run terminal commands — make sure it has access to your terminal or shell</li>
            </ul>
          </div>

          <CollapsibleCode
            code={step2Prompt}
            language="markdown"
            actions={<CodeCopyButton code={step2Prompt} style={{ position: "relative", top: 0, right: 0 }} />}
          />
        </section>

        <section id="step-3" className="ds-content__section">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-300)", marginBottom: "var(--spacing-400)" }}>
            <Avatar
              size="sm"
              type="text"
              color="neutral"
              isRound
              hasStroke
              initials="3"
            />
            <h6 className="ds-content__section-title" style={{ margin: 0 }}>Design Consistency</h6>
          </div>
          <p className="ds-content__text">
            Keep every AI assistant — Claude Code, Cursor, and GitHub Copilot — following the same Beacon rules automatically. One file, three editors, zero extra setup per developer.
          </p>

          {/* File map */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--spacing-200)",
            marginTop: "var(--spacing-400)",
            marginBottom: "var(--spacing-500)",
          }}>
            {[
              { file: "CLAUDE.md", editor: "Claude Code", desc: "Auto-loaded by Claude Code CLI" },
              { file: ".cursorrules", editor: "Cursor", desc: "Auto-loaded by Cursor editor" },
              { file: ".github/copilot-instructions.md", editor: "GitHub Copilot", desc: "Auto-loaded in VS Code + Copilot" },
              { file: ".vscode/settings.json", editor: "VS Code", desc: "Points all AI extensions to the same rules" },
            ].map(({ file, editor, desc }) => (
              <div key={file} style={{
                backgroundColor: "var(--bg-page-secondary)",
                border: "var(--border-width-25) solid var(--border-strong-100)",
                borderRadius: "var(--corner-radius-200)",
                padding: "var(--spacing-300)",
              }}>
                <code style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "var(--fonts-body-small-text-size)",
                  color: "var(--fg-neutral)",
                  display: "block",
                  marginBottom: "var(--spacing-100)",
                }}>{file}</code>
                <p style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--fonts-body-small-text-size)",
                  color: "var(--fg-neutral-secondary)",
                  margin: 0,
                  lineHeight: "var(--fonts-body-small-line-height)",
                }}>
                  <strong style={{ color: "var(--fg-neutral)" }}>{editor}</strong> — {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Instruction file */}
          <p style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "var(--fonts-body-small-text-size)",
            color: "var(--fg-neutral-secondary)",
            margin: 0,
            marginBottom: "var(--spacing-300)",
            lineHeight: "var(--fonts-body-small-line-height)",
          }}>
            Copy or download the instruction file below, then paste it into each of the four files above. All editors share identical content — <code>docs/ai-coding-instructions.md</code> is your single source of truth.
          </p>

          <CollapsibleCode
            code={instructionFileContent}
            language="markdown"
            actions={
              <>
                <CodeCopyButton code={instructionFileContent} style={{ position: "relative", top: 0, right: 0 }} />
                <CodeDownloadButton code={instructionFileContent} filename="ai-coding-instructions.md" style={{ position: "relative", top: 0, right: 0 }} />
              </>
            }
          />

          {/* VS Code settings */}
          <p style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "var(--fonts-body-small-text-size)",
            color: "var(--fg-neutral-secondary)",
            margin: 0,
            marginTop: "var(--spacing-500)",
            marginBottom: "var(--spacing-300)",
            lineHeight: "var(--fonts-body-small-line-height)",
          }}>
            Add this to <code>.vscode/settings.json</code> to wire Copilot and enforce consistent editor settings across the team:
          </p>

          <CollapsibleCode
            code={vsCodeSettings}
            language="json"
            actions={<CodeCopyButton code={vsCodeSettings} style={{ position: "relative", top: 0, right: 0 }} />}
          />

          {/* README note */}
          <div style={{
            backgroundColor: "var(--bg-page-secondary)",
            border: "var(--border-width-25) solid var(--border-strong-100)",
            borderRadius: "var(--corner-radius-200)",
            padding: "var(--spacing-400)",
            marginTop: "var(--spacing-500)",
          }}>
            <p style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--fonts-body-small-text-size)",
              color: "var(--fg-neutral-secondary)",
              margin: 0,
              marginBottom: "var(--spacing-200)",
              fontWeight: 600,
            }}>Tip — add an onboarding note to README.md</p>
            <p style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--fonts-body-small-text-size)",
              color: "var(--fg-neutral-secondary)",
              margin: 0,
              lineHeight: "var(--fonts-body-small-line-height)",
            }}>
              Any developer cloning the repo will immediately know the setup is handled:
            </p>
            <pre style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "var(--fonts-body-small-text-size)",
              color: "var(--fg-neutral-secondary)",
              margin: "var(--spacing-200) 0 0",
              padding: 0,
              background: "none",
              border: "none",
              whiteSpace: "pre-wrap",
            }}>{`## AI Coding Instructions\nAll AI assistants (Cursor, Claude Code, Copilot) are pre-configured\nto follow the Beacon design system rules automatically.\nSee docs/ai-coding-instructions.md for the full reference.`}</pre>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
