"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch } from "./Switch";
import { Select, Input, type TooltipPosition, type TooltipTrigger } from "beacon-ui";
import type { SelectOption } from "beacon-ui";

interface TooltipControlsProps {
  content?: string;
  position?: TooltipPosition;
  trigger?: TooltipTrigger;
  showArrow?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  onContentChange?: (content: string) => void;
  onPositionChange?: (position: TooltipPosition) => void;
  onTriggerChange?: (trigger: TooltipTrigger) => void;
  onShowArrowChange?: (show: boolean) => void;
  onShowBorderChange?: (show: boolean) => void;
  onShowShadowChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const POSITION_OPTIONS: { value: TooltipPosition; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const TRIGGER_OPTIONS: { value: TooltipTrigger; label: string }[] = [
  { value: "hover", label: "Hover" },
  { value: "click", label: "Click" },
  { value: "focus", label: "Focus" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function TooltipControls({
  content = "Tooltip",
  position = "top",
  trigger = "hover",
  showArrow = true,
  showBorder = true,
  showShadow = true,
  theme,
  hue,
  onContentChange,
  onPositionChange,
  onTriggerChange,
  onShowArrowChange,
  onShowBorderChange,
  onShowShadowChange,
  onThemeChange,
  onHueChange,
}: TooltipControlsProps) {
  return (
    <div className="ds-tooltip-controls">
      <div className="ds-tooltip-control-group ds-tooltip-control-group--row">
        <div className="ds-tooltip-control-field">
          <label htmlFor="tooltip-position-select" className="ds-tooltip-control-label">
            Position
          </label>
          <Select
            id="tooltip-position-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={position}
            options={POSITION_OPTIONS as SelectOption[]}
            onSelect={(value) => onPositionChange?.(value as TooltipPosition)}
          />
        </div>
        <div className="ds-tooltip-control-field">
          <label htmlFor="tooltip-trigger-select" className="ds-tooltip-control-label">
            Trigger
          </label>
          <Select
            id="tooltip-trigger-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={trigger}
            options={TRIGGER_OPTIONS as SelectOption[]}
            onSelect={(value) => onTriggerChange?.(value as TooltipTrigger)}
          />
        </div>
      </div>

      <div className="ds-tooltip-control-group">
        <span className="ds-tooltip-control-label">Color</span>
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
              id="tooltip-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange?.(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-tooltip-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-tooltip-control-label">Show Arrow</span>
            <Switch
              id="tooltip-show-arrow"
              checked={showArrow}
              onChange={onShowArrowChange}
              ariaLabel="Show Arrow"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-tooltip-control-label">Show Border</span>
            <Switch
              id="tooltip-show-border"
              checked={showBorder}
              onChange={onShowBorderChange}
              ariaLabel="Show Border"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-tooltip-control-label">Show Shadow</span>
            <Switch
              id="tooltip-show-shadow"
              checked={showShadow}
              onChange={onShowShadowChange}
              ariaLabel="Show Shadow"
            />
          </div>
        </div>
      </div>

      <div className="ds-tooltip-control-group">
        <label htmlFor="tooltip-content-input" className="ds-tooltip-control-label">
          Content
        </label>
        <Input
          id="tooltip-content-input"
          size="md"
          showLabel={false}
          value={content}
          onChange={(e) => onContentChange?.(e.target.value)}
          placeholder="Enter tooltip text"
        />
      </div>
    </div>
  );
}
