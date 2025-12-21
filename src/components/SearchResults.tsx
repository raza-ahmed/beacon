"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchableItem } from "@/utils/search";
import { ChevronRightIcon } from "./icons";

interface SearchResultsProps {
  items: SearchableItem[];
  query: string;
  onSelect: (href: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

export function SearchResults({
  items,
  query,
  onSelect,
  onClose,
  isVisible,
}: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (event.key === "Enter" && items.length > 0) {
        event.preventDefault();
        onSelect(items[selectedIndex].href);
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, items, selectedIndex, onSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  if (!isVisible) {
    return null;
  }

  if (items.length === 0 && query.length >= 2) {
    return (
      <div
        ref={resultsRef}
        className="ds-search-results"
        role="listbox"
        aria-label="Search results"
      >
        <div className="ds-search-results__empty">No results found!</div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  // Group items by section
  const groupedItems = items.reduce(
    (acc, item, index) => {
      const key = item.category ? `${item.section} > ${item.category}` : item.section;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ ...item, originalIndex: index });
      return acc;
    },
    {} as Record<string, Array<SearchableItem & { originalIndex: number }>>
  );

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} style={{ backgroundColor: "var(--bg-primary-tonal)", color: "var(--fg-primary-on-tonal)", padding: 0 }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={resultsRef}
      className="ds-search-results"
      role="listbox"
      aria-label="Search results"
    >
      {Object.entries(groupedItems).map(([groupKey, groupItems]) => (
        <div key={groupKey} className="ds-search-results__group">
          <div className="ds-search-results__group-title">{groupKey}</div>
          {groupItems.map((itemWithIndex, index) => {
            const { originalIndex, ...item } = itemWithIndex;
            const isSelected = originalIndex === selectedIndex;
            return (
              <a
                key={`${item.href}-${index}`}
                ref={(el) => {
                  itemRefs.current[originalIndex] = el;
                }}
                href={item.href}
                className={`ds-search-results__item ${isSelected ? "ds-search-results__item--selected" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(item.href);
                }}
                role="option"
                aria-selected={isSelected}
              >
                <span className="ds-search-results__item-label">
                  {highlightText(item.label, query)}
                </span>
                <ChevronRightIcon size="xs" className="ds-search-results__item-icon" />
              </a>
            );
          })}
        </div>
      ))}
    </div>
  );
}

