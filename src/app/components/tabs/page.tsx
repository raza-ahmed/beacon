"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { TabItemPreview } from "@/components/TabItemPreview";
import { TabItemControls } from "@/components/TabItemControls";
import { PageFileIcon, ChevronRightIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import { CodeCopyButton } from "@/components/CodeCopyButton";

type TabItemState = "Default" | "Active" | "Hover" | "Disabled";
type TabItemSize = "Small" | "Medium";
type TabItemStyle = "Default" | "Pill";
type TabItemPlacement = "Horizontal" | "Vertical";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
type TabSize = "Small" | "Medium";
type TabItemWidth = "Auto" | "Equal";
type TabStyle = "Default" | "Pill";

interface TabItemConfig {
  tabName: string;
  state: TabItemState;
  size: TabItemSize;
  style: TabItemStyle;
  placement: TabItemPlacement;
  showStartIcon: boolean;
  showEndIcon: boolean;
  showTabLabel: boolean;
  cornerRadius: CornerRadiusStep;
}

const STATE_LABELS: Record<TabItemState, string> = {
  Default: "default",
  Active: "active",
  Hover: "hover",
  Disabled: "disabled",
};

const SIZE_LABELS: Record<TabItemSize, string> = {
  Small: "sm",
  Medium: "md",
};

const STYLE_LABELS: Record<TabItemStyle, string> = {
  Default: "default",
  Pill: "pill",
};

const PLACEMENT_LABELS: Record<TabItemPlacement, string> = {
  Horizontal: "horizontal",
  Vertical: "vertical",
};

function generateTabItemCode(config: TabItemConfig): string {
  const props: string[] = [];

  if (config.tabName !== "Tab Item") {
    props.push(`tabName="${config.tabName}"`);
  }

  if (config.state !== "Default") {
    props.push(`state="${STATE_LABELS[config.state]}"`);
  }

  if (config.size !== "Small") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
  }

  if (config.style !== "Default") {
    props.push(`style="${STYLE_LABELS[config.style]}"`);
  }

  if (config.placement !== "Horizontal") {
    props.push(`placement="${PLACEMENT_LABELS[config.placement]}"`);
  }

  if (!config.showStartIcon) {
    props.push(`showStartIcon={false}`);
  }

  if (!config.showEndIcon) {
    props.push(`showEndIcon={false}`);
  }

  if (!config.showTabLabel) {
    props.push(`showTabLabel={false}`);
  }

  if (config.cornerRadius !== 5 && config.style === "Pill") {
    props.push(`cornerRadius={${config.cornerRadius}}`);
  }

  if (props.length === 0) {
    return `<TabItem />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<TabItem${propsFormatted}
/>`;
}

function generateTabCode(size: TabSize, itemWidth: TabItemWidth, style: TabStyle, items: string[], cornerRadius: CornerRadiusStep = 5): string {
  const props: string[] = [];

  if (size !== "Small") {
    props.push(`size="${SIZE_LABELS[size]}"`);
  }

  if (itemWidth !== "Auto") {
    props.push(`itemWidth="${itemWidth.toLowerCase()}"`);
  }

  if (style !== "Default") {
    props.push(`style="${STYLE_LABELS[style]}"`);
  }

  if (cornerRadius !== 5 && style === "Pill") {
    props.push(`cornerRadius={${cornerRadius}}`);
  }

  const itemsCode = items.map((item) => `    <TabItem>${item}</TabItem>`).join("\n");

  if (props.length === 0) {
    return `<Tab>
  ${itemsCode}
</Tab>`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Tab${propsFormatted}
>
  ${itemsCode}
</Tab>`;
}

export default function TabsPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<TabItemConfig>({
    tabName: "Tab Item",
    state: "Default",
    size: "Small",
    style: "Default",
    placement: "Horizontal",
    showStartIcon: true,
    showEndIcon: true,
    showTabLabel: true,
    cornerRadius: 5,
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

  const updateConfig = (updates: Partial<TabItemConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/tabs">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Tabs</h3>
          <p className="ds-content__subtitle">
            Tabs organize content into related sections that users can navigate between. The Tab component contains TabItem components that represent individual tab options.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Tabs provide a way to organize and navigate between related content sections. The Tab component acts as a container for TabItem components, which represent individual tab options. TabItems can be displayed in different states, sizes, and styles to fit various use cases.
          </p>
          <p className="ds-content__text">
            All tab styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore TabItem variants, and see the usage examples section for Tab component demonstrations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the TabItem and see how it looks in real-time. Toggle between themes and hues to see how tab items adapt to different contexts. Note: This playground shows TabItem variants only. For Tab component variants, see the Usage Examples section.
          </p>
          <div className="ds-button-playground">
            <TabItemControls
              tabName={config.tabName}
              state={config.state}
              size={config.size}
              style={config.style}
              placement={config.placement}
              showStartIcon={config.showStartIcon}
              showEndIcon={config.showEndIcon}
              showTabLabel={config.showTabLabel}
              cornerRadius={config.cornerRadius}
              theme={theme}
              hue={hue}
              onTabNameChange={(name) => updateConfig({ tabName: name })}
              onStateChange={(state) => updateConfig({ state })}
              onSizeChange={(size) => updateConfig({ size })}
              onStyleChange={(style) => updateConfig({ style })}
              onPlacementChange={(placement) => updateConfig({ placement })}
              onShowStartIconChange={(show) => updateConfig({ showStartIcon: show })}
              onShowEndIconChange={(show) => updateConfig({ showEndIcon: show })}
              onShowTabLabelChange={(show) => updateConfig({ showTabLabel: show })}
              onCornerRadiusChange={(radius) => updateConfig({ cornerRadius: radius })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-button-playground-divider" />
            <div className="ds-button-preview-section">
              <div className="ds-button-preview">
                <TabItemPreview
                  tabName={config.tabName}
                  state={config.state}
                  size={config.size}
                  style={config.style}
                  placement={config.placement}
                  showStartIcon={config.showStartIcon}
                  showEndIcon={config.showEndIcon}
                  showTabLabel={config.showTabLabel}
                  cornerRadius={config.cornerRadius}
                  theme={theme}
                  hue={hue}
                />
              </div>
              <div className="ds-button-preview-code">
                <CodeCopyButton code={generateTabItemCode(config)} />
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
                  {generateTabItemCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A TabItem consists of several parts that work together to create a cohesive interactive element.
          </p>
          <div className="ds-anatomy-diagram">
            <div className="ds-anatomy-diagram__button">
              <div className="ds-anatomy-diagram__container">
                <div className="ds-anatomy-diagram__icon-left" />
                <div className="ds-anatomy-diagram__label">Tab Item</div>
                <div className="ds-anatomy-diagram__icon-right" />
              </div>
            </div>
            <div className="ds-anatomy-diagram__labels">
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Container</span>
                <code className="ds-anatomy-diagram__label-code">padding, border-radius (for pill style)</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Content Area</span>
                <code className="ds-anatomy-diagram__label-code">flex layout, gap</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Label</span>
                <code className="ds-anatomy-diagram__label-code">--body-*-text-size</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Icon Spacing</span>
                <code className="ds-anatomy-diagram__label-code">--spacing-200</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Active Indicator</span>
                <code className="ds-anatomy-diagram__label-code">2px bottom border (default style only)</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            TabItems come in different sizes, styles, and states to fit various use cases. The Tab component supports different configurations for organizing multiple TabItems.
          </p>
          <div className="ds-button-variants-grid">
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Default Style</h6>
              <p className="ds-button-variant-card__desc">
                Standard tab style with bottom border indicator for active state. Use for most navigation scenarios.
              </p>
              <div className="ds-button-variant-card__preview">
                <div style={{ display: "flex", gap: "var(--spacing-300)", alignItems: "center" }}>
                  <TabItemPreview
                    tabName="Active"
                    state="Active"
                    size="Small"
                    style="Default"
                    placement="Horizontal"
                    showStartIcon={false}
                    showEndIcon={false}
                    showTabLabel={true}
                  />
                  <TabItemPreview
                    tabName="Tab #1"
                    state="Default"
                    size="Small"
                    style="Default"
                    placement="Horizontal"
                    showStartIcon={false}
                    showEndIcon={false}
                    showTabLabel={true}
                  />
                </div>
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Pill Style</h6>
              <p className="ds-button-variant-card__desc">
                Rounded pill-style tabs with background highlight for active state. Use for more prominent tab navigation.
              </p>
              <div className="ds-button-variant-card__preview">
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-300)",
                    alignItems: "center",
                    backgroundColor: "var(--bg-page-secondary)",
                    padding: "var(--spacing-50)",
                    borderRadius: "var(--corner-radius-full)",
                  }}
                >
                  <TabItemPreview
                    tabName="Active"
                    state="Active"
                    size="Small"
                    style="Pill"
                    placement="Horizontal"
                    showStartIcon={false}
                    showEndIcon={false}
                    showTabLabel={true}
                  />
                  <TabItemPreview
                    tabName="Tab #1"
                    state="Default"
                    size="Small"
                    style="Pill"
                    placement="Horizontal"
                    showStartIcon={false}
                    showEndIcon={false}
                    showTabLabel={true}
                  />
                </div>
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Small Size</h6>
              <p className="ds-button-variant-card__desc">
                Compact tab size for space-constrained interfaces. Uses smaller text and icon sizes.
              </p>
              <div className="ds-button-variant-card__preview">
                <TabItemPreview
                  tabName="Small Tab"
                  state="Default"
                  size="Small"
                  style="Default"
                  placement="Horizontal"
                  showStartIcon={false}
                  showEndIcon={false}
                  showTabLabel={true}
                />
              </div>
            </div>
            <div className="ds-button-variant-card">
              <h6 className="ds-button-variant-card__title">Medium Size</h6>
              <p className="ds-button-variant-card__desc">
                Standard tab size for most use cases. Provides comfortable touch targets and readability.
              </p>
              <div className="ds-button-variant-card__preview">
                <TabItemPreview
                  tabName="Medium Tab"
                  state="Default"
                  size="Medium"
                  style="Default"
                  placement="Horizontal"
                  showStartIcon={false}
                  showEndIcon={false}
                  showTabLabel={true}
                />
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For a complete matrix of all tab variants, sizes, and states, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=1220-6224&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              TabItem component in Figma
            </a>
            {" "}and{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=1220-6460&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Tab component in Figma
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
                <li>Use tabs to organize related content into distinct sections.</li>
                <li>Keep tab labels concise and descriptive.</li>
                <li>Use the default style for most navigation scenarios.</li>
                <li>Limit the number of tabs to avoid overwhelming users (typically 3-5 tabs).</li>
                <li>Ensure active tab state is clearly visible.</li>
                <li>Use icons to enhance clarity when appropriate.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use tabs for unrelated content sections.</li>
                <li>Don't use too many tabs (more than 7-8) - consider alternative navigation patterns.</li>
                <li>Don't use vague or ambiguous tab labels.</li>
                <li>Don't disable tabs without explaining why.</li>
                <li>Don't use tabs for hierarchical navigation (use menus instead).</li>
                <li>Don't make tabs too small to tap comfortably on mobile.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Tabs must be keyboard accessible. Use proper ARIA attributes for tab navigation.
            </li>
            <li>Provide descriptive labels for screen readers using <code>aria-label</code> when needed.</li>
            <li>Ensure focus states are clearly visible with sufficient contrast.</li>
            <li>Use <code>disabled</code> attribute for disabled tabs, not just visual styling.</li>
            <li>Active tab state should be announced to screen readers.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">TabItem and Tab component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">TabItemProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface TabItemProps {
  tabName?: string;
  state?: "default" | "active" | "hover" | "disabled";
  size?: "sm" | "md";
  style?: "default" | "pill";
  placement?: "horizontal" | "vertical";
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showTabLabel?: boolean;
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
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
                  {`interface TabItemProps {
  tabName?: string;
  state?: "default" | "active" | "hover" | "disabled";
  size?: "sm" | "md";
  style?: "default" | "pill";
  placement?: "horizontal" | "vertical";
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showTabLabel?: boolean;
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__type" style={{ marginTop: "var(--spacing-500)" }}>
              <h6 className="ds-api-reference__type-title">TabProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface TabProps {
  size?: "sm" | "md";
  itemWidth?: "auto" | "equal";
  style?: "default" | "pill";
  placement?: "horizontal";
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  "aria-label"?: string;
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
                  {`interface TabProps {
  size?: "sm" | "md";
  itemWidth?: "auto" | "equal";
  style?: "default" | "pill";
  placement?: "horizontal";
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  "aria-label"?: string;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">TabItem Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>tabName</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text label for the tab item
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>state</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "active" | "hover" | "disabled"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Visual state of the tab item
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>size</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"sm" | "md"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"sm"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">Tab item size</div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>style</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "pill"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Visual style variant
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>placement</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"horizontal" | "vertical"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"horizontal"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Layout orientation
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
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Show icon at the start
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
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Show icon at the end (horizontal only)
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showTabLabel</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Show text label
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>cornerRadius</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>0 | 1 | 2 | 3 | 4 | 5</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>5</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Corner radius step for pill style: 0=None, 1=100 (4px), 2=200 (8px), 3=300 (12px), 4=400 (16px), 5=Full (100%)
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-api-reference__props" style={{ marginTop: "var(--spacing-500)" }}>
              <h6 className="ds-api-reference__props-title">Tab Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>size</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"sm" | "md"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"sm"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">Tab size</div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>itemWidth</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"auto" | "equal"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"auto"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Width distribution for tab items. When set to "equal", each TabItem takes equal available width and the active indicator spans the full width of each item.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>style</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"default" | "pill"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"default"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Visual style variant
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>placement</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"horizontal"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"horizontal"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Layout orientation
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>cornerRadius</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>0 | 1 | 2 | 3 | 4 | 5</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>5</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Corner radius step for tab container (pill style): 0=None, 1=100 (4px), 2=200 (8px), 3=300 (12px), 4=400 (16px), 5=Full (100%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common tab use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Default Style</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ minHeight: "auto", alignItems: "center", justifyContent: "flex-start", display: "flex", gap: "var(--spacing-500)", borderBottom: "var(--border-width-25) solid var(--border-strong-200)", paddingBottom: 0 }}>
                      <TabItemPreview
                        tabName="Active"
                        state="Active"
                        size="Small"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #1"
                        state="Default"
                        size="Small"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #2"
                        state="Default"
                        size="Small"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={generateTabCode("Small", "Auto", "Default", ["Active", "Tab #1", "Tab #2"])}
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
                      {generateTabCode("Small", "Auto", "Default", ["Active", "Tab #1", "Tab #2"])}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Pill Style</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div
                      className="ds-card-example-canvas"
                      style={{
                        minHeight: "auto",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        display: "flex",
                        gap: "var(--spacing-300)",
                        backgroundColor: "var(--bg-page-secondary)",
                        padding: "var(--spacing-50)",
                        borderRadius: "var(--corner-radius-full)",
                      }}
                    >
                      <TabItemPreview
                        tabName="Active"
                        state="Active"
                        size="Small"
                        style="Pill"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #1"
                        state="Default"
                        size="Small"
                        style="Pill"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #2"
                        state="Default"
                        size="Small"
                        style="Pill"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={generateTabCode("Small", "Auto", "Pill", ["Active", "Tab #1", "Tab #2"])}
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
                      {generateTabCode("Small", "Auto", "Pill", ["Active", "Tab #1", "Tab #2"])}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Tab with Medium Size</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ minHeight: "auto", alignItems: "center", justifyContent: "flex-start", display: "flex", gap: "var(--spacing-500)", borderBottom: "var(--border-width-25) solid var(--border-strong-200)", paddingBottom: 0 }}>
                      <TabItemPreview
                        tabName="Active"
                        state="Active"
                        size="Medium"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #1"
                        state="Default"
                        size="Medium"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #2"
                        state="Default"
                        size="Medium"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={generateTabCode("Medium", "Auto", "Default", ["Active", "Tab #1", "Tab #2"])}
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
                      {generateTabCode("Medium", "Auto", "Default", ["Active", "Tab #1", "Tab #2"])}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Equal Width Items</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ minHeight: "auto", alignItems: "center", justifyContent: "flex-start", display: "flex", gap: "var(--spacing-500)", borderBottom: "var(--border-width-25) solid var(--border-strong-200)", paddingBottom: 0 }}>
                      <TabItemPreview
                        tabName="Active"
                        state="Active"
                        size="Small"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                        fullWidth={true}
                      />
                      <TabItemPreview
                        tabName="Tab #1"
                        state="Default"
                        size="Small"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                        fullWidth={true}
                      />
                      <TabItemPreview
                        tabName="Tab #2"
                        state="Default"
                        size="Small"
                        style="Default"
                        placement="Horizontal"
                        showStartIcon={false}
                        showEndIcon={false}
                        showTabLabel={true}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={generateTabCode("Small", "Equal", "Default", ["Active", "Tab #1", "Tab #2"])}
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
                      {generateTabCode("Small", "Equal", "Default", ["Active", "Tab #1", "Tab #2"])}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Vertical Placement</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ minHeight: "auto", alignItems: "center", justifyContent: "flex-start", display: "flex", gap: "var(--spacing-500)", borderBottom: "var(--border-width-25) solid var(--border-strong-200)", paddingBottom: 0 }}>
                      <TabItemPreview
                        tabName="Active"
                        state="Active"
                        size="Small"
                        style="Default"
                        placement="Vertical"
                        showStartIcon={true}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #1"
                        state="Default"
                        size="Small"
                        style="Default"
                        placement="Vertical"
                        showStartIcon={true}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                      <TabItemPreview
                        tabName="Tab #2"
                        state="Default"
                        size="Small"
                        style="Default"
                        placement="Vertical"
                        showStartIcon={true}
                        showEndIcon={false}
                        showTabLabel={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Tab, TabItem } from 'beacon-ui';
import { PageFileIcon } from 'beacon-icons';

<Tab>
  <TabItem tabName="Active" state="active" placement="vertical" startIcon={<PageFileIcon size={16} />} />
  <TabItem tabName="Tab #1" placement="vertical" startIcon={<PageFileIcon size={16} />} />
  <TabItem tabName="Tab #2" placement="vertical" startIcon={<PageFileIcon size={16} />} />
</Tab>`}
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
                      {`import { Tab, TabItem } from 'beacon-ui';
import { PageFileIcon } from 'beacon-icons';

<Tab>
  <TabItem tabName="Active" state="active" placement="vertical" startIcon={<PageFileIcon size={16} />} />
  <TabItem tabName="Tab #1" placement="vertical" startIcon={<PageFileIcon size={16} />} />
  <TabItem tabName="Tab #2" placement="vertical" startIcon={<PageFileIcon size={16} />} />
</Tab>`}
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

