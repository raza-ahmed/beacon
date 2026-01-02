"use client";

import { motion } from "framer-motion";
import { useHover3D } from "@/hooks/useHover3D";
import { Card } from "beacon-ui";

interface Card3DProps {
  intensity?: number;
  perspective?: number;
  scale?: number;
  children?: React.ReactNode;
}

export function Card3D({
  intensity = 15,
  perspective = 1000,
  scale = 1.05,
  children,
}: Card3DProps) {
  const {
    ref,
    rotateX,
    rotateY,
    scale: scaleValue,
    perspective: perspectiveValue,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useHover3D({ intensity, perspective, scale });

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
        {children ? (
          children
        ) : (
          <Card
            padding={400}
            cornerRadius={4}
            showBorder={true}
            style={{
              width: "300px",
              height: "200px",
            }}
          >
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
                3D Card
              </h6>
              <p
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--fonts-body-regular-text-size)",
                  color: "var(--fg-neutral-secondary)",
                  margin: 0,
                }}
              >
                Hover to see 3D effect
              </p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

