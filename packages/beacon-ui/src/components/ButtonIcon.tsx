"use client";

import { useMemo, useState, useCallback, ComponentPropsWithRef, cloneElement, isValidElement } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { LoaderIcon } from "../icons";
import type { ButtonVariant, ButtonSize, CornerRadiusStep, ButtonState, ButtonColor } from "./Button";

export interface ButtonIconProps extends Omit<ComponentPropsWithRef<"button">, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  cornerRadius?: CornerRadiusStep;
  icon?: React.ReactNode;
  loading?: boolean;
  state?: ButtonState;
  color?: ButtonColor;
  type?: "button" | "submit" | "reset";
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
    padding: string;
    iconSize: "xs" | "sm" | "rg" | "md" | "rm";
  }
> = {
  xs: {
    height: "24px",
    padding: "var(--spacing-200)",
    iconSize: "xs",
  },
  sm: {
    height: "32px",
    padding: "var(--spacing-300)",
    iconSize: "xs",
  },
  md: {
    height: "44px",
    padding: "var(--spacing-400)",
    iconSize: "sm",
  },
  lg: {
    height: "56px",
    padding: "var(--spacing-500)",
    iconSize: "rg",
  },
  xl: {
    height: "68px",
    padding: "var(--spacing-600)",
    iconSize: "rm",
  },
};

const LOADER_ICON_SIZE_MAP: Record<ButtonSize, number> = {
  xs: 20,
  sm: 24,
  md: 24,
  lg: 32,
  xl: 40,
};

export function ButtonIcon({
  variant = "filled",
  size = "md",
  cornerRadius = 2,
  icon,
  loading = false,
  disabled = false,
  state: stateProp,
  color = "primary",
  type = "button",
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
}: ButtonIconProps) {
  const themeContext = useThemeSafe();
  const sizeConfig = SIZE_CONFIG[size];
  const borderRadius = CORNER_RADIUS_MAP[cornerRadius];

  const [internalState, setInternalState] = useState<ButtonState>("default");
  const state = stateProp ?? internalState;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && !stateProp) {
        setInternalState("hovered");
      }
      onMouseEnter?.(e);
    },
    [disabled, loading, stateProp, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && !stateProp) {
        setInternalState("default");
      }
      onMouseLeave?.(e);
    },
    [disabled, loading, stateProp, onMouseLeave]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && !stateProp) {
        setInternalState("focused");
      }
      onFocus?.(e);
    },
    [disabled, loading, stateProp, onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && !stateProp) {
        setInternalState("default");
      }
      onBlur?.(e);
    },
    [disabled, loading, stateProp, onBlur]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && !stateProp) {
        setInternalState("pressed");
      }
      onMouseDown?.(e);
    },
    [disabled, loading, stateProp, onMouseDown]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading && !stateProp) {
        setInternalState("hovered");
      }
      onMouseUp?.(e);
    },
    [disabled, loading, stateProp, onMouseUp]
  );

  const isDisabled = disabled;
  const isLoading = loading;
  const currentState: ButtonState = isDisabled ? "default" : state;

  const buttonStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-secondary)",
      borderWidth: "var(--border-width-25)",
      borderStyle: "solid",
      borderColor: "transparent",
      borderRadius,
      cursor: (isDisabled || isLoading) ? "not-allowed" : "pointer",
      transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
      width: sizeConfig.height,
      height: sizeConfig.height,
      minWidth: sizeConfig.height,
      minHeight: sizeConfig.height,
      padding: sizeConfig.padding,
      opacity: isDisabled ? 0.6 : 1,
    };

    // Get color token prefixes based on color prop
    const colorPrefix = color === "primary" ? "primary" : color;
    const bgToken = `--bg-${colorPrefix}`;
    const bgTonalToken = `--bg-${colorPrefix}-tonal`;
    const bgHoverToken = `--bg-${colorPrefix}-on-hover`;
    const bgPressedToken = color === "primary" ? `--bg-${colorPrefix}-pressed` : `--bg-${colorPrefix}-on-hover`;
    const bgFocusedToken = color === "primary" ? `--bg-${colorPrefix}-on-focused` : `--bg-${colorPrefix}-on-hover`;
    const bgTonalHoverToken = color === "primary" ? `--bg-${colorPrefix}-tonal-on-hover` : `--bg-${colorPrefix}-tonal`;
    const fgToken = `--fg-${colorPrefix}`;
    const fgTonalToken = `--fg-${colorPrefix}-on-tonal`;
    const fgHoverToken = color === "primary" ? `--fg-${colorPrefix}-on-hover` : `--fg-${colorPrefix}`;
    const borderToken = `--border-${colorPrefix}`;
    const borderTonalToken = `--border-${colorPrefix}-tonal`;
    const borderHoverToken = color === "primary" ? `--border-${colorPrefix}-on-hover` : `--border-${colorPrefix}`;

    // Get base variant styles
    let variantStyles: React.CSSProperties = {};
    switch (variant) {
      case "filled":
        variantStyles = {
          backgroundColor: `var(${bgToken})`,
          color: "var(--fg-on-action)",
          borderColor: `var(${bgToken})`,
        };
        break;
      case "tonal":
        variantStyles = {
          backgroundColor: `var(${bgTonalToken})`,
          color: `var(${fgTonalToken})`,
          borderColor: `var(${borderTonalToken})`,
        };
        break;
      case "outline":
        variantStyles = {
          backgroundColor: "transparent",
          color: `var(${fgToken})`,
          borderColor: `var(${borderToken})`,
        };
        break;
      case "link":
        variantStyles = {
          backgroundColor: "transparent",
          color: `var(${fgToken})`,
          borderWidth: 0,
          borderStyle: "none",
          borderColor: "transparent",
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
    } else if (!isLoading && currentState === "hovered") {
      if (variant === "filled") {
        stateStyles.backgroundColor = `var(${bgHoverToken})`;
        stateStyles.borderColor = `var(${bgHoverToken})`;
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = `var(${bgTonalHoverToken})`;
      } else if (variant === "outline") {
        stateStyles.borderColor = `var(${borderHoverToken})`;
      } else if (variant === "link") {
        stateStyles.color = `var(${fgHoverToken})`;
      }
    } else if (!isLoading && currentState === "pressed") {
      if (variant === "filled") {
        stateStyles.backgroundColor = `var(${bgPressedToken})`;
        stateStyles.borderColor = `var(${bgPressedToken})`;
      } else if (variant === "tonal") {
        stateStyles.backgroundColor = `var(${bgTonalHoverToken})`;
      }
    } else if (!isLoading && currentState === "focused") {
      if (variant === "filled") {
        stateStyles.backgroundColor = `var(${bgFocusedToken})`;
        stateStyles.borderColor = `var(${bgFocusedToken})`;
      } else if (variant === "outline") {
        stateStyles.borderColor = `var(${borderToken})`;
      }
      stateStyles.outline = `2px solid var(${borderToken})`;
      stateStyles.outlineOffset = "2px";
    }

    return { ...baseStyles, ...variantStyles, ...stateStyles, ...style };
  }, [variant, sizeConfig, borderRadius, currentState, isDisabled, isLoading, color, style]);

  // Clone icon with the correct size based on button size
  const iconSize = sizeConfig.iconSize;
  const clonedIcon = icon && isValidElement(icon)
    ? cloneElement(icon, { size: iconSize } as any)
    : icon;

  const showIcon = !loading && clonedIcon;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    },
    [isDisabled, isLoading, onClick]
  );

  return (
    <button
      ref={ref}
      type={type}
      className={className}
      style={{ ...buttonStyles, position: loading ? "relative" : undefined }}
      disabled={isDisabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...rest}
    >
      {loading ? (
        <>
          {/* Preserve original content width when loading by keeping it invisible but in flow */}
          {icon && (
            <span style={{ visibility: "hidden", display: "inline-flex", alignItems: "center" }}>
              {clonedIcon}
            </span>
          )}
          {/* Position loader absolutely in center */}
          <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <LoaderIcon size={LOADER_ICON_SIZE_MAP[size]} className="ds-button-loading-spinner" />
          </span>
        </>
      ) : (
        showIcon && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            {clonedIcon}
          </span>
        )
      )}
    </button>
  );
}

