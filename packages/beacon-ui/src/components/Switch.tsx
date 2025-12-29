"use client";

import { useState, useCallback, useMemo, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { SunIcon, MoonIcon } from "../icons";

export type SwitchStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

export interface SwitchProps extends Omit<ComponentPropsWithRef<"button">, "onChange" | "type"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  showIcons?: boolean;
  status?: SwitchStatus;
}

const TRACK_WIDTH = "52px";
const HANDLE_SIZE = 24;
const ICON_CONTAINER_SIZE = 32;
const ICON_SIZE = 20;

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
  showIcons = false,
  status: statusProp,
  className,
  style,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onMouseDown,
  onMouseUp,
  ref,
  ...rest
}: SwitchProps) {
    useThemeSafe(); // Ensure theme context is available
    const [internalStatus, setInternalStatus] = useState<SwitchStatus>("default");
    const status = statusProp ?? internalStatus;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && onChange) {
          onChange(!checked);
        }
        onClick?.(e);
      },
      [checked, disabled, onChange, onClick]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) {
          onKeyDown?.(e);
          return;
        }
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (onChange) {
            onChange(!checked);
          }
        }
        onKeyDown?.(e);
      },
      [checked, disabled, onChange, onKeyDown]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !statusProp) {
          setInternalStatus("hovered");
        }
        onMouseEnter?.(e);
      },
      [disabled, statusProp, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !statusProp) {
          setInternalStatus("default");
        }
        onMouseLeave?.(e);
      },
      [disabled, statusProp, onMouseLeave]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled && !statusProp) {
          setInternalStatus("focused");
        }
        onFocus?.(e);
      },
      [disabled, statusProp, onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled && !statusProp) {
          setInternalStatus("default");
        }
        onBlur?.(e);
      },
      [disabled, statusProp, onBlur]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !statusProp) {
          setInternalStatus("pressed");
        }
        onMouseDown?.(e);
      },
      [disabled, statusProp, onMouseDown]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !statusProp) {
          setInternalStatus("hovered");
        }
        onMouseUp?.(e);
      },
      [disabled, statusProp, onMouseUp]
    );

    const currentStatus: SwitchStatus = disabled ? "disabled" : status;
    const isDisabled = disabled;

    const trackStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        padding: "var(--spacing-50)",
        borderRadius: "var(--corner-radius-full)",
        borderWidth: "var(--border-width-25)",
        borderStyle: "solid",
        position: "relative",
        transition: "background-color 0.15s ease, border-color 0.15s ease",
      };

      if (showIcons) {
        // With icons variant
        if (currentStatus === "disabled") {
          return {
            ...baseStyles,
            width: "auto",
            backgroundColor: "var(--bg-page-primary)",
            borderColor: "var(--border-strong-100)",
            justifyContent: "flex-end",
          };
        }
        if (currentStatus === "hovered") {
          return {
            ...baseStyles,
            width: "auto",
            backgroundColor: "var(--bg-page-secondary)",
            borderColor: "var(--border-strong-200)",
            justifyContent: "flex-end",
          };
        }
        if (currentStatus === "focused" || currentStatus === "pressed") {
          return {
            ...baseStyles,
            width: "auto",
            backgroundColor: "var(--bg-page-secondary)",
            borderColor: "var(--border-neutral-primary)",
            justifyContent: "flex-end",
          };
        }
        return {
          ...baseStyles,
          width: "auto",
          backgroundColor: "var(--bg-page-primary)",
          borderColor: "var(--border-strong-200)",
          justifyContent: "flex-end",
        };
      }

      // Default variant (no icons)
      if (currentStatus === "disabled") {
        if (checked) {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-primary-disabled)",
            borderColor: "var(--border-strong-100)",
            justifyContent: "flex-end",
          };
        } else {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-disabled)",
            borderColor: "var(--border-strong-100)",
            justifyContent: "flex-start",
          };
        }
      }

      if (checked) {
        if (currentStatus === "hovered") {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-primary-on-hover)",
            borderColor: "var(--border-strong-100)",
            justifyContent: "flex-end",
          };
        }
        if (currentStatus === "focused") {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-primary-on-focused)",
            borderColor: "var(--border-primary)",
            justifyContent: "flex-end",
          };
        }
        if (currentStatus === "pressed") {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-primary-pressed)",
            borderColor: "var(--border-primary)",
            justifyContent: "flex-end",
          };
        }
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-end",
        };
      } else {
        if (currentStatus === "hovered") {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-page-secondary)",
            borderColor: "var(--border-strong-100)",
            justifyContent: "flex-start",
          };
        }
        if (currentStatus === "focused") {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-page-secondary)",
            borderColor: "var(--border-neutral-secondary)",
            justifyContent: "flex-start",
          };
        }
        if (currentStatus === "pressed") {
          return {
            ...baseStyles,
            width: TRACK_WIDTH,
            backgroundColor: "var(--bg-page-secondary)",
            borderColor: "var(--border-strong)",
            justifyContent: "flex-start",
          };
        }
        return {
          ...baseStyles,
          width: TRACK_WIDTH,
          backgroundColor: "var(--bg-page-primary)",
          borderColor: "var(--border-strong-100)",
          justifyContent: "flex-start",
        };
      }
    }, [checked, currentStatus, showIcons]);

    const handleStyles = useMemo(() => {
      return {
        width: `${HANDLE_SIZE}px`,
        height: `${HANDLE_SIZE}px`,
        borderRadius: "var(--corner-radius-full)",
        backgroundColor: checked ? "var(--fg-on-action)" : "var(--fg-disabled)",
        flexShrink: 0,
        boxShadow: "var(--shadow-subtle)",
      };
    }, [checked]);

    const nightContainerStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${ICON_CONTAINER_SIZE}px`,
        height: `${ICON_CONTAINER_SIZE}px`,
        borderRadius: "var(--corner-radius-full)",
        flexShrink: 0,
        border: "none",
      };

      if (checked) {
        return {
          ...baseStyles,
          backgroundColor: "transparent",
        };
      } else {
        if (currentStatus === "disabled") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-page-secondary)",
          };
        }
        if (currentStatus === "pressed") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-page-tertiary)",
          };
        }
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-tertiary)",
        };
      }
    }, [checked, currentStatus]);

    const dayContainerStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${ICON_CONTAINER_SIZE}px`,
        height: `${ICON_CONTAINER_SIZE}px`,
        borderRadius: "var(--corner-radius-full)",
        flexShrink: 0,
        border: "none",
      };

      if (checked) {
        if (currentStatus === "disabled") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-page-secondary)",
          };
        }
        if (currentStatus === "pressed") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-page-tertiary)",
          };
        }
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-tertiary)",
        };
      } else {
        return {
          ...baseStyles,
          backgroundColor: "transparent",
        };
      }
    }, [checked, currentStatus]);

    const nightIconColor = useMemo(() => {
      if (currentStatus === "disabled") {
        return "var(--fg-disabled)";
      }
      if (checked) {
        return "var(--fg-primary)";
      }
      return "var(--fg-neutral)";
    }, [checked, currentStatus]);

    const dayIconColor = useMemo(() => {
      if (currentStatus === "disabled") {
        return "var(--fg-disabled)";
      }
      if (checked) {
        return "var(--fg-neutral)";
      }
      return "var(--fg-warning)";
    }, [checked, currentStatus]);

    const switchElement = showIcons ? (
      <div style={trackStyles}>
        <div style={nightContainerStyles}>
          <div style={{ color: nightIconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MoonIcon size={ICON_SIZE} />
          </div>
        </div>
        <div style={dayContainerStyles}>
          <div style={{ color: dayIconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SunIcon size={ICON_SIZE} />
          </div>
        </div>
      </div>
    ) : (
      <div style={trackStyles}>
        <div style={handleStyles} />
      </div>
    );

    return (
      <button
        ref={ref}
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        disabled={disabled}
        className={className}
        style={{
          border: "none",
          background: "none",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          ...style,
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...rest}
      >
        {switchElement}
      </button>
    );
}
