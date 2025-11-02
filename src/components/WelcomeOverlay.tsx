"use client";

import { useState } from "react";

interface WelcomeOverlayProps {
  onOpen: () => void;
  children?: React.ReactNode;
}

export default function WelcomeOverlay({
  onOpen,
  children,
}: WelcomeOverlayProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setIsClosing(true);

    // Wait for animation to complete before calling onOpen
    setTimeout(() => {
      setIsOpen(false);
      onOpen();
    }, 800); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center transition-all duration-800 ${
        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8 px-6 max-w-md text-center">
        {/* Logo or custom content */}
        {children}

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl dancing-script font-bold text-gray-800 animate-fade-in">
            Selamat Datang di Pernikahan Kami
          </h1>
          <p className="text-sm md:text-md ubuntu text-gray-600 animate-fade-in delay-200">
            Klik tombol di bawah untuk melihat undangan
          </p>
        </div>

        {/* Open Button */}
        <button
          onClick={handleOpen}
          className="px-10 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full text-xl dancing-script font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-fade-in delay-300 relative overflow-hidden group"
        >
          <span className="relative z-10">Buka Undangan</span>
          <span className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
      </div>
    </div>
  );
}
