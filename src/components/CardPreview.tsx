"use client";

import React from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import { Card, type CornerRadiusStep } from "beacon-ui";
import type { PatternType } from "@/utils/patternPaths";

type CardStatus = "default" | "highlighted" | "selected";
type CardShadow = "0" | "50" | "100" | "200" | "300" | "400" | "500";

interface CardPreviewProps {
  theme: Theme;
  hue: HueVariant;
  padding?: number;
  height?: string;
  status?: CardStatus;
  shadow?: CardShadow;
  cornerRadius?: CornerRadiusStep;
  showBgPattern?: boolean;
  patternType?: PatternType;
  showOverlay?: boolean;
  showBorder?: boolean;
}

export function CardPreview({
  theme,
  hue,
  padding = 400,
  height,
  status = "default",
  shadow = "100",
  cornerRadius = 4,
  showBgPattern = false,
  patternType = "cubes",
  showOverlay = false,
  showBorder = true,
}: CardPreviewProps) {
  return (
    <div className="ds-card-preview-container">
      <div className="ds-card-preview-canvas">
        <Card
          padding={padding}
          height={height}
          status={status as "default" | "highlighted" | "selected"}
          shadow={shadow as "0" | "50" | "100" | "200" | "300" | "400" | "500"}
          cornerRadius={cornerRadius}
          showBgPattern={showBgPattern}
          patternType={patternType}
          showOverlay={showOverlay}
          showBorder={showBorder}
          style={{
            width: "400px",
          }}
        />
      </div>
    </div>
  );
}
