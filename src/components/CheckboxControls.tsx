"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon, SunIcon, MoonIcon } from "./icons";

type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxControlsProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  size?: CheckboxSize;
  theme?: Theme;
  hue?: HueVariant;
  onCheckedChange?: (checked: boolean) => void;
  onIndeterminateChange?: (indeterminate: boolean) => void;
  onDisabledChange?: (disabled: boolean) => void;
  onLabelChange?: (label: string) => void;
  onSizeChange?: (size: CheckboxSize) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const SIZE_OPTIONS: { value: CheckboxSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function CheckboxControls({
  checked = false,
  indeterminate = false,
  disabled = false,
  label = "Select Me",
  size = "md",
  theme,
  hue,
  onCheckedChange,
  onIndeterminateChange,
  onDisabledChange,
  onLabelChange,
  onSizeChange,
  onThemeChange,
  onHueChange,
}: CheckboxControlsProps) {
  return (
    <div className="ds-checkbox-controls">
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

      <div className="ds-checkbox-control-group">
        <label htmlFor="checkbox-size-select" className="ds-checkbox-control-label">
          Size
        </label>
        <select
          id="checkbox-size-select"
          className="ds-checkbox-control-select"
          value={size}
          onChange={(e) => onSizeChange?.(e.target.value as CheckboxSize)}
        >
          {SIZE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ds-checkbox-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-checkbox-control-label">Checked</span>
            <label htmlFor="checkbox-checked" className="ds-switch">
              <input
                id="checkbox-checked"
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  onCheckedChange?.(e.target.checked);
                  if (e.target.checked && indeterminate) {
                    onIndeterminateChange?.(false);
                  }
                }}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-checkbox-control-label">Indeterminate</span>
            <label htmlFor="checkbox-indeterminate" className="ds-switch">
              <input
                id="checkbox-indeterminate"
                type="checkbox"
                checked={indeterminate}
                onChange={(e) => {
                  onIndeterminateChange?.(e.target.checked);
                  if (e.target.checked && checked) {
                    onCheckedChange?.(false);
                  }
                }}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="ds-checkbox-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-checkbox-control-label">Disabled</span>
            <label htmlFor="checkbox-disabled" className="ds-switch">
              <input
                id="checkbox-disabled"
                type="checkbox"
                checked={disabled}
                onChange={(e) => onDisabledChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="ds-checkbox-control-group">
        <label htmlFor="checkbox-label-input" className="ds-checkbox-control-label">
          Label
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
    </div>
  );
}

