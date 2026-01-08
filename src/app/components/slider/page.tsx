"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { SliderPreview } from "@/components/SliderPreview";
import { SliderControls } from "@/components/SliderControls";
import { Slider, type SliderStatus } from "beacon-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

interface SliderConfig {
  value: number;
  rangeValue: [number, number];
  range: boolean;
  status: SliderStatus;
  showLabel: boolean;
  showTooltip: boolean;
  showSteps: boolean;
}

const STATUS_LABELS: Record<SliderStatus, string> = {
  default: "default",
  hover: "hover",
  active: "active",
  disabled: "disabled",
};

function generateSliderCode(config: SliderConfig): string {
  const props: string[] = [];

  if (config.range) {
    props.push(`range`);
    props.push(`rangeValue={[${config.rangeValue[0]}, ${config.rangeValue[1]}]}`);
  } else {
    if (config.value !== 60) {
      props.push(`value={${config.value}}`);
    }
  }

  if (config.status !== "default") {
    props.push(`status="${STATUS_LABELS[config.status]}"`);
  }

  if (!config.showLabel) {
    props.push(`showLabel={false}`);
  }

  if (config.showTooltip) {
    props.push(`showTooltip`);
  }

  if (!config.showSteps) {
    props.push(`showSteps={false}`);
  }

  if (props.length === 0) {
    return `<Slider />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Slider${propsFormatted}
/>`;
}

export default function SliderPage() {
  const { theme, hue } = useTheme();
  const [config, setConfig] = useState<SliderConfig>({
    value: 60,
    rangeValue: [20, 80],
    range: false,
    status: "default",
    showLabel: true,
    showTooltip: false,
    showSteps: true,
  });

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "playground", label: "Interactive Playground" },
      { id: "anatomy", label: "Anatomy" },
      { id: "guidelines", label: "Usage Guidelines" },
      { id: "api", label: "API Reference" },
      { id: "examples", label: "Usage Examples" },
    ];
  }, []);

  const updateConfig = (updates: Partial<SliderConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/slider">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Slider</h3>
          <p className="ds-content__subtitle">
            Sliders allow users to select a value or range of values from a continuous or discrete set. Use sliders for volume controls, price ranges, and other numeric inputs where visual feedback is helpful.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Sliders are interactive controls that let users select a value or range by dragging a handle along a track. They provide immediate visual feedback and are ideal for settings that don't require precise numeric input.
          </p>
          <p className="ds-content__text">
            All slider styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the slider and see how it looks in real-time.
          </p>
          <div className="ds-input-playground">
            <SliderControls
              value={config.value}
              rangeValue={config.rangeValue}
              range={config.range}
              status={config.status}
              showLabel={config.showLabel}
              showTooltip={config.showTooltip}
              showSteps={config.showSteps}
              onValueChange={(value) => updateConfig({ value })}
              onRangeValueChange={(rangeValue) => updateConfig({ rangeValue })}
              onRangeChange={(range) => updateConfig({ range })}
              onStatusChange={(status) => updateConfig({ status })}
              onShowLabelChange={(showLabel) => updateConfig({ showLabel })}
              onShowTooltipChange={(showTooltip) => {
                updateConfig({ showTooltip });
                if (showTooltip && config.status !== "active") {
                  updateConfig({ status: "active" });
                }
              }}
              onShowStepsChange={(showSteps) => updateConfig({ showSteps })}
            />
            <div className="ds-input-playground-divider" />
            <div className="ds-input-preview-section">
              <div className="ds-input-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "var(--spacing-500)" }}>
                <SliderPreview
                  value={config.value}
                  rangeValue={config.rangeValue}
                  range={config.range}
                  status={config.status}
                  showLabel={config.showLabel}
                  showTooltip={config.showTooltip}
                  showSteps={config.showSteps}
                  theme={theme}
                  hue={hue}
                  width="320px"
                />
              </div>
              <div className="ds-input-preview-code">
                <CodeCopyButton code={generateSliderCode(config)} />
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
                  {generateSliderCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A slider consists of several parts that work together to create an interactive control.
          </p>
          <div className="ds-input-anatomy-diagram">
            <div className="ds-input-anatomy-diagram__input">
              <div className="ds-input-anatomy-diagram__container">
                <div className="ds-input-anatomy-diagram__label">Slider</div>
                <div style={{ position: "relative", width: "100%", paddingTop: "2px", paddingBottom: "2px", height: "8px" }}>
                  <div style={{ position: "relative", width: "100%", height: "8px", backgroundColor: "var(--bg-page-tertiary)", borderRadius: "var(--corner-radius-full)" }}>
                    <div style={{ position: "absolute", left: "0%", width: "60%", height: "100%", backgroundColor: "var(--bg-primary)", borderRadius: "var(--corner-radius-full)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "4px", paddingRight: "4px", pointerEvents: "none" }}>
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} style={{ width: "4px", height: "4px", borderRadius: "var(--corner-radius-full)", backgroundColor: "var(--border-strong-200)" }} />
                      ))}
                    </div>
                    <div style={{ position: "absolute", left: "60%", bottom: "-4px", width: "16px", height: "16px", borderRadius: "var(--corner-radius-full)", backgroundColor: "var(--fg-on-action)", border: "2px solid var(--bg-primary)", boxShadow: "var(--shadow-subtle)", transform: "translateX(-50%)" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-input-anatomy-diagram__labels">
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Label</span>
                <code className="ds-input-anatomy-diagram__label-code">Optional text label above slider</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Track</span>
                <code className="ds-input-anatomy-diagram__label-code">The horizontal line representing the range</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Selection</span>
                <code className="ds-input-anatomy-diagram__label-code">The filled portion indicating selected value(s)</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Thumb</span>
                <code className="ds-input-anatomy-diagram__label-code">The draggable handle for selecting values</code>
              </div>
              <div className="ds-input-anatomy-diagram__label-item">
                <span className="ds-input-anatomy-diagram__label-name">Step Markers</span>
                <code className="ds-input-anatomy-diagram__label-code">Optional dots indicating discrete steps</code>
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
                <li>Use sliders for approximate values where precision isn't critical.</li>
                <li>Provide clear labels indicating what the slider controls.</li>
                <li>Use step markers when discrete values are meaningful.</li>
                <li>Show tooltips when users need to see exact values.</li>
                <li>Use range sliders for selecting a span of values.</li>
                <li>Ensure sliders are large enough to be easily manipulated.</li>
                <li>Provide visual feedback for all interactive states.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use sliders for precise numeric input (use input fields instead).</li>
                <li>Don't use sliders with too many steps (more than 20 becomes unwieldy).</li>
                <li>Don't hide important information in tooltips without alternatives.</li>
                <li>Don't use sliders for binary choices (use switches or checkboxes).</li>
                <li>Don't make sliders too small to interact with easily.</li>
                <li>Don't disable sliders without explaining why.</li>
                <li>Don't use sliders for navigation (use buttons or links instead).</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always associate sliders with labels using proper HTML structure or ARIA attributes.
            </li>
            <li>Ensure sufficient color contrast between track, selection, and thumb.</li>
            <li>Provide keyboard navigation support (Arrow keys to adjust, Home/End for min/max).</li>
            <li>Use ARIA labels to describe the slider's purpose and current value.</li>
            <li>Ensure sliders are large enough to be easily clickable (minimum 16px thumb size).</li>
            <li>Provide clear visual feedback for all interactive states (hover, focus, active).</li>
            <li>Support screen readers with proper role and value announcements.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Slider component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">SliderProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  rangeValue?: [number, number];
  onChange?: (value: number | [number, number]) => void;
  showTooltip?: boolean;
  showSteps?: boolean;
  stepCount?: number;
  showLabel?: boolean;
  label?: string;
  status?: "default" | "hover" | "active" | "disabled";
  disabled?: boolean;
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
                  {`interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  rangeValue?: [number, number];
  onChange?: (value: number | [number, number]) => void;
  showTooltip?: boolean;
  showSteps?: boolean;
  stepCount?: number;
  showLabel?: boolean;
  label?: string;
  status?: "default" | "hover" | "active" | "disabled";
  disabled?: boolean;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>value</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>number</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>60</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Current value for single-value slider.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>rangeValue</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>[number, number]</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>[20, 80]</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Current range values for range slider.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>range</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display as a range slider with two thumbs.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>min</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>number</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>0</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Minimum value of the slider.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>max</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>number</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>100</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Maximum value of the slider.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>step</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>number</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>1</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Step increment for slider values.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onChange</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>(value: number | [number, number]) =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when slider value changes.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showTooltip</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display a tooltip showing the current value.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showSteps</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to display step markers along the track.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>stepCount</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>number</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>10</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Number of step markers to display when showSteps is true.
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
                    Whether to display the label above the slider.
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
                    <code>"Slider"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label displayed above the slider.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>status</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "hover" | "active" | "disabled"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Visual state of the slider: default, hover, active (focused/dragging), or disabled.
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
                    Whether the slider is disabled and non-interactive.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common slider use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Slider</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Slider value={60} showSteps={false} showLabel={false} style={{ width: "320px" }} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
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
                      {`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Slider with Steps</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Slider value={60} showSteps showLabel={false} style={{ width: "320px" }} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
  showSteps
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
                      {`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
  showSteps
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Slider with Tooltip</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Slider value={60} showTooltip status="active" showSteps={false} showLabel={false} style={{ width: "320px" }} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
  showTooltip
  status="active"
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
                      {`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
  showTooltip
  status="active"
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Range Slider</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Slider range rangeValue={[20, 80]} showSteps={false} showLabel={false} style={{ width: "320px" }} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Slider } from 'beacon-ui';

<Slider 
  range
  rangeValue={[20, 80]}
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
                      {`import { Slider } from 'beacon-ui';

<Slider 
  range
  rangeValue={[20, 80]}
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Range Slider with Tooltips</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Slider range rangeValue={[20, 80]} showTooltip status="active" showSteps={false} showLabel={false} style={{ width: "320px" }} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Slider } from 'beacon-ui';

<Slider 
  range
  rangeValue={[20, 80]}
  showTooltip
  status="active"
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
                      {`import { Slider } from 'beacon-ui';

<Slider 
  range
  rangeValue={[20, 80]}
  showTooltip
  status="active"
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Disabled Slider</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Slider value={60} status="disabled" showSteps={false} showLabel={false} style={{ width: "320px" }} />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
  status="disabled"
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
                      {`import { Slider } from 'beacon-ui';

<Slider 
  value={60}
  status="disabled"
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
