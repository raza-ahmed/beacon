"use client";

import { PageLayout, type TocItem } from "@/components";

const tocItems: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "usage-guidelines", label: "Usage Guidelines" },
  { id: "use-cases", label: "Where to Use" },
  { id: "best-practices", label: "Best Practices" },
];

export default function MotionGuidePage() {
  return (
    <PageLayout tocItems={tocItems} currentPath="/motion/guide">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Motion Guide</h3>
          <p className="ds-content__text">
            Learn how to effectively use motion animations in your applications. This guide covers best practices, 
            usage guidelines, and recommendations for implementing animations that enhance user experience.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Motion animations add life to your interface by providing visual feedback on user interactions. 
            When used thoughtfully, animations can guide user attention, provide context, and create a more 
            polished and professional experience.
          </p>
        </section>

        <section id="usage-guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidelines</h6>
          <p className="ds-content__text">
            Choose animations that match your application's tone and context. Consider the following when 
            selecting animations:
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>Professional animations</strong> are ideal for business applications, dashboards, 
              and enterprise software where subtlety and professionalism are key.
            </li>
            <li>
              <strong>Playful animations</strong> work well in consumer-facing applications, marketing 
              sites, and creative portfolios where personality and delight are important.
            </li>
            <li>
              <strong>Minimal animations</strong> are perfect for content-heavy interfaces, reading 
              experiences, and applications where distractions should be minimized.
            </li>
            <li>
              <strong>3D-focused animations</strong> are great for showcasing products, creating depth 
              in card-based layouts, and adding visual interest to interactive elements.
            </li>
          </ul>
        </section>

        <section id="use-cases" className="ds-content__section">
          <h6 className="ds-content__section-title">Where to Use Animations</h6>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--spacing-400)", marginTop: "var(--spacing-400)" }}>
            <div style={{ padding: "var(--spacing-300)", backgroundColor: "var(--bg-page-primary)", borderRadius: "var(--corner-radius-200)"}}>
              <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
                Interactive Cards
              </h6>
              <ul className="ds-content__bullet-list" style={{ marginBottom: 0 }}>
                <li>Product cards</li>
                <li>Feature showcases</li>
                <li>Testimonial cards</li>
                <li>Content previews</li>
              </ul>
            </div>
            <div style={{ padding: "var(--spacing-300)", backgroundColor: "var(--bg-page-primary)", borderRadius: "var(--corner-radius-200)"}}>
              <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
                Navigation Elements
              </h6>
              <ul className="ds-content__bullet-list" style={{ marginBottom: 0 }}>
                <li>Menu items</li>
                <li>Navigation buttons</li>
                <li>Tab indicators</li>
                <li>Breadcrumbs</li>
              </ul>
            </div>
            <div style={{ padding: "var(--spacing-300)", backgroundColor: "var(--bg-page-primary)", borderRadius: "var(--corner-radius-200)"}}>
              <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
                Call-to-Action
              </h6>
              <ul className="ds-content__bullet-list" style={{ marginBottom: 0 }}>
                <li>Primary buttons</li>
                <li>Action cards</li>
                <li>Feature highlights</li>
                <li>Promotional banners</li>
              </ul>
            </div>
            <div style={{ padding: "var(--spacing-300)", backgroundColor: "var(--bg-page-primary)", borderRadius: "var(--corner-radius-200)" }}>
              <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
                Data Visualization
              </h6>
              <ul className="ds-content__bullet-list" style={{ marginBottom: 0 }}>
                <li>Chart containers</li>
                <li>Metric cards</li>
                <li>Dashboard widgets</li>
                <li>Stat displays</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="best-practices" className="ds-content__section">
          <h6 className="ds-content__section-title">Best Practices</h6>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>Consistency:</strong> Use the same animation style across similar elements to 
              create a cohesive experience.
            </li>
            <li>
              <strong>Performance:</strong> Animations should be smooth (60fps). Avoid animating too 
              many elements simultaneously.
            </li>
            <li>
              <strong>Accessibility:</strong> Always respect <code>prefers-reduced-motion</code>. All 
              animations in this library automatically disable when users prefer reduced motion.
            </li>
            <li>
              <strong>Purpose:</strong> Use animations to enhance usability, not just for decoration. 
              Each animation should serve a functional purpose.
            </li>
            <li>
              <strong>Timing:</strong> Keep animations quick (200-300ms for most interactions) to avoid 
              feeling sluggish.
            </li>
            <li>
              <strong>Context:</strong> Match animation intensity to the importance of the interaction. 
              More important actions can have more pronounced animations.
            </li>
          </ul>
        </section>
      </article>
    </PageLayout>
  );
}

