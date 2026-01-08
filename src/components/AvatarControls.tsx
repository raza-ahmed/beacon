"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch } from "./Switch";
import { Input, Select, Slider } from "beacon-ui";
import type { SelectOption } from "beacon-ui";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarType = "icon" | "text" | "image";
type AvatarColor = "primary" | "neutral" | "success" | "critical" | "warning";
type AvatarVariant = "solid" | "faded";

interface AvatarControlsProps {
  size: AvatarSize;
  type: AvatarType;
  color: AvatarColor;
  variant: AvatarVariant;
  isRound: boolean;
  hasStroke: boolean;
  theme: Theme;
  hue: HueVariant;
  initials: string;
  onSizeChange: (size: AvatarSize) => void;
  onTypeChange: (type: AvatarType) => void;
  onColorChange: (color: AvatarColor) => void;
  onVariantChange: (variant: AvatarVariant) => void;
  onIsRoundChange: (isRound: boolean) => void;
  onHasStrokeChange: (hasStroke: boolean) => void;
  onThemeChange: (theme: Theme) => void;
  onHueChange: (hue: HueVariant) => void;
  onInitialsChange: (initials: string) => void;
}

// Size options - all types support all 4 sizes
const getSizeOptions = (type: AvatarType): { value: AvatarSize; label: string }[] => {
  return [
    { value: "sm" as AvatarSize, label: "Small" },
    { value: "md" as AvatarSize, label: "Medium" },
    { value: "lg" as AvatarSize, label: "Large" },
    { value: "xl" as AvatarSize, label: "Extra Large" },
  ];
};

const TYPE_OPTIONS: { value: AvatarType; label: string }[] = [
  { value: "icon", label: "Icon" },
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
];

const COLOR_OPTIONS: { value: AvatarColor; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "neutral", label: "Neutral" },
  { value: "success", label: "Success" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
];

const VARIANT_OPTIONS: { value: AvatarVariant; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "faded", label: "Faded" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function AvatarControls({
  size,
  type,
  color,
  variant,
  isRound,
  hasStroke,
  theme,
  hue,
  initials,
  onSizeChange,
  onTypeChange,
  onColorChange,
  onVariantChange,
  onIsRoundChange,
  onHasStrokeChange,
  onThemeChange,
  onHueChange,
  onInitialsChange,
}: AvatarControlsProps) {
  const sizeOptions = getSizeOptions(type);
  const sizeIndex = sizeOptions.findIndex((opt) => opt.value === size);
  const currentSizeIndex = sizeIndex >= 0 ? sizeIndex : 0;

  return (
    <div className="ds-avatar-controls">
      <div className="ds-avatar-control-group ds-avatar-control-group--row">
        <div className="ds-avatar-control-field">
          <label htmlFor="avatar-type-select" className="ds-avatar-control-label">
            Type
          </label>
          <Select
            id="avatar-type-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={type}
            options={TYPE_OPTIONS as SelectOption[]}
            onSelect={(value) => {
              const newType = value as AvatarType;
              onTypeChange(newType);
            }}
          />
        </div>
        <div className="ds-avatar-control-field">
          <label htmlFor="avatar-color-select" className="ds-avatar-control-label">
            Color
          </label>
          <Select
            id="avatar-color-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={color}
            options={COLOR_OPTIONS as SelectOption[]}
            onSelect={(value) => onColorChange(value as AvatarColor)}
          />
        </div>
      </div>

      <div className="ds-avatar-control-group ds-avatar-control-group--row">
        <div className="ds-avatar-control-field">
          <label htmlFor="avatar-variant-select" className="ds-avatar-control-label">
            Variant
          </label>
          <Select
            id="avatar-variant-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={variant}
            options={VARIANT_OPTIONS as SelectOption[]}
            onSelect={(value) => onVariantChange(value as AvatarVariant)}
          />
        </div>
      </div>

      <div className="ds-avatar-control-group">
        <span className="ds-avatar-control-label">Color</span>
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
              id="avatar-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-avatar-control-group">
        <label id="avatar-size-slider-label" className="ds-avatar-control-label">
          Size
        </label>
        <Slider
          id="avatar-size-slider"
          min={0}
          max={sizeOptions.length - 1}
          step={1}
          value={currentSizeIndex}
          stepCount={sizeOptions.length - 1}
          showSteps={true}
          showTooltip={true}
          showLabel={false}
          stepLabels={sizeOptions.map((opt) => opt.label)}
          onChange={(value) => {
            const newIndex = value as number;
            onSizeChange(sizeOptions[newIndex].value);
          }}
        />
      </div>

      <div className="ds-avatar-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-avatar-control-label">Round</span>
            <Switch
              id="avatar-round"
              checked={isRound}
              onChange={onIsRoundChange}
              ariaLabel="Round"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-avatar-control-label">Stroke</span>
            <Switch
              id="avatar-stroke"
              checked={hasStroke}
              onChange={onHasStrokeChange}
              ariaLabel="Stroke"
            />
          </div>
        </div>
      </div>

      {type === "text" && (
        <div className="ds-avatar-control-group">
          <label htmlFor="avatar-initials-input" className="ds-avatar-control-label">
            Initials
          </label>
          <Input
            id="avatar-initials-input"
            size="md"
            showLabel={false}
            value={initials}
            onChange={(e) => onInitialsChange(e.target.value.slice(0, 2).toUpperCase())}
            placeholder="JD"
            maxLength={2}
          />
        </div>
      )}
    </div>
  );
}
