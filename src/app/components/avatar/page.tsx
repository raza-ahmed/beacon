"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { AvatarPreview } from "@/components/AvatarPreview";
import { AvatarControls } from "@/components/AvatarControls";
import { CopyIcon, CheckIcon, UserPersonIcon } from "@/components/icons";
import { getAvatarImage } from "@/utils/imagePaths";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarType = "icon" | "text" | "image";
type AvatarColor = "primary" | "neutral" | "success" | "critical" | "warning";
type AvatarVariant = "solid" | "faded";

interface AvatarConfig {
  size: AvatarSize;
  type: AvatarType;
  color: AvatarColor;
  variant: AvatarVariant;
  isRound: boolean;
  hasStroke: boolean;
  initials: string;
}

const SIZE_LABELS: Record<AvatarSize, string> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

const TYPE_LABELS: Record<AvatarType, string> = {
  icon: "icon",
  text: "text",
  image: "image",
};

const COLOR_LABELS: Record<AvatarColor, string> = {
  primary: "primary",
  neutral: "neutral",
  success: "success",
  critical: "critical",
  warning: "warning",
};

const VARIANT_LABELS: Record<AvatarVariant, string> = {
  solid: "solid",
  faded: "faded",
};

function generateAvatarCode(config: AvatarConfig): string {
  const props: string[] = [];

  if (config.size !== "md") {
    props.push(`size="${SIZE_LABELS[config.size]}"`);
  }

  if (config.type !== "icon") {
    props.push(`type="${TYPE_LABELS[config.type]}"`);
  }

  if (config.color !== "primary") {
    props.push(`color="${COLOR_LABELS[config.color]}"`);
  }

  if (config.variant !== "solid") {
    props.push(`variant="${VARIANT_LABELS[config.variant]}"`);
  }

  if (config.isRound) {
    props.push(`isRound`);
  }

  if (config.hasStroke) {
    props.push(`hasStroke`);
  }

  if (config.type === "text" && config.initials !== "JD") {
    props.push(`initials="${config.initials}"`);
  }

  if (config.type === "image") {
    props.push(`imageUrl="/images/avatars/avatar-female.png"`);
  }

  if (props.length === 0) {
    return `<Avatar />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Avatar${propsFormatted}
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

export default function AvatarPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<AvatarConfig>({
    size: "md",
    type: "icon",
    color: "primary",
    variant: "solid",
    isRound: false,
    hasStroke: false,
    initials: "JD",
  });
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  // Clean theme object to remove conflicting background properties
  // Always use dark theme (vscDarkPlus) since background is always dark (Primary Black)
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

  const updateConfig = (updates: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateAvatarCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imageUrl = config.type === "image" ? getAvatarImage("default") : undefined;

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/avatar">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Avatar</h3>
          <p className="ds-content__subtitle">
            User avatars for displaying profile pictures, initials, or icons. Use avatars to represent users, teams, or entities.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Avatars are visual representations of users or entities. The Avatar component supports multiple content types,
            sizes, shapes, and color variants to fit different contexts and use cases.
          </p>
          <p className="ds-content__text">
            All avatar styles are built using design tokens, ensuring consistency across themes and hues. Use the
            interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the avatar and see how it looks in real-time. Toggle between themes and hues
            to see how avatars adapt to different contexts.
          </p>
          <div className="ds-avatar-playground">
            <AvatarControls
              size={config.size}
              type={config.type}
              color={config.color}
              variant={config.variant}
              isRound={config.isRound}
              hasStroke={config.hasStroke}
              theme={theme}
              hue={hue}
              initials={config.initials}
              onSizeChange={(size) => updateConfig({ size })}
              onTypeChange={(type) => updateConfig({ type })}
              onColorChange={(color) => updateConfig({ color })}
              onVariantChange={(variant) => updateConfig({ variant })}
              onIsRoundChange={(isRound) => updateConfig({ isRound })}
              onHasStrokeChange={(hasStroke) => updateConfig({ hasStroke })}
              onThemeChange={setTheme}
              onHueChange={setHue}
              onInitialsChange={(initials) => updateConfig({ initials })}
            />
            <div className="ds-avatar-playground-divider" />
            <div className="ds-avatar-preview-section">
              <div className="ds-avatar-preview">
                <AvatarPreview
                  size={config.size}
                  type={config.type}
                  color={config.color}
                  variant={config.variant}
                  isRound={config.isRound}
                  hasStroke={config.hasStroke}
                  theme={theme}
                  hue={hue}
                  initials={config.initials}
                  imageUrl={imageUrl}
                />
              </div>
              <div className="ds-avatar-preview-code">
                <button
                  type="button"
                  className="ds-avatar-code-copy"
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
                  {generateAvatarCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            An avatar consists of a container that holds the content (icon, text, or image).
          </p>
          <div className="ds-anatomy-diagram">
            <div className="ds-anatomy-diagram__avatar">
              <div className="ds-anatomy-diagram__container">
                <div className="ds-anatomy-diagram__content">JD</div>
              </div>
            </div>
            <div className="ds-anatomy-diagram__labels">
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Container</span>
                <code className="ds-anatomy-diagram__label-code">width, height, border-radius</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Content</span>
                <code className="ds-anatomy-diagram__label-code">icon, text, or image</code>
              </div>
              <div className="ds-anatomy-diagram__label-item">
                <span className="ds-anatomy-diagram__label-name">Background</span>
                <code className="ds-anatomy-diagram__label-code">--bg-*-solid or --bg-*-tonal</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Avatars come in different shapes, sizes, content types, and color variants to fit various use cases.
          </p>
          <div className="ds-avatar-variants-grid">
            <div className="ds-avatar-variant-card">
              <h6 className="ds-avatar-variant-card__title">Icon</h6>
              <p className="ds-avatar-variant-card__desc">
                Use icons for generic user representation or when no specific user data is available.
              </p>
              <div className="ds-avatar-variant-card__preview">
                <div className="ds-avatar-preview-icon">
                  <UserPersonIcon size={24} />
                </div>
              </div>
            </div>
            <div className="ds-avatar-variant-card">
              <h6 className="ds-avatar-variant-card__title">Text</h6>
              <p className="ds-avatar-variant-card__desc">
                Use initials or short text when you want to display user names without images.
              </p>
              <div className="ds-avatar-variant-card__preview">
                <div className="ds-avatar-preview-text">JD</div>
              </div>
            </div>
            <div className="ds-avatar-variant-card">
              <h6 className="ds-avatar-variant-card__title">Image</h6>
              <p className="ds-avatar-variant-card__desc">
                Use profile images for personalized user representation. Includes fallback handling.
              </p>
              <div className="ds-avatar-variant-card__preview">
                <div className="ds-avatar-preview-image">
                  <img
                    src={getAvatarImage("default")}
                    alt="Avatar preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="ds-avatar-variant-card">
              <h6 className="ds-avatar-variant-card__title">Round & Stroke</h6>
              <p className="ds-avatar-variant-card__desc">
                Default corner radius is 8px. Toggle to make fully round or add stroke border.
              </p>
              <div className="ds-avatar-variant-card__preview">
                <div className="ds-avatar-preview-circle" />
                <div className="ds-avatar-preview-square" />
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For a complete matrix of all avatar variants, sizes, and colors, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=230-301&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Avatar component in Figma
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
                <li>Use avatars to represent users, team members, or entities.</li>
                <li>Use appropriate sizes based on context and importance.</li>
                <li>Provide meaningful initials (2 characters) for text avatars.</li>
                <li>Use images when available for better personalization.</li>
                <li>Ensure sufficient color contrast for accessibility.</li>
                <li>Use consistent avatar styles throughout your application.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use avatars for decorative purposes only.</li>
                <li>Don't use more than 2 characters for text avatars.</li>
                <li>Don't use low-quality or inappropriate images.</li>
                <li>Don't mix avatar shapes inconsistently in the same context.</li>
                <li>Don't use avatars that are too small to recognize.</li>
                <li>Don't forget to provide alt text for image avatars.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Provide descriptive alt text for image avatars using the <code>alt</code> attribute.
            </li>
            <li>Ensure sufficient color contrast between background and content.</li>
            <li>Use meaningful initials that help identify the user.</li>
            <li>Consider using ARIA labels when avatars are interactive.</li>
            <li>Ensure avatars are large enough to be recognizable (minimum 32px).</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Avatar component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">AvatarProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  type?: "icon" | "text" | "image";
  color?: "primary" | "neutral" | "success" | "critical" | "warning";
  variant?: "solid" | "faded";
  isRound?: boolean;
  hasStroke?: boolean;
  initials?: string;
  imageUrl?: string;
  alt?: string;
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  type?: "icon" | "text" | "image";
  color?: "primary" | "neutral" | "success" | "critical" | "warning";
  variant?: "solid" | "faded";
  isRound?: boolean;
  hasStroke?: boolean;
  initials?: string;
  imageUrl?: string;
  alt?: string;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
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
                    Avatar container size: sm (32px), md (48px), lg (64px), xl (124px). Note: xl only available for image type.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>type</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"icon" | "text" | "image"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"icon"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Content type displayed in avatar. Icon sizes: sm=16px, md=24px, lg=40px. Text sizes: sm=--body-small-text-size, md=--body-regular-text-size, lg=h5. Extra large only available for image type.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>color</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"primary" | "neutral" | "success" | "critical" | "warning"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"primary"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Background color theme
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>variant</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"solid" | "faded"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"solid"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Color variant: solid (full color) or faded (tonal)
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>isRound</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Make avatar fully round (50% border-radius). Default is 8px corner radius.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>hasStroke</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>false</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Add stroke border to avatar
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>initials</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"JD"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Text to display for text type avatars (max 2 characters)
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>imageUrl</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Image URL for image type avatars
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>alt</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">—</div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Alt text for image avatars (accessibility)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common avatar use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Avatar</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Avatar />`);
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Avatar />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Text Avatar</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Avatar 
  type="text"
  initials="JD"
/>`);
                    setCopiedExample("text");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "text" ? (
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Avatar 
  type="text"
  initials="JD"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Image Avatar</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Avatar 
  type="image"
  imageUrl="/images/avatars/avatar-female.png"
  alt="User avatar"
/>`);
                    setCopiedExample("image");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "image" ? (
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Avatar 
  type="image"
  imageUrl="/images/avatars/avatar-female.png"
  alt="User avatar"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Sizes</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Avatar size="sm" />
<Avatar size="md" />
<Avatar size="lg" />
<Avatar size="xl" />`);
                    setCopiedExample("sizes");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "sizes" ? (
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Avatar size="sm" />
<Avatar size="md" />
<Avatar size="lg" />
<Avatar size="xl" />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Round & Stroke</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Avatar />
<Avatar isRound />
<Avatar hasStroke />
<Avatar isRound hasStroke />`);
                    setCopiedExample("round");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "round" ? (
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Avatar />
<Avatar isRound />
<Avatar hasStroke />
<Avatar isRound hasStroke />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Colors & Variants</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-avatar-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Avatar color="primary" variant="solid" />
<Avatar color="success" variant="faded" />
<Avatar color="neutral" variant="solid" />`);
                    setCopiedExample("colors");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "colors" ? (
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
                    fontSize: "var(--body-small-text-size)",
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
                  {`<Avatar color="primary" variant="solid" />
<Avatar color="success" variant="faded" />
<Avatar color="neutral" variant="solid" />`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

