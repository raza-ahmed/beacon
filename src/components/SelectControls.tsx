"use client";

import { Switch } from "./Switch";
import type { SelectOption, CornerRadiusStep, SelectStatus } from "beacon-ui";

type SelectSize = "sm" | "md" | "lg" | "xl";

interface SelectControlsProps {
  label?: string;
  selectedValue?: string;
  size?: SelectSize;
  status?: SelectStatus;
  showLabel?: boolean;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  cornerRadius?: CornerRadiusStep;
  options?: SelectOption[];
  onLabelChange?: (label: string) => void;
  onSelectedValueChange?: (value: string) => void;
  onSizeChange?: (size: SelectSize) => void;
  onStatusChange?: (status: SelectStatus) => void;
  onShowLabelChange?: (show: boolean) => void;
  onShowStartIconChange?: (show: boolean) => void;
  onShowEndIconChange?: (show: boolean) => void;
  onCornerRadiusChange?: (radius: CornerRadiusStep) => void;
  onOptionsChange?: (options: SelectOption[]) => void;
}

const CORNER_RADIUS_LABELS = ["Extra Small", "Small", "Medium", "Large", "Extra Large"];

const SIZE_OPTIONS: { value: SelectSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

const STATUS_OPTIONS: { value: SelectStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "hover", label: "Hover" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

export function SelectControls({
  label = "Select Label",
  selectedValue = "",
  size = "md",
  status = "default",
  showLabel = true,
  showStartIcon = true,
  showEndIcon = true,
  cornerRadius = 1,
  options = [],
  onLabelChange,
  onSelectedValueChange,
  onSizeChange,
  onStatusChange,
  onShowLabelChange,
  onShowStartIconChange,
  onShowEndIconChange,
  onCornerRadiusChange,
}: SelectControlsProps) {
  return (
    <div className="ds-input-controls">
      <div className="ds-input-control-group ds-input-control-group--row">
        <div className="ds-input-control-field">
          <label htmlFor="select-size-select" className="ds-input-control-label">
            Size
          </label>
          <select
            id="select-size-select"
            className="ds-input-control-select"
            value={size}
            onChange={(e) => onSizeChange?.(e.target.value as SelectSize)}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ds-input-control-field">
          <label htmlFor="select-status-select" className="ds-input-control-label">
            Status
          </label>
          <select
            id="select-status-select"
            className="ds-input-control-select"
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value as SelectStatus)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="select-label-input" className="ds-input-control-label">
          Label
        </label>
        <input
          id="select-label-input"
          type="text"
          className="ds-input-control-input"
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Enter label text"
        />
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="select-selected-value-select" className="ds-input-control-label">
          Selected Value
        </label>
        <select
          id="select-selected-value-select"
          className="ds-input-control-select"
          value={selectedValue}
          onChange={(e) => onSelectedValueChange?.(e.target.value)}
        >
          <option value="">None</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Show Label</span>
            <Switch
              id="select-show-label"
              checked={showLabel}
              onChange={onShowLabelChange}
              ariaLabel="Show Label"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Start Icon</span>
            <Switch
              id="select-show-start-icon"
              checked={showStartIcon}
              onChange={onShowStartIconChange}
              ariaLabel="Start Icon"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">End Icon</span>
            <Switch
              id="select-show-end-icon"
              checked={showEndIcon}
              onChange={onShowEndIconChange}
              ariaLabel="End Icon"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="select-radius-slider" className="ds-input-control-label">Corner Radius</label>
        <div className="ds-step-slider">
          <div
            className="ds-step-slider__track"
            style={{
              ["--active-width" as string]: `${((cornerRadius - 1) / 4) * 100}%`,
            }}
          >
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`ds-step-slider__step ${step === cornerRadius ? "ds-step-slider__step--active" : ""}`}
              />
            ))}
          </div>
          <input
            id="select-radius-slider"
            type="range"
            min="1"
            max="5"
            step="1"
            value={cornerRadius}
            onChange={(e) => onCornerRadiusChange?.(Number.parseInt(e.target.value, 10) as CornerRadiusStep)}
            className="ds-step-slider__input"
            aria-label="Corner radius"
          />
          <div className="ds-step-slider__labels">
            {CORNER_RADIUS_LABELS.map((label, index) => (
              <span key={index} className="ds-step-slider__label">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

