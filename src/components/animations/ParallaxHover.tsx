"use client";

import { motion } from "framer-motion";
import { Card } from "beacon-ui";
import { create3DParallaxVariants } from "@/utils/animations";

interface ParallaxHoverProps {
  children?: React.ReactNode;
}

export function ParallaxHover({ children }: ParallaxHoverProps) {
  return (
    <motion.div
      variants={create3DParallaxVariants()}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ perspective: 1000 }}
    >
      {children ? (
        children
      ) : (
        <Card
          padding={400}
          cornerRadius={4}
          showBorder={true}
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
              Parallax Hover
            </h6>
            <p
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-body-regular-text-size)",
                color: "var(--fg-neutral-secondary)",
                margin: 0,
              }}
            >
              Hover to see parallax
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}

