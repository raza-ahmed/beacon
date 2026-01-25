"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { TooltipPreview } from "@/components/TooltipPreview";
import { TooltipControls } from "@/components/TooltipControls";
import { Tooltip } from "beacon-ui";
import { Button } from "beacon-ui";
import { CodeCopyButton } from "@/components/CodeCopyButton";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type TooltipPosition = "top" | "bottom" | "left" | "right";
type TooltipTrigger = "hover" | "click" | "focus";

interface TooltipConfig {
  content: string;
  position: TooltipPosition;
  trigger: TooltipTrigger;
  showArrow: boolean;
  showBorder: boolean;
  showShadow: boolean;
}

const POSITION_LABELS: Record<TooltipPosition, string> = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
};

const TRIGGER_LABELS: Record<TooltipTrigger, string> = {
  hover: "hover",
  click: "click",
  focus: "focus",
};

function generateTooltipCode(config: TooltipConfig): string {
  const props: string[] = [];

  if (config.content !== "Tooltip") {
    props.push(`content="${config.content}"`);
  }

  if (config.position !== "top") {
    props.push(`position="${POSITION_LABELS[config.position]}"`);
  }

  if (config.trigger !== "hover") {
    props.push(`trigger="${TRIGGER_LABELS[config.trigger]}"`);
  }

  if (!config.showArrow) {
    props.push(`showArrow={false}`);
  }

  if (!config.showBorder) {
    props.push(`showBorder={false}`);
  }

  if (!config.showShadow) {
    props.push(`showShadow={false}`);
  }

  if (props.length === 0) {
    return `<Tooltip content="Tooltip">
  <Button>Hover me</Button>
</Tooltip>`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Tooltip${propsFormatted}
>
  <Button>Hover me</Button>
</Tooltip>`;
}

export default function TooltipPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<TooltipConfig>({
    content: "Tooltip",
    position: "top",
    trigger: "hover",
    showArrow: true,
    showBorder: true,
    showShadow: true,
  });

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "playground", label: "Interactive Playground" },
      { id: "anatomy", label: "Anatomy" },
      { id: "variants", label: "Variants & States" },
      { id: "guidelines", label: "Usage Guidelines" },
      { id: "api", label: "API Reference" },
      { id: "examples", label: "Usage Examples" },
    ];
  }, []);

  const updateConfig = (updates: Partial<TooltipConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/tooltip">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Tooltip</h3>
          <p className="ds-content__subtitle">
            Tooltips provide contextual information when users hover over, focus on, or click an element.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Tooltips are small, informative overlays that appear when users interact with an element. They provide
            additional context, descriptions, or helpful information without cluttering the interface.
          </p>
          <p className="ds-content__text">
            All tooltip styles are built using design tokens, ensuring consistency across themes and hues. Use the
            interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the tooltip and see how it looks in real-time. Toggle between themes and hues
            to see how tooltips adapt to different contexts.
          </p>
          <div className="ds-tooltip-playground">
            <TooltipControls
              content={config.content}
              position={config.position}
              trigger={config.trigger}
              showArrow={config.showArrow}
              showBorder={config.showBorder}
              showShadow={config.showShadow}
              theme={theme}
              hue={hue}
              onContentChange={(content) => updateConfig({ content })}
              onPositionChange={(position) => updateConfig({ position })}
              onTriggerChange={(trigger) => updateConfig({ trigger })}
              onShowArrowChange={(showArrow) => updateConfig({ showArrow })}
              onShowBorderChange={(showBorder) => updateConfig({ showBorder })}
              onShowShadowChange={(showShadow) => updateConfig({ showShadow })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-tooltip-playground-divider" />
            <div className="ds-tooltip-preview-section">
              <div className="ds-tooltip-preview">
                <TooltipPreview
                  content={config.content}
                  position={config.position}
                  trigger={config.trigger}
                  showArrow={config.showArrow}
                  showBorder={config.showBorder}
                  showShadow={config.showShadow}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-tooltip-preview-code">
                <CodeCopyButton code={generateTooltipCode(config)} />
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
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {generateTooltipCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A tooltip consists of a container with text content and an optional arrow pointer that indicates the
            relationship to the trigger element.
          </p>
          <div className="ds-tooltip-anatomy-diagram">
            <div className="ds-tooltip-anatomy-diagram__tooltip">
              <div className="ds-tooltip-anatomy-diagram__container">
                <span className="ds-tooltip-anatomy-diagram__content">Tooltip</span>
                <div className="ds-tooltip-anatomy-diagram__arrow" />
              </div>
            </div>
            <div className="ds-tooltip-anatomy-diagram__labels">
              <div className="ds-tooltip-anatomy-diagram__label-item">
                <span className="ds-tooltip-anatomy-diagram__label-name">Container</span>
                <code className="ds-tooltip-anatomy-diagram__label-code">spacing-100 (vertical), spacing-200 (horizontal), border-radius-100</code>
              </div>
              <div className="ds-tooltip-anatomy-diagram__label-item">
                <span className="ds-tooltip-anatomy-diagram__label-name">Content</span>
                <code className="ds-tooltip-anatomy-diagram__label-code">--body-extra-small-text-size</code>
              </div>
              <div className="ds-tooltip-anatomy-diagram__label-item">
                <span className="ds-tooltip-anatomy-diagram__label-name">Arrow</span>
                <code className="ds-tooltip-anatomy-diagram__label-code">Optional pointer indicator</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Tooltips can be positioned in four directions and triggered by different user interactions.
          </p>
          <div className="ds-tooltip-variants-grid">
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Top</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears above the trigger element. Best for elements near the bottom of the viewport.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" position="top" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Bottom</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears below the trigger element. Best for elements near the top of the viewport.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" position="bottom" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Left</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears to the left of the trigger element. Best for elements on the right side of the viewport.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" position="left" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Right</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears to the right of the trigger element. Best for elements on the left side of the viewport.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" position="right" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Hover Trigger</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears when the user hovers over the trigger element. Most common trigger type.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" trigger="hover" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Click Trigger</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears when the user clicks the trigger element. Useful for mobile interactions.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" trigger="click" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Focus Trigger</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip appears when the trigger element receives focus. Good for keyboard navigation.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" trigger="focus" />
              </div>
            </div>
            <div className="ds-tooltip-variant-card">
              <h6 className="ds-tooltip-variant-card__title">Without Arrow</h6>
              <p className="ds-tooltip-variant-card__desc">
                Tooltip without the arrow pointer. Use when the relationship to the trigger is clear.
              </p>
              <div className="ds-tooltip-variant-card__preview">
                <TooltipPreview content="Tooltip" showArrow={false} />
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For a complete matrix of all tooltip positions and triggers, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=1544-276&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Tooltip component in Figma
            </a>
            .
          </p>
        </section>

        <section id="guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidelines</h6>
          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use tooltips to provide helpful, contextual information.</li>
                <li>Keep tooltip content concise and actionable.</li>
                <li>Use hover triggers for desktop interfaces.</li>
                <li>Position tooltips to avoid viewport edges.</li>
                <li>Ensure tooltips are accessible via keyboard navigation.</li>
                <li>Use tooltips to explain icons or abbreviations.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use tooltips for critical information that must always be visible.</li>
                <li>Don't put too much text in tooltips (keep it under 2-3 lines).</li>
                <li>Don't use tooltips as a replacement for proper labels.</li>
                <li>Don't trigger tooltips on click for desktop (use hover instead).</li>
                <li>Don't use tooltips for interactive content.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Tooltips must be keyboard accessible. Use <code>trigger="focus"</code> for keyboard users.
            </li>
            <li>Provide descriptive content that screen readers can announce.</li>
            <li>Ensure tooltip content has sufficient contrast against the background.</li>
            <li>Don't rely solely on tooltips for essential information.</li>
            <li>Tooltips should not block important interactive elements.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Tooltip component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">TooltipProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click" | "focus";
  delay?: number;
  maxWidth?: string;
  showArrow?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
}`}
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                />
                <SyntaxHighlighter
                  language="typescript"
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    padding: "var(--spacing-300)",
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--fonts-body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click" | "focus";
  delay?: number;
  maxWidth?: string;
  showArrow?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>content</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    The content to display in the tooltip
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>children</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    The element that triggers the tooltip
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>position</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"top" | "bottom" | "left" | "right"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"top"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Position of the tooltip relative to the trigger element
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>trigger</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"hover" | "click" | "focus"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"hover"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    How the tooltip is triggered
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>delay</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>number</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>200</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Delay in milliseconds before showing the tooltip on hover
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>maxWidth</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"200px"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Maximum width of the tooltip
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showArrow</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show the arrow pointer
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showBorder</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show the border
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showShadow</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show the shadow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common tooltip use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Tooltip</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Tooltip content="This is a tooltip">
                        <Button>Hover me</Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`}
                    />
                    <SyntaxHighlighter
                      language="tsx"
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        padding: "var(--spacing-300)",
                        backgroundColor: "var(--bg-page-secondary)",
                        fontSize: "var(--fonts-body-small-text-size)",
                        borderRadius: "var(--corner-radius-200)",
                        height: "100%",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        },
                      }}
                      PreTag="div"
                    >
                      {`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">All Positions</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ display: "flex", gap: "var(--spacing-300)", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                      <Tooltip content="Top tooltip" position="top">
                        <Button>Top</Button>
                      </Tooltip>
                      <Tooltip content="Bottom tooltip" position="bottom">
                        <Button>Bottom</Button>
                      </Tooltip>
                      <Tooltip content="Left tooltip" position="left">
                        <Button>Left</Button>
                      </Tooltip>
                      <Tooltip content="Right tooltip" position="right">
                        <Button>Right</Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="Top tooltip" position="top">
  <Button>Top</Button>
</Tooltip>
<Tooltip content="Bottom tooltip" position="bottom">
  <Button>Bottom</Button>
</Tooltip>
<Tooltip content="Left tooltip" position="left">
  <Button>Left</Button>
</Tooltip>
<Tooltip content="Right tooltip" position="right">
  <Button>Right</Button>
</Tooltip>`}
                    />
                    <SyntaxHighlighter
                      language="tsx"
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        padding: "var(--spacing-300)",
                        backgroundColor: "var(--bg-page-secondary)",
                        fontSize: "var(--fonts-body-small-text-size)",
                        borderRadius: "var(--corner-radius-200)",
                        height: "100%",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        },
                      }}
                      PreTag="div"
                    >
                      {`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="Top tooltip" position="top">
  <Button>Top</Button>
</Tooltip>
<Tooltip content="Bottom tooltip" position="bottom">
  <Button>Bottom</Button>
</Tooltip>
<Tooltip content="Left tooltip" position="left">
  <Button>Left</Button>
</Tooltip>
<Tooltip content="Right tooltip" position="right">
  <Button>Right</Button>
</Tooltip>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Click Trigger</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Tooltip content="Click to toggle tooltip" trigger="click">
                        <Button>Click me</Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="Click to toggle tooltip" trigger="click">
  <Button>Click me</Button>
</Tooltip>`}
                    />
                    <SyntaxHighlighter
                      language="tsx"
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        padding: "var(--spacing-300)",
                        backgroundColor: "var(--bg-page-secondary)",
                        fontSize: "var(--fonts-body-small-text-size)",
                        borderRadius: "var(--corner-radius-200)",
                        height: "100%",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        },
                      }}
                      PreTag="div"
                    >
                      {`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="Click to toggle tooltip" trigger="click">
  <Button>Click me</Button>
</Tooltip>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Without Arrow</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Tooltip content="Tooltip without arrow" showArrow={false}>
                        <Button>Hover me</Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="Tooltip without arrow" showArrow={false}>
  <Button>Hover me</Button>
</Tooltip>`}
                    />
                    <SyntaxHighlighter
                      language="tsx"
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        padding: "var(--spacing-300)",
                        backgroundColor: "var(--bg-page-secondary)",
                        fontSize: "var(--fonts-body-small-text-size)",
                        borderRadius: "var(--corner-radius-200)",
                        height: "100%",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        },
                      }}
                      PreTag="div"
                    >
                      {`import { Tooltip } from 'beacon-ui';
import { Button } from 'beacon-ui';

<Tooltip content="Tooltip without arrow" showArrow={false}>
  <Button>Hover me</Button>
</Tooltip>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
