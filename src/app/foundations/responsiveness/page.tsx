"use client";

import { useEffect, useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type Breakpoint = "desktop" | "tablet" | "mobile";

interface BreakpointInfo {
  name: string;
  mediaQuery: string;
  deviceWidth: string;
  maxWidth?: string;
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

function useCurrentBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setBreakpoint("mobile");
      } else if (width <= 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

function useComputedResponsiveTokens() {
  const [computed, setComputed] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const tokens: Record<string, string> = {};

    // Extract device width
    tokens["--device-width"] = styles.getPropertyValue("--device-width").trim();

    // Extract menu width
    tokens["--menu-width"] = styles.getPropertyValue("--menu-width").trim();

    // Extract heading tokens
    for (let i = 1; i <= 6; i++) {
      tokens[`--heading-h${i}-text-size`] = styles.getPropertyValue(`--heading-h${i}-text-size`).trim();
      tokens[`--heading-h${i}-line-height`] = styles.getPropertyValue(`--heading-h${i}-line-height`).trim();
      tokens[`--heading-h${i}-paragraph-spacing`] = styles.getPropertyValue(`--heading-h${i}-paragraph-spacing`).trim();
      tokens[`--fonts-heading-h${i}-text-size`] = styles.getPropertyValue(`--fonts-heading-h${i}-text-size`).trim();
      tokens[`--fonts-heading-h${i}-line-height`] = styles.getPropertyValue(`--fonts-heading-h${i}-line-height`).trim();
      tokens[`--fonts-heading-h${i}-paragraph-spacing`] = styles.getPropertyValue(`--fonts-heading-h${i}-paragraph-spacing`).trim();
    }

    // Extract title tokens
    tokens["--fonts-title-small-text-size"] = styles.getPropertyValue("--fonts-title-small-text-size").trim();
    tokens["--fonts-title-small-line-height"] = styles.getPropertyValue("--fonts-title-small-line-height").trim();
    tokens["--fonts-title-small-paragraph-spacing"] = styles.getPropertyValue("--fonts-title-small-paragraph-spacing").trim();
    tokens["--fonts-title-regular-text-size"] = styles.getPropertyValue("--fonts-title-regular-text-size").trim();
    tokens["--fonts-title-regular-line-height"] = styles.getPropertyValue("--fonts-title-regular-line-height").trim();
    tokens["--fonts-title-regular-paragraph-spacing"] = styles.getPropertyValue("--fonts-title-regular-paragraph-spacing").trim();

    // Extract body tokens
    const bodySizes = ["extra-small", "small", "regular", "medium"];
    bodySizes.forEach((size) => {
      tokens[`--body-${size}-text-size`] = styles.getPropertyValue(`--body-${size}-text-size`).trim();
      tokens[`--body-${size}-line-height`] = styles.getPropertyValue(`--body-${size}-line-height`).trim();
      tokens[`--body-${size}-paragraph-spacing`] = styles.getPropertyValue(`--body-${size}-paragraph-spacing`).trim();
      tokens[`--fonts-body-${size}-text-size`] = styles.getPropertyValue(`--fonts-body-${size}-text-size`).trim();
      tokens[`--fonts-body-${size}-line-height`] = styles.getPropertyValue(`--fonts-body-${size}-line-height`).trim();
      tokens[`--fonts-body-${size}-paragraph-spacing`] = styles.getPropertyValue(`--fonts-body-${size}-paragraph-spacing`).trim();
    });

    // Extract adaptive set tokens
    const adaptiveKeys = ["d96-t80-m32", "d96-t48-m32", "d48-t32-m24", "d64-t80-m32", "d80-t64-m48", "d32-t80-m32"];
    adaptiveKeys.forEach((key) => {
      tokens[`--adaptive-set-${key}`] = styles.getPropertyValue(`--adaptive-set-${key}`).trim();
    });

    setComputed(tokens);
  }, []);

  return { computed, mounted };
}

function useBreakpointInfo(): BreakpointInfo[] {
  const { computed } = useComputedResponsiveTokens();
  const currentBreakpoint = useCurrentBreakpoint();

  return useMemo(() => {
    // These values come from the token files
    return [
      {
        name: "Desktop",
        mediaQuery: "default (no media query)",
        deviceWidth: computed["--device-width"] || "1440px",
        maxWidth: undefined,
      },
      {
        name: "Tablet",
        mediaQuery: "@media (max-width: 1024px)",
        deviceWidth: "834px",
        maxWidth: "1024px",
      },
      {
        name: "Mobile",
        mediaQuery: "@media (max-width: 768px)",
        deviceWidth: "430px",
        maxWidth: "768px",
      },
    ];
  }, [computed]);
}


// Hard-coded values from token files for accurate display
const RESPONSIVE_VALUES: Record<string, { desktop: string; tablet: string; mobile: string }> = {
  "--device-width": { desktop: "1440px", tablet: "834px", mobile: "430px" },
  "--menu-width": { desktop: "224px", tablet: "var(--device-width)", mobile: "var(--device-width)" },
  "--fonts-heading-h1-text-size": { desktop: "64px", tablet: "60px", mobile: "48px" },
  "--fonts-heading-h1-line-height": { desktop: "72px", tablet: "64px", mobile: "56px" },
  "--fonts-heading-h1-paragraph-spacing": { desktop: "72px", tablet: "64px", mobile: "56px" },
  "--fonts-heading-h2-text-size": { desktop: "52px", tablet: "48px", mobile: "40px" },
  "--fonts-heading-h2-line-height": { desktop: "60px", tablet: "56px", mobile: "48px" },
  "--fonts-heading-h2-paragraph-spacing": { desktop: "60px", tablet: "56px", mobile: "48px" },
  "--fonts-heading-h3-text-size": { desktop: "40px", tablet: "36px", mobile: "32px" },
  "--fonts-heading-h3-line-height": { desktop: "48px", tablet: "40px", mobile: "36px" },
  "--fonts-heading-h3-paragraph-spacing": { desktop: "48px", tablet: "40px", mobile: "36px" },
  "--fonts-heading-h4-text-size": { desktop: "32px", tablet: "32px", mobile: "28px" },
  "--fonts-heading-h4-line-height": { desktop: "36px", tablet: "36px", mobile: "32px" },
  "--fonts-heading-h4-paragraph-spacing": { desktop: "36px", tablet: "36px", mobile: "32px" },
  "--fonts-heading-h5-text-size": { desktop: "24px", tablet: "24px", mobile: "24px" },
  "--fonts-heading-h5-line-height": { desktop: "28px", tablet: "28px", mobile: "28px" },
  "--fonts-heading-h5-paragraph-spacing": { desktop: "28px", tablet: "28px", mobile: "28px" },
  "--fonts-heading-h6-text-size": { desktop: "20px", tablet: "20px", mobile: "20px" },
  "--fonts-heading-h6-line-height": { desktop: "24px", tablet: "24px", mobile: "24px" },
  "--fonts-heading-h6-paragraph-spacing": { desktop: "24px", tablet: "24px", mobile: "24px" },
  "--fonts-title-small-text-size": { desktop: "16px", tablet: "16px", mobile: "16px" },
  "--fonts-title-regular-text-size": { desktop: "20px", tablet: "20px", mobile: "20px" },
  "--fonts-body-extra-small-text-size": { desktop: "12px", tablet: "12px", mobile: "12px" },
  "--fonts-body-small-text-size": { desktop: "14px", tablet: "14px", mobile: "14px" },
  "--fonts-body-regular-text-size": { desktop: "16px", tablet: "16px", mobile: "16px" },
  "--fonts-body-medium-text-size": { desktop: "20px", tablet: "20px", mobile: "20px" },
};

export default function ResponsivenessPage() {
  const { theme } = useTheme();
  const { computed, mounted } = useComputedResponsiveTokens();
  const currentBreakpoint = useCurrentBreakpoint();
  const breakpointInfo = useBreakpointInfo();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "breakpoints", label: "Breakpoints" },
      { id: "device-width", label: "Device Width" },
      { id: "responsive-typography", label: "Responsive Typography" },
      { id: "adaptive-sets", label: "Adaptive Sets" },
      { id: "visibility-tokens", label: "Visibility Tokens" },
      { id: "menu-width", label: "Menu Width" },
      { id: "usage-guidance", label: "Usage Guidance" },
    ];
  }, []);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setCopiedText(text);
    window.setTimeout(() => setCopiedText(null), 1200);
  };

  const handleCopyCode = async (code: string, blockId: string) => {
    await copyToClipboard(code);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  if (!mounted) {
    return (
      <PageLayout tocItems={tocItems} currentPath="/foundations/responsiveness">
        <article className="ds-content">
          <header className="ds-content__header">
            <h3 className="ds-content__title">Responsiveness</h3>
            <p className="ds-content__subtitle">Loading responsive tokens...</p>
          </header>
        </article>
      </PageLayout>
    );
  }

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/responsiveness">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Responsiveness</h3>
          <p className="ds-content__subtitle">
            Responsive design system with breakpoint-aware tokens that adapt to different screen sizes. Current breakpoint:{" "}
            <strong style={{ textTransform: "capitalize" }}>{currentBreakpoint}</strong>
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Beacon uses a responsive design system with three breakpoints (Desktop, Tablet, Mobile) that automatically adjust token values based on viewport size. Responsive tokens are implemented using CSS media queries, ensuring consistent scaling across devices.
          </p>
          <p className="ds-content__text">
            The responsive system works in conjunction with other foundation tokens:
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>Typography tokens</strong> scale down for smaller screens to maintain readability
            </li>
            <li>
              <strong>Adaptive sets</strong> (documented in the <a href="/foundations/spacing" className="ds-content__link">Spacing page</a>) provide breakpoint-aware spacing values
            </li>
            <li>
              <strong>Layout tokens</strong> like menu width adapt to device constraints
            </li>
            <li>
              <strong>Visibility tokens</strong> enable conditional rendering based on breakpoint
            </li>
          </ul>
          <div className="ds-token-mapping">
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Desktop</h6>
              </div>
              <code className="ds-token-mapping__example">Default (≥1025px)</code>
              <p className="ds-token-mapping__desc">
                Default breakpoint for desktop screens. All responsive tokens use desktop values unless overridden by media queries.
              </p>
            </div>
            <div className="ds-token-mapping__arrow">↓</div>
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Tablet</h6>
              </div>
              <code className="ds-token-mapping__example">@media (max-width: 1024px)</code>
              <p className="ds-token-mapping__desc">
                Tablet breakpoint for screens up to 1024px wide. Typography and spacing tokens scale down appropriately.
              </p>
            </div>
            <div className="ds-token-mapping__arrow">↓</div>
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Mobile</h6>
              </div>
              <code className="ds-token-mapping__example">@media (max-width: 768px)</code>
              <p className="ds-token-mapping__desc">
                Mobile breakpoint for screens up to 768px wide. Most tokens reach their smallest values at this breakpoint.
              </p>
            </div>
          </div>
        </section>

        <section id="breakpoints" className="ds-content__section">
          <h6 className="ds-content__section-title">Breakpoints</h6>
          <p className="ds-content__text">
            The design system uses three breakpoints defined by CSS media queries. Each breakpoint has an associated device width token that represents the target viewport size.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--four-col">
              <div className="ds-spacing-table__cell">Breakpoint</div>
              <div className="ds-spacing-table__cell">Media Query</div>
              <div className="ds-spacing-table__cell">Device Width</div>
              <div className="ds-spacing-table__cell">Status</div>
            </div>
            {breakpointInfo.map((bp) => (
              <div key={bp.name} className="ds-spacing-table__row ds-spacing-table__row--four-col">
                <div className="ds-spacing-table__cell" data-label="Breakpoint">
                  <code className="ds-token-row__code">{bp.name}</code>
                </div>
                <div className="ds-spacing-table__cell" data-label="Media Query">
                  <code className="ds-token-row__code" style={{ fontSize: "var(--fonts-body-small-text-size)" }}>
                    {bp.mediaQuery}
                  </code>
                </div>
                <div className="ds-spacing-table__cell" data-label="Device Width">
                  {bp.deviceWidth}
                </div>
                <div className="ds-spacing-table__cell" data-label="Status">
                  {currentBreakpoint === bp.name.toLowerCase() ? (
                    <span style={{ color: "var(--fg-success)", fontWeight: "var(--font-weight-semibold)" }}>Active</span>
                  ) : (
                    <span style={{ color: "var(--fg-neutral-secondary)" }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="device-width" className="ds-content__section">
          <h6 className="ds-content__section-title">Device Width</h6>
          <p className="ds-content__text">
            The <code>--device-width</code> token represents the target viewport width for each breakpoint. This token is used by layout components and can be referenced in your CSS.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--responsive">
              <div className="ds-spacing-table__cell">Token</div>
              <div className="ds-spacing-table__cell">CSS Variable</div>
              <div className="ds-spacing-table__cell">Desktop</div>
              <div className="ds-spacing-table__cell">Tablet</div>
              <div className="ds-spacing-table__cell">Mobile</div>
              <div className="ds-spacing-table__cell">Actions</div>
            </div>
            <div className="ds-spacing-table__row ds-spacing-table__row--responsive">
              <div className="ds-spacing-table__cell" data-label="Token">
                <code className="ds-token-row__code">Device Width</code>
              </div>
              <div className="ds-spacing-table__cell" data-label="CSS Variable">
                <code className="ds-token-row__code">--device-width</code>
              </div>
              <div className="ds-spacing-table__cell" data-label="Desktop">
                {RESPONSIVE_VALUES["--device-width"].desktop}
              </div>
              <div className="ds-spacing-table__cell" data-label="Tablet">
                {RESPONSIVE_VALUES["--device-width"].tablet}
              </div>
              <div className="ds-spacing-table__cell" data-label="Mobile">
                {RESPONSIVE_VALUES["--device-width"].mobile}
              </div>
              <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                <button
                  className={`ds-token-button ${copiedText === "--device-width" ? "ds-token-button--secondary" : ""}`}
                  onClick={() => handleCopy("--device-width")}
                  aria-label="Copy variable name"
                  title="Copy variable name"
                >
                  <span className="ds-token-button__label">var</span>
                  <CopyIcon size="xs" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="responsive-typography" className="ds-content__section">
          <h6 className="ds-content__section-title">Responsive Typography</h6>
          <p className="ds-content__text">
            Typography tokens automatically scale down for smaller screens to maintain readability and visual hierarchy. Heading sizes scale more aggressively than body text.
          </p>

          <div style={{ marginBottom: "var(--spacing-500)" }}>
            <h6 className="text-body3-regular" style={{ marginBottom: "var(--spacing-300)", fontWeight: "var(--font-weight-secondary-semibold)" }}>
              Headings
            </h6>
            <div className="ds-spacing-table">
              <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--responsive">
                <div className="ds-spacing-table__cell">Token</div>
                <div className="ds-spacing-table__cell">CSS Variable</div>
                <div className="ds-spacing-table__cell">Desktop</div>
                <div className="ds-spacing-table__cell">Tablet</div>
                <div className="ds-spacing-table__cell">Mobile</div>
                <div className="ds-spacing-table__cell">Actions</div>
              </div>
              {Object.entries(RESPONSIVE_VALUES)
                .filter(([key]) => key.startsWith("--heading-"))
                .map(([key, values]) => (
                  <div key={key} className="ds-spacing-table__row ds-spacing-table__row--responsive">
                    <div className="ds-spacing-table__cell" data-label="Token">
                      <code className="ds-token-row__code">{key.replace("--heading-", "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</code>
                    </div>
                    <div className="ds-spacing-table__cell" data-label="CSS Variable">
                      <code className="ds-token-row__code">{key}</code>
                    </div>
                    <div className="ds-spacing-table__cell" data-label="Desktop">
                      {values.desktop}
                    </div>
                    <div className="ds-spacing-table__cell" data-label="Tablet">
                      {values.tablet}
                    </div>
                    <div className="ds-spacing-table__cell" data-label="Mobile">
                      {values.mobile}
                    </div>
                    <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                      <button
                        className={`ds-token-button ${copiedText === key ? "ds-token-button--secondary" : ""}`}
                        onClick={() => handleCopy(key)}
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
            <h6 className="text-body3-regular" style={{ marginBottom: "var(--spacing-300)", fontWeight: "var(--font-weight-secondary-semibold)" }}>
              Titles & Body
            </h6>
            <div className="ds-spacing-table">
              <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--responsive">
                <div className="ds-spacing-table__cell">Token</div>
                <div className="ds-spacing-table__cell">CSS Variable</div>
                <div className="ds-spacing-table__cell">Desktop</div>
                <div className="ds-spacing-table__cell">Tablet</div>
                <div className="ds-spacing-table__cell">Mobile</div>
                <div className="ds-spacing-table__cell">Actions</div>
              </div>
              {Object.entries(RESPONSIVE_VALUES)
                .filter(([key]) => key.startsWith("--fonts-"))
                .map(([key, values]) => (
                  <div key={key} className="ds-spacing-table__row ds-spacing-table__row--responsive">
                    <div className="ds-spacing-table__cell" data-label="Token">
                      <code className="ds-token-row__code">
                        {key
                          .replace("--fonts-", "")
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </code>
                    </div>
                    <div className="ds-spacing-table__cell" data-label="CSS Variable">
                      <code className="ds-token-row__code">{key}</code>
                    </div>
                    <div className="ds-spacing-table__cell" data-label="Desktop">
                      {values.desktop}
                    </div>
                    <div className="ds-spacing-table__cell" data-label="Tablet">
                      {values.tablet}
                    </div>
                    <div className="ds-spacing-table__cell" data-label="Mobile">
                      {values.mobile}
                    </div>
                    <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                      <button
                        className={`ds-token-button ${copiedText === key ? "ds-token-button--secondary" : ""}`}
                        onClick={() => handleCopy(key)}
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
        </section>

        <section id="adaptive-sets" className="ds-content__section">
          <h6 className="ds-content__section-title">Adaptive Sets</h6>
          <p className="ds-content__text">
            Adaptive sets are breakpoint-aware spacing tokens that automatically adjust their values based on screen size. These tokens are fully documented in the <a href="/foundations/spacing" className="ds-content__link">Spacing page</a>.
          </p>
          <p className="ds-content__text">
            Adaptive sets follow the naming pattern <code>--adaptive-set-d{"{desktop}"}-t{"{tablet}"}-m{"{mobile}"}</code>, where the values represent pixel values for each breakpoint.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--responsive-5col">
              <div className="ds-spacing-table__cell">Token</div>
              <div className="ds-spacing-table__cell">CSS Variable</div>
              <div className="ds-spacing-table__cell">Desktop</div>
              <div className="ds-spacing-table__cell">Tablet</div>
              <div className="ds-spacing-table__cell">Mobile</div>
            </div>
            {[
              { name: "d96-t80-m32", desktop: "96px", tablet: "80px", mobile: "32px" },
              { name: "d96-t48-m32", desktop: "96px", tablet: "48px", mobile: "32px" },
              { name: "d48-t32-m24", desktop: "48px", tablet: "32px", mobile: "24px" },
              { name: "d64-t80-m32", desktop: "64px", tablet: "80px", mobile: "32px" },
              { name: "d80-t64-m48", desktop: "80px", tablet: "64px", mobile: "48px" },
              { name: "d32-t80-m32", desktop: "32px", tablet: "80px", mobile: "32px" },
            ].map((set) => (
              <div key={set.name} className="ds-spacing-table__row ds-spacing-table__row--responsive-5col">
                <div className="ds-spacing-table__cell" data-label="Token">
                  <code className="ds-token-row__code">{set.name}</code>
                </div>
                <div className="ds-spacing-table__cell" data-label="CSS Variable">
                  <code className="ds-token-row__code">--adaptive-set-{set.name}</code>
                </div>
                <div className="ds-spacing-table__cell" data-label="Desktop">
                  {set.desktop}
                </div>
                <div className="ds-spacing-table__cell" data-label="Tablet">
                  {set.tablet}
                </div>
                <div className="ds-spacing-table__cell" data-label="Mobile">
                  {set.mobile}
                </div>
              </div>
            ))}
          </div>
          <p className="ds-content__text" style={{ marginTop: "var(--spacing-400)" }}>
            For detailed information and usage examples, see the <a href="/foundations/spacing#responsive" className="ds-content__link">Responsive section</a> of the Spacing page.
          </p>
        </section>

        <section id="visibility-tokens" className="ds-content__section">
          <h6 className="ds-content__section-title">Visibility Tokens</h6>
          <p className="ds-content__text">
            Visibility tokens are boolean CSS custom properties that indicate whether content should be visible at specific breakpoints. These tokens are defined in the responsive token files but are intended for use in JavaScript/React for conditional rendering rather than CSS.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head">
              <div className="ds-spacing-table__cell">Token</div>
              <div className="ds-spacing-table__cell">Desktop</div>
              <div className="ds-spacing-table__cell">Tablet</div>
              <div className="ds-spacing-table__cell">Mobile</div>
              <div className="ds-spacing-table__cell">Usage</div>
            </div>
            {[
              {
                token: "--visibility-only-desktop",
                desktop: "true",
                tablet: "false",
                mobile: "false",
                usage: "Show only on desktop screens",
              },
              {
                token: "--visibility-only-mobile",
                desktop: "false",
                tablet: "false",
                mobile: "true",
                usage: "Show only on mobile screens",
              },
              {
                token: "--visibility-desktop-tablet",
                desktop: "true",
                tablet: "true",
                mobile: "false",
                usage: "Show on desktop and tablet, hide on mobile",
              },
              {
                token: "--visibility-tablet-mobile",
                desktop: "false",
                tablet: "true",
                mobile: "true",
                usage: "Show on tablet and mobile, hide on desktop",
              },
            ].map((item) => (
              <div key={item.token} className="ds-spacing-table__row">
                <div className="ds-spacing-table__cell" data-label="Token">
                  <code className="ds-token-row__code">{item.token}</code>
                </div>
                <div className="ds-spacing-table__cell" data-label="Desktop">
                  <span style={{ color: item.desktop === "true" ? "var(--fg-success)" : "var(--fg-neutral-secondary)" }}>
                    {item.desktop}
                  </span>
                </div>
                <div className="ds-spacing-table__cell" data-label="Tablet">
                  <span style={{ color: item.tablet === "true" ? "var(--fg-success)" : "var(--fg-neutral-secondary)" }}>
                    {item.tablet}
                  </span>
                </div>
                <div className="ds-spacing-table__cell" data-label="Mobile">
                  <span style={{ color: item.mobile === "true" ? "var(--fg-success)" : "var(--fg-neutral-secondary)" }}>
                    {item.mobile}
                  </span>
                </div>
                <div className="ds-spacing-table__cell" data-label="Usage">
                  {item.usage}
                </div>
              </div>
            ))}
          </div>
          <div className="ds-content__subsection" style={{ marginTop: "var(--spacing-400)" }}>
            <h6 className="ds-content__subsection-title">Usage Example</h6>
            <p className="ds-content__text">
              In React, you can use these tokens with the <code>useCurrentBreakpoint</code> hook or check the computed value:
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`function ResponsiveComponent() {
                const breakpoint = useCurrentBreakpoint();
                return (
                  <>
                    {breakpoint === "desktop" && <DesktopOnlyContent />}
                    {breakpoint !== "mobile" && <DesktopTabletContent />}
                  </>
                );
              }`, "tsx-1")}
                aria-label="Copy code"
              >
                {copiedBlock === "tsx-1" ? (
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
                {`function ResponsiveComponent() {
                const breakpoint = useCurrentBreakpoint();
                
                return (
                  <>
                    {breakpoint === "desktop" && <DesktopOnlyContent />}
                    {breakpoint !== "mobile" && <DesktopTabletContent />}
                  </>
                );
              }`}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>

        <section id="menu-width" className="ds-content__section">
          <h6 className="ds-content__section-title">Menu Width</h6>
          <p className="ds-content__text">
            The <code>--menu-width</code> token controls the width of navigation menus. On desktop, it uses a fixed value, while on tablet and mobile it adapts to the full device width.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--responsive">
              <div className="ds-spacing-table__cell">Token</div>
              <div className="ds-spacing-table__cell">CSS Variable</div>
              <div className="ds-spacing-table__cell">Desktop</div>
              <div className="ds-spacing-table__cell">Tablet</div>
              <div className="ds-spacing-table__cell">Mobile</div>
              <div className="ds-spacing-table__cell">Actions</div>
            </div>
            <div className="ds-spacing-table__row ds-spacing-table__row--responsive">
              <div className="ds-spacing-table__cell" data-label="Token">
                <code className="ds-token-row__code">Menu Width</code>
              </div>
              <div className="ds-spacing-table__cell" data-label="CSS Variable">
                <code className="ds-token-row__code">--menu-width</code>
              </div>
              <div className="ds-spacing-table__cell" data-label="Desktop">
                {RESPONSIVE_VALUES["--menu-width"].desktop}
              </div>
              <div className="ds-spacing-table__cell" data-label="Tablet">
                <code style={{ fontSize: "var(--fonts-body-small-text-size)" }}>{RESPONSIVE_VALUES["--menu-width"].tablet}</code>
              </div>
              <div className="ds-spacing-table__cell" data-label="Mobile">
                <code style={{ fontSize: "var(--fonts-body-small-text-size)" }}>{RESPONSIVE_VALUES["--menu-width"].mobile}</code>
              </div>
              <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                <button
                  className={`ds-token-button ${copiedText === "--menu-width" ? "ds-token-button--secondary" : ""}`}
                  onClick={() => handleCopy("--menu-width")}
                  aria-label="Copy variable name"
                  title="Copy variable name"
                >
                  <span className="ds-token-button__label">var</span>
                  <CopyIcon size="xs" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="usage-guidance" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidance</h6>
          <p className="ds-content__text">
            Best practices for working with responsive tokens in your components:
          </p>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Use Responsive Tokens</h6>
            <p className="ds-content__text">
              Always use responsive tokens instead of hard-coding breakpoint-specific values. The tokens automatically adapt based on the current viewport size.
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`/* Good */
                  font-size: var(--fonts-heading-h1-text-size);
                  padding: var(--adaptive-set-d96-t80-m32);

                  /* Bad */
                  font-size: 64px; /* Only works on desktop */
                  @media (max-width: 1024px) {
                    font-size: 60px;
                  }`, "css-1")}
                aria-label="Copy code"
              >
                {copiedBlock === "css-1" ? (
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
                language="css"
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
                {`/* Good */
                font-size: var(--fonts-heading-h1-text-size);
                padding: var(--adaptive-set-d96-t80-m32);

                /* Bad */
                font-size: 64px; /* Only works on desktop */
                @media (max-width: 1024px) {
                  font-size: 60px;
                }`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Testing Across Breakpoints</h6>
            <ul className="ds-content__bullet-list">
              <li>
                Use browser DevTools to test at different viewport sizes (Desktop: 1440px, Tablet: 834px, Mobile: 430px)
              </li>
              <li>
                Test typography scaling to ensure readability at all breakpoints
              </li>
              <li>
                Verify that adaptive spacing tokens provide appropriate spacing for each breakpoint
              </li>
              <li>
                Check that visibility tokens work correctly for conditional rendering
              </li>
            </ul>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Media Query Patterns</h6>
            <p className="ds-content__text">
              When you need custom responsive behavior beyond what tokens provide, use the standard breakpoints:
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`/* Tablet and below */
                  @media (max-width: 1024px) {
                    /* Your styles */
                  }

                  /* Mobile only */
                  @media (max-width: 768px) {
                    /* Your styles */
                  }`, "css-2")}
                aria-label="Copy code"
              >
                {copiedBlock === "css-2" ? (
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
                language="css"
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
                {`/* Tablet and below */
                @media (max-width: 1024px) {
                  /* Your styles */
                }

                /* Mobile only */
                @media (max-width: 768px) {
                  /* Your styles */
                }`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">When to Use Fixed vs Responsive Values</h6>
            <ul className="ds-content__bullet-list">
              <li>
                <strong>Use responsive tokens</strong> for typography, spacing, and layout dimensions that should adapt to screen size
              </li>
              <li>
                <strong>Use fixed values</strong> for elements that should remain constant (e.g., icon sizes, border widths)
              </li>
              <li>
                <strong>Use adaptive sets</strong> for layout-level spacing (page padding, container margins)
              </li>
              <li>
                <strong>Use semantic spacing tokens</strong> for component-level spacing (gaps, padding within components)
              </li>
            </ul>
          </div>

          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use responsive typography tokens for all text elements</li>
                <li>Test your components at all three breakpoints</li>
                <li>Use adaptive sets for layout spacing</li>
                <li>Leverage visibility tokens for conditional rendering</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't hard-code breakpoint-specific values</li>
                <li>Don't create custom media queries for values that tokens already handle</li>
                <li>Don't assume all tokens are responsive (check documentation)</li>
                <li>Don't mix fixed and responsive values inconsistently</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

