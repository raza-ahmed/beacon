"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { SearchIcon, ChevronDownIcon } from "beacon-icons";
import { Switch } from "./Switch";
import { Checkbox } from "./Checkbox";
import { Select } from "beacon-ui";
import type { SelectOption } from "beacon-ui";

type ButtonVariant = "filled" | "tonal" | "outline" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
type ButtonState = "default" | "hovered" | "focused" | "pressed" | "disabled" | "loading" | "success" | "critical" | "warning";
type JustifyContent = "center" | "space-between";

interface ButtonControlsProps {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fillContainer: boolean;
  justifyContent: JustifyContent;
  state: ButtonState;
  loading?: boolean;
  disabled?: boolean;
  theme: Theme;
  hue: HueVariant;
  onVariantChange: (variant: ButtonVariant) => void;
  onSizeChange: (size: ButtonSize) => void;
  onCornerRadiusChange: (radius: CornerRadiusStep) => void;
  onStartIconChange: (icon: React.ReactNode | null) => void;
  onEndIconChange: (icon: React.ReactNode | null) => void;
  onFillContainerChange: (fill: boolean) => void;
  onJustifyContentChange: (justify: JustifyContent) => void;
  onStateChange: (state: ButtonState) => void;
  onLoadingChange?: (loading: boolean) => void;
  onDisabledChange?: (disabled: boolean) => void;
  onThemeChange: (theme: Theme) => void;
  onHueChange: (hue: HueVariant) => void;
}

const VARIANT_OPTIONS: { value: ButtonVariant; label: string }[] = [
  { value: "filled", label: "Filled" },
  { value: "tonal", label: "Tonal" },
  { value: "outline", label: "Outline" },
  { value: "link", label: "Link" },
];

const SIZE_OPTIONS: { value: ButtonSize; label: string }[] = [
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

const CORNER_RADIUS_LABELS = ["None", "100", "200", "300", "400", "Full"];

const STATE_OPTIONS: { value: ButtonState; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "hovered", label: "Hovered" },
  { value: "focused", label: "Focused" },
  { value: "pressed", label: "Pressed" },
  { value: "disabled", label: "Disabled" },
  { value: "loading", label: "Loading" },
  { value: "success", label: "Success" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
];

const JUSTIFY_OPTIONS: { value: JustifyContent; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "space-between", label: "Space-between" },
];

export function ButtonControls({
  variant,
  size,
  cornerRadius,
  startIcon,
  endIcon,
  fillContainer,
  justifyContent,
  state,
  loading,
  disabled,
  theme,
  hue,
  onVariantChange,
  onSizeChange,
  onCornerRadiusChange,
  onStartIconChange,
  onEndIconChange,
  onFillContainerChange,
  onJustifyContentChange,
  onStateChange,
  onLoadingChange,
  onDisabledChange,
  onThemeChange,
  onHueChange,
}: ButtonControlsProps) {
  const sizeIndex = SIZE_OPTIONS.findIndex((opt) => opt.value === size);

  return (
    <div className="ds-button-controls">
      <div className="ds-button-control-group ds-button-control-group--row">
        <div className="ds-button-control-field">
          <label htmlFor="button-variant-select" className="ds-button-control-label">Variant</label>
          <Select
            id="button-variant-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={variant}
            options={VARIANT_OPTIONS as SelectOption[]}
            onSelect={(value) => onVariantChange(value as ButtonVariant)}
          />
        </div>
        <div className="ds-button-control-field">
          <label htmlFor="button-state-select" className="ds-button-control-label">State</label>
          <Select
            id="button-state-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={state}
            options={STATE_OPTIONS as SelectOption[]}
            onSelect={(value) => onStateChange(value as ButtonState)}
          />
        </div>
      </div>

      <div className="ds-button-control-group">
        <span className="ds-button-control-label">Color</span>
        <div className="ds-color-control-row" role="group" aria-label="Color selection">
          <div className="ds-hue-swatch-grid">
            {HUE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ds-hue-swatch ds-hue-swatch--small ${hue === opt.value ? "ds-hue-swatch--active" : ""}`}
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
              id="button-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-button-control-group">
        <label htmlFor="button-size-slider" className="ds-button-control-label">Size</label>
        <div className="ds-step-slider">
          <div
            className="ds-step-slider__track"
            style={{
              ["--active-width" as string]: `${((sizeIndex + 0.5) / SIZE_OPTIONS.length) * 100}%`,
            }}
          >
            {SIZE_OPTIONS.map((opt, index) => (
              <div
                key={opt.value}
                className={`ds-step-slider__step ${index === sizeIndex ? "ds-step-slider__step--active" : ""}`}
              />
            ))}
          </div>
          <input
            id="button-size-slider"
            type="range"
            min="0"
            max={SIZE_OPTIONS.length - 1}
            value={sizeIndex}
            onChange={(e) => {
              const newIndex = Number.parseInt(e.target.value, 10);
              onSizeChange(SIZE_OPTIONS[newIndex].value);
            }}
            className="ds-step-slider__input"
            aria-label="Button size"
          />
          <div className="ds-step-slider__labels">
            {SIZE_OPTIONS.map((opt) => (
              <span key={opt.value} className="ds-step-slider__label">
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-button-control-group">
        <label htmlFor="button-radius-slider" className="ds-button-control-label">Radius</label>
        <div className="ds-step-slider">
          <div
            className="ds-step-slider__track"
            style={{
              ["--active-width" as string]: `${((cornerRadius + 0.5) / 6) * 100}%`,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`ds-step-slider__step ${step === cornerRadius ? "ds-step-slider__step--active" : ""}`}
              />
            ))}
          </div>
          <input
            id="button-radius-slider"
            type="range"
            min="0"
            max="5"
            value={cornerRadius}
            onChange={(e) => onCornerRadiusChange(Number.parseInt(e.target.value, 10) as CornerRadiusStep)}
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

      <div className="ds-button-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-button-control-label">Icon</span>
            <div style={{ display: "flex", flexDirection: "row", gap: "var(--spacing-200)" }} role="group" aria-label="Icon position">
              <Checkbox
                id="button-start-icon"
                checked={!!startIcon}
                onChange={(checked) => onStartIconChange(checked ? <SearchIcon size="xs" /> : null)}
                ariaLabel="Start icon"
                label="Start"
                showLabel={true}
              />
              <Checkbox
                id="button-end-icon"
                checked={!!endIcon}
                onChange={(checked) => onEndIconChange(checked ? <ChevronDownIcon size="xs" /> : null)}
                ariaLabel="End icon"
                label="End"
                showLabel={true}
              />
            </div>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-button-control-label">Fill Container</span>
            <Switch
              id="button-fill-container"
              checked={fillContainer}
              onChange={onFillContainerChange}
              ariaLabel="Fill Container"
            />
          </div>
        </div>
      </div>

      {fillContainer && (startIcon || endIcon) && (
        <div className="ds-button-control-group">
          <span className="ds-button-control-label">Justify</span>
          <div className="ds-segmented-control" role="group" aria-label="Justify content">
            {JUSTIFY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ds-segmented-control__button ${justifyContent === opt.value ? "ds-segmented-control__button--active" : ""}`}
                onClick={() => onJustifyContentChange(opt.value)}
                aria-label={opt.label}
                aria-pressed={justifyContent === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

