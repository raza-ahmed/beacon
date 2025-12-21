"use client";

import { PageLayout, type TocItem } from "@/components";

const tocItems: TocItem[] = [
  { id: "for-designers", label: "For Designers" },
  { id: "for-developers", label: "For Developers" },
  { id: "general-guidelines", label: "General Guidelines" },
];

export default function HowToUsePage() {
  return (
    <PageLayout tocItems={tocItems} currentPath="/how-to-use">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">How to Use</h3>
          <p className="ds-content__subtitle">
            Beacon can be used by designers and developers working together or independently.
            The system is designed to fit naturally into existing workflows.
          </p>
        </header>

        <section id="for-designers" className="ds-content__section">
          <h6 className="ds-content__section-title">For Designers</h6>
          <p className="ds-content__text">
            Designers should use the Beacon Figma library as the primary design tool. All
            components, tokens, and patterns are available in Figma, ensuring a seamless workflow
            from design to implementation.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Use the Beacon Figma library as the single source of truth for components,{" "}
              <a href="/foundations/colors" className="ds-content__link">colors</a>,{" "}
              <a href="/foundations/typography" className="ds-content__link">typography</a>,{" "}
              <a href="/foundations/spacing" className="ds-content__link">spacing</a>, and
              interaction patterns.
            </li>
            <li>
              Start layouts using predefined components from the Figma library instead of creating
              custom UI elements. Browse available components in the{" "}
              <a href="/components/button" className="ds-content__link">component documentation</a>{" "}
              to understand variants and usage.
            </li>
            <li>
              Follow documented variants and constraints to ensure consistency across screens. Use
              design tokens for spacing, colors, and typography rather than arbitrary values.
            </li>
            <li>
              Reference the <a href="/foundations/themes" className="ds-content__link">themes</a>{" "}
              documentation to understand light and dark mode implementations when designing.
            </li>
            <li>
              Propose new components or changes by extending existing patterns rather than creating
              one-off solutions. Check existing components first to avoid duplication.
            </li>
            <li>
              Collaborate with developers by sharing Figma links and ensuring designs align with
              documented component APIs and token usage.
            </li>
          </ul>
        </section>

        <section id="for-developers" className="ds-content__section">
          <h6 className="ds-content__section-title">For Developers</h6>
          <p className="ds-content__text">
            Developers should reference the component documentation and use design tokens for all
            styling. Each component page includes interactive playgrounds, code examples, and API
            documentation.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Reference the documented <a href="/components/button" className="ds-content__link">components</a>{" "}
              and <a href="/foundations/colors" className="ds-content__link">design tokens</a> to implement UI
              consistently. Each component page includes interactive playgrounds where you can
              customize props and copy code examples.
            </li>
            <li>
              Use the provided design tokens for{" "}
              <a href="/foundations/colors" className="ds-content__link">colors</a>,{" "}
              <a href="/foundations/spacing" className="ds-content__link">spacing</a>,{" "}
              <a href="/foundations/typography" className="ds-content__link">typography</a>, and states
              instead of hardcoded values. All tokens are available as CSS variables (e.g.,{" "}
              <code>var(--bg-primary)</code>, <code>var(--spacing-400)</code>).
            </li>
            <li>
              Match component behavior and states (hover, focus, disabled, error) exactly as
              defined in the documentation. Use the interactive playgrounds to see all available
              states and variants for each component.
            </li>
            <li>
              Copy code examples directly from component pages. Each component includes a "Code
              Examples" section with ready-to-use snippets for common use cases.
            </li>
            <li>
              Follow the <a href="/foundations/accessibility" className="ds-content__link">accessibility</a>{" "}
              guidelines and ensure components meet WCAG 2.1 AA standards. All components include
              proper ARIA attributes and keyboard navigation.
            </li>
            <li>
              Use TypeScript types from component documentation for type safety. All components
              are fully typed with clear prop interfaces.
            </li>
          </ul>
        </section>

        <section id="general-guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">General Guidelines</h6>
          <p className="ds-content__text">
            These guidelines apply to both designers and developers working with Beacon Design
            System. Following these principles ensures consistency, maintainability, and quality
            across all implementations.
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              Treat Beacon as the default UI layer for all products unless there is a strong,
              documented reason not to. Check existing components and patterns before creating new
              solutions.
            </li>
            <li>
              Avoid modifying components locally. If you need changes or improvements, propose them
              for inclusion in the design system rather than creating local overrides.
            </li>
            <li>
              Use <a href="/foundations/accessibility" className="ds-content__link">accessibility</a> and{" "}
              <a href="/foundations/responsiveness" className="ds-content__link">responsiveness</a> guidelines as
              non-optional requirements. All components are built with these standards in mind.
            </li>
            <li>
              Check the documentation before designing or building new patterns to prevent
              duplication. Review the <a href="/" className="ds-content__link">Introduction</a> page to see
              what's available, and explore component pages to understand existing solutions.
            </li>
            <li>
              Use design tokens consistently. Never hardcode colors, spacing, or typography values.
              All styling should reference tokens from the{" "}
              <a href="/foundations/colors" className="ds-content__link">foundations</a>.
            </li>
            <li>
              Keep components and documentation in sync. When components are updated, ensure
              documentation reflects the current state and behavior.
            </li>
          </ul>
        </section>
      </article>
    </PageLayout>
  );
}


