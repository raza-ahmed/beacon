"use client";

import { useMemo, useState, useRef, useEffect, useCallback, ComponentPropsWithRef, ReactNode } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipTrigger = "hover" | "click" | "focus";

export interface TooltipProps extends Omit<ComponentPropsWithRef<"div">, "children" | "content"> {
  /**
   * The content to display in the tooltip.
   */
  content: ReactNode;
  /**
   * The element that triggers the tooltip.
   */
  children: ReactNode;
  /**
   * Position of the tooltip relative to the trigger element.
   */
  position?: TooltipPosition;
  /**
   * How the tooltip is triggered.
   */
  trigger?: TooltipTrigger;
  /**
   * Delay in milliseconds before showing the tooltip on hover.
   */
  delay?: number;
  /**
   * Maximum width of the tooltip.
   */
  maxWidth?: string;
  /**
   * Whether to show the arrow pointer.
   */
  showArrow?: boolean;
  /**
   * Whether to show the border.
   */
  showBorder?: boolean;
  /**
   * Whether to show the shadow.
   */
  showShadow?: boolean;
}

export function Tooltip({
  content,
  children,
  position = "top",
  trigger = "hover",
  delay = 200,
  maxWidth = "200px",
  showArrow = true,
  showBorder = true,
  showShadow = true,
  className,
  style,
  ...rest
}: TooltipProps) {
  useThemeSafe();
  
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const arrowSize = showArrow ? 6 : 0;
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top - tooltipRect.height - gap - arrowSize;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + gap + arrowSize;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap - arrowSize;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + gap + arrowSize;
        break;
    }

    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 8) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }

    if (top < 8) {
      top = 8;
    } else if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    setTooltipPosition({ top, left });
  }, [position, showArrow]);

  const showTooltip = useCallback(() => {
    if (delay > 0 && trigger === "hover") {
      delayTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  }, [delay, trigger]);

  const hideTooltip = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      // First, set a temporary position so tooltip is visible and can be measured
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setTooltipPosition({ top: triggerRect.top, left: triggerRect.left });
      
      // Then calculate the correct position after tooltip is rendered and measured
      const timeoutId = setTimeout(() => {
        if (tooltipRef.current && triggerRef.current) {
          calculatePosition();
        }
      }, 10);
      
      const handleResize = () => {
        if (tooltipRef.current && triggerRef.current) {
          calculatePosition();
        }
      };
      const handleScroll = () => {
        if (tooltipRef.current && triggerRef.current) {
          calculatePosition();
        }
      };
      
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    } else if (!isVisible) {
      // Reset position when hidden
      setTooltipPosition(null);
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        showTooltip();
      }
    },
    [trigger, showTooltip]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        hideTooltip();
      }
    },
    [trigger, hideTooltip]
  );

  const handleClick = trigger === "click" ? () => setIsVisible(!isVisible) : undefined;
  const handleFocus = trigger === "focus" ? showTooltip : undefined;
  const handleBlur = trigger === "focus" ? hideTooltip : undefined;

  const tooltipStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: "fixed",
      zIndex: 10000,
      padding: "var(--spacing-100) var(--spacing-200)",
      borderRadius: "var(--corner-radius-100)",
      backgroundColor: "var(--bg-page-primary)",
      color: "var(--fg-neutral)",
      fontFamily: "var(--font-secondary)",
      fontSize: "var(--body-extra-small-text-size)",
      lineHeight: "var(--body-extra-small-line-height)",
      fontWeight: "var(--font-weight-secondary-regular)",
      maxWidth,
      wordWrap: "break-word",
      pointerEvents: "none",
      ...style,
    };

    if (showBorder) {
      baseStyles.border = "var(--border-width-25) solid var(--border-strong-100)";
    }

    if (showShadow) {
      baseStyles.boxShadow = "var(--drop-shadow-200)";
    }

    if (tooltipPosition) {
      baseStyles.top = `${tooltipPosition.top}px`;
      baseStyles.left = `${tooltipPosition.left}px`;
      baseStyles.opacity = isVisible ? 1 : 0;
      baseStyles.visibility = isVisible ? "visible" : "hidden";
      baseStyles.transition = "opacity 0.15s ease, visibility 0.15s ease";
    } else {
      baseStyles.opacity = 0;
      baseStyles.visibility = "hidden";
      baseStyles.top = "-9999px";
      baseStyles.left = "-9999px";
    }

    return baseStyles;
  }, [isVisible, tooltipPosition, maxWidth, showBorder, showShadow, style]);

  const arrowStyles = useMemo((): React.CSSProperties | null => {
    if (!showArrow) return null;

    const arrowSize = 6;
    const transparent = `${arrowSize}px solid transparent`;
    const colored = `${arrowSize}px solid var(--bg-page-primary)`;

    switch (position) {
      case "top":
        return {
          position: "absolute",
          width: 0,
          height: 0,
          bottom: `-${arrowSize}px`,
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: transparent,
          borderRight: transparent,
          borderTop: colored,
        };
      case "bottom":
        return {
          position: "absolute",
          width: 0,
          height: 0,
          top: `-${arrowSize}px`,
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: transparent,
          borderRight: transparent,
          borderBottom: colored,
        };
      case "left":
        return {
          position: "absolute",
          width: 0,
          height: 0,
          right: `-${arrowSize}px`,
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: transparent,
          borderBottom: transparent,
          borderLeft: colored,
        };
      case "right":
        return {
          position: "absolute",
          width: 0,
          height: 0,
          left: `-${arrowSize}px`,
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: transparent,
          borderBottom: transparent,
          borderRight: colored,
        };
    }
  }, [position, showArrow]);

  return (
    <>
      <div
        ref={triggerRef}
        style={{ display: "inline-block", position: "relative" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
      <div
        ref={tooltipRef}
        className={className}
        style={tooltipStyles}
        role="tooltip"
        aria-hidden={!isVisible}
        {...rest}
      >
        {content}
        {showArrow && arrowStyles && (
          <div style={arrowStyles} />
        )}
      </div>
    </>
  );
}
