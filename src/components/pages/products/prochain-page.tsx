"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Store,
  ShoppingCart,
  Package,
  Utensils,
  CreditCard,
  ShieldCheck,
  WifiOff,
  Monitor,
  LayoutGrid,
  Layers,
  Share2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Receipt,
  Users,
  Zap,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Chip, Card } from "@heroui/react";
import { Reveal, Counter } from "@/components/fragments/scroll-motion";
import { AnimatedBackground } from "@/components/fragments/animated-background";
// Asumsi path import hook i18n standar di project Anda:
import { useTranslation } from "@/hooks/use-translation";

interface POSModuleMeta {
  id: string;
  icon: LucideIcon;
  keyIndex: number;
  benefitsCount: number;
}

const PROCHAIN_MODULES_META: POSModuleMeta[] = [
  { id: "pos-multipayment", icon: CreditCard, keyIndex: 0, benefitsCount: 3 },
  { id: "inv-resep", icon: Package, keyIndex: 1, benefitsCount: 3 },
  { id: "meja-ruangan", icon: LayoutGrid, keyIndex: 2, benefitsCount: 3 },
  { id: "kds-display", icon: Utensils, keyIndex: 3, benefitsCount: 3 },
  { id: "auth-pettycash", icon: ShieldCheck, keyIndex: 4, benefitsCount: 3 },
  { id: "offline-server", icon: WifiOff, keyIndex: 5, benefitsCount: 3 },
];

const STEPS_META: { icon: LucideIcon; keyIndex: number }[] = [
  { icon: Package, keyIndex: 0 },
  { icon: Monitor, keyIndex: 1 },
  { icon: TrendingUp, keyIndex: 2 },
];

export default function ProChainPage() {
  const { t } = useTranslation(); // Mengambil fungsi terjemahan i18n
  const [activeTab, setActiveTab] = useState(0);

  const currentModuleMeta = PROCHAIN_MODULES_META[activeTab];
  const CurrentIcon = currentModuleMeta.icon;

  // Render senarai benefit aktif secara dinamis berdasarkan key terjemahan
  const activeBenefits = Array.from({ length: currentModuleMeta.benefitsCount }).map((_, idx) =>
    t(`products.prochain.modules.${currentModuleMeta.keyIndex}.benefit.${idx}`)
  );

  return (
    <>
      {/* ================= BREADCRUMB ================= */}
      <div className="border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-[13px] text-foreground/60 sm:px-6 lg:px-8 font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t("products.prochain.breadcrumb.home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#products" className="hover:text-foreground transition-colors">
            {t("products.prochain.breadcrumb.products")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary font-bold">ProChain</span>
        </div>
      </div>

      {/* ================= HERO: EYECATCHING & PROFESSIONAL ================= */}
      <section className="relative isolate pt-12 pb-24 overflow-hidden bg-background text-foreground lg:pt-20">
        <AnimatedBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[180px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Copy */}
            <div>
              {/* <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[12.5px] font-bold text-primary shadow-sm">
                  <Sparkles className="h-4 w-4 animate-bounce inline" />
                  <span>{t("products.prochain.hero.badge")}</span>
                </div>
              </Reveal> */}

              <Reveal delay={100}>
                <h1 className="mt-6 font-display font-extrabold text-[42px] leading-[1.08] tracking-tight text-foreground sm:text-[56px] lg:text-[62px]">
                  {t("products.prochain.hero.title.0")} <br className="hidden sm:block" />
                  <span className="bg-linear-to-r from-warning via-orange-400 to-red-500 bg-clip-text text-transparent">
                    {t("products.prochain.hero.title.1")}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-6 text-[17px] leading-relaxed text-foreground/70 sm:text-[19px] font-normal">
                  {t("products.prochain.hero.subtitle")}
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-[16px] font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40"
                  >
                    {t("products.prochain.hero.cta.trial")}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#tentang-produk"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground/15 bg-background/50 px-7 py-4 text-[16px] font-bold text-foreground backdrop-blur-md transition-colors hover:bg-foreground/5 hover:border-foreground/30"
                  >
                    {t("products.prochain.hero.cta.demo")}
                  </Link>
                </div>
              </Reveal>

              {/* Trust badges */}
              <Reveal delay={400}>
                <div className="mt-10 pt-6 border-t border-foreground/10 flex flex-wrap items-center gap-6 text-[13px] font-semibold text-foreground/60">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary bg-primary/10 rounded-full p-0.5" />
                      <span>{t(`products.prochain.hero.trust.${idx}`)}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: Eyecatching Product Brand Card with Adaptive Logo */}
            <Reveal from="right" delay={200}>
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-[36px] border border-teal/40 bg-linear-to-b from-mint to-background p-6 sm:p-10 shadow-2xl">
                {/* Top Badge Banner */}
                <div className="flex items-center justify-between pb-6 border-b border-foreground/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-foreground/10 bg-background p-2.5 shadow-md">
                      {/* Logo Mode Terang */}
                      <Image
                        src="/img/products/prochain-logo-no-text.png"
                        alt="Logo ProChain"
                        width={48}
                        height={48}
                        className="object-contain block dark:hidden"
                      />
                      {/* Logo Mode Gelap */}
                      <Image
                        src="/img/products/prochain-logo-no-text.png"
                        alt="Logo ProChain Dark"
                        width={48}
                        height={48}
                        className="object-contain hidden dark:block"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-[24px] text-foreground leading-none">
                        ProChain
                      </h3>
                      <p className="text-[13px] font-bold text-primary mt-1">
                        {t("products.prochain.hero.card.subtitle")}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/20 px-3 py-1 font-mono text-[11px] font-bold text-primary">
                    {t("products.prochain.hero.card.badge")}
                  </span>
                </div>

                {/* Professional Value Proposition Points */}
                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-4 rounded-2xl bg-background/80 p-4 shadow-sm border border-foreground/5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[16px] text-foreground">
                        {t("products.prochain.hero.card.pos.title")}
                      </h4>
                      <p className="text-[13px] text-foreground/60 leading-relaxed mt-0.5">
                        {t("products.prochain.hero.card.pos.desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-background/80 p-4 shadow-sm border border-foreground/5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[16px] text-foreground">
                        {t("products.prochain.hero.card.inv.title")}
                      </h4>
                      <p className="text-[13px] text-foreground/60 leading-relaxed mt-0.5">
                        {t("products.prochain.hero.card.inv.desc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Corporate testimonial quote */}
                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                  <p className="text-[13.5px] font-medium text-foreground/80 italic">
                    {t("products.prochain.hero.card.quote")}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= STATS BAR: PROFESSIONAL METRICS ================= */}
      <section className="border-y border-foreground/10 bg-foreground/5 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 divide-y divide-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { val: 99.9, suf: "%", idx: 0, dec: 1 },
              { val: 0, suf: "%", idx: 1, dec: 0 },
              { val: 3, suf: "x", idx: 2, dec: 0 },
            ].map((st) => (
              <Reveal
                key={st.idx}
                delay={st.idx * 100}
                className="flex flex-col items-center text-center pt-6 sm:pt-0 sm:px-6 first:pt-0"
              >
                <Counter
                  value={st.val}
                  suffix={st.suf}
                  decimals={st.dec}
                  className="font-mono text-[44px] font-extrabold leading-none text-primary sm:text-[50px]"
                />
                <p className="mt-2 font-display text-[18px] font-bold text-foreground">
                  {t(`products.prochain.stats.${st.idx}.label`)}
                </p>
                <p className="mt-1 max-w-xs text-[14px] leading-relaxed text-foreground/60 font-normal">
                  {t(`products.prochain.stats.${st.idx}.caption`)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE BENTO EXPLORER ================= */}
      <section id="tentang-produk" className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-primary/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-primary">
              {t("products.prochain.modules.sectionBadge")}
            </span>
            <h2 className="mt-4 font-display font-extrabold text-[34px] tracking-tight text-foreground sm:text-[46px]">
              {t("products.prochain.modules.sectionTitle")}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-foreground/60">
              {t("products.prochain.modules.sectionDesc")}
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            {/* Left Column: Menu Pilihan Modul POS & Inventori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {PROCHAIN_MODULES_META.map((mod, i) => {
                const Icon = mod.icon;
                const isSelected = activeTab === i;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`group flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
                        : "border-foreground/10 bg-foreground/5 hover:border-foreground/20 hover:bg-foreground/10"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background text-foreground/70 group-hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-display font-bold text-[16px] truncate ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {t(`products.prochain.modules.${mod.keyIndex}.label`)}
                          </h3>
                          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-extrabold text-primary">
                            {t(`products.prochain.modules.${mod.keyIndex}.badge`)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-foreground/60 truncate font-medium">
                          {t(`products.prochain.modules.${mod.keyIndex}.tagline`)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        isSelected
                          ? "text-primary translate-x-1"
                          : "text-foreground/30 group-hover:text-foreground/60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Visual Showcase Panel */}
            <Reveal className="sticky top-28">
              <Card
                variant="transparent"
                className="relative overflow-hidden rounded-[36px] border-2 border-teal bg-linear-to-br from-mint to-background p-8 sm:p-12 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-foreground/10 pb-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30">
                      <CurrentIcon className="h-8 w-8" />
                    </span>
                    <div>
                      <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-primary">
                        {t(`products.prochain.modules.${currentModuleMeta.keyIndex}.tagline`)}
                      </span>
                      <h3 className="font-display font-extrabold text-[26px] text-foreground sm:text-[32px] leading-tight mt-0.5">
                        {t(`products.prochain.modules.${currentModuleMeta.keyIndex}.title`)}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-[17px] leading-relaxed text-foreground/80 font-normal">
                  {t(`products.prochain.modules.${currentModuleMeta.keyIndex}.desc`)}
                </p>

                <div className="mt-8 rounded-2xl bg-background/80 p-6 border border-foreground/10 shadow-sm">
                  <h4 className="font-display font-bold text-[15px] uppercase tracking-wider text-foreground">
                    {t("products.prochain.modules.capabilitiesHeading")}
                  </h4>
                  <ul className="mt-4 flex flex-col gap-4">
                    {activeBenefits.map((benefit, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3.5 text-[15px] leading-relaxed text-foreground/80 font-medium"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contextual Action Footer */}
                <div className="mt-10 pt-6 border-t border-foreground/10 flex items-center justify-between flex-wrap gap-4">
                  {/* <span className="text-[13.5px] text-foreground/60 font-medium">
                    {t("products.prochain.modules.footerNote")}
                  </span> */}
                  <Link
                    href="/contact?intent=demo"
                    className="inline-flex items-center gap-2 text-[15px] font-bold text-primary hover:underline"
                  >
                    {t("products.prochain.modules.consultBtn")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID: TRANSFORMATION COMPARISON ================= */}
      <section className="bg-foreground/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-primary font-mono">
              {t("products.prochain.comparison.sectionBadge")}
            </span>
            <h2 className="mt-3 font-display font-extrabold text-[32px] text-foreground sm:text-[44px]">
              {t("products.prochain.comparison.sectionTitle")}
            </h2>
            <p className="mt-4 text-[16px] text-foreground/60 leading-relaxed">
              {t("products.prochain.comparison.sectionDesc")}
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card 1: POS & Pembayaran */}
            <Reveal delay={100}>
              <div className="h-full rounded-[32px] border border-foreground/10 bg-background p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-foreground/10">
                    <span className="font-display font-bold text-lg text-red-500">
                      {t("products.prochain.comparison.oldMethod")}
                    </span>
                    <span className="font-display font-bold text-lg text-emerald-500">
                      {t("products.prochain.comparison.newMethod")}
                    </span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-[14px] text-foreground/80">
                      {t("products.prochain.comparison.pos.oldDesc")}
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[14px] font-bold text-foreground">
                      {t("products.prochain.comparison.pos.newDesc")}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center gap-2 text-primary font-bold text-[14px]">
                  <CreditCard className="h-4 w-4" /> {t("products.prochain.comparison.pos.footer")}
                </div>
              </div>
            </Reveal>

            {/* Card 2: Inventori & Resep */}
            <Reveal delay={200}>
              <div className="h-full rounded-[32px] border border-foreground/10 bg-background p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-foreground/10">
                    <span className="font-display font-bold text-lg text-red-500">
                      {t("products.prochain.comparison.oldMethod")}
                    </span>
                    <span className="font-display font-bold text-lg text-emerald-500">
                      {t("products.prochain.comparison.newMethod")}
                    </span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-[14px] text-foreground/80">
                      {t("products.prochain.comparison.inv.oldDesc")}
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[14px] font-bold text-foreground">
                      {t("products.prochain.comparison.inv.newDesc")}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center gap-2 text-primary font-bold text-[14px]">
                  <Package className="h-4 w-4" /> {t("products.prochain.comparison.inv.footer")}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= SIMPLICITY STEP-BY-STEP ================= */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-primary font-mono">
              {t("products.prochain.steps.sectionBadge")}
            </span>
            <h2 className="mt-3 font-display font-extrabold text-[32px] tracking-tight text-foreground sm:text-[44px]">
              {t("products.prochain.steps.sectionTitle")}
            </h2>
            <p className="mt-3 text-[16px] text-foreground/60 leading-relaxed">
              {t("products.prochain.steps.sectionDesc")}
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS_META.map((step, i) => {
              const Icon = step.icon;
              const stepNumber = `0${i + 1}`;
              return (
                <Reveal
                  key={stepNumber}
                  delay={i * 120}
                  className="relative flex flex-col justify-between rounded-[32px] border-2 border-foreground/10 bg-foreground/5 p-8 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[36px] font-extrabold text-primary">
                        {stepNumber}
                      </span>
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                        <Icon className="h-7 w-7" />
                      </span>
                    </div>
                    <h3 className="mt-6 font-display font-bold text-[22px] text-foreground leading-snug">
                      {t(`products.prochain.steps.${step.keyIndex}.title`)}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-foreground/65 font-medium">
                      {t(`products.prochain.steps.${step.keyIndex}.desc`)}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center gap-1 text-[13px] font-bold text-primary">
                    <span>{t("products.prochain.steps.stageLabel")} {i + 1}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DIMATA SUPERTEAM ECOSYSTEM ================= */}
      <section className="border-t border-foreground/10 bg-mint py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-[12px] font-bold text-primary">
                <Share2 className="h-4 w-4" />
                <span>{t("products.prochain.ecosystem.badge")}</span>
              </div>
              <h2 className="mt-4 font-display font-extrabold text-[34px] tracking-tight text-foreground sm:text-[44px]">
                {t("products.prochain.ecosystem.title")}
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-foreground/75 font-normal">
                {t("products.prochain.ecosystem.desc")}
              </p>
              <div className="mt-8">
                <Link
                  href="/contact?intent=demo"
                  className="inline-flex items-center gap-2 font-bold text-[16px] text-primary hover:underline"
                >
                  {t("products.prochain.ecosystem.learnMore")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Reveal delay={150}>
                <Card
                  variant="transparent"
                  className="flex h-full flex-col justify-between rounded-[32px] border-2 border-teal bg-background p-8 shadow-xl transition-transform hover:-translate-y-1"
                >
                  <div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-extrabold text-primary">
                      {t("products.prochain.ecosystem.hr.badge")}
                    </span>
                    <h3 className="mt-4 font-display font-extrabold text-[24px] text-foreground">
                      {t("products.prochain.ecosystem.hr.title")}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/70">
                      {t("products.prochain.ecosystem.hr.desc")}
                    </p>
                  </div>
                  <Link
                    href="/products/hairisma"
                    className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold text-primary hover:underline"
                  >
                    {t("products.prochain.ecosystem.hr.link")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              </Reveal>

              <Reveal delay={250}>
                <Card
                  variant="transparent"
                  className="flex h-full flex-col justify-between rounded-[32px] border-2 border-teal bg-background p-8 shadow-xl transition-transform hover:-translate-y-1"
                >
                  <div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[11px] font-extrabold text-primary">
                      {t("products.prochain.ecosystem.acc.badge")}
                    </span>
                    <h3 className="mt-4 font-display font-extrabold text-[24px] text-foreground">
                      {t("products.prochain.ecosystem.acc.title")}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/70">
                      {t("products.prochain.ecosystem.acc.desc")}
                    </p>
                  </div>
                  <Link
                    href="/products/aiso"
                    className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold text-primary hover:underline"
                  >
                    {t("products.prochain.ecosystem.acc.link")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CORPORATE CTA ================= */}
      <section className="relative isolate overflow-hidden bg-background py-24 text-foreground lg:py-32">
        <AnimatedBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[180px]"
        />
        <Reveal className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-[36px] tracking-tight text-foreground sm:text-[50px]">
            {t("products.prochain.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-foreground/70 sm:text-[19px]">
            {t("products.prochain.cta.desc")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-9 py-5 text-[16px] font-extrabold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40"
            >
              {t("products.prochain.cta.btnTrial")}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact?intent=demo"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground/15 bg-foreground/5 px-8 py-5 text-[16px] font-bold text-foreground transition-colors hover:bg-foreground/10 hover:border-foreground/30"
            >
              {t("products.prochain.cta.btnConsult")}
            </Link>
          </div>
          {/* <p className="mt-6 text-[13px] font-semibold text-foreground/50">
            {t("products.prochain.cta.guarantee")}
          </p> */}
        </Reveal>
      </section>
    </>
  );
}