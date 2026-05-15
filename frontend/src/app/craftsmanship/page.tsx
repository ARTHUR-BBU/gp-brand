"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/i18n/context";

export default function CraftsmanshipPage() {
  const { t } = useLocale();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;
    let ST: typeof import("gsap/ScrollTrigger")["ScrollTrigger"] | undefined;

    // 滚动到顶部，避免残留滚动位置导致动画错乱
    window.scrollTo(0, 0);

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ST = ScrollTrigger;

        // 清除残留的 ScrollTrigger 实例
        ScrollTrigger.getAll().forEach(st => st.kill());

        ctx = gsap.context(() => {
          const pinArea = pageRef.current?.querySelector(".pin-area");
          const precisionCard = pageRef.current?.querySelector(".precision-card");
          const gradingCard = pageRef.current?.querySelector(".grading-section");
          const traceCard = pageRef.current?.querySelector(".trace-card");
          if (!pinArea || !precisionCard || !gradingCard) return;

          // 星级进度条 — 准备 tweens（HTML 已设 width:0%）
          const items = gradingCard.querySelectorAll(".grading-item");
          const starTweens: ReturnType<typeof gsap.to>[] = [];
          items.forEach((item) => {
            const stars = parseFloat((item as HTMLElement).dataset.stars || "0");
            const fills = item.querySelectorAll(".star-fill");
            fills.forEach((fill, i) => {
              const pct = i < Math.floor(stars) ? 100 : (i < stars ? (stars % 1) * 100 : 0);
              starTweens.push(
                gsap.to(fill, {
                  width: `${pct}%`, duration: 0.6, ease: "power1.out",
                })
              );
            });
          });

          // 单一 timeline — 一个 ScrollTrigger 控制
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinArea,
              start: "top 20%",
              end: `+=${window.innerHeight * 2}`,
              pin: pinArea,
              pinSpacing: true,
              scrub: 1.2,
            },
          });

          // 序列：左侧先出 → 右侧评级出 → 星级条逐一填充
          tl.to(precisionCard, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" })
            .to(gradingCard, { opacity: 1, y: 0, duration: 0.3 }, 0.5);

          starTweens.forEach((tween, i) => {
            tl.add(tween, 0.8 + i * 0.08);
          });

          // 溯源卡片 — pin 结束后出现（用 gsap.to 配合 CSS 初始隐藏）
          if (traceCard) {
            gsap.to(traceCard, {
              opacity: 1, y: 0, duration: 0.8,
              scrollTrigger: { trigger: traceCard, start: "top 90%", scrub: 1 },
            });
          }

          // 刷新计算位置
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
      {/* Hero */}
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
          <img src="/images/craft-hero.jpeg" alt="Pearl-Layer Essence" className="h-full w-full object-cover" />
          <div className="glass-panel absolute right-8 top-1/4 z-20 flex items-center gap-3 rounded-lg px-4 py-2 hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <div>
              <div className="font-sans text-sm font-bold text-primary">120+</div>
              <div className="text-xs text-text-secondary">{t("craft.points")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details — Pin 区域包含标题+两个卡片 */}
      <section className="tech-section border-t border-border-subtle pt-16">
        <div className="pin-area">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl text-primary">{t("craft.section.title")}</h2>
            <p className="font-sans text-base text-text-secondary">{t("craft.section.desc")}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Precision — CSS 初始隐藏，避免 FOUC */}
            <div className="precision-card gradient-shell md:col-span-2" style={{ opacity: 0, transform: "translateX(-60px)" }}>
              <div className="glass-panel flex h-full flex-col gap-6 p-[18px] md:flex-row md:items-stretch">
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-primary opacity-80"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
                  <h3 className="mb-2 text-xl font-semibold text-primary">{t("craft.precision.title")}</h3>
                  <p className="font-sans text-base text-text-secondary">{t("craft.precision.desc")}</p>
                </div>
                <div className="relative w-full md:w-1/2 shrink-0">
                  <img src="/images/craft-precision.jpeg" alt="Precision Selection" className="w-full h-auto rounded-lg" />
                </div>
              </div>
            </div>

            {/* Grading — CSS 初始隐藏 */}
            <div className="grading-section gradient-shell" style={{ opacity: 0, transform: "translateY(40px)" }}>
              <div className="glass-panel flex h-full flex-col justify-between p-[18px]">
                <div>
                  <h3 className="mb-6 text-xl font-semibold text-primary">{t("craft.grading.title")}</h3>
                  <div className="space-y-5">
                    {/* Luster Quotient — 5 stars */}
                    <div className="grading-item" data-stars="5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-sm text-primary font-medium">{t("craft.grading.lq")}</span>
                        <span className="font-sans text-xs text-text-secondary">★★★★★</span>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="star-slot h-3 flex-1 rounded-full bg-surface-container overflow-hidden">
                            <div className="star-fill h-full rounded-full bg-primary origin-left" style={{ width: "0%" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Nacre Thickness — 4.5 stars */}
                    <div className="grading-item" data-stars="4.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-sm text-primary font-medium">{t("craft.grading.nacre")}</span>
                        <span className="font-sans text-xs text-text-secondary">★★★★½</span>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="star-slot h-3 flex-1 rounded-full bg-surface-container overflow-hidden">
                            <div className="star-fill h-full rounded-full bg-secondary origin-left" style={{ width: "0%" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Surface Topography — 4 stars */}
                    <div className="grading-item" data-stars="4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-sm text-primary font-medium">{t("craft.grading.surface")}</span>
                        <span className="font-sans text-xs text-text-secondary">★★★★☆</span>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className="star-slot h-3 flex-1 rounded-full bg-surface-container overflow-hidden">
                            <div className="star-fill h-full rounded-full bg-outline-variant origin-left" style={{ width: "0%" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 溯源卡片 — 独立于 pin 区域之外，CSS 初始隐藏 */}
      <section className="trace-card gradient-shell" style={{ opacity: 0, transform: "translateY(60px)" }}>
        <div className="glass-panel flex flex-col items-center gap-6 p-[18px] md:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </div>
          <div className="flex-grow">
            <h3 className="mb-2 text-xl font-semibold text-black">{t("craft.trace.title")}</h3>
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
