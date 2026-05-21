"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { basePath } from "@/lib/config";

export default function CollectionsPage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-16 md:px-20">
      {/* Hero */}
      <section className="gradient-shell relative flex h-[400px] items-center justify-center overflow-hidden md:h-[614px]">
        <div className="absolute inset-0 overflow-hidden">
          <img src={`${basePath}/images/collections-hero.jpeg`} alt="GP Collections" className="h-full w-full object-cover opacity-60" />
        </div>
        <div className="glass-panel relative z-10 mx-auto flex max-w-2xl flex-col gap-6 rounded-xl p-8 text-center">
          <h1 className="text-[36px] leading-10 tracking-tight text-primary md:text-[60px] md:leading-[60px]">{t("collections.hero.title")}</h1>
          <p className="font-sans text-base text-on-surface-variant">{t("collections.hero.desc")}</p>
        </div>
      </section>

      {/* Collections */}
      <section className="flex flex-col gap-6">
        {/* Iris Enchante — full width */}
        <div className="gradient-shell group">
          <div className="glass-panel flex h-full w-full flex-col overflow-hidden md:flex-row">
            <div className="relative h-64 w-full md:h-[500px] md:w-1/2">
              <img src={`${basePath}/images/iris-hero.jpeg`} alt="Iris Enchante Collection" className="h-full w-full object-cover" />
            </div>
            <div className="flex w-full flex-col justify-center gap-4 bg-white/50 p-8 backdrop-blur-md md:w-1/2 md:p-12">
              <span className="font-sans text-sm uppercase tracking-widest text-text-secondary">{t("collections.iris.tag")}</span>
              <h2 className="text-[36px] leading-10 tracking-tight text-primary md:text-[60px] md:leading-[60px]">
                {t("collections.iris.title").split("\n").map((l, i) => <span key={i}>{l}{i < t("collections.iris.title").split("\n").length - 1 && <br />}</span>)}
              </h2>
              <span className="font-sans text-sm text-text-secondary">{t("collections.iris.subtitle")}</span>
              <p className="font-sans text-base leading-relaxed text-on-surface-variant">{t("collections.iris.desc")}</p>
              <Link href="#" className="mt-4 inline-flex w-fit items-center gap-2 font-sans text-sm uppercase tracking-wider text-primary hover:underline underline-offset-4">{t("collections.iris.cta")} →</Link>
            </div>
          </div>
        </div>

        {/* Pride Collection — full width, image on right */}
        <div className="gradient-shell group">
          <div className="glass-panel relative flex h-[400px] w-full flex-col overflow-hidden md:flex-row-reverse">
            <div className="relative h-64 w-full md:h-full md:w-3/5">
              <img src={`${basePath}/images/pride-hero.jpeg`} alt="Pride Collection" className="h-full w-full object-cover" />
            </div>
            <div className="flex w-full flex-col justify-center gap-4 bg-white/50 p-8 backdrop-blur-md md:w-2/5 md:p-12">
              <span className="font-sans text-sm uppercase tracking-widest text-text-secondary">{t("collections.shine.subtitle")}</span>
              <h2 className="text-[36px] leading-10 tracking-tight text-primary md:text-[52px] md:leading-[52px]">
                {t("collections.shine.title").split("\n").map((l, i) => <span key={i}>{l}{i < t("collections.shine.title").split("\n").length - 1 && <br />}</span>)}
              </h2>
              <p className="font-sans text-base leading-relaxed text-on-surface-variant">{t("collections.shine.desc")}</p>
              <Link href="#" className="mt-4 inline-flex w-fit items-center gap-2 font-sans text-sm uppercase tracking-wider text-primary hover:underline underline-offset-4">{t("collections.shine.cta")} →</Link>
            </div>
          </div>
        </div>

        {/* Lunar Chords — full width, image on left */}
        <div className="gradient-shell group">
          <div className="glass-panel relative flex h-[400px] w-full flex-col overflow-hidden md:flex-row">
            <div className="relative h-64 w-full md:h-full md:w-3/5">
              <img src={`${basePath}/images/lunar-hero.jpeg`} alt="Lunar Chords" className="h-full w-full object-cover object-top" />
            </div>
            <div className="flex w-full flex-col justify-center gap-4 bg-white/50 p-8 backdrop-blur-md md:w-2/5 md:p-12">
              <span className="font-sans text-sm uppercase tracking-widest text-text-secondary">{t("collections.lunar.tag")}</span>
              <h2 className="text-[36px] leading-10 tracking-tight text-primary md:text-[52px] md:leading-[52px]">
                {t("collections.lunar.title").split("\n").map((l, i) => <span key={i}>{l}{i < t("collections.lunar.title").split("\n").length - 1 && <br />}</span>)}
              </h2>
              <span className="font-sans text-sm text-text-secondary">{t("collections.lunar.subtitle")}</span>
              <p className="font-sans text-base leading-relaxed text-on-surface-variant">{t("collections.lunar.desc")}</p>
              <Link href="#" className="mt-4 inline-flex w-fit items-center gap-2 font-sans text-sm uppercase tracking-wider text-primary hover:underline underline-offset-4">{t("collections.lunar.cta")} →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
