"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/components/ui";
import { useHydrationSafeReducedMotion } from "./use-client-mounted";

type InteractiveCardShellProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  shine?: boolean;
  halo?: boolean;
  entrance?: boolean;
  style?: CSSProperties;
};

export function InteractiveCardShell({
  children,
  className,
  interactive = true,
  shine = false,
  halo = false,
  entrance = false,
  style,
}: InteractiveCardShellProps) {
  const reduced = useHydrationSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 280, damping: 26, mass: 0.75 });
  const rotateY = useSpring(0, { stiffness: 280, damping: 26, mass: 0.75 });
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const glareOpacity = useSpring(0, { stiffness: 220, damping: 28 });

  const glareBackground = useTransform(
    [pointerX, pointerY],
    ([x, y]) =>
      `radial-gradient(circle at ${Number(x) * 100}% ${Number(y) * 100}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 24%, transparent 58%)`,
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || !interactive || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerX.set(x);
      pointerY.set(y);
      rotateY.set((x - 0.5) * 16);
      rotateX.set((0.5 - y) * 12);
      if (shine) glareOpacity.set(0.95);
    },
    [reduced, interactive, shine, pointerX, pointerY, rotateX, rotateY, glareOpacity],
  );

  const resetTilt = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    pointerX.set(0.5);
    pointerY.set(0.5);
    if (shine) glareOpacity.set(0);
  }, [rotateX, rotateY, pointerX, pointerY, glareOpacity, shine]);

  const canInteract = interactive && !reduced;

  return (
    <motion.div
      ref={ref}
      className={cn("interactive-card-shell", className)}
      style={{
        ...style,
        rotateX: canInteract ? rotateX : 0,
        rotateY: canInteract ? rotateY : 0,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={canInteract ? handlePointerMove : undefined}
      onPointerLeave={canInteract ? resetTilt : undefined}
      initial={entrance && !reduced ? { opacity: 0, scale: 0.9, y: 28, rotateX: -8 } : false}
      animate={entrance && !reduced ? { opacity: 1, scale: 1, y: 0, rotateX: 0 } : undefined}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 28, mass: 0.8 }}
    >
      {halo ? <div className="interactive-card-halo" aria-hidden /> : null}
      <div className="interactive-card-depth">
        {children}
        {shine ? (
          <motion.div
            className="interactive-card-glare"
            aria-hidden
            style={{ background: glareBackground, opacity: glareOpacity }}
          />
        ) : null}
      </div>
    </motion.div>
  );
}
