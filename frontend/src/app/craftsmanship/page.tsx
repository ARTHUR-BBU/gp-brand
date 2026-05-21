"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/i18n/context";
import { basePath } from "@/lib/config";

const FACTORS = [
  { key: "size", img: "factor-size.png" },
  { key: "shape", img: "factor-shape.png" },
  { key: "color", img: "factor-color.png" },
  { key: "luster", img: "factor-luster.png" },
  { key: "surface", img: "factor-surface.png" },
  { key: "nacre", img: "factor-nacre.png" },
  { key: "matching", img: "factor-matching.png" },
] as const;

const IGI_CRITERIA = ["matching", "luster", "surface", "shape", "nacre"] as const;

export default function CraftsmanshipPage() {
  const { t } = useLocale();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;
    let ST: typeof import("gsap/ScrollTrigger")["ScrollTrigger"] | undefined;

    window.scrollTo(0, 0);

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ST = ScrollTrigger;
        ScrollTrigger.getAll().forEach(st => st.kill());

        ctx = gsap.context(() => {
          // 七大要素逐一淡入
          const factorCards = pageRef.current?.querySelectorAll(".factor-card");
          if (factorCards && factorCards.length > 0) {
            factorCards.forEach((card) => {
              gsap.from(card, {
                opacity: 0, y: 30, duration: 0.6, ease: "power2.out",
                scrollTrigger: { trigger: card, start: "top 88%", scrub: 1 },
              });
            });
          }

          // IGI 卡片淡入
          const igiCards = pageRef.current?.querySelectorAll(".igi-card");
          if (igiCards && igiCards.length > 0) {
            igiCards.forEach((card) => {
              gsap.from(card, {
                opacity: 0, y: 40, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: card, start: "top 85%", scrub: 1 },
              });
            });
          }

          // 溯源卡片
          const traceCard = pageRef.current?.querySelector(".trace-card");
          if (traceCard) {
            gsap.to(traceCard, {
              opacity: 1, y: 0, duration: 0.8,
              scrollTrigger: { trigger: traceCard, start: "top 90%", scrub: 1 },
            });
          }

          ScrollTrigger.refresh();
        });
      });
    });

    return () => {
      ctx?.revert();
      if (ST) ST.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={pageRef} className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-16 md:px-20">
      {/* Hero — 保持不变 */}
      <section className="grid grid-cols-1 items-center gap-6 min-h-[400px] md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-surface-glass px-4 py-1 backdrop-blur-md">
            <span className="font-sans text-xs uppercase tracking-widest text-text-secondary">{t("craft.tag")}</span>
          </div>
          <h1 className="text-[36px] leading-10 tracking-tight text-primary md:text-[60px] md:leading-[60px]">
            {t("craft.hero.title").split("\n").map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
          </h1>
          <p className="mt-4 max-w-md font-sans text-base text-text-secondary">{t("craft.hero.desc")}</p>
        </div>
        <div className="gradient-shell md:col-span-7 aspect-[4/3] md:aspect-video overflow-hidden relative">
          <img src={`${basePath}/images/craft-hero.jpeg`} alt="Pearl-Layer Essence" className="h-full w-full object-cover" />
          <div className="glass-panel absolute right-8 top-1/4 z-20 flex items-center gap-3 rounded-lg px-4 py-2 hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <div>
              <div className="font-sans text-sm font-bold text-primary">120+</div>
              <div className="text-xs text-text-secondary">{t("craft.points")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 七大珍珠价值要素 */}
      <section className="border-t border-border-subtle pt-16">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl text-primary md:text-[40px]">{t("craft.factors.title")}</h2>
          <p className="font-sans text-sm uppercase tracking-widest text-text-secondary">{t("craft.factors.subtitle")}</p>
          <p className="mx-auto mt-4 max-w-lg font-sans text-base text-text-secondary">{t("craft.factors.desc")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {FACTORS.map((f) => (
            <div key={f.key} className="factor-card gradient-shell">
              <div className="glass-panel flex h-full flex-col items-center gap-3 p-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden">
                  <img src={`${basePath}/images/${f.img}`} alt={f.key} className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="text-lg font-semibold tracking-tight text-primary">{t(`craft.factor.${f.key}`)}</div>
                </div>
                <p className="font-sans text-xs leading-relaxed text-text-secondary">{t(`craft.factor.${f.key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IGI × 珈珮 珍珠分级体系 */}
      <section className="border-t border-border-subtle pt-16">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl text-primary md:text-[40px]">{t("craft.igi.title")}</h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-base text-text-secondary">{t("craft.igi.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 洛神 LOREINE */}
          <div className="igi-card gradient-shell">
            <div className="glass-panel flex h-full flex-col p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full bg-primary px-3 py-1 font-sans text-xs text-on-primary">{t("craft.igi.loreine.tag")}</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-primary md:text-3xl">{t("craft.igi.loreine.name")}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-surface">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {IGI_CRITERIA.map((c) => (
                  <div key={c} className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0">
                    <span className="font-sans text-sm text-text-secondary">{t(`craft.igi.${c}`)}</span>
                    <span className="font-sans text-sm font-semibold text-primary">{t(`craft.igi.loreine.${c}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 维米尔 VERMEER */}
          <div className="igi-card gradient-shell">
            <div className="glass-panel flex h-full flex-col p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full border border-primary/30 px-3 py-1 font-sans text-xs text-primary">{t("craft.igi.vermeer.tag")}</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-primary md:text-3xl">{t("craft.igi.vermeer.name")}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-outline-variant bg-surface">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-tertiary">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {IGI_CRITERIA.map((c) => (
                  <div key={c} className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0">
                    <span className="font-sans text-sm text-text-secondary">{t(`craft.igi.${c}`)}</span>
                    <span className="font-sans text-sm font-semibold text-primary">{t(`craft.igi.vermeer.${c}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 一物一码溯源 — 保留 */}
      <section className="trace-card gradient-shell" style={{ opacity: 0, transform: "translateY(60px)" }}>
        <div className="glass-panel flex flex-col items-center gap-6 p-[18px] md:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </div>
          <div className="flex-grow">
            <h3 className="mb-2 text-xl font-semibold text-primary">{t("craft.trace.title")}</h3>
            <p className="font-sans text-base text-[#4B5563]">{t("craft.trace.desc")}</p>
          </div>
          <div className="shrink-0">
            <Link href="#" className="flex items-center gap-2 bg-primary px-6 py-3 font-sans text-sm text-on-primary hover:opacity-90">{t("craft.trace.cta")} →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
