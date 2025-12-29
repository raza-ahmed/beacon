"use client";

import { useMemo } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { ListDetailsIcon } from "../icons";

export type ChipSize = "sm" | "md" | "lg";
export type ChipColor = "primary" | "neutral" | "success" | "critical" | "warning";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  color?: ChipColor;
  size?: ChipSize;
  showBorders?: boolean;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
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
    fontSize: "var(--body-extra-small-text-size)",
    lineHeight: "var(--body-extra-small-line-height)",
    paddingX: "var(--spacing-300)",
    paddingY: "var(--spacing-100)",
  },
  md: {
    iconSize: 20,
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
    paddingX: "var(--spacing-400)",
    paddingY: "var(--spacing-200)",
  },
  lg: {
    iconSize: 24,
    fontSize: "var(--body-regular-text-size)",
    lineHeight: "var(--body-regular-line-height)",
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

export function Chip({
  label = "Identifier",
  color = "primary",
  size = "md",
  showBorders = false,
  icon,
  className,
  style,
  children,
  ref,
  ...rest
}: ChipProps) {
    useThemeSafe(); // Ensure theme context is available
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

      return { ...baseStyles, ...style };
    }, [colorConfig, sizeConfig, showBorders, style]);

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
      <div ref={ref} className={className} style={chipStyles} {...rest}>
        {icon && (
          <div style={iconWrapperStyles}>
            {icon}
          </div>
        )}
        {children || <span>{label}</span>}
      </div>
    );
}
