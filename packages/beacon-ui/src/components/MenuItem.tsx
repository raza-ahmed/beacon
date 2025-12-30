"use client";

import { ComponentPropsWithRef, ReactNode } from "react";
import { UserPersonIcon, ChevronRightIcon } from "../icons";

export type MenuItemState = "Default" | "Hovered" | "Active" | "Disabled";

export interface MenuItemProps extends Omit<ComponentPropsWithRef<"button">, "onClick"> {
  menuTitle?: string;
  iconStart?: boolean;
  iconStart1?: ReactNode | null;
  iconEnd?: boolean;
  iconEnd1?: ReactNode | null;
  state?: MenuItemState;
  onClick?: () => void;
}

export function MenuItem({
  menuTitle = "Menu Item",
  iconStart = true,
  iconStart1 = null,
  iconEnd = true,
  iconEnd1 = null,
  state = "Default",
  onClick,
  className,
  style,
  ...rest
}: MenuItemProps) {
  const isActive = state === "Active";
  const isDisabled = state === "Disabled";
  const isHovered = state === "Hovered";
  const isDefault = state === "Default";

  // Background colors based on state
  const backgroundColor = isActive
    ? "var(--bg-primary-tonal)"
    : isHovered
    ? "var(--bg-page-secondary)"
    : isDisabled
    ? "var(--bg-page-primary)"
    : "var(--bg-page-primary)";

  // Text colors based on state
  const textColor = isActive
    ? "var(--fg-primary-on-tonal)"
    : isDisabled
    ? "var(--fg-on-disabled)"
    : isHovered
    ? "var(--fg-neutral)"
    : "var(--fg-neutral-secondary)";

  // Icon colors based on state
  const iconColor = isActive
    ? "var(--fg-primary-on-tonal)"
    : isDisabled
    ? "var(--fg-on-disabled)"
    : isHovered
    ? "var(--fg-neutral)"
    : "var(--fg-neutral-secondary)";

  // Chevron colors based on state
  const chevronColor = isActive
    ? "var(--fg-primary-on-tonal)"
    : isDisabled
    ? "var(--fg-on-disabled)"
    : "var(--fg-neutral)";

  // Border for disabled state
  const borderStyle = isDisabled
    ? "var(--border-width-25) solid var(--border-neutral-tertiary)"
    : "none";

  const containerStyles: React.CSSProperties = {
    display: "flex",
    gap: "var(--spacing-200)",
    alignItems: "center",
    padding: "var(--spacing-200) var(--spacing-200)",
    borderRadius: "var(--corner-radius-200)",
    width: "100%",
    backgroundColor,
    border: borderStyle,
    cursor: isDisabled ? "not-allowed" : onClick ? "pointer" : "default",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
    ...style,
  };

  return (
    <button
      type="button"
      className={className}
      style={containerStyles}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      {...rest}
    >
      {iconStart && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            flexShrink: 0,
            color: iconColor,
          }}
        >
          {iconStart1 || <UserPersonIcon size={20} />}
        </div>
      )}
      <p
        style={{
          fontFamily: "var(--font-secondary)",
          fontSize: "var(--body-small-text-size)",
          lineHeight: "var(--body-small-line-height)",
          fontWeight: isActive ? "var(--font-weight-secondary-semibold)" : "var(--font-weight-secondary-medium)",
          color: textColor,
          margin: 0,
          flex: 1,
          textAlign: "left" as const,
        }}
      >
        {menuTitle}
      </p>
      {iconEnd && !isDisabled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            flexShrink: 0,
            color: chevronColor,
          }}
        >
          {iconEnd1 || <ChevronRightIcon size={16} />}
        </div>
      )}
      {iconEnd && isDisabled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            flexShrink: 0,
            color: chevronColor,
          }}
        >
          {iconEnd1 || <ChevronRightIcon size={16} />}
        </div>
      )}
    </button>
  );
}

