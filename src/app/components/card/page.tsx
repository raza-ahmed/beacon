"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { CardPreview } from "@/components/CardPreview";
import { CardControls } from "@/components/CardControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { PatternType } from "@/utils/patternPaths";

type CardType = "product" | "experience" | "info" | "generic";
type ProductCardSize = "full" | "half";
type ProductCardStatus = "default" | "highlighted";
type ExperienceCardType = "default" | "skills" | "contacts";
type GenericCardStatus = "default" | "highlighted" | "selected";

interface CardConfig {
  cardType: CardType;
  // ProductCard
  size: ProductCardSize;
  status: ProductCardStatus;
  hasImage: boolean;
  imageAspectRatio: "16x9" | "4x3";
  hasIdentifiers: boolean;
  hasButton: boolean;
  title: string;
  description: string;
  // ExperienceCard
  experienceType: ExperienceCardType;
  positionName: string;
  companyName: string;
  year: string;
  experienceDescription: string;
  label: string;
  details: string;
  // InfoCard
  cardName: string;
  cardDescription: string;
  hasIcon: boolean;
  // Generic Card
  genericStatus: GenericCardStatus;
  showBgPattern: boolean;
  patternType: PatternType;
  showOverlay: boolean;
  showShadow: boolean;
  showBorder: boolean;
}

function generateCardCode(config: CardConfig): string {
  const { cardType } = config;

  if (cardType === "product") {
    const props: string[] = [];
    
    if (config.size !== "full") {
      props.push(`size="${config.size}"`);
    }
    
    if (config.status !== "default") {
      props.push(`status="${config.status}"`);
    }
    
    if (!config.hasImage) {
      props.push(`hasImage={false}`);
    }
    
    if (config.imageAspectRatio !== "16x9") {
      props.push(`imageAspectRatio="${config.imageAspectRatio}"`);
    }
    
    if (!config.hasIdentifiers) {
      props.push(`hasIdentifiers={false}`);
    }
    
    if (!config.hasButton) {
      props.push(`hasButton={false}`);
    }
    
    if (config.title !== "Product Title") {
      props.push(`title="${config.title}"`);
    }
    
    if (config.description !== "Add your products Details that description here. This paragraph is restricted only two lines even if content is large.") {
      props.push(`description="${config.description}"`);
    }

    if (props.length === 0) {
      return `<ProductCard />`;
    }

    const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
    return `<ProductCard${propsFormatted}
/>`;
  }

  if (cardType === "experience") {
    const props: string[] = [];
    
    if (config.experienceType !== "default") {
      props.push(`type="${config.experienceType}"`);
    }
    
    if (config.positionName !== "Position Name") {
      props.push(`positionName="${config.positionName}"`);
    }
    
    if (config.companyName !== "Company Name") {
      props.push(`companyName="${config.companyName}"`);
    }
    
    if (config.year !== "2025-26") {
      props.push(`year="${config.year}"`);
    }
    
    if (config.experienceDescription !== "Long Description") {
      props.push(`description="${config.experienceDescription}"`);
    }
    
    if (config.experienceType === "contacts") {
      if (config.label !== "Label") {
        props.push(`label="${config.label}"`);
      }
      if (config.details !== "Details") {
        props.push(`details="${config.details}"`);
      }
    }

    if (props.length === 0) {
      return `<ExperienceCard />`;
    }

    const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
    return `<ExperienceCard${propsFormatted}
/>`;
  }

  if (cardType === "info") {
    const props: string[] = [];
    
    if (!config.hasIcon) {
      props.push(`hasIcon={false}`);
    }
    
    if (config.cardName !== "Card Name") {
      props.push(`cardName="${config.cardName}"`);
    }
    
    if (config.cardDescription !== "Card Description") {
      props.push(`cardDescription="${config.cardDescription}"`);
    }

    if (props.length === 0) {
      return `<InfoCard />`;
    }

    const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
    return `<InfoCard${propsFormatted}
/>`;
  }

  // Generic Card
  const props: string[] = [];
  
  if (config.genericStatus !== "default") {
    props.push(`status="${config.genericStatus}"`);
  }
  
  if (config.showBgPattern) {
    // Always include patternType when background pattern is enabled
    props.push(`patternType="${config.patternType}"`);
  } else {
    props.push(`showBgPattern={false}`);
  }
  
  if (!config.showOverlay) {
    props.push(`showOverlay={false}`);
  }
  
  if (!config.showShadow) {
    props.push(`showShadow={false}`);
  }
  
  if (!config.showBorder) {
    props.push(`showBorder={false}`);
  }

  if (props.length === 0) {
    return `<Card>
  {/* Slot content */}
</Card>`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");
  return `<Card${propsFormatted}
>
  {/* Slot content */}
</Card>`;
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

export default function CardPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<CardConfig>({
    cardType: "experience",
    // ProductCard defaults
    size: "full",
    status: "default",
    hasImage: true,
    imageAspectRatio: "16x9",
    hasIdentifiers: true,
    hasButton: true,
    title: "Product Title",
    description: "Add your products Details that description here. This paragraph is restricted only two lines even if content is large.",
    // ExperienceCard defaults
    experienceType: "default",
    positionName: "Position Name",
    companyName: "Company Name",
    year: "2025-26",
    experienceDescription: "Long Description",
    label: "Label",
    details: "Details",
    // InfoCard defaults
    cardName: "Card Name",
    cardDescription: "Card Description",
    hasIcon: true,
    // Generic Card defaults
    genericStatus: "default",
    showBgPattern: true,
    patternType: "cubes",
    showOverlay: true,
    showShadow: true,
    showBorder: true,
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

  const updateConfig = (updates: Partial<CardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateCardCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/card">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Card</h3>
          <p className="ds-content__subtitle">
            Flexible container components for displaying content. Cards provide structure and visual hierarchy for various types of information.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Cards are versatile container components that organize and present content in a structured format. The Card component system includes four specialized types, each designed for specific use cases.
          </p>
          <p className="ds-content__text">
            All card styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the card and see how it looks in real-time. Switch between card types to explore different variants. Toggle between themes and hues to see how cards adapt to different contexts.
          </p>
          <div className="ds-card-playground">
            <CardControls
              cardType={config.cardType}
              theme={theme}
              hue={hue}
              size={config.size}
              status={config.status}
              hasImage={config.hasImage}
              imageAspectRatio={config.imageAspectRatio}
              hasIdentifiers={config.hasIdentifiers}
              hasButton={config.hasButton}
              title={config.title}
              description={config.description}
              experienceType={config.experienceType}
              positionName={config.positionName}
              companyName={config.companyName}
              year={config.year}
              experienceDescription={config.experienceDescription}
              label={config.label}
              details={config.details}
              cardName={config.cardName}
              cardDescription={config.cardDescription}
              hasIcon={config.hasIcon}
              genericStatus={config.genericStatus}
              showBgPattern={config.showBgPattern}
              patternType={config.patternType}
              showOverlay={config.showOverlay}
              showShadow={config.showShadow}
              showBorder={config.showBorder}
              onCardTypeChange={(type) => updateConfig({ cardType: type })}
              onThemeChange={setTheme}
              onHueChange={setHue}
              onSizeChange={(size) => updateConfig({ size })}
              onStatusChange={(status) => updateConfig({ status })}
              onHasImageChange={(has) => updateConfig({ hasImage: has })}
              onImageAspectRatioChange={(ratio) => updateConfig({ imageAspectRatio: ratio })}
              onHasIdentifiersChange={(has) => updateConfig({ hasIdentifiers: has })}
              onHasButtonChange={(has) => updateConfig({ hasButton: has })}
              onTitleChange={(title) => updateConfig({ title })}
              onDescriptionChange={(description) => updateConfig({ description })}
              onExperienceTypeChange={(type) => updateConfig({ experienceType: type })}
              onPositionNameChange={(name) => updateConfig({ positionName: name })}
              onCompanyNameChange={(name) => updateConfig({ companyName: name })}
              onYearChange={(year) => updateConfig({ year })}
              onExperienceDescriptionChange={(desc) => updateConfig({ experienceDescription: desc })}
              onLabelChange={(label) => updateConfig({ label })}
              onDetailsChange={(details) => updateConfig({ details })}
              onCardNameChange={(name) => updateConfig({ cardName: name })}
              onCardDescriptionChange={(desc) => updateConfig({ cardDescription: desc })}
              onHasIconChange={(has) => updateConfig({ hasIcon: has })}
              onGenericStatusChange={(status) => updateConfig({ genericStatus: status })}
              onShowBgPatternChange={(show) => updateConfig({ showBgPattern: show })}
              onPatternTypeChange={(type) => updateConfig({ patternType: type })}
              onShowOverlayChange={(show) => updateConfig({ showOverlay: show })}
              onShowShadowChange={(show) => updateConfig({ showShadow: show })}
              onShowBorderChange={(show) => updateConfig({ showBorder: show })}
            />
            <div className="ds-card-playground-divider" />
            <div className="ds-card-preview-section">
                  <div className="ds-card-preview">
                    <CardPreview
                      cardType={config.cardType}
                      theme={theme}
                      hue={hue}
                      size={config.size}
                      status={config.status}
                      hasImage={config.hasImage}
                      imageAspectRatio={config.imageAspectRatio}
                      hasIdentifiers={config.hasIdentifiers}
                      hasButton={config.hasButton}
                      title={config.title}
                      description={config.description}
                      experienceType={config.experienceType}
                      positionName={config.positionName}
                      companyName={config.companyName}
                      year={config.year}
                      experienceDescription={config.experienceDescription}
                      label={config.label}
                      details={config.details}
                      cardName={config.cardName}
                      cardDescription={config.cardDescription}
                      hasIcon={config.hasIcon}
                      genericStatus={config.genericStatus}
                      showBgPattern={config.showBgPattern}
                      patternType={config.patternType}
                      showOverlay={config.showOverlay}
                      showShadow={config.showShadow}
                      showBorder={config.showBorder}
                    />
                  </div>
                  <div className="ds-card-preview-code">
                    <button
                      type="button"
                      className="ds-card-code-copy"
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
                      {generateCardCode(config)}
                    </SyntaxHighlighter>
                  </div>
                </div>
          </div>
        </section>


        <section id="product-card-info" className="ds-content__section">
          <h6 className="ds-content__section-title">Product Card</h6>
            <p className="ds-content__text">
              ProductCard is designed for product displays and featured content. It supports two sizes (Full and Half) and two status variants (Default and Highlighted).
            </p>
            <div className="ds-card-product-info">
              <div className="ds-card-product-info__grid">
                <div className="ds-card-product-info__item">
                  <h6 className="ds-card-product-info__label">Sizes</h6>
                  <p className="ds-card-product-info__value">Full (horizontal), Half (vertical)</p>
                </div>
                <div className="ds-card-product-info__item">
                  <h6 className="ds-card-product-info__label">Status</h6>
                  <p className="ds-card-product-info__value">Default, Highlighted</p>
                </div>
                <div className="ds-card-product-info__item">
                  <h6 className="ds-card-product-info__label">Features</h6>
                  <p className="ds-card-product-info__value">Image (16:9 or 4:3), Title, Description, Identifiers, Button</p>
                </div>
                <div className="ds-card-product-info__item">
                  <h6 className="ds-card-product-info__label">Use Case</h6>
                  <p className="ds-card-product-info__value">E-commerce, product showcases, featured content</p>
                </div>
              </div>
              <div className="ds-card-product-info__code">
                <button
                  type="button"
                  className="ds-card-code-copy"
                  onClick={handleCopyCode}
                  aria-label="Copy code">
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
                  {generateCardCode(config)}
                </SyntaxHighlighter>
              </div>
            </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            Cards consist of several parts that work together to create a cohesive container for content.
          </p>
          <div className="ds-card-anatomy-diagram">
            <div className="ds-card-anatomy-diagram__card">
              <div className="ds-card-anatomy-diagram__container">
                <div className="ds-card-anatomy-diagram__image" />
                <div className="ds-card-anatomy-diagram__content">
                  <div className="ds-card-anatomy-diagram__title" />
                  <div className="ds-card-anatomy-diagram__description" />
                </div>
                <div className="ds-card-anatomy-diagram__identifiers" />
                <div className="ds-card-anatomy-diagram__button" />
              </div>
            </div>
            <div className="ds-card-anatomy-diagram__labels">
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Container</span>
                <code className="ds-card-anatomy-diagram__label-code">padding, border-radius, background</code>
              </div>
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Image Area</span>
                <code className="ds-card-anatomy-diagram__label-code">aspect-ratio, object-fit</code>
              </div>
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Content Area</span>
                <code className="ds-card-anatomy-diagram__label-code">flex layout, gap</code>
              </div>
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Title</span>
                <code className="ds-card-anatomy-diagram__label-code">--heading-h4-text-size or --heading-h5-text-size</code>
              </div>
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Description</span>
                <code className="ds-card-anatomy-diagram__label-code">--body-regular-text-size</code>
              </div>
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Identifiers</span>
                <code className="ds-card-anatomy-diagram__label-code">chips with --spacing-200 gap</code>
              </div>
              <div className="ds-card-anatomy-diagram__label-item">
                <span className="ds-card-anatomy-diagram__label-name">Button</span>
                <code className="ds-card-anatomy-diagram__label-code">tonal background, --corner-radius-200</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Cards come in four main types, each suited for different content and use cases.
          </p>
          <div className="ds-card-variants-grid">
            <div className="ds-card-variant-card">
              <h6 className="ds-card-variant-card__title">Product Card</h6>
              <p className="ds-card-variant-card__desc">
                Designed for product displays and featured content. Supports full and half sizes, with optional images, identifiers, and action buttons.
              </p>
              <div className="ds-card-variant-card__preview">
                <div style={{ width: "200px", height: "120px", backgroundColor: "var(--bg-page-secondary)", borderRadius: "var(--corner-radius-200)" }} />
              </div>
            </div>
            <div className="ds-card-variant-card">
              <h6 className="ds-card-variant-card__title">Experience Card</h6>
              <p className="ds-card-variant-card__desc">
                Used for work experience, skills, and contact information. Three variants: Default (full details), Skills (compact), and Contacts (label/details).
              </p>
              <div className="ds-card-variant-card__preview">
                <div style={{ width: "200px", height: "120px", backgroundColor: "var(--bg-page-secondary)", borderRadius: "var(--corner-radius-200)" }} />
              </div>
            </div>
            <div className="ds-card-variant-card">
              <h6 className="ds-card-variant-card__title">Info Card</h6>
              <p className="ds-card-variant-card__desc">
                Simple information display with optional icon, name, and description. Ideal for notifications, tips, and informational content.
              </p>
              <div className="ds-card-variant-card__preview">
                <div style={{ width: "200px", height: "120px", backgroundColor: "var(--bg-page-secondary)", borderRadius: "var(--corner-radius-200)" }} />
              </div>
            </div>
            <div className="ds-card-variant-card">
              <h6 className="ds-card-variant-card__title">Generic Card</h6>
              <p className="ds-card-variant-card__desc">
                Flexible container with slot system for custom content. Supports status variants, background patterns, overlays, shadows, and borders.
              </p>
              <div className="ds-card-variant-card__preview">
                <div style={{ width: "200px", height: "120px", backgroundColor: "var(--bg-page-secondary)", borderRadius: "var(--corner-radius-200)" }} />
              </div>
            </div>
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-500)" }}>
            For complete specifications of all card variants, see the{" "}
            <a
              href="https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=659-7626&m=dev"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-content__link"
            >
              Card components in Figma
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
                <li>Use ProductCard for e-commerce, product showcases, and featured content.</li>
                <li>Use ExperienceCard for resumes, portfolios, and professional information.</li>
                <li>Use InfoCard for notifications, tips, and simple informational displays.</li>
                <li>Use Generic Card for custom layouts and flexible content composition.</li>
                <li>Maintain consistent spacing and alignment within cards.</li>
                <li>Ensure cards have sufficient contrast for accessibility.</li>
                <li>Use appropriate card types based on content structure.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't mix card types inconsistently in the same context.</li>
                <li>Don't overload cards with too much information.</li>
                <li>Don't use cards for navigation (use buttons or links instead).</li>
                <li>Don't nest cards within cards unnecessarily.</li>
                <li>Don't use cards for decorative purposes only.</li>
                <li>Don't ignore accessibility requirements for card content.</li>
                <li>Don't use Generic Card when a specialized card type would be more appropriate.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>Provide descriptive alt text for images in ProductCard.</li>
            <li>Ensure sufficient color contrast between text and background.</li>
            <li>Use semantic HTML structure for card content.</li>
            <li>Make interactive cards keyboard accessible.</li>
            <li>Provide ARIA labels when cards are interactive or contain complex content.</li>
            <li>Ensure focus states are clearly visible for interactive cards.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Card component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">ProductCardProps</h6>
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
                {`interface ProductCardProps {
  size?: "full" | "half";
  status?: "default" | "highlighted";
  hasImage?: boolean;
  imageAspectRatio?: "16x9" | "4x3";
  hasIdentifiers?: boolean;
  hasButton?: boolean;
  title?: string;
  description?: string;
}`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">ExperienceCardProps</h6>
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
                {`interface ExperienceCardProps {
  type?: "default" | "skills" | "contacts";
  positionName?: string;
  companyName?: string;
  year?: string;
  description?: string;
  label?: string;
  details?: string;
}`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">InfoCardProps</h6>
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
                {`interface InfoCardProps {
  hasIcon?: boolean;
  cardName?: string;
  cardDescription?: string;
}`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">GenericCardProps</h6>
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
                {`interface GenericCardProps {
  status?: "default" | "highlighted" | "selected";
  showBgPattern?: boolean;
  showOverlay?: boolean;
  showShadow?: boolean;
  showBorder?: boolean;
  children?: React.ReactNode;
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common card use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Product Card</h6>
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
                {`<ProductCard
  title="Product Title"
  description="Product description"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Experience Card Default</h6>
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
                {`<ExperienceCard
  type="default"
  positionName="Senior Designer"
  companyName="Design Studio"
  year="2023-2025"
  description="Led design initiatives"
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Info Card</h6>
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
                {`<InfoCard
  cardName="Information"
  cardDescription="This is an informational card"
  hasIcon
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Generic Card</h6>
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
                {`<Card
  status="highlighted"
  showShadow
  showBorder
>
  <div>Custom content</div>
</Card>`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

