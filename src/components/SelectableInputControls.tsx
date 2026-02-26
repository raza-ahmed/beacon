"use client";

import { Switch } from "./Switch";
import { Input, Select, Slider } from "beacon-ui";
import type { CornerRadiusStep, SelectOption, SelectableInputSize } from "beacon-ui";

interface SelectableInputControlsProps {
  label?: string;
  size?: SelectableInputSize;
  selected?: boolean;
  disabled?: boolean;
  cornerRadius?: CornerRadiusStep;
  fullWidth?: boolean;
  onLabelChange?: (label: string) => void;
  onSizeChange?: (size: SelectableInputSize) => void;
  onSelectedChange?: (selected: boolean) => void;
  onDisabledChange?: (disabled: boolean) => void;
  onCornerRadiusChange?: (radius: CornerRadiusStep) => void;
  onFullWidthChange?: (fullWidth: boolean) => void;
}

const SIZE_OPTIONS: { value: SelectableInputSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

const CORNER_RADIUS_LABELS = ["None", "Extra Small", "Small", "Medium", "Large", "Extra Large"];

export function SelectableInputControls({
  label = "Option",
  size = "md",
  selected = false,
  disabled = false,
  cornerRadius = 2,
  fullWidth = false,
  onLabelChange,
  onSizeChange,
  onSelectedChange,
  onDisabledChange,
  onCornerRadiusChange,
  onFullWidthChange,
}: SelectableInputControlsProps) {
  return (
    <div className="ds-input-controls">
      <div className="ds-input-control-group ds-input-control-group--row">
        <div className="ds-input-control-field">
          <label htmlFor="selectable-input-size-select" className="ds-input-control-label">
            Size
          </label>
          <Select
            id="selectable-input-size-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={size}
            options={SIZE_OPTIONS as SelectOption[]}
            onSelect={(value) => onSizeChange?.(value as SelectableInputSize)}
          />
        </div>
      </div>

      <div className="ds-input-control-group">
        <label htmlFor="selectable-input-label-input" className="ds-input-control-label">
          Label
        </label>
        <Input
          id="selectable-input-label-input"
          size="md"
          showLabel={false}
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Enter label text"
        />
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Selected</span>
            <Switch
              id="selectable-input-selected"
              checked={selected}
              onChange={onSelectedChange}
              ariaLabel="Selected"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Disabled</span>
            <Switch
              id="selectable-input-disabled"
              checked={disabled}
              onChange={onDisabledChange}
              ariaLabel="Disabled"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Full Width</span>
            <Switch
              id="selectable-input-full-width"
              checked={fullWidth}
              onChange={onFullWidthChange}
              ariaLabel="Full Width"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <label id="selectable-input-radius-slider-label" className="ds-input-control-label">Corner Radius</label>
        <Slider
          id="selectable-input-radius-slider"
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
