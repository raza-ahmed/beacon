"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TableOfContents, type TocItem } from "./TableOfContents";
import { CloseIcon, SearchIcon } from "./icons";
import { navigationData } from "./Sidebar";
import { flattenNavigationData, searchNavigation } from "@/utils/search";
import { SearchResults } from "./SearchResults";

interface PageLayoutProps {
  children: React.ReactNode;
  tocItems?: TocItem[];
  currentPath?: string;
}

export function PageLayout({
  children,
  tocItems = [],
  currentPath = "/",
}: PageLayoutProps) {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Flatten navigation data once
  const searchableItems = useMemo(
    () => flattenNavigationData(navigationData),
    []
  );

  // Search results for mobile
  const mobileSearchResults = useMemo(
    () => searchNavigation(mobileSearchQuery, searchableItems),
    [mobileSearchQuery, searchableItems]
  );

  const showMobileSearchResults = isMobileSearchFocused && mobileSearchQuery.length >= 2;

  useEffect(() => {
    if (!isMobileNavVisible) return;
    const t = window.setTimeout(() => setIsMobileNavOpen(true), 0);
    return () => window.clearTimeout(t);
  }, [isMobileNavVisible]);

  const openMobileNav = () => {
    if (isMobileNavVisible) return;
    setIsMobileNavVisible(true);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    window.setTimeout(() => setIsMobileNavVisible(false), 200);
  };

  return (
    <div className="ds-layout">
      <Header onMenuClick={openMobileNav} />
      <div className="ds-layout__body">
        <Sidebar currentPath={currentPath} />
        <main className="ds-layout__main">
          <div className="ds-layout__content">{children}</div>
        </main>
        {tocItems.length > 0 && <TableOfContents items={tocItems} />}
      </div>

      {isMobileNavVisible && (
        <div
          className="ds-mobile-drawer-root"
          role="dialog"
          aria-modal="true"
          data-state={isMobileNavOpen ? "open" : "closed"}
        >
          <button
            type="button"
            className="ds-mobile-drawer-backdrop"
            aria-label="Close navigation menu"
            onClick={closeMobileNav}
          />
          <aside
            className="ds-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ds-mobile-drawer__header">
              <div className="ds-mobile-drawer__search" ref={mobileSearchRef} role="search">
                <SearchIcon size="xs" className="ds-mobile-drawer__search-icon" />
                <input
                  id="mobile-drawer-search-input"
                  name="mobile-drawer-search"
                  type="text"
                  className="ds-mobile-drawer__search-input"
                  placeholder="Search Components..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onFocus={() => setIsMobileSearchFocused(true)}
                  aria-label="Search components and pages"
                  aria-autocomplete="list"
                  aria-expanded={showMobileSearchResults}
                />
                <SearchResults
                  items={mobileSearchResults}
                  query={mobileSearchQuery}
                  onSelect={(href) => {
                    window.location.href = href;
                    setMobileSearchQuery("");
                    setIsMobileSearchFocused(false);
                    closeMobileNav();
                  }}
                  onClose={() => setIsMobileSearchFocused(false)}
                  isVisible={showMobileSearchResults}
                />
              </div>

              <button
                type="button"
                className="ds-mobile-drawer__close"
                onClick={closeMobileNav}
                aria-label="Close navigation menu"
              >
                <CloseIcon size="rg" />
              </button>
            </div>

            {mobileSearchQuery.length < 2 && <Sidebar currentPath={currentPath} />}
          </aside>
        </div>
      )}
    </div>
  );
}

