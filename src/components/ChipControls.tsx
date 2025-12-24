"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch } from "./Switch";

type ChipSize = "sm" | "md" | "lg";
type ChipColor = "primary" | "neutral" | "success" | "critical" | "warning";

interface ChipControlsProps {
  label?: string;
  color?: ChipColor;
  size?: ChipSize;
  showBorders?: boolean;
  showIcon?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  onLabelChange?: (label: string) => void;
  onColorChange?: (color: ChipColor) => void;
  onSizeChange?: (size: ChipSize) => void;
  onShowBordersChange?: (show: boolean) => void;
  onShowIconChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const SIZE_OPTIONS: { value: ChipSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const COLOR_OPTIONS: { value: ChipColor; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "neutral", label: "Neutral" },
  { value: "success", label: "Success" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function ChipControls({
  label = "Identifier",
  color = "primary",
  size = "md",
  showBorders = false,
  showIcon = false,
  theme,
  hue,
  onLabelChange,
  onColorChange,
  onSizeChange,
  onShowBordersChange,
  onShowIconChange,
  onThemeChange,
  onHueChange,
}: ChipControlsProps) {
  return (
    <div className="ds-chip-controls">
      <div className="ds-chip-control-group">
        <span className="ds-chip-control-label">Color</span>
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
              id="chip-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange?.(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-chip-control-group ds-chip-control-group--row">
        <div className="ds-chip-control-field">
          <label htmlFor="chip-size-select" className="ds-chip-control-label">
            Size
          </label>
          <select
            id="chip-size-select"
            className="ds-chip-control-select"
            value={size}
            onChange={(e) => onSizeChange?.(e.target.value as ChipSize)}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ds-chip-control-field">
          <label htmlFor="chip-color-select" className="ds-chip-control-label">
            Color Variant
          </label>
          <select
            id="chip-color-select"
            className="ds-chip-control-select"
            value={color}
            onChange={(e) => onColorChange?.(e.target.value as ChipColor)}
          >
            {COLOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-chip-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-chip-control-label">Show Borders</span>
            <Switch
              id="chip-show-borders"
              checked={showBorders}
              onChange={onShowBordersChange}
              ariaLabel="Show Borders"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-chip-control-label">Show Icon</span>
            <Switch
              id="chip-show-icon"
              checked={showIcon}
              onChange={onShowIconChange}
              ariaLabel="Show Icon"
            />
          </div>
        </div>
      </div>

      <div className="ds-chip-control-group">
        <label htmlFor="chip-label-input" className="ds-chip-control-label">
          Label
        </label>
        <input
          id="chip-label-input"
          type="text"
          className="ds-chip-control-input"
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Enter label text"
        />
      </div>
    </div>
  );
}

