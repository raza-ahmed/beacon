"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch } from "./Switch";
import { Input, Select, Slider } from "beacon-ui";
import type { SelectOption } from "beacon-ui";

type TabItemState = "Default" | "Active" | "Hover" | "Disabled";
type TabItemSize = "Small" | "Medium";
type TabItemStyle = "Default" | "Pill";
type TabItemPlacement = "Horizontal" | "Vertical";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;

interface TabItemControlsProps {
  tabName?: string;
  state?: TabItemState;
  size?: TabItemSize;
  style?: TabItemStyle;
  placement?: TabItemPlacement;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showTabLabel?: boolean;
  cornerRadius?: CornerRadiusStep;
  theme?: Theme;
  hue?: HueVariant;
  onTabNameChange?: (name: string) => void;
  onStateChange?: (state: TabItemState) => void;
  onSizeChange?: (size: TabItemSize) => void;
  onStyleChange?: (style: TabItemStyle) => void;
  onPlacementChange?: (placement: TabItemPlacement) => void;
  onShowStartIconChange?: (show: boolean) => void;
  onShowEndIconChange?: (show: boolean) => void;
  onShowTabLabelChange?: (show: boolean) => void;
  onCornerRadiusChange?: (radius: CornerRadiusStep) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const STATE_OPTIONS: { value: TabItemState; label: string }[] = [
  { value: "Default", label: "Default" },
  { value: "Active", label: "Active" },
  { value: "Hover", label: "Hover" },
  { value: "Disabled", label: "Disabled" },
];

const SIZE_OPTIONS: { value: TabItemSize; label: string }[] = [
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
];

const STYLE_OPTIONS: { value: TabItemStyle; label: string }[] = [
  { value: "Default", label: "Default" },
  { value: "Pill", label: "Pill" },
];

const PLACEMENT_OPTIONS: { value: TabItemPlacement; label: string }[] = [
  { value: "Horizontal", label: "Horizontal" },
  { value: "Vertical", label: "Vertical" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

const CORNER_RADIUS_LABELS = ["None", "100", "200", "300", "400", "Full"];

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

export function TabItemControls({
  tabName = "Tab Item",
  state = "Default",
  size = "Small",
  style = "Default",
  placement = "Horizontal",
  showStartIcon = true,
  showEndIcon = true,
  showTabLabel = true,
  cornerRadius = 5,
  theme,
  hue,
  onTabNameChange,
  onStateChange,
  onSizeChange,
  onStyleChange,
  onPlacementChange,
  onShowStartIconChange,
  onShowEndIconChange,
  onShowTabLabelChange,
  onCornerRadiusChange,
  onThemeChange,
  onHueChange,
}: TabItemControlsProps) {
  return (
    <div className="ds-chip-controls">
      <div className="ds-chip-control-group">
        <span className="ds-chip-control-label">Color</span>
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
              id="tabitem-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange?.(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-chip-control-group ds-chip-control-group--row">
        <div className="ds-chip-control-field">
          <label htmlFor="tabitem-state-select" className="ds-chip-control-label">
            State
          </label>
          <Select
            id="tabitem-state-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={state}
            options={STATE_OPTIONS as SelectOption[]}
            onSelect={(value) => onStateChange?.(value as TabItemState)}
          />
        </div>
        <div className="ds-chip-control-field">
          <label htmlFor="tabitem-size-select" className="ds-chip-control-label">
            Size
          </label>
          <Select
            id="tabitem-size-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={size}
            options={SIZE_OPTIONS as SelectOption[]}
            onSelect={(value) => onSizeChange?.(value as TabItemSize)}
          />
        </div>
      </div>

      <div className="ds-chip-control-group ds-chip-control-group--row">
        <div className="ds-chip-control-field">
          <label htmlFor="tabitem-style-select" className="ds-chip-control-label">
            Style
          </label>
          <Select
            id="tabitem-style-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={style}
            options={STYLE_OPTIONS as SelectOption[]}
            onSelect={(value) => onStyleChange?.(value as TabItemStyle)}
          />
        </div>
        <div className="ds-chip-control-field">
          <label htmlFor="tabitem-placement-select" className="ds-chip-control-label">
            Placement
          </label>
          <Select
            id="tabitem-placement-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={placement}
            options={PLACEMENT_OPTIONS as SelectOption[]}
            onSelect={(value) => onPlacementChange?.(value as TabItemPlacement)}
          />
        </div>
      </div>

      <div className="ds-chip-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-chip-control-label">Show Start Icon</span>
            <Switch
              id="tabitem-show-start-icon"
              checked={showStartIcon}
              onChange={onShowStartIconChange}
              ariaLabel="Show Start Icon"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-chip-control-label">Show End Icon</span>
            <Switch
              id="tabitem-show-end-icon"
              checked={showEndIcon}
              onChange={onShowEndIconChange}
              ariaLabel="Show End Icon"
            />
          </div>
        </div>
      </div>

      <div className="ds-chip-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-chip-control-label">Show Tab Label</span>
            <Switch
              id="tabitem-show-tab-label"
              checked={showTabLabel}
              onChange={onShowTabLabelChange}
              ariaLabel="Show Tab Label"
            />
          </div>
        </div>
      </div>

      {showTabLabel && (
        <div className="ds-chip-control-group">
          <label htmlFor="tabitem-name-input" className="ds-chip-control-label">
            Tab Name
          </label>
          <Input
            id="tabitem-name-input"
            size="md"
            showLabel={false}
            value={tabName}
            onChange={(e) => onTabNameChange?.(e.target.value)}
            placeholder="Enter tab name"
          />
        </div>
      )}

      {style === "Pill" && (
        <div className="ds-chip-control-group">
          <label id="tabitem-radius-slider-label" className="ds-chip-control-label">Corner Radius</label>
          <Slider
            id="tabitem-radius-slider"
            min={0}
            max={5}
            step={1}
            value={cornerRadius}
            stepCount={6}
            showSteps={true}
            showTooltip={true}
            showLabel={false}
            stepLabels={CORNER_RADIUS_LABELS}
            onChange={(value) => onCornerRadiusChange?.(value as CornerRadiusStep)}
          />
        </div>
      )}
    </div>
  );
}

