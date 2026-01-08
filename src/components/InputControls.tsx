"use client";

import { Switch } from "./Switch";
import { Input, Select, Slider } from "beacon-ui";
import type { CornerRadiusStep, SelectOption } from "beacon-ui";

type InputSize = "sm" | "md" | "lg" | "xl";
type InputStatus = "default" | "hover" | "active" | "error" | "disabled";

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
  showNumberPrefix?: boolean;
  cornerRadius?: CornerRadiusStep;
  iconOnly?: boolean;
  onLabelChange?: (label: string) => void;
  onPlaceholderChange?: (placeholder: string) => void;
  onValueChange?: (value: string) => void;
  onSizeChange?: (size: InputSize) => void;
  onStatusChange?: (status: InputStatus) => void;
  onShowLabelChange?: (show: boolean) => void;
  onShowStartIconChange?: (show: boolean) => void;
  onShowEndIconChange?: (show: boolean) => void;
  onShowPlaceholderIconChange?: (show: boolean) => void;
  onShowNumberPrefixChange?: (show: boolean) => void;
  onCornerRadiusChange?: (radius: CornerRadiusStep) => void;
  onIconOnlyChange?: (iconOnly: boolean) => void;
}

const SIZE_OPTIONS: { value: InputSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

const STATUS_OPTIONS: { value: InputStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "hover", label: "Hover" },
  { value: "active", label: "Active" },
  { value: "error", label: "Error" },
  { value: "disabled", label: "Disabled" },
];

const CORNER_RADIUS_LABELS = ["None", "Extra Small", "Small", "Medium", "Large", "Extra Large"];

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
  showNumberPrefix = false,
  cornerRadius = 1,
  iconOnly = false,
  onLabelChange,
  onPlaceholderChange,
  onValueChange,
  onSizeChange,
  onStatusChange,
  onShowLabelChange,
  onShowStartIconChange,
  onShowEndIconChange,
  onShowPlaceholderIconChange,
  onShowNumberPrefixChange,
  onCornerRadiusChange,
  onIconOnlyChange,
}: InputControlsProps) {
  return (
    <div className="ds-input-controls">
      <div className="ds-input-control-group ds-input-control-group--row">
        <div className="ds-input-control-field">
          <label htmlFor="input-size-select" className="ds-input-control-label">
            Size
          </label>
          <Select
            id="input-size-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={size}
            options={SIZE_OPTIONS as SelectOption[]}
            onSelect={(value) => onSizeChange?.(value as InputSize)}
          />
        </div>
        <div className="ds-input-control-field">
          <label htmlFor="input-status-select" className="ds-input-control-label">
            Status
          </label>
          <Select
            id="input-status-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={status}
            options={STATUS_OPTIONS as SelectOption[]}
            onSelect={(value) => onStatusChange?.(value as InputStatus)}
          />
        </div>
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="input-label-input" className="ds-input-control-label">
          Label
        </label>
        <Input
          id="input-label-input"
          size="md"
          showLabel={false}
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Enter label text"
        />
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="input-placeholder-input" className="ds-input-control-label">
          Placeholder
        </label>
        <Input
          id="input-placeholder-input"
          size="md"
          showLabel={false}
          value={placeholder}
          onChange={(e) => onPlaceholderChange?.(e.target.value)}
          placeholder="Enter placeholder text"
        />
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="input-value-input" className="ds-input-control-label">
          Value
        </label>
        <Input
          id="input-value-input"
          size="md"
          showLabel={false}
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
            <span className="ds-input-control-label">Number Prefix</span>
            <Switch
              id="input-show-number-prefix"
              checked={showNumberPrefix}
              onChange={onShowNumberPrefixChange}
              ariaLabel="Number Prefix"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Icon Only</span>
            <Switch
              id="input-icon-only"
              checked={iconOnly}
              onChange={onIconOnlyChange}
              ariaLabel="Icon Only"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <label id="input-radius-slider-label" className="ds-input-control-label">Corner Radius</label>
        <Slider
          id="input-radius-slider"
          min={0}
          max={5}
          step={1}
          value={cornerRadius}
          stepCount={5}
          showSteps={true}
          showTooltip={true}
          showLabel={false}
          stepLabels={CORNER_RADIUS_LABELS}
          onChange={(value) => onCornerRadiusChange?.(value as CornerRadiusStep)}
        />
      </div>
    </div>
  );
}

