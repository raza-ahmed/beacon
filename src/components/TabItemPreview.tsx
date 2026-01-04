"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { PageFileIcon, ChevronRightIcon } from "./icons";

type TabItemState = "Default" | "Active" | "Hover" | "Disabled";
type TabItemSize = "Small" | "Medium";
type TabItemStyle = "Default" | "Pill";
type TabItemPlacement = "Horizontal" | "Vertical";
type CornerRadiusStep = 0 | 1 | 2 | 3 | 4 | 5;

interface TabItemPreviewProps {
  tabName?: string;
  state?: TabItemState;
  size?: TabItemSize;
  style?: TabItemStyle;
  placement?: TabItemPlacement;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  showTabLabel?: boolean;
  cornerRadius?: CornerRadiusStep;
  fullWidth?: boolean;
  theme?: Theme;
  hue?: HueVariant;
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
  TabItemSize,
  {
    iconSize: number;
    fontSize: string;
    lineHeight: string;
    paddingY: string;
    paddingX: string;
  }
> = {
  Small: {
    iconSize: 16,
    fontSize: "var(--fonts-body-small-text-size)",
    lineHeight: "var(--fonts-body-small-line-height)",
    paddingY: "var(--spacing-200)",
    paddingX: "0",
  },
  Medium: {
    iconSize: 20,
    fontSize: "var(--fonts-body-regular-text-size)",
    lineHeight: "var(--fonts-body-regular-line-height)",
    paddingY: "var(--spacing-300)",
    paddingX: "0",
  },
};

export function TabItemPreview({
  tabName = "Tab Item",
  state = "Default",
  size = "Small",
  style = "Default",
  placement = "Horizontal",
  showStartIcon = true,
  showEndIcon = true,
  showTabLabel = true,
  cornerRadius = 5,
  fullWidth = false,
  theme,
  hue,
}: TabItemPreviewProps) {
  const sizeConfig = SIZE_CONFIG[size];

  const containerStyles = useMemo((): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      position: "relative",
    };

    if (fullWidth) {
      baseStyles.flex = "1 0 0";
      baseStyles.width = "100%";
      baseStyles.minWidth = 0;
    } else {
      baseStyles.gap = "var(--spacing-200)";
    }

    if (placement === "Vertical") {
      return {
        ...baseStyles,
        flexDirection: "column" as const,
        justifyContent: "center",
      };
    }

    return baseStyles;
  }, [placement, fullWidth]);

  const contentStyles = useMemo((): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      gap: "var(--spacing-200)",
      alignItems: "center",
      paddingLeft: sizeConfig.paddingX,
      paddingRight: sizeConfig.paddingX,
      paddingTop: sizeConfig.paddingY,
      paddingBottom: sizeConfig.paddingY,
    };

    if (placement === "Vertical") {
      return {
        ...baseStyles,
        flexDirection: "column" as const,
        justifyContent: "center",
      };
    }

    return baseStyles;
  }, [placement, sizeConfig]);

  const itemStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      position: "relative",
    };

    if (fullWidth) {
      baseStyles.width = "100%";
      baseStyles.justifyContent = "center";
    }

    if (style === "Pill") {
      const pillPaddingX = size === "Small" ? "var(--spacing-300)" : "var(--spacing-400)";
      return {
        ...baseStyles,
        paddingLeft: pillPaddingX,
        paddingRight: pillPaddingX,
        borderRadius: CORNER_RADIUS_MAP[cornerRadius],
        ...(state === "Active"
          ? {
              backgroundColor: "var(--bg-primary)",
            }
          : state === "Hover"
            ? {
                backgroundColor: "var(--bg-page-secondary)",
              }
            : {}),
      };
    }

    return baseStyles;
  }, [style, size, state, cornerRadius, fullWidth]);

  const textStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      fontFamily: "var(--font-secondary)",
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.lineHeight,
      position: "relative",
      flexShrink: 0,
    };

    if (state === "Active") {
      return {
        ...baseStyles,
        color: style === "Pill" ? "var(--fg-neutral)" : "var(--fg-primary)",
        fontWeight: "var(--font-weight-secondary-medium)",
      };
    } else if (state === "Hover") {
      return {
        ...baseStyles,
        color: "var(--fg-neutral-secondary)",
        fontWeight: "var(--font-weight-secondary-regular)",
      };
    } else if (state === "Disabled") {
      return {
        ...baseStyles,
        color: "var(--fg-disabled)",
        fontWeight: "var(--font-weight-secondary-regular)",
      };
    }

    return {
      ...baseStyles,
      color: "var(--fg-neutral)",
      fontWeight: "var(--font-weight-secondary-regular)",
    };
  }, [state, style, sizeConfig]);

  const iconColor = useMemo(() => {
    if (state === "Active") {
      return style === "Pill" ? "var(--fg-neutral)" : "var(--fg-primary)";
    } else if (state === "Hover") {
      return "var(--fg-neutral-secondary)";
    } else if (state === "Disabled") {
      return "var(--fg-disabled)";
    }
    return "var(--fg-neutral-secondary)";
  }, [state, style]);

  const activeIndicator = useMemo(() => {
    if (state === "Active" && style === "Default") {
      return (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: "var(--bg-primary)",
            borderRadius: "var(--corner-radius-full)",
          }}
        />
      );
    }
    return null;
  }, [state, style]);

  return (
    <div style={containerStyles}>
      <div style={itemStyles}>
        <div style={contentStyles}>
          {showStartIcon && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${sizeConfig.iconSize}px`,
                height: `${sizeConfig.iconSize}px`,
                flexShrink: 0,
                color: iconColor,
              }}
            >
              <PageFileIcon size={sizeConfig.iconSize} />
            </div>
          )}
          {showTabLabel && <span style={textStyles}>{tabName}</span>}
          {showEndIcon && placement === "Horizontal" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${sizeConfig.iconSize}px`,
                height: `${sizeConfig.iconSize}px`,
                flexShrink: 0,
                color: iconColor,
              }}
            >
              <ChevronRightIcon size={sizeConfig.iconSize} />
            </div>
          )}
        </div>
        {activeIndicator}
      </div>
    </div>
  );
}

