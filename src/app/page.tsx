"use client";

import ShinyText from "@/components/ShinyText";
import MusicPlayer, { MusicPlayerRef } from "@/components/MusicPlayer";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import EventDetailsModal from "@/components/EventDetailsModal";
import FloatingFlowers from "@/components/FloatingFlowers";
import FloatingSky from "@/components/FloatingSky";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";

export default function Home() {
  const { t } = useLanguage();
  const [musicStarted, setMusicStarted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(false);
  const [guestName, setGuestName] = useState(t.hero.defaultGuestName);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVerseSection, setShowVerseSection] = useState(false);
  const [showBrideGroomSection, setShowBrideGroomSection] = useState(false);
  const [showFormSection, setShowFormSection] = useState(false);
  const [isInRSVPSection, setIsInRSVPSection] = useState(false);
  const [showEnvelopeSection, setShowEnvelopeSection] = useState(true);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const loveIconRef = useRef<HTMLDivElement>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const brideGroomSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const rsvpSectionRef = useRef<HTMLDivElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [canAttend, setCanAttend] = useState<"" | "yes" | "no">("");
  const [numberOfPersons, setNumberOfPersons] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);

  // Special guest names that should be treated like "Tamu Undangan"
  // These names will show as labels but won't have autocomplete functionality
  const specialGuestNames = [
    "Keluarga Besar Mempelai Pria",
    "Keluarga Besar Mempelai Wanita",
    "Keluarga Besar SDIT Al Ummah",
    "Keluarga Besar Podifi",
  ];

  // Normalize string for comparison (remove spaces and hyphens, lowercase)
  const normalizeForComparison = (str: string) =>
    str.toLowerCase().replace(/[\s-]/g, "");

  // Check if current guest name is a special guest (treated like default guest)
  const isSpecialGuest = specialGuestNames.some(
    (name) => normalizeForComparison(guestName) === normalizeForComparison(name)
  );

  // Get translated guest name for display
  const getDisplayGuestName = () => {
    if (guestName === t.hero.defaultGuestName) {
      return t.hero.defaultGuestName;
    }

    // Check if it's a special guest and translate accordingly
    const normalizedGuest = normalizeForComparison(guestName);

    if (
      normalizedGuest ===
      normalizeForComparison("Keluarga Besar Mempelai Pria")
    ) {
      return t.hero.specialGuests.keluargaBesarMempelaiPria;
    }
    if (
      normalizedGuest ===
      normalizeForComparison("Keluarga Besar Mempelai Wanita")
    ) {
      return t.hero.specialGuests.keluargaBesarMempelaiWanita;
    }
    if (
      normalizedGuest === normalizeForComparison("Keluarga Besar SDIT Al Ummah")
    ) {
      return t.hero.specialGuests.keluargaBesarSDITAlUmmah;
    }
    if (normalizedGuest === normalizeForComparison("Keluarga Besar Podifi")) {
      return t.hero.specialGuests.keluargaBesarPodifi;
    }

    // Return original guest name if not a special guest
    return guestName;
  };

  // Parallax effect using Lenis
  useLenis(({ scroll }) => {
    if (parallaxRef.current) {
      // Adjust the 0.5 value to control parallax speed (higher = faster movement)
      const yPos = scroll * 0.8;
      parallaxRef.current.style.transform = `translateY(${yPos}px)`;
    }

    // Love icon parallax effect
    if (loveIconRef.current) {
      const rect = loveIconRef.current.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = window.innerHeight / 2;

      // Calculate offset from screen center (positive when below center, negative when above)
      const distanceFromCenter = elementCenter - screenCenter;

      // Apply parallax based on distance from center
      // Multiply by a factor to control the strength (0.15 = subtle effect)
      const yPos = distanceFromCenter * -0.05;
      loveIconRef.current.style.transform = `translateY(${yPos}px)`;
    }

    // Check if RSVP section is in view
    if (rsvpSectionRef.current) {
      const rect = rsvpSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // If 30% or more of RSVP section is visible
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const sectionHeight = rect.height;
      const visibleRatio = visibleHeight / sectionHeight;

      if (visibleRatio >= 0.3 && rect.top < windowHeight && rect.bottom > 0) {
        setIsInRSVPSection(true);
      } else {
        setIsInRSVPSection(false);
      }
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

      // Check if this guest has already submitted
      const submissionKey = `rsvp_submitted_${name
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, "_")}`;
      const previousSubmission = localStorage.getItem(submissionKey);

      if (previousSubmission) {
        // Auto-fill the name if they've submitted before
        setFullName(name.replace(/-/g, " ").toUpperCase());
      }
    }

    // Check if envelope section should be hidden
    const hideEnvelope = params.get("hideEnvelope");
    if (hideEnvelope === "true") {
      setShowEnvelopeSection(false);
    }

    setMounted(true);
  }, []);

  // Check if current fullName has submitted before (dynamically)
  useEffect(() => {
    if (fullName && fullName.trim() !== "") {
      const submissionKey = `rsvp_submitted_${fullName
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, "_")}`;
      const previousSubmission = localStorage.getItem(submissionKey);

      if (previousSubmission) {
        const submissionData = JSON.parse(previousSubmission);
        setHasSubmittedBefore(true);
        // Pre-fill form with previous submission data for this name
        setCanAttend(submissionData.canAttend);
        setNumberOfPersons(submissionData.numberOfPersons);
        setMessage(submissionData.message);
      } else {
        // Reset if this name hasn't submitted before
        setHasSubmittedBefore(false);
      }
    } else {
      setHasSubmittedBefore(false);
    }
  }, [fullName]);

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

  // Intersection Observer for verse section animations (only triggers once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Show content when 50% or more is visible
            setShowVerseSection(true);
            // Unobserve after first trigger to prevent replay
            if (verseSectionRef.current) {
              observer.unobserve(verseSectionRef.current);
            }
          }
        });
      },
      {
        threshold: [0, 0.5], // Track when 50% is visible
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

  // Intersection Observer for bride and groom section animations (only triggers once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Show content when 50% or more is visible
            setShowBrideGroomSection(true);
            // Unobserve after first trigger to prevent replay
            if (brideGroomSectionRef.current) {
              observer.unobserve(brideGroomSectionRef.current);
            }
          }
        });
      },
      {
        threshold: [0, 0.5], // Track when 50% is visible
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

  // Intersection Observer for Form section animations (only triggers once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            // Show content when 30% or more is visible
            setShowFormSection(true);
            // Unobserve after first trigger to prevent replay
            if (formSectionRef.current) {
              observer.unobserve(formSectionRef.current);
            }
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

  const handleScrollToRSVP = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const rsvpSection = document.getElementById("rsvp");
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || fullName.trim() === "") {
      alert(t.alerts.pleaseEnterFullName);
      return;
    }

    if (!canAttend) {
      alert(t.alerts.pleaseConfirmAttendance);
      return;
    }

    if (canAttend === "yes" && !numberOfPersons) {
      alert(t.alerts.pleaseEnterGuestCount);
      return;
    }

    setIsSubmitting(true);

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      if (!scriptUrl) {
        console.error("Google Script URL not configured");
        alert(t.alerts.configError);
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
      const submissionKey = `rsvp_submitted_${fullName
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, "_")}`;
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
      alert(t.alerts.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen">
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
            className="xl:hidden fixed bottom-6 right-6 z-50 w-15 h-15 bg-black hover:bg-gray-900 text-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 animate-fade-in delay-1200"
            aria-label={t.event.viewEventDetails}
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

        <div className="relative flex flex-col xl:flex-row w-full h-full">
          <div className="hidden xl:flex fixed left-0 top-0 xl:w-5/12 2xl:w-3/12 h-full flex flex-col items-center justify-center z-10 bg-white">
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
                  {t.event.dateTimeLabel}
                </div>
                <div className="text-lg md:text-xl dancing-script text-center group-hover:text-blue-600 transition-colors">
                  {t.event.date}
                  <br />
                  {t.event.time}
                </div>
                <div className="text-xs text-gray-500 ubuntu text-center mt-2">
                  {t.event.addToCalendar}
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
                  {t.event.locationLabel}
                </div>
                <div className="text-lg md:text-xl dancing-script text-center group-hover:text-blue-600 transition-colors">
                  {t.event.venueName}
                  <br />
                  {t.event.venueAddress}
                  <br />
                  {t.event.venueCity}
                </div>
                <div className="text-xs text-gray-500 ubuntu text-center mt-2">
                  {t.event.openMaps}
                </div>
              </a>
            </div>

            {/* RSVP Button */}
            <div
              className={`mt-8 transition-all duration-800 delay-400 ${
                showContent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5 pointer-events-none"
              }`}
            >
              <a
                href="#rsvp"
                onClick={handleScrollToRSVP}
                className={`inline-block px-10 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full text-xl dancing-script font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.05] cursor-pointer ${
                  isInRSVPSection ? "opacity-0 pointer-events-none" : ""
                }`}
              >
                {t.rsvp.confirmAttendance}
              </a>
            </div>
          </div>
          <div className="hidden xl:block xl:w-5/12 2xl:w-3/12 h-full"></div>
          <ReactLenis
            root
            options={{
              lerp: 0.1,
              duration: 1.2,
              smoothWheel: true,
              syncTouch: true,
            }}
          >
            <div className="relative w-full xl:w-7/12 2xl:w-9/12">
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
                <div className="block xl:hidden absolute top-2 left-0 w-full h-[2px] bg-white"></div>
                <div className="hidden xl:block absolute top-0 left-2 w-[2px] h-full bg-white"></div>
                <div className="block xl:hidden absolute bottom-2 left-0 w-full h-[2px] bg-white z-10"></div>
                <div className="xl:hidden absolute top-20 w-full flex justify-center">
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
                <div className="w-full h-full relative flex flex-col items-center justify-center px-4">
                  <div className="flex flex-col items-center gap-6 md:gap-8">
                    <div
                      className={`text-2xl md:text-4xl dancing-script text-center ${
                        showContent ? "animate-fade-in delay-400" : "opacity-0"
                      }`}
                    >
                      {t.hero.dearGuest}
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
                          text={getDisplayGuestName()
                            .replace(/-/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
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
                      {t.hero.subtitle}
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={verseSectionRef}
                className="relative w-full h-screen flex flex-col justify-center items-center px-4 md:px-12 overflow-hidden bg-white"
              >
                <div
                  className={`absolute top-4 md:top-20 left-0 md:left-20 transform rotate-90`}
                >
                  <Image
                    src="/angle-cal.png"
                    alt="Caligraphic Angle"
                    width={200}
                    height={200}
                    className="w-[100px] md:w-[150px] lg:w-[200px] h-[100px] md:h-[150px] lg:h-[200px]"
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
                    className="w-[100px] md:w-[150px] lg:w-[200px] h-[100px] md:h-[150px] lg:h-[200px]"
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
                    className="w-[100px] md:w-[150px] lg:w-[200px] h-[100px] md:h-[150px] lg:h-[200px] scale-y-[-1]"
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
                    className="w-[100px] md:w-[150px] lg:w-[200px] h-[100px] md:h-[150px] lg:h-[200px] scale-x-[-1]"
                  />
                </div>
                <div className="flex flex-col justify-center items-center gap-16">
                  <div className={`w-full md:w-1/2`}>
                    <div
                      className={`text-center text-sm md:text-lg noto-naskh-arabic text-gray-600 text-right ${
                        showVerseSection
                          ? "animate-fade-in delay-400"
                          : "opacity-0"
                      }`}
                    >
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِّنْ أَنفُسِكُمْ
                      أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم
                      مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ
                      لِّقَوْمٍ يَتَفَكَّرُونَ
                    </div>
                    <div className="flex justify-end mt-4">
                      <div
                        className={`relative h-[1px] bg-gray-600 ${
                          showVerseSection
                            ? "animate-line-reveal-right delay-800"
                            : "w-0 opacity-0"
                        }`}
                      >
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-center text-sm md:text-base dancing-script text-center my-4 font-bold ${
                        showVerseSection
                          ? "animate-fade-in delay-1400"
                          : "opacity-0"
                      }`}
                    >
                      {t.verses.arRum21}
                    </div>
                    <div className="flex mb-4">
                      <div
                        className={`relative h-[1px] bg-gray-600 ${
                          showVerseSection
                            ? "animate-line-reveal-left delay-800"
                            : "w-0 opacity-0"
                        }`}
                      >
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                        showVerseSection
                          ? "animate-fade-in delay-2000"
                          : "opacity-0"
                      }`}
                    >
                      {t.verses.arRum21Translation}
                    </div>
                  </div>
                  <div className={`w-full md:w-1/2`}>
                    <div
                      className={`text-center text-sm md:text-lg noto-naskh-arabic text-gray-600 text-right ${
                        showVerseSection
                          ? "animate-fade-in delay-2400"
                          : "opacity-0"
                      }`}
                    >
                      وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ
                      أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ
                      وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
                    </div>
                    <div className="flex justify-end mt-4">
                      <div
                        className={`relative h-[1px] bg-gray-600 ${
                          showVerseSection
                            ? "animate-line-reveal-right delay-2800"
                            : "w-0 opacity-0"
                        }`}
                      >
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-center text-sm md:text-base dancing-script text-center my-4 font-bold ${
                        showVerseSection
                          ? "animate-fade-in delay-3400"
                          : "opacity-0"
                      }`}
                    >
                      {t.verses.alFurqan74}
                    </div>
                    <div className="flex mb-4">
                      <div
                        className={`relative h-[1px] bg-gray-600 ${
                          showVerseSection
                            ? "animate-line-reveal-left delay-2800"
                            : "w-0 opacity-0"
                        }`}
                      >
                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-[5px] h-[5px] bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                        showVerseSection
                          ? "animate-fade-in delay-4000"
                          : "opacity-0"
                      }`}
                    >
                      {t.verses.alFurqan74Translation}
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={brideGroomSectionRef}
                className="relative w-full h-screen flex flex-col justify-center items-center py-8 md:py-24 px-4 md:px-12 overflow-hidden bg-white"
              >
                {/* Floating Sky Animation */}
                {showBrideGroomSection && <FloatingSky />}
                <div className="w-full md:w-1/2 flex flex-col gap-12 md:gap-16 relative z-10">
                  <div className={`flex flex-col gap-4 md:gap-6 `}>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 font-light ${
                        showBrideGroomSection ? "animate-fade-in" : "opacity-0"
                      }`}
                    >
                      {t.couple.groomTitle}{" "}
                      <span className=" font-bold">
                        {t.couple.groomParents.split(" & ")[0]}
                      </span>{" "}
                      &{" "}
                      <span className=" font-bold">
                        {t.couple.groomParents.split(" & ")[1]}
                      </span>
                      .
                    </div>
                    <div
                      className={`${
                        showBrideGroomSection
                          ? "animate-fade-in delay-200"
                          : "opacity-0"
                      }`}
                    >
                      <ShinyText
                        text={t.couple.groomName}
                        className="text-4xl md:text-6xl dancing-script font-bold"
                      />
                    </div>
                  </div>
                  <div
                    className={`w-full h-[160px] flex justify-center items-center overflow-visible ${
                      showBrideGroomSection
                        ? "animate-fade-in delay-600"
                        : "opacity-0"
                    }`}
                  >
                    <div ref={loveIconRef} className="will-change-transform">
                      <Image
                        src="/love.png"
                        alt="Love"
                        width={250}
                        height={250}
                        className="w-[250px] h-[250px] object-cover animate-romantic-float"
                      />
                    </div>
                  </div>
                  <div className={`flex flex-col items-end gap-4 md:gap-6`}>
                    <div
                      className={`${
                        showBrideGroomSection
                          ? "animate-fade-in delay-1000"
                          : "opacity-0"
                      }`}
                    >
                      <ShinyText
                        text={t.couple.brideName}
                        className="text-4xl md:text-6xl dancing-script font-bold text-right"
                      />
                    </div>
                    <div
                      className={`text-xs md:text-base ubuntu text-gray-600 ${
                        showBrideGroomSection
                          ? "animate-fade-in delay-1400"
                          : "opacity-0"
                      }`}
                    >
                      {t.couple.brideTitle}{" "}
                      <span className=" font-bold">
                        {t.couple.brideParents.split(" & ")[0]}
                      </span>{" "}
                      &{" "}
                      <span className=" font-bold">
                        {t.couple.brideParents.split(" & ")[1]}
                      </span>
                      .
                    </div>
                  </div>
                  <div
                    className={`text-lg md:text-xl dancing-script text-gray-600 text-center font-bold mt-8 underline ${
                      showBrideGroomSection
                        ? "animate-fade-in delay-1800"
                        : "opacity-0"
                    }`}
                  >
                    {t.couple.tagline}
                  </div>
                </div>
              </div>
              <div
                ref={formSectionRef}
                className="relative w-full flex flex-col overflow-hidden bg-transparent"
              >
                {/* Gift Section */}
                {showEnvelopeSection && (
                  <div className="w-full h-[33vh] bg-transparent overflow-y-auto flex flex-col justify-center items-center py-4 md:py-6 px-4 md:px-8">
                    <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 flex flex-col gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg">
                      <div
                        className={`text-2xl md:text-3xl dancing-script text-center font-bold text-gray-800 ${
                          showFormSection ? "animate-fade-in" : "opacity-0"
                        }`}
                      >
                        {t.gift.title}
                      </div>
                      <div
                        className={`text-xs md:text-sm ubuntu text-center text-gray-600 ${
                          showFormSection
                            ? "animate-fade-in delay-200"
                            : "opacity-0"
                        }`}
                      >
                        {t.gift.subtitle}
                      </div>

                      {/* Bank Accounts - Side by Side */}
                      <div
                        className={`flex flex-row gap-2 md:gap-3 ${
                          showFormSection
                            ? "animate-fade-in delay-400"
                            : "opacity-0"
                        }`}
                      >
                        {/* Bank Account 1 */}
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText("7183108829");
                            alert(t.gift.accountCopied);
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
                            navigator.clipboard.writeText("08999847355");
                            alert(t.gift.accountCopied);
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
                              a.n. Khoirun Nisa A
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* RSVP Form & Message Section - Combined */}
                <div
                  ref={rsvpSectionRef}
                  id="rsvp"
                  className={`relative w-full h-[66vh] bg-white overflow-y-auto flex flex-col justify-center items-center py-4 md:py-6 px-4 md:px-8`}
                >
                  <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4">
                    <div
                      className={`text-2xl md:text-3xl dancing-script text-center font-bold text-gray-800 mb-4 md:mb-8 ${
                        showFormSection
                          ? "animate-fade-in delay-600"
                          : "opacity-0"
                      }`}
                    >
                      {hasSubmittedBefore ? t.rsvp.updateTitle : t.rsvp.title}
                    </div>

                    {/* Full Name Input - Full Width */}
                    <div
                      className={`flex flex-col gap-1 ${
                        showFormSection
                          ? "animate-fade-in delay-1000"
                          : "opacity-0"
                      }`}
                    >
                      <label
                        htmlFor="fullName"
                        className="text-[10px] md:text-sm ubuntu text-gray-600 font-bold"
                      >
                        {t.rsvp.fullNameLabel}{" "}
                        <span className="text-red-500">{t.rsvp.required}</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value.toUpperCase())
                        }
                        className="w-full px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 ubuntu transition-all bg-white"
                        placeholder={t.rsvp.fullNamePlaceholder}
                        required
                      />
                      {/* Autocomplete suggestion */}
                      {guestName !== t.hero.defaultGuestName &&
                        !isSpecialGuest &&
                        !fullName && (
                          <button
                            type="button"
                            onClick={() =>
                              setFullName(
                                guestName.replace(/-/g, " ").toUpperCase()
                              )
                            }
                            className="text-[10px] md:text-xs text-gray-600 ubuntu py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-left transition-colors"
                          >
                            💡 {t.rsvp.useThisName}{" "}
                            <span className="font-bold">
                              {guestName
                                .replace(/-/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </span>
                          </button>
                        )}
                      {(guestName === t.hero.defaultGuestName ||
                        isSpecialGuest) && (
                        <p className="text-[10px] md:text-xs text-amber-600 ubuntu">
                          ⚠️ {t.rsvp.pleaseEnterFullName}
                        </p>
                      )}
                    </div>

                    {/* Can Attend and Number of Persons - Side by Side */}
                    <div
                      className={`flex flex-row gap-2 md:gap-3 ${
                        showFormSection
                          ? "animate-fade-in delay-1200"
                          : "opacity-0"
                      }`}
                    >
                      {/* Can Attend Dropdown */}
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="canAttend"
                          className="text-[10px] md:text-sm ubuntu text-gray-600 font-bold"
                        >
                          {t.rsvp.attendanceLabel}{" "}
                          <span className="text-red-500">
                            {t.rsvp.required}
                          </span>
                        </label>
                        <select
                          id="canAttend"
                          value={canAttend}
                          onChange={(e) =>
                            setCanAttend(e.target.value as "" | "yes" | "no")
                          }
                          className="w-full px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 ubuntu bg-white transition-all appearance-none cursor-pointer"
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
                            {t.rsvp.attendancePlaceholder}
                          </option>
                          <option value="yes">{t.rsvp.attendingYes}</option>
                          <option value="no">{t.rsvp.attendingNo}</option>
                        </select>
                      </div>

                      {/* Number of Persons (always visible, disabled when not attending) */}
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="numberOfPersons"
                          className="text-[10px] md:text-sm ubuntu text-gray-600 font-bold"
                        >
                          {t.rsvp.numberOfGuestsLabel}{" "}
                          <span className="text-red-500">
                            {t.rsvp.required}
                          </span>
                        </label>
                        <input
                          type="number"
                          id="numberOfPersons"
                          value={numberOfPersons}
                          onChange={(e) => setNumberOfPersons(e.target.value)}
                          min="1"
                          max="20"
                          className={`w-full px-3 py-2 text-xs border-2 rounded-lg focus:outline-none ubuntu bg-white transition-all ${
                            canAttend !== "yes"
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20"
                          }`}
                          required={canAttend === "yes"}
                          disabled={canAttend !== "yes"}
                        />
                      </div>
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
                        className="text-[10px] md:text-sm ubuntu text-gray-600 font-bold"
                      >
                        {t.rsvp.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20 ubuntu resize-none"
                        placeholder={t.rsvp.messagePlaceholder}
                      />
                    </div>

                    {/* Buttons - Side by Side */}
                    <div
                      className={`flex gap-2 md:gap-3 justify-center items-center mt-4 md:mt-8 ${
                        showFormSection
                          ? "animate-fade-in delay-1600"
                          : "opacity-0"
                      }`}
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || submitSuccess || !fullName}
                        className={`w-fit px-6 md:px-8 py-2.5 rounded-full text-base md:text-lg dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                          submitSuccess
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : isSubmitting || !fullName
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-900 text-white"
                        }`}
                      >
                        {submitSuccess
                          ? hasSubmittedBefore
                            ? t.rsvp.updatedButton
                            : t.rsvp.submittedButton
                          : isSubmitting
                          ? hasSubmittedBefore
                            ? t.rsvp.updatingButton
                            : t.rsvp.submittingButton
                          : hasSubmittedBefore
                          ? t.rsvp.updateButton
                          : t.rsvp.submitButton}
                      </button>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-fit xl:hidden px-6 md:px-8 py-2.5 rounded-full text-base md:text-lg dancing-script font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-800"
                      >
                        {t.event.eventDetails}
                      </button>
                    </div>

                    {submitSuccess && (
                      <div className="text-center text-sm text-green-600 ubuntu animate-fade-in">
                        {hasSubmittedBefore
                          ? t.rsvp.updateSuccessMessage
                          : t.rsvp.successMessage}
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
