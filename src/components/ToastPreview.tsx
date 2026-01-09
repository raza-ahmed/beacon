"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { Toast, type ToastVariant } from "beacon-ui";

interface ToastPreviewProps {
  variant?: ToastVariant;
  message?: string;
  actionLabel?: string;
  showAction?: boolean;
  dismissible?: boolean;
  showIcon?: boolean;
  fullWidth?: boolean;
  showBorder?: boolean;
  theme?: Theme;
  hue?: HueVariant;
}

export function ToastPreview({
  variant = "default",
  message = "Toast Info",
  actionLabel = "Undo",
  showAction = true,
  dismissible = true,
  showIcon = true,
  fullWidth = false,
  showBorder = false,
  theme,
  hue,
}: ToastPreviewProps) {
  return (
    <div className="ds-toast-preview-container">
      <div className="ds-toast-preview-canvas">
        <Toast
          variant={variant}
          message={message}
          actionLabel={actionLabel}
          showAction={showAction}
          dismissible={dismissible}
          showIcon={showIcon}
          fullWidth={fullWidth}
          showBorder={showBorder}
          onAction={() => {}}
          onDismiss={() => {}}
        />
      </div>
    </div>
  );
}
