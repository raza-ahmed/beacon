"use client";

import { useMemo } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";

interface Pattern {
  id: string;
  name: string;
  category: string;
  className: string;
}

const PATTERNS: Pattern[] = [
  // Dot patterns
  { id: "dot-subtle", name: "Subtle", category: "Dot", className: "dot-subtle" },
  { id: "dot-halftone", name: "Halftone", category: "Dot", className: "dot-halftone" },
  { id: "dot-polka", name: "Polka", category: "Dot", className: "dot-polka" },
  { id: "dot-stars", name: "Stars", category: "Dot", className: "dot-stars" },
  { id: "dot-node", name: "Node", category: "Dot", className: "dot-node" },
  { id: "dot-striped", name: "Striped", category: "Dot", className: "dot-striped" },
  // Line patterns
  { id: "line-vertical", name: "Vertical", category: "Line", className: "line-vertical" },
  { id: "line-horizontal", name: "Horizontal", category: "Line", className: "line-horizontal" },
  { id: "line-stacked", name: "Stacked", category: "Line", className: "line-stacked" },
  { id: "line-hashrate", name: "Hashrate", category: "Line", className: "line-hashrate" },
  { id: "line-diagonal", name: "Diagonal", category: "Line", className: "line-diagonal" },
  // Grid patterns
  { id: "grid-soft", name: "Soft", category: "Grid", className: "grid-soft" },
  { id: "grid-offset", name: "Offset", category: "Grid", className: "grid-offset" },
  { id: "grid-graph", name: "Graph", category: "Grid", className: "grid-graph" },
  { id: "grid-nested", name: "Nested", category: "Grid", className: "grid-nested" },
  { id: "grid-datacenter", name: "Datacenter", category: "Grid", className: "grid-datacenter" },
  { id: "grid-plus", name: "Plus", category: "Grid", className: "grid-plus" },
  { id: "grid-minimal-plus", name: "Minimal Plus", category: "Grid", className: "grid-minimal-plus" },
  // Ring patterns
  { id: "ring-concentric", name: "Concentric", category: "Ring", className: "ring-concentric" },
  { id: "ring-outline", name: "Outline", category: "Ring", className: "ring-outline" },
  { id: "ring-quarter", name: "Quarter", category: "Ring", className: "ring-quarter" },
  { id: "ring-orbital", name: "Orbital", category: "Ring", className: "ring-orbital" },
  { id: "ring-radar", name: "Radar", category: "Ring", className: "ring-radar" },
  { id: "ring-noise", name: "Noise", category: "Ring", className: "ring-noise" },
  // Wave patterns
  { id: "wave-scallop", name: "Scallop", category: "Wave", className: "wave-scallop" },
  { id: "wave-stripe", name: "Stripe", category: "Wave", className: "wave-stripe" },
  // Texture patterns
  { id: "tex-woven", name: "Woven", category: "Texture", className: "tex-woven" },
  { id: "tex-herringbone", name: "Herringbone", category: "Texture", className: "tex-herringbone" },
  { id: "tex-brick", name: "Brick", category: "Texture", className: "tex-brick" },
  { id: "tex-paper", name: "Paper", category: "Texture", className: "tex-paper" },
  // Shape patterns
  { id: "shape-checker", name: "Checker", category: "Shape", className: "shape-checker" },
  { id: "shape-triangle", name: "Triangle", category: "Shape", className: "shape-triangle" },
  { id: "shape-zigzag", name: "Zigzag", category: "Shape", className: "shape-zigzag" },
  { id: "shape-bracket", name: "Bracket", category: "Shape", className: "shape-bracket" },
];

const CATEGORIES = ["Dot", "Line", "Grid", "Ring", "Wave", "Texture", "Shape"];

export default function BgPatternsPage() {
  const { theme } = useTheme();

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      ...CATEGORIES.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
      { id: "usage", label: "Usage" },
    ];
  }, []);

  const patternsByCategory = useMemo(() => {
    const grouped: Record<string, Pattern[]> = {};
    PATTERNS.forEach((pattern) => {
      if (!grouped[pattern.category]) {
        grouped[pattern.category] = [];
      }
      grouped[pattern.category].push(pattern);
    });
    return grouped;
  }, []);

  return (
    <PageLayout tocItems={tocItems} currentPath="/utility/bg-patterns">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Background Patterns</h3>
          <p className="ds-content__subtitle">
            A collection of CSS-based background patterns that work seamlessly in both light and dark themes. These patterns use design tokens for consistent theming.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Background patterns provide subtle texture and visual interest to surfaces. All patterns are implemented using pure CSS gradients and are theme-aware, automatically adapting to light and dark modes.
          </p>
          <p className="ds-content__text">
            Patterns use the <code>--pattern-ink-1</code> through <code>--pattern-ink-4</code> design tokens, which are defined in the brand token files and automatically adjust based on the current theme.
          </p>
        </section>

        {CATEGORIES.map((category) => (
          <section key={category} id={category.toLowerCase()} className="ds-content__section">
            <h6 className="ds-content__section-title">{category}</h6>
            <div className="ds-patterns-grid">
              {patternsByCategory[category]?.map((pattern) => (
                <div key={pattern.id} className="ds-pattern-tile">
                  <div className={`ds-pattern-preview ${pattern.className}`} />
                  <div className="ds-pattern-label">
                    <span className="ds-pattern-label__prefix">{category.toUpperCase()} ·</span> {pattern.name}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section id="usage" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage</h6>
          <p className="ds-content__text">
            Background patterns can be applied to any HTML element using CSS classes. They work with any container, section, div, or component background.
          </p>

          <h6 className="ds-content__subsection-title" style={{ marginTop: "var(--spacing-400)" }}>Using CSS Classes Directly</h6>
          <p className="ds-content__text">
            Apply pattern classes directly to any HTML element:
          </p>
          <div className="ds-code-example" style={{ marginTop: "var(--spacing-300)" }}>
            <div className="ds-card-example-section">
              <div className="ds-card-example-preview">
                <div className="ds-card-example-container">
                  <div className="ds-card-example-canvas">
                    <div className="dot-node" style={{ padding: "var(--spacing-400)", borderRadius: "var(--corner-radius-200)", backgroundColor: "var(--bg-page-primary)" }}>
                      <p style={{ margin: 0, color: "var(--fg-neutral)" }}>Any container with dot-node pattern</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ds-card-example-code">
                <div style={{ position: "relative", padding: "var(--spacing-300)", backgroundColor: "var(--bg-page-secondary)", borderRadius: "var(--corner-radius-200)" }}>
                  <pre style={{ margin: 0, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", fontSize: "var(--fonts-body-small-text-size)", color: "var(--fg-neutral)" }}>
{`<div className="dot-node">
  Content with pattern background
</div>

<!-- Or in plain HTML -->
<section class="grid-nested">
  <h2>Section Title</h2>
  <p>Content with nested grid pattern</p>
</section>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <h6 className="ds-content__subsection-title" style={{ marginTop: "var(--spacing-500)" }}>Using in React Components</h6>
          <p className="ds-content__text">
            Import and use the <code>getPatternClassName</code> utility function:
          </p>
          <div className="ds-code-example" style={{ marginTop: "var(--spacing-300)" }}>
            <div className="ds-card-example-section">
              <div className="ds-card-example-preview">
                <div className="ds-card-example-container">
                  <div className="ds-card-example-canvas">
                    <div className="tex-woven" style={{ padding: "var(--spacing-400)", borderRadius: "var(--corner-radius-200)", backgroundColor: "var(--bg-page-primary)" }}>
                      <p style={{ margin: 0, color: "var(--fg-neutral)" }}>Component with tex-woven pattern</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ds-card-example-code">
                <div style={{ position: "relative", padding: "var(--spacing-300)", backgroundColor: "var(--bg-page-secondary)", borderRadius: "var(--corner-radius-200)" }}>
                  <pre style={{ margin: 0, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", fontSize: "var(--fonts-body-small-text-size)", color: "var(--fg-neutral)" }}>
{`import { getPatternClassName } from 'beacon-ui/utils/patternPaths';

function MyComponent() {
  return (
    <div className={getPatternClassName('tex-woven')}>
      <h2>My Component</h2>
      <p>Content with woven texture pattern</p>
    </div>
  );
}

// Conditional pattern application
function ConditionalPattern({ showPattern }: { showPattern: boolean }) {
  const patternClass = showPattern ? getPatternClassName('dot-node') : '';
  return (
    <section className={\`container \${patternClass}\`}>
      Content
    </section>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <h6 className="ds-content__subsection-title" style={{ marginTop: "var(--spacing-500)" }}>Common Use Cases</h6>
          <ul className="ds-content__bullet-list">
            <li><strong>Section backgrounds:</strong> Apply patterns to page sections, hero areas, or content containers</li>
            <li><strong>Card components:</strong> Use the Card component's <code>showBgPattern</code> prop, or apply classes directly to custom card elements</li>
            <li><strong>Container divs:</strong> Add visual interest to any container, wrapper, or layout element</li>
            <li><strong>Overlay backgrounds:</strong> Combine patterns with overlays for depth and texture</li>
            <li><strong>Preview areas:</strong> Use patterns in design previews, showcases, or demo sections</li>
          </ul>

          <h6 className="ds-content__subsection-title" style={{ marginTop: "var(--spacing-500)" }}>Pattern Categories</h6>
          <p className="ds-content__text">
            Patterns are organized into categories based on their visual style:
          </p>
          <ul className="ds-content__bullet-list">
            <li><strong>Dot:</strong> Subtle, halftone, polka, stars, node, striped - perfect for minimal, modern designs</li>
            <li><strong>Line:</strong> Vertical, horizontal, stacked, hashrate, diagonal - great for structured layouts</li>
            <li><strong>Grid:</strong> Soft, offset, graph, nested, datacenter, plus, minimal-plus - ideal for technical or data-focused interfaces</li>
            <li><strong>Ring:</strong> Concentric, outline, quarter, orbital, radar, noise - adds organic, flowing textures</li>
            <li><strong>Wave:</strong> Scallop, stripe - creates movement and rhythm</li>
            <li><strong>Texture:</strong> Woven, herringbone, brick, paper - provides tactile, material-like surfaces</li>
            <li><strong>Shape:</strong> Checker, triangle, zigzag, bracket - offers geometric, structured patterns</li>
          </ul>
        </section>
      </article>
    </PageLayout>
  );
}

