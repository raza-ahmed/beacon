"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";

type RadioButtonStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface RadioButtonPreviewProps {
  selected?: boolean;
  status?: RadioButtonStatus;
  label?: string;
  showLabel?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

const RADIO_SIZE = 20;

export function RadioButtonPreview({
  selected = false,
  status = "default",
  label = "Select Me",
  showLabel = true,
  theme,
  hue,
}: RadioButtonPreviewProps) {
  const disabled = status === "disabled";

  const radioStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      width: `${RADIO_SIZE}px`,
      height: `${RADIO_SIZE}px`,
      borderRadius: "var(--corner-radius-full)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      position: "relative",
      transition: "border-color 0.15s ease, background-color 0.15s ease",
    };

    if (selected) {
      // Selected state
      if (disabled) {
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-150)",
          borderStyle: "solid",
          borderColor: "var(--border-primary-disabled)",
          backgroundColor: "transparent",
        };
      }
      if (status === "hovered") {
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-150)",
          borderStyle: "solid",
          borderColor: "var(--border-primary-on-hover)",
          backgroundColor: "transparent",
        };
      }
      if (status === "focused" || status === "pressed") {
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-150)",
          borderStyle: "solid",
          borderColor: "var(--border-primary-pressed)",
          backgroundColor: "transparent",
        };
      }
      // Default selected
      return {
        ...baseStyles,
        borderWidth: "var(--border-width-150)",
        borderStyle: "solid",
        borderColor: "var(--border-primary)",
        backgroundColor: "transparent",
      };
    } else {
      // Unselected state
      if (disabled) {
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-25)",
          borderStyle: "solid",
          borderColor: "var(--border-disabled)",
          backgroundColor: "transparent",
        };
      }
      if (status === "hovered" || status === "focused" || status === "pressed") {
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-25)",
          borderStyle: "solid",
          borderColor: "var(--border-neutral-primary)",
          backgroundColor: "transparent",
        };
      }
      // Default unselected
      return {
        ...baseStyles,
        borderWidth: "var(--border-width-25)",
        borderStyle: "solid",
        borderColor: "var(--border-neutral-primary)",
        backgroundColor: "transparent",
      };
    }
  }, [selected, status, disabled]);

  const innerCircleStyles = useMemo(() => {
    if (!selected) return null;

    // Inner white circle for selected state
    // Size: 20px outer - 6px border on each side = 8px inner circle
    const innerSize = RADIO_SIZE - 12; // 6px border on each side (6px * 2 = 12px)

    return {
      width: `${innerSize}px`,
      height: `${innerSize}px`,
      borderRadius: "var(--corner-radius-full)",
      backgroundColor: "var(--fg-on-action)",
      flexShrink: 0,
    };
  }, [selected]);

  const labelStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      fontFamily: "var(--font-secondary)",
      fontSize: "var(--body-small-text-size)",
      lineHeight: "var(--body-small-line-height)",
      fontWeight: "var(--font-weight-secondary-medium)",
      margin: 0,
    };

    if (disabled) {
      return {
        ...baseStyles,
        color: "var(--fg-disabled)",
      };
    }

    return {
      ...baseStyles,
      color: "var(--fg-neutral-secondary)",
    };
  }, [disabled]);

  const focusRingStyles = useMemo(() => {
    if (status !== "focused") return null;

    // Focus ring should be positioned outside the radio button
    // The container is always 20px with box-sizing: border-box
    // When selected: border is 6px (border-width-150), so the visual outer edge is at 20px
    // When unselected: border is 1px (border-width-25), so the visual outer edge is at 20px
    // The focus ring should be 4px outside the container edge, centered on the container
    // Using explicit width/height and centering to ensure consistent alignment: 20px + 8px (4px on each side) = 28px
    return {
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "28px",
      height: "28px",
      marginTop: "0",
      marginLeft: "0",
      borderRadius: "var(--corner-radius-full)",
      borderWidth: "var(--border-width-25)",
      borderStyle: "solid",
      borderColor: selected
        ? "var(--border-primary)"
        : "var(--border-neutral-primary)",
      pointerEvents: "none" as const,
    };
  }, [status, selected]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-200)",
        position: "relative",
      }}
    >
      <div style={radioStyles}>
        {focusRingStyles && <div style={focusRingStyles} />}
        {innerCircleStyles && <div style={innerCircleStyles} />}
      </div>
      {showLabel && label && <p style={labelStyles}>{label}</p>}
    </div>
  );
}

