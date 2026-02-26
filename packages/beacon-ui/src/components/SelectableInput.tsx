"use client";

import { useMemo, useState, useCallback, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { GridUILayoutIcon } from "../icons";
import type { CornerRadiusStep } from "./Button";

export type SelectableInputSize = "sm" | "md" | "lg" | "xl";

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

const SIZE_CONFIG: Record<
  SelectableInputSize,
  {
    padding: string;
    iconSize: number;
    fontSize: string;
    lineHeight: string;
    gap: string;
    minWidth: string;
    minHeight: string;
  }
> = {
  sm: {
    padding: "var(--spacing-200)",
    iconSize: 16,
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
    gap: "var(--spacing-100)",
    minWidth: "80px",
    minHeight: "80px",
  },
  md: {
    padding: "var(--spacing-300)",
    iconSize: 20,
    fontSize: "var(--body-small-text-size)",
    lineHeight: "var(--body-small-line-height)",
    gap: "var(--spacing-150)",
    minWidth: "100px",
    minHeight: "100px",
  },
  lg: {
    padding: "var(--spacing-400)",
    iconSize: 24,
    fontSize: "var(--body-regular-text-size)",
    lineHeight: "var(--body-regular-line-height)",
    gap: "var(--spacing-200)",
    minWidth: "120px",
    minHeight: "120px",
  },
  xl: {
    padding: "var(--spacing-500)",
    iconSize: 28,
    fontSize: "var(--body-regular-text-size)",
    lineHeight: "var(--body-regular-line-height)",
    gap: "var(--spacing-250)",
    minWidth: "140px",
    minHeight: "140px",
  },
};

export interface SelectableInputProps extends Omit<ComponentPropsWithRef<"button">, "type"> {
  label?: string;
  icon?: React.ReactNode;
  size?: SelectableInputSize;
  selected?: boolean;
  disabled?: boolean;
  cornerRadius?: CornerRadiusStep;
  fullWidth?: boolean;
}

export function SelectableInput({
  label = "Option",
  icon,
  size = "md",
  selected = false,
  disabled = false,
  cornerRadius = 2,
  fullWidth = false,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ref,
  ...rest
}: SelectableInputProps) {
  useThemeSafe();
  const sizeConfig = SIZE_CONFIG[size];
  const [isHovered, setIsHovered] = useState(false);

  const containerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: sizeConfig.gap,
      padding: sizeConfig.padding,
      minWidth: sizeConfig.minWidth,
      minHeight: sizeConfig.minHeight,
      borderRadius: CORNER_RADIUS_MAP[cornerRadius],
      border: selected
        ? "var(--border-width-25) solid var(--border-primary)"
        : "var(--border-width-25) solid var(--border-strong-200)",
      backgroundColor: selected
        ? "var(--bg-primary)"
        : "var(--bg-page-primary)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
      outline: "none",
      fontFamily: "var(--font-secondary)",
      ...style,
    };

    if (fullWidth) {
      baseStyles.width = "100%";
    }

    if (isHovered && !disabled && !selected) {
      baseStyles.borderColor = "var(--border-neutral-primary)";
    }

    if (isHovered && !disabled) {
      baseStyles.transform = "scale(1.02)";
    }

    return baseStyles;
  }, [sizeConfig, selected, disabled, cornerRadius, fullWidth, isHovered, style]);

  const iconStyles = useMemo(() => {
    return {
      color: selected
        ? "var(--fg-primary-on-primary)"
        : disabled
        ? "var(--fg-disabled)"
        : "var(--fg-neutral)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    } as React.CSSProperties;
  }, [selected, disabled]);

  const labelStyles = useMemo(() => {
    return {
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      color: selected
        ? "var(--fg-primary-on-primary)"
        : disabled
        ? "var(--fg-disabled)"
        : "var(--fg-neutral)",
      textAlign: "center" as const,
      fontWeight: 400,
    } as React.CSSProperties;
  }, [sizeConfig, selected, disabled]);

  const defaultIcon = icon || <GridUILayoutIcon size={sizeConfig.iconSize} />;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setIsHovered(true);
        onMouseEnter?.(e);
      }
    },
    [disabled, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onClick?.(e);
      }
    },
    [disabled, onClick]
  );

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      style={containerStyles}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-pressed={selected}
      aria-disabled={disabled}
      {...rest}
    >
      <div style={iconStyles}>{defaultIcon}</div>
      {label && <div style={labelStyles}>{label}</div>}
    </button>
  );
}
