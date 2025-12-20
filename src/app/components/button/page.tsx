"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { ButtonPreview } from "@/components/ButtonPreview";
import { ButtonControls } from "@/components/ButtonControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type ButtonVariant = "filled" | "tonal" | "outline" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
type ButtonState = "default" | "hovered" | "focused" | "pressed" | "disabled" | "loading" | "success" | "critical" | "warning";
type JustifyContent = "center" | "space-between";

interface ButtonConfig {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  hasStartIcon: boolean;
  hasEndIcon: boolean;
  fillContainer: boolean;
  justifyContent: JustifyContent;
  state: ButtonState;
}

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

const SIZE_LABELS: Record<ButtonSize, string> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

const VARIANT_LABELS: Record<ButtonVariant, string> = {
  filled: "filled",
  tonal: "tonal",
  outline: "outline",
  link: "link",
};

function generateButtonCode(config: ButtonConfig): string {
  const props: string[] = [];
  
  if (config.variant !== "filled") {
    props.push(`variant="${VARIANT_LABELS[config.variant]}"`);
  }
  
  if (config.size !== "md") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
  }
  
  if (config.cornerRadius !== 2) {
    props.push(`cornerRadius={${config.cornerRadius}}`);
  }
  
  if (config.hasStartIcon) {
    props.push(`startIcon={<SearchIcon />}`);
  }
  
  if (config.hasEndIcon) {
    props.push(`endIcon={<ChevronDownIcon />}`);
  }
  
  if (config.fillContainer) {
    props.push(`fillContainer`);
  }
  
  if (config.justifyContent !== "center" && config.fillContainer) {
    props.push(`justifyContent="${config.justifyContent}"`);
  }
  
  if (config.state === "disabled") {
    props.push(`disabled`);
  }
  
  if (config.state === "loading") {
    props.push(`loading`);
  }
  
  if (props.length === 0) {
    return `<Button>
  Button
</Button>`;
  }
  
  // Format props with proper indentation (one per line)
  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
  
  return `<Button${propsFormatted}
>
  Button
</Button>`;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
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

export default function ButtonPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<ButtonConfig>({
    variant: "filled",
    size: "md",
    cornerRadius: 2,
    hasStartIcon: false,
    hasEndIcon: false,
    fillContainer: false,
    justifyContent: "center",
    state: "default",
  });
  const [copied, setCopied] = useState(false);

  // Clean theme object to remove conflicting background properties
  // Always use dark theme (vscDarkPlus) since background is always dark (Primary Black)
  const syntaxTheme = useMemo(() => {
    const baseTheme = vscDarkPlus;
    const cleanedTheme: typeof baseTheme = { ...baseTheme };
    
    // Remove background properties from all selectors to avoid conflicts
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

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateButtonCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/button">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Button</h3>
          <p className="ds-content__subtitle">
            Interactive buttons for user actions. Use buttons to trigger actions, navigate, or submit forms.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Buttons are interactive elements that allow users to perform actions. The Button component supports multiple
            variants, sizes, and states to fit different contexts and use cases.
          </p>
          <p className="ds-content__text">
            All button styles are built using design tokens, ensuring consistency across themes and hues. Use the
            interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the button and see how it looks in real-time. Toggle between themes and hues
            to see how buttons adapt to different contexts.
          </p>
          <div className="ds-button-playground">
            <ButtonControls
              variant={config.variant}
              size={config.size}
              cornerRadius={config.cornerRadius}
              hasStartIcon={config.hasStartIcon}
              hasEndIcon={config.hasEndIcon}
              fillContainer={config.fillContainer}
              state={config.state}
              theme={theme}
              hue={hue}
              onVariantChange={(variant) => updateConfig({ variant })}
              onSizeChange={(size) => updateConfig({ size })}
              onCornerRadiusChange={(radius) => updateConfig({ cornerRadius: radius })}
              onStartIconChange={(has) => updateConfig({ hasStartIcon: has })}
              onEndIconChange={(has) => updateConfig({ hasEndIcon: has })}
              onFillContainerChange={(fill) => updateConfig({ fillContainer: fill })}
              justifyContent={config.justifyContent}
              onJustifyContentChange={(justify) => updateConfig({ justifyContent: justify })}
              onStateChange={(state) => updateConfig({ state })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-button-playground-divider" />
            <div className="ds-button-preview-section">
              <div className="ds-button-preview">
                <ButtonPreview
                  variant={config.variant}
                  size={config.size}
                  cornerRadius={config.cornerRadius}
                  hasStartIcon={config.hasStartIcon}
                  hasEndIcon={config.hasEndIcon}
                  fillContainer={config.fillContainer}
                  justifyContent={config.justifyContent}
                  state={config.state}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-button-preview-code">
                <button
                  type="button"
                  className="ds-button-code-copy"
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
                  {generateButtonCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A button consists of several parts that work together to create a cohesive interactive element.
          </p>
          <div className="ds-anatomy-diagram">
            <div className="ds-anatomy-diagram__button">
              <div className="ds-anatomy-diagram__container">
                <div className="ds-anatomy-diagram__icon-left" />
                <div className="ds-anatomy-diagram__label">Button</div>
                <div className="ds-anatomy-diagram__icon-right" />
              </div>
            </div>
            <div className="ds-anatomy-diagram__labels">
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Container</span>
                <code className="ds-anatomy-diagram__label-code">padding, border-radius</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Content Area</span>
                <code className="ds-anatomy-diagram__label-code">flex layout, gap</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Label</span>
                <code className="ds-anatomy-diagram__label-code">--body-*-text-size</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Icon Spacing</span>
                <code className="ds-anatomy-diagram__label-code">--spacing-100</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Border</span>
                <code className="ds-anatomy-diagram__label-code">--border-width-25</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Buttons come in four main variants, each suited for different levels of emphasis and use cases.
          </p>
          <div className="ds-button-variants-grid">
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Filled</h6>
              <p className="ds-button-variant-card__desc">
                Primary actions and high-emphasis buttons. Use for the main action on a page or in a form.
              </p>
              <div className="ds-button-variant-card__preview">
                <button className="ds-button-preview-filled" type="button">
                  Button
                </button>
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Tonal</h6>
              <p className="ds-button-variant-card__desc">
                Secondary actions with subtle emphasis. Use for supporting actions that don't need primary attention.
              </p>
              <div className="ds-button-variant-card__preview">
                <button className="ds-button-preview-tonal" type="button">
                  Button
                </button>
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Outline</h6>
              <p className="ds-button-variant-card__desc">
                Tertiary actions with border emphasis. Use for less important actions or when you need visual separation.
              </p>
              <div className="ds-button-variant-card__preview">
                <button className="ds-button-preview-outline" type="button">
                  Button
                </button>
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Link</h6>
              <p className="ds-button-variant-card__desc">
                Text-only buttons for low-emphasis actions. Use for navigation or actions that don't need visual weight.
              </p>
              <div className="ds-button-variant-card__preview">
                <button className="ds-button-preview-link" type="button">
                  Button
                </button>
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For a complete matrix of all button variants, sizes, and states, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=658-3332&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Button component in Figma
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
                <li>Use buttons for actions that trigger immediate responses.</li>
                <li>Use filled buttons for primary actions on a page.</li>
                <li>Provide clear, action-oriented labels (e.g., "Save", "Submit", "Delete").</li>
                <li>Use icons to enhance clarity when appropriate.</li>
                <li>Ensure buttons meet WCAG contrast requirements.</li>
                <li>Use appropriate sizes based on context and importance.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use buttons for navigation (use links instead).</li>
                <li>Don't use multiple primary buttons on the same screen.</li>
                <li>Don't use vague labels like "Click here" or "Submit".</li>
                <li>Don't disable buttons without explaining why.</li>
                <li>Don't use buttons for decorative purposes.</li>
                <li>Don't make buttons too small to tap comfortably on mobile.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Buttons must be keyboard accessible. Use <code>type="button"</code> for non-submit buttons.
            </li>
            <li>Provide descriptive labels for screen readers using <code>aria-label</code> when needed.</li>
            <li>Ensure focus states are clearly visible with sufficient contrast.</li>
            <li>Use <code>disabled</code> attribute for disabled buttons, not just visual styling.</li>
            <li>Loading states should be announced to screen readers.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Button component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">ButtonProps</h6>
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
                {`interface ButtonProps {
  variant?: "filled" | "tonal" | "outline" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fillContainer?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>variant</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"filled" | "tonal" | "outline" | "link"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"filled"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Button style variant
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>size</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"xs" | "sm" | "md" | "lg" | "xl"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"md"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">Button size</div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>cornerRadius</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>0 | 1 | 2 | 3 | 4 | 5</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>2</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Corner radius step: 0=None, 1=100 (4px), 2=200 (8px), 3=300 (12px), 4=400 (16px), 5=Full (100%)
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>startIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>React.ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Icon to display at the start (grouped with text)
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>endIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>React.ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Icon to display at the end (independent, aligns right when fill container is enabled)
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>fillContainer</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Make button full-width
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>disabled</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Disable button interaction
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>loading</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Show loading state
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common button use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Button</h6>
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
                {`<button type="button" className="ds-button ds-button--filled ds-button--md">
  Button
</button>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Button with Icons</h6>
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
                {`<button type="button" className="ds-button ds-button--filled ds-button--md">
  <SearchIcon size="xs" />
  <span>Search</span>
  <ChevronDownIcon size="xs" />
</button>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">All Variants</h6>
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
                {`<button type="button" className="ds-button ds-button--filled">Filled</button>
<button type="button" className="ds-button ds-button--tonal">Tonal</button>
<button type="button" className="ds-button ds-button--outline">Outline</button>
<button type="button" className="ds-button ds-button--link">Link</button>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Sizes</h6>
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
                {`<button type="button" className="ds-button ds-button--xs">Extra Small</button>
<button type="button" className="ds-button ds-button--sm">Small</button>
<button type="button" className="ds-button ds-button--md">Medium</button>
<button type="button" className="ds-button ds-button--lg">Large</button>
<button type="button" className="ds-button ds-button--xl">Extra Large</button>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Fill Container</h6>
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
                {`<button 
  type="button" 
  className="ds-button ds-button--filled ds-button--md ds-button--fill">
  Full Width Button
</button>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled State</h6>
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
                {`<button 
  type="button" 
  className="ds-button ds-button--filled ds-button--md"
  disabled>
  Disabled Button
</button>`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

