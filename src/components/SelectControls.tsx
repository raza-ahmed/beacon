"use client";

import { Switch } from "./Switch";
import { Input, Select, Slider } from "beacon-ui";
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
          <Select
            id="select-size-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={size}
            options={SIZE_OPTIONS as SelectOption[]}
            onSelect={(value) => onSizeChange?.(value as SelectSize)}
          />
        </div>
        <div className="ds-input-control-field">
          <label htmlFor="select-status-select" className="ds-input-control-label">
            Status
          </label>
          <Select
            id="select-status-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={status}
            options={STATUS_OPTIONS as SelectOption[]}
            onSelect={(value) => onStatusChange?.(value as SelectStatus)}
          />
        </div>
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="select-label-input" className="ds-input-control-label">
          Label
        </label>
        <Input
          id="select-label-input"
          size="md"
          showLabel={false}
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Enter label text"
        />
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="select-selected-value-select" className="ds-input-control-label">
          Selected Value
        </label>
        <Select
          id="select-selected-value-select"
          size="md"
          showLabel={false}
          showStartIcon={false}
          showEndIcon={true}
          selectedValue={selectedValue}
          options={[{ value: "", label: "None" }, ...options]}
          onSelect={(value) => onSelectedValueChange?.(value)}
        />
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
        <label id="select-radius-slider-label" className="ds-input-control-label">Corner Radius</label>
        <Slider
          id="select-radius-slider"
          min={1}
          max={5}
          step={1}
          value={cornerRadius}
          stepCount={4}
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

