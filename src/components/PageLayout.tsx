"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TableOfContents, type TocItem } from "./TableOfContents";

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
  return (
    <div className="ds-layout">
      <Header />
      <div className="ds-layout__body">
        <Sidebar currentPath={currentPath} />
        <main className="ds-layout__main">
          <div className="ds-layout__content">{children}</div>
        </main>
        {tocItems.length > 0 && <TableOfContents items={tocItems} />}
      </div>
    </div>
  );
}

