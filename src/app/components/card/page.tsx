"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { CardPreview } from "@/components/CardPreview";
import { CardControls } from "@/components/CardControls";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";
import type { PatternType } from "@/utils/patternPaths";
import type { CornerRadiusStep } from "beacon-ui";
import { Card, Avatar, Button } from "beacon-ui";
import { RightArrowIcon } from "beacon-icons";
import { CodeCopyButton } from "@/components/CodeCopyButton";

type CardStatus = "default" | "highlighted" | "selected";
type CardShadow = "0" | "50" | "100" | "200" | "300" | "400" | "500";

interface CardConfig {
  padding: number;
  height?: string;
  status: CardStatus;
  shadow?: CardShadow;
  cornerRadius?: CornerRadiusStep;
  showBgPattern: boolean;
  patternType: PatternType;
  showOverlay: boolean;
  showBorder: boolean;
}

function generateCardCode(config: CardConfig): string {
    const props: string[] = [];
    
  if (config.padding !== 400) {
    props.push(`padding={${config.padding}}`);
  }
  
  if (config.height) {
    props.push(`height="${config.height}"`);
    }
    
    if (config.status !== "default") {
      props.push(`status="${config.status}"`);
    }
    
  if (config.shadow) {
    props.push(`shadow="${config.shadow}"`);
  }
  
  if (config.cornerRadius !== undefined && config.cornerRadius !== 4) {
    props.push(`cornerRadius={${config.cornerRadius}}`);
  }
  
  if (!config.showBgPattern) {
    props.push(`showBgPattern={false}`);
  } else if (config.patternType !== "cubes") {
    props.push(`patternType="${config.patternType}"`);
  }
  
  if (!config.showOverlay) {
    props.push(`showOverlay={false}`);
  }
  
  if (!config.showBorder) {
    props.push(`showBorder={false}`);
  }

  if (props.length === 0) {
    return `<Card>
  {/* Your content here */}
</Card>`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
  return `<Card${propsFormatted}
>
  {/* Your content here */}
</Card>`;
}


export default function CardPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<CardConfig>({
    padding: 400,
    status: "default",
    shadow: "100",
    cornerRadius: 4,
    showBgPattern: false,
    patternType: "cubes",
    showOverlay: false,
    showBorder: true,
  });

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "playground", label: "Interactive Playground" },
      { id: "api", label: "API Reference" },
      { id: "examples", label: "Usage Examples" },
      { id: "guidelines", label: "Usage Guidelines" },
    ];
  }, []);

  const updateConfig = (updates: Partial<CardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/card">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Card</h3>
          <p className="ds-content__subtitle">
            A flexible primitive container component for displaying content. Build any card layout by composing Card with your own content structure.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Card is a primitive component designed for maximum flexibility. Instead of providing pre-built card types, Card gives you the building blocks to construct any card layout you need. Control padding, elevation, background patterns, overlays, and borders to create custom card designs.
          </p>
          <p className="ds-content__text">
            All card styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available options.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the card and see how it looks in real-time. Toggle between themes and hues to see how cards adapt to different contexts.
          </p>
          <div className="ds-card-playground">
            <CardControls
              theme={theme}
              hue={hue}
              padding={config.padding}
              height={config.height}
              status={config.status}
              shadow={config.shadow}
              cornerRadius={config.cornerRadius}
              showBgPattern={config.showBgPattern}
              patternType={config.patternType}
              showOverlay={config.showOverlay}
              showBorder={config.showBorder}
              onThemeChange={setTheme}
              onHueChange={setHue}
              onPaddingChange={(padding) => updateConfig({ padding })}
              onHeightChange={(height) => updateConfig({ height })}
              onStatusChange={(status) => updateConfig({ status })}
              onShadowChange={(shadow) => updateConfig({ shadow })}
              onCornerRadiusChange={(cornerRadius) => updateConfig({ cornerRadius })}
              onShowBgPatternChange={(show) => updateConfig({ showBgPattern: show })}
              onPatternTypeChange={(type) => updateConfig({ patternType: type })}
              onShowOverlayChange={(show) => updateConfig({ showOverlay: show })}
              onShowBorderChange={(show) => updateConfig({ showBorder: show })}
            />
            <div className="ds-card-playground-divider" />
            <div className="ds-card-preview-section">
                  <div className="ds-card-preview">
                    <CardPreview
                      theme={theme}
                      hue={hue}
                  padding={config.padding}
                  height={config.height}
                      status={config.status}
                  shadow={config.shadow}
                      cornerRadius={config.cornerRadius}
                      showBgPattern={config.showBgPattern}
                      patternType={config.patternType}
                      showOverlay={config.showOverlay}
                      showBorder={config.showBorder}
                    />
                  </div>
                  <div className="ds-card-preview-code">
                    <CodeCopyButton code={generateCardCode(config)} />
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
                      {generateCardCode(config)}
                    </SyntaxHighlighter>
                  </div>
                </div>
          </div>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Card component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">CardProps</h6>
              <div style={{ position: "relative" }}>
                <CodeCopyButton
                  code={`interface CardProps extends Omit<ComponentPropsWithRef<"div">, "slot"> {
  padding?: number;
  height?: string;
  status?: "default" | "highlighted" | "selected";
  shadow?: "0" | "50" | "100" | "200" | "300" | "400" | "500";
  showBgPattern?: boolean;
  patternType?: PatternType;
  showOverlay?: boolean;
  showBorder?: boolean;
  children?: React.ReactNode;
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
                  {`interface CardProps extends Omit<ComponentPropsWithRef<"div">, "slot"> {
  padding?: number;
  height?: string;
  status?: "default" | "highlighted" | "selected";
  shadow?: "0" | "50" | "100" | "200" | "300" | "400" | "500";
  showBgPattern?: boolean;
  patternType?: PatternType;
  showOverlay?: boolean;
  showBorder?: boolean;
  children?: React.ReactNode;
}`}
                </SyntaxHighlighter>
              </div>
              <div className="ds-api-reference__props" style={{ marginTop: "var(--spacing-400)" }}>
                <h6 className="ds-api-reference__props-title">Card Props</h6>
                <div className="ds-api-reference__props-table">
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>padding</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>number</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>400</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Spacing token value (100, 200, 300, 400, etc.). Maps directly to --spacing-{`{value}`}.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>height</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>string</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>undefined</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Fixed height as CSS value (e.g., "200px", "100%", "auto"). When set, content will scroll if it exceeds the height.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>status</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>"default" | "highlighted" | "selected"</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>"default"</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Background color variant. All statuses use page-primary.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>shadow</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>"0" | "50" | "100" | "200" | "300" | "400" | "500"</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>undefined</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Shadow/elevation level using drop-shadow tokens (--drop-shadow-0 through --drop-shadow-500).
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>showBgPattern</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>boolean</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>false</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Whether to show background pattern overlay.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>patternType</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>PatternType</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>"cubes"</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Pattern type when showBgPattern is true. Options: cubes, mathematics, dots, diagonal, smudge, paper, denim, squares, mosaic, cotton.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>showOverlay</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>boolean</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>false</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Whether to show gradient overlay.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>showBorder</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>boolean</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                      <code>true</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Whether to show border. Selected status uses primary border color, others use strong-200.
                    </div>
                  </div>
                    </div>
                    </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Examples</h6>
          <p className="ds-content__text">
            Card is a primitive component designed for flexibility. Here are examples of how to build common card patterns using Card with your own content structure.
          </p>

          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Card</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Card padding={400}>
                        Your content here
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Card } from 'beacon-ui';

<Card padding={400}>
  Your content here
</Card>`}
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
                      {`import { Card } from 'beacon-ui';

<Card padding={400}>
  Your content here
</Card>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
            </div>
            </div>

            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Card with Shadow</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Card padding={400} shadow="100">
                        Elevated content
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Card } from 'beacon-ui';

<Card padding={400} shadow="100">
  Elevated content
</Card>`}
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
                      {`import { Card } from 'beacon-ui';

<Card padding={400} shadow="100">
  Elevated content
</Card>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
            </div>
            </div>

            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Product Card Pattern</h6>
              <p className="ds-content__text" style={{ marginBottom: "var(--spacing-300)" }}>
                Build a product card by composing Card with images, text, chips, and buttons:
              </p>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas" style={{ display: "flex", justifyContent: "flex-start" }}>
                      <Card padding={500} shadow="50" cornerRadius={4} showBgPattern={true} patternType="denim" showOverlay={true} showBorder={true} style={{ width: "50%", flexShrink: 0, minWidth: "320px" }}>
                        <h5 className="text-heading-h5" style={{ margin: 0, color: "var(--fg-neutral)", textTransform: "none" }}>Product Title</h5>
                        <p className="text-body3-medium" style={{ margin: 0, color: "var(--fg-neutral-tertiary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>Longer descriptive content for this product card. Visually limited to two lines within the card. Brief overview of key features designed to help users understand what the product offers at a glance.</p>
                        <img
                          src="/images/preview/1x1_512px_preview.png"
                          alt="Product preview"
                          style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover", borderRadius: "var(--corner-radius-400)" }}
                        />
                        <Button endIcon={<RightArrowIcon size="xs" />}>
                          Button
                        </Button>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Card, Button } from 'beacon-ui';
import { RightArrowIcon } from 'beacon-icons';

<Card 
  padding={500} 
  shadow="50" 
  cornerRadius={4} 
  showBgPattern={true} 
  patternType="denim" 
  showOverlay={true} 
  showBorder={true}
  style={{ width: "50%" }}
>
  <h5>Product Title</h5>
  <p>Longer descriptive content for this product card. Visually limited to two lines within the card. Brief overview of key features designed to help users understand what the product offers at a glance.</p>
  <img
    src="/images/preview/1x1_512px_preview.png"
    alt="Product"
    style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover" }}
  />
  <Button endIcon={<RightArrowIcon size="xs" />}>
    Button
  </Button>
</Card>`}
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
                    {`import { Card, Button } from 'beacon-ui';
import { RightArrowIcon } from 'beacon-icons';

<Card 
  padding={500} 
  shadow="50" 
  cornerRadius={4} 
  showBgPattern={true} 
  patternType="denim" 
  showOverlay={true} 
  showBorder={true}
  style={{ width: "50%" }}
>
  <h5 className="text-heading-h5" style={{ margin: 0, color: "var(--fg-neutral)", textTransform: "none" }}>Product Title</h5>
  <p className="text-body3-medium" style={{ margin: 0, color: "var(--fg-neutral-tertiary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>Longer descriptive content for this product card. Visually limited to two lines within the card. Brief overview of key features designed to help users understand what the product offers at a glance.</p>
  <img
    src="/images/preview/1x1_512px_preview.png"
    alt="Product"
    style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover" }}
  />
  <Button endIcon={<RightArrowIcon size="xs" />}>
    Button
  </Button>
</Card>`}
                </SyntaxHighlighter>
              </div>
            </div>
            </div>

            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Experience Card Pattern</h6>
              <p className="ds-content__text" style={{ marginBottom: "var(--spacing-300)" }}>
                Build an experience card with avatar, text, and metadata:
              </p>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Card padding={400}>
                        <div style={{ display: "flex", gap: "var(--spacing-400)", alignItems: "flex-start" }}>
                          <Avatar
                            size="lg"
                            type="image"
                            imageUrl="/images/avatars/avatar-female.png"
                          />
                          <div>
                            <h6 className="text-heading-h6" style={{ margin: 0, color: "var(--fg-neutral)", textTransform: "none" }}>Senior Designer</h6>
                            <p className="text-body2-regular" style={{ margin: 0, color: "var(--fg-neutral-secondary)" }}>Design Studio</p>
                            <p className="text-body1-regular" style={{ margin: 0, color: "var(--fg-neutral-tertiary)" }}>2023-2025</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Card, Avatar } from 'beacon-ui';

<Card padding={400}>
  <div style={{ display: "flex", gap: "var(--spacing-400)", alignItems: "flex-start" }}>
    <Avatar
      size="lg"
      type="image"
      imageUrl="/images/avatars/avatar-female.png"
    />
    <div>
      <h6 className="text-heading-h6" style={{ margin: 0, color: "var(--fg-neutral)", textTransform: "none" }}>Senior Designer</h6>
      <p className="text-body2-regular" style={{ margin: 0, color: "var(--fg-neutral-secondary)" }}>Design Studio</p>
      <p className="text-body1-regular" style={{ margin: 0, color: "var(--fg-neutral-tertiary)" }}>2023-2025</p>
    </div>
  </div>
</Card>`}
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
                      {`import { Card, Avatar } from 'beacon-ui';

<Card padding={400}>
  <div style={{ display: "flex", gap: "var(--spacing-400)", alignItems: "flex-start" }}>
    <Avatar
      size="lg"
      type="image"
      imageUrl="/images/avatars/avatar-female.png"
    />
    <div>
      <h6 className="text-heading-h6" style={{ margin: 0, color: "var(--fg-neutral)", textTransform: "none" }}>Senior Designer</h6>
      <p className="text-body2-regular" style={{ margin: 0, color: "var(--fg-neutral-secondary)" }}>Design Studio</p>
      <p className="text-body1-regular" style={{ margin: 0, color: "var(--fg-neutral-tertiary)" }}>2023-2025</p>
    </div>
  </div>
</Card>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
            </div>
            </div>

            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Info Card Pattern</h6>
              <p className="ds-content__text" style={{ marginBottom: "var(--spacing-300)" }}>
                Build an info card with icon and text:
              </p>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Card padding={400}>
                        <div style={{ display: "flex", gap: "var(--spacing-400)", alignItems: "flex-start" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "var(--corner-radius-200)", backgroundColor: "var(--bg-primary-tonal)", flexShrink: 0 }} />
                          <div>
                            <p className="text-body3-medium" style={{ margin: 0, color: "var(--fg-neutral)" }}>Card Name</p>
                            <p className="text-body2-regular" style={{ margin: 0, color: "var(--fg-neutral-secondary)" }}>Card description text here.</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Card } from 'beacon-ui';

<Card padding={400}>
  <div style={{ display: "flex", gap: "var(--spacing-400)", alignItems: "flex-start" }}>
    <div style={{ width: "32px", height: "32px", borderRadius: "var(--corner-radius-200)", backgroundColor: "var(--bg-primary-tonal)", flexShrink: 0 }} />
    <div>
      <p>Card Name</p>
      <p>Card description text here.</p>
    </div>
  </div>
</Card>`}
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
                      {`import { Card } from 'beacon-ui';

<Card padding={400}>
  <div style={{ display: "flex", gap: "var(--spacing-400)", alignItems: "flex-start" }}>
    <div style={{ width: "32px", height: "32px", borderRadius: "var(--corner-radius-200)", backgroundColor: "var(--bg-primary-tonal)", flexShrink: 0 }} />
    <div>
      <p className="text-body3-medium" style={{ margin: 0, color: "var(--fg-neutral)" }}>Card Name</p>
      <p className="text-body2-regular" style={{ margin: 0, color: "var(--fg-neutral-secondary)" }}>Card description text here.</p>
    </div>
  </div>
</Card>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Card with Fixed Height</h6>
              <div className="ds-card-example-section">
                <div className="ds-card-example-preview">
                  <div className="ds-card-example-container">
                    <div className="ds-card-example-canvas">
                      <Card padding={400} height="200px">
                        <div className="text-body3-regular" style={{ color: "var(--fg-neutral)" }}>Fixed height content (200px)</div>
                      </Card>
                    </div>
                  </div>
                </div>
                <div className="ds-card-example-code">
                  <div style={{ position: "relative" }}>
                    <CodeCopyButton
                      code={`import { Card } from 'beacon-ui';

<Card padding={400} height="200px">
  <div>Fixed height content</div>
</Card>

// Or use "auto" to wrap content:
<Card padding={400} height="auto">
  <div>Content that wraps</div>
</Card>

// Or use percentage:
<Card padding={400} height="100%">
  <div>Full height content</div>
</Card>`}
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
                      {`import { Card } from 'beacon-ui';

<Card padding={400} height="200px">
  <div>Fixed height content</div>
</Card>

// Or use "auto" to wrap content:
<Card padding={400} height="auto">
  <div>Content that wraps</div>
</Card>

// Or use percentage:
<Card padding={400} height="100%">
  <div>Full height content</div>
</Card>`}
                    </SyntaxHighlighter>
                  </div>
                </div>
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
                <li>Use Card as a flexible container for any content structure.</li>
                <li>Compose Card with your own layout components (divs, images, buttons, etc.).</li>
                <li>Use padding prop to control internal spacing (100, 200, 300, 400, etc.).</li>
                <li>Use shadow prop to add elevation when needed (0, 50, 100, 200, 300, 400, 500).</li>
                <li>Maintain consistent spacing and alignment within cards.</li>
                <li>Ensure cards have sufficient contrast for accessibility.</li>
                <li>Use status prop to indicate visual hierarchy (default, highlighted, selected).</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't overload cards with too much information.</li>
                <li>Don't use cards for navigation (use buttons or links instead).</li>
                <li>Don't nest cards within cards unnecessarily.</li>
                <li>Don't use cards for decorative purposes only.</li>
                <li>Don't ignore accessibility requirements for card content.</li>
                <li>Don't use arbitrary padding values - stick to spacing token values (100, 200, 300, etc.).</li>
                <li>Don't mix shadow levels inconsistently in the same context.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>Provide descriptive alt text for images in cards.</li>
            <li>Ensure sufficient color contrast between text and background.</li>
            <li>Use semantic HTML structure for card content.</li>
            <li>Make interactive cards keyboard accessible.</li>
            <li>Provide ARIA labels when cards are interactive or contain complex content.</li>
            <li>Ensure focus states are clearly visible for interactive cards.</li>
          </ul>
        </section>
      </article>
    </PageLayout>
  );
}
