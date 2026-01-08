"use client";

import { Switch } from "./Switch";
import { Input, Select } from "beacon-ui";
import type { SliderStatus, SelectOption } from "beacon-ui";

interface SliderControlsProps {
  value?: number;
  rangeValue?: [number, number];
  range?: boolean;
  status?: SliderStatus;
  showLabel?: boolean;
  showTooltip?: boolean;
  showSteps?: boolean;
  onValueChange?: (value: number) => void;
  onRangeValueChange?: (value: [number, number]) => void;
  onRangeChange?: (range: boolean) => void;
  onStatusChange?: (status: SliderStatus) => void;
  onShowLabelChange?: (show: boolean) => void;
  onShowTooltipChange?: (show: boolean) => void;
  onShowStepsChange?: (show: boolean) => void;
}

const STATUS_OPTIONS: { value: SliderStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "hover", label: "Hover" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

export function SliderControls({
  value = 60,
  rangeValue = [20, 80],
  range = false,
  status = "default",
  showLabel = true,
  showTooltip = false,
  showSteps = true,
  onValueChange,
  onRangeValueChange,
  onRangeChange,
  onStatusChange,
  onShowLabelChange,
  onShowTooltipChange,
  onShowStepsChange,
}: SliderControlsProps) {
  return (
    <div className="ds-input-controls">
      <div className="ds-input-control-group">
        <label htmlFor="slider-status-select" className="ds-input-control-label">
          Status
        </label>
        <Select
          id="slider-status-select"
          size="md"
          showLabel={false}
          showStartIcon={false}
          showEndIcon={true}
          selectedValue={status}
          options={STATUS_OPTIONS as SelectOption[]}
          onSelect={(value) => onStatusChange?.(value as SliderStatus)}
        />
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Show Label</span>
            <Switch
              id="slider-show-label"
              checked={showLabel}
              onChange={onShowLabelChange}
              ariaLabel="Show Label"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Show Tooltip</span>
            <Switch
              id="slider-show-tooltip"
              checked={showTooltip}
              onChange={onShowTooltipChange}
              ariaLabel="Show Tooltip"
            />
          </div>
        </div>
      </div>

      <div className="ds-input-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Show Steps</span>
            <Switch
              id="slider-show-steps"
              checked={showSteps}
              onChange={onShowStepsChange}
              ariaLabel="Show Steps"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-input-control-label">Range Slider</span>
            <Switch
              id="slider-range"
              checked={range}
              onChange={onRangeChange}
              ariaLabel="Range Slider"
            />
          </div>
        </div>
      </div>

      {range ? (
        <div className="ds-input-control-group" style={{ display: "flex", flexDirection: "row", gap: "var(--spacing-400)" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-200)"  }}>
            <label htmlFor="slider-range-start-input" className="ds-input-control-label">
              Start Value
            </label>
            <Input
              id="slider-range-start-input"
              size="md"
              showLabel={false}
              type="number"
              value={String(rangeValue[0])}
              onChange={(e) => {
                const numValue = Number.parseInt(e.target.value, 10);
                if (!isNaN(numValue)) {
                  onRangeValueChange?.([numValue, rangeValue[1]]);
                }
              }}
              placeholder="0"
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column",  gap: "var(--spacing-200)"  }}>
            <label htmlFor="slider-range-end-input" className="ds-input-control-label">
              End Value
            </label>
            <Input
              id="slider-range-end-input"
              size="md"
              showLabel={false}
              type="number"
              value={String(rangeValue[1])}
              onChange={(e) => {
                const numValue = Number.parseInt(e.target.value, 10);
                if (!isNaN(numValue)) {
                  onRangeValueChange?.([rangeValue[0], numValue]);
                }
              }}
              placeholder="100"
            />
          </div>
        </div>
      ) : (
        <div className="ds-input-control-group">
          <label htmlFor="slider-value-input" className="ds-input-control-label">
            Value
          </label>
          <Input
            id="slider-value-input"
            size="md"
            showLabel={false}
            type="number"
            value={String(value)}
            onChange={(e) => {
              const numValue = Number.parseInt(e.target.value, 10);
              if (!isNaN(numValue)) {
                onValueChange?.(numValue);
              }
            }}
            placeholder="60"
          />
        </div>
      )}
    </div>
  );
}
