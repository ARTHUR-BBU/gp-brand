"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { basePath } from "@/lib/config";

export default function CategoriesPage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-16 md:px-20">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-[36px] leading-10 tracking-tight text-primary md:text-[60px] md:leading-[60px]">{t("categories.hero.title")}</h1>
        <p className="max-w-2xl font-sans text-base text-text-secondary">{t("categories.hero.desc")}</p>
      </section>

      {/* Categories Grid */}
      <section className="grid auto-rows-[minmax(400px,auto)] grid-cols-1 gap-4 md:grid-cols-12">
        {/* Saltwater */}
        <div className="gradient-shell group md:col-span-8">
          <div className="glass-panel relative h-full min-h-[400px] w-full overflow-hidden">
            <img src={`${basePath}/images/saltwater.jpeg`} alt="Saltwater Pearls" className="h-full w-full object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-[18px] text-white">
              <h2 className="text-2xl">{t("categories.saltwater.title")}</h2>
              <p className="mb-2 font-sans text-base text-white/90">{t("categories.saltwater.desc")}</p>
              <Link href="#" className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider hover:underline underline-offset-4">{t("categories.saltwater.cta")} →</Link>
            </div>
          </div>
        </div>

        {/* Freshwater */}
        <div className="gradient-shell group md:col-span-4">
          <div className="glass-panel relative h-full min-h-[400px] w-full overflow-hidden">
            <img src={`${basePath}/images/freshwater.jpeg`} alt="Freshwater Pearls" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-[18px] text-white">
              <h2 className="text-2xl">{t("categories.freshwater.title")}</h2>
              <p className="mb-2 font-sans text-base text-white/90">{t("categories.freshwater.desc")}</p>
              <Link href="#" className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider hover:underline underline-offset-4">{t("categories.freshwater.cta")} →</Link>
            </div>
          </div>
        </div>

        {/* Baroque */}
        <div className="gradient-shell group md:col-span-12">
          <div className="glass-panel flex h-full w-full flex-col overflow-hidden md:flex-row">
            <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2 md:p-12">
              <span className="font-sans text-sm uppercase tracking-widest text-text-secondary">{t("categories.baroque.tag")}</span>
              <h2 className="text-3xl text-primary">{t("categories.baroque.title")}</h2>
              <p className="font-sans text-base text-text-secondary">{t("categories.baroque.desc")}</p>
              <Link href="#" className="inline-flex w-fit items-center justify-center bg-primary px-6 py-3 font-sans text-sm text-on-primary hover:opacity-90">{t("categories.baroque.cta")}</Link>
            </div>
            <div className="relative min-h-[300px] w-full md:h-full md:w-1/2">
              <img src={`${basePath}/images/baroque.jpeg`} alt="Baroque Pearls" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
