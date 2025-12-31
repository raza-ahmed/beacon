"use client";

import { useEffect, useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { CopyIcon } from "@/components/icons";

interface TypographyStyle {
  name: string;
  className: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

interface ColorPreview {
  name: string;
  cssVar: `--fg-${string}`;
}

const TYPOGRAPHY_STYLES: Array<{ name: string; className: string; category: "heading" | "title" | "body" }> = [
  { name: "H1", className: "text-heading-h1", category: "heading" },
  { name: "H2", className: "text-heading-h2", category: "heading" },
  { name: "H3", className: "text-heading-h3", category: "heading" },
  { name: "H4", className: "text-heading-h4", category: "heading" },
  { name: "H5", className: "text-heading-h5", category: "heading" },
  { name: "H6", className: "text-heading-h6", category: "heading" },
  { name: "Title Regular", className: "text-title-regular", category: "title" },
  { name: "Title Small", className: "text-title-small", category: "title" },
  { name: "Body4 Regular", className: "text-body4-regular", category: "body" },
  { name: "Body4 Medium", className: "text-body4-medium", category: "body" },
  { name: "Body3 Regular", className: "text-body3-regular", category: "body" },
  { name: "Body3 Medium", className: "text-body3-medium", category: "body" },
  { name: "Body2 Regular", className: "text-body2-regular", category: "body" },
  { name: "Body2 Medium", className: "text-body2-medium", category: "body" },
  { name: "Body1 Regular", className: "text-body1-regular", category: "body" },
  { name: "Body1 Medium", className: "text-body1-medium", category: "body" },
];

const COLOR_PREVIEWS: ColorPreview[] = [
  { name: "Neutral", cssVar: "--fg-neutral" },
  { name: "Neutral Faded", cssVar: "--fg-neutral-tertiary" },
  { name: "Success", cssVar: "--fg-success" },
  { name: "Warning", cssVar: "--fg-warning" },
  { name: "Critical", cssVar: "--fg-critical" },
  { name: "Primary", cssVar: "--fg-primary" },
  { name: "Disabled", cssVar: "--fg-disabled" },
];

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

function useComputedTypography() {
  const [computed, setComputed] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [typographyStyles, setTypographyStyles] = useState<TypographyStyle[]>([]);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const tokens: Record<string, string> = {};

    // Extract font family tokens
    tokens["--font-primary"] = styles.getPropertyValue("--font-primary").trim();
    tokens["--font-secondary"] = styles.getPropertyValue("--font-secondary").trim();

    // Extract font weight tokens
    tokens["--font-weight-regular"] = styles.getPropertyValue("--font-weight-regular").trim();
    tokens["--font-weight-medium"] = styles.getPropertyValue("--font-weight-medium").trim();
    tokens["--font-weight-semibold"] = styles.getPropertyValue("--font-weight-semibold").trim();
    tokens["--font-weight-bold"] = styles.getPropertyValue("--font-weight-bold").trim();

    setComputed(tokens);

    // Extract computed values from typography utility classes
    const typographyData: TypographyStyle[] = [];
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.top = "-9999px";
    document.body.appendChild(tempDiv);

    TYPOGRAPHY_STYLES.forEach((style) => {
      tempDiv.className = style.className;
      const computedStyle = window.getComputedStyle(tempDiv);
      
      typographyData.push({
        name: style.name,
        className: style.className,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        lineHeight: computedStyle.lineHeight,
      });
    });

    document.body.removeChild(tempDiv);
    setTypographyStyles(typographyData);
  }, []);

  return { computed, mounted, typographyStyles };
}

export default function TypographyPage() {
  const { computed, mounted, typographyStyles } = useComputedTypography();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "building-blocks", label: "Building Blocks" },
      { id: "style-demos", label: "Style Demos" },
      { id: "color-previews", label: "Color Previews" },
    ];
  }, []);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setCopiedText(text);
    window.setTimeout(() => setCopiedText(null), 1200);
  };

  const fontFamilies = useMemo(() => {
    return [
      { name: "Primary", cssVar: "--font-primary", value: computed["--font-primary"] || "IBM Plex Serif" },
      { name: "Secondary", cssVar: "--font-secondary", value: computed["--font-secondary"] || "DM Sans" },
    ];
  }, [computed]);

  const fontWeights = useMemo(() => {
    return [
      { name: "Regular", cssVar: "--font-weight-regular", value: computed["--font-weight-regular"] || "400" },
      { name: "Medium", cssVar: "--font-weight-medium", value: computed["--font-weight-medium"] || "500" },
      { name: "Semibold", cssVar: "--font-weight-semibold", value: computed["--font-weight-semibold"] || "600" },
      { name: "Bold", cssVar: "--font-weight-bold", value: computed["--font-weight-bold"] || "700" },
    ];
  }, [computed]);

  const headings = useMemo(() => typographyStyles.filter((s) => s.name.startsWith("H")), [typographyStyles]);
  const titles = useMemo(() => typographyStyles.filter((s) => s.name.startsWith("Title")), [typographyStyles]);
  const paragraphs = useMemo(() => typographyStyles.filter((s) => s.name.startsWith("Body")), [typographyStyles]);

  if (!mounted) {
    return (
      <PageLayout tocItems={tocItems} currentPath="/foundations/typography">
        <article className="ds-content">
          <header className="ds-content__header">
            <h3 className="ds-content__title">Typography</h3>
            <p className="ds-content__subtitle">Loading typography tokens...</p>
          </header>
        </article>
      </PageLayout>
    );
  }

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/typography">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Typography</h3>
          <p className="ds-content__subtitle">
            Typography system with font families, sizes, weights, line heights, and style demos.
          </p>
        </header>

        <section id="building-blocks" className="ds-content__section">
          <h6 className="ds-content__section-title">Building Blocks</h6>

          <div style={{ marginBottom: "var(--spacing-500)" }}>
            <h6 style={{ marginBottom: "var(--spacing-300)", fontSize: "var(--fonts-body-regular-text-size)", fontWeight: "var(--font-weight-semibold)" }}>
              Font Family
            </h6>
            <div className="ds-spacing-table">
              <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--four-col">
                <div className="ds-spacing-table__cell">Name</div>
                <div className="ds-spacing-table__cell">CSS Variable</div>
                <div className="ds-spacing-table__cell">Value</div>
                <div className="ds-spacing-table__cell">Actions</div>
              </div>
              {fontFamilies.map((font) => (
                <div key={font.cssVar} className="ds-spacing-table__row ds-spacing-table__row--four-col">
                  <div className="ds-spacing-table__cell" data-label="Name">
                    <code className="ds-token-row__code">{font.name}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="CSS Variable">
                    <code className="ds-token-row__code">{font.cssVar}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Value" style={{ fontFamily: font.value }}>
                    {font.value}
                  </div>
                  <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                    <button
                      className={`ds-token-button ${copiedText === font.cssVar ? "ds-token-button--secondary" : ""}`}
                      onClick={() => handleCopy(font.cssVar)}
                      aria-label="Copy variable name"
                      title="Copy variable name"
                    >
                      <span className="ds-token-button__label">var</span>
                      <CopyIcon size="xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "var(--spacing-500)" }}>
            <h6 style={{ marginBottom: "var(--spacing-300)", fontSize: "var(--fonts-body-regular-text-size)", fontWeight: "var(--font-weight-semibold)" }}>
              Font Weight
            </h6>
            <div className="ds-spacing-table">
              <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--four-col">
                <div className="ds-spacing-table__cell">Name</div>
                <div className="ds-spacing-table__cell">CSS Variable</div>
                <div className="ds-spacing-table__cell">Value</div>
                <div className="ds-spacing-table__cell">Actions</div>
              </div>
              {fontWeights.map((weight) => (
                <div key={weight.cssVar} className="ds-spacing-table__row ds-spacing-table__row--four-col">
                  <div className="ds-spacing-table__cell" data-label="Name">
                    <code className="ds-token-row__code">{weight.name}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="CSS Variable">
                    <code className="ds-token-row__code">{weight.cssVar}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Value" style={{ fontWeight: weight.value }}>
                    {weight.value}
                  </div>
                  <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                    <button
                      className={`ds-token-button ${copiedText === weight.cssVar ? "ds-token-button--secondary" : ""}`}
                      onClick={() => handleCopy(weight.cssVar)}
                      aria-label="Copy variable name"
                      title="Copy variable name"
                    >
                      <span className="ds-token-button__label">var</span>
                      <CopyIcon size="xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h6 style={{ marginBottom: "var(--spacing-300)", fontSize: "var(--fonts-body-regular-text-size)", fontWeight: "var(--font-weight-semibold)" }}>
              Font Size & Line Height
            </h6>
            <div className="ds-spacing-table">
              <div className="ds-spacing-table__row ds-spacing-table__row--head">
                <div className="ds-spacing-table__cell">Style</div>
                <div className="ds-spacing-table__cell">Class</div>
                <div className="ds-spacing-table__cell">Font Size</div>
                <div className="ds-spacing-table__cell">Line Height</div>
                <div className="ds-spacing-table__cell">Actions</div>
              </div>
              {typographyStyles.map((style) => (
                <div key={style.className} className="ds-spacing-table__row">
                  <div className="ds-spacing-table__cell" data-label="Style">
                    <code className="ds-token-row__code">{style.name}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Class">
                    <code className="ds-token-row__code">.{style.className}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Font Size">
                    {style.fontSize}
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Line Height">
                    {style.lineHeight}
                  </div>
                  <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                    <button
                      className={`ds-token-button ${copiedText === style.className ? "ds-token-button--secondary" : ""}`}
                      onClick={() => handleCopy(style.className)}
                      aria-label="Copy class name"
                      title="Copy class name"
                    >
                      <span className="ds-token-button__label">class</span>
                      <CopyIcon size="xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="style-demos" className="ds-content__section">
          <h6 className="ds-content__section-title">Style Demos</h6>

          <div style={{ marginBottom: "var(--spacing-500)" }}>
            <h6 style={{ marginBottom: "var(--spacing-300)", fontSize: "var(--fonts-body-regular-text-size)", fontWeight: "var(--font-weight-semibold)" }}>
              Headings
            </h6>
            {headings.map((style) => (
              <div key={style.className} style={{ marginBottom: "var(--spacing-300)" }}>
                <div style={{ marginBottom: "var(--spacing-100)", display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)" }}>
                    {style.name}
                  </code>
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>
                    .{style.className}
                  </code>
                </div>
                <div className={style.className} style={{ color: "var(--fg-neutral)" }}>
                  {style.name === "H1" && "Heading One"}
                  {style.name === "H2" && "Heading Two"}
                  {style.name === "H3" && "Heading Three"}
                  {style.name === "H4" && "Heading Four"}
                  {style.name === "H5" && "Heading Five"}
                  {style.name === "H6" && "Heading Six"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "var(--spacing-500)" }}>
            <h6 style={{ marginBottom: "var(--spacing-300)", fontSize: "var(--fonts-body-regular-text-size)", fontWeight: "var(--font-weight-semibold)" }}>
              Title
            </h6>
            {titles.map((style) => (
              <div key={style.className} style={{ marginBottom: "var(--spacing-300)" }}>
                <div style={{ marginBottom: "var(--spacing-100)", display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)" }}>
                    {style.name}
                  </code>
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>
                    .{style.className}
                  </code>
                </div>
                <div className={style.className} style={{ color: "var(--fg-neutral)" }}>
                  {style.name === "Title Regular" && "Title Regular"}
                  {style.name === "Title Small" && "Title Small"}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h6 style={{ marginBottom: "var(--spacing-300)", fontSize: "var(--fonts-body-regular-text-size)", fontWeight: "var(--font-weight-semibold)" }}>
              Paragraph
            </h6>
            {paragraphs.map((style) => (
              <div key={style.className} style={{ marginBottom: "var(--spacing-300)" }}>
                <div style={{ marginBottom: "var(--spacing-100)", display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)" }}>
                    {style.name}
                  </code>
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)", color: "var(--fg-neutral-tertiary)" }}>
                    .{style.className}
                  </code>
                </div>
                <div className={style.className} style={{ color: "var(--fg-neutral)" }}>
                Beacon is a professional design system offering essential components with a focus on accessibility, scalability, and development efficiency.
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="color-previews" className="ds-content__section">
          <h6 className="ds-content__section-title">Color Previews</h6>
          <p className="ds-content__text" style={{ marginBottom: "var(--spacing-400)" }}>
            Typography shown with different semantic colors.
          </p>

          {COLOR_PREVIEWS.map((color) => {
            const paragraphStyle = paragraphs.find((s) => s.name === "Body3 Regular");

            return (
              <div key={color.cssVar} style={{ marginBottom: "var(--spacing-300)" }}>
                {paragraphStyle && (
                  <div className={paragraphStyle.className} style={{ color: `var(${color.cssVar})` }}>
                    {color.name}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </article>
    </PageLayout>
  );
}

