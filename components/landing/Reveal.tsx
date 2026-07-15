"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** entrance delay in ms (use for stagger) */
  delay?: number;
  /** vertical travel distance in px */
  y?: number;
  /** subtle entrance blur */
  blur?: boolean;
  /** how far into view before triggering (0-1) */
  threshold?: number;
};

/**
 * Cinematic scroll/enter reveal — fades + rises (+ optional blur) into place
 * the first time it enters the viewport. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 26,
  blur = true,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        filter: shown || !blur ? "none" : "blur(8px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "820ms",
        transitionTimingFunction: "cubic-bezier(.16,.84,.44,1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
