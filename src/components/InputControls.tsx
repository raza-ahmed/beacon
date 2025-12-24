"use client";

import { Switch } from "./Switch";

type InputSize = "sm" | "md" | "lg";
type InputStatus = "default" | "active";

interface InputControlsProps {
  label?: string;
  placeholder?: string;
  value?: string;
  size?: InputSize;
  status?: InputStatus;
  showLabel?: boolean;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showPlaceholderIcon?: boolean;
  showError?: boolean;
  showNumberPrefix?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
  onLabelChange?: (label: string) => void;
  onPlaceholderChange?: (placeholder: string) => void;
  onValueChange?: (value: string) => void;
  onSizeChange?: (size: InputSize) => void;
  onStatusChange?: (status: InputStatus) => void;
  onShowLabelChange?: (show: boolean) => void;
  onShowStartIconChange?: (show: boolean) => void;
  onShowEndIconChange?: (show: boolean) => void;
  onShowPlaceholderIconChange?: (show: boolean) => void;
  onShowErrorChange?: (show: boolean) => void;
  onShowNumberPrefixChange?: (show: boolean) => void;
  onRoundedChange?: (rounded: boolean) => void;
  onIconOnlyChange?: (iconOnly: boolean) => void;
  onDisabledChange?: (disabled: boolean) => void;
}

const SIZE_OPTIONS: { value: InputSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const STATUS_OPTIONS: { value: InputStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "active", label: "Active" },
];

export function InputControls({
  label = "Label",
  placeholder = "Placeholder",
  value = "",
  size = "md",
  status = "default",
  showLabel = true,
  showStartIcon = false,
  showEndIcon = false,
  showPlaceholderIcon = false,
  showError = false,
  showNumberPrefix = false,
  rounded = false,
  iconOnly = false,
  disabled = false,
  onLabelChange,
  onPlaceholderChange,
  onValueChange,
  onSizeChange,
  onStatusChange,
  onShowLabelChange,
  onShowStartIconChange,
  onShowEndIconChange,
  onShowPlaceholderIconChange,
  onShowErrorChange,
  onShowNumberPrefixChange,
  onRoundedChange,
  onIconOnlyChange,
  onDisabledChange,
}: InputControlsProps) {
  return (
    <div className="ds-input-controls">
      <div className="ds-input-control-group ds-input-control-group--row">
        <div className="ds-input-control-field">
          <label htmlFor="input-size-select" className="ds-input-control-label">
            Size
          </label>
          <select
            id="input-size-select"
            className="ds-input-control-select"
            value={size}
            onChange={(e) => onSizeChange?.(e.target.value as InputSize)}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ds-input-control-field">
          <label htmlFor="input-status-select" className="ds-input-control-label">
            Status
          </label>
          <select
            id="input-status-select"
            className="ds-input-control-select"
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value as InputStatus)}
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
        <label htmlFor="input-value-input" className="ds-input-control-label">
          Value
        </label>
        <input
          id="input-value-input"
          type="text"
          className="ds-input-control-input"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          placeholder="Enter value text"
        />
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Show Label</span>
            <Switch
              id="input-show-label"
              checked={showLabel}
              onChange={onShowLabelChange}
              ariaLabel="Show Label"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Start Icon</span>
            <Switch
              id="input-show-start-icon"
              checked={showStartIcon}
              onChange={onShowStartIconChange}
              ariaLabel="Start Icon"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">End Icon</span>
            <Switch
              id="input-show-end-icon"
              checked={showEndIcon}
              onChange={onShowEndIconChange}
              ariaLabel="End Icon"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Placeholder Icon</span>
            <Switch
              id="input-show-placeholder-icon"
              checked={showPlaceholderIcon}
              onChange={onShowPlaceholderIconChange}
              ariaLabel="Placeholder Icon"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Error</span>
            <Switch
              id="input-show-error"
              checked={showError}
              onChange={onShowErrorChange}
              ariaLabel="Error"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Number Prefix</span>
            <Switch
              id="input-show-number-prefix"
              checked={showNumberPrefix}
              onChange={onShowNumberPrefixChange}
              ariaLabel="Number Prefix"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Rounded</span>
            <Switch
              id="input-rounded"
              checked={rounded}
              onChange={onRoundedChange}
              ariaLabel="Rounded"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Icon Only</span>
            <Switch
              id="input-icon-only"
              checked={iconOnly}
              onChange={onIconOnlyChange}
              ariaLabel="Icon Only"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Disabled</span>
            <Switch
              id="input-disabled"
              checked={disabled}
              onChange={onDisabledChange}
              ariaLabel="Disabled"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

