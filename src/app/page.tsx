"use client";

import { PageLayout, type TocItem } from "@/components";

const tocItems: TocItem[] = [
  { id: "about", label: "About Design System" },
  { id: "links", label: "Important Links" },
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
            coherent digital environment. This system will serve as the
            foundation upon which all our digital products are built, ensuring
            consistency, efficiency, and accessibility across all user
            interfaces.
          </p>
          <div className="ds-content__image-placeholder">
            <div className="ds-content__gradient-image" />
          </div>
        </section>

        <section id="links" className="ds-content__section">
          <h6 className="ds-content__section-title">Important Links</h6>
          <ul className="ds-content__link-list">
            <li>
              <a href="#" className="ds-content__link">
                Figma Design Library
              </a>
              <span className="ds-content__link-desc">
                Access the complete design files and components
              </span>
            </li>
            <li>
              <a href="#" className="ds-content__link">
                GitHub Repository
              </a>
              <span className="ds-content__link-desc">
                Source code and implementation details
              </span>
            </li>
            <li>
              <a href="#" className="ds-content__link">
                Changelog
              </a>
              <span className="ds-content__link-desc">
                Track updates and version history
              </span>
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
            <span className="ds-content__version-value">V 2.3</span>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
