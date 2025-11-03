"use client";

import ShinyText from "@/components/ShinyText";
import MusicPlayer, { MusicPlayerRef } from "@/components/MusicPlayer";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import EventDetailsModal, {
  DRAG_HANDLE_HEIGHT,
} from "@/components/EventDetailsModal";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";

export default function Home() {
  const [musicStarted, setMusicStarted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [guestName, setGuestName] = useState("Guest");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax effect using Lenis
  useLenis(({ scroll }) => {
    if (parallaxRef.current) {
      // Adjust the 0.5 value to control parallax speed (higher = faster movement)
      const yPos = scroll * 0.5;
      parallaxRef.current.style.transform = `translateY(${yPos}px)`;
    }
  });

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
    // Start music IMMEDIATELY in this user gesture event handler
    // This is critical for iOS Safari autoplay to work
    if (musicPlayerRef.current) {
      musicPlayerRef.current.play();
    }

    setMusicStarted(true);
    // Delay content animation slightly for smoother transition
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  };

  return (
    <>
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

            <MusicPlayer ref={musicPlayerRef} shouldAutoPlay={musicStarted} />
          </>
        )}

        <div className="relative flex flex-col md:flex-row w-full h-full">
          <div className="hidden md:flex fixed left-0 top-0 md:w-5/12 xl:w-3/12 h-full flex flex-col items-center justify-center z-10 bg-white">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className={
                showContent ? "animate-fade-in delay-100" : "opacity-0"
              }
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
          <div className="hidden md:block md:w-5/12 xl:w-3/12 h-full"></div>
          <ReactLenis
            root
            options={{
              lerp: 0.1,
              duration: 1.2,
              smoothWheel: true,
            }}
          >
            <div className="relative w-full md:w-7/12 xl:w-9/12">
              <div className="fixed top-0 left-0 w-full h-screen bg-[url('/bg-2.jpg')] bg-cover bg-center">
                <div className="w-full h-full bg-white/50"></div>
              </div>
              <div className="relative w-full h-screen overflow-hidden">
                <div
                  ref={parallaxRef}
                  className="absolute top-0 left-0 w-full h-[120%] bg-[url('/bg.jpg')] bg-cover bg-center will-change-transform"
                >
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
                          showContent
                            ? "animate-fade-in delay-400"
                            : "opacity-0"
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
              <div className="relative w-full h-screen flex flex-col md:justify-center items-center py-8 md:py-24 px-4 md:px-12 overflow-hidden bg-white">
                <div className="md:hidden w-full flex justify-center mb-4">
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
                <div className="absolute top-4 md:top-20 left-0 md:left-20 transform rotate-90">
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px]"
                  />
                </div>
                <div className="absolute bottom-16 md:bottom-20 left-2 md:left-20">
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px]"
                  />
                </div>
                <div className="absolute top-4 md:top-20 right-0 md:right-20 transform rotate-90">
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] scale-y-[-1]"
                  />
                </div>
                <div className="absolute bottom-16 md:bottom-20 right-2 md:right-20 transform">
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] scale-x-[-1]"
                  />
                </div>
                <div className="flex flex-col justify-center items-center gap-16">
                  <div className="w-full md:w-1/2">
                    <div className="text-center text-sm md:text-base dancing-script text-gray-600 text-right">
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِّنْ أَنفُسِكُمْ
                      أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم
                      مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ
                      لِّقَوْمٍ يَتَفَكَّرُونَ
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center text-sm md:text-base dancing-script text-center my-4 font-bold">
                      QS. Ar-Rum: 21
                    </div>
                    <div className="flex mb-4">
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-xs md:text-base ubuntu text-gray-600 font-light">
                      “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                      menciptakan pasangan-pasangan untukmu dari jenismu
                      sendiri, agar kamu cenderung dan merasa tenteram
                      kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
                      sayang. Sungguh, pada yang demikian itu benar-benar
                      terdapat tanda-tanda bagi kaum yang berpikir.”
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="text-center text-sm md:text-base dancing-script text-gray-600 text-right">
                      وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ
                      أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
                      وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center text-sm md:text-base dancing-script text-center my-4 font-bold">
                      QS. Al-Furqan: 74
                    </div>
                    <div className="flex mb-4">
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-xs md:text-base ubuntu text-gray-600 font-light">
                      “Dan orang-orang yang berkata: ‘Ya Tuhan kami,
                      anugerahkanlah kepada kami istri-istri dan keturunan kami
                      sebagai penyenang hati (kami), dan jadikanlah kami
                      pemimpin bagi orang-orang yang bertakwa.’”
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-screen flex flex-col justify-center items-center py-8 md:py-24 px-4 md:px-12 overflow-hidden bg-white">
                <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-8">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="text-lg md:text-xl dancing-script text-gray-600 text-right font-bold">
                        بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
                      </div>
                      <div className="text-xs md:text-base ubuntu text-gray-600 font-light">
                        Dalam kasih dan izin-Nya kami dipertemukan, <br />
                        menapaki jalan cinta yang diridhai Allah SWT.
                      </div>
                    </div>
                    <div className="flex justify-center py-4">
                      <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-xs md:text-base ubuntu text-gray-600 font-light">
                      Putra Sulung{" "}
                      <span className=" font-bold">Rini Arianti</span>,
                    </div>
                    <ShinyText
                      text="Nanda Achidunnafi"
                      className="text-4xl md:text-6xl dancing-script font-bold"
                    />
                    <div className="text-xs md:text-base ubuntu text-gray-600">
                      Bin <span className="font-bold">Aries Octavianus.</span>
                    </div>
                  </div>
                  <div className="w-full h-[160px] flex justify-center items-center overflow-hidden">
                    <Image
                      src="/love.png"
                      alt="Love"
                      width={250}
                      height={250}
                      className="w-[250px] h-[250px] object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-4 md:gap-6">
                    <div className="text-xs md:text-base ubuntu text-gray-600">
                      Putri Sulung <span className=" font-bold">Raeni</span>,
                    </div>
                    <ShinyText
                      text="Khoirun Nisa Amarsya"
                      className="text-4xl md:text-6xl dancing-script font-bold text-right"
                    />
                    <div className="text-xs md:text-base ubuntu text-gray-600">
                      Bin <span className="font-bold">Hisyam.</span>
                    </div>
                  </div>
                  <div className="flex justify-center py-4">
                    <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                      <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                      <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-lg md:text-xl dancing-script text-gray-600 text-center font-bold">
                    Cinta sederhana, bahagia hingga surga. 💞
                  </div>
                </div>
              </div>
              <div className="relative w-full h-screen flex flex-col overflow-hidden bg-transparent">
                <div className="absolute top-0 left-0 w-full h-[30vh] bg-white"></div>
                <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-white py-8 md:py-24 px-4 md:px-12"></div>
              </div>
            </div>
          </ReactLenis>
        </div>

        {/* Swipeable Event Details Modal for Mobile */}
        <EventDetailsModal
          showContent={showContent}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </>
  );
}
