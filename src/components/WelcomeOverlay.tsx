"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface WelcomeOverlayProps {
  onOpen: () => void;
  children?: React.ReactNode;
}

interface Firefly {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}

// Generate fireflies with random positions and animation delays
const generateFireflies = (count: number): Firefly[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));
};

export default function WelcomeOverlay({
  onOpen,
  children,
}: WelcomeOverlayProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  // Generate fireflies only on client side to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFireflies(generateFireflies(20));
  }, []);

  const handleOpen = () => {
    // Call onOpen IMMEDIATELY to ensure music can start in the user gesture event
    // This is critical for iOS Safari autoplay
    onOpen();

    // Then start the closing animation
    setIsClosing(true);

    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsOpen(false);
    }, 800); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center transition-all duration-800 overflow-hidden ${
        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Fireflies Animation */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute rounded-full bg-yellow-400 opacity-0 animate-firefly"
          style={{
            left: `${firefly.left}%`,
            top: `${firefly.top}%`,
            width: `${firefly.size}px`,
            height: `${firefly.size}px`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
            boxShadow: `0 0 ${firefly.size * 3}px ${
              firefly.size
            }px rgba(251, 191, 36, 0.3)`,
          }}
        />
      ))}

      <div className="flex flex-col items-center gap-8 px-6 max-w-md text-center relative z-10">
        {/* Logo or custom content */}
        {children}

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl dancing-script font-bold text-gray-800 animate-fade-in delay-200">
            {t.welcome.title}
          </h1>
        </div>

        {/* Open Button */}
        <div className="animate-fade-in delay-600">
          <button
            onClick={handleOpen}
            className="px-10 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full text-xl dancing-script font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 relative overflow-hidden group cursor-pointer"
          >
            <span className="relative z-10">{t.welcome.openButton}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
