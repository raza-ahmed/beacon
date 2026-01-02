 import { useRef, useState, useCallback } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { shouldReduceMotion } from "@/utils/animations";

interface UseHover3DOptions {
  intensity?: number;
  perspective?: number;
  scale?: number;
  disable?: boolean;
}

export function useHover3D(options: UseHover3DOptions = {}) {
  const {
    intensity = 15,
    perspective = 1000,
    scale = 1.05,
    disable = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [intensity, -intensity]),
    { stiffness: 300, damping: 30 }
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-intensity, intensity]),
    { stiffness: 300, damping: 30 }
  );

  const scaleValue = useSpring(isHovered && !disable ? scale : 1, {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disable || shouldReduceMotion() || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const normalizedX = mouseX / (rect.width / 2);
      const normalizedY = mouseY / (rect.height / 2);

      x.set(normalizedX);
      y.set(normalizedY);
    },
    [disable, x, y]
  );

  const handleMouseEnter = useCallback(() => {
    if (disable || shouldReduceMotion()) return;
    setIsHovered(true);
  }, [disable]);

  const handleMouseLeave = useCallback(() => {
    if (disable || shouldReduceMotion()) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }, [disable, x, y]);

  return {
    ref,
    rotateX: disable || shouldReduceMotion() ? 0 : rotateX,
    rotateY: disable || shouldReduceMotion() ? 0 : rotateY,
    scale: scaleValue,
    perspective,
    isHovered,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}

