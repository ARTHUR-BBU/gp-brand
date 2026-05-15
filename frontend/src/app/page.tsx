"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocale } from "@/lib/i18n/context";
import { basePath } from "@/lib/config";

export default function HomePage() {
  const { t } = useLocale();

  // 珍珠光泽跟随鼠标
  const [pearlGlow, setPearlGlow] = useState<{ id: string; x: number; y: number } | null>(null);
  const handlePearlMove = useCallback((id: string, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPearlGlow({ id, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const storyTimelineRef = useRef<HTMLDivElement>(null);
  const bentoSectionRef = useRef<HTMLDivElement>(null);
  const bentoTimelineRef = useRef<HTMLDivElement>(null);
  const achSectionRef = useRef<HTMLDivElement>(null);
  const achTimelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.clearMatchMedia();

        ctx = gsap.context(() => {
          /* ===========================
             SECTION 1 — HERO
             scrub-based parallax, no pin
             =========================== */
          // Hero text entrance (autoplay on page load)
          const heroTl = gsap.timeline({ delay: 0.4 });
          heroTl
            .from(heroTitleRef.current, { opacity: 0, y: 80, duration: 1.6, ease: "power4.out" })
            .from(heroTextRef.current, { opacity: 0, y: 50, duration: 1.2, ease: "power3.out" }, "-=0.8");

          // Hero bg parallax — tied to scroll, bidirectional
          gsap.to(heroImgRef.current, {
            yPercent: 25,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });

          /* ===========================
             SECTION 2 — BRAND STORY (PINNED)
             Pin the section, scroll controls timeline
             =========================== */
          const storyEls = storyTimelineRef.current?.querySelectorAll(".story-step");
          const storyImg = storyTimelineRef.current?.querySelector(".story-img-wrap");

          if (storyEls && storyEls.length && storySectionRef.current && storyTimelineRef.current) {
            // Set initial hidden state
            gsap.set(storyEls, { opacity: 0, x: -80 });
            if (storyImg) gsap.set(storyImg, { opacity: 0, scale: 0.92, x: 60 });

            const storyTl = gsap.timeline({
              scrollTrigger: {
                trigger: storySectionRef.current,
                start: "top top",
                end: `+=${window.innerHeight * 2.5}`,
                pin: storyTimelineRef.current,
                scrub: 1.2,
                anticipatePin: 1,
              },
            });

            // Title + image reveal simultaneously, then remaining text
            storyTl.to(storyEls[0], { opacity: 1, x: 0, duration: 1, ease: "power2.out" });
            if (storyImg) {
              storyTl.to(storyImg, { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: "power2.out" }, "-=0.6");
            }
            // Remaining elements appear one by one
            for (let i = 1; i < storyEls.length; i++) {
              storyTl.to(storyEls[i], { opacity: 1, x: 0, duration: 1, ease: "power2.out" });
            }
          }

          /* ===========================
             SECTION 3 — BENTO GRID (PINNED)
             Pin the section, cards reveal one by one
             =========================== */
          const bentoCards = bentoTimelineRef.current?.querySelectorAll(".bento-card");
          const bentoTitle = bentoTimelineRef.current?.querySelector(".bento-title");

          if (bentoCards && bentoCards.length && bentoSectionRef.current && bentoTimelineRef.current) {
            gsap.set(bentoTitle || [], { opacity: 0, y: 40 });
            gsap.set(bentoCards, { opacity: 0, y: 100, scale: 0.9 });

            const bentoTl = gsap.timeline({
              scrollTrigger: {
                trigger: bentoSectionRef.current,
                start: "top top",
                end: `+=${window.innerHeight * 2}`,
                pin: bentoTimelineRef.current,
                scrub: 1.2,
                anticipatePin: 1,
              },
            });

            if (bentoTitle) {
              bentoTl.to(bentoTitle, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            }
            bentoCards.forEach((card) => {
              bentoTl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" });
            });
          }

          /* ===========================
             SECTION 4 — ACHIEVEMENT (PINNED)
             Ribbon draws, stats + pearls appear one by one
             =========================== */
          const achEls = achTimelineRef.current?.querySelectorAll(".ach-step");
          const achTitle = achTimelineRef.current?.querySelector(".ach-title");
          const achSub = achTimelineRef.current?.querySelector(".ach-sub");
          const achTag = achTimelineRef.current?.querySelector(".ach-tag");
          const ribbonPath = achTimelineRef.current?.querySelector(".ribbon-path") as SVGPathElement | null;
          const ribbonGlowEl = achTimelineRef.current?.querySelector(".ribbon-glow") as SVGPathElement | null;
          const pearlDots = achTimelineRef.current?.querySelectorAll(".pearl-dot");

          if (achEls && achEls.length === 4 && achSectionRef.current && achTimelineRef.current) {
            // Initial hidden states
            gsap.set([achTag, achTitle, achSub].filter(Boolean), { opacity: 0, y: 40 });
            gsap.set(achEls, { opacity: 0, y: 30, scale: 0.9 });
            gsap.set(pearlDots || [], { opacity: 0, scale: 0 });

            // Prepare ribbon stroke animation
            const ribbonPaths = [ribbonPath, ribbonGlowEl].filter(Boolean) as SVGPathElement[];
            ribbonPaths.forEach((p) => {
              const len = p.getTotalLength();
              gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            });

            const achTl = gsap.timeline({
              scrollTrigger: {
                trigger: achSectionRef.current,
                start: "top top",
                end: `+=${window.innerHeight * 3}`,
                pin: achTimelineRef.current,
                scrub: 1.5,
                anticipatePin: 1,
              },
            });

            // 0.0 - 1.2: Header elements appear
            if (achTag) achTl.to(achTag, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);
            if (achTitle) achTl.to(achTitle, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3);
            if (achSub) achTl.to(achSub, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.7);

            // 1.2 - 3.2: Ribbon draws left to right (2.0 duration)
            achTl.to(ribbonPaths, { strokeDashoffset: 0, duration: 2.0, ease: "none" }, 1.2);

            // Stats + pearl dots appear as ribbon reaches them
            const statStarts = [1.4, 1.9, 2.4, 2.9];
            achEls.forEach((el, i) => {
              const t = statStarts[i];
              if (pearlDots && pearlDots[i]) {
                achTl.to(pearlDots[i], { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, t);
              }
              achTl.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, t + 0.1);
            });
          }
        });
      });
    });
    return () => {
      ctx?.revert();
    };
  }, []);

  const heroLines = t("home.hero.title").split("\n");

  const stats = [
    { valueKey: "home.achievement.stat1.value", labelKey: "home.achievement.stat1.label" },
    { valueKey: "home.achievement.stat2.value", labelKey: "home.achievement.stat2.label" },
    { valueKey: "home.achievement.stat3.value", labelKey: "home.achievement.stat3.label" },
    { valueKey: "home.achievement.stat4.value", labelKey: "home.achievement.stat4.label" },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden"
      >
        <div ref={heroImgRef} className="absolute inset-0 z-0 h-[130%] -top-[15%]">
          <img
            src={`${basePath}/images/hero-01.jpeg`}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        </div>

        <div className="relative z-10 flex w-full justify-center px-6 py-20">
          <div className="flex flex-col items-center text-center md:ml-[-12%]">
          <h1 ref={heroTitleRef} className="mb-8">
            {heroLines.map((line, i) => (
              <div key={i} className="block overflow-hidden">
                <span className="block text-[40px] leading-[1.1] tracking-[0.06em] text-white font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-[96px] md:leading-[1.05]">
                  {line}
                </span>
              </div>
            ))}
          </h1>
          <div ref={heroTextRef} className="flex flex-col items-center gap-6">
            <p className="max-w-xl font-sans text-base leading-relaxed text-white/80 md:text-lg whitespace-pre-line">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex gap-4">
              <Link href="/collections" className="border border-white/30 bg-white/10 px-8 py-3 font-sans text-sm tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/20">
                {t("home.story.cta")}
              </Link>
              <Link href="/craftsmanship" className="border border-white/20 px-8 py-3 font-sans text-sm tracking-wider text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white">
                {t("craft.tag")}
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY (PINNED TIMELINE) ===== */}
      <section ref={storySectionRef} className="relative">
        <div
          ref={storyTimelineRef}
          className="mx-auto flex min-h-screen max-w-[1440px] items-center px-6 py-24 md:px-20"
        >
          <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-8">
              <h2 className="story-step text-[32px] leading-[1.15] tracking-tight text-primary md:text-[52px] md:leading-[1.1]">
                {t("home.story.title").split("\n").map((l, i) => (
                  <span key={i}>
                    {l}
                    {i < t("home.story.title").split("\n").length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="story-step font-sans text-base leading-[1.8] text-text-secondary">
                {t("home.story.p1")}
              </p>
              <p className="story-step font-sans text-base leading-[1.8] text-text-secondary">
                {t("home.story.p2")}
              </p>
              <Link
                href="/collections"
                className="story-step mt-2 inline-block w-fit bg-primary px-6 py-3 font-sans text-sm tracking-wider text-on-primary transition-opacity hover:opacity-90"
              >
                {t("home.story.cta")} →
              </Link>
            </div>
            <div className="story-img-wrap gradient-shell h-[500px] overflow-hidden md:h-[650px]">
              <div className="glass-panel h-full w-full overflow-hidden">
                <img
                  src={`${basePath}/images/story-01.jpeg`}
                  alt="GP 珈珮品牌故事"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENTO GRID (PINNED TIMELINE) ===== */}
      <section ref={bentoSectionRef} className="relative bg-surface-container-low">
        <div
          ref={bentoTimelineRef}
          className="mx-auto flex min-h-screen max-w-[1440px] flex-col items-center justify-center px-6 py-24 md:px-20"
        >
          <h2 className="bento-title mb-16 text-center text-[32px] leading-tight tracking-tight text-primary md:text-[52px]">
            {t("home.bento.title")}
          </h2>
          <div className="grid w-full auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/craftsmanship" className="bento-card group gradient-shell md:col-span-2">
              <div className="glass-panel relative h-full w-full overflow-hidden">
                <img src={`${basePath}/images/craft-02.jpeg`} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-[28px] leading-tight text-white md:text-[42px]">{t("home.bento.craft.title")}</h3>
                  <p className="mt-2 font-sans text-sm text-white/80">{t("home.bento.craft.desc")}</p>
                </div>
              </div>
            </Link>

            <Link href="/services" className="bento-card group gradient-shell">
              <div
                className="glass-panel relative flex h-full w-full flex-col items-center justify-center gap-4 p-[18px] overflow-hidden transition-colors group-hover:bg-surface-bright"
                onMouseMove={(e) => handlePearlMove("logo", e)}
                onMouseLeave={() => setPearlGlow(null)}
              >
                {pearlGlow?.id === "logo" && (
                  <div
                    className="pointer-events-none absolute z-10 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      left: pearlGlow.x,
                      top: pearlGlow.y,
                      background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(230,235,245,0.4) 30%, rgba(200,210,230,0.15) 55%, transparent 70%)",
                      boxShadow: "0 0 40px 10px rgba(255,255,255,0.2)",
                    }}
                  />
                )}
                <img src={`${basePath}/images/logo-bilingual.png`} alt="GP 珈珮" className="relative z-20 h-20 w-auto object-contain opacity-80 transition-transform duration-300 hover:-translate-y-0.5" />
                <p className="relative z-20 text-center font-sans text-sm text-text-secondary transition-transform duration-300 hover:-translate-y-0.5">{t("home.bento.logo.desc")}</p>
              </div>
            </Link>

            <Link href="/categories" className="bento-card group gradient-shell">
              <div className="glass-panel relative h-full w-full overflow-hidden">
                <img src={`${basePath}/images/gp-manual-08.png`} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-xl text-white">{t("home.bento.pearl.title")}</h3>
                </div>
              </div>
            </Link>

            <Link href="/bespoke" className="bento-card group gradient-shell md:col-span-2">
              <div
                className="glass-panel relative flex h-full w-full items-center justify-between p-6 overflow-hidden md:p-16"
                onMouseMove={(e) => handlePearlMove("bespoke", e)}
                onMouseLeave={() => setPearlGlow(null)}
              >
                {pearlGlow?.id === "bespoke" && (
                  <div
                    className="pointer-events-none absolute z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      left: pearlGlow.x,
                      top: pearlGlow.y,
                      background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(230,235,245,0.4) 30%, rgba(200,210,230,0.15) 55%, transparent 70%)",
                      boxShadow: "0 0 40px 10px rgba(255,255,255,0.2)",
                    }}
                  />
                )}
                <div className="relative z-20 max-w-md">
                  <h3 className="mb-4 text-[28px] leading-tight text-primary transition-transform duration-300 hover:-translate-y-0.5 md:text-[42px]">{t("home.bento.bespoke.title")}</h3>
                  <p className="mb-6 font-sans text-base text-text-secondary transition-transform duration-300 hover:-translate-y-0.5">{t("home.bento.bespoke.desc")}</p>
                  <span className="inline-flex items-center gap-2 font-sans text-sm text-primary transition-all duration-300 hover:-translate-y-0.5 hover:opacity-70">
                    {t("home.bento.bespoke.cta")} →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENT (PINNED TIMELINE) ===== */}
      <section ref={achSectionRef} className="relative bg-primary">
        <div
          ref={achTimelineRef}
          className="mx-auto flex min-h-screen max-w-[1440px] flex-col items-center justify-center px-6 py-24 text-center md:px-20"
        >
          <span className="ach-tag mb-6 inline-block rounded-full border border-white/20 px-5 py-1.5 font-sans text-xs uppercase tracking-[0.2em] text-white/50">
            {t("home.achievement.tag")}
          </span>
          <h2 className="ach-title mb-4 text-[32px] leading-tight text-white md:text-[52px]">
            {t("home.achievement.title")}
          </h2>
          <p className="ach-sub mb-12 font-sans text-base text-white/60 md:mb-16">
            {t("home.achievement.subtitle")}
          </p>

          {/* Stats + Ribbon */}
          <div className="relative w-full" style={{ height: "clamp(220px, 32vw, 350px)" }}>
            {/* SVG Ribbon */}
            <svg
              className="ach-ribbon pointer-events-none absolute inset-0 w-full h-full"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="20%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="80%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
                <filter id="ribbonGlow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="pearlGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Broad glow layer */}
              <path
                className="ribbon-glow"
                d="M 60 220 C 160 220, 260 40, 380 40 S 560 240, 640 200 S 820 40, 940 40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="24"
                fill="none"
                strokeLinecap="round"
              />
              {/* Main ribbon */}
              <path
                className="ribbon-path"
                d="M 60 220 C 160 220, 260 40, 380 40 S 560 240, 640 200 S 820 40, 940 40"
                stroke="url(#ribbonGrad)"
                strokeWidth="2.5"
                fill="none"
                filter="url(#ribbonGlow)"
                strokeLinecap="round"
              />
              {/* Pearl dots */}
              <circle className="pearl-dot" cx="60" cy="220" r="7" fill="rgba(255,255,255,0.9)" filter="url(#pearlGlow)" />
              <circle className="pearl-dot" cx="380" cy="40" r="7" fill="rgba(255,255,255,0.9)" filter="url(#pearlGlow)" />
              <circle className="pearl-dot" cx="640" cy="200" r="7" fill="rgba(255,255,255,0.9)" filter="url(#pearlGlow)" />
              <circle className="pearl-dot" cx="940" cy="40" r="7" fill="rgba(255,255,255,0.9)" filter="url(#pearlGlow)" />
            </svg>

            {/* Stat elements — positioned to follow the curve */}
            {stats.map((stat, i) => {
              const positions = [
                "left-[2%] top-[55%]",
                "left-[30%] top-[0%]",
                "left-[56%] top-[50%]",
                "left-[82%] top-[0%]",
              ];
              return (
                <div
                  key={stat.valueKey}
                  className={`ach-step absolute flex flex-col items-center gap-2 ${positions[i]}`}
                >
                  <span className="font-serif-cn text-3xl font-light tracking-wide text-white md:text-6xl">
                    {t(stat.valueKey)}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-white/45 md:text-xs">
                    {t(stat.labelKey)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
