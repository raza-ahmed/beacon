"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { RadioButtonPreview } from "@/components/RadioButtonPreview";
import { RadioButtonControls } from "@/components/RadioButtonControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type RadioButtonStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface RadioButtonConfig {
  selected: boolean;
  status: RadioButtonStatus;
  label: string;
  showLabel: boolean;
}

function generateRadioButtonCode(config: RadioButtonConfig): string {
  const props: string[] = [];

  if (config.selected) {
    props.push(`selected`);
  }

  if (config.status !== "default") {
    props.push(`status="${config.status}"`);
  }

  if (!config.showLabel) {
    props.push(`showLabel={false}`);
  }

  if (config.showLabel && config.label !== "Radio Button") {
    props.push(`label="${config.label}"`);
  }

  if (props.length === 0) {
    return `<RadioButton />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<RadioButton${propsFormatted}
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

export default function RadioButtonPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<RadioButtonConfig>({
    selected: false,
    status: "default",
    label: "Radio Button",
    showLabel: true,
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

  const updateConfig = (updates: Partial<RadioButtonConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateRadioButtonCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/radio-button">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Radio Button</h3>
          <p className="ds-content__subtitle">
            Radio buttons allow users to select a single option from a set of mutually exclusive options. Use radio buttons when only one selection is allowed.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Radio buttons are form controls that allow users to select exactly one option from a set of mutually exclusive options. They provide a clear visual indication of selection state and are always displayed in groups.
          </p>
          <p className="ds-content__text">
            All radio button styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the radio button and see how it looks in real-time. Toggle between themes and hues to see how radio buttons adapt to different contexts.
          </p>
          <div className="ds-radio-button-playground">
            <RadioButtonControls
              selected={config.selected}
              status={config.status}
              label={config.label}
              showLabel={config.showLabel}
              theme={theme}
              hue={hue}
              onSelectedChange={(selected) => updateConfig({ selected })}
              onStatusChange={(status) => updateConfig({ status })}
              onLabelChange={(label) => updateConfig({ label })}
              onShowLabelChange={(showLabel) => updateConfig({ showLabel })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-radio-button-playground-divider" />
            <div className="ds-radio-button-preview-section">
              <div className="ds-radio-button-preview">
                <RadioButtonPreview
                  selected={config.selected}
                  status={config.status}
                  label={config.label}
                  showLabel={config.showLabel}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-radio-button-preview-code">
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
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
                  {generateRadioButtonCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A radio button consists of a circular button element and an optional label. The button displays different visual states based on selection and interaction.
          </p>
          <div className="ds-radio-button-anatomy-diagram">
            <div className="ds-radio-button-anatomy-diagram__radio">
              <div className="ds-radio-button-anatomy-diagram__container">
                <div className="ds-radio-button-anatomy-diagram__content" />
              </div>
              <p className="ds-radio-button-anatomy-diagram__label-text">Radio Button</p>
            </div>
            <div className="ds-radio-button-anatomy-diagram__labels">
              <div className="ds-radio-button-anatomy-diagram__label-item">
                <span className="ds-radio-button-anatomy-diagram__label-name">Radio Button Circle</span>
                <code className="ds-radio-button-anatomy-diagram__label-code">20px × 20px, border-radius: 100%</code>
              </div>
              <div className="ds-radio-button-anatomy-diagram__label-item">
                <span className="ds-radio-button-anatomy-diagram__label-name">Label</span>
                <code className="ds-radio-button-anatomy-diagram__label-code">Optional text label</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Radio buttons come in different states to fit various use cases. Each state provides clear visual feedback for user interaction.
          </p>
          <div className="ds-radio-button-variants-grid">
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Unselected - Default</h6>
              <p className="ds-radio-button-variant-card__desc">
              Default when unselected. Thin border with transparent background.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={false} status="default" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Unselected - Hovered</h6>
              <p className="ds-radio-button-variant-card__desc">
              Hover shows visual feedback on pointer over the radio button.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={false} status="hovered" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Unselected - Focused</h6>
              <p className="ds-radio-button-variant-card__desc">
              Focus indicates keyboard navigation with a visible focus ring.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={false} status="focused" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Unselected - Pressed</h6>
              <p className="ds-radio-button-variant-card__desc">
              Pressed gives feedback when the radio button is clicked or pressed.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={false} status="pressed" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Unselected - Disabled</h6>
              <p className="ds-radio-button-variant-card__desc">
              Disabled blocks interaction with reduced opacity and colors.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={false} status="disabled" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Selected - Default</h6>
              <p className="ds-radio-button-variant-card__desc">
              Selected uses thick border in primary with white inner circle.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={true} status="default" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Selected - Hovered</h6>
              <p className="ds-radio-button-variant-card__desc">
              Selected hover uses a darker primary border.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={true} status="hovered" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Selected - Focused</h6>
              <p className="ds-radio-button-variant-card__desc">
              Selected focus shows a primary-colored focus ring.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={true} status="focused" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Selected - Pressed</h6>
              <p className="ds-radio-button-variant-card__desc">
              Selected pressed uses a darker primary border.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={true} status="pressed" label="Radio Button" />
              </div>
            </div>
            <div className="ds-radio-button-variant-card">
              <h6 className="ds-radio-button-variant-card__title">Selected - Disabled</h6>
              <p className="ds-radio-button-variant-card__desc">
              Selected disabled shows reduced opacity and disabled primary.
              </p>
              <div className="ds-radio-button-variant-card__preview">
                <RadioButtonPreview selected={true} status="disabled" label="Radio Button" />
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
                <li>Use radio buttons for mutually exclusive options.</li>
                <li>Use radio buttons when only one selection is allowed.</li>
                <li>Group related radio buttons together.</li>
                <li>Provide clear, descriptive labels for each radio button.</li>
                <li>Use radio button groups for 2-7 options.</li>
                <li>Ensure one option is selected by default when appropriate.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use radio buttons for multiple selections (use checkboxes instead).</li>
                <li>Don't use radio buttons for immediate actions (use buttons instead).</li>
                <li>Don't use radio buttons without labels.</li>
                <li>Don't use too many radio buttons in a single group (consider dropdown).</li>
                <li>Don't disable radio buttons without explaining why.</li>
                <li>Don't use radio buttons for single on/off toggles (use switches instead).</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always associate radio buttons with labels using proper HTML structure or ARIA attributes.
            </li>
            <li>Ensure sufficient color contrast between radio button states and backgrounds.</li>
            <li>Provide keyboard navigation support (Arrow keys to navigate, Space to select).</li>
            <li>Use semantic HTML (`&lt;input type="radio"&gt;` or proper ARIA roles).</li>
            <li>Group related radio buttons with `&lt;fieldset&gt;` and `&lt;legend&gt;`.</li>
            <li>Ensure radio buttons are large enough to be easily clickable (minimum 20px).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, selected).</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Radio Button component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">RadioButtonProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface RadioButtonProps {
  selected?: boolean;
  status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
  label?: string;
  onChange?: (selected: boolean) => void;
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
                  {`interface RadioButtonProps {
  selected?: boolean;
  status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
  label?: string;
  onChange?: (selected: boolean) => void;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>selected</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether the radio button is selected. When true, displays thick border with primary color and white inner circle.
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
                    Interactive state of the radio button. Controls visual styling for different interaction states.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>label</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Radio Button"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label displayed next to the radio button.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onChange</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>(selected: boolean) =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when radio button state changes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common radio button use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Radio Button</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<RadioButton />`);
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
                  {`<RadioButton />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Radio Button with Label</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<RadioButton 
  label="Option 1"
/>`);
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
                  {`<RadioButton 
  label="Option 1"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Selected Radio Button</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<RadioButton 
  selected
  label="Selected"
/>`);
                    setCopiedExample("selected");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "selected" ? (
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
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<RadioButton 
  selected
  label="Selected"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled Radio Button</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<RadioButton 
  selected
  status="disabled"
  label="Disabled"
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
                  {`<RadioButton 
  selected
  status="disabled"
  label="Disabled"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Radio Button Group</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<div>
  <RadioButton label="Option 1" />
  <RadioButton label="Option 2" selected />
  <RadioButton label="Option 3" />
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
                  {`<div>
  <RadioButton label="Option 1" />
  <RadioButton label="Option 2" selected />
  <RadioButton label="Option 3" />
</div>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Radio Button with States</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-radio-button-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<RadioButton label="Default" status="default" />
<RadioButton label="Hovered" status="hovered" />
<RadioButton label="Focused" status="focused" />
<RadioButton label="Pressed" status="pressed" />
<RadioButton label="Disabled" status="disabled" />`);
                    setCopiedExample("states");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "states" ? (
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
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<RadioButton label="Default" status="default" />
<RadioButton label="Hovered" status="hovered" />
<RadioButton label="Focused" status="focused" />
<RadioButton label="Pressed" status="pressed" />
<RadioButton label="Disabled" status="disabled" />`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

