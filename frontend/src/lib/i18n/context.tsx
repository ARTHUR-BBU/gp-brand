"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { zh, en } from "./dictionaries";

export type Locale = "zh" | "en";

const dicts = { zh, en };

interface LocaleContextValue {
  locale: Locale;
  toggle: () => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gp_locale") as Locale | null;
    if (saved && (saved === "zh" || saved === "en")) {
      setLocale(saved);
    }
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      localStorage.setItem("gp_locale", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      return dicts[locale][key] || key;
    },
    [locale]
  );

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "zh", toggle, t: (key) => dicts.zh[key] || key }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, toggle, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be inside LocaleProvider");
  return ctx;
}
