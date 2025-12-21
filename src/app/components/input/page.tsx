"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { InputPreview } from "@/components/InputPreview";
import { InputControls } from "@/components/InputControls";
import { CopyIcon, CheckIcon, UserPersonIcon, SearchIcon, ChevronDownIcon, AlertTriangleErrorIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type InputSize = "sm" | "md" | "lg";
type InputStatus = "default" | "active";

interface InputConfig {
  label: string;
  placeholder: string;
  value: string;
  size: InputSize;
  status: InputStatus;
  showLabel: boolean;
  showStartIcon: boolean;
  showEndIcon: boolean;
  showPlaceholderIcon: boolean;
  showError: boolean;
  showNumberPrefix: boolean;
  rounded: boolean;
  iconOnly: boolean;
  disabled: boolean;
}

const SIZE_LABELS: Record<InputSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const STATUS_LABELS: Record<InputStatus, string> = {
  default: "default",
  active: "active",
};

function generateInputCode(config: InputConfig): string {
  const props: string[] = [];

  if (config.label !== "Label") {
    props.push(`label="${config.label}"`);
  }

  if (config.placeholder !== "Placeholder") {
    props.push(`placeholder="${config.placeholder}"`);
  }

  if (config.value !== "") {
    props.push(`value="${config.value}"`);
  }

  if (config.size !== "md") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
  }

  if (config.status !== "default") {
    props.push(`status="${STATUS_LABELS[config.status]}"`);
  }

  if (!config.showLabel) {
    props.push(`showLabel={false}`);
  }

  if (config.showStartIcon) {
    props.push(`showStartIcon`);
  }

  if (config.showEndIcon) {
    props.push(`showEndIcon`);
  }

  if (config.showPlaceholderIcon) {
    props.push(`showPlaceholderIcon`);
  }

  if (config.showError) {
    props.push(`showError`);
  }

  if (config.showNumberPrefix) {
    props.push(`showNumberPrefix`);
  }

  if (config.rounded) {
    props.push(`rounded`);
  }

  if (config.iconOnly) {
    props.push(`iconOnly`);
  }

  if (config.disabled) {
    props.push(`disabled`);
  }

  if (props.length === 0) {
    return `<InputField />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<InputField${propsFormatted}
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

export default function InputPage() {
  const { theme, hue } = useTheme();
  const [config, setConfig] = useState<InputConfig>({
    label: "Label",
    placeholder: "Placeholder",
    value: "",
    size: "md",
    status: "default",
    showLabel: true,
    showStartIcon: false,
    showEndIcon: false,
    showPlaceholderIcon: false,
    showError: false,
    showNumberPrefix: false,
    rounded: false,
    iconOnly: false,
    disabled: false,
  });
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

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

  const updateConfig = (updates: Partial<InputConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateInputCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/input">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Input Field</h3>
          <p className="ds-content__subtitle">
            Input fields allow users to enter and edit text. Use input fields for single-line text input, search queries, and form data entry.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Input fields are form controls that allow users to enter and edit text. They provide a clear visual indication of state and support various features like icons, prefixes, and error messages.
          </p>
          <p className="ds-content__text">
            All input field styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the input field and see how it looks in real-time.
          </p>
          <div className="ds-input-playground">
            <InputControls
              label={config.label}
              placeholder={config.placeholder}
              value={config.value}
              size={config.size}
              status={config.status}
              showLabel={config.showLabel}
              showStartIcon={config.showStartIcon}
              showEndIcon={config.showEndIcon}
              showPlaceholderIcon={config.showPlaceholderIcon}
              showError={config.showError}
              showNumberPrefix={config.showNumberPrefix}
              rounded={config.rounded}
              iconOnly={config.iconOnly}
              disabled={config.disabled}
              onLabelChange={(label) => updateConfig({ label })}
              onPlaceholderChange={(placeholder) => updateConfig({ placeholder })}
              onValueChange={(value) => updateConfig({ value })}
              onSizeChange={(size) => updateConfig({ size })}
              onStatusChange={(status) => updateConfig({ status })}
              onShowLabelChange={(show) => updateConfig({ showLabel: show })}
              onShowStartIconChange={(show) => updateConfig({ showStartIcon: show })}
              onShowEndIconChange={(show) => updateConfig({ showEndIcon: show })}
              onShowPlaceholderIconChange={(show) => updateConfig({ showPlaceholderIcon: show })}
              onShowErrorChange={(show) => updateConfig({ showError: show })}
              onShowNumberPrefixChange={(show) => updateConfig({ showNumberPrefix: show })}
              onRoundedChange={(rounded) => updateConfig({ rounded })}
              onIconOnlyChange={(iconOnly) => updateConfig({ iconOnly })}
              onDisabledChange={(disabled) => updateConfig({ disabled })}
            />
            <div className="ds-input-playground-divider" />
            <div className="ds-input-preview-section">
              <div className="ds-input-preview">
                <InputPreview
                  label={config.label}
                  placeholder={config.placeholder}
                  value={config.value}
                  size={config.size}
                  status={config.status}
                  showLabel={config.showLabel}
                  showStartIcon={config.showStartIcon}
                  showEndIcon={config.showEndIcon}
                  showPlaceholderIcon={config.showPlaceholderIcon}
                  showError={config.showError}
                  showNumberPrefix={config.showNumberPrefix}
                  rounded={config.rounded}
                  iconOnly={config.iconOnly}
                  disabled={config.disabled}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-input-preview-code">
                <button
                  type="button"
                  className="ds-input-code-copy"
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
                  {generateInputCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            An input field consists of several parts that work together to create a cohesive text input control.
          </p>
          <div className="ds-input-anatomy-diagram">
            <div className="ds-input-anatomy-diagram__input">
              <div className="ds-input-anatomy-diagram__container">
                <div className="ds-input-anatomy-diagram__label">Label</div>
                <div className="ds-input-anatomy-diagram__field">
                  <div className="ds-input-anatomy-diagram__start-icon">
                    <UserPersonIcon size={16} />
                  </div>
                  <div className="ds-input-anatomy-diagram__text">Placeholder</div>
                  <div className="ds-input-anatomy-diagram__end-icon">
                    <ChevronDownIcon size={16} />
                  </div>
                </div>
                <div className="ds-input-anatomy-diagram__error">
                  <AlertTriangleErrorIcon size={16} />
                  <span>Error message!</span>
                </div>
              </div>
            </div>
            <div className="ds-input-anatomy-diagram__labels">
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Label</span>
                <code className="ds-input-anatomy-diagram__label-code">Optional text label above input</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Input Container</span>
                <code className="ds-input-anatomy-diagram__label-code">Border, padding, border-radius</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Start Icon</span>
                <code className="ds-input-anatomy-diagram__label-code">Optional icon at the beginning</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Text/Placeholder</span>
                <code className="ds-input-anatomy-diagram__label-code">Input text or placeholder text</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">End Icon</span>
                <code className="ds-input-anatomy-diagram__label-code">Optional icon at the end</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Error Icon & Message</span>
                <code className="ds-input-anatomy-diagram__label-code">Optional error feedback below input</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Input fields come in different sizes and states to fit various use cases.
          </p>
          <div className="ds-input-variants-grid">
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Default</h6>
              <p className="ds-input-variant-card__desc">
                Standard state with default border and placeholder text.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" status="default" />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Active</h6>
              <p className="ds-input-variant-card__desc">
                Focused state with different border color indicating active input.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" status="active" />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">With Label</h6>
              <p className="ds-input-variant-card__desc">
                Input field with a label above it for better context.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview label="Label" placeholder="Placeholder" size="md" showLabel={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">With Icons</h6>
              <p className="ds-input-variant-card__desc">
                Input field with start and end icons for additional context or actions.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" showStartIcon={true} showEndIcon={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">With Error</h6>
              <p className="ds-input-variant-card__desc">
                Error state with icon and message indicating validation failure.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" showError={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">With Prefix</h6>
              <p className="ds-input-variant-card__desc">
                Input field with number prefix like country code for phone numbers.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" showNumberPrefix={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Rounded</h6>
              <p className="ds-input-variant-card__desc">
                Fully rounded (pill-shaped) input field for modern designs.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" rounded={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Icon Only</h6>
              <p className="ds-input-variant-card__desc">
                Circular/square button variant with just an icon, useful for search buttons.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview size="md" iconOnly={true} showPlaceholderIcon={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Disabled</h6>
              <p className="ds-input-variant-card__desc">
                Disabled state prevents interaction and applies muted styling.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" disabled={true} />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Small</h6>
              <p className="ds-input-variant-card__desc">
                Compact size (28px) for dense interfaces or when space is limited.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="sm" />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Medium</h6>
              <p className="ds-input-variant-card__desc">
                Default size (36px) suitable for most use cases.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="md" />
              </div>
            </div>
            <div className="ds-input-variant-card">
              <h6 className="ds-input-variant-card__title">Large</h6>
              <p className="ds-input-variant-card__desc">
                Larger size (48px) for improved visibility and accessibility.
              </p>
              <div className="ds-input-variant-card__preview">
                <InputPreview placeholder="Placeholder" size="lg" />
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
                <li>Use input fields for single-line text input.</li>
                <li>Provide clear, descriptive labels for each input field.</li>
                <li>Use placeholder text to guide users on what to enter.</li>
                <li>Show error messages immediately after validation fails.</li>
                <li>Use icons to provide additional context or visual cues.</li>
                <li>Ensure sufficient spacing between input fields and labels.</li>
                <li>Use appropriate input sizes based on context and importance.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use input fields for multi-line text (use textarea instead).</li>
                <li>Don't use placeholder text as the only label.</li>
                <li>Don't show error messages before the user has interacted with the field.</li>
                <li>Don't overload input fields with too many icons.</li>
                <li>Don't use input fields for navigation (use buttons or links instead).</li>
                <li>Don't disable input fields without explaining why.</li>
                <li>Don't use icon-only inputs without clear context or tooltips.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always associate input fields with labels using proper HTML structure or ARIA attributes.
            </li>
            <li>Ensure sufficient color contrast between text and background.</li>
            <li>Provide keyboard navigation support (Tab to navigate, Enter to submit).</li>
            <li>Use error messages that are clear and actionable.</li>
            <li>Ensure input fields are large enough to be easily clickable (minimum 28px height).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, error).</li>
            <li>Use appropriate input types (email, tel, number) for better mobile keyboard support.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Input field component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">InputFieldProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  size?: "sm" | "md" | "lg";
  status?: "default" | "active";
  showLabel?: boolean;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showPlaceholderIcon?: boolean;
  showError?: boolean;
  showNumberPrefix?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
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
                  {`interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  size?: "sm" | "md" | "lg";
  status?: "default" | "active";
  showLabel?: boolean;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showPlaceholderIcon?: boolean;
  showError?: boolean;
  showNumberPrefix?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}`}
                </SyntaxHighlighter>
              </div>
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
                    <code>"Label"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label displayed above the input field.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>placeholder</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Placeholder"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Placeholder text displayed when input is empty.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>value</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>""</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Current value of the input field.
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
                    Input field size: sm (28px), md (36px), lg (48px).
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>status</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "active"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Visual state of the input field: default or active (focused).
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showLabel</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display the label above the input field.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showStartIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display an icon at the start of the input field.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showEndIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display an icon at the end of the input field.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showPlaceholderIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display a placeholder icon when input is empty.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showError</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display an error icon and message below the input field.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showNumberPrefix</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display a number prefix (e.g., "+33") with border separator.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>rounded</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to use fully rounded (pill-shaped) corners.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>iconOnly</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display only an icon (circular/square button variant).
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
                    Whether the input field is disabled. Prevents interaction and applies disabled styling.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onChange</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>(value: string) =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when input value changes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common input field use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Input Field</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField />`);
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
                {`<InputField />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Input with Label</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  label="Email"
  placeholder="Enter your email"
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
                {`<InputField 
  label="Email"
  placeholder="Enter your email"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Input with Icons</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  placeholder="Search"
  showPlaceholderIcon
  showEndIcon
/>`);
                    setCopiedExample("icons");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "icons" ? (
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
                {`<InputField 
  placeholder="Search"
  showPlaceholderIcon
  showEndIcon
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Input with Error</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  label="Email"
  placeholder="Enter your email"
  showError
/>`);
                    setCopiedExample("error");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "error" ? (
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
                {`<InputField 
  label="Email"
  placeholder="Enter your email"
  showError
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Input with Number Prefix</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  label="Phone"
  placeholder="123456789"
  showNumberPrefix
/>`);
                    setCopiedExample("prefix");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "prefix" ? (
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
                {`<InputField 
  label="Phone"
  placeholder="123456789"
  showNumberPrefix
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Rounded Input</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  placeholder="Search"
  rounded
/>`);
                    setCopiedExample("rounded");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "rounded" ? (
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
                {`<InputField 
  placeholder="Search"
  rounded
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Icon Only Input</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  iconOnly
  showPlaceholderIcon
/>`);
                    setCopiedExample("iconOnly");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "iconOnly" ? (
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
                {`<InputField 
  iconOnly
  showPlaceholderIcon
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled Input</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-input-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<InputField 
  label="Email"
  placeholder="Enter your email"
  disabled
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
                {`<InputField 
  label="Email"
  placeholder="Enter your email"
  disabled
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

