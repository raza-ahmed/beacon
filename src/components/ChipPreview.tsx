"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { ListDetailsIcon } from "./icons";

type ChipSize = "sm" | "md" | "lg";
type ChipColor = "primary" | "neutral" | "success" | "critical" | "warning";

interface ChipPreviewProps {
  label?: string;
  color?: ChipColor;
  size?: ChipSize;
  showBorders?: boolean;
  showIcon?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

const SIZE_CONFIG: Record<
  ChipSize,
  {
    iconSize: number;
    fontSize: string;
    lineHeight: string;
    paddingX: string;
    paddingY: string;
  }
> = {
  sm: {
    iconSize: 16,
    fontSize: "var(--fonts-body-extra-small-text-size)",
    lineHeight: "var(--fonts-body-extra-small-line-height)",
    paddingX: "var(--spacing-300)",
    paddingY: "var(--spacing-100)",
  },
  md: {
    iconSize: 20,
    fontSize: "var(--fonts-body-small-text-size)",
    lineHeight: "var(--fonts-body-small-line-height)",
    paddingX: "var(--spacing-400)",
    paddingY: "var(--spacing-200)",
  },
  lg: {
    iconSize: 24,
    fontSize: "var(--fonts-body-regular-text-size)",
    lineHeight: "var(--fonts-body-regular-line-height)",
    paddingX: "var(--spacing-450)",
    paddingY: "var(--spacing-200)",
  },
};

const COLOR_CONFIG: Record<
  ChipColor,
  {
    bg: string;
    fg: string;
    border: string;
  }
> = {
  primary: {
    bg: "var(--bg-primary-tonal)",
    fg: "var(--fg-primary-on-tonal)",
    border: "var(--border-primary)",
  },
  neutral: {
    bg: "var(--bg-page-tertiary)",
    fg: "var(--fg-neutral-tertiary)",
    border: "var(--border-neutral-primary)",
  },
  success: {
    bg: "var(--bg-success-tonal)",
    fg: "var(--fg-success-on-tonal)",
    border: "var(--border-success)",
  },
  critical: {
    bg: "var(--bg-critical-tonal)",
    fg: "var(--fg-critical-on-tonal)",
    border: "var(--border-critical)",
  },
  warning: {
    bg: "var(--bg-warning-tonal)",
    fg: "var(--fg-warning-on-tonal)",
    border: "var(--border-warning)",
  },
};

export function ChipPreview({
  label = "Identifier",
  color = "primary",
  size = "md",
  showBorders = false,
  showIcon = false,
  theme,
  hue,
}: ChipPreviewProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const colorConfig = COLOR_CONFIG[color];

  const chipStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      gap: "var(--spacing-200)",
      alignItems: "center",
      backgroundColor: colorConfig.bg,
      color: colorConfig.fg,
      borderRadius: "var(--corner-radius-full)",
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
      fontFamily: "var(--font-secondary)",
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontWeight: "var(--font-weight-secondary-medium)",
    };

    if (showBorders) {
      return {
        ...baseStyles,
        border: "var(--border-width-25) solid",
        borderColor: colorConfig.border,
      };
    }

    return baseStyles;
  }, [colorConfig, sizeConfig, showBorders]);

  const iconWrapperStyles = useMemo(() => {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${sizeConfig.iconSize}px`,
      height: `${sizeConfig.iconSize}px`,
      maxWidth: `${sizeConfig.iconSize}px`,
      maxHeight: `${sizeConfig.iconSize}px`,
      flexShrink: 0,
      overflow: "hidden",
      color: colorConfig.fg,
    };
  }, [sizeConfig.iconSize, colorConfig.fg]);

  return (
    <div style={chipStyles}>
      {showIcon && (
        <div style={iconWrapperStyles}>
          <ListDetailsIcon size={sizeConfig.iconSize} />
        </div>
      )}
      <span>{label}</span>
    </div>
  );
}

