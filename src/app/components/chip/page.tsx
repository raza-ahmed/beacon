"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { ChipPreview } from "@/components/ChipPreview";
import { ChipControls } from "@/components/ChipControls";
import { CopyIcon, CheckIcon, ListDetailsIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type ChipSize = "sm" | "md" | "lg";
type ChipColor = "primary" | "neutral" | "success" | "critical" | "warning";

interface ChipConfig {
  label: string;
  color: ChipColor;
  size: ChipSize;
  showBorders: boolean;
  showIcon: boolean;
}

const SIZE_LABELS: Record<ChipSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const COLOR_LABELS: Record<ChipColor, string> = {
  primary: "primary",
  neutral: "neutral",
  success: "success",
  critical: "critical",
  warning: "warning",
};

function generateChipCode(config: ChipConfig): string {
  const props: string[] = [];

  if (config.label !== "Identifier") {
    props.push(`label="${config.label}"`);
  }

  if (config.color !== "primary") {
    props.push(`color="${COLOR_LABELS[config.color]}"`);
  }

  if (config.size !== "md") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
  }

  if (config.showBorders) {
    props.push(`showBorders`);
  }

  if (config.showIcon) {
    props.push(`showIcon`);
  }

  if (props.length === 0) {
    return `<Chip />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Chip${propsFormatted}
/>`;
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

export default function ChipPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<ChipConfig>({
    label: "Identifier",
    color: "primary",
    size: "md",
    showBorders: false,
    showIcon: false,
  });
  const [copied, setCopied] = useState(false);

  const syntaxTheme = useMemo(() => {
    const baseTheme = vscDarkPlus;
    const cleanedTheme: typeof baseTheme = { ...baseTheme };

    Object.keys(cleanedTheme).forEach((key) => {
      if (cleanedTheme[key] && typeof cleanedTheme[key] === "object") {
        const selector = cleanedTheme[key] as Record<string, string>;
        if (selector.background) {
          delete selector.background;
        }
        if (selector.backgroundColor) {
          delete selector.backgroundColor;
        }
      }
    });

    return cleanedTheme;
  }, []);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "playground", label: "Interactive Playground" },
      { id: "anatomy", label: "Anatomy" },
      { id: "variants", label: "Variants & States" },
      { id: "guidelines", label: "Usage Guidelines" },
      { id: "api", label: "API Reference" },
      { id: "examples", label: "Code Examples" },
    ];
  }, []);

  const updateConfig = (updates: Partial<ChipConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateChipCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/chip">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Chip</h3>
          <p className="ds-content__subtitle">
            Chips are compact elements that represent an input, attribute, or action. They are commonly used for tags, filters, and selections.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Chips are small, interactive elements that represent discrete pieces of information or actions. They provide a compact way to display tags, filters, selections, and other categorical information.
          </p>
          <p className="ds-content__text">
            All chip styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the chip and see how it looks in real-time. Toggle between themes and hues to see how chips adapt to different contexts.
          </p>
          <div className="ds-chip-playground">
            <ChipControls
              label={config.label}
              color={config.color}
              size={config.size}
              showBorders={config.showBorders}
              showIcon={config.showIcon}
              theme={theme}
              hue={hue}
              onLabelChange={(label) => updateConfig({ label })}
              onColorChange={(color) => updateConfig({ color })}
              onSizeChange={(size) => updateConfig({ size })}
              onShowBordersChange={(showBorders) => updateConfig({ showBorders })}
              onShowIconChange={(showIcon) => updateConfig({ showIcon })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-chip-playground-divider" />
            <div className="ds-chip-preview-section">
              <div className="ds-chip-preview">
                <ChipPreview
                  label={config.label}
                  color={config.color}
                  size={config.size}
                  showBorders={config.showBorders}
                  showIcon={config.showIcon}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-chip-preview-code">
                <button
                  type="button"
                  className="ds-chip-code-copy"
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
                    backgroundColor: "var(--static-primary-black)",
                    fontSize: "var(--body-small-text-size)",
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
                  {generateChipCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A chip consists of a rounded container with optional icon and text label. The container uses tonal background colors and can optionally display borders.
          </p>
          <div className="ds-chip-anatomy-diagram">
            <div className="ds-chip-anatomy-diagram__chip">
              <div className="ds-chip-anatomy-diagram__container">
                <div className="ds-chip-anatomy-diagram__icon" style={{ color: "var(--fg-primary-on-tonal)" }}>
                  <ListDetailsIcon size={20} />
                </div>
                <span className="ds-chip-anatomy-diagram__label-text">Identifier</span>
              </div>
            </div>
            <div className="ds-chip-anatomy-diagram__labels">
              <div className="ds-chip-anatomy-diagram__label-item">
                <span className="ds-chip-anatomy-diagram__label-name">Container</span>
                <code className="ds-chip-anatomy-diagram__label-code">Rounded pill shape, border-radius: full</code>
              </div>
              <div className="ds-chip-anatomy-diagram__label-item">
                <span className="ds-chip-anatomy-diagram__label-name">Icon</span>
                <code className="ds-chip-anatomy-diagram__label-code">Optional ListDetailsIcon (16px/20px/24px based on size)</code>
              </div>
              <div className="ds-chip-anatomy-diagram__label-item">
                <span className="ds-chip-anatomy-diagram__label-name">Label</span>
                <code className="ds-chip-anatomy-diagram__label-code">Text content</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Chips come in different colors, sizes, and configurations to fit various use cases.
          </p>
          <div className="ds-chip-variants-grid">
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Primary</h6>
              <p className="ds-chip-variant-card__desc">
                Default color variant using primary tonal background and primary-on-tonal foreground.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="primary" size="md" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Neutral</h6>
              <p className="ds-chip-variant-card__desc">
                Neutral variant using page-tertiary background and neutral-tertiary foreground.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="neutral" size="md" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Success</h6>
              <p className="ds-chip-variant-card__desc">
                Success variant for positive states and confirmations.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="success" size="md" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Critical</h6>
              <p className="ds-chip-variant-card__desc">
                Critical variant for errors and important warnings.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="critical" size="md" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Warning</h6>
              <p className="ds-chip-variant-card__desc">
                Warning variant for cautionary states.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="warning" size="md" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">With Borders</h6>
              <p className="ds-chip-variant-card__desc">
                Chips can display borders for added visual definition.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="primary" size="md" showBorders={true} />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">With Icon</h6>
              <p className="ds-chip-variant-card__desc">
                Chips can include an optional icon before the label text.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="primary" size="md" showIcon={true} />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Small</h6>
              <p className="ds-chip-variant-card__desc">
                Compact size (16px icon) for dense interfaces or when space is limited.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="primary" size="sm" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Medium</h6>
              <p className="ds-chip-variant-card__desc">
                Default size (20px icon) suitable for most use cases.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="primary" size="md" />
              </div>
            </div>
            <div className="ds-chip-variant-card">
              <h6 className="ds-chip-variant-card__title">Large</h6>
              <p className="ds-chip-variant-card__desc">
                Larger size (24px icon) for improved visibility and accessibility.
              </p>
              <div className="ds-chip-variant-card__preview">
                <ChipPreview label="Identifier" color="primary" size="lg" />
              </div>
            </div>
          </div>
        </section>

        <section id="guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidelines</h6>
          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use chips to represent tags, filters, or selections.</li>
                <li>Use chips for compact categorical information.</li>
                <li>Choose appropriate color variants based on semantic meaning.</li>
                <li>Use icons when they add meaningful context.</li>
                <li>Keep chip labels concise and descriptive.</li>
                <li>Use borders when additional visual definition is needed.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use chips for primary actions (use buttons instead).</li>
                <li>Don't use chips for long text content.</li>
                <li>Don't mix too many color variants in a single group.</li>
                <li>Don't use chips without clear purpose or context.</li>
                <li>Don't overcrowd interfaces with too many chips.</li>
                <li>Don't use icons that don't add meaningful information.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Ensure sufficient color contrast between chip background and text colors.
            </li>
            <li>Provide clear visual feedback for interactive chip states.</li>
            <li>Use semantic HTML and ARIA attributes when chips are interactive.</li>
            <li>Ensure chips are large enough to be easily clickable (minimum touch target size).</li>
            <li>Provide alternative text or labels for icon-only chips.</li>
            <li>Consider keyboard navigation for chip groups.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Chip component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">ChipProps</h6>
              <SyntaxHighlighter
                language="typescript"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`interface ChipProps {
  label?: string;
  color?: "primary" | "neutral" | "success" | "critical" | "warning";
  size?: "sm" | "md" | "lg";
  showBorders?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
}`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>label</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Identifier"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text content displayed in the chip.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>color</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"primary" | "neutral" | "success" | "critical" | "warning"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"primary"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Color variant of the chip. Determines background and text colors.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>size</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"sm" | "md" | "lg"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"md"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Chip size: sm (16px icon), md (20px icon), lg (24px icon).
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showBorders</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display a border around the chip.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display an icon before the label text.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onClick</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>() =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when chip is clicked (if chip is interactive).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common chip use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Chip</h6>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`<Chip />`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Chip with Label</h6>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`<Chip 
  label="Tag"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Chip with Icon</h6>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`<Chip 
  label="Filter"
  showIcon
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Chip with Border</h6>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`<Chip 
  label="Selected"
  showBorders
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Color Variants</h6>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`<Chip label="Success" color="success" />
<Chip label="Warning" color="warning" />
<Chip label="Error" color="critical" />
<Chip label="Neutral" color="neutral" />`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Chip Group</h6>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`<div style={{ display: "flex", gap: "var(--spacing-200)", flexWrap: "wrap" }}>
  <Chip label="Tag 1" />
  <Chip label="Tag 2" color="success" />
  <Chip label="Tag 3" color="warning" />
</div>`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

