"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { SearchIcon, ChevronDownIcon } from "./icons";

type ButtonVariant = "filled" | "tonal" | "outline" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
type ButtonState = "default" | "hovered" | "focused" | "pressed" | "disabled" | "loading" | "success" | "critical" | "warning";

interface ButtonPreviewProps {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
  fillContainer: boolean;
  state: ButtonState;
  theme: Theme;
  hue: HueVariant;
}

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

const SIZE_CONFIG: Record<
  ButtonSize,
  {
    height: string;
    paddingX: string;
    paddingY: string;
    fontSize: string;
    iconSize: "xs" | "sm" | "rg" | "md";
  }
> = {
  xs: {
    height: "28px",
    paddingX: "var(--spacing-200)",
    paddingY: "var(--spacing-50)",
    fontSize: "var(--body-extra-small-text-size)",
    iconSize: "xs",
  },
  sm: {
    height: "36px",
    paddingX: "var(--spacing-300)",
    paddingY: "var(--spacing-100)",
    fontSize: "var(--body-small-text-size)",
    iconSize: "xs",
  },
  md: {
    height: "44px",
    paddingX: "var(--spacing-400)",
    paddingY: "var(--spacing-200)",
    fontSize: "var(--body-regular-text-size)",
    iconSize: "xs",
  },
  lg: {
    height: "56px",
    paddingX: "var(--spacing-500)",
    paddingY: "var(--spacing-300)",
    fontSize: "var(--body-medium-text-size)",
    iconSize: "sm",
  },
  xl: {
    height: "68px",
    paddingX: "var(--spacing-600)",
    paddingY: "var(--spacing-400)",
    fontSize: "var(--body-medium-text-size)",
    iconSize: "sm",
  },
};

export function ButtonPreview({
  variant,
  size,
  cornerRadius,
  hasLeftIcon,
  hasRightIcon,
  fillContainer,
  state,
  theme,
  hue,
}: ButtonPreviewProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const borderRadius = CORNER_RADIUS_MAP[cornerRadius];

  const buttonStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--spacing-100)",
      fontFamily: "var(--font-secondary)",
      fontSize: sizeConfig.fontSize,
      lineHeight: "1",
      fontWeight: "var(--font-weight-secondary-medium)",
      borderWidth: "var(--border-width-25)",
      borderStyle: "solid",
      borderColor: "transparent",
      borderRadius,
      cursor: state === "disabled" ? "not-allowed" : "pointer",
      transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
      minHeight: sizeConfig.height,
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
      width: fillContainer ? "100%" : "auto",
      opacity: state === "disabled" ? 0.6 : 1,
    };

    // Get base variant styles
    let variantStyles: React.CSSProperties = {};
    switch (variant) {
      case "filled":
        variantStyles = {
          backgroundColor: "var(--bg-brand)",
          color: "var(--fg-on-action)",
          borderColor: "var(--border-on-action)",
        };
        break;
      case "tonal":
        variantStyles = {
          backgroundColor: "var(--bg-brand-tonal)",
          color: "var(--fg-primary-on-tonal)",
          borderColor: "var(--border-primary-tonal)",
        };
        break;
      case "outline":
        variantStyles = {
          backgroundColor: "transparent",
          color: "var(--fg-primary)",
          borderColor: "var(--border-primary)",
        };
        break;
      case "link":
        variantStyles = {
          backgroundColor: "transparent",
          color: "var(--fg-primary)",
          borderWidth: 0,
          borderStyle: "none",
          borderColor: "transparent",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
        };
        break;
    }

    // Apply state-specific overrides
    const stateStyles: React.CSSProperties = {};
    if (state === "disabled") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-brand-disabled)";
        stateStyles.color = "var(--fg-on-disabled)";
        stateStyles.borderColor = "var(--border-disabled)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-disabled)";
        stateStyles.color = "var(--fg-disabled)";
        stateStyles.borderColor = "var(--border-disabled)";
      } else if (variant === "outline") {
        stateStyles.color = "var(--fg-disabled)";
        stateStyles.borderColor = "var(--border-disabled)";
      } else if (variant === "link") {
        stateStyles.color = "var(--fg-disabled)";
      }
    } else if (state === "hovered") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-brand-on-hover)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-brand-tonal-on-hover)";
      } else if (variant === "outline") {
        stateStyles.borderColor = "var(--border-primary-on-hover)";
      } else if (variant === "link") {
        stateStyles.color = "var(--fg-primary-on-hover)";
      }
    } else if (state === "pressed") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-brand-pressed)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-brand-tonal-on-hover)";
      }
    } else if (state === "focused") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-brand-on-focused)";
      } else if (variant === "outline") {
        stateStyles.borderColor = "var(--border-primary)";
      }
      stateStyles.outline = "2px solid var(--border-primary)";
      stateStyles.outlineOffset = "2px";
    } else if (state === "success") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-success)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-success-tonal)";
        stateStyles.color = "var(--fg-success-on-tonal)";
        stateStyles.borderColor = "var(--border-success-tonal)";
      } else if (variant === "outline") {
        stateStyles.color = "var(--fg-success)";
        stateStyles.borderColor = "var(--border-success)";
      }
    } else if (state === "critical") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-critical)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-critical-tonal)";
        stateStyles.color = "var(--fg-critical-on-tonal)";
        stateStyles.borderColor = "var(--border-critical-tonal)";
      } else if (variant === "outline") {
        stateStyles.color = "var(--fg-critical)";
        stateStyles.borderColor = "var(--border-critical)";
      }
    } else if (state === "warning") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-warning)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-warning-tonal)";
        stateStyles.color = "var(--fg-warning-on-tonal)";
        stateStyles.borderColor = "var(--border-warning-tonal)";
      } else if (variant === "outline") {
        stateStyles.color = "var(--fg-warning)";
        stateStyles.borderColor = "var(--border-warning)";
      }
    }

    return { ...baseStyles, ...variantStyles, ...stateStyles };
  }, [variant, sizeConfig, borderRadius, fillContainer, state]);

  const isLoading = state === "loading";
  const showIcons = !isLoading && (hasLeftIcon || hasRightIcon);

  return (
    <div className="ds-button-preview-container">
      <div className="ds-button-preview-canvas">
        <button
          type="button"
          className="ds-button-preview-button"
          style={buttonStyles}
          disabled={state === "disabled"}
        >
          {isLoading ? (
            <>
              <svg
                className="ds-button-loading-spinner"
                width={sizeConfig.iconSize === "xs" ? "16" : "20"}
                height={sizeConfig.iconSize === "xs" ? "16" : "20"}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="31.416"
                  strokeDashoffset="31.416"
                  opacity="0.3"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="31.416"
                  strokeDashoffset="23.562"
                />
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              {showIcons && hasLeftIcon && <SearchIcon size={sizeConfig.iconSize} />}
              <span>Button</span>
              {showIcons && hasRightIcon && <ChevronDownIcon size={sizeConfig.iconSize} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

