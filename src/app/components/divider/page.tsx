"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { DividerPreview } from "@/components/DividerPreview";
import { DividerControls } from "@/components/DividerControls";
import { Divider } from "beacon-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

type DividerOrientation = "horizontal" | "vertical";
type DividerSlotPosition = "default" | "center" | "left" | "right" | "top" | "bottom";

interface DividerConfig {
  orientation: DividerOrientation;
  slotPosition: DividerSlotPosition;
  color: string;
  width: string;
}

const ORIENTATION_LABELS: Record<DividerOrientation, string> = {
  horizontal: "horizontal",
  vertical: "vertical",
};

const SLOT_POSITION_LABELS: Record<DividerSlotPosition, string> = {
  default: "default",
  center: "center",
  left: "left",
  right: "right",
  top: "top",
  bottom: "bottom",
};

function generateDividerCode(config: DividerConfig): string {
  const props: string[] = [];
  const hasSlot = config.slotPosition !== "default";

  if (config.orientation !== "horizontal") {
    props.push(`orientation="${ORIENTATION_LABELS[config.orientation]}"`);
  }

  if (hasSlot) {
    props.push(`slot`);
    if (config.slotPosition !== "default") {
      props.push(`slotPosition="${SLOT_POSITION_LABELS[config.slotPosition]}"`);
    }
  }

  if (config.color) {
    props.push(`color="${config.color}"`);
  }

  if (config.width && config.width !== "100%") {
    props.push(`width="${config.width}"`);
  }

  if (props.length === 0) {
    return `<Divider />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Divider${propsFormatted}
/>`;
}

export default function DividerPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<DividerConfig>({
    orientation: "horizontal",
    slotPosition: "default",
    color: "",
    width: "100%",
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

  const updateConfig = (updates: Partial<DividerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/divider">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Divider</h3>
          <p className="ds-content__subtitle">
            Dividers are used to visually separate content into distinct sections. Use dividers to organize and structure your interface.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            The Divider component provides a visual separation between content sections. It supports both horizontal and vertical orientations,
            and can optionally include a slot for icons or other content.
          </p>
          <p className="ds-content__text">
            All divider styles are built using design tokens, ensuring consistency across themes and hues. Use the
            interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the divider and see how it looks in real-time. Toggle between themes and hues
            to see how dividers adapt to different contexts.
          </p>
          <div className="ds-divider-playground">
            <DividerControls
              orientation={config.orientation}
              slotPosition={config.slotPosition}
              color={config.color}
              width={config.width}
              theme={theme}
              hue={hue}
              onOrientationChange={(orientation) => updateConfig({ orientation })}
              onSlotPositionChange={(slotPosition) => updateConfig({ slotPosition })}
              onColorChange={(color) => updateConfig({ color })}
              onWidthChange={(width) => updateConfig({ width })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-divider-playground-divider" />
            <div className="ds-divider-preview-section">
              <div className="ds-divider-preview">
                <DividerPreview
                  orientation={config.orientation}
                  slotPosition={config.slotPosition}
                  color={config.color}
                  width={config.width}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-divider-preview-code">
                <CodeCopyButton code={generateDividerCode(config)} />
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
                  {generateDividerCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A divider consists of a line that can optionally include a slot for additional content.
          </p>
          <div className="ds-anatomy-diagram">
            <div className="ds-anatomy-diagram__divider">
              <div className="ds-anatomy-diagram__container" style={{ width: "100%", padding: "var(--spacing-200) 0" }}>
                <Divider />
              </div>
            </div>
            <div className="ds-anatomy-diagram__labels">
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Line</span>
                <code className="ds-anatomy-diagram__label-code">--border-neutral-secondary</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Slot (Optional)</span>
                <code className="ds-anatomy-diagram__label-code">Icon or custom content</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Dividers come in different orientations and can include optional slots for additional content.
          </p>
          <div className="ds-divider-variants-grid">
            <div className="ds-divider-variant-card">
              <h6 className="ds-divider-variant-card__title">Horizontal</h6>
              <p className="ds-divider-variant-card__desc">
                Use horizontal dividers to separate content vertically stacked sections.
              </p>
              <div className="ds-divider-variant-card__preview" style={{ padding: "var(--spacing-200) 0" }}>
                <Divider orientation="horizontal" />
              </div>
            </div>
            <div className="ds-divider-variant-card">
              <h6 className="ds-divider-variant-card__title">Vertical</h6>
              <p className="ds-divider-variant-card__desc">
                Use vertical dividers to separate content in horizontal layouts.
              </p>
              <div className="ds-divider-variant-card__preview" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", padding: "0 var(--spacing-200)" }}>
                <Divider orientation="vertical" />
              </div>
            </div>
            <div className="ds-divider-variant-card">
              <h6 className="ds-divider-variant-card__title">With Slot</h6>
              <p className="ds-divider-variant-card__desc">
                Add a slot to include icons or other content within the divider.
              </p>
              <div className="ds-divider-variant-card__preview" style={{ padding: "var(--spacing-200) 0" }}>
                <Divider orientation="horizontal" slot slotPosition="center" />
              </div>
            </div>
            <div className="ds-divider-variant-card">
              <h6 className="ds-divider-variant-card__title">Slot Positions</h6>
              <p className="ds-divider-variant-card__desc">
                Position the slot at different locations: center, left, right, top, or bottom.
              </p>
              <div className="ds-divider-variant-card__preview" style={{ padding: "var(--spacing-200) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-200)" }}>
                <Divider orientation="horizontal" slot slotPosition="left" />
                <Divider orientation="horizontal" slot slotPosition="center" />
                <Divider orientation="horizontal" slot slotPosition="right" />
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For a complete matrix of all divider variants, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=438-7817&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Divider component in Figma
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
                <li>Use dividers to separate distinct content sections.</li>
                <li>Use horizontal dividers in vertical layouts.</li>
                <li>Use vertical dividers in horizontal layouts.</li>
                <li>Add slots when you need to include icons or labels.</li>
                <li>Maintain consistent spacing around dividers.</li>
                <li>Use dividers sparingly to avoid visual clutter.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use dividers as decorative elements only.</li>
                <li>Don't overuse dividers - use spacing when possible.</li>
                <li>Don't mix divider orientations inconsistently.</li>
                <li>Don't place dividers too close to content.</li>
                <li>Don't use dividers to separate closely related content.</li>
                <li>Don't forget to consider accessibility when using dividers.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Dividers are decorative elements and should not be announced by screen readers.
            </li>
            <li>Use appropriate ARIA attributes if dividers have interactive elements.</li>
            <li>Ensure sufficient visual contrast for dividers to be visible.</li>
            <li>Consider using semantic HTML elements when dividers separate major sections.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Divider component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">DividerProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface DividerProps {
  orientation?: "horizontal" | "vertical";
  slot?: boolean;
  slotPosition?: "default" | "center" | "left" | "right" | "top" | "bottom";
  slotContent?: React.ReactNode;
  color?: string;
  width?: string | "100%";
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
                  {`interface DividerProps {
  orientation?: "horizontal" | "vertical";
  slot?: boolean;
  slotPosition?: "default" | "center" | "left" | "right" | "top" | "bottom";
  slotContent?: React.ReactNode;
  color?: string;
  width?: string | "100%";
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>orientation</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"horizontal" | "vertical"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"horizontal"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Divider orientation. Horizontal dividers separate vertical content, vertical dividers separate horizontal content.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>slot</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show a slot for icons or custom content within the divider.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>slotPosition</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "center" | "left" | "right" | "top" | "bottom"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Position of the slot within the divider. For horizontal dividers: left, center, right. For vertical dividers: top, center, bottom.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>slotContent</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>React.ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Custom content to display in the slot. If not provided, defaults to ArrowDownFallSlotIcon.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>color</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"var(--border-neutral-secondary)"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Custom color for the divider line. Can be a CSS variable, hex color, or any valid CSS color value.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>width</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string | "100%"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"100%"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Width of the divider (for horizontal) or height (for vertical). Can be a percentage, pixel value, or any valid CSS dimension.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common divider use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Divider</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ padding: "var(--spacing-200) 0" }}>
                      <Divider />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Divider } from 'beacon-ui';

<Divider />`}
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
                      {`import { Divider } from 'beacon-ui';

<Divider />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Vertical Divider</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", padding: "0 var(--spacing-200)" }}>
                      <Divider orientation="vertical" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Divider } from 'beacon-ui';

<Divider orientation="vertical" />`}
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
                      {`import { Divider } from 'beacon-ui';

<Divider orientation="vertical" />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Divider with Slot</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ padding: "var(--spacing-200) 0" }}>
                      <Divider slot slotPosition="center" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Divider } from 'beacon-ui';

<Divider slot slotPosition="center" />`}
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
                      {`import { Divider } from 'beacon-ui';

<Divider slot slotPosition="center" />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Slot Positions</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ padding: "var(--spacing-200) 0", display: "flex", flexDirection: "column", gap: "var(--spacing-200)" }}>
                      <Divider slot slotPosition="left" />
                      <Divider slot slotPosition="center" />
                      <Divider slot slotPosition="right" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Divider } from 'beacon-ui';

<Divider slot slotPosition="left" />
<Divider slot slotPosition="center" />
<Divider slot slotPosition="right" />`}
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
                      {`import { Divider } from 'beacon-ui';

<Divider slot slotPosition="left" />
<Divider slot slotPosition="center" />
<Divider slot slotPosition="right" />`}
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
