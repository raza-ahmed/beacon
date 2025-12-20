"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon, MinusDashIcon } from "./icons";

type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxPreviewProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  size?: CheckboxSize;
  theme?: Theme;
  hue?: HueVariant;
}

const SIZE_CONFIG: Record<
  CheckboxSize,
  {
    boxSize: string;
    iconSize: number;
    fontSize: string;
    lineHeight: string;
  }
> = {
  sm: {
    boxSize: "16px",
    iconSize: 12, // 16px box - 4px padding (2px each side) = 12px
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
  },
  md: {
    boxSize: "20px",
    iconSize: 16, // 20px box - 4px padding (2px each side) = 16px
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
  },
  lg: {
    boxSize: "24px",
    iconSize: 20, // 24px box - 4px padding (2px each side) = 20px
    fontSize: "var(--body-regular-text-size)",
    lineHeight: "var(--body-regular-line-height)",
  },
};

export function CheckboxPreview({
  checked = false,
  indeterminate = false,
  disabled = false,
  label = "Select Me",
  size = "md",
  theme,
  hue,
}: CheckboxPreviewProps) {
  const sizeConfig = SIZE_CONFIG[size];

  const checkboxStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      width: sizeConfig.boxSize,
      height: sizeConfig.boxSize,
      borderRadius: "var(--corner-radius-100)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "background-color 0.15s ease, border-color 0.15s ease",
      boxSizing: "border-box",
      overflow: "hidden",
    };

    if (disabled) {
      if (checked || indeterminate) {
        // Disabled checked/indeterminate
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-disabled)",
          border: "none",
        };
      } else {
        // Disabled unchecked
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-primary)",
          border: "var(--border-width-50) solid var(--border-neutral-tertiary)",
        };
      }
    }

    if (checked || indeterminate) {
      // Checked or indeterminate
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-primary)",
        border: "none",
        padding: "var(--spacing-50)",
      };
    } else {
      // Unchecked
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-primary)",
        border: "var(--border-width-50) solid var(--border-neutral-secondary)",
      };
    }
  }, [checked, indeterminate, disabled, sizeConfig.boxSize]);

  const iconColor = useMemo(() => {
    if (disabled) {
      return "var(--fg-on-disabled)";
    }
    return "var(--static-white)";
  }, [disabled]);

  const labelStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      fontFamily: "var(--font-secondary)",
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontWeight: "var(--font-weight-secondary-medium)",
      margin: 0,
    };

    if (disabled) {
      return {
        ...baseStyles,
        color: "var(--fg-on-disabled)",
      };
    }

    if (checked || indeterminate) {
      return {
        ...baseStyles,
        color: "var(--fg-neutral-secondary)",
      };
    }

    return {
      ...baseStyles,
      color: "var(--fg-neutral-tertiary)",
    };
  }, [disabled, checked, indeterminate, sizeConfig]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-200)",
      }}
    >
      <div style={checkboxStyles}>
        {checked && !indeterminate && (
          <div
            style={{
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: `${sizeConfig.iconSize}px`,
              height: `${sizeConfig.iconSize}px`,
              maxWidth: `${sizeConfig.iconSize}px`,
              maxHeight: `${sizeConfig.iconSize}px`,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <CheckIcon size={sizeConfig.iconSize} />
          </div>
        )}
        {indeterminate && (
          <div
            style={{
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: `${sizeConfig.iconSize}px`,
              height: `${sizeConfig.iconSize}px`,
              maxWidth: `${sizeConfig.iconSize}px`,
              maxHeight: `${sizeConfig.iconSize}px`,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <MinusDashIcon size={sizeConfig.iconSize} />
          </div>
        )}
      </div>
      {label && (
        <p style={labelStyles}>{label}</p>
      )}
    </div>
  );
}

