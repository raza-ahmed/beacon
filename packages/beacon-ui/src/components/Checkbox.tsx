"use client";

import { useState, useCallback, useMemo, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { CheckIcon } from "../icons";

export type CheckboxStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

export interface CheckboxProps extends Omit<ComponentPropsWithRef<"button">, "onChange" | "type"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  showLabel?: boolean;
  status?: CheckboxStatus;
}

const CHECKBOX_SIZE = 20;
const ICON_SIZE = 16; // 20px box - 4px padding (2px each side) = 16px

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
  label,
  showLabel = false,
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
}: CheckboxProps) {
    useThemeSafe(); // Ensure theme context is available
    const [internalStatus, setInternalStatus] = useState<CheckboxStatus>("default");
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
          setInternalStatus("default");
        }
        onMouseUp?.(e);
      },
      [disabled, statusProp, onMouseUp]
    );

    const currentStatus: CheckboxStatus = disabled ? "disabled" : status;
    const isDisabled = disabled;

    const checkboxStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        width: `${CHECKBOX_SIZE}px`,
        height: `${CHECKBOX_SIZE}px`,
        borderRadius: "var(--corner-radius-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background-color 0.15s ease, border-color 0.15s ease",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      };

      if (checked) {
        // Checked state
        if (isDisabled) {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-disabled)",
            border: "none",
            padding: "var(--spacing-50)",
          };
        }
        if (currentStatus === "hovered") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-primary-on-hover)",
            border: "none",
            padding: "var(--spacing-50)",
          };
        }
        if (currentStatus === "focused" || currentStatus === "pressed") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-primary-pressed)",
            border: "none",
            padding: "var(--spacing-50)",
          };
        }
        // Default checked
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-primary)",
          border: "none",
          padding: "var(--spacing-50)",
        };
      } else {
        // Unchecked state
        if (isDisabled) {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-page-primary)",
            border: "var(--border-width-50) solid var(--border-neutral-tertiary)",
          };
        }
        if (currentStatus === "hovered" || currentStatus === "focused" || currentStatus === "pressed") {
          return {
            ...baseStyles,
            backgroundColor: "var(--bg-page-primary)",
            border: "var(--border-width-50) solid var(--border-neutral-primary)",
          };
        }
        // Default unchecked
        return {
          ...baseStyles,
          backgroundColor: "var(--bg-page-primary)",
          border: "var(--border-width-50) solid var(--border-neutral-secondary)",
        };
      }
    }, [checked, currentStatus, isDisabled]);

    const iconColor = useMemo(() => {
      if (isDisabled) {
        return "var(--fg-on-disabled)";
      }
      return "var(--static-white)";
    }, [isDisabled]);

    const labelStyles = useMemo(() => {
      const baseStyles: React.CSSProperties = {
        fontFamily: "var(--font-secondary)",
        fontSize: "var(--body-small-text-size)",
        lineHeight: "var(--body-small-line-height)",
        fontWeight: "var(--font-weight-secondary-medium)",
        margin: 0,
      };

      if (isDisabled) {
        return {
          ...baseStyles,
          color: "var(--fg-on-disabled)",
        };
      }

      if (checked) {
        return {
          ...baseStyles,
          color: "var(--fg-neutral-secondary)",
        };
      }

      return {
        ...baseStyles,
        color: "var(--fg-neutral-tertiary)",
      };
    }, [isDisabled, checked]);

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
        borderRadius: "var(--corner-radius-200)",
        borderWidth: "var(--border-width-25)",
        borderStyle: "solid",
        borderColor: checked
          ? "var(--border-primary)"
          : "var(--border-neutral-primary)",
        pointerEvents: "none" as const,
      };
    }, [currentStatus, checked]);

    return (
      <button
        ref={ref}
        type="button"
        id={id}
        role="checkbox"
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-200)",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {focusRingStyles && <div style={focusRingStyles} />}
            <div style={checkboxStyles}>
              {checked && (
                <div
                  style={{
                    color: iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: `${ICON_SIZE}px`,
                    height: `${ICON_SIZE}px`,
                    maxWidth: `${ICON_SIZE}px`,
                    maxHeight: `${ICON_SIZE}px`,
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <CheckIcon size={ICON_SIZE} />
                </div>
              )}
            </div>
          </div>
          {showLabel && label && <p style={labelStyles}>{label}</p>}
        </div>
      </button>
    );
}
