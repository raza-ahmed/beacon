"use client";

import { useMemo, useState, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";

export type TabItemState = "default" | "active" | "hover" | "disabled";
export type TabItemSize = "sm" | "md";
export type TabItemStyle = "default" | "pill";

export interface TabItemProps extends Omit<ComponentPropsWithRef<"button">, "onClick"> {
  tabName?: string;
  state?: TabItemState;
  size?: TabItemSize;
  tabStyle?: TabItemStyle;
  onClick?: () => void;
}

const SIZE_CONFIG: Record<
  TabItemSize,
  {
    fontSize: string;
    lineHeight: string;
    paddingY: string;
    paddingX: string;
  }
> = {
  sm: {
    fontSize: "var(--fonts-body-small-text-size)",
    lineHeight: "var(--fonts-body-small-line-height)",
    paddingY: "var(--spacing-100)",
    paddingX: "var(--spacing-200)",
  },
  md: {
    fontSize: "var(--fonts-body-regular-text-size)",
    lineHeight: "var(--fonts-body-regular-line-height)",
    paddingY: "var(--spacing-200)",
    paddingX: "var(--spacing-300)",
  },
};

export function TabItem({
  tabName,
  state: stateProp,
  size = "sm",
  tabStyle = "default",
  onClick,
  className,
  style: inlineStyle,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: TabItemProps) {
  useThemeSafe();
  const [internalHover, setInternalHover] = useState(false);
  const sizeConfig = SIZE_CONFIG[size];
  const isDisabled = disabled || stateProp === "disabled";
  const isActive = stateProp === "active";
  const isHovered = stateProp === "hover" || (internalHover && !stateProp && !isDisabled && !isActive);
  const effectiveState = stateProp ?? (isHovered ? "hover" : "default");

  const buttonStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      flex: "1",
      padding: `${sizeConfig.paddingY} ${sizeConfig.paddingX}`,
      border: "none",
      backgroundColor: "transparent",
      color: isDisabled ? "var(--fg-disabled)" : isActive ? "var(--fg-primary-on-tonal)" : "var(--fg-neutral)",
      fontFamily: "var(--font-secondary)",
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      fontWeight: "var(--font-weight-secondary-medium)",
      cursor: isDisabled ? "not-allowed" : "pointer",
      transition: "background-color 0.15s ease, color 0.15s ease",
      borderRadius: tabStyle === "pill" ? "var(--corner-radius-100)" : "0",
      whiteSpace: "nowrap",
      ...inlineStyle,
    };

    if (isActive) {
      baseStyles.backgroundColor = "var(--bg-primary-tonal)";
    } else if (isHovered) {
      baseStyles.backgroundColor = "var(--bg-page-secondary)";
    }

    return baseStyles;
  }, [sizeConfig, isDisabled, isActive, isHovered, tabStyle, inlineStyle]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && !stateProp) {
      setInternalHover(true);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!stateProp) {
      setInternalHover(false);
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      style={buttonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {tabName}
    </button>
  );
}
