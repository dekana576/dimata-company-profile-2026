"use client";

/**
 * scroll-motion.tsx
 * ------------------------------------------------------------------
 * Lightweight, dependency-free scroll animation primitives.
 *
 * HeroUI v3 intentionally dropped Framer Motion in favor of native CSS
 * transitions (see "Performance by default" in the v3 release notes),
 * so we follow the same philosophy here: a single IntersectionObserver
 * hook drives plain CSS opacity/transform transitions instead of
 * pulling in an animation runtime.
 *
 * <Reveal>      fades + slides content in the first time it enters
 *               the viewport. Stagger children with the `delay` prop
 *               (in ms).
 * <Counter>     animates a number from 0 -> value once it scrolls
 *               into view. Used for the mono "readout" stats.
 *
 * Both respect prefers-reduced-motion automatically.
 */

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the browser can't observe, just show the content.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

interface RevealProps {
  children: ReactNode;
  /** ms, use to stagger a group of siblings */
  delay?: number;
  /** direction the content travels in from */
  from?: "up" | "left" | "right" | "none";
  as?: ElementType;
  className?: string;
}

const FROM_CLASSES: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
  none: "",
};

export function Reveal({
  children,
  delay = 0,
  from = "up",
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      className={[
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        inView ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${FROM_CLASSES[from]}`,
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1400,
  className = "",
}: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
