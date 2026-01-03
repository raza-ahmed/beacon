"use client";

import { useMemo, useState, useCallback, ComponentPropsWithRef, cloneElement, isValidElement } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { LoaderIcon } from "../icons";

export type ButtonVariant = "filled" | "tonal" | "outline" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;
export type JustifyContent = "center" | "space-between";
export type ButtonState = "default" | "hovered" | "focused" | "pressed";
export type ButtonColor = "primary" | "success" | "critical" | "warning";

export interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  cornerRadius?: CornerRadiusStep;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fillContainer?: boolean;
  justifyContent?: JustifyContent;
  loading?: boolean;
  state?: ButtonState;
  color?: ButtonColor;
  type?: "button" | "submit" | "reset";
  underline?: boolean;
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
    iconSize: "xs" | "sm" | "rg" | "md" | "rm";
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
    iconSize: "sm",
  },
  lg: {
    height: "56px",
    paddingX: "var(--spacing-500)",
    paddingY: "var(--spacing-300)",
    fontSize: "var(--body-medium-text-size)",
    iconSize: "rg",
  },
  xl: {
    height: "68px",
    paddingX: "var(--spacing-600)",
    paddingY: "var(--spacing-400)",
    fontSize: "var(--body-medium-text-size)",
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
  state: stateProp,
  color = "primary",
  type = "button",
  underline,
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
        display: justifyContent === "space-between" ? "flex" : "inline-flex", // Use flex (block-level) for space-between to ensure full width
        alignItems: "center",
        justifyContent: justifyContent === "space-between" ? "flex-start" : justifyContent, // Use flex-start for space-between, let contentLayout handle distribution
        gap: justifyContent === "space-between" ? "0" : "var(--spacing-100)", // Remove gap for space-between, use spacing-100 for center layout
        textAlign: justifyContent === "space-between" ? "left" : undefined, // Align text to left when space-between is used
        fontFamily: "var(--font-secondary)",
        fontSize: sizeConfig.fontSize,
        lineHeight: "1",
        fontWeight: "var(--font-weight-secondary-medium)",
        borderWidth: "var(--border-width-25)",
        borderStyle: "solid",
        borderColor: "transparent",
        borderRadius,
        cursor: (isDisabled || isLoading) ? "not-allowed" : "pointer",
        transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        minHeight: sizeConfig.height,
        paddingLeft: sizeConfig.paddingX,
        paddingRight: sizeConfig.paddingX,
        paddingTop: sizeConfig.paddingY,
        paddingBottom: sizeConfig.paddingY,
        width: fillContainer || justifyContent === "space-between" ? "100%" : "auto", // Full width when space-between is used
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
      // For non-primary colors, use the base border token for hover since there's no specific hover border token

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
            textDecoration: underline !== false ? "underline" : "none",
            textUnderlineOffset: underline !== false ? "2px" : undefined,
          };
          break;
      }

      // Apply state-specific overrides
      // When loading, preserve variant colors and don't apply state-specific styles
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
    }, [variant, sizeConfig, borderRadius, fillContainer, justifyContent, currentState, isDisabled, isLoading, color, underline, style]);

    // Clone icons with the correct size based on button size
    const iconSize = sizeConfig.iconSize;
    const clonedStartIcon = startIcon && isValidElement(startIcon)
      ? cloneElement(startIcon, { size: iconSize } as any)
      : startIcon;
    const clonedEndIcon = endIcon && isValidElement(endIcon)
      ? cloneElement(endIcon, { size: iconSize } as any)
      : endIcon;

    const showStartIcon = !loading && clonedStartIcon;
    const showEndIcon = !loading && clonedEndIcon;

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

    // For space-between layout, group start icon and text together on the left,
    // with end icon on the right. The wrapper spans full width to ensure proper distribution.
    // The left group uses flex: 1 to take up available space, ensuring text aligns left.
    // For center layout, all items are centered together.
    // Note: To swap text and icons (e.g., text before startIcon), simply reorder
    // the JSX elements in the contentLayout below.
    const contentLayout = justifyContent === "space-between" ? (
      <span style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "var(--spacing-100)", flex: "1 1 0%", minWidth: 0, width: 0 }}>
          {showStartIcon && <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>{clonedStartIcon}</span>}
          <span style={{ flex: "1 1 0%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: showStartIcon ? "0" : undefined }}>{children}</span>
        </span>
        {showEndIcon && <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0, marginLeft: "var(--spacing-100)" }}>{clonedEndIcon}</span>}
      </span>
    ) : (
      <>
        {showStartIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{clonedStartIcon}</span>}
        {children}
        {showEndIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{clonedEndIcon}</span>}
      </>
    );

    // Create invisible content that matches the actual layout structure to preserve width when loading
    // This ensures the button maintains its original size when transitioning to loading state
    const invisibleContent = justifyContent === "space-between" ? (
      <span style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", visibility: "hidden" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "var(--spacing-100)", flex: "1 1 0%", minWidth: 0, width: 0 }}>
          {startIcon && <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>{clonedStartIcon}</span>}
          <span style={{ flex: "1 1 0%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: startIcon ? "0" : undefined }}>{children}</span>
        </span>
        {endIcon && <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0, marginLeft: "var(--spacing-100)" }}>{clonedEndIcon}</span>}
      </span>
    ) : (
      <span style={{ visibility: "hidden", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "var(--spacing-100)" }}>
        {startIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{clonedStartIcon}</span>}
        {children}
        {endIcon && <span style={{ display: "inline-flex", alignItems: "center" }}>{clonedEndIcon}</span>}
      </span>
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
            {invisibleContent}
            {/* Position loader absolutely in center */}
            <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <LoaderIcon size={LOADER_ICON_SIZE_MAP[size]} className="ds-button-loading-spinner" />
            </span>
          </>
        ) : (
          contentLayout
        )}
      </button>
    );
}
