"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

const tocItems: TocItem[] = [
  { id: "for-designers", label: "For Designers" },
  { id: "for-developers", label: "For Developers" },
  { id: "installation", label: "Installation" },
  { id: "general-guidelines", label: "General Guidelines" },
];


export default function HowToUsePage() {
  const { theme } = useTheme();
  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  return (
    <PageLayout tocItems={tocItems} currentPath="/how-to-use">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">How to Use</h3>
          <p className="ds-content__subtitle">
            Guidelines for designers and developers working with Beacon Design System.
          </p>
        </header>

        <section id="for-designers" className="ds-content__section">
          <h6 className="ds-content__section-title">For Designers</h6>
          <p className="ds-content__text">
            Use the Beacon Figma library as the primary design tool for all components, tokens, and patterns.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Use the Figma library as the single source of truth for{" "}
              <a href="/foundations/colors" className="ds-content__link">colors</a>,{" "}
              <a href="/foundations/typography" className="ds-content__link">typography</a>,{" "}
              <a href="/foundations/spacing" className="ds-content__link">spacing</a>, and components
            </li>
            <li>
              Use predefined components from the Figma library. Browse{" "}
              <a href="/components/button" className="ds-content__link">component documentation</a>{" "}
              to understand variants and usage
            </li>
            <li>
              Use design tokens for spacing, colors, and typography instead of arbitrary values
            </li>
            <li>
              Reference <a href="/foundations/themes" className="ds-content__link">themes</a>{" "}
              documentation for light and dark mode implementations
            </li>
            <li>
              Use CSS-based background patterns from the{" "}
              <a href="/utility/bg-patterns" className="ds-content__link">Background Patterns</a>{" "}
              utility page. Patterns automatically adapt to light and dark themes
            </li>
            <li>
              Extend existing patterns rather than creating one-off solutions. Check existing components first
            </li>
          </ul>
        </section>

        <section id="for-developers" className="ds-content__section">
          <h6 className="ds-content__section-title">For Developers</h6>
          <p className="ds-content__text">
            Reference component documentation and use design tokens for all styling. Each component page includes interactive playgrounds and code examples.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Reference documented <a href="/components/button" className="ds-content__link">components</a>{" "}
              and <a href="/foundations/colors" className="ds-content__link">design tokens</a>. Use interactive playgrounds to customize and copy code
            </li>
            <li>
              Use design tokens as CSS variables (e.g., <code>var(--bg-primary)</code>, <code>var(--spacing-400)</code>) instead of hardcoded values
            </li>
            <li>
              Apply CSS background patterns using pattern classes (e.g., <code>dot-node</code>, <code>grid-nested</code>) from the{" "}
              <a href="/utility/bg-patterns" className="ds-content__link">Background Patterns</a>{" "}
              utility page. Patterns use token variables and adapt to themes automatically
            </li>
            <li>
              Match component behavior and states exactly as defined in documentation
            </li>
            <li>
              Follow <a href="/foundations/accessibility" className="ds-content__link">accessibility</a>{" "}
              guidelines. All components meet WCAG 2.1 AA standards
            </li>
            <li>
              Use TypeScript types from component documentation for type safety
            </li>
            <li>
              Explore the <a href="/motion/guide" className="ds-content__link">Motion animations</a>{" "}
              system for adding animations to components
            </li>
          </ul>
        </section>

        <section id="installation" className="ds-content__section">
          <h6 className="ds-content__section-title">Installation</h6>
          <p className="ds-content__text">
            Install both packages to get started with Beacon Design System components and icons.
          </p>
          
          <div style={{ marginTop: "var(--spacing-400)" }}>
            <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-300)", marginTop: 0, textTransform: "none" }}>
              Install Packages
            </h6>
            
            <div className="ds-content__flex-wrap">
              <div className="ds-content__code-wrapper">
                <div className="ds-content__code-copy-button--centered">
                  <CodeCopyButton code="npm install beacon-ui" style={{ position: "relative", top: 0, right: 0 }} />
                </div>
                <SyntaxHighlighter
                  language="bash"
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    padding: "var(--spacing-400)",
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--fonts-body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    overflow: "auto",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`npm install beacon-ui`}
                </SyntaxHighlighter>
              </div>

              <div className="ds-content__code-wrapper">
                <div className="ds-content__code-copy-button--centered">
                  <CodeCopyButton code="npm install beacon-icons" style={{ position: "relative", top: 0, right: 0 }} />
                </div>
                <SyntaxHighlighter
                  language="bash"
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    padding: "var(--spacing-400)",
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--fonts-body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    overflow: "auto",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`npm install beacon-icons`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "var(--spacing-500)" }}>
            <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
              Setup
            </h6>
            <p className="ds-content__text">
              Import design tokens and wrap your app with ThemeProvider:
            </p>
            <div className="ds-content__code-container">
              <div className="ds-content__code-copy-button">
                <CodeCopyButton
                  code={`// Import tokens CSS
import 'beacon-ui/tokens';

// Wrap your app with ThemeProvider
import { ThemeProvider } from 'beacon-ui';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultHue="hue-sky">
      {/* Your app content */}
    </ThemeProvider>
  );
}`}
                  style={{ position: "relative", top: 0, right: 0 }}
                />
              </div>
              <SyntaxHighlighter
                language="tsx"
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
                {`// Import tokens CSS
import 'beacon-ui/tokens';

// Wrap your app with ThemeProvider
import { ThemeProvider } from 'beacon-ui';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultHue="hue-sky">
      {/* Your app content */}
    </ThemeProvider>
  );
}`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div style={{ marginTop: "var(--spacing-500)" }}>
            <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
              Usage
            </h6>
            <p className="ds-content__text">
              Import and use components and icons:
            </p>
            <div className="ds-content__code-container">
              <div className="ds-content__code-copy-button">
                <CodeCopyButton
                  code={`import { Button, Card, Tabs, Tab, TabItem } from 'beacon-ui';
import { SearchIcon, CheckIcon } from 'beacon-icons';

function MyComponent() {
  return (
    <>
      <Button startIcon={<SearchIcon size="xs" />}>
        Search
      </Button>
      <Card padding={400} showBgPattern patternType="dot-node">
        <p>Card with background pattern</p>
      </Card>
      <Tabs>
        <TabItem label="Tab 1" value="tab1">Content 1</TabItem>
        <TabItem label="Tab 2" value="tab2">Content 2</TabItem>
      </Tabs>
    </>
  );
}`}
                  style={{ position: "relative", top: 0, right: 0 }}
                />
              </div>
              <SyntaxHighlighter
                language="tsx"
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
                {`import { Button, Card, Tabs, Tab, TabItem } from 'beacon-ui';
import { SearchIcon, CheckIcon } from 'beacon-icons';

function MyComponent() {
  return (
    <>
      <Button startIcon={<SearchIcon size="xs" />}>
        Search
      </Button>
      <Card padding={400} showBgPattern patternType="dot-node">
        <p>Card with background pattern</p>
      </Card>
      <Tabs>
        <TabItem label="Tab 1" value="tab1">Content 1</TabItem>
        <TabItem label="Tab 2" value="tab2">Content 2</TabItem>
      </Tabs>
    </>
  );
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>

        <section id="general-guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">General Guidelines</h6>
          <p className="ds-content__text">
            Principles that apply to both designers and developers:
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Use Beacon as the default UI layer. Check existing components before creating new solutions
            </li>
            <li>
              Avoid local component modifications. Propose changes for inclusion in the design system
            </li>
            <li>
              Follow <a href="/foundations/accessibility" className="ds-content__link">accessibility</a> and{" "}
              <a href="/foundations/responsiveness" className="ds-content__link">responsiveness</a>{" "}
              guidelines as non-optional requirements
            </li>
            <li>
              Check documentation before designing or building to prevent duplication
            </li>
            <li>
              Use design tokens consistently. Never hardcode colors, spacing, or typography values
            </li>
            <li>
              Use CSS-based background patterns instead of image assets for better performance and theme compatibility
            </li>
            <li>
              Reference the <a href="/utility/bg-patterns" className="ds-content__link">Background Patterns</a>{" "}
              utility page for available pattern options
            </li>
          </ul>
        </section>
      </article>
    </PageLayout>
  );
}
