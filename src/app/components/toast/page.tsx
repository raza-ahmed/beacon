"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { ToastPreview } from "@/components/ToastPreview";
import { ToastControls } from "@/components/ToastControls";
import { Toast, type ToastVariant } from "beacon-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

interface ToastConfig {
  variant: ToastVariant;
  message: string;
  actionLabel: string;
  showAction: boolean;
  dismissible: boolean;
  showIcon: boolean;
  fullWidth: boolean;
  showBorder: boolean;
}

const VARIANT_LABELS: Record<ToastVariant, string> = {
  default: "default",
  success: "success",
  error: "error",
  warning: "warning",
};

function generateToastCode(config: ToastConfig): string {
  const props: string[] = [];

  if (config.variant !== "default") {
    props.push(`variant="${VARIANT_LABELS[config.variant]}"`);
  }

  if (config.message !== "Toast Info") {
    props.push(`message="${config.message}"`);
  }

  if (config.actionLabel !== "Undo") {
    props.push(`actionLabel="${config.actionLabel}"`);
  }

  if (!config.showAction) {
    props.push(`showAction={false}`);
  }

  if (!config.dismissible) {
    props.push(`dismissible={false}`);
  }

  if (!config.showIcon) {
    props.push(`showIcon={false}`);
  }

  if (config.fullWidth) {
    props.push(`fullWidth`);
  }

  if (config.showBorder) {
    props.push(`showBorder`);
  }

  if (props.length === 0) {
    return `<Toast />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Toast${propsFormatted}
/>`;
}

export default function ToastPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<ToastConfig>({
    variant: "default",
    message: "Toast Info",
    actionLabel: "Undo",
    showAction: true,
    dismissible: true,
    showIcon: true,
    fullWidth: false,
    showBorder: false,
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

  const updateConfig = (updates: Partial<ToastConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/toast">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Toast</h3>
          <p className="ds-content__subtitle">
            Toast notifications provide brief, non-intrusive feedback about user actions. Use toasts to display success messages, errors, warnings, or general information.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Toasts are temporary notification messages that appear to inform users about the result of an action or to provide important information. They typically appear at the edge of the screen and automatically dismiss after a few seconds, though users can also manually dismiss them.
          </p>
          <p className="ds-content__text">
            All toast styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the toast and see how it looks in real-time. Toggle between themes and hues to see how toasts adapt to different contexts.
          </p>
          <div className="ds-toast-playground">
            <ToastControls
              variant={config.variant}
              message={config.message}
              actionLabel={config.actionLabel}
              showAction={config.showAction}
              dismissible={config.dismissible}
              showIcon={config.showIcon}
              fullWidth={config.fullWidth}
              showBorder={config.showBorder}
              theme={theme}
              hue={hue}
              onVariantChange={(variant) => updateConfig({ variant })}
              onMessageChange={(message) => updateConfig({ message })}
              onActionLabelChange={(actionLabel) => updateConfig({ actionLabel })}
              onShowActionChange={(showAction) => updateConfig({ showAction })}
              onDismissibleChange={(dismissible) => updateConfig({ dismissible })}
              onShowIconChange={(showIcon) => updateConfig({ showIcon })}
              onFullWidthChange={(fullWidth) => updateConfig({ fullWidth })}
              onShowBorderChange={(showBorder) => updateConfig({ showBorder })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-toast-playground-divider" />
            <div className="ds-toast-preview-section">
              <div className="ds-toast-preview">
                <ToastPreview
                  variant={config.variant}
                  message={config.message}
                  actionLabel={config.actionLabel}
                  showAction={config.showAction}
                  dismissible={config.dismissible}
                  showIcon={config.showIcon}
                  fullWidth={config.fullWidth}
                  showBorder={config.showBorder}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-toast-preview-code">
                <CodeCopyButton code={generateToastCode(config)} />
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
                  {generateToastCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A toast consists of several parts that work together to create a cohesive notification element.
          </p>
          <div className="ds-toast-anatomy-diagram">
            <div className="ds-toast-anatomy-diagram__toast">
              <div className="ds-toast-anatomy-diagram__container">
                <div className="ds-toast-anatomy-diagram__icon" />
                <div className="ds-toast-anatomy-diagram__message">Toast Info</div>
                <div className="ds-toast-anatomy-diagram__action">Undo</div>
                <div className="ds-toast-anatomy-diagram__close" />
              </div>
            </div>
            <div className="ds-toast-anatomy-diagram__labels">
              <div className="ds-toast-anatomy-diagram__label-item">
                <span className="ds-toast-anatomy-diagram__label-name">Container</span>
                <code className="ds-toast-anatomy-diagram__label-code">padding, border-radius, shadow</code>
              </div>
              <div className="ds-toast-anatomy-diagram__label-item">
                <span className="ds-toast-anatomy-diagram__label-name">Icon</span>
                <code className="ds-toast-anatomy-diagram__label-code">Optional leading icon (24px)</code>
              </div>
              <div className="ds-toast-anatomy-diagram__label-item">
                <span className="ds-toast-anatomy-diagram__label-name">Message</span>
                <code className="ds-toast-anatomy-diagram__label-code">--body-regular-text-size</code>
              </div>
              <div className="ds-toast-anatomy-diagram__label-item">
                <span className="ds-toast-anatomy-diagram__label-name">Action Button</span>
                <code className="ds-toast-anatomy-diagram__label-code">Optional action (e.g., "Undo")</code>
              </div>
              <div className="ds-toast-anatomy-diagram__label-item">
                <span className="ds-toast-anatomy-diagram__label-name">Close Button</span>
                <code className="ds-toast-anatomy-diagram__label-code">Optional dismiss control (24px)</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Toasts come in different variants to communicate different types of information.
          </p>
          <div className="ds-toast-variants-grid">
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Default</h6>
              <p className="ds-toast-variant-card__desc">
                General information notifications using page-secondary background and neutral foreground.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="default" />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Success</h6>
              <p className="ds-toast-variant-card__desc">
                Success notifications for positive actions and confirmations.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="success" />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Error</h6>
              <p className="ds-toast-variant-card__desc">
                Error notifications for failures and critical issues.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="error" />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Warning</h6>
              <p className="ds-toast-variant-card__desc">
                Warning notifications for cautionary states and important alerts.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="warning" />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Without Action</h6>
              <p className="ds-toast-variant-card__desc">
                Toasts can be displayed without an action button for simple notifications.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="default" showAction={false} />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Without Icon</h6>
              <p className="ds-toast-variant-card__desc">
                Toasts can be displayed without a leading icon for a cleaner look.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="default" showIcon={false} />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Non-dismissible</h6>
              <p className="ds-toast-variant-card__desc">
                Toasts can be configured to not show a close button, requiring automatic dismissal.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="default" dismissible={false} />
              </div>
            </div>
            <div className="ds-toast-variant-card">
              <h6 className="ds-toast-variant-card__title">Full Width</h6>
              <p className="ds-toast-variant-card__desc">
                Toasts can stretch to fill the full width of their container.
              </p>
              <div className="ds-toast-variant-card__preview">
                <ToastPreview variant="default" fullWidth={true} />
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
                <li>Use toasts for non-critical, temporary notifications.</li>
                <li>Keep messages concise and actionable.</li>
                <li>Use appropriate variants based on message type (success, error, warning).</li>
                <li>Provide action buttons for reversible actions (e.g., "Undo").</li>
                <li>Allow users to dismiss toasts manually.</li>
                <li>Position toasts consistently (typically top-right or bottom-right).</li>
                <li>Limit the number of visible toasts to avoid overwhelming users.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use toasts for critical errors that require immediate attention.</li>
                <li>Don't use toasts for information that users need to reference later.</li>
                <li>Don't stack too many toasts at once.</li>
                <li>Don't use vague or unclear messages.</li>
                <li>Don't make toasts too large or intrusive.</li>
                <li>Don't use toasts for primary navigation or actions.</li>
                <li>Don't auto-dismiss error toasts too quickly.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Toasts should use appropriate ARIA roles (<code>role="status"</code> for informational, <code>role="alert"</code> for errors).
            </li>
            <li>Use <code>aria-live</code> regions to announce toast messages to screen readers.</li>
            <li>Ensure sufficient color contrast for all toast variants.</li>
            <li>Provide keyboard-accessible dismiss controls.</li>
            <li>Allow sufficient time for users to read and interact with toasts.</li>
            <li>Provide clear focus management when toasts appear.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Toast component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">ToastProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface ToastProps {
  variant?: "default" | "success" | "error" | "warning";
  message?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  leadingIcon?: React.ReactNode;
  showIcon?: boolean;
  closeIcon?: React.ReactNode;
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
                  {`interface ToastProps {
  variant?: "default" | "success" | "error" | "warning";
  message?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  leadingIcon?: React.ReactNode;
  showIcon?: boolean;
  closeIcon?: React.ReactNode;
  fullWidth?: boolean;
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
                    <code>"default" | "success" | "error" | "warning"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Visual tone of the toast
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>message</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>React.ReactNode</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Toast Info"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Primary message content
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>actionLabel</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Undo"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Optional action label (e.g., "Undo")
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showAction</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Toggle visibility of the action button
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>dismissible</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Show the dismiss control
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showIcon</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Hide the leading icon
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
                    Stretch to the parent's width
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common toast use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Toast</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Toast />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Toast } from 'beacon-ui';

<Toast />`}
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
                      {`import { Toast } from 'beacon-ui';

<Toast />`}
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
                    <div className="ds-card-example-canvas" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-300)" }}>
                      <Toast variant="default" />
                      <Toast variant="success" />
                      <Toast variant="error" />
                      <Toast variant="warning" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Toast } from 'beacon-ui';

<Toast variant="default" />
<Toast variant="success" />
<Toast variant="error" />
<Toast variant="warning" />`}
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
                      {`import { Toast } from 'beacon-ui';

<Toast variant="default" />
<Toast variant="success" />
<Toast variant="error" />
<Toast variant="warning" />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">With Custom Message</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Toast message="File saved successfully" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Toast } from 'beacon-ui';

<Toast message="File saved successfully" />`}
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
                      {`import { Toast } from 'beacon-ui';

<Toast message="File saved successfully" />`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">With Action Handler</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Toast
                        message="Item deleted"
                        actionLabel="Undo"
                        onAction={() => console.log("Undo clicked")}
                        onDismiss={() => console.log("Dismissed")}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Toast } from 'beacon-ui';

<Toast
  message="Item deleted"
  actionLabel="Undo"
  onAction={() => console.log("Undo clicked")}
  onDismiss={() => console.log("Dismissed")}
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
                      {`import { Toast } from 'beacon-ui';

<Toast
  message="Item deleted"
  actionLabel="Undo"
  onAction={() => console.log("Undo clicked")}
  onDismiss={() => console.log("Dismissed")}
/>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Full Width</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Toast fullWidth message="This toast spans the full width" />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Toast } from 'beacon-ui';

<Toast fullWidth message="This toast spans the full width" />`}
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
                      {`import { Toast } from 'beacon-ui';

<Toast fullWidth message="This toast spans the full width" />`}
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
