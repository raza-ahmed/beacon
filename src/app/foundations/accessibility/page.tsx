"use client";

import { useMemo } from "react";
import { PageLayout, type TocItem } from "@/components";

export default function AccessibilityPage() {
  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "contrast-ratios", label: "Contrast Ratios" },
      { id: "key-principles", label: "Key Principles" },
      { id: "usage-guidance", label: "Usage Guidance" },
    ];
  }, []);

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/accessibility">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Accessibility</h3>
          <p className="ds-content__subtitle">
            Beacon follows WCAG 2.1 Level AA standards to ensure accessible design for all users.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Accessibility is a core principle of the Beacon design system. All components and tokens are designed to meet WCAG 2.1 Level AA standards, ensuring that interfaces are usable by people with disabilities and work well with assistive technologies.
          </p>
          <p className="ds-content__text">
            The design system provides accessible defaults through semantic tokens, proper contrast ratios, and component patterns that follow accessibility best practices.
          </p>
        </section>

        <section id="contrast-ratios" className="ds-content__section">
          <h6 className="ds-content__section-title">Contrast Ratios</h6>
          <p className="ds-content__text">
            Beacon follows WCAG 2.1 Level AA contrast requirements for text readability:
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>4.5:1</strong> applies to normal text (body text, labels, paragraphs)
            </li>
            <li>
              <strong>3:1</strong> applies to large text (≥18pt regular or ≥14pt bold)
            </li>
          </ul>
          <p className="ds-content__text">
            All brand color tokens are designed to meet these contrast requirements when used with their paired foreground tokens. The <a href="/foundations/colors#contrast">Colors page</a> includes a contrast ratio checker that validates pairings in the current theme context.
          </p>
          <div className="ds-token-mapping">
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Normal Text</h6>
              </div>
              <code className="ds-token-mapping__example">4.5:1 minimum</code>
              <p className="ds-token-mapping__desc">
                Required for body text, labels, and paragraphs. This ensures text is readable for users with low vision or color blindness.
              </p>
            </div>
            <div className="ds-token-mapping__arrow">+</div>
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Large Text</h6>
              </div>
              <code className="ds-token-mapping__example">3:1 minimum</code>
              <p className="ds-token-mapping__desc">
                Required for large text (≥18pt regular or ≥14pt bold). Larger text is easier to read, so the contrast requirement is lower.
              </p>
            </div>
          </div>
        </section>

        <section id="key-principles" className="ds-content__section">
          <h6 className="ds-content__section-title">Key Principles</h6>
          <p className="ds-content__text">
            The design system incorporates accessibility through several key principles:
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>Semantic HTML:</strong> Components use proper HTML elements and ARIA attributes where needed
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> All interactive elements are keyboard accessible
            </li>
            <li>
              <strong>Focus Management:</strong> Clear focus indicators and logical tab order
            </li>
            <li>
              <strong>Color Contrast:</strong> All color pairings meet WCAG AA standards
            </li>
            <li>
              <strong>Screen Reader Support:</strong> Proper labels, descriptions, and announcements
            </li>
          </ul>
        </section>

        <section id="usage-guidance" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidance</h6>
          <p className="ds-content__text">
            When building with Beacon, follow these accessibility guidelines:
          </p>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Use Paired Tokens</h6>
            <p className="ds-content__text">
              Always use paired foreground and background tokens (e.g., <code>--fg-on-action</code> with <code>--bg-primary</code>) to ensure proper contrast. Avoid mixing tokens that haven't been validated together.
            </p>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Test Contrast</h6>
            <p className="ds-content__text">
              Use the contrast ratio checker on the <a href="/foundations/colors#contrast">Colors page</a> to verify text-background pairings, especially when creating custom combinations or using tokens in new contexts.
            </p>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Don't Rely on Color Alone</h6>
            <p className="ds-content__text">
              Use color in combination with other visual indicators (icons, text, patterns) to convey information. This ensures accessibility for users with color vision deficiencies.
            </p>
          </div>

          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use semantic HTML elements</li>
                <li>Provide text alternatives for images</li>
                <li>Ensure keyboard accessibility</li>
                <li>Test with screen readers</li>
                <li>Verify contrast ratios</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't rely on color alone to convey meaning</li>
                <li>Don't create custom color combinations without testing contrast</li>
                <li>Don't remove focus indicators</li>
                <li>Don't use placeholder text as labels</li>
                <li>Don't create keyboard traps</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

