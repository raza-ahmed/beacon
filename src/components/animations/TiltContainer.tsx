"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { Card } from "beacon-ui";

interface TiltContainerProps {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  children?: React.ReactNode;
}

export function TiltContainer({
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  children,
}: TiltContainerProps) {
  const {
    ref,
    rotateX,
    rotateY,
    scale: scaleValue,
    perspective: perspectiveValue,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useTilt({ maxTilt, perspective, scale });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: perspectiveValue,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: scaleValue,
          transformStyle: "preserve-3d",
        }}
      >
        <Card
          padding={400}
          cornerRadius={4}
          showBorder={true}
          style={{
            width: "300px",
            height: "200px",
          }}
        >
          {children || (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-200)",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <h6
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--fonts-title-regular-text-size)",
                  color: "var(--fg-neutral)",
                  margin: 0,
                }}
              >
                Tilt Container
              </h6>
              <p
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--fonts-body-regular-text-size)",
                  color: "var(--fg-neutral-secondary)",
                  margin: 0,
                }}
              >
                Move mouse to tilt
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

