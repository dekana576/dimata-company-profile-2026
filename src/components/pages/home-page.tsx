"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  Award,
  Users,
  Clock,
  Cable,
  RadioTower,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Chip, Card } from "@heroui/react";
import { Reveal, Counter } from "@/components/fragments/scroll-motion";
import { AnimatedBackground } from "@/components/fragments/animated-background";
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
 * Motion: scroll-triggered animation goes through the <Reveal> and
 * <Counter> primitives in components/scroll-motion.tsx (plain CSS
 * transitions + IntersectionObserver, no animation library — matching
 * HeroUI v3's own "native CSS transitions, no JS animation runtime"
 * philosophy). A separate, always-on layer — <AnimatedBackgroundd /> in
 * components/animated-background.tsx — drifts slow blurred gradient
 * orbs behind the Hero, "How it works" and closing CTA sections using
 * pure CSS keyframes (same no-JS-runtime philosophy). Both respect
 * prefers-reduced-motion.
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
    label: "home.stats.yearsRunning.label",
    caption: "home.stats.yearsRunning.caption",
  },
  {
    icon: Users,
    value: 197,
    suffix: "+",
    label: "home.stats.businessesOnboard.label",
    caption: "home.stats.businessesOnboard.caption",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "home.stats.supportDesk.label",
    caption: "home.stats.supportDesk.caption",
  },
];

interface Product {
  number: string;
  name: string;
  name2: string;
  link: string;
  description: string;
  icon: string;
  iconDark?: string; // Tambahan untuk gambar khusus dark mode
  /** Foto showcase khusus produk ini, ditampilkan di hero saat tab-nya aktif. */
  showcase: string;
  connectsTo: string[];
}

const PRODUCTS: Product[] = [
  {
    number: "01",
    name: "ProChain",
    name2: "POS & Cashier",
    link: "/products/prochain",
    description: "home.products.01.description",
    icon: "/img/products/prochain-logo-no-text.png",
    showcase: "/img/showcase/prochain1.png",
    connectsTo: ["Hairisma", "AISO"],
  },
  {
    number: "02",
    name: "AISO",
    name2: "Accounting",
    link: "/products/aiso",
    description: "home.products.04.description",
    icon: "/img/products/aiso-logo-no-text.png",
    showcase: "/img/showcase/aiso1.png",
    connectsTo: ["Hanoman", "Hairisma"],
  },
  {
    number: "03",
    name: "Hairisma",
    name2: "HRIS",
    link: "/products/hairisma",
    description: "home.products.03.description",
    icon: "/img/products/hairisma-logo-no-text.png",
    iconDark: "/img/products/hairisma-logo-no-text-darkmode.png", // Properti iconDark khusus Hairisma
    showcase: "/img/showcase/hairisma.png",
    connectsTo: ["ProChain", "AISO"],
  },
  {
    number: "04",
    name: "Hanoman",
    name2: "Hotel",
    link: "/products/hanoman",
    description: "home.products.02.description",
    icon: "/img/products/hanoman-logo-no-text.png",
    showcase: "/img/showcase/hanoman1.png",
    connectsTo: ["AISO", "ProChain"],
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
    title: "home.howItWorks.step0.title",
    description: "home.howItWorks.step0.description",
    icon: Cable,
  },
  {
    number: "02",
    title: "home.howItWorks.step1.title",
    description: "home.howItWorks.step1.description",
    icon: RadioTower,
  },
  {
    number: "03",
    title: "home.howItWorks.step2.title",
    description: "home.howItWorks.step2.description",
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

interface Client {
  name: string;
  logo: string;
  isTall: boolean;
}

const CLIENTS: Client[] = [
  { name: "BPD Bali", logo: "/img/client/logo-bpd-w-text.png", isTall: false },
  { name: "RAG", logo: "/img/client/logo-rag.png", isTall: false },
  { name: "Raditya", logo: "/img/client/logo-raditya.png", isTall: false },
  { name: "Tegal Sari", logo: "/img/client/logo-tegal-sari.png", isTall: true },
  { name: "Meguna", logo: "/img/client/logo-meguna.png", isTall: true },
  {
    name: "Warung semesta",
    logo: "/img/client/logo-warungsemesta.webp",
    isTall: false,
  },
  { name: "BDW", logo: "/img/client/logo-bdw.png", isTall: true },
  {
    name: "Novoturismo",
    logo: "/img/client/logo-novoturismo.png",
    isTall: false,
  },
  { name: "OTW-TL", logo: "/img/client/logo-otwtl1.png", isTall: true },
  { name: "BPBD", logo: "/img/client/logo-bpbd-denpasar.png", isTall: true },
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

interface HeroTag {
  label: string;
  className: string;
}

// Chip-chip fitur/produk di bawah headline hero (gaya "Kasir Online",
// "Akuntansi", dst. di majoo.id) — tiap chip warna berbeda supaya scannable.
const HERO_TAGS: HeroTag[] = [
  { label: "ProChain", className: "bg-sky-500 text-white" },
  { label: "Hanoman", className: "bg-teal-500 text-white" },
  { label: "Hairisma", className: "bg-pink-500 text-white" },
  { label: "AISO", className: "bg-violet-500 text-white" },
  { label: "Multi-cabang", className: "bg-orange-500 text-white" },
  { label: "Analitik Real-time", className: "bg-emerald-500 text-white" },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [activeProduct, setActiveProduct] = useState(0);
  const activeProductData = PRODUCTS[activeProduct];

  return (
    <>
      {/* ================= HERO — ikut tema light/dark ================= */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-background text-foreground">
        {/* animated background — always-on drifting gradient orbs (behind everything) */}
        <AnimatedBackground />

        {/* dot-grid ambience */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 h-140 w-140 -translate-y-1/2 rounded-full bg-primary/20 blur-[160px]"
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-15 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          {/* Left — copy */}

          <div className="flex flex-col items-start text-left">
            <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[58px] lg:text-[68px]">
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

            {/* Chip fitur/produk — versi DIMATA dari deretan tag di majoo.id */}
            {/* <div className="mt-6 flex flex-wrap gap-2.5">
              {HERO_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-semibold shadow-sm ${tag.className}`}
                >
                  {tag.label}
                </span>
              ))}
            </div> */}

            <div className="mt-8 flex flex-wrap items-center gap-3">
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

            {/* <a
              href="#why-us"
              className="group mt-5 inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-[13.5px] font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {t("home.hero.whyUs")}
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
            </a> */}

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
              <div className="flex flex-row flex-wrap items-center gap-6 sm:gap-8 w-full justify-center sm:justify-start">
                <div className="relative isolate flex items-center justify-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 scale-100 rounded-full bg-primary/20 blur-xl"
                  />
                  <Image
                    src="/img/partners/odoo_logo.png"
                    alt="Odoo"
                    width={100}
                    height={75}
                    className="relative h-9 w-auto object-contain"
                  />
                </div>

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

          {/* Right — hero image + kartu showcase produk yang bisa di-tab (pengganti system diagram) */}
          <Reveal
            from="right"
            className="relative mx-auto w-full max-w-135 pb-20 sm:pb-24"
          >
            <div className="relative aspect-4/5 overflow-hidden rounded-[80px] border border-foreground/10 shadow-2xl sm:aspect-5/6">
              {/* Semua showcase ditumpuk & di-crossfade lewat opacity — tiap produk punya fotonya sendiri */}
              {PRODUCTS.map((product, i) => (
                <Image
                  key={product.name}
                  src={product.showcase}
                  alt={`${product.name} — ${t("home.hero.imageAlt")}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className={`object-cover transition-opacity duration-500 ease-out ${
                    activeProduct === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent"
              />
            </div>

            {/* Kartu showcase — hook client langsung ke produk/project unggulan */}
            <div className="absolute inset-x-4 -bottom-2 rounded-[24px] border border-separator bg-background/95 p-5 shadow-xl backdrop-blur-lg sm:inset-x-6">
              {/* Tabs produk — grid mengisi penuh lebar kartu, tidak lagi nge-pack ke kiri */}
              <div
                className="grid gap-1 rounded-full bg-foreground/5 p-1"
                style={{
                  gridTemplateColumns: `repeat(${PRODUCTS.length}, minmax(0, 1fr))`,
                }}
              >
                {PRODUCTS.map((product, i) => (
                  <button
                    key={product.name}
                    type="button"
                    onClick={() => setActiveProduct(i)}
                    aria-pressed={activeProduct === i}
                    className={`rounded-full px-2 py-2 text-center text-[13px] font-medium transition-colors ${
                      activeProduct === i
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/55 hover:text-foreground"
                    }`}
                  >
                    {product.name2}
                  </button>
                ))}
              </div>

              {/* Konten produk aktif */}
              <div className="mt-4 flex items-start gap-4">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-2.5">
                  <Image
                    src={activeProductData.icon}
                    alt={`${activeProductData.name} logo`}
                    width={64}
                    height={64}
                    className={`h-full w-full object-contain ${
                      activeProductData.iconDark ? "dark:hidden" : ""
                    }`}
                  />
                  {activeProductData.iconDark && (
                    <Image
                      src={activeProductData.iconDark}
                      alt={`${activeProductData.name} logo dark`}
                      width={64}
                      height={64}
                      className="hidden h-full w-full object-contain dark:block"
                    />
                  )}
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-[17px] font-semibold text-foreground">
                    {activeProductData.name}
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/60 truncate">
                    {t(activeProductData.description)}
                  </p>
                  <Link
                    href={activeProductData.link}
                    className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
                  >
                    {t("home.products.readMore")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Scroll cue */}
        {/* <a
          href="#why-us"
          className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[13px] font-medium text-foreground/50 transition-colors hover:text-foreground/80"
        >
          {t("home.scrollCue")}
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 transition-transform group-hover:translate-y-1">
            <ArrowDown className="h-4 w-4" />
          </span>
        </a> */}
      </section>

      <section
  aria-label="Trusted by our clients"
  className="overflow-hidden border-y border-teal/40 bg-background py-8 lg:py-10"
>
  <div className="w-full text-center pb-5">
    {/* Label */}
    <span className="shrink-0 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/40 sm:px-6 md:pl-8 md:pr-0 md:text-left">
      {t("home.trustedBy")}
    </span>
  </div>

  {/* Wrapper utama */}
  <div className="flex flex-col items-center gap-4 whitespace-nowrap md:flex-row md:gap-6">
    {/* Wrapper Marquee dengan Fade Mask & Group Hover */}
    <div className="group relative flex w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      
      {/* Track 1 */}
      {/* Ditambahkan w-max dan will-change-transform untuk GPU acceleration */}
      <div className="flex w-max shrink-0 animate-[marquee_32s_linear_infinite] items-center gap-16 pr-16 will-change-transform motion-reduce:animate-none group-hover:[animation-play-state:paused] md:gap-24 md:pr-24">
        {[...CLIENTS, ...CLIENTS].map((client, i) => (
          <Image
            key={`track1-${client.name}-${i}`}
            src={client.logo}
            alt={client.name}
            width={client.isTall ? 160 : 260}
            height={client.isTall ? 160 : 90}
            // Tambahkan draggable={false} agar gambar tidak terseret secara tidak sengaja
            draggable={false}
            className={`w-auto shrink-0 object-contain opacity-60 transition-all duration-300 hover:scale-110 hover:grayscale-0 hover:opacity-100 ${
              client.isTall
                ? "h-16 sm:h-20 lg:h-24"
                : "h-12 sm:h-14 lg:h-16"
            }`}
          />
        ))}
      </div>

      {/* Track 2: Duplikat persis Track 1 sebagai penyambung seamless looping */}
      <div
        aria-hidden="true"
        className="flex w-max shrink-0 animate-[marquee_32s_linear_infinite] items-center gap-16 pr-16 will-change-transform motion-reduce:animate-none group-hover:[animation-play-state:paused] md:gap-24 md:pr-24"
      >
        {[...CLIENTS, ...CLIENTS].map((client, i) => (
          <Image
            key={`track2-${client.name}-${i}`}
            src={client.logo}
            alt=""
            width={client.isTall ? 160 : 260}
            height={client.isTall ? 160 : 90}
            draggable={false}
            className={`w-auto shrink-0 object-contain opacity-60 transition-all duration-300 hover:scale-110 hover:grayscale-0 hover:opacity-100 ${
              client.isTall
                ? "h-16 sm:h-20 lg:h-24"
                : "h-12 sm:h-14 lg:h-16"
            }`}
          />
        ))}
      </div>
      
    </div>
  </div>
</section>
      {/* ================= TRUST STRIP — industries served, ikut tema ================= */}
      <section className="overflow-hidden border-y border-teal/40 bg-background py-6">
        <div className="w-full text-center pb-5">
          {/* Label */}
          <span className="shrink-0 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/40 sm:px-6 md:pl-8 md:pr-0 md:text-left">
            {t("home.builtFor")}
          </span>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
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
                      {t(label)}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground/55">
                      {t(caption)}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS — proses nyata (Connect → Automate → Oversee), ikut tema light/dark ================= */}
      <section className="relative isolate overflow-hidden bg-background text-foreground">
        {/* animated background — always-on drifting gradient orbs (behind everything) */}
        <AnimatedBackground />

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
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[160px]"
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
                  {t(title)}
                </h3>
                <p className="text-[14px] leading-relaxed text-foreground/55">
                  {t(description)}
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
                {
                  number,
                  name,
                  link,
                  description,
                  icon: iconPath,
                  iconDark,
                  connectsTo,
                },
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
                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-hero via-transparent to-transparent opacity-60"
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
                          className={`h-3/5 w-3/5 object-contain transition-all duration-300 ${
                            iconDark ? "dark:hidden" : ""
                          }`}
                        />
                        {/* Menampilkan gambar khusus darkmode apabila iconDark tersedia */}
                        {iconDark && (
                          <Image
                            src={iconDark}
                            alt={`${name} logo dark`}
                            width={160}
                            height={160}
                            quality={75}
                            loading={i === 0 ? "eager" : "lazy"}
                            className="hidden h-3/5 w-3/5 object-contain transition-all duration-300 dark:block"
                          />
                        )}
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
                          {t(description)}
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
                          href={link}
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
      <section className="relative isolate overflow-hidden bg-background text-foreground">
        {/* animated background — always-on drifting gradient orbs (behind everything) */}
        <AnimatedBackground />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px]"
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
