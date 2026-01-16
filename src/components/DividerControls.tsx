"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch, Input } from "beacon-ui";
import { Select } from "beacon-ui";
import type { SelectOption } from "beacon-ui";

type DividerOrientation = "horizontal" | "vertical";
type DividerSlotPosition = "default" | "center" | "left" | "right" | "top" | "bottom";

interface DividerControlsProps {
  orientation: DividerOrientation;
  slotPosition: DividerSlotPosition;
  color: string;
  width: string;
  theme: Theme;
  hue: HueVariant;
  onOrientationChange: (orientation: DividerOrientation) => void;
  onSlotPositionChange: (slotPosition: DividerSlotPosition) => void;
  onColorChange: (color: string) => void;
  onWidthChange: (width: string) => void;
  onThemeChange: (theme: Theme) => void;
  onHueChange: (hue: HueVariant) => void;
}

const ORIENTATION_OPTIONS: { value: DividerOrientation; label: string }[] = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
];

const SLOT_POSITION_OPTIONS: { value: DividerSlotPosition; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "center", label: "Center" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

const getSlotPositionOptions = (orientation: DividerOrientation): { value: DividerSlotPosition; label: string }[] => {
  if (orientation === "horizontal") {
    return SLOT_POSITION_OPTIONS.filter(
      (opt) => opt.value === "default" || opt.value === "center" || opt.value === "left" || opt.value === "right"
    );
  } else {
    return SLOT_POSITION_OPTIONS.filter(
      (opt) => opt.value === "default" || opt.value === "center" || opt.value === "top" || opt.value === "bottom"
    );
  }
};

export function DividerControls({
  orientation,
  slotPosition,
  color,
  width,
  theme,
  hue,
  onOrientationChange,
  onSlotPositionChange,
  onColorChange,
  onWidthChange,
  onThemeChange,
  onHueChange,
}: DividerControlsProps) {
  const slotPositionOptions = getSlotPositionOptions(orientation);

  return (
    <div className="ds-divider-controls">
      <div className="ds-divider-control-group ds-divider-control-group--row">
        <div className="ds-divider-control-field">
          <label htmlFor="divider-orientation-select" className="ds-divider-control-label">
            Orientation
          </label>
          <Select
            id="divider-orientation-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={orientation}
            options={ORIENTATION_OPTIONS as SelectOption[]}
            onSelect={(value) => {
              const newOrientation = value as DividerOrientation;
              onOrientationChange(newOrientation);
              // Reset slot position to default when orientation changes
              if (newOrientation === "horizontal" && (slotPosition === "top" || slotPosition === "bottom")) {
                onSlotPositionChange("default");
              } else if (newOrientation === "vertical" && (slotPosition === "left" || slotPosition === "right")) {
                onSlotPositionChange("default");
              }
            }}
          />
        </div>
        <div className="ds-divider-control-field">
          <label htmlFor="divider-slot-position-select" className="ds-divider-control-label">
            Slot Position
          </label>
          <Select
            id="divider-slot-position-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={slotPosition}
            options={slotPositionOptions as SelectOption[]}
            onSelect={(value) => onSlotPositionChange(value as DividerSlotPosition)}
          />
        </div>
      </div>

      <div className="ds-divider-control-group">
        <div className="ds-divider-control-field">
          <label htmlFor="divider-color-input" className="ds-divider-control-label">
            Color
          </label>
          <Input
            id="divider-color-input"
            size="md"
            placeholder="var(--border-neutral-secondary)"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-divider-control-group">
        <div className="ds-divider-control-field">
          <label htmlFor="divider-width-input" className="ds-divider-control-label">
            Width
          </label>
          <Input
            id="divider-width-input"
            size="md"
            placeholder="100%"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-divider-control-group">
        <span className="ds-divider-control-label">Theme</span>
        <div className="ds-color-control-row" role="group" aria-label="Color selection">
          <div className="ds-hue-swatch-grid">
            {HUE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ds-hue-swatch ds-hue-swatch--small ${
                  hue === opt.value ? "ds-hue-swatch--active" : ""
                }`}
                onClick={() => onHueChange(opt.value)}
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
              id="divider-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange(checked ? "dark" : "light")}
              showIcons={true}
              aria-label="Theme toggle"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
