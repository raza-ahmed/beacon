"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { SelectableInputPreview } from "@/components/SelectableInputPreview";
import { SelectableInputControls } from "@/components/SelectableInputControls";
import { GridUILayoutIcon } from "@/components/icons";
import { SelectableInput, type CornerRadiusStep, type SelectableInputSize } from "beacon-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

interface SelectableInputConfig {
  label: string;
  size: SelectableInputSize;
  selected: boolean;
  disabled: boolean;
  cornerRadius: CornerRadiusStep;
  fullWidth: boolean;
}

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

const SIZE_LABELS: Record<SelectableInputSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

function generateSelectableInputCode(config: SelectableInputConfig): string {
  const props: string[] = [];

  if (config.label !== "Option") {
    props.push(`label="${config.label}"`);
  }

  if (config.size !== "md") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
  }

  if (config.selected) {
    props.push(`selected`);
  }

  if (config.disabled) {
    props.push(`disabled`);
  }

  if (config.cornerRadius !== 2) {
    if (config.cornerRadius === 5) {
      props.push(`cornerRadius={5}`);
    } else {
      props.push(`cornerRadius={${config.cornerRadius}}`);
    }
  }

  if (config.fullWidth) {
    props.push(`fullWidth`);
  }

  if (props.length === 0) {
    return `<SelectableInput />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<SelectableInput${propsFormatted}
/>`;
}

export default function SelectableInputPage() {
  const { theme, hue } = useTheme();
  const [config, setConfig] = useState<SelectableInputConfig>({
    label: "Option",
    size: "md",
    selected: false,
    disabled: false,
    cornerRadius: 2,
    fullWidth: false,
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

  const updateConfig = (updates: Partial<SelectableInputConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/selectable-input">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Selectable Input</h3>
          <p className="ds-content__subtitle">
            Selectable inputs allow users to choose from a set of options. They display an icon above text and provide clear visual feedback for selected and unselected states.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Selectable inputs are interactive components that allow users to select from a set of options. They feature an icon above text and provide clear visual feedback through background color and border changes when selected or unselected.
          </p>
          <p className="ds-content__text">
            All selectable input styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the selectable input and see how it looks in real-time.
          </p>
          <div className="ds-input-playground">
            <SelectableInputControls
              label={config.label}
              size={config.size}
              selected={config.selected}
              disabled={config.disabled}
              cornerRadius={config.cornerRadius}
              fullWidth={config.fullWidth}
              onLabelChange={(label) => updateConfig({ label })}
              onSizeChange={(size) => updateConfig({ size })}
              onSelectedChange={(selected) => updateConfig({ selected })}
              onDisabledChange={(disabled) => updateConfig({ disabled })}
              onCornerRadiusChange={(cornerRadius) => updateConfig({ cornerRadius })}
              onFullWidthChange={(fullWidth) => updateConfig({ fullWidth })}
            />
            <div className="ds-input-playground-divider" />
            <div className="ds-input-preview-section">
              <div className="ds-input-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SelectableInputPreview
                  label={config.label}
                  size={config.size}
                  selected={config.selected}
                  disabled={config.disabled}
                  cornerRadius={config.cornerRadius}
                  fullWidth={config.fullWidth}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-input-preview-code">
                <CodeCopyButton code={generateSelectableInputCode(config)} />
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
                  {generateSelectableInputCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A selectable input consists of several parts that work together to create a cohesive selection control.
          </p>
          <div style={{ display: "flex", gap: "var(--spacing-400)", marginTop: "var(--spacing-400)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-200)", padding: "var(--spacing-300)", border: "var(--border-width-25) solid var(--border-strong-200)", borderRadius: "var(--corner-radius-200)", backgroundColor: "var(--bg-page-primary)" }}>
                <div style={{ color: "var(--fg-neutral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GridUILayoutIcon size={20} />
                </div>
                <div style={{ fontSize: "var(--fonts-body-small-text-size)", color: "var(--fg-neutral)", textAlign: "center" }}>Option</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-200)" }}>
                <div style={{ padding: "var(--spacing-200)", border: "var(--border-width-25) solid var(--border-strong-100)", borderRadius: "var(--corner-radius-100)", backgroundColor: "var(--bg-page-secondary)" }}>
                  <div style={{ fontSize: "var(--fonts-body-small-text-size)", fontWeight: 500, marginBottom: "var(--spacing-100)", color: "var(--fg-neutral)" }}>Icon</div>
                  <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>Visual representation above text</code>
                </div>
                <div style={{ padding: "var(--spacing-200)", border: "var(--border-width-25) solid var(--border-strong-100)", borderRadius: "var(--corner-radius-100)", backgroundColor: "var(--bg-page-secondary)" }}>
                  <div style={{ fontSize: "var(--fonts-body-small-text-size)", fontWeight: 500, marginBottom: "var(--spacing-100)", color: "var(--fg-neutral)" }}>Label</div>
                  <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>Text description below icon</code>
                </div>
                <div style={{ padding: "var(--spacing-200)", border: "var(--border-width-25) solid var(--border-strong-100)", borderRadius: "var(--corner-radius-100)", backgroundColor: "var(--bg-page-secondary)" }}>
                  <div style={{ fontSize: "var(--fonts-body-small-text-size)", fontWeight: 500, marginBottom: "var(--spacing-100)", color: "var(--fg-neutral)" }}>Container</div>
                  <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>Border, padding, border-radius, background</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Selectable inputs support different sizes and states to accommodate various use cases.
          </p>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)", fontSize: "var(--fonts-body-regular-text-size)" }}>
            Sizes
          </h6>
          <div style={{ display: "flex", gap: "var(--spacing-300)", marginTop: "var(--spacing-300)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Small" size="sm" />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>sm</code>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Medium" size="md" />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>md</code>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Large" size="lg" />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>lg</code>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Extra Large" size="xl" />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>xl</code>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)", fontSize: "var(--fonts-body-regular-text-size)" }}>
            States
          </h6>
          <div style={{ display: "flex", gap: "var(--spacing-300)", marginTop: "var(--spacing-300)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Unselected" />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>Default</code>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Selected" selected />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>Selected</code>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", alignItems: "center" }}>
              <SelectableInput label="Disabled" disabled />
              <code style={{ fontSize: "var(--fonts-body-extra-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>Disabled</code>
            </div>
          </div>
        </section>

        <section id="guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidelines</h6>
          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use selectable inputs for choosing from a set of options.</li>
                <li>Provide clear, descriptive labels for each option.</li>
                <li>Use meaningful icons that represent the option.</li>
                <li>Group related selectable inputs together.</li>
                <li>Provide clear visual feedback for selected state.</li>
                <li>Use appropriate sizes based on context and importance.</li>
                <li>Ensure sufficient spacing between selectable inputs.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use selectable inputs for navigation (use buttons or links instead).</li>
                <li>Don't use selectable inputs for text input (use input fields instead).</li>
                <li>Don't use too many selectable inputs in a single view.</li>
                <li>Don't disable selectable inputs without explaining why.</li>
                <li>Don't use unclear or ambiguous icons.</li>
                <li>Don't use selectable inputs for destructive actions.</li>
                <li>Don't make labels too long or wrap awkwardly.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always provide clear labels for selectable inputs using the label prop.
            </li>
            <li>Ensure sufficient color contrast between text and background in both selected and unselected states.</li>
            <li>Provide keyboard navigation support (Tab to navigate, Space/Enter to select).</li>
            <li>Use aria-pressed attribute to indicate selected state.</li>
            <li>Ensure selectable inputs are large enough to be easily clickable (minimum 44x44px touch target).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, selected).</li>
            <li>Use disabled state appropriately and provide alternative ways to access disabled options if needed.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Selectable input component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">SelectableInputProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface SelectableInputProps {
  label?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  selected?: boolean;
  disabled?: boolean;
  cornerRadius?: CornerRadiusStep;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
                  {`interface SelectableInputProps {
  label?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  selected?: boolean;
  disabled?: boolean;
  cornerRadius?: CornerRadiusStep;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
                    <code>"Option"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label displayed below the icon.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>icon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>React.ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>GridUILayoutIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Optional icon displayed above the label. Defaults to GridUILayoutIcon if not provided.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>size</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"sm" | "md" | "lg" | "xl"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"md"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Selectable input size: sm (80x80px), md (100x100px), lg (120x120px), xl (140x140px).
                  </div>
                </div>
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
                    Whether the selectable input is in the selected state. Changes background color and border.
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
                    Whether the selectable input is disabled. Prevents interaction and reduces opacity.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>cornerRadius</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>CornerRadiusStep</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>2</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Border radius step: 0 (none), 1 (extra small), 2 (small), 3 (medium), 4 (large), 5 (extra large/full).
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>fullWidth</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether the selectable input should take full width of its container.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onClick</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>(e: React.MouseEvent&lt;HTMLButtonElement&gt;) =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when selectable input is clicked.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common selectable input use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Selectable Input</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <SelectableInput label="Option" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { SelectableInput } from 'beacon-ui';

<SelectableInput 
  label="Option"
/>`}
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
                      {`import { SelectableInput } from 'beacon-ui';

<SelectableInput 
  label="Option"
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Selected State</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <SelectableInput label="Option" selected />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { SelectableInput } from 'beacon-ui';

<SelectableInput 
  label="Option"
  selected
/>`}
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
                      {`import { SelectableInput } from 'beacon-ui';

<SelectableInput 
  label="Option"
  selected
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">With Custom Icon</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <SelectableInput label="Option" icon={<GridUILayoutIcon size="sm" />} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { SelectableInput } from 'beacon-ui';
import { GridUILayoutIcon } from 'beacon-icons';

<SelectableInput 
  label="Option"
  icon={<GridUILayoutIcon size="sm" />}
/>`}
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
                      {`import { SelectableInput } from 'beacon-ui';
import { GridUILayoutIcon } from 'beacon-icons';

<SelectableInput 
  label="Option"
  icon={<GridUILayoutIcon size="sm" />}
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Multiple Options</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ display: "flex", gap: "var(--spacing-200)", flexWrap: "wrap" }}>
                      <SelectableInput label="Option 1" />
                      <SelectableInput label="Option 2" selected />
                      <SelectableInput label="Option 3" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { SelectableInput } from 'beacon-ui';

<div style={{ display: 'flex', gap: 'var(--spacing-200)' }}>
  <SelectableInput label="Option 1" />
  <SelectableInput label="Option 2" selected />
  <SelectableInput label="Option 3" />
</div>`}
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
                      {`import { SelectableInput } from 'beacon-ui';

<div style={{ display: 'flex', gap: 'var(--spacing-200)' }}>
  <SelectableInput label="Option 1" />
  <SelectableInput label="Option 2" selected />
  <SelectableInput label="Option 3" />
</div>`}
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
