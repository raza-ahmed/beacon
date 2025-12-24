"use client";

import { useState, useCallback } from "react";
import { SwitchPreview } from "./SwitchPreview";
import { useThemeSafe } from "@/providers/ThemeProvider";

type SwitchStatus = "default" | "hovered" | "focused" | "pressed" | "disabled";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  showIcons?: boolean;
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  id,
  ariaLabel,
  showIcons = false,
}: SwitchProps) {
  const themeContext = useThemeSafe();
  const theme = themeContext?.theme;
  const hue = themeContext?.hue;

  const [status, setStatus] = useState<SwitchStatus>("default");

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
      setStatus("hovered");
    }
  }, [disabled]);

  const currentStatus: SwitchStatus = disabled ? "disabled" : status;

  return (
    <button
      type="button"
      id={id}
      role="switch"
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
      <SwitchPreview
        checked={checked}
        status={currentStatus}
        showIcons={showIcons}
        theme={theme}
        hue={hue}
      />
    </button>
  );
}

