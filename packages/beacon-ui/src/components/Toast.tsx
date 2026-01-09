"use client";

import { useMemo, type ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { AlertTriangleErrorIcon, CheckIcon, CircleErrorIcon, CloseIcon } from "../icons";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface ToastProps extends ComponentPropsWithRef<"div"> {
  /**
   * Visual tone of the toast.
   */
  variant?: ToastVariant;
  /**
   * Primary message content.
   */
  message?: React.ReactNode;
  /**
   * Optional action label (e.g. "Undo").
   */
  actionLabel?: string;
  /**
   * Called when the action is clicked.
   */
  onAction?: () => void;
  /**
   * Toggle visibility of the action chip.
   */
  showAction?: boolean;
  /**
   * Show the dismiss control.
   */
  dismissible?: boolean;
  /**
   * Called when the close control is clicked.
   */
  onDismiss?: () => void;
  /**
   * Override the default leading icon.
   */
  leadingIcon?: React.ReactNode;
  /**
   * Hide the leading icon.
   */
  showIcon?: boolean;
  /**
   * Override the default close icon.
   */
  closeIcon?: React.ReactNode;
  /**
   * Stretch to the parent's width.
   */
  fullWidth?: boolean;
  /**
   * Show border around the toast.
   */
  showBorder?: boolean;
}

type VariantConfig = {
  background: string;
  text: string;
  iconColor: string;
  actionColor: string;
  closeColor: string;
  icon: React.ReactNode;
};

const VARIANT_CONFIG: Record<ToastVariant, VariantConfig> = {
  default: {
    background: "var(--bg-page-secondary)",
    text: "var(--fg-neutral)",
    iconColor: "var(--fg-neutral-tertiary)",
    actionColor: "var(--fg-primary)",
    closeColor: "var(--fg-neutral-tertiary)",
    icon: <CircleErrorIcon size={20} />,
  },
  success: {
    background: "var(--bg-success)",
    text: "var(--fg-on-action)",
    iconColor: "var(--fg-on-action)",
    actionColor: "var(--fg-on-action)",
    closeColor: "var(--fg-on-action)",
    icon: <CircleErrorIcon size={20} />,
  },
  error: {
    background: "var(--bg-critical)",
    text: "var(--fg-on-action)",
    iconColor: "var(--fg-on-action)",
    actionColor: "var(--fg-on-action)",
    closeColor: "var(--fg-on-action)",
    icon: <CircleErrorIcon size={20} />,
  },
  warning: {
    background: "var(--bg-warning)",
    text: "var(--fg-on-action)",
    iconColor: "var(--fg-on-action)",
    actionColor: "var(--fg-on-action)",
    closeColor: "var(--fg-on-action)",
    icon: <CircleErrorIcon size={20} />,
  },
};

export function Toast({
  variant = "default",
  message = "Toast Info",
  actionLabel = "Undo",
  onAction,
  showAction = true,
  dismissible = true,
  onDismiss,
  leadingIcon,
  showIcon = true,
  closeIcon,
  fullWidth = false,
  showBorder = false,
  className,
  style,
  role = "status",
  ...rest
}: ToastProps) {
  useThemeSafe();

  const config = VARIANT_CONFIG[variant];

  const containerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-200)",
      padding: "var(--spacing-200) var(--spacing-300)",
      borderRadius: "var(--corner-radius-200)",
      boxShadow: "var(--drop-shadow-200)",
      backgroundColor: config.background,
      color: config.text,
      width: fullWidth ? "100%" : "300px",
      ...style,
    };

    if (showBorder) {
      baseStyles.border = "var(--border-width-25) solid var(--border-strong-200)";
    }

    return baseStyles;
  }, [config.background, config.text, fullWidth, showBorder, style]);

  const messageStyles = useMemo(() => {
    return {
      flex: "1 1 0%",
      minWidth: 0,
      fontFamily: "var(--font-secondary)",
      fontSize: "var(--fonts-body-regular-text-size)",
      lineHeight: "var(--fonts-body-regular-line-height)",
      fontWeight: "var(--font-weight-secondary-regular)",
      color: config.text,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    } as React.CSSProperties;
  }, [config.text]);

  const actionStyles = useMemo(() => {
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--spacing-100)",
      padding: "var(--spacing-100) var(--spacing-200)",
      borderRadius: "var(--corner-radius-100)",
      border: "none",
      backgroundColor: "transparent",
      color: config.actionColor,
      fontFamily: "var(--font-secondary)",
      fontSize: "var(--body-small-text-size)",
      lineHeight: "var(--body-small-line-height)",
      fontWeight: "var(--font-weight-secondary-medium)",
      cursor: onAction ? "pointer" : "default",
      transition: "opacity 0.15s ease",
    } as React.CSSProperties;
  }, [config.actionColor, onAction]);

  const iconNode = showIcon ? leadingIcon ?? config.icon : null;

  return (
    <div
      role={role}
      aria-live={role === "alert" ? "assertive" : "polite"}
      className={className}
      style={containerStyles}
      {...rest}
    >
      {iconNode && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            flexShrink: 0,
            color: config.iconColor,
          }}
        >
          {iconNode}
        </span>
      )}

      <span style={messageStyles}>{message}</span>

      {showAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          style={actionStyles}
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "var(--corner-radius-100)",
            border: "none",
            backgroundColor: "transparent",
            color: config.closeColor,
            cursor: onDismiss ? "pointer" : "default",
            flexShrink: 0,
          }}
          aria-label="Dismiss notification"
        >
          {closeIcon ?? <CloseIcon size={20} />}
        </button>
      )}
    </div>
  );
}
