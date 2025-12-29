"use client";

import { Switch as BeaconSwitch } from "beacon-ui";

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
  return (
    <BeaconSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      showIcons={showIcons}
    />
  );
}

