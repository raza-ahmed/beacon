"use client";

import { useState, useCallback } from "react";
import { CheckboxPreview } from "./CheckboxPreview";
import { useThemeSafe } from "@/providers/ThemeProvider";

type CheckboxStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  label?: string;
  showLabel?: boolean;
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  id,
  ariaLabel,
  label,
  showLabel = false,
}: CheckboxProps) {
  const themeContext = useThemeSafe();
  const theme = themeContext?.theme;
  const hue = themeContext?.hue;

  const [status, setStatus] = useState<CheckboxStatus>("default");

  const handleClick = useCallback(() => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (onChange) {
          onChange(!checked);
        }
      }
    },
    [checked, disabled, onChange]
  );

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setStatus("hovered");
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      setStatus("default");
    }
  }, [disabled]);

  const handleFocus = useCallback(() => {
    if (!disabled) {
      setStatus("focused");
    }
  }, [disabled]);

  const handleBlur = useCallback(() => {
    if (!disabled) {
      setStatus("default");
    }
  }, [disabled]);

  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setStatus("pressed");
    }
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    if (!disabled) {
      setStatus("default");
    }
  }, [disabled]);

  const currentStatus: CheckboxStatus = disabled ? "disabled" : status;

  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
      }}
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

