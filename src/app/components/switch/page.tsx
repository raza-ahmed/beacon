"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { SwitchPreview } from "@/components/SwitchPreview";
import { SwitchControls } from "@/components/SwitchControls";
import { CopyIcon, CheckIcon, SunIcon, MoonIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type SwitchStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface SwitchConfig {
  checked: boolean;
  status: SwitchStatus;
  showIcons: boolean;
  label: string;
  showLabel: boolean;
}

const STATUS_LABELS: Record<SwitchStatus, string> = {
  default: "default",
  hovered: "hovered",
  focused: "focused",
  pressed: "pressed",
  disabled: "disabled",
};

function generateSwitchCode(config: SwitchConfig): string {
  const props: string[] = [];

  if (config.checked) {
    props.push(`checked`);
  }

  if (config.status !== "default") {
    props.push(`status="${STATUS_LABELS[config.status]}"`);
  }

  if (config.showIcons) {
    props.push(`showIcons`);
  }

  if (config.showLabel && config.label) {
    props.push(`label="${config.label}"`);
    props.push(`showLabel`);
  }

  if (props.length === 0) {
    return `<Switch />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Switch${propsFormatted}
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

export default function SwitchPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<SwitchConfig>({
    checked: false,
    status: "default",
    showIcons: false,
    label: "Switch",
    showLabel: false,
  });
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

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

  const updateConfig = (updates: Partial<SwitchConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateSwitchCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/switch">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Switch</h3>
          <p className="ds-content__subtitle">
            Switches allow users to toggle a single option on or off. They provide immediate visual feedback and are ideal for settings, preferences, and binary choices.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Switches are toggle controls that allow users to turn an option on or off. Unlike checkboxes, switches are typically used for settings and preferences that take effect immediately, rather than for form selections.
          </p>
          <p className="ds-content__text">
            All switch styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the switch and see how it looks in real-time. Toggle between themes and hues to see how switches adapt to different contexts.
          </p>
          <div className="ds-switch-playground">
            <SwitchControls
              checked={config.checked}
              status={config.status}
              showIcons={config.showIcons}
              label={config.label}
              showLabel={config.showLabel}
              theme={theme}
              hue={hue}
              onCheckedChange={(checked) => updateConfig({ checked })}
              onStatusChange={(status) => updateConfig({ status })}
              onShowIconsChange={(showIcons) => updateConfig({ showIcons })}
              onLabelChange={(label) => updateConfig({ label })}
              onShowLabelChange={(showLabel) => updateConfig({ showLabel })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-switch-playground-divider" />
            <div className="ds-switch-preview-section">
              <div className="ds-switch-preview">
                <SwitchPreview
                  checked={config.checked}
                  status={config.status}
                  showIcons={config.showIcons}
                  label={config.label}
                  showLabel={config.showLabel}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-switch-preview-code">
                <button
                  type="button"
                  className="ds-switch-code-copy"
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
                  {generateSwitchCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A switch consists of a track container and a handle that moves between positions. Switches can optionally include icon containers for visual context.
          </p>
          <div className="ds-switch-anatomy-diagram">
            <div className="ds-switch-anatomy-diagram__switch">
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "var(--spacing-500)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-200)" }}>
                  <SwitchPreview checked={false} status="default" theme={theme} hue={hue} />
                  <p style={{ margin: 0, fontFamily: "var(--font-secondary)", fontSize: "var(--body-small-text-size)", color: "var(--fg-neutral-secondary)" }}>Unchecked</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-200)" }}>
                  <SwitchPreview checked={true} status="default" theme={theme} hue={hue} />
                  <p style={{ margin: 0, fontFamily: "var(--font-secondary)", fontSize: "var(--body-small-text-size)", color: "var(--fg-neutral-secondary)" }}>Checked</p>
                </div>
              </div>
            </div>
            <div className="ds-switch-anatomy-diagram__labels">
              <div className="ds-switch-anatomy-diagram__label-item">
                <span className="ds-switch-anatomy-diagram__label-name">Track</span>
                <code className="ds-switch-anatomy-diagram__label-code">52px width, rounded-full, 2px padding</code>
              </div>
              <div className="ds-switch-anatomy-diagram__label-item">
                <span className="ds-switch-anatomy-diagram__label-name">Handle</span>
                <code className="ds-switch-anatomy-diagram__label-code">24px × 24px, moves left (off) or right (on)</code>
              </div>
              <div className="ds-switch-anatomy-diagram__label-item">
                <span className="ds-switch-anatomy-diagram__label-name">Icons</span>
                <code className="ds-switch-anatomy-diagram__label-code">Optional SunIcon and MoonIcon in 32px containers</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Switches come in different states and can optionally include icons to fit various use cases.
          </p>
          <div className="ds-switch-variants-grid">
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">Unchecked</h6>
              <p className="ds-switch-variant-card__desc">
                Default off state. Handle positioned on the left with neutral background.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={false} />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">Checked</h6>
              <p className="ds-switch-variant-card__desc">
                On state with primary background color. Handle positioned on the right.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={true} />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">Hovered</h6>
              <p className="ds-switch-variant-card__desc">
                Hover state provides visual feedback when the user hovers over the switch.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={true} status="hovered" />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">Focused</h6>
              <p className="ds-switch-variant-card__desc">
                Focus state indicates keyboard navigation focus with a distinct border color.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={true} status="focused" />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">Pressed</h6>
              <p className="ds-switch-variant-card__desc">
                Pressed state shows active interaction feedback when the switch is being pressed.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={true} status="pressed" />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">Disabled</h6>
              <p className="ds-switch-variant-card__desc">
                Disabled state prevents interaction. Can be disabled in checked or unchecked states.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={true} status="disabled" />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">With Icons</h6>
              <p className="ds-switch-variant-card__desc">
                Switch with icon containers for visual context, useful for theme toggles.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={false} showIcons={true} />
              </div>
            </div>
            <div className="ds-switch-variant-card">
              <h6 className="ds-switch-variant-card__title">With Icons (Checked)</h6>
              <p className="ds-switch-variant-card__desc">
                Switch with icons in checked state showing the active state.
              </p>
              <div className="ds-switch-variant-card__preview">
                <SwitchPreview checked={true} showIcons={true} />
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
                <li>Use switches for settings and preferences that take effect immediately.</li>
                <li>Use switches for binary on/off choices.</li>
                <li>Provide clear labels that describe what the switch controls.</li>
                <li>Use switches with icons for theme toggles (light/dark mode).</li>
                <li>Ensure switches are clearly visible and easy to interact with.</li>
                <li>Use switches in settings panels and preference dialogs.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use switches for form selections (use checkboxes instead).</li>
                <li>Don't use switches for immediate actions (use buttons instead).</li>
                <li>Don't use switches without clear labels or context.</li>
                <li>Don't use switches for mutually exclusive options (use radio buttons instead).</li>
                <li>Don't disable switches without explaining why.</li>
                <li>Don't use too many switches in a single view.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always associate switches with labels using proper HTML structure or ARIA attributes.
            </li>
            <li>Ensure sufficient color contrast between switch states and backgrounds.</li>
            <li>Provide keyboard navigation support (Space to toggle, Tab to navigate).</li>
            <li>Use semantic HTML elements or proper ARIA roles for switches.</li>
            <li>Ensure switches are large enough to be easily clickable (minimum touch target size).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, checked).</li>
            <li>Announce state changes to screen readers when switches are toggled.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Switch component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">SwitchProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface SwitchProps {
  checked?: boolean;
  status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
  showIcons?: boolean;
  onChange?: (checked: boolean) => void;
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`interface SwitchProps {
  checked?: boolean;
  status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
  showIcons?: boolean;
  onChange?: (checked: boolean) => void;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>checked</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether the switch is checked (on). When true, handle is positioned on the right.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>status</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "hovered" | "focused" | "pressed" | "disabled"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Interactive state of the switch. Controls visual styling for different interaction states.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showIcons</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show icons. When true, displays sun and moon icons in containers for visual context.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onChange</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>(checked: boolean) =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when switch state changes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common switch use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Switch</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Switch />`);
                    setCopiedExample("basic");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Switch />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checked Switch</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Switch 
  checked
/>`);
                    setCopiedExample("checked");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "checked" ? (
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
                  fontSize: "var(--body-small-text-size)",
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
                {`<Switch 
  checked
/>`}
              </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled Switch</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Switch 
  checked
  status="disabled"
/>`);
                    setCopiedExample("disabled");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
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
                  fontSize: "var(--body-small-text-size)",
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
                {`<Switch 
  checked
  status="disabled"
/>`}
              </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Theme Switch</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Switch 
  showIcons
/>`);
                    setCopiedExample("theme");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "theme" ? (
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
                  fontSize: "var(--body-small-text-size)",
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
                {`<Switch 
  showIcons
/>`}
              </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Switch with Label</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
  <span>Enable notifications</span>
  <Switch checked />
</label>`);
                    setCopiedExample("label");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "label" ? (
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
                  fontSize: "var(--body-small-text-size)",
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
                {`<label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
  <span>Enable notifications</span>
  <Switch checked />
</label>`}
              </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Switch Group</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-switch-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-300)" }}>
  <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
    <span>Email notifications</span>
    <Switch checked />
  </label>
  <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
    <span>Push notifications</span>
    <Switch />
  </label>
</div>`);
                    setCopiedExample("group");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "group" ? (
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
                  fontSize: "var(--body-small-text-size)",
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
                {`<div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-300)" }}>
  <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
    <span>Email notifications</span>
    <Switch checked />
  </label>
  <label style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
    <span>Push notifications</span>
    <Switch />
  </label>
</div>`}
              </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

