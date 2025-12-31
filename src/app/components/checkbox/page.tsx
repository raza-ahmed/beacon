"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { CheckboxPreview } from "@/components/CheckboxPreview";
import { CheckboxControls } from "@/components/CheckboxControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type CheckboxStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface CheckboxConfig {
  checked: boolean;
  status: CheckboxStatus;
  label: string;
  showLabel: boolean;
}

function generateCheckboxCode(config: CheckboxConfig): string {
  const props: string[] = [];

  if (config.checked) {
    props.push(`checked`);
  }

  if (config.status !== "default") {
    props.push(`status="${config.status}"`);
  }

  if (!config.showLabel) {
    props.push(`showLabel={false}`);
  }

  if (config.showLabel && config.label !== "Checkbox") {
    props.push(`label="${config.label}"`);
  }

  if (props.length === 0) {
    return `<Checkbox />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Checkbox${propsFormatted}
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

export default function CheckboxPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<CheckboxConfig>({
    checked: false,
    status: "default",
    label: "Checkbox",
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

  const updateConfig = (updates: Partial<CheckboxConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateCheckboxCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/checkbox">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Checkbox</h3>
          <p className="ds-content__subtitle">
            Checkboxes allow users to select one or more options from a set. Use checkboxes when users need to make multiple selections or toggle a single option.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Checkboxes are form controls that allow users to select one or more options from a set. They provide a clear
            visual indication of selection state and support three states: unchecked, checked, and indeterminate.
          </p>
          <p className="ds-content__text">
            All checkbox styles are built using design tokens, ensuring consistency across themes and hues. Use the
            interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the checkbox and see how it looks in real-time. Toggle between themes and hues
            to see how checkboxes adapt to different contexts.
          </p>
          <div className="ds-checkbox-playground">
            <CheckboxControls
              checked={config.checked}
              status={config.status}
              label={config.label}
              showLabel={config.showLabel}
              theme={theme}
              hue={hue}
              onCheckedChange={(checked) => updateConfig({ checked })}
              onStatusChange={(status) => updateConfig({ status })}
              onLabelChange={(label) => updateConfig({ label })}
              onShowLabelChange={(showLabel) => updateConfig({ showLabel })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-checkbox-playground-divider" />
            <div className="ds-checkbox-preview-section">
              <div className="ds-checkbox-preview">
                <CheckboxPreview
                  checked={config.checked}
                  status={config.status}
                  label={config.label}
                  showLabel={config.showLabel}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-checkbox-preview-code">
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
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
                  {generateCheckboxCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A checkbox consists of a box container and an optional label. The box displays different visual states based on selection.
          </p>
          <div className="ds-checkbox-anatomy-diagram">
            <div className="ds-checkbox-anatomy-diagram__checkbox">
              <div className="ds-checkbox-anatomy-diagram__container">
                <div className="ds-checkbox-anatomy-diagram__content" style={{ color: "var(--static-white)" }}>
                  <CheckIcon size={16} />
                </div>
              </div>
              <p className="ds-checkbox-anatomy-diagram__label-text">Checkbox</p>
            </div>
            <div className="ds-checkbox-anatomy-diagram__labels">
              <div className="ds-checkbox-anatomy-diagram__label-item">
                <span className="ds-checkbox-anatomy-diagram__label-name">Checkbox Box</span>
                <code className="ds-checkbox-anatomy-diagram__label-code">20px × 20px, border-radius: 4px</code>
              </div>
              <div className="ds-checkbox-anatomy-diagram__label-item">
                <span className="ds-checkbox-anatomy-diagram__label-name">Icon</span>
                <code className="ds-checkbox-anatomy-diagram__label-code">CheckIcon (when checked)</code>
              </div>
              <div className="ds-checkbox-anatomy-diagram__label-item">
                <span className="ds-checkbox-anatomy-diagram__label-name">Label</span>
                <code className="ds-checkbox-anatomy-diagram__label-code">Optional text label</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Checkboxes come in different states to fit various use cases. Each state provides clear visual feedback for user interaction.
          </p>
          <div className="ds-checkbox-variants-grid">
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Unchecked - Default</h6>
              <p className="ds-checkbox-variant-card__desc">
              Default when unselected. Transparent background with border.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={false} status="default" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Unchecked - Hovered</h6>
              <p className="ds-checkbox-variant-card__desc">
              Hover shows visual feedback on pointer over the checkbox.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={false} status="hovered" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Unchecked - Focused</h6>
              <p className="ds-checkbox-variant-card__desc">
              Focus indicates keyboard navigation with a visible focus ring.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={false} status="focused" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Unchecked - Pressed</h6>
              <p className="ds-checkbox-variant-card__desc">
              Pressed gives feedback when the checkbox is clicked or pressed.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={false} status="pressed" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Unchecked - Disabled</h6>
              <p className="ds-checkbox-variant-card__desc">
              Disabled blocks interaction with reduced opacity and colors.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={false} status="disabled" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Checked - Default</h6>
              <p className="ds-checkbox-variant-card__desc">
              Selected uses primary background with a white checkmark.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} status="default" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Checked - Hovered</h6>
              <p className="ds-checkbox-variant-card__desc">
              Checked hover uses a darker primary background.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} status="hovered" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Checked - Focused</h6>
              <p className="ds-checkbox-variant-card__desc">
              Checked focus shows a primary-colored focus ring.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} status="focused" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Checked - Pressed</h6>
              <p className="ds-checkbox-variant-card__desc">
              Checked pressed uses a darker primary background.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} status="pressed" label="Checkbox" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Checked - Disabled</h6>
              <p className="ds-checkbox-variant-card__desc">
              Checked disabled shows reduced opacity and disabled primary.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} status="disabled" label="Checkbox" />
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
                <li>Use checkboxes for multiple selections from a list.</li>
                <li>Use checkboxes to toggle a single option on or off.</li>
                <li>Provide clear, descriptive labels for each checkbox.</li>
                <li>Group related checkboxes together visually.</li>
                <li>Ensure sufficient spacing between checkboxes and labels.</li>
                <li>Provide clear visual feedback for all interactive states (hover, focus, checked).</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use checkboxes for mutually exclusive options (use radio buttons instead).</li>
                <li>Don't use checkboxes for immediate actions (use buttons instead).</li>
                <li>Don't nest checkboxes too deeply in hierarchical structures.</li>
                <li>Don't use checkboxes without labels or with unclear labels.</li>
                <li>Don't disable checkboxes without explaining why.</li>
                <li>Don't use indeterminate state for single-level checkbox lists.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always associate checkboxes with labels using proper HTML structure or ARIA attributes.
            </li>
            <li>Ensure sufficient color contrast between checkbox states and backgrounds.</li>
            <li>Provide keyboard navigation support (Space to toggle, Tab to navigate).</li>
            <li>Ensure checkboxes are large enough to be easily clickable (minimum 20px).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, checked).</li>
            <li>Use semantic HTML (`&lt;input type="checkbox"&gt;` or proper ARIA roles).</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Checkbox component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">CheckboxProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface CheckboxProps {
  checked?: boolean;
  status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
  label?: string;
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
                  {`interface CheckboxProps {
  checked?: boolean;
  status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
  label?: string;
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
                    Whether the checkbox is checked. When true, displays checkmark icon.
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
                    Interactive state of the checkbox. Controls visual styling for different interaction states.
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
                    <code>"Checkbox"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label displayed next to the checkbox.
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
                    Callback function called when checkbox state changes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common checkbox use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Checkbox</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Checkbox />`);
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
                  {`<Checkbox />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checkbox with Label</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Checkbox 
  label="Accept terms and conditions"
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
                  {`<Checkbox 
  label="Accept terms and conditions"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checked Checkbox</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Checkbox 
  checked
  label="I agree"
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
                  {`<Checkbox 
  checked
  label="I agree"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled Checkbox</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Checkbox 
  checked
  status="disabled"
  label="Cannot change"
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
                  {`<Checkbox 
  checked
  status="disabled"
  label="Cannot change"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checkbox with States</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Checkbox label="Default" status="default" />
<Checkbox label="Hovered" status="hovered" />
<Checkbox label="Focused" status="focused" />
<Checkbox label="Pressed" status="pressed" />
<Checkbox label="Disabled" status="disabled" />`);
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
                  {`<Checkbox label="Default" status="default" />
<Checkbox label="Hovered" status="hovered" />
<Checkbox label="Focused" status="focused" />
<Checkbox label="Pressed" status="pressed" />
<Checkbox label="Disabled" status="disabled" />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checkbox Group</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-checkbox-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<div>
  <Checkbox label="Option 1" />
  <Checkbox label="Option 2" checked />
  <Checkbox label="Option 3" />
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
  <Checkbox label="Option 1" />
  <Checkbox label="Option 2" checked />
  <Checkbox label="Option 3" />
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

