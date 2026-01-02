"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Card } from "beacon-ui";
import { professionalVariants } from "@/utils/animations";

interface HoverLiftProps {
  showShadow?: boolean;
  children?: React.ReactNode;
}

export function HoverLift({ showShadow = true, children }: HoverLiftProps) {
  const variants = professionalVariants;
  
  // For shadow animation, we need to animate the shadow value
  const shadowOpacity = useMotionValue(0.08);
  const shadowY = useMotionValue(2);
  const shadowBlur = useMotionValue(8);
  
  const springShadowOpacity = useSpring(shadowOpacity, { stiffness: 300, damping: 30 });
  const springShadowY = useSpring(shadowY, { stiffness: 300, damping: 30 });
  const springShadowBlur = useSpring(shadowBlur, { stiffness: 300, damping: 30 });
  
  const boxShadow = useTransform(
    [springShadowOpacity, springShadowY, springShadowBlur],
    ([opacity, y, blur]) => `0 ${y}px ${blur}px rgba(0, 0, 0, ${opacity})`
  );

  if (showShadow) {
    return (
      <motion.div
        variants={variants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        onHoverStart={() => {
          shadowOpacity.set(0.12);
          shadowY.set(8);
          shadowBlur.set(24);
        }}
        onHoverEnd={() => {
          shadowOpacity.set(0.08);
          shadowY.set(2);
          shadowBlur.set(8);
        }}
        style={{ width: "300px" }}
      >
        <motion.div
          style={{
            boxShadow: boxShadow,
            borderRadius: "var(--corner-radius-400)",
          }}
        >
          <Card
            padding={400}
            cornerRadius={4}
            showBorder={true}
            shadow={undefined}
            style={{
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
                  Shadow Depth
                </h6>
                <p
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "var(--fonts-body-regular-text-size)",
                    color: "var(--fg-neutral-secondary)",
                    margin: 0,
                  }}
                >
                  Hover to see shadow
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ width: "300px" }}
    >
      <Card
        padding={400}
        cornerRadius={4}
        showBorder={true}
        style={{
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
              Lift Effect
            </h6>
            <p
              style={{
                fontFamily: "var(--font-secondary)",
                fontSize: "var(--fonts-body-regular-text-size)",
                color: "var(--fg-neutral-secondary)",
                margin: 0,
              }}
            >
              Hover to lift
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

