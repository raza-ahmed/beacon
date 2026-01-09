"use client";

import React, { useMemo, useState, useRef, useEffect, useId, ComponentPropsWithoutRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { ChevronDownIcon, CheckIcon, UserPersonIcon } from "../icons";
import type { CornerRadiusStep } from "./Button";

export type SelectSize = "sm" | "md" | "lg" | "xl";
export type SelectStatus = "default" | "hover" | "active" | "disabled";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"button">, "size" | "onClick" | "onSelect"> {
  label?: string;
  size?: SelectSize;
  status?: SelectStatus;
  showLabel?: boolean;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  selectedValue?: string;
  options?: SelectOption[];
  onSelect?: (value: string) => void;
  fullWidth?: boolean;
  cornerRadius?: CornerRadiusStep;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SIZE_CONFIG: Record<
  SelectSize,
  {
    height: string;
    iconSize: number | "sm" | "rg";
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
    fontSize: "var(--fonts-body-small-text-size)",
    lineHeight: "var(--fonts-body-small-line-height)",
    labelFontSize: "var(--fonts-body-extra-small-text-size)",
    labelLineHeight: "var(--fonts-body-extra-small-line-height)",
    paddingX: "var(--spacing-200)",
    paddingY: "var(--spacing-100)",
    borderRadius: "var(--corner-radius-100)",
    gap: "var(--spacing-100)",
  },
  md: {
    height: "36px",
    iconSize: 16,
    fontSize: "var(--fonts-body-small-text-size)",
    lineHeight: "var(--fonts-body-small-line-height)",
    labelFontSize: "var(--fonts-body-small-text-size)",
    labelLineHeight: "var(--fonts-body-small-line-height)",
    paddingX: "var(--spacing-300)",
    paddingY: "var(--spacing-200)",
    borderRadius: "var(--corner-radius-100)",
    gap: "var(--spacing-100)",
  },
  lg: {
    height: "48px",
    iconSize: "sm",
    fontSize: "var(--fonts-body-regular-text-size)",
    lineHeight: "var(--fonts-body-regular-line-height)",
    labelFontSize: "var(--fonts-body-regular-text-size)",
    labelLineHeight: "var(--fonts-body-regular-line-height)",
    paddingX: "var(--spacing-400)",
    paddingY: "var(--spacing-300)",
    borderRadius: "var(--corner-radius-100)",
    gap: "var(--spacing-200)",
  },
  xl: {
    height: "56px",
    iconSize: "rg",
    fontSize: "var(--fonts-body-regular-text-size)",
    lineHeight: "var(--fonts-body-regular-line-height)",
    labelFontSize: "var(--fonts-body-regular-text-size)",
    labelLineHeight: "var(--fonts-body-regular-line-height)",
    paddingX: "var(--spacing-450)",
    paddingY: "var(--spacing-400)",
    borderRadius: "var(--corner-radius-200)",
    gap: "var(--spacing-200)",
  },
};

export function Select({
  label,
  size = "md",
  status: statusProp,
  showLabel = true,
  showStartIcon = true,
  showEndIcon = true,
  startIcon,
  endIcon,
  selectedValue,
  options = [],
  onSelect,
  fullWidth = true,
  cornerRadius,
  className,
  style,
  id,
  ...rest
}: SelectProps) {
  useThemeSafe();
  const sizeConfig = SIZE_CONFIG[size];
  const [isOpen, setIsOpen] = useState(false);
  const [internalStatus, setInternalStatus] = useState<SelectStatus>("default");
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  // Use controlled status if provided, otherwise use internal state
  const status = statusProp ?? (isOpen ? "active" : internalStatus);

  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === selectedValue);
  }, [options, selectedValue]);

  const displayText = selectedOption?.label || "Selected Item";

  const borderColor = useMemo(() => {
    if (status === "disabled") {
      return "var(--border-disabled)";
    }
    if (status === "active") {
      return "var(--border-primary)";
    }
    if (status === "hover") {
      return "var(--border-neutral-primary)";
    }
    return "var(--border-strong-200)";
  }, [status]);

  const containerStyles = useMemo(() => {
    const borderRadius = cornerRadius !== undefined 
      ? CORNER_RADIUS_MAP[cornerRadius] 
      : sizeConfig.borderRadius;
    
    return {
      display: "flex",
      alignItems: "center",
      border: `var(--border-width-25) solid ${borderColor}`,
      backgroundColor: "var(--bg-page-primary)",
      borderRadius,
      gap: sizeConfig.gap,
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
      width: fullWidth ? "100%" : "fit-content",
      height: sizeConfig.height,
      cursor: status === "disabled" ? "not-allowed" : "pointer",
      transition: "border-color 0.15s ease",
      opacity: status === "disabled" ? 0.6 : 1,
    } as React.CSSProperties;
  }, [sizeConfig, borderColor, fullWidth, cornerRadius]);

  const labelStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.labelFontSize,
      lineHeight: sizeConfig.labelLineHeight,
      fontFamily: "var(--font-secondary)",
      color: status === "disabled" ? "var(--fg-disabled)" : "var(--fg-neutral)",
    } as React.CSSProperties;
  }, [sizeConfig, status]);

  const textStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontFamily: "var(--font-secondary)",
      color: status === "disabled" ? "var(--fg-disabled)" : "var(--fg-neutral-secondary)",
      flex: "1 0 0",
      minWidth: 0,
      textAlign: "left" as const,
    } as React.CSSProperties;
  }, [sizeConfig, status]);

  const handleClick = () => {
    if (status === "disabled") return;
    if (!statusProp) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: string) => {
    onSelect?.(value);
    if (!statusProp) {
      setIsOpen(false);
      setInternalStatus("default");
    }
  };

  const handleMouseEnter = () => {
    if (status === "disabled") return;
    if (!statusProp && !isOpen) {
      setInternalStatus("hover");
    }
  };

  const handleMouseLeave = () => {
    if (!statusProp && !isOpen) {
      setInternalStatus("default");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        if (!statusProp) {
          setIsOpen(false);
          setInternalStatus("default");
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, statusProp]);

  const dropdownStyles = useMemo(() => {
    if (!isOpen && status !== "active") return { display: "none" };

    const baseStyles: React.CSSProperties = {
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      marginTop: "var(--spacing-100)",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-page-primary)",
      border: "var(--border-width-25) solid var(--border-strong-100)",
      borderRadius: cornerRadius !== undefined 
        ? CORNER_RADIUS_MAP[cornerRadius] 
        : sizeConfig.borderRadius,
      overflow: "hidden",
      zIndex: 9999,
    };

    return baseStyles;
  }, [isOpen, status, sizeConfig, cornerRadius]);

  const getOptionStyles = (isSelected: boolean, isHovered: boolean, isLast: boolean, isFirst: boolean): React.CSSProperties => {
    // Border radius for dropdown items: use corner-radius-200 for lg/xl, otherwise use sizeConfig.borderRadius
    const itemBorderRadius = (size === "lg" || size === "xl") 
      ? "var(--corner-radius-200)" 
      : (cornerRadius !== undefined ? CORNER_RADIUS_MAP[cornerRadius] : sizeConfig.borderRadius);

    // Padding based on size
    let padding: string;
    if (size === "sm") {
      padding = "var(--spacing-200)"; // 8px all around
    } else if (size === "md") {
      padding = "var(--spacing-300) var(--spacing-200)"; // 12px vertical, 8px horizontal
    } else {
      // lg and xl
      padding = "var(--spacing-400) var(--spacing-300)"; // 16px vertical, 12px horizontal
    }

    // Gap based on size
    const gap = size === "sm" ? "var(--spacing-100)" : "var(--spacing-200)";

    // Font size and line height based on size
    let fontSize: string;
    let lineHeight: string;
    if (size === "sm") {
      fontSize = "var(--fonts-body-extra-small-text-size)";
      lineHeight = "var(--fonts-body-extra-small-line-height)";
    } else if (size === "md") {
      fontSize = "var(--fonts-body-small-text-size)";
      lineHeight = "var(--fonts-body-small-line-height)";
    } else {
      // lg and xl
      fontSize = "var(--fonts-body-regular-text-size)";
      lineHeight = "var(--fonts-body-regular-line-height)";
    }

    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap,
      padding,
      cursor: "pointer",
      border: "none",
      borderTop: isFirst ? "var(--border-width-25) solid var(--border-strong-100)" : "none",
      borderLeft: "var(--border-width-25) solid var(--border-strong-100)",
      borderRight: "var(--border-width-25) solid var(--border-strong-100)",
      borderBottom: isLast ? "var(--border-width-25) solid var(--border-strong-100)" : "var(--border-width-25) solid var(--border-strong-100)",
      borderTopLeftRadius: isFirst ? itemBorderRadius : 0,
      borderTopRightRadius: isFirst ? itemBorderRadius : 0,
      borderBottomLeftRadius: isLast ? itemBorderRadius : 0,
      borderBottomRightRadius: isLast ? itemBorderRadius : 0,
      backgroundColor: isSelected ? "var(--bg-primary-tonal)" : "var(--bg-page-primary)",
      color: isSelected ? "var(--fg-primary-on-tonal)" : "var(--fg-neutral-tertiary)",
      fontFamily: "var(--font-secondary)",
      fontSize,
      lineHeight,
      transition: "background-color 0.15s ease, color 0.15s ease",
    };

    if (isHovered && !isSelected) {
      baseStyles.backgroundColor = "var(--bg-page-secondary)";
    }

    return baseStyles;
  };

  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div
      ref={selectRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-100)",
        width: fullWidth ? "100%" : "fit-content",
        position: "relative",
        overflow: "visible",
      }}
    >
      {showLabel && label && (
        <label htmlFor={selectId} style={labelStyles}>{label}</label>
      )}
      <button
        id={selectId}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ ...containerStyles, ...style }}
        className={className}
        aria-expanded={isOpen || status === "active"}
        aria-haspopup="listbox"
        aria-disabled={status === "disabled"}
        aria-labelledby={showLabel && label ? undefined : undefined}
        disabled={status === "disabled"}
        {...rest}
      >
        {showStartIcon && (
          <div 
            style={{ 
              color: status === "disabled" ? "var(--fg-disabled)" : "var(--fg-neutral)", 
              flexShrink: 0, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
            }}
          >
            {startIcon ? (
              React.isValidElement(startIcon) 
                ? React.cloneElement(startIcon as React.ReactElement<any>, { size: sizeConfig.iconSize })
                : startIcon
            ) : (
              <UserPersonIcon size={sizeConfig.iconSize} />
            )}
          </div>
        )}
        <span style={textStyles}>{displayText}</span>
        {showEndIcon && (
          <div
            style={{
              color: status === "disabled" ? "var(--fg-disabled)" : "var(--fg-neutral-tertiary)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: isOpen || status === "active" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
            }}
          >
            {endIcon ? (
              React.isValidElement(endIcon) 
                ? React.cloneElement(endIcon as React.ReactElement<any>, { size: sizeConfig.iconSize })
                : endIcon
            ) : (
              <ChevronDownIcon size={sizeConfig.iconSize} />
            )}
          </div>
        )}
      </button>
      {(isOpen || status === "active") && status !== "disabled" && options.length > 0 && (
        <div style={dropdownStyles} role="listbox">
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isHovered = hoveredOptionIndex === index;
            const isLast = index === options.length - 1;
            const isFirst = index === 0;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                style={{
                  ...getOptionStyles(isSelected, isHovered, isLast, isFirst),
                  touchAction: "manipulation", // Allow touch scrolling while still enabling taps
                }}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setHoveredOptionIndex(index)}
                onMouseLeave={() => setHoveredOptionIndex(null)}
              >
                {option.icon && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: size === "sm" || size === "md" ? "16px" : "20px",
                      height: size === "sm" || size === "md" ? "16px" : "20px",
                      flexShrink: 0,
                      color: isSelected ? "var(--fg-primary-on-tonal)" : "var(--fg-neutral-tertiary)",
                    }}
                  >
                    {option.icon}
                  </div>
                )}
                <span style={{ flex: "1 0 0", minWidth: 0, textAlign: "left" }}>{option.label}</span>
                {isSelected && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: size === "sm" || size === "md" ? "16px" : "20px",
                      height: size === "sm" || size === "md" ? "16px" : "20px",
                      flexShrink: 0,
                      color: "var(--fg-primary-on-tonal)",
                    }}
                  >
                    <CheckIcon size={size === "sm" || size === "md" ? 16 : 20} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

