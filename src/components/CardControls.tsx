"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { type PatternType, PATTERN_CONFIGS } from "@/utils/patternPaths";
import { Switch } from "./Switch";

type CardType = "product" | "experience" | "info" | "generic";
type ProductCardSize = "full" | "half";
type ProductCardStatus = "default" | "highlighted";
type ExperienceCardType = "default" | "skills" | "contacts";
type GenericCardStatus = "default" | "highlighted" | "selected";

interface CardControlsProps {
  cardType: CardType;
  theme: Theme;
  hue: HueVariant;
  // ProductCard
  size?: ProductCardSize;
  status?: ProductCardStatus;
  hasImage?: boolean;
  imageAspectRatio?: "16x9" | "4x3";
  hasIdentifiers?: boolean;
  hasButton?: boolean;
  title?: string;
  description?: string;
  // ExperienceCard
  experienceType?: ExperienceCardType;
  positionName?: string;
  companyName?: string;
  year?: string;
  experienceDescription?: string;
  label?: string;
  details?: string;
  // InfoCard
  cardName?: string;
  cardDescription?: string;
  hasIcon?: boolean;
  // Generic Card
  genericStatus?: GenericCardStatus;
  showBgPattern?: boolean;
  patternType?: PatternType;
  showOverlay?: boolean;
  showShadow?: boolean;
  showBorder?: boolean;
  // Callbacks
  onCardTypeChange: (type: CardType) => void;
  onThemeChange: (theme: Theme) => void;
  onHueChange: (hue: HueVariant) => void;
  // ProductCard callbacks
  onSizeChange?: (size: ProductCardSize) => void;
  onStatusChange?: (status: ProductCardStatus) => void;
  onHasImageChange?: (has: boolean) => void;
  onImageAspectRatioChange?: (ratio: "16x9" | "4x3") => void;
  onHasIdentifiersChange?: (has: boolean) => void;
  onHasButtonChange?: (has: boolean) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  // ExperienceCard callbacks
  onExperienceTypeChange?: (type: ExperienceCardType) => void;
  onPositionNameChange?: (name: string) => void;
  onCompanyNameChange?: (name: string) => void;
  onYearChange?: (year: string) => void;
  onExperienceDescriptionChange?: (desc: string) => void;
  onLabelChange?: (label: string) => void;
  onDetailsChange?: (details: string) => void;
  // InfoCard callbacks
  onCardNameChange?: (name: string) => void;
  onCardDescriptionChange?: (desc: string) => void;
  onHasIconChange?: (has: boolean) => void;
  // Generic Card callbacks
  onGenericStatusChange?: (status: GenericCardStatus) => void;
  onShowBgPatternChange?: (show: boolean) => void;
  onPatternTypeChange?: (type: PatternType) => void;
  onShowOverlayChange?: (show: boolean) => void;
  onShowShadowChange?: (show: boolean) => void;
  onShowBorderChange?: (show: boolean) => void;
}

const CARD_TYPE_OPTIONS: { value: CardType; label: string }[] = [
  { value: "experience", label: "Experience Card" },
  { value: "info", label: "Info Card" },
  { value: "generic", label: "Generic Card" },
];

const PRODUCT_SIZE_OPTIONS: { value: ProductCardSize; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "half", label: "Half" },
];

const PRODUCT_STATUS_OPTIONS: { value: ProductCardStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "highlighted", label: "Highlighted" },
];

const EXPERIENCE_TYPE_OPTIONS: { value: ExperienceCardType; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "skills", label: "Skills" },
  { value: "contacts", label: "Contacts" },
];

const GENERIC_STATUS_OPTIONS: { value: GenericCardStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "highlighted", label: "Highlighted" },
  { value: "selected", label: "Selected" },
];

const IMAGE_ASPECT_RATIO_OPTIONS: { value: "16x9" | "4x3"; label: string }[] = [
  { value: "16x9", label: "16:9" },
  { value: "4x3", label: "4:3" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function CardControls({
  cardType,
  theme,
  hue,
  // ProductCard
  size = "full",
  status = "default",
  hasImage = true,
  imageAspectRatio = "16x9",
  hasIdentifiers = true,
  hasButton = true,
  title = "Product Title",
  description = "Add your products Details that description here.",
  // ExperienceCard
  experienceType = "default",
  positionName = "Position Name",
  companyName = "Company Name",
  year = "2025-26",
  experienceDescription = "Long Description",
  label = "Label",
  details = "Details",
  // InfoCard
  cardName = "Card Name",
  cardDescription = "Card Description",
  hasIcon = true,
  // Generic Card
  genericStatus = "default",
  showBgPattern = true,
  patternType = "cubes",
  showOverlay = true,
  showShadow = true,
  showBorder = true,
  // Callbacks
  onCardTypeChange,
  onThemeChange,
  onHueChange,
  onSizeChange,
  onStatusChange,
  onHasImageChange,
  onImageAspectRatioChange,
  onHasIdentifiersChange,
  onHasButtonChange,
  onTitleChange,
  onDescriptionChange,
  onExperienceTypeChange,
  onPositionNameChange,
  onCompanyNameChange,
  onYearChange,
  onExperienceDescriptionChange,
  onLabelChange,
  onDetailsChange,
  onCardNameChange,
  onCardDescriptionChange,
  onHasIconChange,
  onGenericStatusChange,
  onShowBgPatternChange,
  onPatternTypeChange,
  onShowOverlayChange,
  onShowShadowChange,
  onShowBorderChange,
}: CardControlsProps) {
  return (
    <div className="ds-card-controls">
      <div className="ds-card-control-group">
        <label htmlFor="card-type-select" className="ds-card-control-label">
          Card Type
        </label>
        <select
          id="card-type-select"
          className="ds-card-control-select"
          value={cardType}
          onChange={(e) => onCardTypeChange(e.target.value as CardType)}
        >
          {CARD_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

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

      {/* ProductCard Controls */}
      {cardType === "product" && (
        <>
          <div className="ds-card-control-group ds-card-control-group--row">
            <div className="ds-card-control-field">
              <label htmlFor="product-size-select" className="ds-card-control-label">
                Size
              </label>
              <select
                id="product-size-select"
                className="ds-card-control-select"
                value={size}
                onChange={(e) => onSizeChange?.(e.target.value as ProductCardSize)}
              >
                {PRODUCT_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ds-card-control-field">
              <label htmlFor="product-status-select" className="ds-card-control-label">
                Status
              </label>
              <select
                id="product-status-select"
                className="ds-card-control-select"
                value={status}
                onChange={(e) => onStatusChange?.(e.target.value as ProductCardStatus)}
              >
                {PRODUCT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Image</span>
                <Switch
                  id="product-has-image"
                  checked={hasImage}
                  onChange={onHasImageChange}
                  ariaLabel="Image"
                />
              </div>
              {hasImage && (
                <div className="ds-icon-fill-section">
                  <label htmlFor="product-aspect-ratio-select" className="ds-card-control-label">
                    Aspect Ratio
                  </label>
                  <select
                    id="product-aspect-ratio-select"
                    className="ds-card-control-select"
                    value={imageAspectRatio}
                    onChange={(e) =>
                      onImageAspectRatioChange?.(e.target.value as "16x9" | "4x3")
                    }
                  >
                    {IMAGE_ASPECT_RATIO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Identifiers</span>
                <Switch
                  id="product-has-identifiers"
                  checked={hasIdentifiers}
                  onChange={onHasIdentifiersChange}
                  ariaLabel="Identifiers"
                />
              </div>
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Button</span>
                <Switch
                  id="product-has-button"
                  checked={hasButton}
                  onChange={onHasButtonChange}
                  ariaLabel="Button"
                />
              </div>
            </div>
          </div>

          <div className="ds-card-control-group">
            <label htmlFor="product-title-input" className="ds-card-control-label">
              Title
            </label>
            <input
              id="product-title-input"
              type="text"
              className="ds-card-control-input"
              value={title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              placeholder="Product Title"
            />
          </div>

          <div className="ds-card-control-group">
            <label htmlFor="product-description-input" className="ds-card-control-label">
              Description
            </label>
            <textarea
              id="product-description-input"
              className="ds-card-control-input"
              value={description}
              onChange={(e) => onDescriptionChange?.(e.target.value)}
              placeholder="Product description"
              rows={3}
            />
          </div>
        </>
      )}

      {/* ExperienceCard Controls */}
      {cardType === "experience" && (
        <>
          <div className="ds-card-control-group">
            <label htmlFor="experience-type-select" className="ds-card-control-label">
              Type
            </label>
            <select
              id="experience-type-select"
              className="ds-card-control-select"
              value={experienceType}
              onChange={(e) => onExperienceTypeChange?.(e.target.value as ExperienceCardType)}
            >
              {EXPERIENCE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {experienceType === "default" && (
            <>
              <div className="ds-card-control-group">
                <label htmlFor="experience-position-input" className="ds-card-control-label">
                  Position Name
                </label>
                <input
                  id="experience-position-input"
                  type="text"
                  className="ds-card-control-input"
                  value={positionName}
                  onChange={(e) => onPositionNameChange?.(e.target.value)}
                  placeholder="Position Name"
                />
              </div>

              <div className="ds-card-control-group">
                <label htmlFor="experience-company-input" className="ds-card-control-label">
                  Company Name
                </label>
                <input
                  id="experience-company-input"
                  type="text"
                  className="ds-card-control-input"
                  value={companyName}
                  onChange={(e) => onCompanyNameChange?.(e.target.value)}
                  placeholder="Company Name"
                />
              </div>

              <div className="ds-card-control-group">
                <label htmlFor="experience-year-input" className="ds-card-control-label">
                  Year
                </label>
                <input
                  id="experience-year-input"
                  type="text"
                  className="ds-card-control-input"
                  value={year}
                  onChange={(e) => onYearChange?.(e.target.value)}
                  placeholder="2025-26"
                />
              </div>

              <div className="ds-card-control-group">
                <label htmlFor="experience-description-input" className="ds-card-control-label">
                  Description
                </label>
                <textarea
                  id="experience-description-input"
                  className="ds-card-control-input"
                  value={experienceDescription}
                  onChange={(e) => onExperienceDescriptionChange?.(e.target.value)}
                  placeholder="Long Description"
                  rows={3}
                />
              </div>
            </>
          )}

          {experienceType === "skills" && (
            <div className="ds-card-control-group">
              <label htmlFor="experience-skills-position-input" className="ds-card-control-label">
                Position Name
              </label>
              <input
                id="experience-skills-position-input"
                type="text"
                className="ds-card-control-input"
                value={positionName}
                onChange={(e) => onPositionNameChange?.(e.target.value)}
                placeholder="Position Name"
              />
            </div>
          )}

          {experienceType === "contacts" && (
            <>
              <div className="ds-card-control-group">
                <label htmlFor="experience-label-input" className="ds-card-control-label">
                  Label
                </label>
                <input
                  id="experience-label-input"
                  type="text"
                  className="ds-card-control-input"
                  value={label}
                  onChange={(e) => onLabelChange?.(e.target.value)}
                  placeholder="Label"
                />
              </div>

              <div className="ds-card-control-group">
                <label htmlFor="experience-details-input" className="ds-card-control-label">
                  Details
                </label>
                <input
                  id="experience-details-input"
                  type="text"
                  className="ds-card-control-input"
                  value={details}
                  onChange={(e) => onDetailsChange?.(e.target.value)}
                  placeholder="Details"
                />
              </div>
            </>
          )}
        </>
      )}

      {/* InfoCard Controls */}
      {cardType === "info" && (
        <>
          <div className="ds-card-control-group">
            <span className="ds-card-control-label">Icon</span>
            <Switch
              id="info-has-icon"
              checked={hasIcon}
              onChange={onHasIconChange}
              ariaLabel="Has Icon"
            />
          </div>

          <div className="ds-card-control-group">
            <label htmlFor="info-name-input" className="ds-card-control-label">
              Card Name
            </label>
            <input
              id="info-name-input"
              type="text"
              className="ds-card-control-input"
              value={cardName}
              onChange={(e) => onCardNameChange?.(e.target.value)}
              placeholder="Card Name"
            />
          </div>

          <div className="ds-card-control-group">
            <label htmlFor="info-description-input" className="ds-card-control-label">
              Card Description
            </label>
            <textarea
              id="info-description-input"
              className="ds-card-control-input"
              value={cardDescription}
              onChange={(e) => onCardDescriptionChange?.(e.target.value)}
              placeholder="Card Description"
              rows={3}
            />
          </div>
        </>
      )}

      {/* Generic Card Controls */}
      {cardType === "generic" && (
        <>
          <div className="ds-card-control-group">
            <label htmlFor="generic-status-select" className="ds-card-control-label">
              Status
            </label>
            <select
              id="generic-status-select"
              className="ds-card-control-select"
              value={genericStatus}
              onChange={(e) => onGenericStatusChange?.(e.target.value as GenericCardStatus)}
            >
              {GENERIC_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Background Pattern</span>
                <Switch
                  id="generic-bg-pattern"
                  checked={showBgPattern}
                  onChange={onShowBgPatternChange}
                  ariaLabel="Background Pattern"
                />
              </div>
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Overlay</span>
                <Switch
                  id="generic-overlay"
                  checked={showOverlay}
                  onChange={onShowOverlayChange}
                  ariaLabel="Overlay"
                />
              </div>
            </div>
          </div>

          {showBgPattern && (
            <div className="ds-card-control-group">
              <label htmlFor="generic-pattern-type-select" className="ds-card-control-label">
                Pattern Type
              </label>
              <select
                id="generic-pattern-type-select"
                className="ds-card-control-select"
                value={patternType}
                onChange={(e) => onPatternTypeChange?.(e.target.value as PatternType)}
              >
                {Object.entries(PATTERN_CONFIGS)
                  .filter(([key]) => key !== "default")
                  .map(([key, config]) => (
                    <option key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="ds-card-control-group">
            <div className="ds-icon-fill-row">
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Shadow</span>
                <Switch
                  id="generic-shadow"
                  checked={showShadow}
                  onChange={onShowShadowChange}
                  ariaLabel="Shadow"
                />
              </div>
              <div className="ds-icon-fill-section">
                <span className="ds-card-control-label">Border</span>
                <Switch
                  id="generic-border"
                  checked={showBorder}
                  onChange={onShowBorderChange}
                  ariaLabel="Border"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

