"use client";

import ShinyText from "@/components/ShinyText";
import MusicPlayer from "@/components/MusicPlayer";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import EventDetailsModal, {
  DRAG_HANDLE_HEIGHT,
} from "@/components/EventDetailsModal";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [musicStarted, setMusicStarted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [guestName, setGuestName] = useState("Guest");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGuestName(name);
    }
    setMounted(true);
  }, []);

  const handleOverlayOpen = () => {
    setMusicStarted(true);
    // Delay content animation slightly for smoother transition
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  };

  return (
    <div className="w-screen h-screen">
      {mounted && (
        <>
          <WelcomeOverlay onOpen={handleOverlayOpen}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] animate-fade-in"
            />
          </WelcomeOverlay>

          <MusicPlayer shouldAutoPlay={musicStarted} />
        </>
      )}

      <div className="relative flex flex-col md:flex-row w-full h-full">
        <div className="hidden md:flex relative md:w-5/12 xl:w-3/12 h-full flex flex-col items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className={showContent ? "animate-fade-in delay-100" : "opacity-0"}
          />

          {/* Event Details */}
          <div className="flex flex-col items-center mt-8 gap-6 w-full px-8">
            {/* Date */}
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nanda+%26+Nisa%27s+Wedding&dates=20251207T020000Z/20251207T060000Z&details=You+are+invited+to+Nanda+and+Nisa%27s+wedding+celebration&location=Cordela+Hotel+Cirebon,+Jl.+Cipto+Mangunkusumo+No.111,+Kota+Cirebon,+Jawa+Barat+45133"
              target="_blank"
              rel="noopener noreferrer"
              className={`camera-focus-border py-4 px-8 w-full hover:bg-gray-50 transition-colors cursor-pointer group ${
                showContent ? "animate-fade-in delay-200" : "opacity-0"
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
              className={`camera-focus-border py-4 px-8 w-full hover:bg-gray-50 transition-colors cursor-pointer group ${
                showContent ? "animate-fade-in delay-300" : "opacity-0"
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

          {/* RSVP Button */}
          <a
            href="https://forms.gle/4LBDDDcMSTt9ZTQh9"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 px-10 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full text-xl dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
              showContent ? "animate-fade-in delay-400" : "opacity-0"
            }`}
          >
            Konfirmasi Kehadiran
          </a>
        </div>
        <div className="relative w-full md:w-7/12 xl:w-9/12 h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center">
            <div className="block md:hidden absolute top-2 left-0 w-full h-[2px] bg-white"></div>
            <div className="hidden md:block absolute top-0 left-2 w-[2px] h-full bg-white"></div>
            <div
              className="block md:hidden absolute left-0 w-full h-[2px] bg-white transition-all duration-500 delay-750 ease-in-out"
              style={{
                bottom:
                  showContent && isModalOpen === false
                    ? `calc(${DRAG_HANDLE_HEIGHT}px + 8px)`
                    : "8px",
              }}
            ></div>
          </div>
          <div className="md:hidden absolute top-20 w-full flex justify-center">
            <div className="w-fit flex justify-center p-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className={
                  showContent ? "animate-fade-in delay-100" : "opacity-0"
                }
              />
            </div>
          </div>
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6 md:gap-8">
              <div
                className={`text-2xl md:text-4xl dancing-script text-center ${
                  showContent ? "animate-fade-in delay-300" : "opacity-0"
                }`}
              >
                Kepada Yth.
              </div>
              {mounted && (
                <div
                  className={
                    showContent ? "animate-fade-in delay-400" : "opacity-0"
                  }
                >
                  <ShinyText
                    text={guestName}
                    disabled={false}
                    speed={3}
                    className="text-5xl md:text-8xl dancing-script font-bold text-center"
                  />
                </div>
              )}
              <div
                className={`text-2xl md:text-4xl dancing-script text-center ${
                  showContent ? "animate-fade-in delay-500" : "opacity-0"
                }`}
              >
                Izinkan kami berbagi kisah cinta di hari istimewa kami.
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`px-10 py-3 bg-white hover:bg-gray-100 text-black rounded-full text-md dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 md:hidden ${
                  showContent ? "animate-fade-in delay-600" : "opacity-0"
                }`}
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Swipeable Event Details Modal for Mobile */}
      <EventDetailsModal
        showContent={showContent}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
