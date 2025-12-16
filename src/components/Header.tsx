"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import {
  SearchIcon,
  PaletteIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "./icons";

const HUE_OPTIONS: { value: HueVariant; label: string }[] = [
  { value: "hue-sky", label: "Hue Sky" },
  { value: "hue-indigo", label: "Hue Indigo" },
  { value: "chromatic-prime", label: "Chromatic" },
];

export function Header() {
  const { theme, hue, toggleTheme, setHue } = useTheme();
  const [isHueDropdownOpen, setIsHueDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentHueLabel =
    HUE_OPTIONS.find((opt) => opt.value === hue)?.label || "Hue Indigo";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsHueDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="ds-header">
      <div className="ds-header__start">
        <a href="/" className="ds-header__logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="var(--fg-primary)" />
            <circle cx="12" cy="8" r="3" fill="var(--bg-page-primary)" />
            <path
              d="M12 11v5"
              stroke="var(--bg-page-primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 14l3 3 3-3"
              stroke="var(--bg-page-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ds-header__logo-text">Beacon</span>
        </a>

        <div className="ds-header__search">
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Search Components..."
            className="ds-header__search-input"
          />
        </div>
      </div>

      <div className="ds-header__end">
        <div className="ds-header__version-badge">Version: 1.2</div>

        <div className="ds-header__hue-select" ref={dropdownRef}>
          <button
            className="ds-header__hue-trigger"
            onClick={() => setIsHueDropdownOpen(!isHueDropdownOpen)}
            aria-expanded={isHueDropdownOpen}
            aria-haspopup="listbox"
          >
            <PaletteIcon size={16} />
            <span>{currentHueLabel}</span>
            <ChevronDownIcon size={16} />
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
          {theme === "light" ? <MoonIcon size={24} /> : <SunIcon size={24} />}
        </button>
      </div>
    </header>
  );
}

