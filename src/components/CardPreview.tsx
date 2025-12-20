"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { RightArrowIcon, ArrowDownFallSlotIcon } from "./icons";

type CardType = "product" | "experience" | "info" | "generic";

// ProductCard props
type ProductCardSize = "full" | "half";
type ProductCardStatus = "default" | "highlighted";

// ExperienceCard props
type ExperienceCardType = "default" | "skills" | "contacts";

// Generic Card props
type GenericCardStatus = "default" | "highlighted" | "selected";

interface CardPreviewProps {
  cardType: CardType;
  theme: Theme;
  hue: HueVariant;
  // ProductCard props
  size?: ProductCardSize;
  status?: ProductCardStatus;
  hasImage?: boolean;
  imageAspectRatio?: "16x9" | "4x3";
  hasIdentifiers?: boolean;
  hasButton?: boolean;
  title?: string;
  description?: string;
  // ExperienceCard props
  experienceType?: ExperienceCardType;
  positionName?: string;
  companyName?: string;
  year?: string;
  experienceDescription?: string;
  label?: string;
  details?: string;
  // InfoCard props
  cardName?: string;
  cardDescription?: string;
  hasIcon?: boolean;
  // Generic Card props
  genericStatus?: GenericCardStatus;
  showBgPattern?: boolean;
  showOverlay?: boolean;
  showShadow?: boolean;
  showBorder?: boolean;
  slot?: React.ReactNode;
}

export function CardPreview({
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
  description = "Add your products Details that description here. This paragraph is restricted only two lines even if content is large.",
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
  showOverlay = true,
  showShadow = true,
  showBorder = true,
  slot,
}: CardPreviewProps) {
  const renderProductCard = () => {
    const isFull = size === "full";
    const isHighlighted = status === "highlighted";

    const cardStyles: React.CSSProperties = {
      position: "relative",
      overflow: "hidden",
      borderRadius: "var(--corner-radius-400)",
      backgroundColor: isHighlighted ? "var(--bg-page-primary)" : "var(--bg-page-tertiary)",
      display: "flex",
      flexDirection: isFull ? "row" : "column",
      gap: isFull ? "var(--spacing-500)" : "var(--spacing-200)",
      padding: isFull ? 0 : "var(--spacing-400)",
      width: isFull ? "100%" : "100%",
      maxWidth: isFull ? "600px" : "400px",
      minHeight: isFull ? "240px" : "auto",
    };

    const overlayStyles: React.CSSProperties = {
      position: "absolute",
      inset: "-1px",
      background: `linear-gradient(to bottom, rgba(255,255,255,0) 26.827%, ${
        isHighlighted ? "var(--bg-page-primary)" : "var(--bg-page-secondary)"
      } 86.384%)`,
      pointerEvents: "none",
    };

    if (isFull) {
      return (
        <div style={cardStyles}>
          {showBgPattern && (
            <div
              style={{
                position: "absolute",
                aspectRatio: "64/64",
                inset: "-1px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "0 -322px -322px 0",
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"210\" height=\"163\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"210\" height=\"163\" fill=\"%23d2d2d6\"/%3E%3C/svg%3E')",
                  backgroundRepeat: "repeat",
                  backgroundSize: "210px 163px",
                }}
              />
            </div>
          )}
          {showOverlay && <div style={overlayStyles} />}
          {hasImage && (
            <div
              style={{
                aspectRatio: imageAspectRatio === "16x9" ? "16/9" : "4/3",
                flex: "1 0 0",
                maxHeight: "240px",
                maxWidth: "300px",
                minHeight: "36px",
                minWidth: "48px",
                position: "relative",
                borderRadius: "0 var(--corner-radius-400) 0 0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "var(--bg-page-secondary)",
                  borderRadius: "0 var(--corner-radius-400) 0 0",
                }}
              />
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 0 0",
              gap: "var(--spacing-500)",
              alignItems: "flex-start",
              minHeight: 0,
              minWidth: 0,
              padding: "0 0 var(--spacing-500) 0",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-200)",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--heading-h4-text-size)",
                  lineHeight: "var(--heading-h4-line-height)",
                  fontWeight: "var(--font-weight-secondary-semibold)",
                  color: "var(--fg-neutral)",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {title}
              </h4>
              <p
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--body-regular-text-size)",
                  lineHeight: "var(--body-regular-line-height)",
                  fontWeight: "var(--font-weight-secondary-regular)",
                  color: "var(--fg-neutral-tertiary)",
                  margin: 0,
                  flex: "1 0 0",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {description}
              </p>
            </div>
            {hasIdentifiers && (
              <div
                style={{
                  display: "flex",
                  gap: "var(--spacing-200)",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--bg-page-tertiary)",
                    padding: "var(--spacing-100) var(--spacing-300)",
                    borderRadius: "var(--corner-radius-full)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-100)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-secondary)",
                      fontSize: "var(--body-extra-small-text-size)",
                      lineHeight: "var(--body-extra-small-line-height)",
                      color: "var(--fg-neutral-tertiary)",
                    }}
                  >
                    Identifier
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--bg-page-tertiary)",
                    padding: "var(--spacing-100) var(--spacing-300)",
                    borderRadius: "var(--corner-radius-full)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-100)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-secondary)",
                      fontSize: "var(--body-extra-small-text-size)",
                      lineHeight: "var(--body-extra-small-line-height)",
                      color: "var(--fg-neutral-tertiary)",
                    }}
                  >
                    Tag
                  </span>
                </div>
              </div>
            )}
            {hasButton && (
              <div
                style={{
                  backgroundColor: "var(--bg-primary-tonal)",
                  padding: "var(--spacing-300) var(--spacing-400)",
                  borderRadius: "var(--corner-radius-200)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-200)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    lineHeight: "var(--body-small-line-height)",
                    fontWeight: "var(--font-weight-secondary-medium)",
                    color: "var(--fg-primary-on-tonal)",
                  }}
                >
                  Button
                </span>
                <RightArrowIcon size="xs" />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Half size (vertical)
    return (
      <div style={cardStyles}>
        {showBgPattern && (
          <div
            style={{
              position: "absolute",
              aspectRatio: "64/64",
              inset: "-1px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 -322px -322px 0",
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"210\" height=\"163\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"210\" height=\"163\" fill=\"%23d2d2d6\"/%3E%3C/svg%3E')",
                backgroundRepeat: "repeat",
                backgroundSize: "210px 163px",
              }}
            />
          </div>
        )}
        {showOverlay && <div style={overlayStyles} />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-200)",
            alignItems: "flex-start",
            width: "100%",
            position: "relative",
          }}
        >
          <h5
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--heading-h5-text-size)",
              lineHeight: "var(--heading-h5-line-height)",
              fontWeight: "var(--font-weight-secondary-semibold)",
              color: "var(--fg-neutral)",
              margin: 0,
              textTransform: "capitalize",
            }}
          >
            {title}
          </h5>
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-regular-text-size)",
              lineHeight: "var(--body-regular-line-height)",
              fontWeight: "var(--font-weight-secondary-regular)",
              color: "var(--fg-neutral-tertiary)",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>
        {hasImage && (
          <div
            style={{
              aspectRatio: imageAspectRatio === "16x9" ? "320/180" : "4/3",
              minHeight: "27px",
              minWidth: "48px",
              position: "relative",
              borderRadius: "var(--corner-radius-400)",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "var(--bg-page-secondary)",
                borderRadius: "var(--corner-radius-400)",
              }}
            />
          </div>
        )}
        {hasIdentifiers && (
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-200)",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--bg-page-tertiary)",
                padding: "var(--spacing-100) var(--spacing-300)",
                borderRadius: "var(--corner-radius-full)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-100)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--body-extra-small-text-size)",
                  lineHeight: "var(--body-extra-small-line-height)",
                  color: "var(--fg-neutral-tertiary)",
                }}
              >
                Identifier
              </span>
            </div>
            <div
              style={{
                backgroundColor: "var(--bg-page-tertiary)",
                padding: "var(--spacing-100) var(--spacing-300)",
                borderRadius: "var(--corner-radius-full)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-100)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--body-extra-small-text-size)",
                  lineHeight: "var(--body-extra-small-line-height)",
                  color: "var(--fg-neutral-tertiary)",
                }}
              >
                Tag
              </span>
            </div>
          </div>
        )}
        {hasButton && (
          <div
            style={{
              backgroundColor: "var(--bg-primary-tonal)",
              padding: "var(--spacing-300) var(--spacing-400)",
              borderRadius: "var(--corner-radius-200)",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-200)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--body-small-text-size)",
                lineHeight: "var(--body-small-line-height)",
                fontWeight: "var(--font-weight-secondary-medium)",
                color: "var(--fg-primary-on-tonal)",
              }}
            >
              Button
            </span>
            <RightArrowIcon size="xs" />
          </div>
        )}
      </div>
    );
  };

  const renderExperienceCard = () => {
    const isDefault = experienceType === "default";
    const isSkills = experienceType === "skills";
    const isContacts = experienceType === "contacts";

    if (isDefault) {
      return (
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-500)",
            alignItems: "flex-start",
            width: "480px",
            position: "relative",
          }}
        >
          <div
            style={{
              minHeight: "48px",
              minWidth: "48px",
              width: "64px",
              height: "64px",
              borderRadius: "var(--corner-radius-200)",
              backgroundColor: "var(--bg-page-secondary)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 0 0",
              gap: "var(--spacing-300)",
              alignItems: "flex-start",
              maxWidth: "600px",
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-100)",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <h6
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--heading-h6-text-size)",
                  lineHeight: "var(--heading-h6-line-height)",
                  fontWeight: "var(--font-weight-secondary-semibold)",
                  color: "var(--fg-neutral)",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {positionName}
              </h6>
              <p
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--body-regular-text-size)",
                  lineHeight: "var(--body-regular-line-height)",
                  fontWeight: "var(--font-weight-secondary-medium)",
                  color: "var(--fg-neutral-tertiary)",
                  margin: 0,
                }}
              >
                {companyName}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--body-extra-small-text-size)",
                  lineHeight: "var(--body-extra-small-line-height)",
                  fontWeight: "var(--font-weight-secondary-regular)",
                  color: "var(--fg-neutral-tertiary)",
                  margin: 0,
                }}
              >
                {year}
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--body-small-text-size)",
                lineHeight: "var(--body-small-line-height)",
                fontWeight: "var(--font-weight-secondary-regular)",
                color: "var(--fg-neutral-tertiary)",
                margin: 0,
              }}
            >
              {experienceDescription}
            </p>
          </div>
        </div>
      );
    }

    if (isSkills) {
      return (
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-400)",
            alignItems: "center",
            backgroundColor: "var(--bg-page-secondary)",
            padding: "var(--spacing-200)",
            borderRadius: "var(--corner-radius-200)",
            width: "480px",
            position: "relative",
          }}
        >
          <div
            style={{
              minHeight: "32px",
              minWidth: "32px",
              width: "48px",
              height: "48px",
              borderRadius: "var(--corner-radius-200)",
              backgroundColor: "var(--bg-page-tertiary)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-regular-text-size)",
              lineHeight: "var(--body-regular-line-height)",
              fontWeight: "var(--font-weight-secondary-medium)",
              color: "var(--fg-neutral)",
              margin: 0,
              flex: "1 0 0",
            }}
          >
            {positionName}
          </p>
        </div>
      );
    }

    // Contacts
    return (
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-400)",
          alignItems: "center",
          width: "480px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 0 0",
            gap: "var(--spacing-100)",
            alignItems: "flex-start",
            maxWidth: "600px",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-regular-text-size)",
              lineHeight: "var(--body-regular-line-height)",
              fontWeight: "var(--font-weight-secondary-regular)",
              color: "var(--fg-neutral-tertiary)",
              margin: 0,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-medium-text-size)",
              lineHeight: "var(--body-medium-line-height)",
              fontWeight: "var(--font-weight-secondary-medium)",
              color: "var(--fg-neutral)",
              margin: 0,
            }}
          >
            {details}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "var(--bg-page-tertiary)",
            width: "48px",
            height: "48px",
            borderRadius: "var(--corner-radius-200)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "var(--fg-neutral)",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    );
  };

  const renderInfoCard = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-400)",
          alignItems: "flex-start",
          width: "480px",
          position: "relative",
        }}
      >
        {hasIcon && (
          <div
            style={{
              backgroundColor: "var(--bg-primary-tonal)",
              width: "32px",
              height: "32px",
              borderRadius: "var(--corner-radius-200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: "8px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "var(--fg-primary-on-tonal)",
                borderRadius: "50%",
              }}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 0 0",
            gap: "var(--spacing-300)",
            alignItems: "flex-start",
            maxWidth: "600px",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-regular-text-size)",
              lineHeight: "var(--body-regular-line-height)",
              fontWeight: "var(--font-weight-secondary-medium)",
              color: "var(--fg-neutral)",
              margin: 0,
            }}
          >
            {cardName}
          </p>
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "var(--body-small-text-size)",
              lineHeight: "var(--body-small-line-height)",
              fontWeight: "var(--font-weight-secondary-regular)",
              color: "var(--fg-neutral-tertiary)",
              margin: 0,
              textAlign: "justify",
            }}
          >
            {cardDescription}
          </p>
        </div>
      </div>
    );
  };

  const renderGenericCard = () => {
    const isDefault = genericStatus === "default";
    const isHighlighted = genericStatus === "highlighted";
    const isSelected = genericStatus === "selected";

    const cardStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-400)",
      alignItems: "flex-start",
      overflow: "hidden",
      padding: "var(--spacing-400)",
      borderRadius: "var(--corner-radius-400)",
      width: "400px",
      position: "relative",
      backgroundColor: isDefault ? "var(--bg-page-tertiary)" : "var(--bg-page-primary)",
    };

    if (showBorder) {
      if (isSelected) {
        cardStyles.border = "var(--border-width-25) solid var(--border-primary)";
      } else {
        cardStyles.border = "var(--border-width-25) solid var(--border-strong-200)";
      }
    }

    if (showShadow) {
      if (isHighlighted) {
        cardStyles.boxShadow =
          "0px 4px 6px -2px var(--shadow-subtle), 0px -4px 9px -6px var(--shadow-subtle)";
      } else {
        cardStyles.boxShadow =
          "0px 1px 4px -2px var(--shadow-subtle), 0px 1px 4px 0px var(--shadow-subtle)";
      }
    }

    const overlayGradient = isDefault
      ? "var(--bg-page-secondary)"
      : "var(--bg-page-primary)";

    return (
      <div style={cardStyles}>
        {showBgPattern && (
          <div
            style={{
              position: "absolute",
              aspectRatio: "64/64",
              inset: showBorder ? "-1px" : "0",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"34\" height=\"50\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"34\" height=\"50\" fill=\"%23d2d2d6\"/%3E%3C/svg%3E')",
                backgroundRepeat: "repeat",
                backgroundSize: "33.5px 50px",
              }}
            />
          </div>
        )}
        {showOverlay && (
          <div
            style={{
              position: "absolute",
              inset: showBorder ? "-1px" : "0",
              background: `linear-gradient(to bottom, rgba(255,255,255,0) 26.827%, ${overlayGradient} 86.384%)`,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )}
        {slot || (
          <div
            style={{
              backgroundColor: "var(--bg-warning-tonal)",
              border: "var(--border-width-25) dashed var(--border-warning)",
              padding: "var(--spacing-200) 8px",
              borderRadius: "var(--corner-radius-100)",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "32px",
              position: "relative",
              zIndex: 3,
            }}
          >
            <div style={{ color: "var(--fg-warning-on-tonal)" }}>
              <ArrowDownFallSlotIcon size="xs" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCard = () => {
    switch (cardType) {
      case "product":
        return renderProductCard();
      case "experience":
        return renderExperienceCard();
      case "info":
        return renderInfoCard();
      case "generic":
        return renderGenericCard();
      default:
        return null;
    }
  };

  return (
    <div className="ds-card-preview-container">
      <div className="ds-card-preview-canvas">{renderCard()}</div>
    </div>
  );
}

