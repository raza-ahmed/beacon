"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { Tooltip, type TooltipPosition, type TooltipTrigger } from "beacon-ui";
import { Button } from "beacon-ui";

interface TooltipPreviewProps {
  content?: string;
  position?: TooltipPosition;
  trigger?: TooltipTrigger;
  showArrow?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

export function TooltipPreview({
  content = "Tooltip",
  position = "top",
  trigger = "hover",
  showArrow = true,
  showBorder = true,
  showShadow = true,
  theme,
  hue,
}: TooltipPreviewProps) {
  return (
    <div className="ds-tooltip-preview-container">
      <div className="ds-tooltip-preview-canvas">
        <Tooltip
          content={content}
          position={position}
          trigger={trigger}
          showArrow={showArrow}
          showBorder={showBorder}
          showShadow={showShadow}
        >
          <Button>Hover me</Button>
        </Tooltip>
      </div>
    </div>
  );
}
