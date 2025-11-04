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
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVerseSection, setShowVerseSection] = useState(false);
  const [showBrideGroomSection, setShowBrideGroomSection] = useState(false);
  const [showFormSection, setShowFormSection] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const brideGroomSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [canAttend, setCanAttend] = useState<"" | "yes" | "no">("");
  const [numberOfPersons, setNumberOfPersons] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);

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
      setGuestName(name);
      // Auto-populate the form field "Nama Lengkap" with URL parameter
      setFullName(name);
      
      // Check if this guest has already submitted
      const submissionKey = `rsvp_submitted_${name.toLowerCase().replace(/\s+/g, '_')}`;
      const previousSubmission = localStorage.getItem(submissionKey);
      
      if (previousSubmission) {
        const submissionData = JSON.parse(previousSubmission);
        setHasSubmittedBefore(true);
        // Pre-fill form with previous submission
        setFullName(submissionData.fullName);
        setCanAttend(submissionData.canAttend);
        setNumberOfPersons(submissionData.numberOfPersons);
        setMessage(submissionData.message);
      }
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

  // Intersection Observer for Form section animations (all 3 sections as one)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setShowFormSection(true);
          } else if (!entry.isIntersecting) {
            setShowFormSection(false);
          }
        });
      },
      {
        threshold: [0, 0.3],
        rootMargin: "0px",
      }
    );

    const currentRef = formSectionRef.current;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !canAttend || !message) {
      alert("Mohon lengkapi semua kolom yang diperlukan");
      return;
    }

    if (canAttend === "yes" && !numberOfPersons) {
      alert("Mohon isi jumlah tamu yang akan hadir");
      return;
    }

    setIsSubmitting(true);

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      if (!scriptUrl) {
        console.error("Google Script URL not configured");
        alert("Konfigurasi tidak lengkap. Silakan hubungi administrator.");
        return;
      }

      // Prepare data to send
      const formData = {
        fullName,
        canAttend: canAttend === "yes" ? "Hadir" : "Tidak Hadir",
        numberOfPersons: canAttend === "yes" ? numberOfPersons : "0",
        message,
        isUpdate: hasSubmittedBefore, // Flag to indicate if this is an update
      };

      // Send to Google Sheets via Apps Script
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Important for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Save to localStorage to prevent duplicates
      const submissionKey = `rsvp_submitted_${fullName.toLowerCase().replace(/\s+/g, '_')}`;
      localStorage.setItem(
        submissionKey,
        JSON.stringify({
          fullName,
          canAttend,
          numberOfPersons,
          message,
          timestamp: new Date().toISOString(),
        })
      );

      // Note: With no-cors mode, we can't read the response
      // but if no error is thrown, it likely succeeded
      setSubmitSuccess(true);
      setHasSubmittedBefore(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
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
            className="md:hidden fixed bottom-6 right-6 z-50 w-15 h-15 bg-black hover:bg-gray-900 text-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 animate-fade-in delay-1200"
            aria-label="Lihat detail acara"
          >
            {/* Calendar icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{
                animation: "alarmShake 3s ease-in-out infinite",
                transformOrigin: "center",
              }}
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
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
                    Cinta sederhana, bahagia hingga surga.
                  </div>
                </div>
              </div>
              <div
                ref={formSectionRef}
                className="relative w-full h-screen flex flex-col overflow-hidden bg-transparent"
              >
                {/* RSVP Form Section */}
                <div className="relative w-full h-1/3 bg-white overflow-y-auto flex flex-col justify-center items-center py-4 md:py-6 px-4 md:px-8">
                  <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-3">
                    <div
                      className={`text-2xl md:text-3xl dancing-script text-center font-bold text-gray-800 ${
                        showFormSection ? "animate-fade-in" : "opacity-0"
                      }`}
                    >
                      {hasSubmittedBefore
                        ? "Perbarui Konfirmasi Kehadiran"
                        : "Konfirmasi Kehadiran"}
                    </div>
                    {hasSubmittedBefore && (
                      <div
                        className={`text-xs md:text-sm ubuntu text-center text-blue-600 bg-blue-50 py-2 px-3 rounded-lg ${
                          showFormSection
                            ? "animate-fade-in delay-100"
                            : "opacity-0"
                        }`}
                      >
                        ℹ️ Anda sudah pernah mengirim RSVP. Anda dapat memperbarui
                        konfirmasi kehadiran Anda di bawah ini.
                      </div>
                    )}

                    {/* Full Name Input - Full Width */}
                    <div
                      className={`flex flex-col gap-1 ${
                        showFormSection
                          ? "animate-fade-in delay-200"
                          : "opacity-0"
                      }`}
                    >
                      <label
                        htmlFor="fullName"
                        className="text-xs md:text-sm ubuntu text-gray-700 font-semibold"
                      >
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 ubuntu transition-all"
                        placeholder="Contoh: John Doe"
                        required
                      />
                    </div>

                    {/* Can Attend and Number of Persons - Side by Side */}
                    <div
                      className={`flex flex-row gap-2 md:gap-3 ${
                        showFormSection
                          ? "animate-fade-in delay-400"
                          : "opacity-0"
                      }`}
                    >
                      {/* Can Attend Dropdown */}
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="canAttend"
                          className="text-xs md:text-sm ubuntu text-gray-700 font-semibold"
                        >
                          Konfirmasi Kehadiran{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="canAttend"
                          value={canAttend}
                          onChange={(e) =>
                            setCanAttend(e.target.value as "" | "yes" | "no")
                          }
                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 ubuntu bg-white transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.5rem center",
                            backgroundSize: "1.25em 1.25em",
                            paddingRight: "2rem",
                          }}
                          required
                        >
                          <option value="" disabled>
                            Pilih status kehadiran
                          </option>
                          <option value="yes">✓ Ya, saya akan hadir</option>
                          <option value="no">
                            ✗ Maaf, saya tidak bisa hadir
                          </option>
                        </select>
                      </div>

                      {/* Number of Persons (always visible, disabled when not attending) */}
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="numberOfPersons"
                          className="text-xs md:text-sm ubuntu text-gray-700 font-semibold"
                        >
                          Jumlah Tamu yang Hadir{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="numberOfPersons"
                          value={numberOfPersons}
                          onChange={(e) => setNumberOfPersons(e.target.value)}
                          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none ubuntu bg-white transition-all appearance-none ${
                            canAttend !== "yes"
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 cursor-pointer"
                          }`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23${
                              canAttend !== "yes" ? "9CA3AF" : "374151"
                            }'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.5rem center",
                            backgroundSize: "1.25em 1.25em",
                            paddingRight: "2rem",
                          }}
                          required={canAttend === "yes"}
                          disabled={canAttend !== "yes"}
                        >
                          <option value="1">1 Orang</option>
                          <option value="2">2 Orang</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift Section */}
                <div className="w-full h-1/3 bg-transparent overflow-y-auto flex flex-col justify-center items-center py-4 md:py-6 px-4 md:px-8">
                  <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 flex flex-col gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg">
                    <div
                      className={`text-2xl md:text-3xl dancing-script text-center font-bold text-gray-800 ${
                        showFormSection
                          ? "animate-fade-in delay-600"
                          : "opacity-0"
                      }`}
                    >
                      Amplop Digital
                    </div>
                    <div
                      className={`text-xs md:text-sm ubuntu text-center text-gray-600 ${
                        showFormSection
                          ? "animate-fade-in delay-800"
                          : "opacity-0"
                      }`}
                    >
                      💞 Dari hati, untuk rumah tangga baru kami. 💞
                    </div>

                    {/* Bank Accounts - Side by Side */}
                    <div
                      className={`flex flex-row gap-2 md:gap-3 ${
                        showFormSection
                          ? "animate-fade-in delay-1000"
                          : "opacity-0"
                      }`}
                    >
                      {/* Bank Account 1 */}
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText("1234567890");
                          alert("Nomor rekening telah disalin!");
                        }}
                        className="relative flex flex-col gap-2 p-3 md:p-4 border border-gray-300 rounded-lg flex-1 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                            />
                          </svg>
                        </div>
                        <div className="text-base md:text-lg dancing-script font-bold text-gray-800">
                          Bank BSI
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-base md:text-lg ubuntu font-bold text-gray-800">
                            7183108829
                          </div>
                          <div className="text-xs ubuntu text-gray-600">
                            a.n. Nanda Achidunnafi
                          </div>
                        </div>
                      </div>

                      {/* Bank Account 2 */}
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText("0987654321");
                          alert("Nomor rekening telah disalin!");
                        }}
                        className="relative flex flex-col gap-2 p-3 md:p-4 border border-gray-300 rounded-lg flex-1 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                            />
                          </svg>
                        </div>
                        <div className="text-base md:text-lg dancing-script font-bold text-gray-800">
                          ShopeePay
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-base md:text-lg ubuntu font-bold text-gray-800">
                            08999847355
                          </div>
                          <div className="text-xs ubuntu text-gray-600">
                            a.n. Khoirun Nisa Amarsya
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="relative w-full h-1/3 bg-white overflow-y-auto flex flex-col justify-center items-center py-4 md:py-6 px-4 md:px-8">
                  <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-3">
                    <div
                      className={`text-2xl md:text-3xl dancing-script text-center font-bold text-gray-800 ${
                        showFormSection
                          ? "animate-fade-in delay-1200"
                          : "opacity-0"
                      }`}
                    >
                      Ucapan & Doa
                    </div>

                    {/* Message Textarea */}
                    <div
                      className={`flex flex-col gap-1 ${
                        showFormSection
                          ? "animate-fade-in delay-1400"
                          : "opacity-0"
                      }`}
                    >
                      <label
                        htmlFor="message"
                        className="text-xs md:text-sm ubuntu text-gray-700 font-semibold"
                      >
                        Doa dan Ucapan untuk Kami
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 ubuntu resize-none"
                        placeholder="Titipkan doa terbaikmu untuk perjalanan kami..."
                        required
                      />
                    </div>

                    {/* Buttons - Side by Side */}
                    <div
                      className={`flex flex-row gap-2 md:gap-3 justify-center ${
                        showFormSection
                          ? "animate-fade-in delay-1600"
                          : "opacity-0"
                      }`}
                    >
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="md:hidden px-6 md:px-8 py-2.5 rounded-full text-base md:text-lg dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-800"
                      >
                        Detail Acara
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || submitSuccess}
                        className={`px-6 md:px-8 py-2.5 rounded-full text-base md:text-lg dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                          submitSuccess
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : isSubmitting
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-900 text-white"
                        }`}
                      >
                        {submitSuccess
                          ? hasSubmittedBefore
                            ? "✓ Diperbarui!"
                            : "✓ Terkirim!"
                          : isSubmitting
                          ? hasSubmittedBefore
                            ? "Memperbarui..."
                            : "Mengirim..."
                          : hasSubmittedBefore
                          ? "Perbarui RSVP"
                          : "Kirim RSVP"}
                      </button>
                    </div>

                    {submitSuccess && (
                      <div className="text-center text-sm text-green-600 ubuntu animate-fade-in">
                        {hasSubmittedBefore
                          ? "Konfirmasi berhasil diperbarui~ Terima kasih! ✨"
                          : "Konfirmasi diterima~ Terima kasih! ✨"}
                      </div>
                    )}
                  </div>
                </div>
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
