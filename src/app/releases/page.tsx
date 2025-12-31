"use client";

import { PageLayout, type TocItem } from "@/components";
import { getCurrentVersion, getChangesSinceLastVersion, type VersionEntry } from "@/constants/version-data";
import { DESIGN_SYSTEM_VERSION } from "@/constants/version";

const tocItems: TocItem[] = [
  { id: "versioning", label: "Versioning" },
  { id: "current-version", label: "Current Version" },
  { id: "recent-updates", label: "Recent Updates" },
];

function formatDate(dateString: string): string {
  // Parse YYYY-MM-DD format and format directly to avoid timezone issues
  const [year, month, day] = dateString.split("-").map(Number);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

function renderChanges(entry: VersionEntry | null) {
  if (!entry) return null;

  const categories = [
    { key: "added" as const, label: "Added", icon: "+" },
    { key: "changed" as const, label: "Changed", icon: "~" },
    { key: "fixed" as const, label: "Fixed", icon: "✓" },
    { key: "deprecated" as const, label: "Deprecated", icon: "⚠" },
    { key: "removed" as const, label: "Removed", icon: "−" },
    { key: "security" as const, label: "Security", icon: "🔒" },
  ];

  return (
    <>
      {categories.map(({ key, label }) => {
        const items = entry[key];
        if (!items || items.length === 0) return null;

        return (
          <div key={key} style={{ marginBottom: "var(--spacing-400)" }}>
            <h6
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-title-small-text-size)",
                fontWeight: "var(--font-weight-secondary-bold)",
                color: "var(--fg-neutral)",
                marginBottom: "var(--spacing-200)",
                marginTop: 0,
              }}
            >
              {label}
            </h6>
            <ul className="ds-content__bullet-list" style={{ marginTop: 0 }}>
              {items.map((item, index) => (
                <li key={index}>{item.description}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

export default function ReleasesPage() {
  const currentVersion = getCurrentVersion();
  const recentUpdates = getChangesSinceLastVersion();

  return (
    <PageLayout tocItems={tocItems} currentPath="/releases">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Releases</h3>
          <p className="ds-content__subtitle">
            Track version updates and understand how releases are managed in Beacon Design System.
          </p>
        </header>

        <section id="versioning" className="ds-content__section">
          <h6 className="ds-content__section-title">Versioning</h6>
          <p className="ds-content__text">
            Beacon Design System follows <a href="https://semver.org/" className="ds-content__link" target="_blank" rel="noopener noreferrer">Semantic Versioning</a> (SemVer) to communicate the nature of changes in each release.
          </p>
          <p className="ds-content__text">
            Version numbers follow the format <strong>MAJOR.MINOR.PATCH</strong>:
          </p>
          <ul className="ds-content__bullet-list">
            <li>
              <strong>MAJOR</strong> - Breaking changes that require updates to existing code
            </li>
            <li>
              <strong>MINOR</strong> - New features added in a backward-compatible manner
            </li>
            <li>
              <strong>PATCH</strong> - Bug fixes and minor improvements that don't change existing behavior
            </li>
          </ul>
        </section>

        <section id="current-version" className="ds-content__section">
          <h6 className="ds-content__section-title">Current Version</h6>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--spacing-300)",
              padding: "var(--spacing-400)",
              backgroundColor: "var(--bg-page-secondary)",
              borderRadius: "var(--corner-radius-300)",
              border: "var(--border-width-25) solid var(--border-strong-200)",
              marginBottom: "var(--spacing-400)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-heading-h5-text-size)",
                fontWeight: "var(--font-weight-secondary-bold)",
                color: "var(--fg-neutral)",
              }}
            >
              {DESIGN_SYSTEM_VERSION}
            </span>
            {currentVersion && (
              <span
                style={{
                  fontSize: "var(--fonts-body-regular-text-size)",
                  color: "var(--fg-neutral-secondary)",
                }}
              >
                Released {formatDate(currentVersion.date)}
              </span>
            )}
          </div>
        </section>

        <section id="recent-updates" className="ds-content__section">
          <h6 className="ds-content__section-title">Updates Since Last Version</h6>
          {recentUpdates ? (
            <>
              <p className="ds-content__text">
                The following changes were included in version <strong>{recentUpdates.version}</strong>:
              </p>
              {renderChanges(recentUpdates)}
            </>
          ) : (
            <p className="ds-content__text">No recent updates available.</p>
          )}
        </section>
      </article>
    </PageLayout>
  );
}

