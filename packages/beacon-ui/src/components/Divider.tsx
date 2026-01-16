"use client";

import { useMemo, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import { ArrowDownFallSlotIcon } from "../icons";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerSlotPosition = "default" | "center" | "left" | "right" | "top" | "bottom";

export interface DividerProps extends Omit<ComponentPropsWithRef<"div">, "slot"> {
  orientation?: DividerOrientation;
  slot?: boolean;
  slotPosition?: DividerSlotPosition;
  slotContent?: React.ReactNode;
  color?: string;
  width?: string | "100%";
}

export function Divider({
  orientation = "horizontal",
  slot = false,
  slotPosition = "default",
  slotContent,
  color,
  width = "100%",
  className,
  style,
  ref,
  ...rest
}: DividerProps) {
  useThemeSafe();

  const dividerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
    };

    if (orientation === "horizontal") {
      baseStyles.flexDirection = "row";
      baseStyles.width = width;
      baseStyles.gap = slot ? "var(--spacing-100)" : "0";
    } else {
      baseStyles.flexDirection = "column";
      baseStyles.height = width; // For vertical, width prop controls height
      baseStyles.gap = slot ? "var(--spacing-100)" : "0";
    }

    return { ...baseStyles, ...style };
  }, [orientation, slot, width, style]);

  const lineStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: color || "var(--border-neutral-secondary)",
    };

    if (orientation === "horizontal") {
      baseStyles.height = "1px";
      baseStyles.minHeight = "1px";
      baseStyles.width = "100%";
    } else {
      baseStyles.width = "1px";
      baseStyles.minWidth = "1px";
      baseStyles.height = "100%";
    }

    return baseStyles;
  }, [orientation, color]);

  const slotStyles = useMemo(() => {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      minWidth: "24px",
      minHeight: "24px",
      flexShrink: 0,
      backgroundColor: "var(--bg-warning-tonal)",
      border: "var(--border-width-25) dashed var(--border-warning)",
      borderRadius: "var(--corner-radius-100)",
      padding: "var(--spacing-200)",
    } as React.CSSProperties;
  }, []);

  const iconContainerStyles = useMemo(() => {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      flexShrink: 0,
      color: "var(--fg-warning-on-tonal)",
    } as React.CSSProperties;
  }, []);

  const renderSlot = () => {
    if (!slot) return null;

    const defaultSlotContent = (
      <div style={iconContainerStyles}>
        <ArrowDownFallSlotIcon size={16} />
      </div>
    );

    return (
      <div style={slotStyles}>
        {slotContent || defaultSlotContent}
      </div>
    );
  };

  const renderDivider = () => {
    if (!slot) {
      return <div style={lineStyles} />;
    }

    // With slot, need to handle different positions
    const flexLineStyles = {
      ...lineStyles,
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
    };

    if (orientation === "horizontal") {
      if (slotPosition === "left") {
        return (
          <>
            {renderSlot()}
            <div style={flexLineStyles} />
          </>
        );
      } else if (slotPosition === "right") {
        return (
          <>
            <div style={flexLineStyles} />
            {renderSlot()}
          </>
        );
      } else {
        // center or default
        return (
          <>
            <div style={flexLineStyles} />
            {renderSlot()}
            <div style={flexLineStyles} />
          </>
        );
      }
    } else {
      // vertical
      if (slotPosition === "top") {
        return (
          <>
            {renderSlot()}
            <div style={flexLineStyles} />
          </>
        );
      } else if (slotPosition === "bottom") {
        return (
          <>
            <div style={flexLineStyles} />
            {renderSlot()}
          </>
        );
      } else {
        // center or default
        return (
          <>
            <div style={flexLineStyles} />
            {renderSlot()}
            <div style={flexLineStyles} />
          </>
        );
      }
    }
  };

  return (
    <div ref={ref} className={className} style={dividerStyles} {...rest}>
      {renderDivider()}
    </div>
  );
}
