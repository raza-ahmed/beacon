"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon, SunIcon, MoonIcon } from "./icons";

type CheckboxStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface CheckboxControlsProps {
  checked?: boolean;
  status?: CheckboxStatus;
  label?: string;
  showLabel?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  onCheckedChange?: (checked: boolean) => void;
  onStatusChange?: (status: CheckboxStatus) => void;
  onLabelChange?: (label: string) => void;
  onShowLabelChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const STATUS_OPTIONS: { value: CheckboxStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "hovered", label: "Hovered" },
  { value: "focused", label: "Focused" },
  { value: "pressed", label: "Pressed" },
  { value: "disabled", label: "Disabled" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function CheckboxControls({
  checked = false,
  status = "default",
  label = "Checkbox",
  showLabel = true,
  theme,
  hue,
  onCheckedChange,
  onStatusChange,
  onLabelChange,
  onShowLabelChange,
  onThemeChange,
  onHueChange,
}: CheckboxControlsProps) {
  return (
    <div className="ds-checkbox-controls">
      {/* Color section at the top */}
      <div className="ds-checkbox-control-group">
        <span className="ds-checkbox-control-label">Color</span>
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
            <button
              type="button"
              className={`ds-theme-toggle-button ${
                theme === "light" ? "ds-theme-toggle-button--active" : ""
              }`}
              onClick={() => onThemeChange?.("light")}
              aria-label="Light theme"
            >
              <SunIcon size="sm" />
            </button>
            <button
              type="button"
              className={`ds-theme-toggle-button ${
                theme === "dark" ? "ds-theme-toggle-button--active" : ""
              }`}
              onClick={() => onThemeChange?.("dark")}
              aria-label="Dark theme"
            >
              <MoonIcon size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Status dropdown */}
      <div className="ds-checkbox-control-group">
        <label htmlFor="checkbox-status-select" className="ds-checkbox-control-label">
          Status
        </label>
        <select
          id="checkbox-status-select"
          className="ds-checkbox-control-select"
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value as CheckboxStatus)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Checked and Label toggles side by side */}
      <div className="ds-checkbox-control-group ds-checkbox-control-group--row">
        <div className="ds-icon-fill-section">
          <span className="ds-checkbox-control-label">Checked</span>
          <label htmlFor="checkbox-checked" className="ds-switch">
            <input
              id="checkbox-checked"
              type="checkbox"
              checked={checked}
              onChange={(e) => onCheckedChange?.(e.target.checked)}
            />
            <span className="ds-switch__slider" />
          </label>
        </div>
        <div className="ds-icon-fill-section">
          <span className="ds-checkbox-control-label">Label</span>
          <label htmlFor="checkbox-show-label" className="ds-switch">
            <input
              id="checkbox-show-label"
              type="checkbox"
              checked={showLabel}
              onChange={(e) => onShowLabelChange?.(e.target.checked)}
            />
            <span className="ds-switch__slider" />
          </label>
        </div>
      </div>

      {/* Label input field - only shown when label toggle is enabled */}
      {showLabel && (
        <div className="ds-checkbox-control-group">
          <label htmlFor="checkbox-label-input" className="ds-checkbox-control-label">
            Label Text
          </label>
          <input
            id="checkbox-label-input"
            type="text"
            className="ds-checkbox-control-input"
            value={label}
            onChange={(e) => onLabelChange?.(e.target.value)}
            placeholder="Enter label text"
          />
        </div>
      )}
    </div>
  );
}
