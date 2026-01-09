"use client";

import { useMemo, useState } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { UserPersonIcon, SearchIcon, CloseIcon, AlertTriangleErrorIcon } from "./icons";
import type { CornerRadiusStep } from "beacon-ui";

type InputSize = "sm" | "md" | "lg" | "xl";
type InputStatus = "default" | "hover" | "active" | "error" | "disabled";

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
  showNumberPrefix?: boolean;
  cornerRadius?: CornerRadiusStep;
  iconOnly?: boolean;
  disabled?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  width?: string;
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
  xl: {
    height: "56px",
    iconSize: 24,
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
  showNumberPrefix = false,
  cornerRadius = 1,
  iconOnly = false,
  disabled = false,
  theme,
  hue,
  width,
}: InputPreviewProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const hasValue = value.length > 0;
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
      borderRadius: CORNER_RADIUS_MAP[cornerRadius],
      gap: sizeConfig.gap,
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
      width: iconOnly ? (width || sizeConfig.height) : (width || "100%"),
      height: iconOnly ? sizeConfig.height : sizeConfig.height,
      justifyContent: iconOnly ? "center" : "flex-start",
      cursor: isDisabled ? "not-allowed" : "text",
      opacity: isDisabled ? 0.6 : 1,
      transition: "border-color 0.15s ease",
    };

    return baseStyles;
  }, [sizeConfig, borderColor, cornerRadius, iconOnly, isDisabled, width]);

  const textStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontFamily: "var(--font-secondary)",
      color: hasValue
        ? "var(--fg-neutral)"
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
    if (isDisabled) {
      return borderColor;
    }
    if (status === "active" || status === "error") {
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
    let borderColor = "var(--border-strong-200)";
    if (status === "error") {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width: "fit-content" }}>
        <div 
          style={containerStylesWithHover}
          onMouseEnter={() => !isDisabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* When iconOnly is true, always show an icon (prefer placeholder icon, fallback to start icon, or default to search icon) */}
          <div style={{ color: "var(--fg-neutral)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {showPlaceholderIcon ? (
              <SearchIcon size={sizeConfig.iconSize} />
            ) : showStartIcon ? (
              <UserPersonIcon size={sizeConfig.iconSize} />
            ) : (
              <SearchIcon size={sizeConfig.iconSize} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width: width ? "fit-content" : "100%" }}>
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
        {(showEndIcon || hasValue) && (
          <div style={{ color: "var(--fg-neutral-tertiary)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseIcon size={sizeConfig.iconSize} />
          </div>
        )}
      </div>
      {status === "error" && (
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

