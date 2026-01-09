"use client";

import { useState, useCallback, useMemo, useRef, useEffect, ComponentPropsWithRef } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";

export type SliderStatus = "default" | "hover" | "active" | "disabled";

export interface SliderProps extends Omit<ComponentPropsWithRef<"div">, "onChange"> {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  rangeValue?: [number, number];
  onChange?: (value: number | [number, number]) => void;
  showTooltip?: boolean;
  showSteps?: boolean;
  stepCount?: number;
  stepLabels?: string[];
  showLabel?: boolean;
  label?: string;
  status?: SliderStatus;
  disabled?: boolean;
}

const TRACK_HEIGHT = 8;
const THUMB_SIZE = 16;
const STEP_DOT_SIZE = 4;

export function Slider({
  value = 60,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  rangeValue,
  onChange,
  showTooltip = false,
  showSteps = false,
  stepCount = 10,
  stepLabels,
  showLabel = true,
  label = "Slider",
  status: statusProp,
  disabled = false,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: SliderProps) {
  useThemeSafe();
  const [internalStatus, setInternalStatus] = useState<SliderStatus>("default");
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | null>(null);
  const [previewValue, setPreviewValue] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPositionRef = useRef<number | null>(null);
  const isLongPressActiveRef = useRef<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const status = statusProp ?? internalStatus;
  const isDisabled = disabled || status === "disabled";

  const currentRangeValue = range ? (rangeValue ?? [20, 80]) : null;
  const currentSingleValue = range ? null : value;
  const startValue = range ? (currentRangeValue?.[0] ?? 20) : (currentSingleValue ?? 60);
  const endValue = range ? (currentRangeValue?.[1] ?? 80) : (currentSingleValue ?? 60);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDisabled && !statusProp) {
        setInternalStatus("hover");
      }
      onMouseEnter?.(e);
    },
    [isDisabled, statusProp, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDisabled && !statusProp && !isDragging) {
        setInternalStatus("default");
      }
      onMouseLeave?.(e);
    },
    [isDisabled, statusProp, isDragging, onMouseLeave]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!isDisabled && !statusProp) {
        setInternalStatus("active");
      }
      onFocus?.(e);
    },
    [isDisabled, statusProp, onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!isDisabled && !statusProp && !isDragging) {
        setInternalStatus("default");
      }
      onBlur?.(e);
    },
    [isDisabled, statusProp, isDragging, onBlur]
  );

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step, value]
  );

  const getValueFromTouchPosition = useCallback(
    (clientX: number): number => {
      return getValueFromPosition(clientX);
    },
    [getValueFromPosition]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      const newValue = getValueFromPosition(e.clientX);
      if (range && currentRangeValue) {
        const [start, end] = currentRangeValue;
        const distToStart = Math.abs(newValue - start);
        const distToEnd = Math.abs(newValue - end);
        if (distToStart < distToEnd) {
          onChange?.([newValue, end]);
        } else {
          onChange?.([start, newValue]);
        }
      } else {
        onChange?.(newValue);
      }
    },
    [isDisabled, getValueFromPosition, range, currentRangeValue, onChange]
  );

  const handleTrackMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled || !showTooltip || isDragging) return;
      const newValue = getValueFromPosition(e.clientX);
      const rect = trackRef.current?.getBoundingClientRect();
      if (rect) {
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setPreviewValue(newValue);
        setPreviewPosition(percentage * 100);
      }
    },
    [isDisabled, showTooltip, isDragging, getValueFromPosition]
  );

  const handleTrackMouseLeave = useCallback(() => {
    setPreviewValue(null);
    setPreviewPosition(null);
  }, []);

  const handleTrackTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      const touch = e.touches[0];
      if (!touch) return;
      
      touchStartPositionRef.current = touch.clientX;
      setIsLongPressing(false);
      
      // Clear any existing timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }

      // Set up long-press timer
      isLongPressActiveRef.current = false;
      longPressTimerRef.current = setTimeout(() => {
        if (touchStartPositionRef.current !== null && showTooltip) {
          isLongPressActiveRef.current = true;
          setIsLongPressing(true);
          const newValue = getValueFromTouchPosition(touchStartPositionRef.current);
          const rect = trackRef.current?.getBoundingClientRect();
          if (rect) {
            const percentage = Math.max(0, Math.min(1, (touchStartPositionRef.current - rect.left) / rect.width));
            setPreviewValue(newValue);
            setPreviewPosition(percentage * 100);
          }
        }
      }, 500); // 500ms for long-press

      // Handle immediate touch (for quick taps)
      const handleTouchEnd = (endEvent: TouchEvent) => {
        const wasLongPress = isLongPressActiveRef.current;
        
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        if (wasLongPress) {
          // Long-press was active, set the value
          endEvent.preventDefault();
          if (touchStartPositionRef.current !== null) {
            const newValue = getValueFromTouchPosition(touchStartPositionRef.current);
            if (range && currentRangeValue) {
              const [start, end] = currentRangeValue;
              const distToStart = Math.abs(newValue - start);
              const distToEnd = Math.abs(newValue - end);
              if (distToStart < distToEnd) {
                onChange?.([newValue, end]);
              } else {
                onChange?.([start, newValue]);
              }
            } else {
              onChange?.(newValue);
            }
          }
          setIsLongPressing(false);
          isLongPressActiveRef.current = false;
          setPreviewValue(null);
          setPreviewPosition(null);
        } else {
          // Quick tap, set value immediately
          const endTouch = endEvent.changedTouches[0];
          if (endTouch) {
            const newValue = getValueFromTouchPosition(endTouch.clientX);
            if (range && currentRangeValue) {
              const [start, end] = currentRangeValue;
              const distToStart = Math.abs(newValue - start);
              const distToEnd = Math.abs(newValue - end);
              if (distToStart < distToEnd) {
                onChange?.([newValue, end]);
              } else {
                onChange?.([start, newValue]);
              }
            } else {
              onChange?.(newValue);
            }
          }
        }

        touchStartPositionRef.current = null;
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchcancel", handleTouchEnd);
        document.removeEventListener("touchmove", handleTouchMove);
      };

      const handleTouchMove = (moveEvent: TouchEvent) => {
        // If user moves finger, cancel long-press
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        setIsLongPressing(false);
        isLongPressActiveRef.current = false;
        setPreviewValue(null);
        setPreviewPosition(null);
        touchStartPositionRef.current = null;
      };

      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
    },
    [isDisabled, showTooltip, getValueFromTouchPosition, range, currentRangeValue, onChange, isLongPressing]
  );

  const handleThumbMouseDown = useCallback(
    (thumb: "start" | "end") => (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      e.preventDefault();
      setIsDragging(true);
      setActiveThumb(thumb);
      setPreviewValue(null);
      setPreviewPosition(null);
      if (!statusProp) {
        setInternalStatus("active");
      }

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newValue = getValueFromPosition(moveEvent.clientX);
        if (range && currentRangeValue) {
          const [start, end] = currentRangeValue;
          if (thumb === "start") {
            const clampedValue = Math.min(newValue, end);
            onChange?.([clampedValue, end]);
          } else {
            const clampedValue = Math.max(newValue, start);
            onChange?.([start, clampedValue]);
          }
        } else {
          onChange?.(newValue);
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setActiveThumb(null);
        if (!statusProp) {
          setInternalStatus("default");
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [isDisabled, statusProp, getValueFromPosition, range, currentRangeValue, onChange]
  );

  const handleThumbTouchStart = useCallback(
    (thumb: "start" | "end") => (e: React.TouchEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      e.preventDefault();
      setIsDragging(true);
      setActiveThumb(thumb);
      setPreviewValue(null);
      setPreviewPosition(null);
      setIsLongPressing(false);
      isLongPressActiveRef.current = false;
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      if (!statusProp) {
        setInternalStatus("active");
      }

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length === 0) return;
        const touch = moveEvent.touches[0];
        const newValue = getValueFromTouchPosition(touch.clientX);
        if (range && currentRangeValue) {
          const [start, end] = currentRangeValue;
          if (thumb === "start") {
            const clampedValue = Math.min(newValue, end);
            onChange?.([clampedValue, end]);
          } else {
            const clampedValue = Math.max(newValue, start);
            onChange?.([start, clampedValue]);
          }
        } else {
          onChange?.(newValue);
        }
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        setActiveThumb(null);
        if (!statusProp) {
          setInternalStatus("default");
        }
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchcancel", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
    },
    [isDisabled, statusProp, getValueFromTouchPosition, range, currentRangeValue, onChange]
  );

  const startPercentage = useMemo(() => {
    return ((startValue - min) / (max - min)) * 100;
  }, [startValue, min, max]);

  const endPercentage = useMemo(() => {
    return ((endValue - min) / (max - min)) * 100;
  }, [endValue, min, max]);

  const selectionWidth = useMemo(() => {
    return range ? endPercentage - startPercentage : startPercentage;
  }, [range, startPercentage, endPercentage]);

  const selectionLeft = useMemo(() => {
    return range ? startPercentage : 0;
  }, [range, startPercentage]);

  const trackStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: "relative",
      width: "100%",
      height: `${TRACK_HEIGHT}px`,
      borderRadius: "var(--corner-radius-full)",
      cursor: isDisabled ? "not-allowed" : "pointer",
    };

    if (status === "disabled") {
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-secondary)",
      };
    }
    if (status === "hover" || status === "active") {
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-secondary)",
      };
    }
    return {
      ...baseStyles,
      backgroundColor: "var(--bg-page-tertiary)",
    };
  }, [status, isDisabled]);

  const selectionStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      height: `${TRACK_HEIGHT}px`,
      borderRadius: "var(--corner-radius-full)",
      left: `${selectionLeft}%`,
      width: `${selectionWidth}%`,
      top: 0,
    };

    if (status === "disabled") {
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-primary-disabled)",
      };
    }
    return {
      ...baseStyles,
      backgroundColor: "var(--bg-primary)",
    };
  }, [status, selectionLeft, selectionWidth]);

  const thumbStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      width: `${THUMB_SIZE}px`,
      height: `${THUMB_SIZE}px`,
      borderRadius: "var(--corner-radius-full)",
      bottom: "-4px",
      cursor: isDisabled ? "not-allowed" : "grab",
      transform: "translateX(-50%)",
      border: "2px solid",
      boxShadow: "var(--shadow-subtle)",
      transition: status === "active" ? "none" : "all 0.15s ease",
      zIndex: 10,
    };

    if (status === "disabled") {
      return {
        ...baseStyles,
        backgroundColor: "var(--bg-page-secondary)",
        borderColor: "var(--border-strong-100)",
      };
    }
    return {
      ...baseStyles,
      backgroundColor: "var(--fg-on-action)",
      borderColor: "var(--bg-primary)",
    };
  }, [status, isDisabled]);

  const tooltipStyles = useMemo(() => {
    return {
      position: "absolute" as const,
      bottom: "calc(100% + 10px)",
      padding: "var(--spacing-100) var(--spacing-200)",
      borderRadius: "var(--corner-radius-100)",
      backgroundColor: "var(--bg-page-tertiary)",
      color: "var(--fg-neutral)",
      fontSize: "var(--fonts-body-extra-small-text-size)",
      lineHeight: "var(--fonts-body-extra-small-line-height)",
      fontFamily: "var(--font-secondary)",
      whiteSpace: "nowrap" as const,
      transform: "translateX(-50%)",
      pointerEvents: "none" as const,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
    } as React.CSSProperties;
  }, []);

  const labelStyles = useMemo(() => {
    return {
      fontSize: "var(--fonts-body-extra-small-text-size)",
      lineHeight: "var(--fonts-body-extra-small-line-height)",
      fontFamily: "var(--font-secondary)",
      color: status === "disabled" ? "var(--fg-disabled)" : "var(--fg-neutral)",
      marginBottom: "var(--spacing-100)",
      textAlign: "left" as const,
      width: "100%",
    } as React.CSSProperties;
  }, [status]);

  const getTooltipText = useCallback(
    (val: number): string => {
      if (stepLabels && stepLabels.length > 0) {
        const stepIndex = Math.round((val - min) / step);
        const clampedIndex = Math.max(0, Math.min(stepIndex, stepLabels.length - 1));
        return stepLabels[clampedIndex] ?? String(val);
      }
      return String(val);
    },
    [stepLabels, min, step]
  );

  // Cleanup long-press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const { id, ...restProps } = rest;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-100)",
        width: "100%",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...restProps}
    >
      {showLabel && (
        <p style={labelStyles}>{label}</p>
      )}
      <div
        ref={trackRef}
        id={id}
        role={range ? "group" : "slider"}
        aria-labelledby={id ? `${id}-label` : undefined}
        aria-label={id ? undefined : (range ? (restProps["aria-label"] || label) : undefined)}
        aria-orientation={range ? "horizontal" : "horizontal"}
        aria-valuemin={range ? undefined : min}
        aria-valuemax={range ? undefined : max}
        aria-valuenow={range ? undefined : (currentSingleValue ?? 60)}
        aria-valuetext={range ? undefined : getTooltipText(currentSingleValue ?? 60)}
        tabIndex={isDisabled ? -1 : 0}
        style={{
          position: "relative",
          paddingTop: "2px",
          paddingBottom: "2px",
          height: "8px",
          overflow: "visible",
          touchAction: "none", // Prevent default touch behaviors for better dragging
        }}
        onClick={handleTrackClick}
        onTouchStart={handleTrackTouchStart}
        onMouseMove={handleTrackMouseMove}
        onMouseLeave={handleTrackMouseLeave}
      >
        <div style={trackStyles}>
          <div style={selectionStyles} />
          {/* Preview tooltip for hover/long-press */}
          {showTooltip && previewValue !== null && previewPosition !== null && !isDragging && (
            <div
              style={{
                ...tooltipStyles,
                left: `${previewPosition}%`,
              }}
            >
              <p style={{ margin: 0, textAlign: "center" }}>{getTooltipText(previewValue)}</p>
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid var(--bg-page-tertiary)",
                }}
              />
            </div>
          )}
          {showSteps && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {Array.from({ length: stepCount + 1 }).map((_, index) => {
                const stepPercentage = stepCount > 0 ? (index / stepCount) * 100 : 0;
                const isFirst = index === 0;
                const isLast = index === stepCount;
                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${stepPercentage}%`,
                      transform: isFirst ? "translateX(4px)" : isLast ? "translateX(calc(-100% - 4px))" : "translateX(-50%)",
                      width: `${STEP_DOT_SIZE}px`,
                      height: `${STEP_DOT_SIZE}px`,
                      borderRadius: "var(--corner-radius-full)",
                      backgroundColor: "var(--border-strong-200)",
                    }}
                  />
                );
              })}
            </div>
          )}
          {range ? (
            <>
              <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={startValue}
                aria-valuetext={getTooltipText(startValue)}
                aria-labelledby={id ? `${id}-label` : undefined}
                aria-label={id ? undefined : `${restProps["aria-label"] || label} start`}
                tabIndex={isDisabled ? -1 : 0}
                style={{
                  ...thumbStyles,
                  left: `${startPercentage}%`,
                  touchAction: "none", // Prevent default touch behaviors for better dragging
                }}
                onMouseDown={handleThumbMouseDown("start")}
                onTouchStart={handleThumbTouchStart("start")}
              >
                {showTooltip && (status === "active" || status === "hover") && (
                  <div style={{ ...tooltipStyles, left: "50%" }}>
                    <p style={{ margin: 0, textAlign: "center" }}>{getTooltipText(startValue)}</p>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid var(--bg-page-tertiary)",
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={endValue}
                aria-valuetext={getTooltipText(endValue)}
                aria-labelledby={id ? `${id}-label` : undefined}
                aria-label={id ? undefined : `${restProps["aria-label"] || label} end`}
                tabIndex={isDisabled ? -1 : 0}
                style={{
                  ...thumbStyles,
                  left: `${endPercentage}%`,
                  touchAction: "none", // Prevent default touch behaviors for better dragging
                }}
                onMouseDown={handleThumbMouseDown("end")}
                onTouchStart={handleThumbTouchStart("end")}
              >
                {showTooltip && (status === "active" || status === "hover") && (
                  <div style={{ ...tooltipStyles, left: "50%" }}>
                    <p style={{ margin: 0, textAlign: "center" }}>{getTooltipText(endValue)}</p>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid var(--bg-page-tertiary)",
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              role="none"
              aria-hidden="true"
              tabIndex={-1}
              style={{
                ...thumbStyles,
                left: `${startPercentage}%`,
                touchAction: "none", // Prevent default touch behaviors for better dragging
              }}
              onMouseDown={handleThumbMouseDown("end")}
              onTouchStart={handleThumbTouchStart("end")}
            >
              {showTooltip && (status === "active" || status === "hover") && (
                <div style={{ ...tooltipStyles, left: "50%" }}>
                  <p style={{ margin: 0, textAlign: "center" }}>{getTooltipText(currentSingleValue ?? 60)}</p>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "6px solid var(--bg-page-tertiary)",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
