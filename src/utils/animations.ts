import { Variants } from "framer-motion";

export type AnimationCategory = "professional" | "playful" | "minimal" | "3d-focused";

export interface AnimationConfig {
  duration?: number;
  ease?: number[] | string;
  intensity?: number;
}

// Professional animations - subtle and business-appropriate
export const professionalVariants: Variants = {
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const professionalShadowVariants: Variants = {
  hover: {
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const professionalBorderGlowVariants: Variants = {
  hover: {
    borderColor: "var(--border-primary)",
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    borderColor: "var(--border-strong-200)",
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const professionalSmoothScaleVariants: Variants = {
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Playful animations - fun and energetic
export const playfulBounceVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  rest: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const playfulElasticVariants: Variants = {
  hover: {
    scale: 1.15,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  rest: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export const playfulJellyVariants: Variants = {
  hover: {
    scale: [1, 1.1, 0.95, 1.05, 1],
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  rest: {
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const playfulPopVariants: Variants = {
  hover: {
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
  rest: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
};

// Minimal animations - very subtle
export const minimalFadeVariants: Variants = {
  hover: {
    opacity: 0.85,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  rest: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export const minimalShiftVariants: Variants = {
  hover: {
    x: 2,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const minimalSoftGlowVariants: Variants = {
  hover: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  rest: {
    boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const minimalBorderFadeVariants: Variants = {
  hover: {
    borderColor: "rgba(0, 0, 0, 0.3)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  rest: {
    borderColor: "var(--border-strong-200)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// 3D-focused animations
export const create3DTiltVariants = (intensity: number = 15): Variants => ({
  hover: {
    rotateX: 0,
    rotateY: 0,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

export const create3DFlipVariants = (): Variants => ({
  hover: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

export const create3DParallaxVariants = (): Variants => ({
  hover: {
    y: -10,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

export const create3DDepthGlowVariants = (): Variants => ({
  hover: {
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.3)",
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  rest: {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
});

// Utility function to check for reduced motion preference
export const shouldReduceMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get animation variants based on category
export const getAnimationVariants = (
  category: AnimationCategory,
  variant: string = "default"
): Variants => {
  if (shouldReduceMotion()) {
    return {
      hover: {},
      rest: {},
    };
  }

  switch (category) {
    case "professional":
      switch (variant) {
        case "lift":
          return professionalVariants;
        case "shadow":
          return professionalShadowVariants;
        case "border-glow":
          return professionalBorderGlowVariants;
        case "smooth-scale":
          return professionalSmoothScaleVariants;
        default:
          return professionalVariants;
      }
    case "playful":
      switch (variant) {
        case "bounce":
          return playfulBounceVariants;
        case "elastic":
          return playfulElasticVariants;
        case "jelly":
          return playfulJellyVariants;
        case "pop":
          return playfulPopVariants;
        default:
          return playfulBounceVariants;
      }
    case "minimal":
      switch (variant) {
        case "fade":
          return minimalFadeVariants;
        case "shift":
          return minimalShiftVariants;
        case "soft-glow":
          return minimalSoftGlowVariants;
        case "border-fade":
          return minimalBorderFadeVariants;
        default:
          return minimalFadeVariants;
      }
    case "3d-focused":
      switch (variant) {
        case "tilt":
          return create3DTiltVariants();
        case "flip":
          return create3DFlipVariants();
        case "parallax":
          return create3DParallaxVariants();
        case "depth-glow":
          return create3DDepthGlowVariants();
        default:
          return create3DTiltVariants();
      }
    default:
      return professionalVariants;
  }
};

