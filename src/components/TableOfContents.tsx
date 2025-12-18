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
    const headerOffset = 150;
    
    // Function to get valid elements - may need to retry if not available yet
    const getValidElements = (): HTMLElement[] => {
      const elements: (HTMLElement | null)[] = items.map((item) => document.getElementById(item.id));
      return elements.filter((el): el is HTMLElement => el !== null);
    };

    // Wait for elements to be available (for pages with conditional rendering)
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 50;
    
    const setupObserver = () => {
      const validElements = getValidElements();
      
      if (validElements.length === 0 && retryCount < maxRetries) {
        retryCount++;
        setTimeout(setupObserver, retryDelay);
        return;
      }
      
      if (validElements.length === 0) return;
    
      const observer = new IntersectionObserver(
        (entries) => {
          // Get all currently intersecting entries
          const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
          
          if (intersectingEntries.length === 0) {
            // If nothing is intersecting, find the last section above viewport
            const currentElements = getValidElements();
            if (currentElements.length === 0) return;
            
            const scrollY = window.scrollY;
            const viewportTop = scrollY + headerOffset;
            let bestId: string | null = null;
            let bestTop = -Infinity;
            
            currentElements.forEach((el) => {
              if (!el.id) return;
              const rect = el.getBoundingClientRect();
              const elementTop = scrollY + rect.top;
              
              if (elementTop <= viewportTop && elementTop > bestTop) {
                bestTop = elementTop;
                bestId = el.id;
              }
            });
            
            if (bestId) {
              setActiveId(bestId);
            }
            return;
          }
          
          // Find the entry closest to the top of the viewport (accounting for header)
          const targetY = headerOffset;
          let bestEntry = intersectingEntries[0];
          let bestDistance = Math.abs(intersectingEntries[0].boundingClientRect.top - targetY);
          
          intersectingEntries.forEach((entry) => {
            const distance = Math.abs(entry.boundingClientRect.top - targetY);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestEntry = entry;
            }
          });
          
          setActiveId(bestEntry.target.id);
        },
        {
          rootMargin: `-${headerOffset}px 0px -60% 0px`,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
      );

      validElements.forEach((element) => {
        observer.observe(element);
      });

      // Also handle scroll for better responsiveness when sections are between thresholds
      let rafId: number | null = null;
      const handleScroll = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
          const currentElements = getValidElements();
          if (currentElements.length === 0) {
            rafId = null;
            return;
          }
          
          const scrollY = window.scrollY;
          const viewportTop = scrollY + headerOffset;
          let bestId: string | null = null;
          let bestTop = -Infinity;
          
          currentElements.forEach((el) => {
            if (!el.id) return;
            const rect = el.getBoundingClientRect();
            const elementTop = scrollY + rect.top;
            
            // Find section closest to but above viewport top
            if (elementTop <= viewportTop && elementTop > bestTop) {
              bestTop = elementTop;
              bestId = el.id;
            }
          });
          
          // Edge case: at top of page
          if (scrollY < 50 && currentElements[0]?.id) {
            bestId = currentElements[0].id;
          }
          
          // Edge case: at bottom of page
          if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
            const lastElement = currentElements[currentElements.length - 1];
            if (lastElement?.id) {
              bestId = lastElement.id;
            }
          }
          
          if (bestId) {
            setActiveId(bestId);
          }
          rafId = null;
        });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      // Initial check after a short delay to ensure DOM is ready
      // Only update if we're not at the top of the page
      setTimeout(() => {
        const scrollY = window.scrollY;
        if (scrollY < 50) {
          // At top of page, ensure first item is selected
          if (validElements[0]?.id) {
            setActiveId(validElements[0].id);
          }
        } else {
          // Not at top, run normal scroll handler
          handleScroll();
        }
      }, 100);

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    };
    
    setupObserver();
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

