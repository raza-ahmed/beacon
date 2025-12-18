"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationData: NavSection[] = [
  {
    title: "Get Started",
    items: [
      { label: "Introduction", href: "/" },
      { label: "How to Use", href: "/how-to-use" },
    ],
  },
  {
    title: "Foundations",
    items: [
      {
        label: "Design Tokens",
        children: [
          { label: "Colors", href: "/foundations/colors" },
          { label: "Spacing", href: "/foundations/spacing" },
          { label: "Themes", href: "/foundations/themes" },
        ],
      },
      { label: "Typography", href: "/foundations/typography" },
      { label: "Responsiveness", href: "/foundations/responsiveness" },
      { label: "Accessibility", href: "/foundations/accessibility" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Avatar", href: "/components/avatar" },
      { label: "Button", href: "/components/button" },
      { label: "Cards", href: "/components/cards" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Input Fields", href: "/components/input-fields" },
      { label: "Menu", href: "/components/menu" },
      { label: "Table", href: "/components/table" },
    ],
  },
];


interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  currentPath?: string;
  level?: number;
}

function NavItemComponent({ item, isActive, currentPath, level = 0 }: NavItemComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    // Check if any child is active
    const hasActiveChild = item.children!.some((child) => child.href === currentPath);
    
    return (
      <div className="ds-sidebar__nav-group">
        <button
          className={`ds-sidebar__nav-item ds-sidebar__nav-item--expandable ${
            isActive || hasActiveChild ? "active" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span>{item.label}</span>
          {isExpanded ? <ChevronUpIcon size="sm" /> : <ChevronDownIcon size="sm" />}
        </button>
        {isExpanded && (
          <div className="ds-sidebar__nav-submenu">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.label}
                item={child}
                isActive={child.href === currentPath}
                currentPath={currentPath}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      className={`ds-sidebar__nav-item ${isActive ? "active" : ""}`}
    >
      {item.label}
    </a>
  );
}

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = "/" }: SidebarProps) {
  return (
    <aside className="ds-sidebar">
      <nav className="ds-sidebar__nav">
        {navigationData.map((section) => (
          <div key={section.title} className="ds-sidebar__section">
            <h3 className="ds-sidebar__section-title">{section.title}</h3>
            <div className="ds-sidebar__section-items">
              {section.items.map((item) => (
                <NavItemComponent
                  key={item.label}
                  item={item}
                  isActive={item.href === currentPath}
                  currentPath={currentPath}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

