"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { Select, type SelectOption, type CornerRadiusStep, type SelectStatus } from "beacon-ui";
import { UserPersonIcon, HomeIcon } from "@/components/icons/index";
import { SelectControls } from "@/components/SelectControls";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

type SelectSize = "sm" | "md" | "lg" | "xl";

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: "1", label: "Option #1", icon: <HomeIcon size="xs" /> },
  { value: "2", label: "Option #2", icon: <HomeIcon size="xs" /> },
  { value: "3", label: "Option #3", icon: <HomeIcon size="xs" /> },
];

interface SelectConfig {
  label: string;
  selectedValue: string;
  size: SelectSize;
  status: SelectStatus;
  showLabel: boolean;
  showStartIcon: boolean;
  showEndIcon: boolean;
  cornerRadius: CornerRadiusStep;
  options: SelectOption[];
}

const CORNER_RADIUS_LABELS: Record<CornerRadiusStep, string> = {
  0: "None",
  1: "Extra Small",
  2: "Small",
  3: "Medium",
  4: "Large",
  5: "Extra Large",
};

const SIZE_LABELS: Record<SelectSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

const STATUS_LABELS: Record<SelectStatus, string> = {
  default: "default",
  hover: "hover",
  active: "active",
  disabled: "disabled",
};

function generateSelectCode(config: SelectConfig): string {
  const props: string[] = [];

  if (config.label !== "Select Label") {
    props.push(`label="${config.label}"`);
  }

  if (config.selectedValue !== "") {
    props.push(`selectedValue="${config.selectedValue}"`);
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

  if (!config.showStartIcon) {
    props.push(`showStartIcon={false}`);
  }

  if (!config.showEndIcon) {
    props.push(`showEndIcon={false}`);
  }

  if (config.showStartIcon) {
    props.push(`startIcon={<UserPersonIcon size="xs" />}`);
  }

  if (config.cornerRadius !== 1) {
    props.push(`cornerRadius={${config.cornerRadius}}`);
  }

  if (props.length === 0) {
    return `<Select options={options} />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Select${propsFormatted}
  options={options}
/>`;
}

export default function SelectPage() {
  const { theme } = useTheme();
  const [config, setConfig] = useState<SelectConfig>({
    label: "Select Label",
    selectedValue: "2",
    size: "md",
    status: "default",
    showLabel: true,
    showStartIcon: true,
    showEndIcon: true,
    cornerRadius: 1,
    options: DEFAULT_OPTIONS,
  });

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "playground", label: "Interactive Playground" },
      { id: "guidelines", label: "Usage Guidelines" },
      { id: "api", label: "API Reference" },
      { id: "examples", label: "Usage Examples" },
    ];
  }, []);

  const updateConfig = (updates: Partial<SelectConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/select">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Select Field</h3>
          <p className="ds-content__subtitle">
            Select fields allow users to choose from a list of options. Use select fields when you need to present multiple choices in a compact format.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Select fields are form controls that allow users to choose from a dropdown list of options. They provide a compact way to present multiple choices and support various sizes and states.
          </p>
          <p className="ds-content__text">
            All select field styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the select field and see how it looks in real-time.
          </p>
          <div className="ds-input-playground">
            <SelectControls
              label={config.label}
              selectedValue={config.selectedValue}
              size={config.size}
              status={config.status}
              showLabel={config.showLabel}
              showStartIcon={config.showStartIcon}
              showEndIcon={config.showEndIcon}
              cornerRadius={config.cornerRadius}
              options={config.options}
              onLabelChange={(label) => updateConfig({ label })}
              onSelectedValueChange={(value) => updateConfig({ selectedValue: value })}
              onSizeChange={(size) => updateConfig({ size })}
              onStatusChange={(status) => updateConfig({ status })}
              onShowLabelChange={(show) => updateConfig({ showLabel: show })}
              onShowStartIconChange={(show) => updateConfig({ showStartIcon: show })}
              onShowEndIconChange={(show) => updateConfig({ showEndIcon: show })}
              onCornerRadiusChange={(radius) => updateConfig({ cornerRadius: radius })}
            />
            <div className="ds-input-playground-divider" />
            <div className="ds-input-preview-section">
              <div className="ds-input-preview">
                <Select
                  label={config.label}
                  options={config.options}
                  selectedValue={config.selectedValue}
                  onSelect={(value) => updateConfig({ selectedValue: value })}
                  size={config.size}
                  status={config.status}
                  showLabel={config.showLabel}
                  showStartIcon={config.showStartIcon}
                  showEndIcon={config.showEndIcon}
                  startIcon={config.showStartIcon ? <UserPersonIcon size="xs" /> : undefined}
                  cornerRadius={config.cornerRadius}
                  fullWidth={false}
                  style={{ width: "232px" }}
                />
              </div>
              <div className="ds-input-preview-code">
                <CodeCopyButton code={generateSelectCode(config)} />
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
                  {generateSelectCode(config)}
                </SyntaxHighlighter>
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
                <li>Use select fields when you have 5 or more options.</li>
                <li>Provide clear, descriptive labels for each select field.</li>
                <li>Use placeholder text to guide users on what to select.</li>
                <li>Group related options together when possible.</li>
                <li>Use icons to provide additional context for options.</li>
                <li>Ensure sufficient spacing between select fields and labels.</li>
                <li>Use appropriate select sizes based on context and importance.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use select fields for fewer than 3 options (use radio buttons instead).</li>
                <li>Don't use placeholder text as the only label.</li>
                <li>Don't overload select fields with too many options (consider search/filter).</li>
                <li>Don't use select fields for navigation (use buttons or links instead).</li>
                <li>Don't disable select fields without explaining why.</li>
                <li>Don't use overly long option labels.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Select field component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">SelectProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface SelectProps {
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "default" | "hover" | "active";
  showLabel?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholder?: string;
  selectedValue?: string;
  options?: SelectOption[];
  onSelect?: (value: string) => void;
  fullWidth?: boolean;
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
                  {`interface SelectProps {
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "default" | "hover" | "active";
  showLabel?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholder?: string;
  selectedValue?: string;
  options?: SelectOption[];
  onSelect?: (value: string) => void;
  fullWidth?: boolean;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common select field use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Select Field</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Select
                        options={DEFAULT_OPTIONS}
                        selectedValue={config.selectedValue}
                        onSelect={(value) => updateConfig({ selectedValue: value })}
                        fullWidth={false}
                        style={{ width: "232px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Select } from 'beacon-ui';

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

<Select 
  options={options}
  selectedValue={selectedValue}
  onSelect={setSelectedValue}
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
                      {`import { Select } from 'beacon-ui';

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

<Select 
  options={options}
  selectedValue={selectedValue}
  onSelect={setSelectedValue}
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Select with Label and Icon</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Select
                        label="Choose an option"
                        options={DEFAULT_OPTIONS}
                        selectedValue={config.selectedValue}
                        onSelect={(value) => updateConfig({ selectedValue: value })}
                        startIcon={<UserPersonIcon size="xs" />}
                        fullWidth={false}
                        style={{ width: "232px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Select } from 'beacon-ui';
import { UserPersonIcon } from 'beacon-ui/icons';

<Select 
  label="Choose an option"
  options={options}
  selectedValue={selectedValue}
  onSelect={setSelectedValue}
  startIcon={<UserPersonIcon size="xs" />}
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
                      {`import { Select } from 'beacon-ui';
import { UserPersonIcon } from 'beacon-ui/icons';

<Select 
  label="Choose an option"
  options={options}
  selectedValue={selectedValue}
  onSelect={setSelectedValue}
  startIcon={<UserPersonIcon size="xs" />}
/>`}
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

