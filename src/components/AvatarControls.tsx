"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon, SunIcon, MoonIcon } from "./icons";

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

// Size options vary by type
const getSizeOptions = (type: AvatarType): { value: AvatarSize; label: string }[] => {
  const baseSizes = [
    { value: "sm" as AvatarSize, label: "Small" },
    { value: "md" as AvatarSize, label: "Medium" },
    { value: "lg" as AvatarSize, label: "Large" },
  ];
  
  // Only image type has extra large option
  if (type === "image") {
    return [...baseSizes, { value: "xl" as AvatarSize, label: "Extra Large" }];
  }
  
  return baseSizes;
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

  // If current size is xl but type doesn't support it, reset to lg
  const effectiveSize = sizeOptions.find((opt) => opt.value === size)?.value || sizeOptions[0].value;

  return (
    <div className="ds-avatar-controls">
      <div className="ds-avatar-control-group ds-avatar-control-group--row">
        <div className="ds-avatar-control-field">
          <label htmlFor="avatar-type-select" className="ds-avatar-control-label">
            Type
          </label>
          <select
            id="avatar-type-select"
            className="ds-avatar-control-select"
            value={type}
            onChange={(e) => {
              const newType = e.target.value as AvatarType;
              onTypeChange(newType);
              // If switching from image to non-image and size is xl, reset to lg
              if (newType !== "image" && size === "xl") {
                onSizeChange("lg");
              }
            }}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ds-avatar-control-field">
          <label htmlFor="avatar-color-select" className="ds-avatar-control-label">
            Color
          </label>
          <select
            id="avatar-color-select"
            className="ds-avatar-control-select"
            value={color}
            onChange={(e) => onColorChange(e.target.value as AvatarColor)}
          >
            {COLOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-avatar-control-group ds-avatar-control-group--row">
        <div className="ds-avatar-control-field">
          <label htmlFor="avatar-variant-select" className="ds-avatar-control-label">
            Variant
          </label>
          <select
            id="avatar-variant-select"
            className="ds-avatar-control-select"
            value={variant}
            onChange={(e) => onVariantChange(e.target.value as AvatarVariant)}
          >
            {VARIANT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
            <button
              type="button"
              className={`ds-theme-toggle-button ${
                theme === "light" ? "ds-theme-toggle-button--active" : ""
              }`}
              onClick={() => onThemeChange("light")}
              aria-label="Light theme"
            >
              <SunIcon size="sm" />
            </button>
            <button
              type="button"
              className={`ds-theme-toggle-button ${
                theme === "dark" ? "ds-theme-toggle-button--active" : ""
              }`}
              onClick={() => onThemeChange("dark")}
              aria-label="Dark theme"
            >
              <MoonIcon size="sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="ds-avatar-control-group">
        <label htmlFor="avatar-size-slider" className="ds-avatar-control-label">
          Size
        </label>
        <div className="ds-step-slider">
          <div
            className="ds-step-slider__track"
            style={{
              ["--active-width" as string]: `${((currentSizeIndex + 0.5) / sizeOptions.length) * 100}%`,
            }}
          >
            {sizeOptions.map((opt, index) => (
              <div
                key={opt.value}
                className={`ds-step-slider__step ${
                  index === currentSizeIndex ? "ds-step-slider__step--active" : ""
                }`}
              />
            ))}
          </div>
          <input
            id="avatar-size-slider"
            type="range"
            min="0"
            max={sizeOptions.length - 1}
            value={currentSizeIndex}
            onChange={(e) => {
              const newIndex = Number.parseInt(e.target.value, 10);
              onSizeChange(sizeOptions[newIndex].value);
            }}
            className="ds-step-slider__input"
            aria-label="Avatar size"
          />
          <div className="ds-step-slider__labels">
            {sizeOptions.map((opt) => (
              <span key={opt.value} className="ds-step-slider__label">
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-avatar-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-avatar-control-label">Round</span>
            <label htmlFor="avatar-round" className="ds-switch">
              <input
                id="avatar-round"
                type="checkbox"
                checked={isRound}
                onChange={(e) => onIsRoundChange(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-avatar-control-label">Stroke</span>
            <label htmlFor="avatar-stroke" className="ds-switch">
              <input
                id="avatar-stroke"
                type="checkbox"
                checked={hasStroke}
                onChange={(e) => onHasStrokeChange(e.target.checked)}
              />
              <span className="ds-switch__slider" />
            </label>
          </div>
        </div>
      </div>

      {type === "text" && (
        <div className="ds-avatar-control-group">
          <label htmlFor="avatar-initials-input" className="ds-avatar-control-label">
            Initials
          </label>
          <input
            id="avatar-initials-input"
            type="text"
            className="ds-avatar-control-input"
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
