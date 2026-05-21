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
          // 七大要素 — 海水飘动效果（pin + scrub）
          const factorsWrapper = pageRef.current?.querySelector("#factors-pin-wrapper");
          if (factorsWrapper) {
            const titleEl = factorsWrapper.querySelector(".factors-title");
            const cards = factorsWrapper.querySelectorAll(".factor-card");
            const wavePath = factorsWrapper.querySelector("#factors-wave-path");
            const waveSvg = factorsWrapper.querySelector("#factors-wave");

            if (cards.length > 0) {
              const factorsTl = gsap.timeline({
                scrollTrigger: {
                  trigger: factorsWrapper,
                  start: "top 15%",
                  end: `+=${window.innerHeight * 2.5}`,
                  pin: true,
                  scrub: 1.5,
                },
              });

              // 标题先淡入
              if (titleEl) {
                factorsTl.to(titleEl, {
                  opacity: 1, y: 0, duration: 1.2, ease: "power2.out",
                }, 0);
              }

              // 卡片逐一浮现（大位移 + 缩放弹性）
              cards.forEach((card, i) => {
                factorsTl.to(card, {
                  opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.4)",
                }, 0.8 + i * 1);
              });

              // 波浪线条绘制
              if (wavePath && waveSvg) {
                const pathEl = wavePath as unknown as SVGPathElement;
                const pathLen = typeof pathEl.getTotalLength === "function" ? pathEl.getTotalLength() : 1400;
                gsap.set(wavePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
                gsap.set(waveSvg, { opacity: 1 });
                factorsTl.to(wavePath, {
                  strokeDashoffset: 0, duration: 10, ease: "none",
                }, 0);
              }

              // 全部浮现后：波浪式轻柔浮动
              const bobStart = 0.8 + (cards.length - 1) * 1 + 1.2;
              cards.forEach((card, i) => {
                factorsTl.to(card, { y: -5, duration: 0.5, ease: "sine.inOut" }, bobStart + i * 0.3);
                factorsTl.to(card, { y: 0, duration: 0.5, ease: "sine.inOut" }, bobStart + i * 0.3 + 0.5);
              });
            }
          }

          // IGI 卡片淡入
          const igiCards = pageRef.current?.querySelectorAll(".igi-card");
          if (igiCards && igiCards.length > 0) {
            igiCards.forEach((card) => {
              gsap.to(card, {
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: card, start: "top 88%", scrub: 1 },
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
        <div id="factors-pin-wrapper" className="relative pt-4">
          <div className="factors-title mb-12 text-center" style={{ opacity: 0, transform: "translateY(40px)" }}>
            <h2 className="mb-2 text-3xl text-primary md:text-[40px]">{t("craft.factors.title")}</h2>
            <p className="mx-auto mt-4 max-w-lg font-sans text-base text-text-secondary">{t("craft.factors.desc")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {FACTORS.map((f) => (
              <div key={f.key} className="factor-card gradient-shell" style={{ opacity: 0, transform: "translateY(80px) scale(0.85)" }}>
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
          <svg id="factors-wave" className="pointer-events-none mt-8 w-full" viewBox="0 0 1400 40" preserveAspectRatio="none" style={{ opacity: 0 }}>
            <path id="factors-wave-path" d="M0,20 Q100,5 200,20 T400,20 T600,20 T800,20 T1000,20 T1200,20 T1400,20" fill="none" stroke="rgba(15,23,42,0.18)" strokeWidth="2.5" />
            <path d="M0,28 Q120,12 240,28 T480,28 T720,28 T960,28 T1200,28 T1400,28" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="1.5" />
          </svg>
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
          <div className="igi-card gradient-shell" style={{ opacity: 0, transform: "translateY(40px)" }}>
            <div className="glass-panel flex h-full flex-col p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full px-3 py-1 font-sans text-xs font-semibold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #C9A96E, #A08040)' }}>{t("craft.igi.loreine.tag")}</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-primary md:text-3xl">{t("craft.igi.loreine.name")}</h3>
                </div>
                <div className="igi-icon igi-icon-gold flex h-16 w-16 items-center justify-center rounded-full transition-transform hover:scale-110">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" className="drop-shadow-sm">
                    <path d="M3 18l2-10 4 5.5L12 4l3 9.5 4-5.5 2 10H3z" />
                    <rect x="3" y="18" width="18" height="3" rx="1" />
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
          <div className="igi-card gradient-shell" style={{ opacity: 0, transform: "translateY(40px)" }}>
            <div className="glass-panel flex h-full flex-col p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full px-3 py-1 font-sans text-xs font-semibold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #94A3B8, #64748B)' }}>{t("craft.igi.vermeer.tag")}</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-primary md:text-3xl">{t("craft.igi.vermeer.name")}</h3>
                </div>
                <div className="igi-icon igi-icon-silver flex h-16 w-16 items-center justify-center rounded-full transition-transform hover:scale-110">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" className="drop-shadow-sm">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    <path d="M10 13l2-2 4 4" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
