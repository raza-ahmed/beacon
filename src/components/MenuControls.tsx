"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon, DeleteBinIcon } from "./icons";
import { Switch } from "./Switch";

type MenuVariant = "desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu";

interface MenuItem {
  id: string;
  label: string;
}

interface MenuControlsProps {
  variant?: MenuVariant;
  showMenu?: boolean;
  showButton?: boolean;
  menuItems?: MenuItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  showChevrons?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  onVariantChange?: (variant: MenuVariant) => void;
  onShowMenuChange?: (show: boolean) => void;
  onShowButtonChange?: (show: boolean) => void;
  onMenuItemsChange?: (items: MenuItem[]) => void;
  onHeaderTitleChange?: (title: string) => void;
  onHeaderSubtitleChange?: (subtitle: string) => void;
  onShowChevronsChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const VARIANT_OPTIONS: { value: MenuVariant; label: string }[] = [
  { value: "desktop", label: "Desktop" },
  { value: "tablet-open", label: "Tablet Open" },
  { value: "tablet-closed", label: "Tablet Closed" },
  { value: "mobile-open", label: "Mobile Open" },
  { value: "mobile-closed", label: "Mobile Closed" },
  { value: "close-menu", label: "Close Menu" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function MenuControls({
  variant = "desktop",
  showMenu = true,
  showButton = true,
  menuItems = [],
  headerTitle = "Title",
  headerSubtitle = "Subtitle",
  showChevrons = true,
  theme,
  hue,
  onVariantChange,
  onShowMenuChange,
  onShowButtonChange,
  onMenuItemsChange,
  onHeaderTitleChange,
  onHeaderSubtitleChange,
  onShowChevronsChange,
  onThemeChange,
  onHueChange,
}: MenuControlsProps) {
  const handleMenuItemLabelChange = (id: string, label: string) => {
    const updated = menuItems.map((item) => (item.id === id ? { ...item, label } : item));
    onMenuItemsChange?.(updated);
  };

  const handleAddMenuItem = () => {
    const newId = String(menuItems.length + 1);
    const newItem: MenuItem = { id: newId, label: `Menu Item #${newId}` };
    onMenuItemsChange?.([...menuItems, newItem]);
  };

  const handleRemoveMenuItem = (id: string) => {
    const updated = menuItems.filter((item) => item.id !== id);
    onMenuItemsChange?.(updated);
  };

  return (
    <div className="ds-menu-controls">
      {/* Color section at the top */}
      <div className="ds-menu-control-group">
        <span className="ds-menu-control-label">Color</span>
        <div className="ds-color-control-row" role="group" aria-label="Color selection">
          <div className="ds-hue-swatch-grid">
            {HUE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ds-hue-swatch ds-hue-swatch--small ${
                  hue === opt.value ? "ds-hue-swatch--active" : ""
                }`}
                onClick={() => onHueChange?.(opt.value)}
                style={{ backgroundColor: opt.color }}
                aria-label={`Select ${opt.label} hue`}
                title={opt.label}
              >
                {hue === opt.value && <CheckIcon size="sm" className="ds-hue-swatch__check" />}
              </button>
            ))}
          </div>
          <div className="ds-theme-toggle">
            <Switch
              id="menu-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange?.(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      {/* Variant dropdown */}
      <div className="ds-menu-control-group">
        <label htmlFor="menu-variant-select" className="ds-menu-control-label">
          Variant
        </label>
        <select
          id="menu-variant-select"
          className="ds-menu-control-select"
          value={variant}
          onChange={(e) => onVariantChange?.(e.target.value as MenuVariant)}
        >
          {VARIANT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Show Button and Show Chevrons toggles */}
      <div className="ds-menu-control-group ds-menu-control-group--row">
        <div className="ds-icon-fill-section">
          <span className="ds-menu-control-label">Show Button</span>
          <Switch
            id="menu-show-button"
            checked={showButton}
            onChange={onShowButtonChange}
            ariaLabel="Show Button"
          />
        </div>
        <div className="ds-icon-fill-section">
          <span className="ds-menu-control-label">Show Chevrons</span>
          <Switch
            id="menu-show-chevrons"
            checked={showChevrons}
            onChange={onShowChevronsChange}
            ariaLabel="Show Chevrons"
          />
        </div>
      </div>

      {/* Menu Items management */}
      <div className="ds-menu-control-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-200)" }}>
          <span className="ds-menu-control-label">Menu Items</span>
          <button
            type="button"
            onClick={handleAddMenuItem}
            style={{
              padding: "var(--spacing-100) var(--spacing-200)",
              borderRadius: "var(--corner-radius-100)",
              border: "var(--border-width-25) solid var(--border-strong-200)",
              backgroundColor: "var(--bg-page-primary)",
              color: "var(--fg-neutral)",
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-small-text-size)",
              cursor: "pointer",
            }}
          >
            Add Item
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-200)" }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "var(--spacing-200)", alignItems: "center" }}>
              <input
                type="text"
                className="ds-menu-control-input"
                value={item.label}
                onChange={(e) => handleMenuItemLabelChange(item.id, e.target.value)}
                placeholder="Menu item label"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => handleRemoveMenuItem(item.id)}
                aria-label="Remove menu item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "var(--spacing-100)",
                  borderRadius: "var(--corner-radius-100)",
                  border: "var(--border-width-25) solid var(--border-strong-200)",
                  backgroundColor: "var(--bg-page-primary)",
                  color: "var(--fg-critical)",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  flexShrink: 0,
                }}
              >
                <DeleteBinIcon size="sm" />
              </button>
            </div>
          ))}
          {menuItems.length === 0 && (
            <p style={{ color: "var(--fg-neutral-tertiary)", fontSize: "var(--body-small-text-size)", margin: 0 }}>
              No menu items. Click "Add Item" to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

