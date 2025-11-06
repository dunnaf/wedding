"use client";

import { useEffect, useState } from "react";

interface Flower {
  id: number;
  startX: number;
  startY: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  direction:
    | "up"
    | "down"
    | "left"
    | "right"
    | "diagonal-up-right"
    | "diagonal-up-left"
    | "diagonal-down-right"
    | "diagonal-down-left";
}

export default function FloatingFlowers() {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    const directions: Flower["direction"][] = ["up", "down", "left", "right"];

    // Generate random flowers with mixed directions
    // Starting positions are within viewport, animations will move them
    const generatedFlowers: Flower[] = Array.from({ length: 30 }, (_, i) => {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];

      // Start flowers randomly across the viewport
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;

      return {
        id: i,
        startX,
        startY,
        animationDuration: 10 + Math.random() * 15, // 10-25 seconds
        animationDelay: Math.random() * 8, // 0-8 seconds delay
        size: 12 + Math.random() * 18, // 12-30px
        direction,
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlowers(generatedFlowers);
  }, []);

  const getAnimationClass = (direction: Flower["direction"]) => {
    switch (direction) {
      case "up":
        return "animate-float-up";
      case "down":
        return "animate-float-down";
      case "left":
        return "animate-float-left";
      case "right":
        return "animate-float-right";
      case "diagonal-up-right":
        return "animate-float-diagonal-up-right";
      case "diagonal-up-left":
        return "animate-float-diagonal-up-left";
      case "diagonal-down-right":
        return "animate-float-diagonal-down-right";
      case "diagonal-down-left":
        return "animate-float-diagonal-down-left";
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className={`absolute ${getAnimationClass(flower.direction)}`}
          style={{
            left: `${flower.startX}%`,
            top: `${flower.startY}%`,
            animationDuration: `${flower.animationDuration}s`,
            animationDelay: `${flower.animationDelay}s`,
          }}
        >
          {/* Nested div for swaying motion */}
          <div
            className="animate-sway"
            style={{
              width: `${flower.size}px`,
              height: `${flower.size}px`,
              animationDelay: `${flower.animationDelay}s`,
            }}
          >
            {/* Simple flower shape using SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="drop-shadow-md"
              style={{
                opacity: 0.8,
                filter: "blur(0.5px)",
              }}
            >
              {/* Flower petals */}
              <circle cx="12" cy="8" r="3" opacity="0.9" />
              <circle cx="8" cy="12" r="3" opacity="0.9" />
              <circle cx="16" cy="12" r="3" opacity="0.9" />
              <circle cx="12" cy="16" r="3" opacity="0.9" />
              <circle cx="10" cy="10" r="3" opacity="0.9" />
              <circle cx="14" cy="10" r="3" opacity="0.9" />
              <circle cx="10" cy="14" r="3" opacity="0.9" />
              <circle cx="14" cy="14" r="3" opacity="0.9" />
              {/* Center */}
              <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.95)" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
