"use client";

import { forwardRef, useState, useCallback } from "react";
import { CheckboxPreview } from "./CheckboxPreview";
import { useThemeSafe } from "../providers/ThemeProvider";

type CheckboxStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  showLabel?: boolean;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      id,
      "aria-label": ariaLabel,
      label,
      showLabel = false,
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
      ...rest
    },
    ref
  ) => {
    const themeContext = useThemeSafe();
    const theme = themeContext?.theme;
    const hue = themeContext?.hue;

    const [status, setStatus] = useState<CheckboxStatus>("default");

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
          setStatus("default");
        }
        onMouseUp?.(e);
      },
      [disabled, onMouseUp]
    );

    const currentStatus: CheckboxStatus = disabled ? "disabled" : status;

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
        <CheckboxPreview
          checked={checked}
          status={currentStatus}
          label={label}
          showLabel={showLabel}
          theme={theme}
          hue={hue}
        />
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

