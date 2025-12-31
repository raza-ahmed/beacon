"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { Switch, type SwitchStatus } from "beacon-ui";

interface SwitchPreviewProps {
  checked?: boolean;
  status?: SwitchStatus;
  showIcons?: boolean;
  label?: string;
  showLabel?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

export function SwitchPreview({
  checked = false,
  status = "default",
  showIcons = false,
  label = "Switch",
  showLabel = false,
  theme,
  hue,
}: SwitchPreviewProps) {
  const disabled = status === "disabled";
  
  const switchElement = (
    <Switch
      checked={checked}
      status={status}
      showIcons={showIcons}
      disabled={disabled}
    />
  );

  if (showLabel && label) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-200)",
        }}
      >
        {switchElement}
        <p
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: "var(--fonts-body-small-text-size)",
            lineHeight: "var(--fonts-body-small-line-height)",
            fontWeight: "var(--font-weight-secondary-medium)",
            margin: 0,
            color: disabled ? "var(--fg-disabled)" : "var(--fg-neutral-secondary)",
          }}
        >
          {label}
        </p>
      </div>
    );
  }

  return switchElement;
}

