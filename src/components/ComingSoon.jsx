"use client";
import React, { useState } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/Animation.json";
import Game from "./Game";

// Utility: combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// WobbleCard: adds wobble while preserving all styling and shape
const WobbleCard = ({
  children,
  className = "",
  ...rest
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <article
      {...rest}
      className={className}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1,1,1)`
          : "translate3d(0px,0px,0px) scale3d(1,1,1)",
        transition: "transform 0.1s cubic-bezier(.36,.7,.37,1.01)",
        ...rest.style, // keeps any inline styles intact
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {children}
    </article>
  );
};

function ComingSoon({ centerImage, rightImage }) {
  const right = rightImage || animationData;
  const center = centerImage || null;

  return (
    <section className="w-full py-10 font-lato">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6">
          {/* Right compact card: always visible, full width on mobile/tablet */}
          <WobbleCard className="bg-zinc-900 text-white rounded-3xl p-5 md:p-6 flex flex-col justify-between w-full lg:w-1/3 shadow-sm ring-1 ring-zinc-800 flex-grow">
            <div className="flex-shrink-0">
              <h3 className="font-normal text-lg md:text-xl leading-tight tracking-tight">
                More Features are on its way
              </h3>
              <p className="text-sm md:text-base text-zinc-400">
                We are building something amazing.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center w-full flex-grow">
              <div className="border-t border-zinc-700/60 bg-gradient-to-b from-zinc-800/80 to-zinc-900 rounded-xl p-2 md:p-4 shadow-md flex items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                {typeof right === "string" &&
                right.toLowerCase().endsWith(".lottie") ? (
                  <div className="w-full h-48 md:h-64 lg:h-72" />
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <Lottie
                      animationData={right}
                      loop={true}
                      autoplay={true}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "18rem",
                      }}
                      className="w-full max-h-72 md:max-h-80 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </WobbleCard>

          {/* Center wide card: visible only on large screens (lg: ≥1024px) */}
          <WobbleCard className="hidden lg:flex bg-zinc-900 text-white rounded-3xl p-5 md:p-6 lg:w-2/3 flex-col shadow-md ring-1 ring-zinc-800 flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-normal text-lg md:text-xl leading-tight tracking-tight">
                  Till Then
                </h2>
                <p className="text-sm md:text-base text-zinc-400">
                  Enjoy our 2D Game.
                </p>
              </div>
            </div>
            {/* Placeholder area for the central content */}
            <div className="w-full flex items-center justify-center py-4">
              <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative rounded-lg overflow-hidden">
                  <Game />
                </div>
              </div>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}

export default ComingSoon;
