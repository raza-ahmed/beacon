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
          <p className="ds-content__section-title">For Designers</p>
          <ul className="ds-content__bullet-list">
            <li>
              Use the Beacon Figma library as the single source of truth for components, colors,
              typography, spacing, and interaction patterns.
            </li>
            <li>
              Start layouts using predefined components instead of creating custom UI elements.
            </li>
            <li>
              Follow documented variants and constraints to ensure consistency across screens.
            </li>
            <li>
              Propose new components or changes by extending existing patterns rather than creating
              one-off solutions.
            </li>
          </ul>
        </section>

        <section id="for-developers" className="ds-content__section">
          <p className="ds-content__section-title">For Developers</p>
          <ul className="ds-content__bullet-list">
            <li>
              Reference the documented components and tokens to implement UI consistently.
            </li>
            <li>
              Use the provided design tokens for colors, spacing, typography, and states instead
              of hardcoded values.
            </li>
            <li>
              Match component behavior and states (hover, focus, disabled, error) exactly as
              defined in the documentation.
            </li>
            <li>
              Track changes through the changelog and update implementations based on versioned
              releases.
            </li>
          </ul>
        </section>

        <section id="general-guidelines" className="ds-content__section">
          <p className="ds-content__section-title">General Guidelines</p>
          <ul className="ds-content__bullet-list">
            <li>
              Treat Beacon as the default UI layer for all products unless there is a strong,
              documented reason not to.
            </li>
            <li>
              Avoid modifying components locally. Improvements should be contributed back to the
              system.
            </li>
            <li>
              Use accessibility and responsiveness guidelines as non-optional requirements.
            </li>
            <li>
              Check the documentation before designing or building new patterns to prevent
              duplication.
            </li>
          </ul>
        </section>
      </article>
    </PageLayout>
  );
}


