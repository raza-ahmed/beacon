"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { type PatternType, PATTERN_CONFIGS } from "@/utils/patternPaths";
import { Switch } from "./Switch";
import type { CornerRadiusStep } from "beacon-ui";

// Filter out legacy patterns and default for the dropdown
const CSS_PATTERNS = Object.keys(PATTERN_CONFIGS).filter(
  (key) => key !== "default" && !["cubes", "mathematics", "dots", "diagonal", "smudge", "paper", "denim", "squares", "mosaic", "cotton"].includes(key)
) as PatternType[];

// Group patterns by category for better organization
const PATTERN_GROUPS = {
  Dot: CSS_PATTERNS.filter((p) => p.startsWith("dot-")),
  Line: CSS_PATTERNS.filter((p) => p.startsWith("line-")),
  Grid: CSS_PATTERNS.filter((p) => p.startsWith("grid-")),
  Ring: CSS_PATTERNS.filter((p) => p.startsWith("ring-")),
  Wave: CSS_PATTERNS.filter((p) => p.startsWith("wave-")),
  Texture: CSS_PATTERNS.filter((p) => p.startsWith("tex-")),
  Shape: CSS_PATTERNS.filter((p) => p.startsWith("shape-")),
};

function formatPatternName(pattern: string): string {
  return pattern
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type CardStatus = "default" | "highlighted" | "selected";
type CardShadow = "0" | "50" | "100" | "200" | "300" | "400" | "500";

const CORNER_RADIUS_LABELS = ["None", "100", "200", "300", "400", "Full"];

interface CardControlsProps {
  theme: Theme;
  hue: HueVariant;
  padding?: number;
  height?: string;
  status?: CardStatus;
  shadow?: CardShadow;
  cornerRadius?: CornerRadiusStep;
  showBgPattern?: boolean;
  patternType?: PatternType;
  showOverlay?: boolean;
  showBorder?: boolean;
  // Callbacks
  onThemeChange: (theme: Theme) => void;
  onHueChange: (hue: HueVariant) => void;
  onPaddingChange?: (padding: number) => void;
  onHeightChange?: (height: string | undefined) => void;
  onStatusChange?: (status: CardStatus) => void;
  onShadowChange?: (shadow: CardShadow | undefined) => void;
  onCornerRadiusChange?: (cornerRadius: CornerRadiusStep) => void;
  onShowBgPatternChange?: (show: boolean) => void;
  onPatternTypeChange?: (type: PatternType) => void;
  onShowOverlayChange?: (show: boolean) => void;
  onShowBorderChange?: (show: boolean) => void;
}

const STATUS_OPTIONS: { value: CardStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "highlighted", label: "Highlighted" },
  { value: "selected", label: "Selected" },
];

const SHADOW_OPTIONS: { value: CardShadow; label: string }[] = [
  { value: "0", label: "None (0)" },
  { value: "50", label: "Subtle (50)" },
  { value: "100", label: "Light (100)" },
  { value: "200", label: "Medium (200)" },
  { value: "300", label: "Strong (300)" },
  { value: "400", label: "Heavy (400)" },
  { value: "500", label: "Maximum (500)" },
];

const PADDING_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "None (0)" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
  { value: 300, label: "300" },
  { value: 400, label: "400" },
  { value: 450, label: "450" },
  { value: 500, label: "500" },
  { value: 600, label: "600" },
  { value: 700, label: "700" },
  { value: 800, label: "800" },
  { value: 900, label: "900" },
  { value: 1000, label: "1000" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function CardControls({
  theme,
  hue,
  padding = 400,
  height,
  status = "default",
  shadow,
  cornerRadius = 4,
  showBgPattern = false,
  patternType = "cubes",
  showOverlay = false,
  showBorder = true,
  onThemeChange,
  onHueChange,
  onPaddingChange,
  onHeightChange,
  onStatusChange,
  onShadowChange,
  onCornerRadiusChange,
  onShowBgPatternChange,
  onPatternTypeChange,
  onShowOverlayChange,
  onShowBorderChange,
}: CardControlsProps) {
  return (
    <div className="ds-card-controls">
      <div className="ds-card-control-group">
        <span className="ds-card-control-label">Color</span>
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
              id="card-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-card-control-group">
        <label htmlFor="card-status-select" className="ds-card-control-label">
                Status
              </label>
              <select
          id="card-status-select"
                className="ds-card-control-select"
                value={status}
          onChange={(e) => onStatusChange?.(e.target.value as CardStatus)}
              >
          {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
          </div>

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
            <label htmlFor="card-shadow-select" className="ds-card-control-label">
              Shadow
            </label>
            <select
              id="card-shadow-select"
              className="ds-card-control-select"
              value={shadow || ""}
              onChange={(e) => onShadowChange?.(e.target.value ? (e.target.value as CardShadow) : undefined)}
            >
              <option value="">None</option>
              {SHADOW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="ds-icon-fill-section">
            <label htmlFor="card-padding-select" className="ds-card-control-label">
              Padding
            </label>
            <select
              id="card-padding-select"
              className="ds-card-control-select"
              value={padding}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  onPaddingChange?.(value);
                }
              }}
            >
              {PADDING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="ds-card-control-group">
        <label htmlFor="card-radius-slider" className="ds-card-control-label">Corner Radius</label>
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
            id="card-radius-slider"
            type="range"
            min="0"
            max="5"
            value={cornerRadius}
            onChange={(e) => onCornerRadiusChange?.(Number.parseInt(e.target.value, 10) as CornerRadiusStep)}
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

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Background Pattern</span>
                <Switch
              id="card-bg-pattern"
                  checked={showBgPattern}
                  onChange={onShowBgPatternChange}
                  ariaLabel="Background Pattern"
                />
              </div>
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Overlay</span>
                <Switch
              id="card-overlay"
                  checked={showOverlay}
                  onChange={onShowOverlayChange}
                  ariaLabel="Overlay"
                />
              </div>
            </div>
          </div>

          {showBgPattern && (
            <div className="ds-card-control-group">
          <label htmlFor="card-pattern-type-select" className="ds-card-control-label">
                Pattern Type
              </label>
              <select
            id="card-pattern-type-select"
                className="ds-card-control-select"
                value={patternType}
                onChange={(e) => onPatternTypeChange?.(e.target.value as PatternType)}
              >
                {Object.entries(PATTERN_GROUPS).map(([category, patterns]) => (
                  <optgroup key={category} label={category}>
                    {patterns.map((pattern) => (
                      <option key={pattern} value={pattern}>
                        {formatPatternName(pattern)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Border</span>
                <Switch
              id="card-border"
                  checked={showBorder}
                  onChange={onShowBorderChange}
                  ariaLabel="Border"
                />
              </div>
            </div>
          </div>

      <div className="ds-card-control-group">
        <label htmlFor="card-height-input" className="ds-card-control-label">
          Height (optional)
        </label>
        <input
          id="card-height-input"
          type="text"
          className="ds-card-control-input"
          value={height || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              onHeightChange?.(undefined);
            } else {
              onHeightChange?.(value);
            }
          }}
          placeholder="200px, 100%, auto, etc."
        />
      </div>
    </div>
  );
}
