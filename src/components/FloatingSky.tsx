"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLenis } from "lenis/react";

interface SkyElement {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  direction: "left" | "right"; // left = left-to-right, right = right-to-left
}

const FloatingSky: React.FC = () => {
  const [skyElements, setSkyElements] = useState<SkyElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Generate elegant floating cloud elements with varied directions
    const elements: SkyElement[] = Array.from({ length: 6 }, (_, i) => {
      const direction = Math.random() > 0.5 ? "left" : "right";

      // Mix of starting positions: some in center (visible immediately), some off-screen
      let startLeft;
      if (i < 4) {
        // First 4 clouds start in center (10-90% range) - immediately visible
        startLeft = 10 + Math.random() * 80;
      } else {
        // Rest start off-screen
        startLeft =
          direction === "left"
            ? -20 - Math.random() * 20
            : 100 + Math.random() * 20;
      }

      return {
        id: i,
        left: startLeft,
        top: 10 + (i * 80) / 6 + (Math.random() * 10 - 5), // Evenly distributed vertically with slight randomness
        size: 140 + Math.random() * 120, // Medium to large clouds: 140-260px
        duration: 20 + Math.random() * 30, // Random duration between 20-50s
        delay: Math.random() * 12, // Random delay 0-12s for staggered effect
        opacity: 0.08 + Math.random() * 0.22, // Random opacity 0.08-0.3
        direction,
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkyElements(elements);
  }, []);

  // Parallax effect using Lenis - section-relative with RAF throttling
  useLenis(() => {
    // Cancel previous frame if it exists
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Schedule update for next frame
    rafIdRef.current = requestAnimationFrame(() => {
      if (containerRef.current && containerRef.current.parentElement) {
        // Get the parent section's position
        const rect = containerRef.current.parentElement.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const screenCenter = window.innerHeight / 2;
        const distanceFromCenter = elementCenter - screenCenter;

        // Subtle parallax based on section position (similar to love icon)
        const yPos = distanceFromCenter * -0.2;
        containerRef.current.style.transform = `translateY(${yPos}px)`;
      }
    });
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 will-change-transform"
    >
      {/* Flying clouds */}
      {skyElements.map((element) => (
        <div
          key={element.id}
          className="absolute will-change-transform"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
            width: `${element.size}px`,
            height: `${element.size * 0.55}px`,
            animation: `cloudDrift-${element.id} ${element.duration}s linear infinite`,
            animationDelay: `${element.delay}s`,
          }}
        >
          {/* Cloud shape with soft, organic curves - simplified for performance */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main cloud body - simplified fluffy shape */}
            <ellipse
              cx="50"
              cy="65"
              rx="35"
              ry="30"
              fill="white"
              opacity="0.98"
            />
            <ellipse
              cx="85"
              cy="55"
              rx="40"
              ry="35"
              fill="white"
              opacity="0.98"
            />
            <ellipse
              cx="125"
              cy="60"
              rx="38"
              ry="32"
              fill="white"
              opacity="0.98"
            />
            <ellipse
              cx="155"
              cy="70"
              rx="30"
              ry="28"
              fill="white"
              opacity="0.98"
            />
            <ellipse
              cx="110"
              cy="70"
              rx="35"
              ry="28"
              fill="white"
              opacity="0.98"
            />
          </svg>

          {/* Inline keyframes for bidirectional drift with fade-in */}
          <style jsx>{`
            @keyframes cloudDrift-${element.id} {
              0% {
                transform: translateX(0) scale(1);
                opacity: 0;
                filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0));
              }
              5% {
                opacity: ${element.opacity};
                filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.5));
              }
              100% {
                transform: translateX(
                    ${element.direction === "left"
                      ? "calc(100vw + 300px)"
                      : "calc(-100vw - 300px)"}
                  )
                  scale(1);
                opacity: ${element.opacity};
                filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.5));
              }
            }
          `}</style>
        </div>
      ))}

      {/* Stationary clouds with wind effect - Top Right */}
      <div
        className="absolute will-change-transform right-[-5%] md:right-[5%] top-[5%] md:top-[10%]"
        style={{
          width: "350px",
          height: "192.5px",
          animation: "windBlow-topRight 8s ease-in-out infinite",
          opacity: 0.15,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="50"
            cy="65"
            rx="35"
            ry="30"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="85"
            cy="55"
            rx="40"
            ry="35"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="125"
            cy="60"
            rx="38"
            ry="32"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="155"
            cy="70"
            rx="30"
            ry="28"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="110"
            cy="70"
            rx="35"
            ry="28"
            fill="white"
            opacity="0.98"
          />
        </svg>
        <style jsx>{`
          @keyframes windBlow-topRight {
            0%, 100% {
              transform: translateX(0) translateY(0) scale(1);
              filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
            }
            25% {
              transform: translateX(-15px) translateY(5px) scale(1.02);
              filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
            }
            50% {
              transform: translateX(-25px) translateY(-3px) scale(0.98);
              filter: drop-shadow(0 8px 22px rgba(0, 0, 0, 0.25));
            }
            75% {
              transform: translateX(-10px) translateY(8px) scale(1.01);
              filter: drop-shadow(0 11px 26px rgba(0, 0, 0, 0.32));
            }
          }
        `}</style>
      </div>

      {/* Stationary clouds with wind effect - Bottom Left */}
      <div
        className="absolute will-change-transform left-[-5%] md:left-[5%] bottom-[8%] md:bottom-[12%]"
        style={{
          width: "380px",
          height: "209px",
          animation: "windBlow-bottomLeft 10s ease-in-out infinite",
          animationDelay: "2s",
          opacity: 0.18,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="50"
            cy="65"
            rx="35"
            ry="30"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="85"
            cy="55"
            rx="40"
            ry="35"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="125"
            cy="60"
            rx="38"
            ry="32"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="155"
            cy="70"
            rx="30"
            ry="28"
            fill="white"
            opacity="0.98"
          />
          <ellipse
            cx="110"
            cy="70"
            rx="35"
            ry="28"
            fill="white"
            opacity="0.98"
          />
        </svg>
        <style jsx>{`
          @keyframes windBlow-bottomLeft {
            0%, 100% {
              transform: translateX(0) translateY(0) scale(1);
              filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.35));
            }
            30% {
              transform: translateX(20px) translateY(-8px) scale(1.03);
              filter: drop-shadow(0 13px 30px rgba(0, 0, 0, 0.4));
            }
            60% {
              transform: translateX(30px) translateY(5px) scale(0.97);
              filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.28));
            }
            80% {
              transform: translateX(12px) translateY(-4px) scale(1.01);
              filter: drop-shadow(0 11px 27px rgba(0, 0, 0, 0.33));
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FloatingSky;
