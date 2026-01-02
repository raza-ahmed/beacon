"use client";

import { motion } from "framer-motion";
import { Card } from "beacon-ui";
import { create3DDepthGlowVariants } from "@/utils/animations";

interface DepthGlowProps {
  children?: React.ReactNode;
}

export function DepthGlow({ children }: DepthGlowProps) {
  return (
    <motion.div
      variants={create3DDepthGlowVariants()}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ 
        borderRadius: "var(--corner-radius-400)",
      }}
    >
      {children ? (
        children
      ) : (
        <Card
          padding={400}
          cornerRadius={4}
          showBorder={true}
          shadow={undefined}
          style={{ width: "300px", height: "200px" }}
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
              Depth Glow
            </h6>
            <p
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-body-regular-text-size)",
                color: "var(--fg-neutral-secondary)",
                margin: 0,
              }}
            >
              Hover to see depth
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}

