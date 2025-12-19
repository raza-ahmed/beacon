"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TableOfContents, type TocItem } from "./TableOfContents";
import { CloseIcon, SearchIcon } from "./icons";

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
              <div className="ds-mobile-drawer__search" role="search">
                <SearchIcon size="xs" />
                <input
                  id="mobile-drawer-search-input"
                  name="mobile-drawer-search"
                  type="text"
                  className="ds-mobile-drawer__search-input"
                  placeholder="Search Components..."
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

            <Sidebar currentPath={currentPath} />
          </aside>
        </div>
      )}
    </div>
  );
}

