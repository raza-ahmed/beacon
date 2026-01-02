"use client";

import { PageLayout, type TocItem } from "@/components";
import { getVersionHistory, type VersionEntry } from "@/constants/version-data";

const tocItems: TocItem[] = [
  { id: "version-history", label: "Version History" },
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

function renderVersionEntry(entry: VersionEntry) {
  const categories = [
    { key: "added" as const, label: "Added" },
    { key: "changed" as const, label: "Changed" },
    { key: "fixed" as const, label: "Fixed" },
    { key: "deprecated" as const, label: "Deprecated" },
    { key: "removed" as const, label: "Removed" },
    { key: "security" as const, label: "Security" },
  ];

  const hasChanges = categories.some(({ key }) => entry[key] && entry[key]!.length > 0);

  return (
    <div key={entry.version} className="ds-content__entry">
      <div className="ds-content__flex" style={{ marginBottom: "var(--spacing-400)" }}>
        <h6 className="text-heading-h5" style={{ color: "var(--fg-neutral)", margin: 0, textTransform: "none" }}>
          {entry.version}
        </h6>
        <span className="text-body3-regular" style={{ color: "var(--fg-neutral-secondary)" }}>
          {formatDate(entry.date)}
        </span>
      </div>

      {hasChanges ? (
        <>
          {categories.map(({ key, label }) => {
            const items = entry[key];
            if (!items || items.length === 0) return null;

            return (
              <div key={key} style={{ marginBottom: "var(--spacing-400)" }}>
                <h6 className="text-title-small" style={{ color: "var(--fg-neutral)", marginBottom: "var(--spacing-200)", marginTop: 0, textTransform: "none" }}>
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
      ) : (
        <p className="ds-content__text" style={{ color: "var(--fg-neutral-secondary)" }}>
          No changes documented for this version.
        </p>
      )}
    </div>
  );
}

export default function ChangelogPage() {
  const versionHistory = getVersionHistory();

  return (
    <PageLayout tocItems={tocItems} currentPath="/changelog">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Changelog</h3>
          <p className="ds-content__subtitle">
            Complete version history of all changes made to Beacon Design System.
          </p>
        </header>

        <section id="version-history" className="ds-content__section">
          {versionHistory.length > 0 ? (
            versionHistory.map(renderVersionEntry)
          ) : (
            <p className="ds-content__text">No version history available.</p>
          )}
        </section>
      </article>
    </PageLayout>
  );
}

