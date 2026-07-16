"use client";

import Link from "next/link";
import Image from "next/image"; // 1. Ditambahkan impor Image dari Next.js
import {
  ArrowRight,
  ArrowDown,
  Award,
  Users,
  Clock,
  Cable,
  RadioTower,
  ShieldCheck,
} from "lucide-react"; // 2. Dibersihkan impor ikon yang tidak terpakai
import type { LucideIcon } from "lucide-react";
import { Chip, Card } from "@heroui/react";
import { Reveal, Counter } from "@/components/scroll-motion";
import { SystemDiagram } from "@/components/system-diagram";
import { useLanguage } from "@/contexts/language-context";

/**
 * Homepage — DIMATA IT Solutions
 * ------------------------------------------------------------------
 * v2 redesign notes
 *
 * Direction: DIMATA sells a *connected suite*, not four separate apps
 * (ProChain / Hanoman / Hairisma / AISO). Every new element on this
 * page leans on that one idea — a live "system" that businesses plug
 * into — instead of generic SaaS-marketing furniture:
 * - Hero: an animated node diagram (see components/system-diagram.tsx)
 * showing the four modules feeding one core, plus a mono "readout"
 * status strip (uptime / latency / businesses live) instead of a
 * plain stat row.
 * - Products: each card now states which other modules it exchanges
 * data with ("Connects to ..."), so the numbering (01–04) encodes
 * real suite architecture rather than decorative sequencing.
 * - How it works: a genuine 3-step rollout sequence, connected by a
 * single vertical/horizontal line that draws itself in on scroll.
 * - A recurring "SYSTEM ONLINE" status chip ties hero, products and
 * the closing CTA together as one visual signature.
 *
 * Motion: all scroll-triggered animation goes through the <Reveal> and
 * <Counter> primitives in components/scroll-motion.tsx (plain CSS
 * transitions + IntersectionObserver, no animation library — matching
 * HeroUI v3's own "native CSS transitions, no JS animation runtime"
 * philosophy). Both respect prefers-reduced-motion.
 *
 * PENTING soal dark/light mode (v3): SELURUH halaman sekarang ikut tema
 * situs — Hero, "How it works", dan CTA penutup dulunya sengaja dikunci
 * gelap lewat token `bg-hero` / `text-hero-foreground`, tapi sekarang
 * ketiganya sudah dipindah ke token tema biasa (`bg-background`,
 * `text-foreground`, `bg-mint`, `border-teal`, dst.) supaya terang di
 * light mode dan gelap di dark mode seperti section lainnya.
 *
 * Token `bg-hero` / `text-hero-foreground` masih dipertahankan di
 * globals.css dan masih dipakai di SATU tempat secara sengaja: blok
 * ikon pada kartu produk (lihat komentar "Blok ikon" di bawah). Blok
 * itu memang dibuat selalu gelap sebagai aksen kontras terhadap kartu
 * di sekitarnya, bukan representasi background halaman — jangan
 * disamakan dengan section-section besar di atas.
 */

interface Metric {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
}

const HERO_METRICS: Metric[] = [
  { label: "Uptime", value: 99.98, suffix: "%", decimals: 2 },
  { label: "Avg. response", value: 180, suffix: "ms" },
  { label: "Businesses live", value: 197, suffix: "+" },
];

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  caption: string;
}

const STATS: Stat[] = [
  {
    icon: Award,
    value: 20,
    suffix: "+",
    label: "Years running",
    caption: "In production since 2002 — not a recent rebrand.",
  },
  {
    icon: Users,
    value: 197,
    suffix: "+",
    label: "Businesses onboard",
    caption: "From single outlets to multi-branch operations.",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Support desk",
    caption: "A human on call, every hour your business runs.",
  },
];

interface Product {
  number: string;
  name: string;
  description: string;
  icon: string;
  connectsTo: string[];
}

const PRODUCTS: Product[] = [
  {
    number: "01",
    name: "ProChain",
    description:
      "Operational structure management — branches, roles, and SOPs kept in sync across every location.",
    icon: "/img/products/prochain-logo-no-text.png", // Sesuaikan ekstensi file (.png/.svg/.webp)
    connectsTo: ["Hairisma", "AISO"],
  },
  {
    number: "02",
    name: "Hanoman",
    description:
      "Guest data and POS management — every transaction and guest profile captured at the point of service.",
    icon: "/img/products/hanoman-logo-no-text.png",
    connectsTo: ["AISO", "ProChain"],
  },
  {
    number: "03",
    name: "Hairisma",
    description:
      "Attendance and performance tracking — clock-ins, shift coverage, and staff performance in one view.",
    icon: "/img/products/hairisma-logo-no-text.png",
    connectsTo: ["ProChain", "AISO"],
  },
  {
    number: "04",
    name: "AISO",
    description:
      "Real-time financial reporting — revenue, payroll, and costs reconciled automatically as data comes in.",
    icon: "/img/products/aiso-logo-no-text.png",
    connectsTo: ["Hanoman", "Hairisma"],
  },
];

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Connect",
    description:
      "We map your branches, roles, and existing tools, then wire the relevant DIMATA modules into your daily operations.",
    icon: Cable,
  },
  {
    number: "02",
    title: "Automate",
    description:
      "Attendance, transactions, and structure changes sync automatically — no more re-entering the same data twice.",
    icon: RadioTower,
  },
  {
    number: "03",
    title: "Oversee",
    description:
      "One dashboard gives you a live read on every branch, shift, and rupiah — with a support desk on standby 24/7.",
    icon: ShieldCheck,
  },
];

const INDUSTRIES = [
  "Hospitality Groups",
  "Retail Chains",
  "F&B Franchises",
  "Multi-branch Retailers",
  "Property Management",
];

function StatusChip({ className = "" }: { className?: string }) {
  return (
    <Chip
      className={`inline-flex items-center gap-2 border border-foreground/15 bg-foreground/5 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.08em] text-foreground/70 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      SYSTEM ONLINE
    </Chip>
  );
}

const productNodes = [
  { label: "Prochain", imageSrc: "/img/products/prochain-logo-no-text.png" }, // Top
  { label: "aiso", imageSrc: "/img/products/aiso-logo-no-text.png" }, // Right
  { label: "hairisma", imageSrc: "/img/products/hairisma-logo-no-text.png" }, // Bottom
  { label: "hanoman", imageSrc: "/img/products/hanoman-logo-no-text.png" }, // Left
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      {/* ================= HERO — ikut tema light/dark ================= */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-background text-foreground">
        {/* dot-grid ambience */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-primary/20 blur-[160px]"
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          {/* Left — copy */}
          <div className="flex flex-col items-start text-left">
            {/* <StatusChip /> */}

            <h1 className="mt-7 font-display text-[42px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[58px] lg:text-[68px]">
              {t("home.hero.titleLine1")}
              <br />
              {t("home.hero.titleLine2")}{" "}
              <span className="text-primary">
                {t("home.hero.titleHighlight")}
              </span>
              .
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-foreground/60">
              {t("home.hero.description")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-7 py-3.5 text-[15px] font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
              >
                {t("home.hero.ctaDemo")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-foreground/20 px-7 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10"
              >
                {t("home.hero.ctaPlatform")}
              </Link>
            </div>

            {/* Mono readout strip — signature motif reused in later sections */}
            <div className="mt-14 flex w-full max-w-md flex-wrap gap-x-10 gap-y-5 border-t border-foreground/10 pt-7">
              {/* {HERO_METRICS.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <Counter
                    value={m.value}
                    suffix={m.suffix}
                    decimals={m.decimals ?? 0}
                    className="font-mono text-[22px] font-semibold text-foreground"
                  />
                  <span className="text-[11px] uppercase tracking-[0.1em] text-foreground/45">
                    {m.label}
                  </span>
                </div>
              ))} */}
              <div className="flex flex-row flex-wrap items-center gap-6 sm:gap-8">
                <Image
                  src="/img/partners/odoo_logo.png"
                  alt="Odoo"
                  width={100}
                  height={75}
                  className="h-9 w-auto object-contain"
                />

                <div className="h-9 w-px bg-border" aria-hidden="true" />

                <div className="flex flex-col gap-1 leading-none">
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Official
                  </span>
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.15em] text-foreground">
                    Partner
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — signature animated system diagram */}
          <Reveal
            from="right"
            className="relative mx-auto aspect-square w-full max-w-[440px]"
          >
            <SystemDiagram nodes={productNodes} />
          </Reveal>
        </div>

        {/* Scroll cue */}
        <a
          href="#why-us"
          className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[13px] font-medium text-foreground/50 transition-colors hover:text-foreground/80"
        >
          {t("home.scrollCue")}
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 transition-transform group-hover:translate-y-1">
            <ArrowDown className="h-4 w-4" />
          </span>
        </a>
      </section>

      {/* ================= TRUST STRIP — industries served, ikut tema ================= */}
      <section className="overflow-hidden border-y border-teal/40 bg-background py-6">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="shrink-0 pl-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/40 sm:pl-6 lg:pl-8">
            {t("home.builtFor")}
          </span>

          {/* Wrapper utama untuk menampung 2 track agar sejajar */}
          <div className="flex overflow-hidden">
            {/* Track 1: Ditambahkan _reverse & duplikasi array agar aman di layar lebar */}
            <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-3 pr-3 motion-reduce:animate-caret-none">
              {[...INDUSTRIES, ...INDUSTRIES].map((industry, i) => (
                <span
                  key={`track1-${industry}-${i}`}
                  className="shrink-0 rounded-full border border-teal bg-mint px-4 py-1.5 text-[13px] font-medium text-foreground/70"
                >
                  {industry}
                </span>
              ))}
            </div>

            {/* Track 2: Duplikat persis Track 1 sebagai penyambung seamless looping */}
            <div
              aria-hidden="true"
              className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-3 pr-3 motion-reduce:animate-caret-none"
            >
              {[...INDUSTRIES, ...INDUSTRIES].map((industry, i) => (
                <span
                  key={`track2-${industry}-${i}`}
                  className="shrink-0 rounded-full border border-teal bg-mint px-4 py-1.5 text-[13px] font-medium text-foreground/70"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ("Why choose DIMATA?") — ikut tema light/dark ================= */}
      <section id="why-us" className="bg-foreground/7">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground/60">
              {t("home.stats.label")}
            </span>
            <h2 className="mt-3 font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
              {t("home.stats.title")}{" "}
              <span className="text-primary">DIMATA</span>
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/60">
              {t("home.stats.description")}
            </p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
            {STATS.map(({ icon: Icon, value, suffix, label, caption }, i) => (
              <Reveal key={label} delay={i * 120}>
                <Card
                  variant="transparent"
                  className="flex h-full flex-col gap-4 rounded-2xl border border-teal bg-mint px-8 py-10"
                >
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <Counter
                    value={value}
                    suffix={suffix}
                    className="font-mono text-[36px] font-semibold leading-none text-foreground"
                  />
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground/55">
                      {caption}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS — proses nyata (Connect → Automate → Oversee), ikut tema light/dark ================= */}
      <section className="relative overflow-hidden bg-background text-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] bg-dot-grid text-foreground"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground/50">
              {t("home.howItWorks.label")}
            </span>
            <h2 className="mt-3 font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
              {t("home.howItWorks.title")}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/55">
              {t("home.howItWorks.description")}
            </p>
          </Reveal>

          <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
            {/* connecting line */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-px bg-foreground/15 sm:block"
            />
            {STEPS.map(({ number, title, description, icon: Icon }, i) => (
              <Reveal
                key={number}
                delay={i * 150}
                className="relative flex flex-col items-start gap-4"
              >
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 bg-background font-mono text-[13px] text-foreground/70">
                  {number}
                </span>
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                <h3 className="font-display text-[19px] font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-[14px] leading-relaxed text-foreground/55">
                  {description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS — bento grid asimetris, ikut tema light/dark ================= */}
      <section id="products" className="bg-mint">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground/60">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("home.products.label")}
              </span>
              <h2 className="mt-3 max-w-xl font-display text-[32px] font-bold leading-tight tracking-tight text-foreground sm:text-[40px]">
                {t("home.products.title")}
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-foreground/60">
              {t("home.products.description")}
            </p>
          </Reveal>

          {/* Bento grid: kartu 1 & 4 lebar (8 kolom), kartu 2 & 3 sempit (4 kolom) — checkerboard, bukan sekadar grid rata */}
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* 3. Parameter icon diubah menjadi iconPath agar jelas bahwa tipe datanya adalah string url */}
            {PRODUCTS.map(
              (
                { number, name, description, icon: iconPath, connectsTo },
                i,
              ) => (
                <Reveal
                  key={name}
                  delay={(i % 2) * 120}
                  className={i % 3 === 0 ? "lg:col-span-8" : "lg:col-span-4"}
                >
                  <Card
                    variant="transparent"
                    className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-teal bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5"
                  >
                    {/* Blok ikon — pakai token hero (selalu gelap) supaya kontras & konsisten walau tema situs berganti */}
                    <div className="relative flex h-44 items-center justify-center overflow-hidden bg-accent/20 sm:h-52">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.08] bg-dot-grid text-white"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hero via-transparent to-transparent opacity-60"
                      />

                      {/* 4. Diganti dari <Icon /> menjadi komponen <Image /> dari Next.js */}
                      <span className="relative flex h-full w-full items-center justify-center rounded-2xl bg-accent/20 p-1.5 text-hero-foreground backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15 group-hover:text-primary">
                        <Image
                          src={iconPath}
                          alt={`${name} logo`}
                          width={160}
                          height={160}
                          quality={75}
                          loading={i === 0 ? "eager" : "lazy"}
                          className="h-3/5 w-3/5 object-contain transition-all duration-300"
                        />
                      </span>

                      <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-hero-foreground/10 font-mono text-[12px] font-medium text-hero-foreground/70 backdrop-blur-sm">
                        {number}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <Card.Header className="p-0">
                        <Card.Title className="font-display text-[21px] font-semibold text-foreground">
                          {name}
                        </Card.Title>
                      </Card.Header>
                      <Card.Content className="flex-1 p-0">
                        <p className="mt-2 text-[15px] leading-relaxed text-foreground/60">
                          {description}
                        </p>

                        {/* Encodes real suite architecture — which modules this one exchanges data with */}
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/35">
                            {t("home.products.connectsTo")}
                          </span>
                          {connectsTo.map((c) => (
                            <Chip
                              key={c}
                              className="rounded-full border border-teal bg-mint px-2.5 py-0.5 text-[11px] font-medium text-foreground/60"
                            >
                              {c}
                            </Chip>
                          ))}
                        </div>
                      </Card.Content>
                      <Card.Footer className="mt-5 p-0">
                        <Link
                          href="/solutions"
                          className="inline-flex items-center gap-2 text-[14px] font-semibold text-foreground"
                        >
                          {t("home.products.readMore")}
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-foreground/30 group-hover:text-white">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      </Card.Footer>
                    </div>

                    {/* Garis aksen tipis yang muncul di tepi kiri saat hover */}
                    <span className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
                  </Card>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA — ikut tema light/dark ================= */}
      <section className="relative overflow-hidden bg-background text-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[160px]"
        />
        <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
          {/* <StatusChip /> */}
          <h2 className="mt-7 font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[42px]">
            {t("home.cta.title")}
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/60">
            {t("home.cta.description")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 pl-7 pr-3 text-[15px] font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
            >
              {t("home.cta.ctaDemo")}
              <span className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-foreground/20 px-7 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              {t("home.cta.ctaSolutions")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
