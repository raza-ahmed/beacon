"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { CheckboxPreview } from "@/components/CheckboxPreview";
import { CheckboxControls } from "@/components/CheckboxControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxConfig {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  label: string;
  size: CheckboxSize;
}

const SIZE_LABELS: Record<CheckboxSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

function generateCheckboxCode(config: CheckboxConfig): string {
  const props: string[] = [];

  if (config.checked) {
    props.push(`checked`);
  }

  if (config.indeterminate) {
    props.push(`indeterminate`);
  }

  if (config.disabled) {
    props.push(`disabled`);
  }

  if (config.label !== "Select Me") {
    props.push(`label="${config.label}"`);
  }

  if (config.size !== "md") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
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
    indeterminate: false,
    disabled: false,
    label: "Select Me",
    size: "md",
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
              indeterminate={config.indeterminate}
              disabled={config.disabled}
              label={config.label}
              size={config.size}
              theme={theme}
              hue={hue}
              onCheckedChange={(checked) => updateConfig({ checked })}
              onIndeterminateChange={(indeterminate) => updateConfig({ indeterminate })}
              onDisabledChange={(disabled) => updateConfig({ disabled })}
              onLabelChange={(label) => updateConfig({ label })}
              onSizeChange={(size) => updateConfig({ size })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-checkbox-playground-divider" />
            <div className="ds-checkbox-preview-section">
              <div className="ds-checkbox-preview">
                <CheckboxPreview
                  checked={config.checked}
                  indeterminate={config.indeterminate}
                  disabled={config.disabled}
                  label={config.label}
                  size={config.size}
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
              <p className="ds-checkbox-anatomy-diagram__label-text">Select Me</p>
            </div>
            <div className="ds-checkbox-anatomy-diagram__labels">
              <div className="ds-checkbox-anatomy-diagram__label-item">
                <span className="ds-checkbox-anatomy-diagram__label-name">Checkbox Box</span>
                <code className="ds-checkbox-anatomy-diagram__label-code">20px × 20px (md), border-radius: 4px</code>
              </div>
              <div className="ds-checkbox-anatomy-diagram__label-item">
                <span className="ds-checkbox-anatomy-diagram__label-name">Icon</span>
                <code className="ds-checkbox-anatomy-diagram__label-code">CheckIcon (checked) or MinusDashIcon (indeterminate)</code>
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
            Checkboxes come in different sizes and states to fit various use cases.
          </p>
          <div className="ds-checkbox-variants-grid">
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Unchecked</h6>
              <p className="ds-checkbox-variant-card__desc">
                Default state when no selection has been made. Shows a border with transparent background.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={false} label="Select Me" size="md" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Checked</h6>
              <p className="ds-checkbox-variant-card__desc">
                Selected state with primary background color and white checkmark icon.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} label="Select Me" size="md" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Indeterminate</h6>
              <p className="ds-checkbox-variant-card__desc">
                Partially selected state, useful for parent checkboxes in hierarchical lists.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview indeterminate={true} label="Select Me" size="md" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Disabled</h6>
              <p className="ds-checkbox-variant-card__desc">
                Disabled state prevents interaction. Can be disabled in checked, unchecked, or indeterminate states.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} disabled={true} label="Select Me" size="md" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Small</h6>
              <p className="ds-checkbox-variant-card__desc">
                Compact size (16px) for dense interfaces or when space is limited.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} label="Select Me" size="sm" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Medium</h6>
              <p className="ds-checkbox-variant-card__desc">
                Default size (20px) suitable for most use cases.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} label="Select Me" size="md" />
              </div>
            </div>
            <div className="ds-checkbox-variant-card">
              <h6 className="ds-checkbox-variant-card__title">Large</h6>
              <p className="ds-checkbox-variant-card__desc">
                Larger size (24px) for improved visibility and accessibility.
              </p>
              <div className="ds-checkbox-variant-card__preview">
                <CheckboxPreview checked={true} label="Select Me" size="lg" />
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
                <li>Use indeterminate state for parent checkboxes in hierarchical lists.</li>
                <li>Group related checkboxes together visually.</li>
                <li>Ensure sufficient spacing between checkboxes and labels.</li>
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
            <li>Use the indeterminate state appropriately for parent checkboxes in hierarchical lists.</li>
            <li>Ensure checkboxes are large enough to be easily clickable (minimum 20px).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, checked).</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Checkbox component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">CheckboxProps</h6>
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
                {`interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  onChange?: (checked: boolean) => void;
}`}
              </SyntaxHighlighter>
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
                    <code>indeterminate</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether the checkbox is in indeterminate state. Displays minus icon. Takes precedence over checked.
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
                    Whether the checkbox is disabled. Prevents interaction and applies disabled styling.
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
                    <code>"Select Me"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label displayed next to the checkbox.
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
                    Checkbox size: sm (16px), md (20px), lg (24px).
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
                {`<Checkbox />`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checkbox with Label</h6>
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
                {`<Checkbox 
  label="Accept terms and conditions"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checked Checkbox</h6>
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
                {`<Checkbox 
  checked
  label="I agree"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled Checkbox</h6>
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
                {`<Checkbox 
  checked
  disabled
  label="Cannot change"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Indeterminate Checkbox</h6>
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
                {`<Checkbox 
  indeterminate
  label="Select all"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Checkbox Group</h6>
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
                {`<div>
  <Checkbox label="Option 1" />
  <Checkbox label="Option 2" checked />
  <Checkbox label="Option 3" />
</div>`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

