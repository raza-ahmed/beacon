"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { ButtonIcon, type ButtonState as BeaconButtonState, type ButtonVariant, type ButtonSize, type CornerRadiusStep } from "beacon-ui";

type ButtonState = BeaconButtonState | "disabled" | "loading" | "success" | "critical" | "warning";
import { SearchIcon } from "beacon-icons";

interface ButtonIconPreviewProps {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  icon?: React.ReactNode;
  state: ButtonState;
  loading?: boolean;
  disabled?: boolean;
  theme: Theme;
  hue: HueVariant;
}

export function ButtonIconPreview({
  variant,
  size,
  cornerRadius,
  icon,
  state,
  loading = false,
  disabled = false,
  theme,
  hue,
}: ButtonIconPreviewProps) {
  // Map state to disabled/loading props
  const isDisabled = disabled || state === "disabled";
  const isLoading = loading || state === "loading";
  
  // Determine color prop based on state
  const buttonColor: "primary" | "success" | "critical" | "warning" = 
    state === "success" ? "success" :
    state === "critical" ? "critical" :
    state === "warning" ? "warning" :
    "primary";
  
  // Only pass state prop if it's one of the supported states
  const stateProp: BeaconButtonState | undefined = 
    state === "disabled" || state === "success" || state === "critical" || state === "warning"
      ? undefined 
      : state === "loading"
      ? "default"
      : (state === "default" || state === "hovered" || state === "focused" || state === "pressed" ? state as BeaconButtonState : undefined);

  const displayIcon = icon || <SearchIcon size="xs" />;

  return (
    <div className="ds-button-preview-container">
      <div className="ds-button-preview-canvas">
        <ButtonIcon
          variant={variant}
          size={size}
          cornerRadius={cornerRadius}
          icon={displayIcon}
          state={stateProp}
          color={buttonColor}
          loading={isLoading}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}

