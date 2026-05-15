"use client";

import { useLocale } from "@/lib/i18n/context";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { basePath } from "@/lib/config";

export default function ServicesPage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-16 md:px-20">
      {/* Hero */}
      <section className="glass-panel flex flex-col gap-6 rounded-xl p-[18px] md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-[36px] leading-10 tracking-tight text-primary md:text-[60px] md:leading-[60px]">
            {t("services.hero.title").split("\n").map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
          </h1>
          <p className="max-w-[600px] font-sans text-base text-text-secondary">{t("services.hero.desc")}</p>
        </div>
        <div className="h-[300px] w-full overflow-hidden rounded-lg md:h-[400px] md:w-1/2">
          <img src={`${basePath}/images/services-hero.jpeg`} alt="Services" className="h-full w-full object-cover object-top" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-[36px] leading-10 text-primary">{t("services.section.title")}</h2>
          <div className="h-1 w-12 bg-primary" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Aftercare */}
          <div className="glass-panel flex flex-col gap-4 rounded-xl p-[18px] transition-colors hover:bg-surface-bright">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary">{t("services.care.title")}</h3>
            <p className="flex-1 font-sans text-base text-text-secondary">{t("services.care.desc")}</p>
            <span className="w-fit border-b border-primary pb-[1px] font-sans text-sm text-primary hover:opacity-70 cursor-pointer">
              {t("services.care.cta")}
            </span>
          </div>
          {/* Authentication */}
          <div className="glass-panel flex flex-col gap-4 rounded-xl p-[18px] transition-colors hover:bg-surface-bright">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary">{t("services.auth.title")}</h3>
            <p className="flex-1 font-sans text-base text-text-secondary">{t("services.auth.desc")}</p>
            <span className="w-fit border-b border-primary pb-[1px] font-sans text-sm text-primary hover:opacity-70 cursor-pointer">
              {t("services.auth.cta")}
            </span>
          </div>
        </div>
      </section>

      {/* Store Locator */}
      <section className="glass-panel flex flex-col gap-6 rounded-xl p-[18px]">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex w-full flex-col gap-4 md:w-1/3">
            <div className="flex flex-col gap-2">
              <h2 className="text-[36px] leading-10 text-primary">{t("services.locator.title")}</h2>
              <p className="font-sans text-base text-text-secondary">{t("services.locator.desc")}</p>
            </div>
            <input
              className="w-full rounded-lg border border-border-subtle bg-surface-container-lowest py-2 px-4 font-sans text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={t("services.locator.search")}
              type="text"
            />
            <div className="flex flex-col gap-2">
              <div className="cursor-pointer rounded-lg border border-border-subtle bg-surface-container-lowest p-4 hover:border-primary">
                <h4 className="mb-1 font-sans text-base font-semibold text-primary">{t("services.locator.flagship.name")}</h4>
                <p className="font-sans text-sm text-text-secondary">{t("services.locator.flagship.addr")}</p>
              </div>
              <div className="cursor-pointer rounded-lg border border-border-subtle bg-surface-container-lowest p-4 hover:border-primary">
                <h4 className="mb-1 font-sans text-base font-semibold text-primary">{t("services.locator.zhuge.name")}</h4>
                <p className="font-sans text-sm text-text-secondary">{t("services.locator.zhuge.addr")}</p>
              </div>
            </div>
          </div>
          <div className="h-[500px] w-full overflow-hidden rounded-lg md:w-2/3">
            <img src={`${basePath}/images/store-map.jpeg`} alt="Store Map" className="h-full w-full object-cover object-top" />
          </div>
        </div>
      </section>
    </div>
  );
}
