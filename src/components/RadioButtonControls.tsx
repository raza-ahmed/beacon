"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch } from "./Switch";
import { Input, Select } from "beacon-ui";
import type { SelectOption } from "beacon-ui";

type RadioButtonStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface RadioButtonControlsProps {
  selected?: boolean;
  status?: RadioButtonStatus;
  label?: string;
  showLabel?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  onSelectedChange?: (selected: boolean) => void;
  onStatusChange?: (status: RadioButtonStatus) => void;
  onLabelChange?: (label: string) => void;
  onShowLabelChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const STATUS_OPTIONS: { value: RadioButtonStatus; label: string }[] = [
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

export function RadioButtonControls({
  selected = false,
  status = "default",
  label = "Radio Button",
  showLabel = true,
  theme,
  hue,
  onSelectedChange,
  onStatusChange,
  onLabelChange,
  onShowLabelChange,
  onThemeChange,
  onHueChange,
}: RadioButtonControlsProps) {
  return (
    <div className="ds-radio-button-controls">
      {/* Color section at the top */}
      <div className="ds-radio-button-control-group">
        <span className="ds-radio-button-control-label">Color</span>
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
              id="radio-button-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange?.(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      {/* Status dropdown */}
      <div className="ds-radio-button-control-group">
        <label htmlFor="radio-status-select" className="ds-radio-button-control-label">
          Status
        </label>
        <Select
          id="radio-status-select"
          size="md"
          showLabel={false}
          showStartIcon={false}
          showEndIcon={true}
          selectedValue={status}
          options={STATUS_OPTIONS as SelectOption[]}
          onSelect={(value) => onStatusChange?.(value as RadioButtonStatus)}
        />
      </div>

      {/* Selected and Label toggles side by side */}
      <div className="ds-radio-button-control-group ds-radio-button-control-group--row">
        <div className="ds-icon-fill-section">
          <span className="ds-radio-button-control-label">Selected</span>
          <Switch
            id="radio-selected"
            checked={selected}
            onChange={onSelectedChange}
            ariaLabel="Selected"
          />
        </div>
        <div className="ds-icon-fill-section">
          <span className="ds-radio-button-control-label">Label</span>
          <Switch
            id="radio-show-label"
            checked={showLabel}
            onChange={onShowLabelChange}
            ariaLabel="Label"
          />
        </div>
      </div>

      {/* Label input field - only shown when label toggle is enabled */}
      {showLabel && (
        <div className="ds-radio-button-control-group">
          <label htmlFor="radio-label-input" className="ds-radio-button-control-label">
            Label Text
          </label>
          <Input
            id="radio-label-input"
            size="md"
            showLabel={false}
            value={label}
            onChange={(e) => onLabelChange?.(e.target.value)}
            placeholder="Enter label text"
          />
        </div>
      )}
    </div>
  );
}

