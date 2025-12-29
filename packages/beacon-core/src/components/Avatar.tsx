"use client";

import { useMemo, useState, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { UserPersonIcon } from "../icons";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarType = "icon" | "text" | "image";
export type AvatarColor = "primary" | "neutral" | "success" | "critical" | "warning";
export type AvatarVariant = "solid" | "faded";

export interface AvatarProps extends ComponentPropsWithRef<"div"> {
  size?: AvatarSize;
  type?: AvatarType;
  color?: AvatarColor;
  variant?: AvatarVariant;
  isRound?: boolean;
  hasStroke?: boolean;
  initials?: string;
  imageUrl?: string;
}

// Avatar container sizes
const CONTAINER_SIZE_CONFIG: Record<AvatarSize, { width: string; height: string }> = {
  sm: { width: "32px", height: "32px" },
  md: { width: "48px", height: "48px" },
  lg: { width: "64px", height: "64px" },
  xl: { width: "124px", height: "124px" },
};

// Icon sizes (no xl)
const ICON_SIZE_CONFIG: Record<Exclude<AvatarSize, "xl">, { size: number }> = {
  sm: { size: 16 },
  md: { size: 24 },
  lg: { size: 40 },
};

// Text sizes (no xl)
const TEXT_SIZE_CONFIG: Record<Exclude<AvatarSize, "xl">, { fontSize: string }> = {
  sm: { fontSize: "var(--body-small-text-size)" },
  md: { fontSize: "var(--body-regular-text-size)" },
  lg: { fontSize: "var(--heading-h5-text-size)" },
};

export function Avatar({
  size = "md",
  type = "icon",
  color = "primary",
  variant = "solid",
  isRound = false,
  hasStroke = false,
  initials = "JD",
  imageUrl,
  className,
  style,
  ref,
  ...rest
}: AvatarProps) {
  useThemeSafe(); // Ensure theme context is available
  const [imageError, setImageError] = useState(false);
  const containerSize = CONTAINER_SIZE_CONFIG[size];

    const avatarStyles = useMemo(() => {
      // Determine border color for stroke based on variant and color
      let borderColor = "";
      if (hasStroke) {
        if (variant === "solid") {
          // Solid variants use tonal border colors (except warning which uses solid)
          switch (color) {
            case "primary":
              borderColor = "var(--border-primary-tonal)";
              break;
            case "neutral":
              borderColor = "var(--border-strong-100)";
              break;
            case "success":
              borderColor = "var(--border-success-tonal)";
              break;
            case "critical":
              borderColor = "var(--border-critical-tonal)";
              break;
            case "warning":
              borderColor = "var(--border-warning)";
              break;
          }
        } else {
          // Faded variants use solid border colors
          switch (color) {
            case "primary":
              borderColor = "var(--border-primary)";
              break;
            case "neutral":
              borderColor = "var(--border-strong-100)";
              break;
            case "success":
              borderColor = "var(--border-success)";
              break;
            case "critical":
              borderColor = "var(--border-critical)";
              break;
            case "warning":
              borderColor = "var(--border-warning)";
              break;
          }
        }
      }

      const baseStyles: React.CSSProperties = {
        width: containerSize.width,
        height: containerSize.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        border: hasStroke ? `var(--border-width-50) solid ${borderColor}` : "none",
        boxSizing: "border-box",
      };

      // Corner radius: default 8px, or full (50%) if isRound
      if (isRound) {
        baseStyles.borderRadius = "50%";
      } else {
        baseStyles.borderRadius = "8px"; // Default 8px corner radius
      }

      // Background color based on color and variant
      let backgroundColor = "";
      let textColor = "var(--fg-on-action)";

      if (variant === "solid") {
        switch (color) {
          case "primary":
            backgroundColor = "var(--bg-primary)";
            break;
          case "neutral":
            backgroundColor = "var(--color-neutral-500)";
            break;
          case "success":
            backgroundColor = "var(--bg-success)";
            break;
          case "critical":
            backgroundColor = "var(--bg-critical)";
            break;
          case "warning":
            backgroundColor = "var(--bg-warning)";
            break;
        }
      } else {
        // faded variant
        switch (color) {
          case "primary":
            backgroundColor = "var(--bg-primary-tonal)";
            textColor = "var(--fg-primary-on-tonal)";
            break;
          case "neutral":
            backgroundColor = "var(--color-neutral-200)";
            textColor = "var(--fg-neutral)";
            break;
          case "success":
            backgroundColor = "var(--bg-success-tonal)";
            textColor = "var(--fg-success-on-tonal)";
            break;
          case "critical":
            backgroundColor = "var(--bg-critical-tonal)";
            textColor = "var(--fg-critical-on-tonal)";
            break;
          case "warning":
            backgroundColor = "var(--bg-warning-tonal)";
            textColor = "var(--fg-warning-on-tonal)";
            break;
        }
      }

      baseStyles.backgroundColor = backgroundColor;
      baseStyles.color = textColor;

      return { ...baseStyles, ...style };
    }, [containerSize, isRound, hasStroke, color, variant, style]);

    const handleImageError = () => {
      setImageError(true);
    };

    const renderContent = () => {
      if (type === "image" && imageUrl && !imageError) {
        return (
          <img
            src={imageUrl}
            alt="Avatar"
            onError={handleImageError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        );
      }

      if (type === "text" || (type === "image" && imageError)) {
        // Text type: no xl size
        const textSize = size === "xl" ? "lg" : size;
        const textConfig = TEXT_SIZE_CONFIG[textSize as Exclude<AvatarSize, "xl">];
        
        return (
          <span
            style={{
              fontSize: textConfig.fontSize,
              fontWeight: "var(--font-weight-secondary-medium)",
              lineHeight: "1",
              userSelect: "none",
            }}
          >
            {initials}
          </span>
        );
      }

      // Icon type: no xl size
      const iconSize = size === "xl" ? "lg" : size;
      const iconConfig = ICON_SIZE_CONFIG[iconSize as Exclude<AvatarSize, "xl">];
      
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UserPersonIcon size={iconConfig.size} />
        </div>
      );
    };

    return (
      <div ref={ref} className={className} style={avatarStyles} {...rest}>
        {renderContent()}
      </div>
    );
}
