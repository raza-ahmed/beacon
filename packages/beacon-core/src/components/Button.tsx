"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "../tokens/types";
import { SearchIcon, ChevronDownIcon, LoaderIcon } from "../icons";

type ButtonVariant = "filled" | "tonal" | "outline" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
type ButtonState = "default" | "hovered" | "focused" | "pressed" | "disabled" | "loading" | "success" | "critical" | "warning";
type JustifyContent = "center" | "space-between";

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  hasStartIcon: boolean;
  hasEndIcon: boolean;
  fillContainer: boolean;
  justifyContent: JustifyContent;
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

const LOADER_ICON_SIZE_MAP: Record<ButtonSize, number> = {
  xs: 20,
  sm: 24,
  md: 24,
  lg: 32,
  xl: 40,
};

export function Button({
  variant,
  size,
  cornerRadius,
  hasStartIcon,
  hasEndIcon,
  fillContainer,
  justifyContent,
  state,
  theme,
  hue,
}: ButtonProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const borderRadius = CORNER_RADIUS_MAP[cornerRadius];

  const buttonStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: justifyContent,
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
          backgroundColor: "var(--bg-primary)",
          color: "var(--fg-on-action)",
          borderColor: "var(--bg-primary)",
        };
        break;
      case "tonal":
        variantStyles = {
          backgroundColor: "var(--bg-primary-tonal)",
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
        stateStyles.backgroundColor = "var(--bg-disabled)";
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
        stateStyles.backgroundColor = "var(--bg-primary-on-hover)";
        stateStyles.borderColor = "var(--bg-primary-on-hover)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-primary-tonal-on-hover)";
      } else if (variant === "outline") {
        stateStyles.borderColor = "var(--border-primary-on-hover)";
      } else if (variant === "link") {
        stateStyles.color = "var(--fg-primary-on-hover)";
      }
    } else if (state === "pressed") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-primary-pressed)";
        stateStyles.borderColor = "var(--bg-primary-pressed)";
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = "var(--bg-primary-tonal-on-hover)";
      }
    } else if (state === "focused") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-primary-on-focused)";
        stateStyles.borderColor = "var(--bg-primary-on-focused)";
      } else if (variant === "outline") {
        stateStyles.borderColor = "var(--border-primary)";
      }
      stateStyles.outline = "2px solid var(--border-primary)";
      stateStyles.outlineOffset = "2px";
    } else if (state === "success") {
      if (variant === "filled") {
        stateStyles.backgroundColor = "var(--bg-success)";
        stateStyles.borderColor = "var(--border-success)";
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
        stateStyles.borderColor = "var(--border-critical)";
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
        stateStyles.borderColor = "var(--border-warning)";
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
  }, [variant, sizeConfig, borderRadius, fillContainer, justifyContent, state]);

  const isLoading = state === "loading";
  const showStartIcon = !isLoading && hasStartIcon;
  const showEndIcon = !isLoading && hasEndIcon;

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
            <LoaderIcon size={LOADER_ICON_SIZE_MAP[size]} className="ds-button-loading-spinner" />
          ) : (
            <>
              <div className="ds-button-preview-start">
                {showStartIcon && <SearchIcon size={sizeConfig.iconSize} />}
                <span>Button</span>
              </div>
              {showEndIcon && <ChevronDownIcon size={sizeConfig.iconSize} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

