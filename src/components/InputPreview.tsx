"use client";

import { useMemo, useState } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { UserPersonIcon, SearchIcon, ChevronDownIcon, AlertTriangleErrorIcon } from "./icons";

type InputSize = "sm" | "md" | "lg";
type InputStatus = "default" | "active" | "disabled";

interface InputPreviewProps {
  label?: string;
  placeholder?: string;
  value?: string;
  size?: InputSize;
  status?: InputStatus;
  showLabel?: boolean;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showPlaceholderIcon?: boolean;
  showError?: boolean;
  showNumberPrefix?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
  theme?: Theme;
  hue?: HueVariant;
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
    paddingY: "var(--spacing-100)",
    borderRadius: "var(--corner-radius-100)",
    gap: "var(--spacing-100)",
  },
  lg: {
    height: "48px",
    iconSize: 20,
    fontSize: "var(--fonts-body-regular-text-size)",
    lineHeight: "var(--fonts-body-regular-line-height)",
    labelFontSize: "var(--fonts-body-regular-text-size)",
    labelLineHeight: "var(--fonts-body-regular-line-height)",
    paddingX: "var(--spacing-400)",
    paddingY: "var(--spacing-300)",
    borderRadius: "var(--corner-radius-200)",
    gap: "var(--spacing-200)",
  },
};

export function InputPreview({
  label = "Label",
  placeholder = "Placeholder",
  value = "",
  size = "md",
  status = "default",
  showLabel = true,
  showStartIcon = false,
  showEndIcon = false,
  showPlaceholderIcon = false,
  showError = false,
  showNumberPrefix = false,
  rounded = false,
  iconOnly = false,
  disabled = false,
  theme,
  hue,
}: InputPreviewProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const hasValue = value.length > 0;
  const isDisabled = disabled || status === "disabled";

  const borderColor = useMemo(() => {
    if (isDisabled) {
      return "var(--border-strong-100)";
    }
    if (status === "active") {
      return "var(--border-primary)";
    }
    return "var(--border-strong-200)";
  }, [status, isDisabled]);

  const inputContainerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      border: `var(--border-width-25) solid ${borderColor}`,
      backgroundColor: "var(--bg-page-primary)",
      borderRadius: rounded ? "var(--corner-radius-full)" : sizeConfig.borderRadius,
      gap: sizeConfig.gap,
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
      width: iconOnly ? sizeConfig.height : "100%",
      height: iconOnly ? sizeConfig.height : sizeConfig.height,
      justifyContent: iconOnly ? "center" : "flex-start",
      cursor: isDisabled ? "not-allowed" : "text",
      opacity: isDisabled ? 0.6 : 1,
      transition: "border-color 0.15s ease",
    };

    return baseStyles;
  }, [sizeConfig, borderColor, rounded, iconOnly, isDisabled]);

  const textStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontFamily: "var(--font-secondary)",
      color: hasValue
        ? "var(--fg-neutral-secondary)"
        : isDisabled
        ? "var(--fg-disabled)"
        : "var(--fg-disabled)",
      fontWeight: hasValue ? 500 : 400,
      flex: iconOnly ? "none" : "1 0 0",
      minWidth: iconOnly ? "auto" : 0,
      minHeight: iconOnly ? "auto" : 0,
    } as React.CSSProperties;
  }, [sizeConfig, hasValue, isDisabled, iconOnly]);

  const labelStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.labelFontSize,
      lineHeight: sizeConfig.labelLineHeight,
      fontFamily: "var(--font-secondary)",
      color: isDisabled ? "var(--fg-disabled)" : "var(--fg-neutral)",
      marginBottom: "var(--spacing-100)",
    } as React.CSSProperties;
  }, [sizeConfig, isDisabled]);

  const [isHovered, setIsHovered] = useState(false);

  const hoverBorderColor = useMemo(() => {
    if (isDisabled || status === "active") {
      return borderColor;
    }
    return isHovered ? "var(--border-neutral-primary)" : borderColor;
  }, [isDisabled, status, isHovered, borderColor]);

  const containerStylesWithHover = useMemo(() => {
    return {
      ...inputContainerStyles,
      border: `var(--border-width-25) solid ${hoverBorderColor}`,
    };
  }, [inputContainerStyles, hoverBorderColor]);

  const prefixStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontFamily: "var(--font-secondary)",
      color: "var(--fg-neutral-tertiary)",
      paddingRight: "var(--spacing-100)",
      borderRight: `var(--border-width-25) solid ${status === "active" ? "var(--border-strong-100)" : "var(--border-strong-200)"}`,
      display: "flex",
      alignItems: "center",
    } as React.CSSProperties;
  }, [sizeConfig, status]);

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
      fontSize: "var(--fonts-body-extra-small-text-size)",
      lineHeight: "var(--fonts-body-extra-small-line-height)",
      fontFamily: "var(--font-secondary)",
      color: "var(--fg-critical)",
    } as React.CSSProperties;
  }, []);

  if (iconOnly) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width: "100%" }}>
        <div 
          style={containerStylesWithHover}
          onMouseEnter={() => !isDisabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {showPlaceholderIcon && (
            <div style={{ color: "var(--fg-neutral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SearchIcon size={sizeConfig.iconSize} />
            </div>
          )}
          {showStartIcon && !showPlaceholderIcon && (
            <div style={{ color: "var(--fg-neutral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserPersonIcon size={sizeConfig.iconSize} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width: "fit-content" }}>
      {showLabel && (
        <p style={labelStyles}>{label}</p>
      )}
      <div 
        style={containerStylesWithHover}
        onMouseEnter={() => !isDisabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showStartIcon && (
          <div style={{ color: "var(--fg-neutral)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserPersonIcon size={sizeConfig.iconSize} />
          </div>
        )}
        {showPlaceholderIcon && !hasValue && (
          <div style={{ color: iconOnly ? "var(--fg-neutral)" : (isDisabled ? "var(--fg-disabled)" : "var(--fg-disabled)"), flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SearchIcon size={sizeConfig.iconSize} />
          </div>
        )}
        {showNumberPrefix && (
          <div style={prefixStyles}>+33</div>
        )}
        {hasValue ? (
          <p style={textStyles}>{value}</p>
        ) : (
          <p style={textStyles}>{placeholder}</p>
        )}
        {showEndIcon && (
          <div style={{ color: "var(--fg-neutral-tertiary)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronDownIcon size={sizeConfig.iconSize} />
          </div>
        )}
      </div>
      {showError && (
        <div style={errorContainerStyles}>
          <div style={{ ...errorIconStyles, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangleErrorIcon size={16} />
          </div>
          <p style={errorMessageStyles}>Error message!</p>
        </div>
      )}
    </div>
  );
}

