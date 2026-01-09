"use client";

import type { Theme, HueVariant } from "@/tokens/types";
import { CheckIcon } from "./icons";
import { Switch } from "./Switch";
import { Input, Select } from "beacon-ui";
import type { SelectOption } from "beacon-ui";
import type { ToastVariant } from "beacon-ui";

interface ToastControlsProps {
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
  onVariantChange?: (variant: ToastVariant) => void;
  onMessageChange?: (message: string) => void;
  onActionLabelChange?: (label: string) => void;
  onShowActionChange?: (show: boolean) => void;
  onDismissibleChange?: (dismissible: boolean) => void;
  onShowIconChange?: (show: boolean) => void;
  onFullWidthChange?: (fullWidth: boolean) => void;
  onShowBorderChange?: (show: boolean) => void;
  onThemeChange?: (theme: Theme) => void;
  onHueChange?: (hue: HueVariant) => void;
}

const VARIANT_OPTIONS: { value: ToastVariant; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
  { value: "warning", label: "Warning" },
];

const HUE_OPTIONS: { value: HueVariant; label: string; color: string }[] = [
  { value: "chromatic-prime", label: "Chromatic", color: "var(--color-chromatic-500)" },
  { value: "hue-sky", label: "Sky", color: "var(--color-blue-500)" },
  { value: "hue-indigo", label: "Indigo", color: "var(--color-purple-500)" },
];

export function ToastControls({
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
  onVariantChange,
  onMessageChange,
  onActionLabelChange,
  onShowActionChange,
  onDismissibleChange,
  onShowIconChange,
  onFullWidthChange,
  onShowBorderChange,
  onThemeChange,
  onHueChange,
}: ToastControlsProps) {
  return (
    <div className="ds-toast-controls">
      <div className="ds-toast-control-group">
        <span className="ds-toast-control-label">Color</span>
        <div className="ds-color-control-row" role="group" aria-label="Color selection">
          <div className="ds-hue-swatch-grid">
            {HUE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ds-hue-swatch ds-hue-swatch--small ${hue === opt.value ? "ds-hue-swatch--active" : ""}`}
                onClick={() => onHueChange?.(opt.value)}
                style={{ backgroundColor: opt.color }}
                aria-label={`Select ${opt.label} hue`}
                title={opt.label}
              >
                {hue === opt.value && <CheckIcon size="sm" className="ds-hue-swatch__check" />}
              </button>
            ))}
          </div>
          <div className="ds-theme-toggle">
            <Switch
              id="toast-theme-toggle"
              checked={theme === "dark"}
              onChange={(checked) => onThemeChange?.(checked ? "dark" : "light")}
              showIcons={true}
              ariaLabel="Theme toggle"
            />
          </div>
        </div>
      </div>

      <div className="ds-toast-control-group ds-toast-control-group--row">
        <div className="ds-toast-control-field">
          <label htmlFor="toast-variant-select" className="ds-toast-control-label">
            Variant
          </label>
          <Select
            id="toast-variant-select"
            size="md"
            showLabel={false}
            showStartIcon={false}
            showEndIcon={true}
            selectedValue={variant}
            options={VARIANT_OPTIONS as SelectOption[]}
            onSelect={(value) => onVariantChange?.(value as ToastVariant)}
          />
        </div>
      </div>

      <div className="ds-toast-control-group">
        <label htmlFor="toast-message-input" className="ds-toast-control-label">
          Message
        </label>
        <Input
          id="toast-message-input"
          size="md"
          showLabel={false}
          value={message}
          onChange={(e) => onMessageChange?.(e.target.value)}
          placeholder="Enter message text"
        />
      </div>

      <div className="ds-toast-control-group">
        <label htmlFor="toast-action-label-input" className="ds-toast-control-label">
          Action Label
        </label>
        <Input
          id="toast-action-label-input"
          size="md"
          showLabel={false}
          value={actionLabel}
          onChange={(e) => onActionLabelChange?.(e.target.value)}
          placeholder="Enter action label"
        />
      </div>

      <div className="ds-toast-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-toast-control-label">Show Action</span>
            <Switch
              id="toast-show-action"
              checked={showAction}
              onChange={onShowActionChange}
              ariaLabel="Show Action"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-toast-control-label">Dismissible</span>
            <Switch
              id="toast-dismissible"
              checked={dismissible}
              onChange={onDismissibleChange}
              ariaLabel="Dismissible"
            />
          </div>
        </div>
      </div>

      <div className="ds-toast-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-toast-control-label">Show Icon</span>
            <Switch
              id="toast-show-icon"
              checked={showIcon}
              onChange={onShowIconChange}
              ariaLabel="Show Icon"
            />
          </div>
          <div className="ds-icon-fill-section">
            <span className="ds-toast-control-label">Full Width</span>
            <Switch
              id="toast-full-width"
              checked={fullWidth}
              onChange={onFullWidthChange}
              ariaLabel="Full Width"
            />
          </div>
        </div>
      </div>

      <div className="ds-toast-control-group">
        <div className="ds-icon-fill-row">
          <div className="ds-icon-fill-section">
            <span className="ds-toast-control-label">Border</span>
            <Switch
              id="toast-show-border"
              checked={showBorder}
              onChange={onShowBorderChange}
              ariaLabel="Border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
