"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-outline-variant bg-surface w-full">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-16 py-16 md:grid-cols-4">
        <div className="flex flex-col justify-between">
          <img
            src="/images/logo-bilingual.png"
            alt="GABLILY PREMIER GP 珈珮"
            className="h-12 w-auto object-contain"
          />
          <p className="mt-4 font-sans text-sm text-text-secondary text-center whitespace-pre-line">
            {t("footer.copyright")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface">
            {t("footer.company")}
          </span>
          <Link href="/collections" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("nav.collections")}</Link>
          <Link href="/categories" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("nav.categories")}</Link>
          <Link href="/craftsmanship" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("nav.craftsmanship")}</Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface">
            {t("footer.legal")}
          </span>
          <Link href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("footer.privacy")}</Link>
          <Link href="#" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("footer.terms")}</Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface">
            {t("footer.connect")}
          </span>
          <Link href="/bespoke" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("nav.bespoke")}</Link>
          <Link href="/services" className="font-sans text-sm text-on-surface-variant hover:text-primary">{t("nav.services")}</Link>
        </div>
      </div>
    </footer>
  );
}
