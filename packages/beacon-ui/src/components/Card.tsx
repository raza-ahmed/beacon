"use client";

import { ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { ArrowDownFallSlotIcon } from "../icons";
import { getPatternConfig, type PatternType } from "../utils/patternPaths";
import type { CornerRadiusStep } from "./Button";

export type CardStatus = "default" | "highlighted" | "selected";
export type CardShadow = "0" | "50" | "100" | "200" | "300" | "400" | "500";

const CORNER_RADIUS_MAP: Record<CornerRadiusStep, string> = {
  0: "var(--corner-radius-none)",
  1: "var(--corner-radius-100)",
  2: "var(--corner-radius-200)",
  3: "var(--corner-radius-300)",
  4: "var(--corner-radius-400)",
  5: "var(--corner-radius-full)",
};

export interface CardProps extends Omit<ComponentPropsWithRef<"div">, "slot"> {
  padding?: number;
  height?: string;
  status?: CardStatus;
  shadow?: CardShadow;
  cornerRadius?: CornerRadiusStep;
  showBgPattern?: boolean;
  patternType?: PatternType;
  showOverlay?: boolean;
  showBorder?: boolean;
  children?: React.ReactNode;
}

function getSpacingToken(padding: number): string {
  if (padding === 0) {
    return "var(--spacing-none)";
  }
  return `var(--spacing-${padding})`;
}

function getShadowToken(shadow?: CardShadow): string | undefined {
  if (!shadow) return undefined;
  return `var(--drop-shadow-${shadow})`;
}

function getHeightValue(height?: string): string | undefined {
  if (height === undefined) return undefined;
  // Allow strings like "200px", "100%", "auto", "fill", etc.
  return height;
}

export function Card({
  padding = 400,
  height,
  status = "default",
  shadow,
  cornerRadius = 4,
  showBgPattern = false,
  patternType = "cubes",
  showOverlay = false,
  showBorder = true,
  children,
  className,
  style,
  ref,
  ...rest
}: CardProps) {
  useThemeSafe();

  const isDefault = status === "default";
  const isHighlighted = status === "highlighted";
  const isSelected = status === "selected";

  const heightValue = getHeightValue(height);
  // Only apply overflow: auto for fixed heights (not "auto" or undefined)
  const hasFixedHeight = heightValue && heightValue !== "auto";

  const cardStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-400)",
    alignItems: "flex-start",
    overflow: hasFixedHeight ? "auto" : "hidden",
    padding: getSpacingToken(padding),
    borderRadius: CORNER_RADIUS_MAP[cornerRadius],
    position: "relative",
    backgroundColor: "var(--bg-page-primary)",
    ...(heightValue && { height: heightValue }),
    ...(shadow && { boxShadow: getShadowToken(shadow) }),
    ...style,
  };

    if (showBorder) {
      if (isSelected) {
        cardStyles.border = "var(--border-width-25) solid var(--border-primary)";
      } else {
        cardStyles.border = "var(--border-width-25) solid var(--border-strong-200)";
      }
    }

    const overlayGradient = "var(--bg-page-primary)";

    // Build background layers using CSS multiple backgrounds
    // CSS backgrounds stack: first listed = top layer, last listed = bottom layer
    // We want: overlay (middle) first, pattern (bottom) last
    // Content will naturally be on top since it's not a background
    const backgroundLayers: string[] = [];
    
    if (showOverlay) {
      backgroundLayers.push(
        `linear-gradient(to bottom, rgba(255,255,255,0) 26.827%, ${overlayGradient} 86.384%)`
      );
    }
    
    if (showBgPattern) {
      const patternConfig = getPatternConfig(patternType);
      if (patternConfig.imageUrl) {
        backgroundLayers.push(`url("${patternConfig.imageUrl}")`);
      }
    }

    // Apply background layers to card styles
    if (backgroundLayers.length > 0) {
      cardStyles.backgroundImage = backgroundLayers.join(", ");
      
      if (showBgPattern && showOverlay) {
        const patternConfig = getPatternConfig(patternType);
        // First value applies to first background (overlay), second to pattern
        cardStyles.backgroundRepeat = "no-repeat, repeat";
        cardStyles.backgroundSize = patternConfig.backgroundSize 
          ? `100% 100%, ${patternConfig.backgroundSize}`
          : "100% 100%, auto";
        cardStyles.backgroundPosition = patternConfig.backgroundPosition 
          ? `center, ${patternConfig.backgroundPosition}`
          : "center, top left";
      } else if (showBgPattern) {
          const patternConfig = getPatternConfig(patternType);
        cardStyles.backgroundRepeat = "repeat";
        cardStyles.backgroundSize = patternConfig.backgroundSize || "auto";
        cardStyles.backgroundPosition = patternConfig.backgroundPosition || "top left";
      } else if (showOverlay) {
        cardStyles.backgroundRepeat = "no-repeat";
        cardStyles.backgroundSize = "100% 100%";
        cardStyles.backgroundPosition = "center";
      }
    }
          
          return (
    <div ref={ref} className={className} style={cardStyles} {...rest}>
      {children || (
          <div
            style={{
              backgroundColor: "var(--bg-warning-tonal)",
              border: "var(--border-width-25) dashed var(--border-warning)",
              padding: "var(--spacing-200) 8px",
              borderRadius: "var(--corner-radius-100)",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "32px",
            }}
          >
            <div style={{ color: "var(--fg-warning-on-tonal)" }}>
              <ArrowDownFallSlotIcon size="xs" />
            </div>
          </div>
        )}
      </div>
    );
}
