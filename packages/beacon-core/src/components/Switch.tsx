"use client";

import { useState, useCallback, useMemo } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { SunIcon, MoonIcon } from "../icons";

type SwitchStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  showIcons?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
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
    const [status, setStatus] = useState<SwitchStatus>("default");

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
        if (!disabled) {
          setStatus("hovered");
        }
        onMouseEnter?.(e);
      },
      [disabled, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          setStatus("default");
        }
        onMouseLeave?.(e);
      },
      [disabled, onMouseLeave]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled) {
          setStatus("focused");
        }
        onFocus?.(e);
      },
      [disabled, onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (!disabled) {
          setStatus("default");
        }
        onBlur?.(e);
      },
      [disabled, onBlur]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          setStatus("pressed");
        }
        onMouseDown?.(e);
      },
      [disabled, onMouseDown]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          setStatus("hovered");
        }
        onMouseUp?.(e);
      },
      [disabled, onMouseUp]
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
