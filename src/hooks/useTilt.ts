import { useRef, useState, useCallback } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { shouldReduceMotion } from "@/utils/animations";

interface UseTiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  disable?: boolean;
}

export function useTilt(options: UseTiltOptions = {}) {
  const {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    disable = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(tiltY, [-1, 1], [maxTilt, -maxTilt]),
    { stiffness: 300, damping: 30 }
  );
  const rotateY = useSpring(
    useTransform(tiltX, [-1, 1], [-maxTilt, maxTilt]),
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

      const maxDistance = Math.max(rect.width, rect.height) / 2;
      const distanceX = mouseX / maxDistance;
      const distanceY = mouseY / maxDistance;

      tiltX.set(Math.max(-1, Math.min(1, distanceX)));
      tiltY.set(Math.max(-1, Math.min(1, distanceY)));
    },
    [disable, tiltX, tiltY]
  );

  const handleMouseEnter = useCallback(() => {
    if (disable || shouldReduceMotion()) return;
    setIsHovered(true);
  }, [disable]);

  const handleMouseLeave = useCallback(() => {
    if (disable || shouldReduceMotion()) return;
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  }, [disable, tiltX, tiltY]);

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

