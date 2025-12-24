"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import {
  BeaconIcon,
  SearchIcon,
  PaletteIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
} from "./icons";
import { SearchResults } from "./SearchResults";
import { navigationData } from "./Sidebar";
import { flattenNavigationData, searchNavigation } from "@/utils/search";
import { getVersionString } from "@/constants/version";

const HUE_OPTIONS: { value: HueVariant; label: string }[] = [
  { value: "hue-sky", label: "Hue Sky" },
  { value: "hue-indigo", label: "Hue Indigo" },
  { value: "chromatic-prime", label: "Chromatic" },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, hue, toggleTheme, setHue } = useTheme();
  const [isHueDropdownOpen, setIsHueDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentHueLabel =
    HUE_OPTIONS.find((opt) => opt.value === hue)?.label || "Hue Indigo";

  // Flatten navigation data once
  const searchableItems = useMemo(
    () => flattenNavigationData(navigationData),
    []
  );

  // Search results
  const searchResults = useMemo(
    () => searchNavigation(searchQuery, searchableItems),
    [searchQuery, searchableItems]
  );

  const showSearchResults = isSearchFocused && searchQuery.length >= 2;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsHueDropdownOpen(false);
      }
      // Only close search if clicking outside and not on a search result
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement)?.closest?.(".ds-search-results")
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSelect = (href: string) => {
    window.location.href = href;
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <header className="ds-header">
      <div className="ds-header__start">
        <button
          type="button"
          className="ds-header__menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MenuIcon size="rg" />
        </button>

        <a href="/" className="ds-header__logo">
          <BeaconIcon size="rg" />
          <span className="ds-header__logo-text">Beacon</span>
        </a>

        <div className="ds-header__search" ref={searchRef}>
          <SearchIcon size="xs" className="ds-header__search-icon" />
          <input
            ref={searchInputRef}
            id="header-search-input"
            name="header-search"
            type="text"
            placeholder="Search Components..."
            className="ds-header__search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            aria-label="Search components and pages"
            aria-autocomplete="list"
            aria-expanded={showSearchResults}
          />
          <SearchResults
            items={searchResults}
            query={searchQuery}
            onSelect={handleSearchSelect}
            onClose={() => setIsSearchFocused(false)}
            isVisible={showSearchResults}
          />
        </div>
      </div>

      <div className="ds-header__end">
        <div className="ds-header__version-badge">{getVersionString("Version:")}</div>

        <div className="ds-header__hue-select" ref={dropdownRef}>
          <button
            className="ds-header__hue-trigger"
            onClick={() => setIsHueDropdownOpen(!isHueDropdownOpen)}
            aria-expanded={isHueDropdownOpen}
            aria-haspopup="listbox"
          >
            <PaletteIcon size="xs" className="ds-header__hue-icon" />
            <span>{currentHueLabel}</span>
            <ChevronDownIcon size="xs" />
          </button>

          {isHueDropdownOpen && (
            <div className="ds-header__hue-dropdown" role="listbox">
              {HUE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`ds-header__hue-option ${
                    hue === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setHue(option.value);
                    setIsHueDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={hue === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="ds-header__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <MoonIcon size="rg" /> : <SunIcon size="rg" />}
        </button>
      </div>
    </header>
  );
}

