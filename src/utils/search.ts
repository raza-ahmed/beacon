import type { NavItem, NavSection } from "@/components/Sidebar";

export interface SearchableItem {
  label: string;
  href: string;
  section: string;
  category?: string;
}

/**
 * Flattens nested navigation structure into a searchable array
 */
export function flattenNavigationData(navigationData: NavSection[]): SearchableItem[] {
  const items: SearchableItem[] = [];

  navigationData.forEach((section) => {
    section.items.forEach((item) => {
      if (item.href) {
        // Direct link item
        items.push({
          label: item.label,
          href: item.href,
          section: section.title,
        });
      }

      if (item.children) {
        // Nested items (e.g., Design Tokens > Colors)
        item.children.forEach((child) => {
          if (child.href) {
            items.push({
              label: child.label,
              href: child.href,
              section: section.title,
              category: item.label,
            });
          }
        });
      }
    });
  });

  return items;
}

/**
 * Searches through navigation items and returns matching results
 * Results are sorted by relevance (exact match > starts with > contains)
 */
export function searchNavigation(
  query: string,
  items: SearchableItem[],
  maxResults: number = 10
): SearchableItem[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();
  const results: Array<SearchableItem & { score: number }> = [];

  items.forEach((item) => {
    const normalizedLabel = item.label.toLowerCase();
    const normalizedSection = item.section.toLowerCase();
    const normalizedCategory = item.category?.toLowerCase() || "";

    let score = 0;

    // Exact match on label (highest priority)
    if (normalizedLabel === normalizedQuery) {
      score = 100;
    }
    // Label starts with query
    else if (normalizedLabel.startsWith(normalizedQuery)) {
      score = 80;
    }
    // Label contains query
    else if (normalizedLabel.includes(normalizedQuery)) {
      score = 60;
    }
    // Category matches
    else if (normalizedCategory.includes(normalizedQuery)) {
      score = 40;
    }
    // Section matches
    else if (normalizedSection.includes(normalizedQuery)) {
      score = 20;
    }

    if (score > 0) {
      results.push({ ...item, score });
    }
  });

  // Sort by score (descending) and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ score, ...item }) => item);
}

