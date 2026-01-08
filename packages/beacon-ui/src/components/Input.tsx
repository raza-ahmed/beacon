"use client";

import { useMemo, useState, useCallback, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { UserPersonIcon, SearchIcon, AlertTriangleErrorIcon, CloseIcon } from "../icons";

export type InputSize = "sm" | "md" | "lg" | "xl";
export type InputStatus = "default" | "hover" | "active" | "error" | "disabled";

export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "size"> {
  label?: string;
  size?: InputSize;
  status?: InputStatus;
  showLabel?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholderIcon?: React.ReactNode;
  showError?: boolean;
  errorMessage?: string;
  numberPrefix?: string;
  rounded?: boolean;
  iconOnly?: boolean;
  borderRadius?: string;
  fullWidth?: boolean;
}

const SIZE_CONFIG: Record<
  InputSize,
  {
    height: string;
    iconSize: number;
    fontSize: string;
    lineHeight: string;
    labelFontSize: string;
    labelLineHeight: string;
    paddingX: string;
    paddingY: string;
    borderRadius: string;
    gap: string;
  }
> = {
  sm: {
    height: "28px",
    iconSize: 16,
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
    labelFontSize: "var(--body-extra-small-text-size)",
    labelLineHeight: "var(--body-extra-small-line-height)",
    paddingX: "var(--spacing-200)",
    paddingY: "var(--spacing-100)",
    borderRadius: "var(--corner-radius-100)",
    gap: "var(--spacing-100)",
  },
  md: {
    height: "36px",
    iconSize: 16,
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
    labelFontSize: "var(--body-small-text-size)",
    labelLineHeight: "var(--body-small-line-height)",
    paddingX: "var(--spacing-300)",
    paddingY: "var(--spacing-100)",
    borderRadius: "var(--corner-radius-100)",
    gap: "var(--spacing-100)",
  },
  lg: {
    height: "48px",
    iconSize: 20,
    fontSize: "var(--body-regular-text-size)",
    lineHeight: "var(--body-regular-line-height)",
    labelFontSize: "var(--body-regular-text-size)",
    labelLineHeight: "var(--body-regular-line-height)",
    paddingX: "var(--spacing-400)",
    paddingY: "var(--spacing-300)",
    borderRadius: "var(--corner-radius-200)",
    gap: "var(--spacing-200)",
  },
  xl: {
    height: "56px",
    iconSize: 24,
    fontSize: "var(--body-regular-text-size)",
    lineHeight: "var(--body-regular-line-height)",
    labelFontSize: "var(--body-regular-text-size)",
    labelLineHeight: "var(--body-regular-line-height)",
    paddingX: "var(--spacing-450)",
    paddingY: "var(--spacing-400)",
    borderRadius: "var(--corner-radius-200)",
    gap: "var(--spacing-200)",
  },
};

export function Input({
  label,
  size = "md",
  status = "default",
  showLabel = true,
  startIcon,
  endIcon,
  placeholderIcon,
  showError = false,
  errorMessage = "Error message!",
  numberPrefix,
  rounded = false,
  iconOnly = false,
  disabled = false,
  borderRadius,
  fullWidth = true,
  className,
  style,
  value,
  placeholder,
  ref,
  ...rest
}: InputProps) {
    useThemeSafe(); // Ensure theme context is available
    const sizeConfig = SIZE_CONFIG[size];
    const hasValue = value != null && String(value).length > 0;
    const isDisabled = disabled || status === "disabled";

    const borderColor = useMemo(() => {
      if (isDisabled) {
        return "var(--border-disabled)";
      }
      if (status === "error") {
        return "var(--border-critical)";
      }
      if (status === "active") {
        return "var(--border-primary)";
      }
      if (status === "hover") {
        return "var(--border-neutral-primary)";
      }
      return "var(--border-strong-200)";
    }, [status, isDisabled]);

    const inputContainerStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        border: `var(--border-width-25) solid ${borderColor}`,
        backgroundColor: "var(--bg-page-primary)",
        borderRadius: borderRadius || (rounded ? "var(--corner-radius-full)" : sizeConfig.borderRadius),
        gap: sizeConfig.gap,
        paddingLeft: sizeConfig.paddingX,
        paddingRight: sizeConfig.paddingX,
        paddingTop: sizeConfig.paddingY,
        paddingBottom: sizeConfig.paddingY,
        width: iconOnly ? sizeConfig.height : fullWidth ? "100%" : "fit-content",
        height: iconOnly ? sizeConfig.height : sizeConfig.height,
        justifyContent: iconOnly ? "center" : "flex-start",
        cursor: isDisabled ? "not-allowed" : "text",
        opacity: isDisabled ? 0.6 : 1,
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        position: "relative" as const,
      };

      return baseStyles;
    }, [sizeConfig, borderColor, rounded, borderRadius, iconOnly, isDisabled, fullWidth]);

    const labelStyles = useMemo(() => {
      return {
        fontSize: sizeConfig.labelFontSize,
        lineHeight: sizeConfig.labelLineHeight,
        fontFamily: "var(--font-secondary)",
        color: isDisabled ? "var(--fg-disabled)" : "var(--fg-neutral)",
      } as React.CSSProperties;
    }, [sizeConfig, isDisabled]);

    const prefixStyles = useMemo(() => {
      let borderColor = "var(--border-strong-200)";
      if (isDisabled) {
        borderColor = "var(--border-disabled)";
      } else if (status === "error") {
        borderColor = "var(--border-critical)";
      } else if (status === "active") {
        borderColor = "var(--border-primary)";
      } else if (status === "hover") {
        borderColor = "var(--border-neutral-primary)";
      }
      return {
        fontSize: sizeConfig.fontSize,
        lineHeight: sizeConfig.lineHeight,
        fontFamily: "var(--font-secondary)",
        color: "var(--fg-neutral-tertiary)",
        paddingRight: "var(--spacing-100)",
        borderRight: `var(--border-width-25) solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
      } as React.CSSProperties;
    }, [sizeConfig, status, isDisabled]);

    const errorContainerStyles = useMemo(() => {
      return {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-100)",
        marginTop: "var(--spacing-100)",
      } as React.CSSProperties;
    }, []);

    const errorIconStyles = useMemo(() => {
      return {
        color: "var(--fg-critical)",
        flexShrink: 0,
      } as React.CSSProperties;
    }, []);

    const errorMessageStyles = useMemo(() => {
      return {
        fontSize: "var(--body-extra-small-text-size)",
        lineHeight: "var(--body-extra-small-line-height)",
        fontFamily: "var(--font-secondary)",
        color: "var(--fg-critical)",
      } as React.CSSProperties;
    }, []);

    const inputStyles: React.CSSProperties = {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontFamily: "var(--font-secondary)",
      color: isDisabled ? "var(--fg-disabled)" : "var(--fg-neutral)",
      fontWeight: hasValue ? 500 : 400,
      flex: iconOnly || !fullWidth ? "none" : "1 0 0",
      minWidth: iconOnly ? "auto" : 0,
      minHeight: iconOnly ? "auto" : 0,
      border: "none",
      background: "transparent",
      outline: "none",
      padding: 0,
      width: fullWidth ? "100%" : "auto",
      caretColor: isDisabled ? "var(--fg-disabled)" : "var(--fg-primary)",
    };

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (!isDisabled) {
          setIsFocused(true);
        }
        rest.onFocus?.(e);
      },
      [isDisabled, rest]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        rest.onBlur?.(e);
      },
      [rest]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDisabled && rest.onChange) {
          const syntheticEvent = {
            target: { value: "" },
          } as React.ChangeEvent<HTMLInputElement>;
          rest.onChange(syntheticEvent);
        }
      },
      [isDisabled, rest]
    );

    const effectiveStatus = useMemo(() => {
      if (isDisabled) return status;
      if (status === "error") return status;
      if (isFocused) return "active";
      return status;
    }, [status, isDisabled, isFocused]);

    const hoverBorderColor = useMemo(() => {
      if (isDisabled) {
        return borderColor;
      }
      if (status === "error") {
        return borderColor;
      }
      if (isFocused || status === "active") {
        return "var(--border-primary)";
      }
      if (status === "hover") {
        return borderColor;
      }
      return isHovered ? "var(--border-neutral-primary)" : borderColor;
    }, [isDisabled, status, isHovered, isFocused, borderColor]);

    const containerStylesWithHover = useMemo(() => {
      return {
        ...inputContainerStyles,
        border: `var(--border-width-25) solid ${hoverBorderColor}`,
        ...(isFocused && !isDisabled && status !== "error" ? {
          boxShadow: `0 0 0 2px rgba(5, 109, 255, 0.2)`,
        } : {}),
      };
    }, [inputContainerStyles, hoverBorderColor, isFocused, isDisabled, status]);

    if (iconOnly) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width: fullWidth ? "100%" : "fit-content" }}>
          <div 
            style={containerStylesWithHover}
            onMouseEnter={() => !isDisabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {placeholderIcon && (
              <div style={{ color: "var(--fg-neutral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {placeholderIcon}
              </div>
            )}
            {startIcon && !placeholderIcon && (
              <div style={{ color: "var(--fg-neutral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {startIcon}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width: fullWidth ? "100%" : "fit-content" }}>
        {showLabel && label && (
          <label htmlFor={rest.id} style={labelStyles}>
            {label}
          </label>
        )}
        <div
          style={containerStylesWithHover}
          onMouseEnter={() => !isDisabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {startIcon && (
            <div style={{ color: "var(--fg-neutral)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {startIcon}
            </div>
          )}
          {placeholderIcon && !hasValue && (
            <div style={{ color: iconOnly ? "var(--fg-neutral)" : "var(--fg-disabled)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {placeholderIcon}
            </div>
          )}
          {numberPrefix && (
            <div style={prefixStyles}>{numberPrefix}</div>
          )}
          <input
            ref={ref}
            type="text"
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={value != null && !rest.onChange}
            className={className}
            style={{ ...inputStyles, ...style }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          <style>{`
            input[type="text"]::placeholder {
              color: var(--fg-disabled) !important;
              opacity: 1;
            }
            input[type="text"]:disabled::placeholder {
              color: var(--fg-disabled) !important;
              opacity: 1;
            }
            input[type="text"]:not(:placeholder-shown) {
              color: var(--fg-neutral) !important;
            }
            input[type="text"]:disabled:not(:placeholder-shown) {
              color: var(--fg-disabled) !important;
            }
            input[type="text"]:placeholder-shown:not(:disabled) {
              color: transparent !important;
            }
            input[type="text"]:not(:disabled) {
              caret-color: var(--fg-primary) !important;
            }
            input[type="text"]:disabled {
              caret-color: var(--fg-disabled) !important;
            }
          `}</style>
          {(endIcon || hasValue) && (
            <div 
              onClick={!endIcon && hasValue && rest.onChange ? handleClear : undefined}
              style={{ 
                color: "var(--fg-neutral-tertiary)", 
                flexShrink: 0, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: !endIcon && hasValue && rest.onChange ? "pointer" : "default",
                transition: "color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!endIcon && hasValue && rest.onChange) {
                  e.currentTarget.style.color = "var(--fg-neutral)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!endIcon && hasValue && rest.onChange) {
                  e.currentTarget.style.color = "var(--fg-neutral-tertiary)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {endIcon || <CloseIcon size={sizeConfig.iconSize} />}
            </div>
          )}
        </div>
        {status === "error" && (
          <div style={errorContainerStyles}>
            <div style={{ ...errorIconStyles, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangleErrorIcon size={16} />
            </div>
            <p style={errorMessageStyles}>{errorMessage}</p>
          </div>
        )}
      </div>
    );
}
