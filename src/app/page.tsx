"use client";

import { PageLayout, type TocItem } from "@/components";
import { getVersionString } from "@/constants/version";

const tocItems: TocItem[] = [
  { id: "about", label: "About Design System" },
  { id: "overview", label: "What's Included" },
  { id: "features", label: "Key Features" },
  { id: "quick-start", label: "Quick Start" },
  { id: "principles", label: "Design Principles" },
  { id: "versioning", label: "Versioning & Releases" },
];

export default function IntroductionPage() {
  return (
    <PageLayout tocItems={tocItems} currentPath="/">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Introduction</h3>
          <p className="ds-content__subtitle">
            Welcome to Beacon Design System
          </p>
        </header>

        <section id="about" className="ds-content__section">
          <h6 className="ds-content__section-title">About Design System</h6>
          <p className="ds-content__text">
            Beacon Design System creates a seamless, user-friendly, and visually
            coherent digital environment. This system serves as the foundation
            upon which all our digital products are built, ensuring consistency,
            efficiency, and accessibility across all user interfaces. With 10
            production-ready components and comprehensive design tokens, Beacon
            provides everything needed to build cohesive, accessible applications.
          </p>
          <div className="ds-content__image-placeholder">
            <img
              src="/images/Beacon-design-system.png"
              alt="Beacon Design System"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </section>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">What's Included</h6>
          <p className="ds-content__text">
            Beacon Design System provides a complete set of components and
            foundations to accelerate development while maintaining design
            consistency.
          </p>
          <div className="ds-content__grid">
            <div className="ds-content__card">
              <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
                Components
              </h6>
              <ul className="ds-content__bullet-list" style={{ marginBottom: 0 }}>
                <li>Avatar</li>
                <li>Button</li>
                <li>Button Icon</li>
                <li>Card</li>
                <li>Checkbox</li>
                <li>Chip</li>
                <li>Input</li>
                <li>Menu</li>
                <li>Radio Button</li>
                <li>Switch</li>
              </ul>
            </div>
            <div className="ds-content__card">
              <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
                Foundations
              </h6>
              <ul className="ds-content__bullet-list" style={{ marginBottom: 0 }}>
                <li>Design Tokens (Colors, Spacing, Themes)</li>
                <li>Typography</li>
                <li>Responsiveness</li>
                <li>Accessibility</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="ds-content__section">
          <h6 className="ds-content__section-title">Key Features</h6>
          <p className="ds-content__text">
            Beacon Design System is built with modern development practices and
            accessibility in mind.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>Token-driven design:</strong> All styles use design tokens,
              ensuring consistency and easy theme customization.
            </li>
            <li>
              <strong>Theme support:</strong> Built-in light and dark mode support
              with multiple hue variants for flexible theming.
            </li>
            <li>
              <strong>Responsive variants:</strong> Components adapt seamlessly
              across desktop, tablet, and mobile breakpoints.
            </li>
            <li>
              <strong>Accessibility built-in:</strong> WCAG-compliant components
              with proper ARIA attributes and keyboard navigation.
            </li>
            <li>
              <strong>Figma-aligned:</strong> 1:1 mapping with design files ensures
              pixel-perfect implementation.
            </li>
            <li>
              <strong>TypeScript support:</strong> Fully typed components and
              tokens for better developer experience and type safety.
            </li>
          </ul>
        </section>

        <section id="quick-start" className="ds-content__section">
          <h6 className="ds-content__section-title">Quick Start</h6>
          <p className="ds-content__text">
            Get started with Beacon Design System in minutes. Each component
            includes interactive playgrounds where you can explore variants,
            customize properties, and copy ready-to-use code examples.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Explore <a href="/foundations/colors" className="ds-content__link">design tokens</a> to
              understand the color system, spacing scale, and theme variables.
            </li>
            <li>
              Browse <a href="/components/button" className="ds-content__link">component documentation</a> to
              see all available props, variants, and usage examples.
            </li>
            <li>
              Use interactive playgrounds to customize components and generate
              code snippets.
            </li>
            <li>
              Review the <a href="/how-to-use" className="ds-content__link">How to Use</a> guide for
              detailed implementation instructions.
            </li>
          </ul>
        </section>

        <section id="principles" className="ds-content__section">
          <h6 className="ds-content__section-title">Design Principles</h6>
          <p className="ds-content__text">
            Beacon Design System is guided by core principles that ensure quality,
            consistency, and usability across all implementations.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>Consistency:</strong> Unified design language across all
              components and patterns.
            </li>
            <li>
              <strong>Accessibility:</strong> Inclusive design that works for
              everyone, meeting WCAG 2.1 AA standards.
            </li>
            <li>
              <strong>Scalability:</strong> Token-based architecture that scales
              with your product's needs.
            </li>
            <li>
              <strong>Developer-friendly:</strong> TypeScript support, clear
              documentation, and copy-paste code examples.
            </li>
          </ul>
        </section>

        <section id="versioning" className="ds-content__section">
          <h6 className="ds-content__section-title">Versioning & Releases</h6>
          <p className="ds-content__text">
            The system is designed to evolve incrementally. Components, tokens,
            and patterns may be added, refined, or deprecated as product
            requirements mature. Documentation reflects the current state of the
            system at the time of release.
          </p>
          <div className="ds-content__version-info">
            <span className="ds-content__version-label">Current Version:</span>
            <span className="ds-content__version-value">{getVersionString("V")}</span>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
