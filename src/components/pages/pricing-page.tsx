"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Sparkles, Server, Cloud, ChevronDown, ChevronUp } from "lucide-react";
import { Card, Button } from "@heroui/react";
import { useLanguage } from "@/contexts/language-context";

// ─── Dummy Data ────────────────────────────────────────────────
// TODO: Replace with CMS data source

type Deployment = "saas" | "onpremise";
type ProductKey = "prochain" | "hanoman" | "hairisma" | "aiso";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  highlighted?: boolean;
  badge?: string;
  features: { label: string; included: boolean }[];
}

interface ProductPricing {
  id: ProductKey;
  tiers: PricingTier[];
}

const PRODUCTS: { id: ProductKey; nameKey: string; icon: string; iconDark?: string }[] = [
  { id: "prochain", nameKey: "pricing.products.prochain", icon: "/img/products/prochain-logo-no-text.png" },
  { id: "hanoman", nameKey: "pricing.products.hanoman", icon: "/img/products/hanoman-logo-no-text.png" },
  { id: "hairisma", nameKey: "pricing.products.hairisma", icon: "/img/products/hairisma-logo-no-text.png", iconDark: "/img/products/hairisma-logo-no-text-darkmode.png" },
  { id: "aiso", nameKey: "pricing.products.aiso", icon: "/img/products/aiso-logo-no-text.png" },
];

const DEPLOYMENTS: { id: Deployment; nameKey: string; icon: typeof Cloud }[] = [
  { id: "saas", nameKey: "pricing.deployments.saas", icon: Cloud },
  { id: "onpremise", nameKey: "pricing.deployments.onpremise", icon: Server },
];

const PRICING_DATA: Record<Deployment, Record<ProductKey, ProductPricing>> = {
  saas: {
    prochain: {
      id: "prochain",
      tiers: [
        {
          name: "Standard",
          price: "Rp 150.000",
          period: "/bulan/outlet",
          features: [
            { label: "Manajemen pesanan pembelian", included: true },
            { label: "Pelacakan stok real-time", included: true },
            { label: "Laporan penjualan dasar", included: true },
            { label: "1 lokasi / 1 pengguna", included: true },
            { label: "Multi-cabang", included: false },
            { label: "Integrasi akuntansi", included: false },
            { label: "API kustom", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 350.000",
          period: "/bulan/outlet",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Manajemen pesanan pembelian", included: true },
            { label: "Pelacakan stok real-time", included: true },
            { label: "Laporan penjualan lengkap", included: true },
            { label: "Multi lokasi (hingga 10)", included: true },
            { label: "Multi pengguna + role", included: true },
            { label: "Integrasi akuntansi", included: true },
            { label: "API kustom", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 650.000",
          period: "/bulan/outlet",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Multi-cabang tanpa batas", included: true },
            { label: "Integrasi akuntansi lengkap", included: true },
            { label: "API kustom + Webhook", included: true },
            { label: "Dedicated account manager", included: true },
            { label: "SLA 99.9% uptime", included: true },
            { label: "White-label opsional", included: true },
          ],
        },
      ],
    },
    hanoman: {
      id: "hanoman",
      tiers: [
        {
          name: "Standard",
          price: "Rp 175.000",
          period: "/bulan/outlet",
          features: [
            { label: "Sistem POS dasar", included: true },
            { label: "Manajemen profil tamu", included: true },
            { label: "Pencetakan struk", included: true },
            { label: "Pembayaran tunai & non-tunai", included: true },
            { label: "Reservasi online", included: false },
            { label: "CRM & loyalitas", included: false },
            { label: "Integrasi marketplace", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 400.000",
          period: "/bulan/outlet",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Reservasi & booking online", included: true },
            { label: "CRM + deposit pelanggan", included: true },
            { label: "Multi outlet (hingga 10)", included: true },
            { label: "Denah meja interaktif", included: true },
            { label: "Struk digital (WA/SMS)", included: true },
            { label: "Integrasi marketplace", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 750.000",
          period: "/bulan/outlet",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Multi outlet tanpa batas", included: true },
            { label: "Integrasi marketplace", included: true },
            { label: "Loyalty program lengkap", included: true },
            { label: "Order online (GoFood/GrabFood)", included: true },
            { label: "API + custom integration", included: true },
            { label: "Dedicated support 24/7", included: true },
          ],
        },
      ],
    },
    hairisma: {
      id: "hairisma",
      tiers: [
        {
          name: "Standard",
          price: "Rp 125.000",
          period: "/bulan/user",
          features: [
            { label: "Absensi online (foto)", included: true },
            { label: "Jadwal shift dasar", included: true },
            { label: "Laporan kehadiran", included: true },
            { label: "Hingga 25 karyawan", included: true },
            { label: "Manajemen cuti", included: false },
            { label: "Payroll terintegrasi", included: false },
            { label: "Rekrutmen & onboarding", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 275.000",
          period: "/bulan/user",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Manajemen cuti & approval", included: true },
            { label: "Absensi geolokasi", included: true },
            { label: "Hingga 100 karyawan", included: true },
            { label: "Laporan kinerja", included: true },
            { label: "Integrasi payroll", included: true },
            { label: "Rekrutmen & onboarding", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 500.000",
          period: "/bulan/user",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Karyawan tanpa batas", included: true },
            { label: "Rekrutmen & onboarding", included: true },
            { label: "Penilaian kinerja", included: true },
            { label: "Penggajian lengkap", included: true },
            { label: "Struktur organisasi", included: true },
            { label: "API + custom workflow", included: true },
          ],
        },
      ],
    },
    aiso: {
      id: "aiso",
      tiers: [
        {
          name: "Standard",
          price: "Rp 150.000",
          period: "/bulan",
          features: [
            { label: "Pembukuan dasar", included: true },
            { label: "Laporan laba rugi", included: true },
            { label: "Laporan neraca", included: true },
            { label: "1 bisnis / 1 akun", included: true },
            { label: "Multi-mata uang", included: false },
            { label: "Invoice & faktur otomatis", included: false },
            { label: "Laporan pajak otomatis", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 350.000",
          period: "/bulan",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Multi-mata uang", included: true },
            { label: "Invoice & faktur otomatis", included: true },
            { label: "Multi bisnis", included: true },
            { label: "Laporan arus kas detail", included: true },
            { label: "Integrasi bank", included: true },
            { label: "Laporan pajak otomatis", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 650.000",
          period: "/bulan",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Laporan pajak otomatis", included: true },
            { label: "Audit trail lengkap", included: true },
            { label: "Budgeting & forecasting", included: true },
            { label: "Consolidation multi-cabang", included: true },
            { label: "API + export kustom", included: true },
            { label: "Dedicated accountant support", included: true },
          ],
        },
      ],
    },
  },
  onpremise: {
    prochain: {
      id: "prochain",
      tiers: [
        {
          name: "Standard",
          price: "Rp 5.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Instalasi server lokal", included: true },
            { label: "Manajemen pesanan & stok", included: true },
            { label: "Laporan penjualan dasar", included: true },
            { label: "1 server + 3 user", included: true },
            { label: "Multi-cabang", included: false },
            { label: "Pembaruan otomatis", included: false },
            { label: "Remote support", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 15.000.000",
          period: "lisensi lokal",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Multi-cabang (hingga 10)", included: true },
            { label: "Multi user tanpa batas", included: true },
            { label: "Integrasi akuntansi", included: true },
            { label: "Pembaruan berkala", included: true },
            { label: "Remote support 12 bulan", included: true },
            { label: "Custom report", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 35.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Multi-cabang tanpa batas", included: true },
            { label: "Custom module & report", included: true },
            { label: "Pembaruan seumur hidup", included: true },
            { label: "On-site training", included: true },
            { label: "Priority support 24 bulan", included: true },
            { label: "Sumber kode tersedia", included: true },
          ],
        },
      ],
    },
    hanoman: {
      id: "hanoman",
      tiers: [
        {
          name: "Standard",
          price: "Rp 7.500.000",
          period: "lisensi lokal",
          features: [
            { label: "POS offline lengkap", included: true },
            { label: "Manajemen meja & kasir", included: true },
            { label: "Pencetakan struk", included: true },
            { label: "1 server + 3 terminal", included: true },
            { label: "Reservasi online", included: false },
            { label: "CRM & loyalitas", included: false },
            { label: "Multi-cabang", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 20.000.000",
          period: "lisensi lokal",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Reservasi & booking", included: true },
            { label: "CRM + loyalty dasar", included: true },
            { label: "Multi terminal tanpa batas", included: true },
            { label: "Multi-cabang (hingga 10)", included: true },
            { label: "Remote support 12 bulan", included: true },
            { label: "Integrasi marketplace", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 45.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Multi-cabang tanpa batas", included: true },
            { label: "Integrasi marketplace", included: true },
            { label: "Loyalty program lengkap", included: true },
            { label: "On-site training", included: true },
            { label: "Priority support 24 bulan", included: true },
            { label: "Sumber kode tersedia", included: true },
          ],
        },
      ],
    },
    hairisma: {
      id: "hairisma",
      tiers: [
        {
          name: "Standard",
          price: "Rp 4.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Absensi fingerprint/web", included: true },
            { label: "Jadwal shift dasar", included: true },
            { label: "Laporan kehadiran", included: true },
            { label: "Hingga 50 karyawan", included: true },
            { label: "Manajemen cuti", included: false },
            { label: "Payroll", included: false },
            { label: "Multi-cabang", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 12.000.000",
          period: "lisensi lokal",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Manajemen cuti & approval", included: true },
            { label: "Hingga 200 karyawan", included: true },
            { label: "Payroll integrasi", included: true },
            { label: "Laporan kinerja", included: true },
            { label: "Remote support 12 bulan", included: true },
            { label: "Multi-cabang", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 25.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Karyawan tanpa batas", included: true },
            { label: "Multi-cabang lengkap", included: true },
            { label: "Rekrutmen & onboarding", included: true },
            { label: "Penggajian lengkap", included: true },
            { label: "On-site training", included: true },
            { label: "Priority support 24 bulan", included: true },
          ],
        },
      ],
    },
    aiso: {
      id: "aiso",
      tiers: [
        {
          name: "Standard",
          price: "Rp 5.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Pembukuan dasar", included: true },
            { label: "Laporan keuangan standar", included: true },
            { label: "1 entitas bisnis", included: true },
            { label: "1 server + 3 user", included: true },
            { label: "Multi-mata uang", included: false },
            { label: "Integrasi bank", included: false },
            { label: "Pajak otomatis", included: false },
          ],
        },
        {
          name: "Professional",
          price: "Rp 18.000.000",
          period: "lisensi lokal",
          highlighted: true,
          badge: "Populer",
          features: [
            { label: "Semua fitur Standard", included: true },
            { label: "Multi-mata uang", included: true },
            { label: "Multi entitas bisnis", included: true },
            { label: "Invoice & faktur otomatis", included: true },
            { label: "Integrasi bank", included: true },
            { label: "Remote support 12 bulan", included: true },
            { label: "Pajak otomatis", included: false },
          ],
        },
        {
          name: "Premium",
          price: "Rp 35.000.000",
          period: "lisensi lokal",
          features: [
            { label: "Semua fitur Professional", included: true },
            { label: "Pajak otomatis", included: true },
            { label: "Audit trail lengkap", included: true },
            { label: "Budgeting & forecasting", included: true },
            { label: "On-site training", included: true },
            { label: "Priority support 24 bulan", included: true },
            { label: "Sumber kode tersedia", included: true },
          ],
        },
      ],
    },
  },
};

// ─── Comparison table data ─────────────────────────────────────
// TODO: Replace with CMS data source

interface ComparisonFeature {
  labelKey: string;
  tiers: ("standard" | "professional" | "premium")[];
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  { labelKey: "pricing.compare.cloudSync", tiers: ["standard", "professional", "premium"] },
  { labelKey: "pricing.compare.multiUser", tiers: ["standard", "professional", "premium"] },
  { labelKey: "pricing.compare.advancedReports", tiers: ["professional", "premium"] },
  { labelKey: "pricing.compare.apiAccess", tiers: ["premium"] },
  { labelKey: "pricing.compare.dedicatedSupport", tiers: ["premium"] },
  { labelKey: "pricing.compare.customIntegration", tiers: ["premium"] },
  { labelKey: "pricing.compare.whiteLabel", tiers: ["premium"] },
  { labelKey: "pricing.compare.training", tiers: ["professional", "premium"] },
];

// ─── Bundle data ──────────────────────────────────────────────
// TODO: Replace with CMS data source

type BundleTier = "Standard" | "Professional" | "Premium";

const BUNDLE_TIERS: { id: BundleTier; nameKey: string }[] = [
  { id: "Standard", nameKey: "pricing.bundle.tier.standard" },
  { id: "Professional", nameKey: "pricing.bundle.tier.professional" },
  { id: "Premium", nameKey: "pricing.bundle.tier.premium" },
];

interface BundleApp {
  id: ProductKey;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  iconDark?: string;
  prices: Record<Deployment, Record<BundleTier, number>>;
  features: Record<BundleTier, string[]>;
}

const BUNDLE_APPS: BundleApp[] = [
  {
    id: "prochain",
    nameKey: "pricing.products.prochain",
    descriptionKey: "pricing.bundle.prochain.desc",
    icon: "/img/products/prochain-logo-no-text.png",
    prices: {
      saas: { Standard: 150000, Professional: 350000, Premium: 650000 },
      onpremise: { Standard: 5000000, Professional: 15000000, Premium: 35000000 },
    },
    features: {
      Standard: [
        "pricing.bundle.prochain.std.f1",
        "pricing.bundle.prochain.std.f2",
        "pricing.bundle.prochain.std.f3",
        "pricing.bundle.prochain.std.f4",
      ],
      Professional: [
        "pricing.bundle.prochain.pro.f1",
        "pricing.bundle.prochain.pro.f2",
        "pricing.bundle.prochain.pro.f3",
        "pricing.bundle.prochain.pro.f4",
      ],
      Premium: [
        "pricing.bundle.prochain.pre.f1",
        "pricing.bundle.prochain.pre.f2",
        "pricing.bundle.prochain.pre.f3",
        "pricing.bundle.prochain.pre.f4",
      ],
    },
  },
  {
    id: "hanoman",
    nameKey: "pricing.products.hanoman",
    descriptionKey: "pricing.bundle.hanoman.desc",
    icon: "/img/products/hanoman-logo-no-text.png",
    prices: {
      saas: { Standard: 175000, Professional: 400000, Premium: 750000 },
      onpremise: { Standard: 7500000, Professional: 20000000, Premium: 45000000 },
    },
    features: {
      Standard: [
        "pricing.bundle.hanoman.std.f1",
        "pricing.bundle.hanoman.std.f2",
        "pricing.bundle.hanoman.std.f3",
        "pricing.bundle.hanoman.std.f4",
      ],
      Professional: [
        "pricing.bundle.hanoman.pro.f1",
        "pricing.bundle.hanoman.pro.f2",
        "pricing.bundle.hanoman.pro.f3",
        "pricing.bundle.hanoman.pro.f4",
      ],
      Premium: [
        "pricing.bundle.hanoman.pre.f1",
        "pricing.bundle.hanoman.pre.f2",
        "pricing.bundle.hanoman.pre.f3",
        "pricing.bundle.hanoman.pre.f4",
      ],
    },
  },
  {
    id: "hairisma",
    nameKey: "pricing.products.hairisma",
    descriptionKey: "pricing.bundle.hairisma.desc",
    icon: "/img/products/hairisma-logo-no-text.png",
    iconDark: "/img/products/hairisma-logo-no-text-darkmode.png",
    prices: {
      saas: { Standard: 125000, Professional: 275000, Premium: 500000 },
      onpremise: { Standard: 4000000, Professional: 12000000, Premium: 25000000 },
    },
    features: {
      Standard: [
        "pricing.bundle.hairisma.std.f1",
        "pricing.bundle.hairisma.std.f2",
        "pricing.bundle.hairisma.std.f3",
        "pricing.bundle.hairisma.std.f4",
      ],
      Professional: [
        "pricing.bundle.hairisma.pro.f1",
        "pricing.bundle.hairisma.pro.f2",
        "pricing.bundle.hairisma.pro.f3",
        "pricing.bundle.hairisma.pro.f4",
      ],
      Premium: [
        "pricing.bundle.hairisma.pre.f1",
        "pricing.bundle.hairisma.pre.f2",
        "pricing.bundle.hairisma.pre.f3",
        "pricing.bundle.hairisma.pre.f4",
      ],
    },
  },
  {
    id: "aiso",
    nameKey: "pricing.products.aiso",
    descriptionKey: "pricing.bundle.aiso.desc",
    icon: "/img/products/aiso-logo-no-text.png",
    prices: {
      saas: { Standard: 150000, Professional: 350000, Premium: 650000 },
      onpremise: { Standard: 5000000, Professional: 18000000, Premium: 35000000 },
    },
    features: {
      Standard: [
        "pricing.bundle.aiso.std.f1",
        "pricing.bundle.aiso.std.f2",
        "pricing.bundle.aiso.std.f3",
        "pricing.bundle.aiso.std.f4",
      ],
      Professional: [
        "pricing.bundle.aiso.pro.f1",
        "pricing.bundle.aiso.pro.f2",
        "pricing.bundle.aiso.pro.f3",
        "pricing.bundle.aiso.pro.f4",
      ],
      Premium: [
        "pricing.bundle.aiso.pre.f1",
        "pricing.bundle.aiso.pre.f2",
        "pricing.bundle.aiso.pre.f3",
        "pricing.bundle.aiso.pre.f4",
      ],
    },
  },
];

function getBundleDiscount(count: number): number {
  if (count >= 4) return 0.15;
  if (count >= 3) return 0.10;
  if (count >= 2) return 0.05;
  return 0;
}

function formatCurrency(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

const DISCOUNT_LABELS: Record<number, string> = {
  2: "pricing.bundle.discount.2",
  3: "pricing.bundle.discount.3",
  4: "pricing.bundle.discount.4",
};

// ─── Framer Motion variants ────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

// ─── Component ─────────────────────────────────────────────────

export default function PricingPage() {
  const { t } = useLanguage();
  const [deployment, setDeployment] = useState<Deployment>("saas");
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>("prochain");
  const [selectedApps, setSelectedApps] = useState<ProductKey[]>([]);
  const [bundleTier, setBundleTier] = useState<BundleTier>("Professional");
  const [expandedApps, setExpandedApps] = useState<Set<ProductKey>>(new Set());

  const currentPricing = PRICING_DATA[deployment][selectedProduct];

  useEffect(() => {
    setExpandedApps(new Set());
  }, [bundleTier]);

  const toggleApp = (appId: ProductKey) => {
    setSelectedApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const toggleExpand = (appId: ProductKey) => {
    setExpandedApps((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }
      return next;
    });
  };

  const getAppPrice = (app: BundleApp) => app.prices[deployment][bundleTier];

  const bundleOriginalTotal = selectedApps.reduce(
    (sum, appId) => sum + getAppPrice(BUNDLE_APPS.find((a) => a.id === appId)!),
    0
  );
  const bundleDiscount = getBundleDiscount(selectedApps.length);
  const bundleDiscountedTotal = Math.round(bundleOriginalTotal * (1 - bundleDiscount));

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {t("pricing.hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              {t("pricing.hero.title")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {t("pricing.hero.subtitle")}
            </motion.p>

            {/* Deployment toggle */}
            <motion.div
              variants={fadeUp}
              custom={3}
            >
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/60 backdrop-blur-sm">
                {DEPLOYMENTS.map((dep) => {
                  const Icon = dep.icon;
                  const isActive = deployment === dep.id;
                  return (
                    <button
                      key={dep.id}
                      onClick={() => setDeployment(dep.id)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-background text-foreground shadow-sm ring-2 ring-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t(dep.nameKey)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {t(`pricing.deployments.hint.${deployment}`)}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Product Tabs + Pricing Cards ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {PRODUCTS.map((product) => {
              const isActive = selectedProduct === product.id;
              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden flex items-center justify-center">
                    <Image
                      src={product.icon}
                      alt={t(product.nameKey)}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                    {product.iconDark && (
                      <Image
                        src={product.iconDark}
                        alt={t(product.nameKey)}
                        fill
                        sizes="40px"
                        className="object-contain hidden dark:block absolute inset-0 m-auto"
                      />
                    )}
                  </div>
                  {t(product.nameKey)}
                </button>
              );
            })}
          </div>

          {/* Pricing cards */}
          <motion.div
            key={`${deployment}-${selectedProduct}`}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
          >
            {currentPricing.tiers.map((tier, i) => (
              <motion.div key={tier.name} variants={scaleIn}>
                <Card
                  className={`relative flex flex-col h-full p-6 lg:p-8 rounded-2xl border transition-all duration-200 ${
                    tier.highlighted
                      ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                      : "border-border hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {tier.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl lg:text-4xl font-bold">
                        {tier.price}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>

                  <ul className="flex-1 space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-start gap-3 text-sm"
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/40" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/50"
                          }
                        >
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="w-full">
                    <Button
                      variant={tier.highlighted ? "primary" : "outline"}
                      className="w-full"
                    >
                      {t("pricing.cta.choosePlan")} <ArrowRight className="w-4 h-4 inline-block ml-1" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {t("pricing.hero.note")}
          </p>
        </div>
      </section>

      {/* ── Bundle Builder ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {t("pricing.bundle.title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("pricing.bundle.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* App selector grid */}
              <motion.div variants={fadeUp} custom={1} className="lg:col-span-3">
                {/* Tier selector */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    {t("pricing.bundle.selectTier")}
                  </p>
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/60 backdrop-blur-sm">
                    {BUNDLE_TIERS.map((tier) => {
                      const isActive = bundleTier === tier.id;
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setBundleTier(tier.id)}
                          className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t(tier.nameKey)}
                          {tier.id === "Professional" && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                              Populer
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                  {t("pricing.bundle.selectApps")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BUNDLE_APPS.map((app) => {
                    const isSelected = selectedApps.includes(app.id);
                    const isExpanded = expandedApps.has(app.id);
                    const tierFeatures = app.features[bundleTier];
                    const VISIBLE_COUNT = 3;
                    const hiddenCount = tierFeatures.length - VISIBLE_COUNT;
                    const visibleFeatures = isExpanded ? tierFeatures : tierFeatures.slice(0, VISIBLE_COUNT);

                    return (
                      <div
                        key={app.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleApp(app.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleApp(app.id);
                          }
                        }}
                        className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                              <Image
                                src={app.icon}
                                alt={t(app.nameKey)}
                                fill
                                sizes="40px"
                                className="object-contain"
                              />
                              {app.iconDark && (
                                <Image
                                  src={app.iconDark}
                                  alt={t(app.nameKey)}
                                  fill
                                  sizes="40px"
                                  className="object-contain hidden dark:block absolute inset-0 m-auto"
                                />
                              )}
                            </div>
                            <h3 className="font-semibold text-lg">{t(app.nameKey)}</h3>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t(app.descriptionKey)}
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold">
                            {formatCurrency(getAppPrice(app))}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {deployment === "saas" ? t("pricing.bundle.perMonth") : ""}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1">
                          {visibleFeatures.map((fKey) => (
                            <li key={fKey} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-green-500 shrink-0" />
                              {t(fKey)}
                            </li>
                          ))}
                        </ul>
                        {hiddenCount > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(app.id);
                            }}
                            className="mt-2 flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                {t("pricing.bundle.showLess")} <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                {t("pricing.bundle.showMore").replace("{count}", String(hiddenCount))} <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Bundle summary card */}
              <motion.div variants={fadeUp} custom={2} className="lg:col-span-2">
                <Card className="sticky top-24 p-6 lg:p-8 rounded-2xl border-2 border-primary/20 bg-card shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      {t("pricing.bundle.priceLabel")}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {bundleTier}
                    </span>
                  </div>

                  {selectedApps.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-8 text-center">
                      {t("pricing.bundle.selectAtLeast2")}
                    </p>
                  ) : (
                    <>
                      {/* Selected apps list */}
                      <div className="space-y-3 mb-6">
                        {selectedApps.map((appId) => {
                          const app = BUNDLE_APPS.find((a) => a.id === appId)!;
                          return (
                            <div
                              key={appId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="font-medium">{t(app.nameKey)}</span>
                              <span className="text-muted-foreground">
                                {formatCurrency(getAppPrice(app))}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-border pt-4 space-y-2">
                        {/* Original total */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t("pricing.bundle.originalPrice")}
                          </span>
                          <span className="text-muted-foreground line-through">
                            {formatCurrency(bundleOriginalTotal)}
                          </span>
                        </div>

                        {/* Discount badge */}
                        {bundleDiscount > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {DISCOUNT_LABELS[selectedApps.length] ? t(DISCOUNT_LABELS[selectedApps.length]) : ""}
                            </span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              -{formatCurrency(bundleOriginalTotal - bundleDiscountedTotal)}
                            </span>
                          </div>
                        )}

                        {/* Final price */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="font-semibold">{t("pricing.bundle.bundlePrice")}</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(bundleDiscountedTotal)}
                            <span className="text-sm font-normal text-muted-foreground">
                              {deployment === "saas" ? t("pricing.bundle.perMonth") : ""}
                            </span>
                          </span>
                        </div>
                      </div>

                      {selectedApps.length >= 2 && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 text-sm text-center font-medium">
                          {DISCOUNT_LABELS[selectedApps.length] ? t(DISCOUNT_LABELS[selectedApps.length]) : ""} — {t("pricing.bundle.priceLabel")}
                        </div>
                      )}

                      <div className="mt-6">
                        <Link href="/contact" className="w-full block">
                          <Button
                            variant="primary"
                            className="w-full"
                          >
                            {t("pricing.bundle.contactCta")} <ArrowRight className="w-4 h-4 inline-block ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {t("pricing.compare.title")}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("pricing.compare.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={1}
              className="overflow-x-auto rounded-xl border border-border bg-card"
            >
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 lg:p-5 text-sm font-semibold text-muted-foreground">
                      {t("pricing.compare.feature")}
                    </th>
                    {["Standard", "Professional", "Premium"].map((name) => (
                      <th
                        key={name}
                        className="p-4 lg:p-5 text-center text-sm font-semibold"
                      >
                        <span
                          className={
                            name === "Professional"
                              ? "text-primary"
                              : "text-foreground"
                          }
                        >
                          {name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((feature, idx) => (
                    <tr
                      key={feature.labelKey}
                      className={`border-b border-border last:border-0 ${
                        idx % 2 === 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="p-4 lg:p-5 text-sm">
                        {t(feature.labelKey)}
                      </td>
                      {(["standard", "professional", "premium"] as const).map(
                        (tier) => (
                          <td key={tier} className="p-4 lg:p-5 text-center">
                            {feature.tiers.includes(tier) ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4"
            >
              {t("pricing.cta.title")}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto"
            >
              {t("pricing.cta.subtitle")}
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 font-semibold"
                >
                  {t("pricing.cta.contact")} <ArrowRight className="w-5 h-5 inline-block ml-1" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
                >
                  {t("pricing.cta.seeProducts")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
