"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id || null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <aside className="ds-toc">
      <nav className="ds-toc__nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={`ds-toc__item ${activeId === item.id ? "active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

