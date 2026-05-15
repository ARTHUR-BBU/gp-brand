"use client";

import { useLocale } from "@/lib/i18n/context";
import { useState, useRef, useCallback } from "react";
import { basePath } from "@/lib/config";

const PEARL_COLORS = ["#FFFFFF", "#FFD700", "#1F2937", "#8b5a8b", "#C0C0C0"];

export default function BespokePage() {
  const { t } = useLocale();
  const [pearls, setPearls] = useState<Array<{ id: number; tx: number; ty: number; color: string; size: number }>>([]);
  const [burst, setBurst] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const steps = [
    { num: "01", titleKey: "bespoke.step1.title", descKey: "bespoke.step1.desc" },
    { num: "02", titleKey: "bespoke.step2.title", descKey: "bespoke.step2.desc" },
    { num: "03", titleKey: "bespoke.step3.title", descKey: "bespoke.step3.desc" },
    { num: "04", titleKey: "bespoke.step4.title", descKey: "bespoke.step4.desc" },
  ];

  const spawnPearls = useCallback(() => {
    const items = Array.from({ length: 24 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
      const dist = 50 + Math.random() * 80;
      return {
        id: Date.now() + i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        color: PEARL_COLORS[Math.floor(Math.random() * PEARL_COLORS.length)],
        size: 5 + Math.random() * 7,
      };
    });

    setBurst(false);
    setPearls(items);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBurst(true);
      });
    });

    timerRef.current = setTimeout(() => {
      setPearls([]);
      setBurst(false);
    }, 900);
  }, []);

  const stopPearls = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPearls([]);
    setBurst(false);
  }, []);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-16 md:px-20">
      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-6 min-h-[500px] md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-6">
          <h1 className="text-[36px] leading-10 tracking-tight text-primary md:text-[60px] md:leading-[60px]">
            {t("bespoke.hero.title").split("\n").map((l, i) => (
              <span key={i}>{l}{i < t("bespoke.hero.title").split("\n").length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="max-w-lg font-sans text-base leading-relaxed text-text-secondary">
            {t("bespoke.hero.desc")}
          </p>
        </div>
        <div className="gradient-shell md:col-span-6 h-[400px] md:h-[600px] overflow-hidden">
          <img src={`${basePath}/images/bespoke-hero.jpeg`} alt="Bespoke Atelier" className="h-full w-full object-cover object-top" />
        </div>
      </section>

      {/* Process Steps */}
      <section className="flex flex-col gap-4 border-t border-border-subtle pt-16">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl text-primary">{t("bespoke.process.title")}</h2>
          <div className="h-1 w-12 bg-primary" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.num} className="gradient-shell">
              <div className="glass-panel flex h-full flex-col gap-4 p-[18px]">
                <span className="text-4xl font-light text-primary/20">{step.num}</span>
                <h3 className="text-lg font-semibold text-primary">{t(step.titleKey)}</h3>
                <p className="flex-1 font-sans text-sm leading-relaxed text-text-secondary">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="gradient-shell h-[400px] md:h-[500px] overflow-hidden">
          <img src={`${basePath}/images/bespoke-detail.jpeg`} alt="Bespoke Detail" className="h-full w-full object-cover" />
        </div>
        <div className="gradient-shell h-[400px] md:h-[500px] overflow-hidden">
          <img src={`${basePath}/images/bespoke-selection.jpeg`} alt="Pearl Selection" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="glass-panel flex flex-col items-center gap-6 rounded-xl p-12 text-center">
        <h2 className="text-3xl text-primary">{t("bespoke.cta")}</h2>
        <p className="max-w-md font-sans text-base text-text-secondary">{t("bespoke.cta.desc")}</p>
        <div className="relative">
          <button
            onMouseEnter={spawnPearls}
            onMouseLeave={stopPearls}
            className="relative cursor-pointer bg-primary px-8 py-3 font-sans text-sm text-on-primary transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_10px_30px_rgba(15,23,42,0.35)] active:translate-y-0 active:scale-100"
          >
            {t("bespoke.cta")}
          </button>
          {pearls.map((p) => (
            <div
              key={p.id}
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), ${p.color} 55%, rgba(0,0,0,0.12))`,
                boxShadow: `0 1px 4px ${p.color}50, inset 0 -1px 2px rgba(0,0,0,0.1)`,
                transform: burst
                  ? `translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) scale(1)`
                  : "translate(-50%, -50%) scale(0.3)",
                opacity: burst ? 0 : 1,
                transition: "transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.7s ease-out",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
