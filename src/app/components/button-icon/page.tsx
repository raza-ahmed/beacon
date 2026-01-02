"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { ButtonIconPreview } from "@/components/ButtonIconPreview";
import { ButtonIconControls } from "@/components/ButtonIconControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { SearchIcon } from "beacon-icons";
import { ButtonIcon } from "beacon-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type ButtonVariant = "filled" | "tonal" | "outline" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
type ButtonState = "default" | "hovered" | "focused" | "pressed" | "disabled" | "loading" | "success" | "critical" | "warning";

interface ButtonIconConfig {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  icon: React.ReactNode | null;
  state: ButtonState;
  loading: boolean;
  disabled: boolean;
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

function generateButtonIconCode(config: ButtonIconConfig): string {
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
  
  if (config.disabled) {
    props.push(`disabled`);
  }
  
  if (config.loading) {
    props.push(`loading`);
  }
  
  if (config.state !== "default" && config.state !== "disabled" && config.state !== "loading") {
    props.push(`state="${config.state}"`);
  }
  
  if (props.length === 0) {
    return `<ButtonIcon
  icon={<SearchIcon />}
/>`;
  }
  
  // Format props with proper indentation (one per line)
  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
  
  return `<ButtonIcon${propsFormatted}
  icon={<SearchIcon />}
/>`;
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

export default function ButtonIconPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<ButtonIconConfig>({
    variant: "filled",
    size: "md",
    cornerRadius: 2,
    icon: <SearchIcon size="xs" />,
    state: "default",
    loading: false,
    disabled: false,
  });
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  // Clean theme object to remove conflicting background properties
  // Always use dark theme (vscDarkPlus) since background is always dark (Primary Black)
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

  const updateConfig = (updates: Partial<ButtonIconConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateButtonIconCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/button-icon">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Button Icon</h3>
          <p className="ds-content__subtitle">
            Icon-only buttons for compact actions. Use button icons for space-efficient controls, toolbars, and secondary actions.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Button Icon is a specialized button component that displays only an icon, without text. It shares all the same properties
            as the Button component but is optimized for icon-only use cases. Button icons are square-shaped and maintain consistent
            sizing across all variants.
          </p>
          <p className="ds-content__text">
            All button icon styles are built using design tokens, ensuring consistency across themes and hues. Use the
            interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the button icon and see how it looks in real-time. Toggle between themes and hues
            to see how button icons adapt to different contexts.
          </p>
          <div className="ds-button-playground">
            <ButtonIconControls
              variant={config.variant}
              size={config.size}
              cornerRadius={config.cornerRadius}
              icon={config.icon}
              state={config.state}
              loading={config.loading}
              disabled={config.disabled}
              theme={theme}
              hue={hue}
              onVariantChange={(variant) => updateConfig({ variant })}
              onSizeChange={(size) => updateConfig({ size })}
              onCornerRadiusChange={(radius) => updateConfig({ cornerRadius: radius })}
              onIconChange={(icon) => updateConfig({ icon })}
              onStateChange={(state) => updateConfig({ state })}
              onLoadingChange={(loading) => updateConfig({ loading })}
              onDisabledChange={(disabled) => updateConfig({ disabled })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-button-playground-divider" />
            <div className="ds-button-preview-section">
              <div className="ds-button-preview">
                <ButtonIconPreview
                  variant={config.variant}
                  size={config.size}
                  cornerRadius={config.cornerRadius}
                  icon={config.icon}
                  state={config.state}
                  loading={config.loading}
                  disabled={config.disabled}
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
                  {generateButtonIconCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A button icon consists of several parts that work together to create a cohesive interactive element.
          </p>
          <div className="ds-anatomy-diagram">
            <div className="ds-anatomy-diagram__button">
              <div className="ds-anatomy-diagram__container" style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="ds-anatomy-diagram__icon-left" style={{ width: "20px", height: "20px", borderRadius: "2px", backgroundColor: "var(--fg-primary)" }} />
              </div>
            </div>
            <div className="ds-anatomy-diagram__labels">
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Container</span>
                <code className="ds-anatomy-diagram__label-code">square, padding, border-radius</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Icon</span>
                <code className="ds-anatomy-diagram__label-code">centered, size-based scaling</code>
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
            Button icons come in four main variants, each suited for different levels of emphasis and use cases.
          </p>
          <div className="ds-button-variants-grid">
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Filled</h6>
              <p className="ds-button-variant-card__desc">
                Primary actions and high-emphasis buttons. Use for the main action in a toolbar or compact interface.
              </p>
              <div className="ds-button-variant-card__preview">
                <ButtonIcon variant="filled" icon={<SearchIcon size="sm" />} />
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Tonal</h6>
              <p className="ds-button-variant-card__desc">
                Secondary actions with subtle emphasis. Use for supporting actions that don't need primary attention.
              </p>
              <div className="ds-button-variant-card__preview">
                <ButtonIcon variant="tonal" icon={<SearchIcon size="sm" />} />
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Outline</h6>
              <p className="ds-button-variant-card__desc">
                Tertiary actions with border emphasis. Use for less important actions or when you need visual separation.
              </p>
              <div className="ds-button-variant-card__preview">
                <ButtonIcon variant="outline" icon={<SearchIcon size="sm" />} />
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Link</h6>
              <p className="ds-button-variant-card__desc">
                Text-only buttons for low-emphasis actions. Use for navigation or actions that don't need visual weight.
              </p>
              <div className="ds-button-variant-card__preview">
                <ButtonIcon variant="link" icon={<SearchIcon size="sm" />} />
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For a complete matrix of all button icon variants, sizes, and states, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=1179-3019&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Button Icon component in Figma
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
                <li>Use button icons for space-efficient controls in toolbars and compact interfaces.</li>
                <li>Use filled button icons for primary actions in icon-only contexts.</li>
                <li>Provide clear, recognizable icons that communicate the action.</li>
                <li>Use appropriate sizes based on context and importance.</li>
                <li>Ensure button icons meet WCAG contrast requirements.</li>
                <li>Always provide aria-label for accessibility when the icon alone isn't clear.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use button icons when text labels would be clearer.</li>
                <li>Don't use ambiguous or unclear icons.</li>
                <li>Don't use button icons for navigation (use links instead).</li>
                <li>Don't make button icons too small to tap comfortably on mobile.</li>
                <li>Don't use button icons for decorative purposes.</li>
                <li>Don't forget to provide accessible labels for screen readers.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Button icons must be keyboard accessible. Use <code>type="button"</code> for non-submit buttons.
            </li>
            <li>Always provide descriptive labels for screen readers using <code>aria-label</code>.</li>
            <li>Ensure focus states are clearly visible with sufficient contrast.</li>
            <li>Use <code>disabled</code> attribute for disabled buttons, not just visual styling.</li>
            <li>Loading states should be announced to screen readers.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">ButtonIcon component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">ButtonIconProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface ButtonIconProps {
  variant?: "filled" | "tonal" | "outline" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}`);
                    setCopiedExample("api");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "api" ? (
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
                  {`interface ButtonIconProps {
  variant?: "filled" | "tonal" | "outline" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}`}
                </SyntaxHighlighter>
              </div>
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
                    <code>icon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>React.ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Icon to display in the button
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
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common button icon use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Button Icon</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <ButtonIcon icon={<SearchIcon size="sm" />} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="ds-button-code-copy"
                      onClick={async () => {
                        await copyToClipboard(`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon icon={<SearchIcon size="sm" />} />`);
                        setCopiedExample("basic");
                        setTimeout(() => setCopiedExample(null), 2000);
                      }}
                      aria-label="Copy code"
                    >
                      {copiedExample === "basic" ? (
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
                      {`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon icon={<SearchIcon size="sm" />} />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">All Variants</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ display: "flex", gap: "var(--spacing-300)", flexWrap: "wrap" }}>
                      <ButtonIcon variant="filled" icon={<SearchIcon size="sm" />} />
                      <ButtonIcon variant="tonal" icon={<SearchIcon size="sm" />} />
                      <ButtonIcon variant="outline" icon={<SearchIcon size="sm" />} />
                      <ButtonIcon variant="link" icon={<SearchIcon size="sm" />} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="ds-button-code-copy"
                      onClick={async () => {
                        await copyToClipboard(`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon variant="filled" icon={<SearchIcon size="sm" />} />
<ButtonIcon variant="tonal" icon={<SearchIcon size="sm" />} />
<ButtonIcon variant="outline" icon={<SearchIcon size="sm" />} />
<ButtonIcon variant="link" icon={<SearchIcon size="sm" />} />`);
                        setCopiedExample("variants");
                        setTimeout(() => setCopiedExample(null), 2000);
                      }}
                      aria-label="Copy code"
                    >
                      {copiedExample === "variants" ? (
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
                      {`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon variant="filled" icon={<SearchIcon size="sm" />} />
<ButtonIcon variant="tonal" icon={<SearchIcon size="sm" />} />
<ButtonIcon variant="outline" icon={<SearchIcon size="sm" />} />
<ButtonIcon variant="link" icon={<SearchIcon size="sm" />} />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Sizes</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ display: "flex", gap: "var(--spacing-300)", flexWrap: "wrap", alignItems: "center" }}>
                      <ButtonIcon size="xs" icon={<SearchIcon size="xs" />} />
                      <ButtonIcon size="sm" icon={<SearchIcon size="xs" />} />
                      <ButtonIcon size="md" icon={<SearchIcon size="sm" />} />
                      <ButtonIcon size="lg" icon={<SearchIcon size="rg" />} />
                      <ButtonIcon size="xl" icon={<SearchIcon size="rm" />} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="ds-button-code-copy"
                      onClick={async () => {
                        await copyToClipboard(`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon size="xs" icon={<SearchIcon size="xs" />} />
<ButtonIcon size="sm" icon={<SearchIcon size="xs" />} />
<ButtonIcon size="md" icon={<SearchIcon size="sm" />} />
<ButtonIcon size="lg" icon={<SearchIcon size="rg" />} />
<ButtonIcon size="xl" icon={<SearchIcon size="rm" />} />`);
                        setCopiedExample("sizes");
                        setTimeout(() => setCopiedExample(null), 2000);
                      }}
                      aria-label="Copy code"
                    >
                      {copiedExample === "sizes" ? (
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
                      {`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon size="xs" icon={<SearchIcon size="xs" />} />
<ButtonIcon size="sm" icon={<SearchIcon size="xs" />} />
<ButtonIcon size="md" icon={<SearchIcon size="sm" />} />
<ButtonIcon size="lg" icon={<SearchIcon size="rg" />} />
<ButtonIcon size="xl" icon={<SearchIcon size="rm" />} />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled State</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <ButtonIcon disabled icon={<SearchIcon size="sm" />} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="ds-button-code-copy"
                      onClick={async () => {
                        await copyToClipboard(`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon disabled icon={<SearchIcon size="sm" />} />`);
                        setCopiedExample("disabled");
                        setTimeout(() => setCopiedExample(null), 2000);
                      }}
                      aria-label="Copy code"
                    >
                      {copiedExample === "disabled" ? (
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
                      {`import { ButtonIcon } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

<ButtonIcon disabled icon={<SearchIcon size="sm" />} />`}
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

