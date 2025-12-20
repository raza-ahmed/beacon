"use client";

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
            <label htmlFor="input-show-label" className="ds-switch">
              <input
                id="input-show-label"
                type="checkbox"
                checked={showLabel}
                onChange={(e) => onShowLabelChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Start Icon</span>
            <label htmlFor="input-show-start-icon" className="ds-switch">
              <input
                id="input-show-start-icon"
                type="checkbox"
                checked={showStartIcon}
                onChange={(e) => onShowStartIconChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">End Icon</span>
            <label htmlFor="input-show-end-icon" className="ds-switch">
              <input
                id="input-show-end-icon"
                type="checkbox"
                checked={showEndIcon}
                onChange={(e) => onShowEndIconChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Placeholder Icon</span>
            <label htmlFor="input-show-placeholder-icon" className="ds-switch">
              <input
                id="input-show-placeholder-icon"
                type="checkbox"
                checked={showPlaceholderIcon}
                onChange={(e) => onShowPlaceholderIconChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Error</span>
            <label htmlFor="input-show-error" className="ds-switch">
              <input
                id="input-show-error"
                type="checkbox"
                checked={showError}
                onChange={(e) => onShowErrorChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Number Prefix</span>
            <label htmlFor="input-show-number-prefix" className="ds-switch">
              <input
                id="input-show-number-prefix"
                type="checkbox"
                checked={showNumberPrefix}
                onChange={(e) => onShowNumberPrefixChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Rounded</span>
            <label htmlFor="input-rounded" className="ds-switch">
              <input
                id="input-rounded"
                type="checkbox"
                checked={rounded}
                onChange={(e) => onRoundedChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Icon Only</span>
            <label htmlFor="input-icon-only" className="ds-switch">
              <input
                id="input-icon-only"
                type="checkbox"
                checked={iconOnly}
                onChange={(e) => onIconOnlyChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Disabled</span>
            <label htmlFor="input-disabled" className="ds-switch">
              <input
                id="input-disabled"
                type="checkbox"
                checked={disabled}
                onChange={(e) => onDisabledChange?.(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

