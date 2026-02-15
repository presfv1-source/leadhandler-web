"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SECTION_CARD,
  SECTION_CARD_HEADER,
  SECTION_CARD_BODY,
  TYPO,
} from "@/lib/ui";
import { cardEnterTransition, cardEnterVariants } from "./CardEnter";

interface SectionCardProps {
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SectionCard({
  title,
  headerRight,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <motion.section
      initial={false}
      animate={cardEnterVariants.animate}
      transition={cardEnterTransition}
      className={cn(SECTION_CARD, "min-w-0 overflow-hidden", className)}
    >
      {(title != null || headerRight != null) && (
        <div className={SECTION_CARD_HEADER}>
          {title != null && <h2 className={TYPO.h3}>{title}</h2>}
          {headerRight != null && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      <div className={cn(SECTION_CARD_BODY, bodyClassName)}>{children}</div>
    </motion.section>
  );
}
