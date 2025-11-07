"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import translations from "./translations.json";

type Language = "bahasa" | "english";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.bahasa;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bahasa");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from URL parameter only
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");

    if (urlLang === "english" || urlLang === "bahasa") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(urlLang);
    } else {
      // No valid lang parameter, default to bahasa
      setLanguageState("bahasa");

      // Update URL parameter to reflect default language
      const url = new URL(window.location.href);
      url.searchParams.set("lang", "bahasa");
      window.history.replaceState({}, "", url.toString());
    }

    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    // Update URL parameter without reloading
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  };

  const t = translations[language];

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
