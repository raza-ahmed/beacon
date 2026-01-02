"use client";

import { useEffect, useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { TokenCopyButton } from "@/components/TokenCopyButton";

interface ScaleToken {
  name: string;
  cssVar: `--scale-${string}`;
  value: string;
}

interface SpacingToken {
  name: string;
  cssVar: `--spacing-${string}`;
  references: string;
  resolvedValue: string;
}

interface AdaptiveToken {
  name: string;
  cssVar: `--adaptive-set-${string}`;
  desktop: string;
  tablet: string;
  mobile: string;
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

function parseVarFunction(input: string): { name: `--${string}`; fallback?: string } | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("var(")) return null;
  const m = trimmed.match(/^var\(\s*(--[^,\s)]+)\s*(?:,\s*([^)]+))?\s*\)$/);
  if (!m) return null;
  return { name: m[1] as `--${string}`, fallback: m[2]?.trim() };
}

function resolveCssVarValue(
  cssVar: `--${string}`,
  computed: Record<string, string>,
  depth = 0
): string {
  if (depth > 12) return computed[cssVar] ?? "";
  const raw = (computed[cssVar] ?? "").trim();
  if (!raw) return "";

  const parsed = parseVarFunction(raw);
  if (!parsed) return raw;

  const next = computed[parsed.name]?.trim();
  if (next) return resolveCssVarValue(parsed.name, computed, depth + 1);

  if (parsed.fallback) {
    const fallbackParsed = parseVarFunction(parsed.fallback);
    if (fallbackParsed) return resolveCssVarValue(fallbackParsed.name, computed, depth + 1);
    return parsed.fallback;
  }

  return raw;
}

function useComputedTokens() {
  const [computed, setComputed] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const tokens: Record<string, string> = {};

    // Extract all scale tokens
    const scaleKeys = ["0", "25", "50", "100", "150", "200", "300", "400", "450", "500", "550", "600", "650", "700", "800", "900", "1000", "2000"];
    scaleKeys.forEach((key) => {
      const varName = `--scale-${key}`;
      tokens[varName] = styles.getPropertyValue(varName).trim();
    });

    // Extract all spacing tokens
    const spacingKeys = ["none", "50", "100", "200", "300", "400", "450", "500", "600", "650", "700", "800", "900", "1000", "2000"];
    spacingKeys.forEach((key) => {
      const varName = `--spacing-${key}`;
      tokens[varName] = styles.getPropertyValue(varName).trim();
    });

    // Extract adaptive set tokens
    const adaptiveKeys = ["d96-t80-m32", "d96-t48-m32", "d48-t32-m24", "d64-t80-m32", "d80-t64-m48", "d32-t80-m32"];
    adaptiveKeys.forEach((key) => {
      const varName = `--adaptive-set-${key}`;
      tokens[varName] = styles.getPropertyValue(varName).trim();
    });

    setComputed(tokens);
  }, []);

  return { computed, mounted };
}

function useScaleTokens(computed: Record<string, string>): ScaleToken[] {
  return useMemo(() => {
    const scaleOrder = ["0", "25", "50", "100", "150", "200", "300", "400", "450", "500", "550", "600", "650", "700", "800", "900", "1000", "2000"];
    return scaleOrder.map((key) => {
      const cssVar = `--scale-${key}` as `--scale-${string}`;
      const value = computed[cssVar] || "";
      return {
        name: `Scale.${key}`,
        cssVar,
        value,
      };
    });
  }, [computed]);
}

function useSpacingTokens(computed: Record<string, string>): SpacingToken[] {
  return useMemo(() => {
    const spacingMap: Record<string, string> = {
      none: "0",
      "50": "50",
      "100": "100",
      "200": "200",
      "300": "300",
      "400": "400",
      "450": "450",
      "500": "500",
      "600": "600",
      "650": "650",
      "700": "700",
      "800": "800",
      "900": "900",
      "1000": "1000",
      "2000": "2000",
    };

    const spacingOrder = ["none", "50", "100", "200", "300", "400", "450", "500", "600", "650", "700", "800", "900", "1000", "2000"];

    return spacingOrder.map((key) => {
      const cssVar = `--spacing-${key}` as `--spacing-${string}`;
      const rawValue = computed[cssVar] || "";
      const resolvedValue = resolveCssVarValue(cssVar, computed);
      const scaleKey = spacingMap[key];
      const references = scaleKey === "0" ? `var(--scale-0)` : `var(--scale-${scaleKey})`;

      return {
        name: key === "none" ? "Spacing.None" : `Spacing.${key}`,
        cssVar,
        references,
        resolvedValue,
      };
    });
  }, [computed]);
}

function useAdaptiveTokens(computed: Record<string, string>): AdaptiveToken[] {
  return useMemo(() => {
    const adaptiveKeys = ["d96-t80-m32", "d96-t48-m32", "d48-t32-m24", "d64-t80-m32", "d80-t64-m48", "d32-t80-m32"];

    return adaptiveKeys.map((key) => {
      const cssVar = `--adaptive-set-${key}` as `--adaptive-set-${string}`;
      
      // Parse values from token name: d96-t80-m32 -> desktop=96px, tablet=80px, mobile=32px
      const match = key.match(/^d(\d+)-t(\d+)-m(\d+)$/);
      const desktop = match ? `${match[1]}px` : computed[cssVar] || "";
      const tablet = match ? `${match[2]}px` : computed[cssVar] || "";
      const mobile = match ? `${match[3]}px` : computed[cssVar] || "";

      return {
        name: `${key}`,
        cssVar,
        desktop,
        tablet,
        mobile,
      };
    });
  }, [computed]);
}

function SpacingBar({ value, cssVar }: { value: string; cssVar: string }) {
  const pxValue = parseFloat(value) || 0;
  const maxWidth = 400;
  const width = Math.min(pxValue, maxWidth);

  return (
    <div className="ds-spacing-bar">
      <div
        className="ds-spacing-bar__fill"
        style={{
          width: `${width}px`,
          maxWidth: "100%",
        }}
      />
      <span className="ds-spacing-bar__label">{value}</span>
    </div>
  );
}

export default function SpacingPage() {
  const { computed, mounted } = useComputedTokens();
  const scaleTokens = useScaleTokens(computed);
  const spacingTokens = useSpacingTokens(computed);
  const adaptiveTokens = useAdaptiveTokens(computed);
  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "primitives", label: "Primitives" },
      { id: "semantic", label: "Semantic" },
      { id: "responsive", label: "Responsive" },
    ];
  }, []);

  if (!mounted) {
    return (
      <PageLayout tocItems={tocItems} currentPath="/foundations/spacing">
        <article className="ds-content">
          <header className="ds-content__header">
            <h3 className="ds-content__title">Spacing</h3>
            <p className="ds-content__subtitle">Loading spacing tokens...</p>
          </header>
        </article>
      </PageLayout>
    );
  }

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/spacing">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Spacing</h3>
          <p className="ds-content__subtitle">
            Spacing tokens are organized in three layers: Primitives (base scale values), Semantic (named spacing tokens), and Responsive (breakpoint-aware adaptive sets).
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            The spacing system follows a three-layer architecture that provides flexibility and consistency across different contexts:
          </p>
          <div className="ds-token-mapping">
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Primitives (Scale)</h6>
              </div>
              <code className="ds-token-mapping__example">--scale-100</code>
              <p className="ds-token-mapping__desc">
                Base dimension values that form the foundation of the spacing system. These are raw pixel values (0px, 1px, 2px, 4px, etc.) that should rarely be used directly in components.
              </p>
            </div>
            <div className="ds-token-mapping__arrow">↓</div>
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Semantic (Spacing)</h6>
              </div>
              <code className="ds-token-mapping__example">--spacing-100</code>
              <p className="ds-token-mapping__desc">
                Named spacing tokens that reference Scale values. These provide semantic meaning and are the primary tokens to use in component styling. Examples: spacing-100, spacing-200, spacing-500.
              </p>
            </div>
            <div className="ds-token-mapping__arrow">↓</div>
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Responsive (Adaptive Sets)</h6>
              </div>
              <code className="ds-token-mapping__example">--adaptive-set-d96-t80-m32</code>
              <p className="ds-token-mapping__desc">
                Breakpoint-aware spacing tokens that adapt to different screen sizes. These tokens automatically adjust their values based on device breakpoints (Desktop, Tablet, Mobile). Use these for layout spacing that needs to be responsive.
              </p>
            </div>
          </div>
          <div className="ds-token-mapping__example-box" style={{ marginTop: "var(--spacing-400)" }}>
            <p className="ds-content__text">
              <strong>When to use each layer:</strong>
            </p>
            <ul className="ds-content__bullet-list">
              <li>
                <strong>Primitives:</strong> Only use when creating new semantic tokens or for very specific edge cases.
              </li>
              <li>
                <strong>Semantic:</strong> Use for all component spacing (padding, margins, gaps). This is the default choice.
              </li>
              <li>
                <strong>Responsive:</strong> Use for layout-level spacing that needs to adapt to screen size (e.g., page padding, container margins).
              </li>
            </ul>
          </div>
        </section>

        <section id="primitives" className="ds-content__section">
          <h6 className="ds-content__section-title">Primitives</h6>
          <p className="ds-content__text">
            Base scale values that form the foundation of the spacing system. These are raw dimension values that semantic tokens reference.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head">
              <div className="ds-spacing-table__cell">Token</div>
              <div className="ds-spacing-table__cell">CSS Variable</div>
              <div className="ds-spacing-table__cell">Value</div>
              <div className="ds-spacing-table__cell">Visual</div>
              <div className="ds-spacing-table__cell">Actions</div>
            </div>
            {scaleTokens.map((token) => {
              const pxValue = parseFloat(token.value) || 0;
              const showVisual = pxValue <= 32; // Only show visual for values <= 32px
              return (
                <div key={token.cssVar} className="ds-spacing-table__row">
                  <div className="ds-spacing-table__cell" data-label="Token">
                    <code className="ds-token-row__code">{token.name}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="CSS Variable">
                    <code className="ds-token-row__code">{token.cssVar}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Value">{token.value}</div>
                  <div className="ds-spacing-table__cell" data-label="Visual">
                    {showVisual ? <SpacingBar value={token.value} cssVar={token.cssVar} /> : <span style={{ color: "var(--fg-neutral-secondary)" }}>—</span>}
                  </div>
                  <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                    <TokenCopyButton text={token.cssVar} label="var" />
                    <TokenCopyButton text={token.value} label="raw" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="semantic" className="ds-content__section">
          <h6 className="ds-content__section-title">Semantic</h6>
          <p className="ds-content__text">
            Named spacing tokens that reference Scale values. These are the primary tokens to use in component styling.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--semantic">
              <div className="ds-spacing-table__cell">Token</div>
              <div className="ds-spacing-table__cell">CSS Variable</div>
              <div className="ds-spacing-table__cell">References</div>
              <div className="ds-spacing-table__cell">Value</div>
              <div className="ds-spacing-table__cell">Actions</div>
            </div>
            {spacingTokens.map((token) => {
              return (
                <div key={token.cssVar} className="ds-spacing-table__row ds-spacing-table__row--semantic">
                  <div className="ds-spacing-table__cell" data-label="Token">
                    <code className="ds-token-row__code">{token.name}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="CSS Variable">
                    <code className="ds-token-row__code">{token.cssVar}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="References">
                    <code className="ds-token-row__code">{token.references}</code>
                  </div>
                  <div className="ds-spacing-table__cell" data-label="Value">{token.resolvedValue}</div>
                  <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                    <TokenCopyButton text={token.cssVar} label="var" />
                    <TokenCopyButton text={token.resolvedValue} label="raw" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="responsive" className="ds-content__section">
          <h6 className="ds-content__section-title">Responsive</h6>
          <p className="ds-content__text">
            Breakpoint-aware spacing tokens that adapt to different screen sizes. These tokens automatically adjust their values based on device breakpoints.
          </p>
          <div className="ds-spacing-table">
            <div className="ds-spacing-table__row ds-spacing-table__row--head ds-spacing-table__row--responsive">
              <div className="ds-spacing-table__cell">Adaptive Set Token</div>
              <div className="ds-spacing-table__cell">CSS Variable</div>
              <div className="ds-spacing-table__cell">Desktop</div>
              <div className="ds-spacing-table__cell">Tablet</div>
              <div className="ds-spacing-table__cell">Mobile</div>
              <div className="ds-spacing-table__cell">Actions</div>
            </div>
            {adaptiveTokens.map((token) => (
              <div key={token.cssVar} className="ds-spacing-table__row ds-spacing-table__row--responsive">
                <div className="ds-spacing-table__cell" data-label="Token">
                  <code className="ds-token-row__code">{token.name}</code>
                </div>
                <div className="ds-spacing-table__cell" data-label="CSS Variable">
                  <code className="ds-token-row__code">{token.cssVar}</code>
                </div>
                <div className="ds-spacing-table__cell" data-label="Desktop">{token.desktop}</div>
                <div className="ds-spacing-table__cell" data-label="Tablet">{token.tablet}</div>
                <div className="ds-spacing-table__cell" data-label="Mobile">{token.mobile}</div>
                <div className="ds-spacing-table__cell ds-spacing-table__cell--actions" data-label="Actions">
                  <TokenCopyButton text={token.cssVar} label="var" />
                  <TokenCopyButton text={token.desktop} label="raw" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

