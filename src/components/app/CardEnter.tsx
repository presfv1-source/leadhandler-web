"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const cardEnterTransition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export const cardEnterVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

interface CardEnterProps {
  children: React.ReactNode;
  /** Optional delay in seconds for stagger in grids */
  delay?: number;
  className?: string;
}

/**
 * Subtle enter animation for card-like surfaces. Premium, non-distracting: fade + slight y.
 */
export function CardEnter({
  children,
  delay = 0,
  className,
}: CardEnterProps) {
  return (
    <motion.div
      initial={cardEnterVariants.initial}
      animate={cardEnterVariants.animate}
      transition={{ ...cardEnterTransition, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
