"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/context";

export function Navbar() {
  const { t, locale, toggle } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/collections", label: t("nav.collections") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/craftsmanship", label: t("nav.craftsmanship") },
    { href: "/services", label: t("nav.services") },
    { href: "/bespoke", label: t("nav.bespoke") },
  ];

  return (
    <header className="bg-surface-glass sticky top-0 z-50 w-full border-b border-outline-variant backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4">
        <Link href="/" className="shrink-0">
          <img
            src={locale === "zh" ? "/images/logo-bilingual.png" : "/images/logo-en.png"}
            alt="GABLILY PREMIER"
            className={locale === "zh" ? "h-14 md:h-16 w-auto object-contain" : "h-8 md:h-10 w-auto object-contain"}
          />
        </Link>

        <nav className="hidden items-center gap-10 lg:gap-14 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link font-serif-cn text-sm tracking-wider text-on-surface-variant rounded-lg px-4 py-2 transition-all duration-300 hover:text-primary hover:bg-gradient-to-r hover:from-surface-container hover:to-surface-container-high hover:-translate-y-0.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="font-sans text-sm text-primary border border-border-subtle px-3 py-1 rounded-full transition-colors hover:bg-surface-container-low"
          >
            {t("lang.toggle")}
          </button>
          <span className="hidden cursor-pointer font-sans text-sm text-primary md:inline-block">
            {t("nav.stores")}
          </span>
          <button className="text-primary" aria-label="Shopping Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
          <button className="text-primary" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button
            className="flex flex-col gap-1 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="block h-0.5 w-5 bg-primary" />
            <span className="block h-0.5 w-5 bg-primary" />
            <span className="block h-0.5 w-5 bg-primary" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-4 border-t border-outline-variant px-5 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-on-surface-variant hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
