"use client";

import { ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { ArrowDownFallSlotIcon } from "../icons";
import { getPatternClassName, type PatternType } from "../utils/patternPaths";
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
  patternType = "grid-nested",
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
    ...(heightValue && { height: heightValue }),
    ...(shadow && { boxShadow: getShadowToken(shadow) }),
    ...style,
  };

  // Set background-color only if pattern is not shown, or set it in a way that doesn't override the pattern
  if (!showBgPattern) {
    cardStyles.backgroundColor = "var(--bg-page-primary)";
  } else {
    // When pattern is shown, set background-color so pattern appears on top
    cardStyles.backgroundColor = "var(--bg-page-primary)";
  }

    if (showBorder) {
      if (isSelected) {
        cardStyles.border = "var(--border-width-25) solid var(--border-primary)";
      } else {
        cardStyles.border = "var(--border-width-25) solid var(--border-strong-200)";
      }
    }

    const overlayGradient = "var(--bg-page-primary)";

    // Get pattern CSS class name
    const patternClassName = showBgPattern ? getPatternClassName(patternType) : "";
    
    // Build className with pattern class if needed
    const combinedClassName = [className, patternClassName].filter(Boolean).join(" ");

    // Handle overlay and pattern backgrounds
    // When both are present, we need to combine them using CSS multiple backgrounds
    // The pattern class provides background-image, so we need to get it and combine with overlay
    if (showOverlay && showBgPattern) {
      // Don't set backgroundImage here - let the CSS class handle the pattern
      // The overlay will be added via a pseudo-element or we combine backgrounds
      // For now, we'll let the pattern class work and add overlay separately
      // Actually, CSS multiple backgrounds won't work easily with classes
      // So we'll use a wrapper approach or accept that overlay might cover pattern slightly
      // The pattern should still be visible through the gradient
    } else if (showOverlay) {
      cardStyles.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0) 26.827%, ${overlayGradient} 86.384%)`;
      cardStyles.backgroundRepeat = "no-repeat";
      cardStyles.backgroundSize = "100% 100%";
      cardStyles.backgroundPosition = "center";
    }
    // If only pattern is shown, the CSS class will handle it via className
          
          return (
    <div ref={ref} className={combinedClassName} style={cardStyles} {...rest}>
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
