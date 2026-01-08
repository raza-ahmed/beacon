"use client";

import { useMemo } from "react";
import type { Theme, HueVariant } from "@/tokens/types";
import type { SliderStatus } from "beacon-ui";

type SliderPreviewProps = {
  value?: number;
  rangeValue?: [number, number];
  range?: boolean;
  status?: SliderStatus;
  showLabel?: boolean;
  showTooltip?: boolean;
  showSteps?: boolean;
  theme?: Theme;
  hue?: HueVariant;
  width?: string;
};

export function SliderPreview({
  value = 60,
  rangeValue = [20, 80],
  range = false,
  status = "default",
  showLabel = true,
  showTooltip = false,
  showSteps = true,
  theme,
  hue,
  width = "320px",
}: SliderPreviewProps) {
  const isDisabled = status === "disabled";

  const labelStyles = useMemo(() => {
    return {
      fontSize: "var(--fonts-body-extra-small-text-size)",
      lineHeight: "var(--fonts-body-extra-small-line-height)",
      fontFamily: "var(--font-secondary)",
      color: isDisabled ? "var(--fg-disabled)" : "var(--fg-neutral)",
      marginBottom: "var(--spacing-100)",
      textAlign: "left" as const,
      width: "100%",
    } as React.CSSProperties;
  }, [isDisabled]);

  const trackStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: "relative",
      width: "100%",
      height: "8px",
      borderRadius: "var(--corner-radius-full)",
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
  }, [status]);

  const selectionStyles = useMemo(() => {
    const startPercentage = range ? ((rangeValue[0] - 0) / (100 - 0)) * 100 : ((value - 0) / (100 - 0)) * 100;
    const endPercentage = range ? ((rangeValue[1] - 0) / (100 - 0)) * 100 : ((value - 0) / (100 - 0)) * 100;
    const selectionWidth = range ? endPercentage - startPercentage : startPercentage;
    const selectionLeft = range ? startPercentage : 0;

    const baseStyles: React.CSSProperties = {
      position: "absolute",
      height: "8px",
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
  }, [status, range, value, rangeValue]);

  const thumbStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      width: "16px",
      height: "16px",
      borderRadius: "var(--corner-radius-full)",
      border: "2px solid",
      boxShadow: "var(--shadow-subtle)",
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
  }, [status]);

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

  const startPercentage = range ? ((rangeValue[0] - 0) / (100 - 0)) * 100 : ((value - 0) / (100 - 0)) * 100;
  const endPercentage = range ? ((rangeValue[1] - 0) / (100 - 0)) * 100 : ((value - 0) / (100 - 0)) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-100)", width, alignItems: "flex-start" }}>
      {showLabel && (
        <p style={labelStyles}>Slider</p>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "2px",
          paddingBottom: "2px",
          height: "8px",
          overflow: "visible",
        }}
      >
        <div style={trackStyles}>
          <div style={selectionStyles} />
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
              {Array.from({ length: 11 }).map((_, index) => {
                const stepPercentage = (index / 10) * 100;
                const isFirst = index === 0;
                const isLast = index === 10;
                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${stepPercentage}%`,
                      transform: isFirst ? "translateX(4px)" : isLast ? "translateX(calc(-100% - 4px))" : "translateX(-50%)",
                      width: "4px",
                      height: "4px",
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
                style={{
                  ...thumbStyles,
                  left: `${startPercentage}%`,
                  bottom: "-4px",
                  transform: "translateX(-50%)",
                }}
              >
                {showTooltip && (status === "active" || status === "hover") && (
                  <div style={{ ...tooltipStyles, left: "50%" }}>
                    <p style={{ margin: 0, textAlign: "center" }}>{rangeValue[0]}</p>
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
                style={{
                  ...thumbStyles,
                  left: `${endPercentage}%`,
                  bottom: "-4px",
                  transform: "translateX(-50%)",
                }}
              >
                {showTooltip && (status === "active" || status === "hover") && (
                  <div style={{ ...tooltipStyles, left: "50%" }}>
                    <p style={{ margin: 0, textAlign: "center" }}>{rangeValue[1]}</p>
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
              style={{
                ...thumbStyles,
                left: `${startPercentage}%`,
                bottom: "-4px",
                transform: "translateX(-50%)",
              }}
            >
              {showTooltip && (status === "active" || status === "hover") && (
                <div style={{ ...tooltipStyles, left: "50%" }}>
                  <p style={{ margin: 0, textAlign: "center" }}>{value}</p>
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
