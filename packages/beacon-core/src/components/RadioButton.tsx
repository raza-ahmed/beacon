"use client";

import { useMemo, useState, useCallback } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";

type RadioButtonStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  label?: string;
  showLabel?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

const RADIO_SIZE = 20;

export function RadioButton({
  selected = false,
  onChange,
  disabled = false,
  id,
  label = "Radio Button",
  showLabel = true,
  className,
  style,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ref,
  ...rest
}: RadioButtonProps) {
    useThemeSafe(); // Ensure theme context is available
    const [status, setStatus] = useState<RadioButtonStatus>("default");

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (!disabled && onChange) {
          onChange(!selected);
        }
        onClick?.(e);
      },
      [selected, disabled, onChange, onClick]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (!disabled) {
          setStatus("focused");
        }
        onFocus?.(e);
      },
      [disabled, onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (!disabled) {
          setStatus("default");
        }
        onBlur?.(e);
      },
      [disabled, onBlur]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (!disabled) {
          setStatus("hovered");
        }
        onMouseEnter?.(e);
      },
      [disabled, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (!disabled) {
          setStatus("default");
        }
        onMouseLeave?.(e);
      },
      [disabled, onMouseLeave]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (!disabled) {
          setStatus("pressed");
        }
        onMouseDown?.(e);
      },
      [disabled, onMouseDown]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (!disabled) {
          setStatus("default");
        }
        onMouseUp?.(e);
      },
      [disabled, onMouseUp]
    );

    const currentStatus: RadioButtonStatus = disabled ? "disabled" : status;

    const radioStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        width: `${RADIO_SIZE}px`,
        height: `${RADIO_SIZE}px`,
        borderRadius: "var(--corner-radius-full)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        position: "relative",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
      };

      if (selected) {
        // Selected state
        if (disabled) {
          return {
            ...baseStyles,
            borderWidth: "var(--border-width-150)",
            borderStyle: "solid",
            borderColor: "var(--border-primary-disabled)",
            backgroundColor: "transparent",
          };
        }
        if (currentStatus === "hovered") {
          return {
            ...baseStyles,
            borderWidth: "var(--border-width-150)",
            borderStyle: "solid",
            borderColor: "var(--border-primary-on-hover)",
            backgroundColor: "transparent",
          };
        }
        if (currentStatus === "focused" || currentStatus === "pressed") {
          return {
            ...baseStyles,
            borderWidth: "var(--border-width-150)",
            borderStyle: "solid",
            borderColor: "var(--border-primary-pressed)",
            backgroundColor: "transparent",
          };
        }
        // Default selected
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-150)",
          borderStyle: "solid",
          borderColor: "var(--border-primary)",
          backgroundColor: "transparent",
        };
      } else {
        // Unselected state
        if (disabled) {
          return {
            ...baseStyles,
            borderWidth: "var(--border-width-25)",
            borderStyle: "solid",
            borderColor: "var(--border-disabled)",
            backgroundColor: "transparent",
          };
        }
        if (currentStatus === "hovered" || currentStatus === "focused" || currentStatus === "pressed") {
          return {
            ...baseStyles,
            borderWidth: "var(--border-width-25)",
            borderStyle: "solid",
            borderColor: "var(--border-neutral-primary)",
            backgroundColor: "transparent",
          };
        }
        // Default unselected
        return {
          ...baseStyles,
          borderWidth: "var(--border-width-25)",
          borderStyle: "solid",
          borderColor: "var(--border-neutral-primary)",
          backgroundColor: "transparent",
        };
      }
    }, [selected, currentStatus, disabled]);

    const labelStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        fontFamily: "var(--font-secondary)",
        fontSize: "var(--body-small-text-size)",
        lineHeight: "var(--body-small-line-height)",
        fontWeight: "var(--font-weight-secondary-medium)",
        margin: 0,
      };

      if (disabled) {
        return {
          ...baseStyles,
          color: "var(--fg-disabled)",
        };
      }

      return {
        ...baseStyles,
        color: "var(--fg-neutral-secondary)",
      };
    }, [disabled]);

    const focusRingStyles = useMemo(() => {
      if (currentStatus !== "focused") return null;

      return {
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "28px",
        height: "28px",
        marginTop: "0",
        marginLeft: "0",
        borderRadius: "var(--corner-radius-full)",
        borderWidth: "var(--border-width-25)",
        borderStyle: "solid",
        borderColor: selected
          ? "var(--border-primary)"
          : "var(--border-neutral-primary)",
        pointerEvents: "none" as const,
      };
    }, [currentStatus, selected]);

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-200)",
          position: "relative",
        }}
        className={className}
      >
        <div style={radioStyles}>
          {focusRingStyles && <div style={focusRingStyles} />}
        </div>
        <input
          ref={ref}
          type="radio"
          id={id}
          checked={selected}
          disabled={disabled}
          onChange={() => {
            if (!disabled && onChange) {
              onChange(!selected);
            }
          }}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{
            position: "absolute",
            opacity: 0,
            width: `${RADIO_SIZE}px`,
            height: `${RADIO_SIZE}px`,
            margin: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            ...style,
          }}
          {...rest}
        />
        {showLabel && label && (
          <label htmlFor={id} style={labelStyles}>
            {label}
          </label>
        )}
      </div>
    );
}
