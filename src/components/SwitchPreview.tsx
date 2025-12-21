"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { SunIcon, MoonIcon } from "./icons";

type SwitchStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface SwitchPreviewProps {
  checked?: boolean;
  status?: SwitchStatus;
  showIcons?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

const TRACK_WIDTH = "52px";
const HANDLE_SIZE = 24;
const ICON_CONTAINER_SIZE = 32;
const ICON_SIZE = 20;

export function SwitchPreview({
  checked = false,
  status = "default",
  showIcons = false,
  theme,
  hue,
}: SwitchPreviewProps) {
  const disabled = status === "disabled";

  const trackStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      padding: "var(--spacing-100)",
      borderRadius: "var(--corner-radius-full)",
      borderWidth: "var(--border-width-25)",
      borderStyle: "solid",
      position: "relative",
      transition: "background-color 0.15s ease, border-color 0.15s ease",
    };

    if (showIcons) {
      // With icons variant
      if (status === "disabled") {
        return {
          ...baseStyles,
          width: "auto",
          backgroundColor: "var(--bg-page-primary)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-end",
        };
      }
      if (status === "hovered") {
        return {
          ...baseStyles,
          width: "auto",
          backgroundColor: "var(--bg-page-secondary)",
          borderColor: "var(--border-strong-200)",
          justifyContent: "flex-end",
        };
      }
      if (status === "focused" || status === "pressed") {
        return {
          ...baseStyles,
          width: "auto",
          backgroundColor: "var(--bg-page-secondary)",
          borderColor: "var(--border-neutral-primary)",
          justifyContent: "flex-end",
        };
      }
      return {
        ...baseStyles,
        width: "auto",
        backgroundColor: "var(--bg-page-primary)",
        borderColor: "var(--border-strong-200)",
        justifyContent: "flex-end",
      };
    }

    // Default variant (no icons)
    if (status === "disabled") {
      if (checked) {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-primary-disabled)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-end",
        };
      } else {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-disabled)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-start",
        };
      }
    }

    if (checked) {
      if (status === "hovered") {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-primary-on-hover)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-end",
        };
      }
      if (status === "focused") {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-primary-on-focused)",
          borderColor: "var(--border-primary)",
          justifyContent: "flex-end",
        };
      }
      if (status === "pressed") {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-primary-pressed)",
          borderColor: "var(--border-primary)",
          justifyContent: "flex-end",
        };
      }
      return {
        ...baseStyles,
        width: TRACK_WIDTH,
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-strong-100)",
        justifyContent: "flex-end",
      };
    } else {
      if (status === "hovered") {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-page-secondary)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-start",
        };
      }
      if (status === "focused") {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-page-secondary)",
          borderColor: "var(--border-neutral-secondary)",
          justifyContent: "flex-start",
        };
      }
      if (status === "pressed") {
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-page-secondary)",
          borderColor: "var(--border-strong)",
          justifyContent: "flex-start",
        };
      }
      return {
        ...baseStyles,
        width: TRACK_WIDTH,
        backgroundColor: "var(--bg-page-primary)",
        borderColor: "var(--border-strong-100)",
        justifyContent: "flex-start",
      };
    }
  }, [checked, status, showIcons]);

  const handleStyles = useMemo(() => {
    return {
      width: `${HANDLE_SIZE}px`,
      height: `${HANDLE_SIZE}px`,
      borderRadius: "var(--corner-radius-full)",
      backgroundColor: checked ? "var(--fg-on-action)" : "var(--fg-disabled)",
      flexShrink: 0,
      boxShadow: "var(--shadow-subtle)",
    };
  }, [checked]);

  const nightContainerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${ICON_CONTAINER_SIZE}px`,
      height: `${ICON_CONTAINER_SIZE}px`,
      borderRadius: "var(--corner-radius-full)",
      flexShrink: 0,
    };

    if (checked) {
      return {
        ...baseStyles,
        backgroundColor: "transparent",
      };
    } else {
      if (status === "disabled") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-secondary)",
        };
      }
      if (status === "pressed") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-tertiary)",
          border: "var(--border-width-25) solid var(--border-strong-200)",
        };
      }
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-tertiary)",
      };
    }
  }, [checked, status]);

  const dayContainerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${ICON_CONTAINER_SIZE}px`,
      height: `${ICON_CONTAINER_SIZE}px`,
      borderRadius: "var(--corner-radius-full)",
      flexShrink: 0,
    };

    if (checked) {
      if (status === "disabled") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-secondary)",
        };
      }
      if (status === "pressed") {
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-tertiary)",
          border: "var(--border-width-25) solid var(--border-strong-200)",
        };
      }
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-tertiary)",
      };
    } else {
      return {
        ...baseStyles,
        backgroundColor: "transparent",
      };
    }
  }, [checked, status]);

  const nightIconColor = useMemo(() => {
    if (status === "disabled") {
      return "var(--fg-disabled)";
    }
    if (checked) {
      return "var(--fg-primary)";
    }
    return "var(--fg-neutral)";
  }, [checked, status]);

  const dayIconColor = useMemo(() => {
    if (status === "disabled") {
      return "var(--fg-disabled)";
    }
    if (checked) {
      return "var(--fg-neutral)";
    }
    return "var(--fg-warning)";
  }, [checked, status]);

  if (showIcons) {
    return (
      <div style={trackStyles}>
        <div style={nightContainerStyles}>
          <div style={{ color: nightIconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MoonIcon size={ICON_SIZE} />
          </div>
        </div>
        <div style={dayContainerStyles}>
          <div style={{ color: dayIconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SunIcon size={ICON_SIZE} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={trackStyles}>
      <div style={handleStyles} />
    </div>
  );
}

