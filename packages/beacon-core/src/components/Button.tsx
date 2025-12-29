"use client";

import { useMemo, useState, useCallback, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { LoaderIcon } from "../icons";

export type ButtonVariant = "filled" | "tonal" | "outline" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
export type JustifyContent = "center" | "space-between";

export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  cornerRadius?: CornerRadiusStep;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fillContainer?: boolean;
  justifyContent?: JustifyContent;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
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

type ButtonState = "default" | "hovered" | "focused" | "pressed";

export function Button({
  variant = "filled",
  size = "md",
  cornerRadius = 2,
  startIcon,
  endIcon,
  fillContainer = false,
  justifyContent = "center",
  loading = false,
  disabled = false,
  type = "button",
  children,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onMouseDown,
  onMouseUp,
  ref,
  ...rest
}: ButtonProps) {
    const themeContext = useThemeSafe();
    const sizeConfig = SIZE_CONFIG[size];
    const borderRadius = CORNER_RADIUS_MAP[cornerRadius];

    const [state, setState] = useState<ButtonState>("default");

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
          setState("hovered");
        }
        onMouseEnter?.(e);
      },
      [disabled, loading, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
          setState("default");
        }
        onMouseLeave?.(e);
      },
      [disabled, loading, onMouseLeave]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
          setState("focused");
        }
        onFocus?.(e);
      },
      [disabled, loading, onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
          setState("default");
        }
        onBlur?.(e);
      },
      [disabled, loading, onBlur]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
          setState("pressed");
        }
        onMouseDown?.(e);
      },
      [disabled, loading, onMouseDown]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
          setState("hovered");
        }
        onMouseUp?.(e);
      },
      [disabled, loading, onMouseUp]
    );

    const isDisabled = disabled || loading;
    const currentState: ButtonState = isDisabled ? "default" : state;

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
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        minHeight: sizeConfig.height,
        paddingLeft: sizeConfig.paddingX,
        paddingRight: sizeConfig.paddingX,
        paddingTop: sizeConfig.paddingY,
        paddingBottom: sizeConfig.paddingY,
        width: fillContainer ? "100%" : "auto",
        opacity: isDisabled ? 0.6 : 1,
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
      if (isDisabled) {
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
      } else if (currentState === "hovered") {
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
      } else if (currentState === "pressed") {
        if (variant === "filled") {
          stateStyles.backgroundColor = "var(--bg-primary-pressed)";
          stateStyles.borderColor = "var(--bg-primary-pressed)";
        } else if (variant === "tonal") {
          stateStyles.backgroundColor = "var(--bg-primary-tonal-on-hover)";
        }
      } else if (currentState === "focused") {
        if (variant === "filled") {
          stateStyles.backgroundColor = "var(--bg-primary-on-focused)";
          stateStyles.borderColor = "var(--bg-primary-on-focused)";
        } else if (variant === "outline") {
          stateStyles.borderColor = "var(--border-primary)";
        }
        stateStyles.outline = "2px solid var(--border-primary)";
        stateStyles.outlineOffset = "2px";
      }

      return { ...baseStyles, ...variantStyles, ...stateStyles, ...style };
    }, [variant, sizeConfig, borderRadius, fillContainer, justifyContent, currentState, isDisabled, style]);

    const showStartIcon = !loading && startIcon;
    const showEndIcon = !loading && endIcon;

    return (
      <button
        ref={ref}
        type={type}
        className={className}
        style={buttonStyles}
        disabled={isDisabled}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...rest}
      >
        {loading ? (
          <LoaderIcon size={LOADER_ICON_SIZE_MAP[size]} className="ds-button-loading-spinner" />
        ) : (
          <>
            {showStartIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{startIcon}</span>}
            {children}
            {showEndIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{endIcon}</span>}
          </>
        )}
      </button>
    );
}
