"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number = 25,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 25,
  className
}) => {
  const [meteorStyles, setMeteorStyles] = useState([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: `${Math.random() * 100}%`,
      left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
      animationName: "meteor",
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        "s",
    }));
    setMeteorStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head (smaller)
        (<span
          key={idx}
          style={{ ...style }}
          className={cn(
            // reduced head size and lighter color
            "pointer-events-none absolute w-0.5 h-0.5 rotate-[var(--angle)] animate-meteor rounded-full bg-zinc-600 shadow-[0_0_0_1px_#ffffff08]",
            className
          )}>
          {/* Meteor Tail */}
          <div
            className="pointer-events-none absolute top-1/2 -z-10 h-px w-[42px] -translate-y-1/2 bg-gradient-to-r from-zinc-500 to-transparent" />
        </span>)
      ))}
    </>
  );
};
