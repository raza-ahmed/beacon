"use client";

import { motion } from "framer-motion";
import { Button } from "beacon-ui";
import type { AnimationCategory } from "@/utils/animations";
import { getAnimationVariants } from "@/utils/animations";

interface ButtonAnimatedProps {
  category: AnimationCategory;
  variant?: string;
  children?: React.ReactNode;
}

export function ButtonAnimated({
  category,
  variant = "default",
  children = "Animated Button",
}: ButtonAnimatedProps) {
  const variants = getAnimationVariants(category, variant);

  return (
    <motion.div
      variants={variants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Button color="primary" variant="filled">
        {children}
      </Button>
    </motion.div>
  );
}

