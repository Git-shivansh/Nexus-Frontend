"use client";
import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility to join classnames

export function ShineBorder({
  borderWidth = 0.4,
  duration = 14,
  shineColors = ["#161F2C", "#4a6796ff", 'rgba(188, 79, 20, 1)'],
  className,
  style,
  ...props
}) {
  return (
    <div
      style={{
        "--border-width": `${borderWidth}px`,
        "--duration": `${duration}s`,
        backgroundImage: `radial-gradient(transparent, transparent, ${
          Array.isArray(shineColors) ? shineColors.join(",") : shineColors
        }, transparent, transparent)`,
        backgroundSize: "300% 300%",
        mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "var(--border-width)",
        animation: "shine var(--duration) infinite linear",
        ...style,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 w-full h-full rounded-[inherit] will-change-[background-position]",
        "motion-safe:animate-shine",
        className
      )}
      {...props}
    />
  );
}
