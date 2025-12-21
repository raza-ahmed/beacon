"use client";

import { useState, useRef, useEffect } from "react";
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

        <div className="ds-header__search">
          <SearchIcon size="xs" />
          <input
            id="header-search-input"
            name="header-search"
            type="text"
            placeholder="Search Components..."
            className="ds-header__search-input"
          />
        </div>
      </div>

      <div className="ds-header__end">
        <div className="ds-header__version-badge">Version: 2.8</div>

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

