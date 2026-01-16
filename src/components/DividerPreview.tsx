"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { Divider } from "beacon-ui";

type DividerOrientation = "horizontal" | "vertical";
type DividerSlotPosition = "default" | "center" | "left" | "right" | "top" | "bottom";

interface DividerPreviewProps {
  orientation: DividerOrientation;
  slotPosition: DividerSlotPosition;
  color: string;
  width: string;
  theme: Theme;
  hue: HueVariant;
}

export function DividerPreview({
  orientation,
  slotPosition,
  color,
  width,
  theme,
  hue,
}: DividerPreviewProps) {
  const slot = slotPosition !== "default";

  const containerStyles = useMemo(() => {
    if (orientation === "horizontal") {
      return {
        width: "100%",
        height: "auto",
        padding: "var(--spacing-200) 0",
      } as React.CSSProperties;
    } else {
      return {
        width: "auto",
        height: "100%",
        maxHeight: "100%",
        padding: "0 var(--spacing-200)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      } as React.CSSProperties;
    }
  }, [orientation]);

  // For vertical dividers, if width is "100%", use a fixed height instead
  const dividerWidth = useMemo(() => {
    if (orientation === "vertical" && width === "100%") {
      return "200px"; // Use fixed height for vertical dividers in preview
    }
    return width;
  }, [orientation, width]);

  return (
    <div className="ds-divider-preview-container">
      <div className="ds-divider-preview-canvas">
        <div className="ds-divider-preview-divider" style={containerStyles}>
          <Divider
            orientation={orientation}
            slot={slot}
            slotPosition={slotPosition}
            color={color || undefined}
            width={dividerWidth}
          />
        </div>
      </div>
    </div>
  );
}
