"use client";

import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";

const HUE_OPTIONS: { value: HueVariant; label: string }[] = [
  { value: "chromatic-prime", label: "Chromatic" },
  { value: "hue-sky", label: "Sky" },
  { value: "hue-indigo", label: "Indigo" },
];

export default function Home() {
  const { theme, hue, toggleTheme, setHue } = useTheme();

  return (
    <main className="page-container">
      <header className="page-header">
        <div className="header-content">
          <h1>Design System Beacon</h1>
          <p>Documentation and reference for the design system</p>
        </div>
        <div className="header-controls">
          <div className="hue-picker">
            {HUE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setHue(option.value)}
                className={`hue-option ${hue === option.value ? "active" : ""}`}
                data-hue={option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      <section className="content-section">
        <h2>Getting Started</h2>
        <p>
          This documentation site is built using the same design tokens it
          documents. The token system supports multiple themes and responsive
          breakpoints.
        </p>
      </section>

      <section className="content-section">
        <h2>Token Architecture</h2>
        <p>The design system uses a multi-layered token structure:</p>
        <ul className="token-list">
          <li>
            <strong>Primitives</strong> - Raw color values, scale units, and
            font definitions
          </li>
          <li>
            <strong>Semantic</strong> - Purpose-driven tokens that reference
            primitives (with hue variants)
          </li>
          <li>
            <strong>Brand</strong> - Theme-specific tokens for light and dark
            modes
          </li>
          <li>
            <strong>Responsive</strong> - Device-specific typography and spacing
            scales
          </li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Color Samples</h2>
        <p className="section-description">
          The Brand color changes based on the selected hue variant above.
        </p>
        <div className="color-grid">
          <div className="color-swatch bg-brand">
            <span>Brand</span>
          </div>
          <div className="color-swatch bg-success">
            <span>Success</span>
          </div>
          <div className="color-swatch bg-warning">
            <span>Warning</span>
          </div>
          <div className="color-swatch bg-critical">
            <span>Critical</span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Primary Color Scale</h2>
        <p className="section-description">
          These colors change based on the selected hue variant.
        </p>
        <div className="primary-scale">
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-100)" }}>100</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-200)" }}>200</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-300)" }}>300</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-400)" }}>400</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-500)", color: "white" }}>500</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-600)", color: "white" }}>600</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-700)", color: "white" }}>700</div>
          <div className="scale-swatch" style={{ backgroundColor: "var(--color-primary-800)", color: "white" }}>800</div>
        </div>
      </section>

      <section className="content-section">
        <h2>Typography Scale</h2>
        <div className="typography-samples">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>
            Body text demonstrates the default paragraph styling with proper
            line height and color contrast for optimal readability.
          </p>
        </div>
      </section>

      <style jsx>{`
        .header-content {
          flex: 1;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--spacing-400);
          flex-wrap: wrap;
        }

        .header-controls {
          display: flex;
          gap: var(--spacing-300);
          align-items: center;
          flex-wrap: wrap;
        }

        .hue-picker {
          display: flex;
          border-radius: var(--corner-radius-200);
          overflow: hidden;
          border: 1px solid var(--border-neutral-tertiary);
        }

        .hue-option {
          padding: var(--spacing-200) var(--spacing-300);
          background-color: var(--bg-page-secondary);
          color: var(--fg-neutral-secondary);
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: var(--body-small-text-size);
          transition: all 0.2s ease;
        }

        .hue-option:not(:last-child) {
          border-right: 1px solid var(--border-neutral-tertiary);
        }

        .hue-option:hover {
          background-color: var(--bg-page-tertiary);
        }

        .hue-option.active {
          background-color: var(--bg-brand);
          color: var(--fg-on-action);
        }

        .theme-toggle {
          padding: var(--spacing-200) var(--spacing-400);
          background-color: var(--bg-brand-tonal);
          color: var(--fg-primary);
          border: 1px solid var(--border-primary-tonal);
          border-radius: var(--corner-radius-200);
          cursor: pointer;
          font-family: inherit;
          font-size: var(--body-small-text-size);
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background-color: var(--bg-brand-tonal-on-hover);
        }

        .section-description {
          font-size: var(--body-small-text-size);
          color: var(--fg-neutral-tertiary);
          margin-bottom: var(--spacing-300);
        }

        .token-list {
          list-style: none;
          margin-top: var(--spacing-300);
        }

        .token-list li {
          padding: var(--spacing-200) 0;
          border-bottom: 1px solid var(--border-neutral-tertiary);
          font-size: var(--body-regular-text-size);
          color: var(--fg-neutral-secondary);
        }

        .token-list li:last-child {
          border-bottom: none;
        }

        .token-list strong {
          color: var(--fg-neutral);
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-300);
        }

        .color-swatch {
          padding: var(--spacing-500);
          border-radius: var(--corner-radius-200);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--body-small-text-size);
          font-weight: 500;
          color: var(--fg-on-action);
          box-shadow: var(--drop-shadow-100);
        }

        .bg-brand {
          background-color: var(--bg-brand);
        }

        .bg-success {
          background-color: var(--bg-success);
        }

        .bg-warning {
          background-color: var(--bg-warning);
        }

        .bg-critical {
          background-color: var(--bg-critical);
        }

        .primary-scale {
          display: flex;
          border-radius: var(--corner-radius-200);
          overflow: hidden;
        }

        .scale-swatch {
          flex: 1;
          padding: var(--spacing-400) var(--spacing-200);
          text-align: center;
          font-size: var(--body-small-text-size);
          font-weight: 500;
        }

        .typography-samples {
          margin-top: var(--spacing-400);
          padding: var(--spacing-500);
          background-color: var(--bg-page-secondary);
          border-radius: var(--corner-radius-300);
        }

        .typography-samples h1,
        .typography-samples h2,
        .typography-samples h3,
        .typography-samples h4,
        .typography-samples h5,
        .typography-samples h6 {
          margin-bottom: var(--spacing-200);
        }

        .typography-samples p {
          margin-top: var(--spacing-300);
        }
      `}</style>
    </main>
  );
}
