"use client";

import ShinyText from "@/components/ShinyText";
import MusicPlayer, { MusicPlayerRef } from "@/components/MusicPlayer";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import EventDetailsModal from "@/components/EventDetailsModal";
import FloatingFlowers from "@/components/FloatingFlowers";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";

export default function Home() {
  const [musicStarted, setMusicStarted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(false);
  const [guestName, setGuestName] = useState("Guest");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVerseSection, setShowVerseSection] = useState(false);
  const [showBrideGroomSection, setShowBrideGroomSection] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const brideGroomSectionRef = useRef<HTMLDivElement>(null);

  // Parallax effect using Lenis
  useLenis(({ scroll }) => {
    if (parallaxRef.current) {
      // Adjust the 0.5 value to control parallax speed (higher = faster movement)
      const yPos = scroll * 0.5;
      parallaxRef.current.style.transform = `translateY(${yPos}px)`;
    }
  });

  useEffect(() => {
    // Prevent browser scroll restoration and scroll to top on page load/refresh
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGuestName(name);
    }
    setMounted(true);
  }, []);

  // Prevent scrolling when overlay is active
  useEffect(() => {
    if (!musicStarted) {
      // Overlay is active - prevent scrolling
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Overlay is closed - allow scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [musicStarted]);

  // Intersection Observer for verse section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Show content when 30% or more is visible
            setShowVerseSection(true);
          } else if (!entry.isIntersecting) {
            // Hide content when section is completely out of view
            setShowVerseSection(false);
          }
        });
      },
      {
        threshold: [0, 0.5], // Track when section enters/exits and when 30% is visible
        rootMargin: "0px",
      }
    );

    const currentRef = verseSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Intersection Observer for bride and groom section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Show content when 30% or more is visible
            setShowBrideGroomSection(true);
          } else if (!entry.isIntersecting) {
            // Hide content when section is completely out of view
            setShowBrideGroomSection(false);
          }
        });
      },
      {
        threshold: [0, 0.5], // Track when section enters/exits and when 30% is visible
        rootMargin: "0px",
      }
    );

    const currentRef = brideGroomSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
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
    // Show music button after overlay animation completes (800ms)
    setTimeout(() => {
      setShowMusicButton(true);
    }, 800);
  };

  return (
    <>
      <div className="w-screen min-h-screen">
        <WelcomeOverlay onOpen={handleOverlayOpen}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] animate-fade-in"
          />
        </WelcomeOverlay>

        {mounted && (
          <MusicPlayer
            ref={musicPlayerRef}
            shouldAutoPlay={musicStarted}
            show={showMusicButton}
          />
        )}

        {/* Floating Event Details Button - Mobile Only */}
        {showContent && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-50 w-15 h-15 bg-black hover:bg-gray-900 text-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in delay-1200"
            aria-label="Lihat detail acara"
          >
            {/* Heart icon - represents wedding/love */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 animate-heart-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
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
              syncTouch: true,
              syncTouchLerp: 0.15,
              touchInertiaExponent: 2,
              touchMultiplier: 2,
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
                ></div>
                {/* Floating Flowers Animation */}
                {showContent && <FloatingFlowers />}
                <div className="block md:hidden absolute top-2 left-0 w-full h-[2px] bg-white"></div>
                <div className="hidden md:block absolute top-0 left-2 w-[2px] h-full bg-white"></div>
                <div className="block md:hidden absolute bottom-2 left-0 w-full h-[2px] bg-white z-10"></div>
                <div className="md:hidden absolute top-20 w-full flex justify-center">
                  <div className="w-fit flex justify-center p-4">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      className={
                        showContent ? "animate-fade-in delay-200" : "opacity-0"
                      }
                    />
                  </div>
                </div>
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center gap-6 md:gap-8">
                    <div
                      className={`text-2xl md:text-4xl dancing-script text-center ${
                        showContent ? "animate-fade-in delay-400" : "opacity-0"
                      }`}
                    >
                      Kepada Yth.
                    </div>
                    {mounted && (
                      <div
                        className={
                          showContent
                            ? "animate-fade-in delay-600"
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
                        showContent ? "animate-fade-in delay-800" : "opacity-0"
                      }`}
                    >
                      Izinkan kami berbagi kisah cinta di hari istimewa kami.
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={verseSectionRef}
                className="relative w-full h-screen flex flex-col md:justify-center items-center py-8 md:py-24 px-4 md:px-12 overflow-hidden bg-white"
              >
                <div className="md:hidden w-full flex justify-center mb-4">
                  <div className="w-fit flex justify-center p-4">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      className={
                        showVerseSection
                          ? "animate-fade-in delay-100"
                          : "opacity-0"
                      }
                    />
                  </div>
                </div>
                <div
                  className={`absolute top-4 md:top-20 left-0 md:left-20 transform rotate-90`}
                >
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px]"
                  />
                </div>
                <div
                  className={`absolute bottom-4 md:bottom-20 left-2 md:left-20`}
                >
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px]"
                  />
                </div>
                <div
                  className={`absolute top-4 md:top-20 right-0 md:right-20 transform rotate-90`}
                >
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] scale-y-[-1]"
                  />
                </div>
                <div
                  className={`absolute bottom-4 md:bottom-20 right-2 md:right-20 transform`}
                >
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] scale-x-[-1]"
                  />
                </div>
                <div className="flex flex-col justify-center items-center gap-16">
                  <div className={`w-full md:w-1/2`}>
                    <div
                      className={`text-center text-sm md:text-lg noto-naskh-arabic text-gray-600 text-right ${
                        showVerseSection
                          ? "animate-fade-in delay-300"
                          : "opacity-0"
                      }`}
                    >
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِّنْ أَنفُسِكُمْ
                      أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم
                      مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ
                      لِّقَوْمٍ يَتَفَكَّرُونَ
                    </div>
                    <div
                      className={`flex justify-end mt-4 ${
                        showVerseSection
                          ? "animate-fade-in delay-400"
                          : "opacity-0"
                      }`}
                    >
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-center text-sm md:text-base dancing-script text-center my-4 font-bold ${
                        showVerseSection
                          ? "animate-fade-in delay-500"
                          : "opacity-0"
                      }`}
                    >
                      QS. Ar-Rum: 21
                    </div>
                    <div
                      className={`flex mb-4 ${
                        showVerseSection
                          ? "animate-fade-in delay-600"
                          : "opacity-0"
                      }`}
                    >
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                        showVerseSection
                          ? "animate-fade-in delay-700"
                          : "opacity-0"
                      }`}
                    >
                      “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                      menciptakan pasangan-pasangan untukmu dari jenismu
                      sendiri, agar kamu cenderung dan merasa tenteram
                      kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
                      sayang. Sungguh, pada yang demikian itu benar-benar
                      terdapat tanda-tanda bagi kaum yang berpikir.”
                    </div>
                  </div>
                  <div className={`w-full md:w-1/2`}>
                    <div
                      className={`text-center text-sm md:text-lg noto-naskh-arabic text-gray-600 text-right ${
                        showVerseSection
                          ? "animate-fade-in delay-800"
                          : "opacity-0"
                      }`}
                    >
                      وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ
                      أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
                      وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
                    </div>
                    <div
                      className={`flex justify-end mt-4 ${
                        showVerseSection
                          ? "animate-fade-in delay-900"
                          : "opacity-0"
                      }`}
                    >
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-center text-sm md:text-base dancing-script text-center my-4 font-bold ${
                        showVerseSection
                          ? "animate-fade-in delay-1000"
                          : "opacity-0"
                      }`}
                    >
                      QS. Al-Furqan: 74
                    </div>
                    <div
                      className={`flex mb-4 ${
                        showVerseSection
                          ? "animate-fade-in delay-1100"
                          : "opacity-0"
                      }`}
                    >
                      <div className="relative w-7/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                        showVerseSection
                          ? "animate-fade-in delay-1200"
                          : "opacity-0"
                      }`}
                    >
                      “Dan orang-orang yang berkata: ‘Ya Tuhan kami,
                      anugerahkanlah kepada kami istri-istri dan keturunan kami
                      sebagai penyenang hati (kami), dan jadikanlah kami
                      pemimpin bagi orang-orang yang bertakwa.’”
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={brideGroomSectionRef}
                className="relative w-full h-screen flex flex-col justify-center items-center py-8 md:py-24 px-4 md:px-12 overflow-hidden bg-white"
              >
                <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-8">
                  <div className={`flex flex-col gap-4 md:gap-6 `}>
                    <div className="flex flex-col gap-4">
                      <div
                        className={`text-base md:text-xl noto-naskh-arabic text-gray-600 text-right font-bold ${
                          showBrideGroomSection
                            ? "animate-fade-in delay-100"
                            : "opacity-0"
                        }`}
                      >
                        بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
                      </div>
                      <div
                        className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                          showBrideGroomSection
                            ? "animate-fade-in delay-200"
                            : "opacity-0"
                        }`}
                      >
                        Dalam kasih dan izin-Nya kami dipertemukan, <br />
                        menapaki jalan cinta yang diridhai Allah SWT.
                      </div>
                    </div>
                    <div
                      className={`flex justify-center py-4 ${
                        showBrideGroomSection
                          ? "animate-fade-in delay-300"
                          : "opacity-0"
                      }`}
                    >
                      <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                        showBrideGroomSection
                          ? "animate-fade-in delay-400"
                          : "opacity-0"
                      }`}
                    >
                      Putra Pertama{" "}
                      <span className=" font-bold">Aries Octavianus</span> &{" "}
                      <span className=" font-bold">Rini Arianti</span>.
                    </div>
                    <div
                      className={`${
                        showBrideGroomSection
                          ? "animate-fade-in delay-500"
                          : "opacity-0"
                      }`}
                    >
                      <ShinyText
                        text="Nanda Achidunnafi"
                        className="text-4xl md:text-6xl dancing-script font-bold"
                      />
                    </div>
                  </div>
                  <div
                    className={`w-full h-[160px] flex justify-center items-center overflow-hidden ${
                      showBrideGroomSection
                        ? "animate-fade-in delay-600"
                        : "opacity-0"
                    }`}
                  >
                    <Image
                      src="/love.png"
                      alt="Love"
                      width={250}
                      height={250}
                      className="w-[250px] h-[250px] object-cover"
                    />
                  </div>
                  <div className={`flex flex-col items-end gap-4 md:gap-6`}>
                    <div
                      className={`${
                        showBrideGroomSection
                          ? "animate-fade-in delay-700"
                          : "opacity-0"
                      }`}
                    >
                      <ShinyText
                        text="Khoirun Nisa Amarsya"
                        className="text-4xl md:text-6xl dancing-script font-bold text-right"
                      />
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 ${
                        showBrideGroomSection
                          ? "animate-fade-in delay-800"
                          : "opacity-0"
                      }`}
                    >
                      Putri Pertama <span className=" font-bold">Hisyam</span> &{" "}
                      <span className=" font-bold">Raeni</span>.
                    </div>
                  </div>
                  <div
                    className={`flex justify-center py-4 ${
                      showBrideGroomSection
                        ? "animate-fade-in delay-900"
                        : "opacity-0"
                    }`}
                  >
                    <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                      <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="relative w-5/12 md:w-6/12 h-[1px] bg-gray-600">
                      <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  <div
                    className={`text-lg md:text-xl dancing-script text-gray-600 text-center font-bold ${
                      showBrideGroomSection
                        ? "animate-fade-in delay-1000"
                        : "opacity-0"
                    }`}
                  >
                    Cinta sederhana, bahagia hingga surga. 💞
                  </div>
                </div>
              </div>
              <div className="relative w-full h-screen flex flex-col overflow-hidden bg-transparent">
                <div className="relative w-full h-1/3 bg-white overflow-hidden"></div>
                <div className="w-full h-1/3 bg-transparent"></div>
                <div className="relative w-full h-1/3 bg-white py-8 md:py-24 px-4 md:px-12 overflow-hidden"></div>
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
