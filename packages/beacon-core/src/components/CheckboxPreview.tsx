"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "../tokens/types";
import { CheckIcon, MinusDashIcon } from "../icons";

type CheckboxStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface CheckboxPreviewProps {
  checked?: boolean;
  status?: CheckboxStatus;
  label?: string;
  showLabel?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

const CHECKBOX_SIZE = 20;
const ICON_SIZE = 16; // 20px box - 4px padding (2px each side) = 16px

export function CheckboxPreview({
  checked = false,
  status = "default",
  label = "Checkbox",
  showLabel = true,
  theme,
  hue,
}: CheckboxPreviewProps) {
  const disabled = status === "disabled";

  const checkboxStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      width: `${CHECKBOX_SIZE}px`,
      height: `${CHECKBOX_SIZE}px`,
      borderRadius: "var(--corner-radius-100)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "background-color 0.15s ease, border-color 0.15s ease",
      boxSizing: "border-box",
      overflow: "hidden",
      position: "relative",
    };

    if (checked) {
      // Checked state
      if (disabled) {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-disabled)",
          border: "none",
          padding: "var(--spacing-50)",
        };
      }
      if (status === "hovered") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-primary-on-hover)",
          border: "none",
          padding: "var(--spacing-50)",
        };
      }
      if (status === "focused" || status === "pressed") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-primary-pressed)",
          border: "none",
          padding: "var(--spacing-50)",
        };
      }
      // Default checked
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-primary)",
        border: "none",
        padding: "var(--spacing-50)",
      };
    } else {
      // Unchecked state
      if (disabled) {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-primary)",
          border: "var(--border-width-50) solid var(--border-neutral-tertiary)",
        };
      }
      if (status === "hovered" || status === "focused" || status === "pressed") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-primary)",
          border: "var(--border-width-50) solid var(--border-neutral-primary)",
        };
      }
      // Default unchecked
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-primary)",
        border: "var(--border-width-50) solid var(--border-neutral-secondary)",
      };
    }
  }, [checked, status, disabled]);

  const iconColor = useMemo(() => {
    if (disabled) {
      return "var(--fg-on-disabled)";
    }
    return "var(--static-white)";
  }, [disabled]);

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
        color: "var(--fg-on-disabled)",
      };
    }

    if (checked) {
      return {
        ...baseStyles,
        color: "var(--fg-neutral-secondary)",
      };
    }

    return {
      ...baseStyles,
      color: "var(--fg-neutral-tertiary)",
    };
  }, [disabled, checked]);

  const focusRingStyles = useMemo(() => {
    if (status !== "focused") return null;

    // Focus ring should be positioned outside the checkbox
    // The checkbox is 20px × 20px
    // The focus ring should be 4px outside the checkbox edge, centered on the container
    // Using explicit width/height and centering: 20px + 8px (4px on each side) = 28px
    // Border radius matches the checkbox's rounded rectangle shape
    return {
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "28px",
      height: "28px",
      marginTop: "0",
      marginLeft: "0",
      borderRadius: "var(--corner-radius-200)",
      borderWidth: "var(--border-width-25)",
      borderStyle: "solid",
      borderColor: checked
        ? "var(--border-primary)"
        : "var(--border-neutral-primary)",
      pointerEvents: "none" as const,
    };
  }, [status, checked]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-200)",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {focusRingStyles && <div style={focusRingStyles} />}
        <div style={checkboxStyles}>
          {checked && (
            <div
              style={{
                color: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${ICON_SIZE}px`,
                height: `${ICON_SIZE}px`,
                maxWidth: `${ICON_SIZE}px`,
                maxHeight: `${ICON_SIZE}px`,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <CheckIcon size={ICON_SIZE} />
            </div>
          )}
        </div>
      </div>
      {showLabel && label && <p style={labelStyles}>{label}</p>}
    </div>
  );
}

