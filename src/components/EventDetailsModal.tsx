"use client";

import { useState, useRef, useEffect } from "react";

interface EventDetailsModalProps {
  showContent: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EventDetailsModal({
  showContent,
  isOpen,
  onOpenChange,
}: EventDetailsModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Show modal partially after content is shown
  useEffect(() => {
    if (showContent) {
      // Delay the modal appearance slightly for smoother transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [showContent]);

  // Handle backdrop animation
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBackdrop(true);
      // Small delay to allow CSS transition to work
      const timer = setTimeout(() => {
        setBackdropVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      // Immediately start fade out
      setBackdropVisible(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShowBackdrop(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset animation key when modal opens to replay animations
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationKey((prev) => prev + 1);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Only allow dragging down when modal is open
    if (isOpen && diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Threshold for closing (100px drag down)
    if (isOpen && translateY > 100) {
      onOpenChange(false);
    }

    setTranslateY(0);
  };

  const handleClick = () => {
    onOpenChange(!isOpen);
  };

  return (
    <>
      {/* Backdrop */}
      {showBackdrop && (
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
            backdropVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-all ease-in-out md:hidden ${
          isDragging ? "duration-0" : "duration-500"
        }`}
        style={{
          bottom: 0,
          transform: `translateY(${
            !isVisible || !isOpen ? "100%" : `calc(0% + ${translateY}px)`
          })`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div
          className="flex flex-col items-center justify-center py-4 cursor-pointer select-none"
          onClick={handleClick}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
          <div className="text-sm uppercase ubuntu text-gray-600 font-semibold">
            Geser ke Bawah
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
          <div
            key={animationKey}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Date */}
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nanda+%26+Nisa%27s+Wedding&dates=20251207T020000Z/20251207T060000Z&details=You+are+invited+to+Nanda+and+Nisa%27s+wedding+celebration&location=Cordela+Hotel+Cirebon,+Jl.+Cipto+Mangunkusumo+No.111,+Kota+Cirebon,+Jawa+Barat+45133"
              target="_blank"
              rel="noopener noreferrer"
              className={`camera-focus-border py-4 px-8 w-full hover:bg-gray-50 transition-all cursor-pointer group ${
                isOpen ? "animate-fade-in delay-300 opacity-100" : "opacity-0"
              }`}
            >
              <div className="text-xs uppercase ubuntu text-gray-600 font-bold mb-2">
                Tanggal & Waktu
              </div>
              <div className="text-lg md:text-xl dancing-script text-center group-hover:text-blue-600 transition-colors">
                Minggu, 7 Desember 2025
                <br />
                09:00 - 13:00 WIB
              </div>
              <div className="text-xs text-gray-500 ubuntu text-center mt-2">
                Klik untuk menambahkan ke Google Calendar
              </div>
            </a>

            {/* Venue */}
            <a
              href="https://maps.app.goo.gl/zSdMFPQRfDsyv9ej9"
              target="_blank"
              rel="noopener noreferrer"
              className={`camera-focus-border py-4 px-8 w-full hover:bg-gray-50 transition-all cursor-pointer group ${
                isOpen ? "animate-fade-in delay-400 opacity-100" : "opacity-0"
              }`}
            >
              <div className="text-xs uppercase ubuntu text-gray-600 font-bold mb-2">
                Lokasi
              </div>
              <div className="text-lg md:text-xl dancing-script text-center group-hover:text-blue-600 transition-colors">
                Cordela Hotel Cirebon
                <br />
                Jl. Cipto Mangunkusumo No.111
                <br />
                Kota Cirebon, Jawa Barat 45133
              </div>
              <div className="text-xs text-gray-500 ubuntu text-center mt-2">
                Klik untuk melihat di Google Maps
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
