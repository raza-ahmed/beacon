"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon, SunIcon, MoonIcon } from "./icons";
import { Switch } from "./Switch";

type SwitchStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface SwitchControlsProps {
  checked?: boolean;
  status?: SwitchStatus;
  showIcons?: boolean;
  label?: string;
  showLabel?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  onCheckedChange?: (checked: boolean) => void;
  onStatusChange?: (status: SwitchStatus) => void;
  onShowIconsChange?: (show: boolean) => void;
  onLabelChange?: (label: string) => void;
  onShowLabelChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const STATUS_OPTIONS: { value: SwitchStatus; label: string }[] = [
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

export function SwitchControls({
  checked = false,
  status = "default",
  showIcons = false,
  label = "Switch",
  showLabel = false,
  theme,
  hue,
  onCheckedChange,
  onStatusChange,
  onShowIconsChange,
  onLabelChange,
  onShowLabelChange,
  onThemeChange,
  onHueChange,
}: SwitchControlsProps) {
  return (
    <div className="ds-switch-controls">
      <div className="ds-switch-control-group">
        <span className="ds-switch-control-label">Color</span>
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

      <div className="ds-switch-control-group">
        <label htmlFor="switch-status-select" className="ds-switch-control-label">
          Status
        </label>
        <select
          id="switch-status-select"
          className="ds-switch-control-select"
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value as SwitchStatus)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ds-switch-control-group ds-switch-control-group--row">
        <div className="ds-icon-fill-section">
          <span className="ds-switch-control-label">Checked</span>
          <Switch
            id="switch-checked"
            checked={checked}
            onChange={onCheckedChange}
            ariaLabel="Checked"
          />
        </div>
        <div className="ds-icon-fill-section">
          <span className="ds-switch-control-label">Show Icons</span>
          <Switch
            id="switch-show-icons"
            checked={showIcons}
            onChange={onShowIconsChange}
            ariaLabel="Show Icons"
          />
        </div>
      </div>

      <div className="ds-switch-control-group ds-switch-control-group--row">
        <div className="ds-icon-fill-section">
          <span className="ds-switch-control-label">Label</span>
          <Switch
            id="switch-show-label"
            checked={showLabel}
            onChange={onShowLabelChange}
            ariaLabel="Label"
          />
        </div>
      </div>

      {showLabel && (
        <div className="ds-switch-control-group">
          <label htmlFor="switch-label-input" className="ds-switch-control-label">
            Label Text
          </label>
          <input
            id="switch-label-input"
            type="text"
            className="ds-switch-control-input"
            value={label}
            onChange={(e) => onLabelChange?.(e.target.value)}
            placeholder="Enter label text"
          />
        </div>
      )}
    </div>
  );
}

