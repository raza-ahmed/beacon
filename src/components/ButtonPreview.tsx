"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { Button, type ButtonState as BeaconButtonState, type ButtonVariant, type ButtonSize, type CornerRadiusStep, type JustifyContent } from "beacon-ui";

type ButtonState = BeaconButtonState | "disabled" | "loading" | "success" | "critical" | "warning";
import { SearchIcon, ChevronDownIcon } from "beacon-icons";

interface ButtonPreviewProps {
  variant: ButtonVariant;
  size: ButtonSize;
  cornerRadius: CornerRadiusStep;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fillContainer: boolean;
  justifyContent: JustifyContent;
  state: ButtonState;
  loading?: boolean;
  disabled?: boolean;
  theme: Theme;
  hue: HueVariant;
}

export function ButtonPreview({
  variant,
  size,
  cornerRadius,
  startIcon,
  endIcon,
  fillContainer,
  justifyContent,
  state,
  loading = false,
  disabled = false,
  theme,
  hue,
}: ButtonPreviewProps) {
  // Map state to disabled/loading props
  const isDisabled = disabled || state === "disabled";
  const isLoading = loading || state === "loading";
  
  // Determine color prop based on state - preserve variant colors even when loading
  const buttonColor: "primary" | "success" | "critical" | "warning" = 
    state === "success" ? "success" :
    state === "critical" ? "critical" :
    state === "warning" ? "warning" :
    "primary";
  
  // Only pass state prop if it's one of the supported states
  // When loading, set to "default" to prevent state changes, but color prop preserves variant colors
  const stateProp: BeaconButtonState | undefined = 
    state === "disabled" || state === "success" || state === "critical" || state === "warning"
      ? undefined 
      : state === "loading"
      ? "default" // Set to default when loading - variant colors are preserved via color prop
      : (state === "default" || state === "hovered" || state === "focused" || state === "pressed" ? state as BeaconButtonState : undefined);

  return (
    <div className="ds-button-preview-container">
      <div className="ds-button-preview-canvas">
        <Button
          variant={variant}
          size={size}
          cornerRadius={cornerRadius}
          startIcon={startIcon}
          endIcon={endIcon}
          fillContainer={fillContainer}
          justifyContent={justifyContent}
          state={stateProp}
          color={buttonColor}
          loading={isLoading}
          disabled={isDisabled}
        >
          Button
        </Button>
      </div>
    </div>
  );
}

