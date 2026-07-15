"use client";

import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ShoppingCart,
  Package,
  Boxes,
  Calculator,
  Smartphone,
  Building2,
  Users,
  CalendarCheck,
  Briefcase,
  GraduationCap,
  Settings,
  FileText,
  Workflow,
  FileLock,
  Clock,
  CreditCard,
  Link2,
  MapPin,
  Sprout,
  BarChart3,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

/* ─── Animation Variants ─── */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const fadeLeft = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const fadeRight = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" as const },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/* ─── Data ─── */

const ERP_FEATURES = [
  {
    icon: ShoppingCart,
    title: "Purchasing",
    description:
      "Kelola proses pengadaan barang dengan efisien, mulai dari permintaan pembelian hingga penerimaan barang.",
  },
  {
    icon: Package,
    title: "Inventory",
    description:
      "Pantau stok barang secara real-time, kelola pergerakan barang, dan optimalkan tingkat persediaan Anda.",
  },
  {
    icon: Boxes,
    title: "Products Master & Costing",
    description:
      "Sentralisasi data produk dan hitung biaya produksi secara akurat untuk menentukan harga jual yang kompetitif.",
  },
  {
    icon: Calculator,
    title: "Accounting",
    description:
      "Otomatisasi pencatatan keuangan, hasilkan laporan akurat, dan pantau kesehatan finansial bisnis Anda.",
  },
  {
    icon: Smartphone,
    title: "Web & Mobile Solutions",
    description:
      "Akses sistem ERP Anda kapan saja dan di mana saja melalui perangkat web maupun aplikasi mobile.",
  },
];

const ACCOMMODATION_FEATURES = [
  {
    icon: Building2,
    title: "Property Management",
    description:
      "Kelola seluruh aspek properti Anda, mulai dari status kamar, pemeliharaan, hingga housekeeping.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description:
      "Simpan profil tamu, riwayat menginap, dan preferensi untuk memberikan layanan yang lebih personal.",
  },
  {
    icon: CalendarCheck,
    title: "Reservation & Registration Management",
    description:
      "Sistem reservasi terpusat yang memudahkan proses booking, check-in, dan check-out tamu.",
  },
  {
    icon: Briefcase,
    title: "Integrated Outlet Services",
    description:
      "Integrasi mulus dengan layanan restoran, spa, dan fasilitas lainnya untuk kemudahan penagihan.",
  },
  {
    icon: Calculator,
    title: "Accounting",
    description:
      "Laporan keuangan komprehensif yang terintegrasi langsung dengan seluruh transaksi operasional.",
  },
];

const HR_FEATURES = [
  {
    icon: Users,
    title: "Recruitment",
    description:
      "Kelola proses rekrutmen dan pelamaran dengan sistem pelacakan kandidat yang terstruktur.",
  },
  {
    icon: GraduationCap,
    title: "Onboarding",
    description:
      "Proses orientasi karyawan baru yang terstruktur untuk memastikan transisi yang mulus.",
  },
  {
    icon: Settings,
    title: "Training",
    description:
      "Manajemen program pelatihan dan pengembangan untuk meningkatkan kompetensi tim.",
  },
  {
    icon: Settings,
    title: "Operations",
    description:
      "Kelola operasional HR sehari-hari dengan efisien dalam satu platform terpusat.",
  },
  {
    icon: CalendarCheck,
    title: "Leave & Scheduling",
    description:
      "Manajemen cuti dan jadwal kerja yang fleksibel dan mudah diakses oleh karyawan.",
  },
  {
    icon: TrendingUp,
    title: "Appraisals & Recognition",
    description:
      "Sistem penilaian kinerja dan penghargaan untuk memotivasi dan mempertahankan talenta terbaik.",
  },
  {
    icon: Briefcase,
    title: "Company Structure",
    description:
      "Kelola struktur organisasi perusahaan, departemen, dan hierarki pelaporan dengan visualisasi yang jelas.",
  },
  {
    icon: Workflow,
    title: "Workflow",
    description:
      "Otomasi workflow dan approval process untuk mempercepat pengambilan keputusan.",
  },
  {
    icon: FileLock,
    title: "Company Documents",
    description:
      "Manajemen dokumen perusahaan yang aman dengan kontrol akses yang dapat disesuaikan.",
  },
  {
    icon: Clock,
    title: "Overtime",
    description:
      "Kelola data lembur karyawan dengan perhitungan otomatis yang terintegrasi ke payroll.",
  },
  {
    icon: FileText,
    title: "Employee Contract Management",
    description:
      "Manajemen kontrak karyawan dengan pengingat otomatis untuk perpanjangan atau evaluasi.",
  },
  {
    icon: CreditCard,
    title: "Payroll",
    description:
      "Sistem penggajian terintegrasi yang akurat, mematuhi regulasi pajak, dan tepat waktu.",
  },
  {
    icon: Link2,
    title: "Integration to Accounting",
    description:
      "Terintegrasi langsung dengan sistem akuntansi untuk pencatatan beban gaji yang otomatis.",
  },
];

const PLANTATION_FEATURES = [
  {
    icon: Briefcase,
    title: "Projects Management",
    description:
      "Kelola proyek perkebunan dengan efisien, dari perencanaan hingga eksekusi dan evaluasi.",
  },
  {
    icon: MapPin,
    title: "Areas Management",
    description:
      "Manajemen area dan lahan perkebunan dengan pemetaan blok dan blok tanam yang detail.",
  },
  {
    icon: Sprout,
    title: "Plants Management",
    description:
      "Kelola data tanaman, siklus pertumbuhan, jadwal pemupukan, dan perawatan secara sistematis.",
  },
  {
    icon: Package,
    title: "Inventory & Cost Management",
    description:
      "Manajemen inventori pupuk, bibit, alat, serta pelacakan biaya produksi per blok lahan.",
  },
  {
    icon: BarChart3,
    title: "Production Tracking",
    description:
      "Pantau hasil produksi panen secara real-time dan analisis tren produktivitas lahan.",
  },
];

const GENERAL_ACCOUNTING_FEATURES = [
  {
    icon: Calculator,
    title: "Flash Finance Report Generation",
    description:
      "Laporan keuangan cepat dari data Excel untuk analisis instan.",
  },
  {
    icon: Settings,
    title: "AI-based Supporting Bookkeeping",
    description:
      "Dukungan pembukuan berbasis AI untuk meminimalisir kesalahan input.",
  },
  {
    icon: BarChart3,
    title: "Real-time Financial Reports",
    description:
      "Laporan keuangan real-time untuk pengambilan keputusan yang lebih cepat.",
  },
  {
    icon: CreditCard,
    title: "Multi-currency Support",
    description:
      "Dukungan multi-mata uang untuk transaksi bisnis internasional.",
  },
];

const TRAVEL_ACCOUNTING_FEATURES = [
  {
    icon: Users,
    title: "Commission Management",
    description:
      "Manajemen komisi dan insentif agen yang akurat dan transparan.",
  },
  {
    icon: ShoppingCart,
    title: "Booking & Invoice Integration",
    description:
      "Integrasi mulus antara sistem booking dan pembuatan invoice.",
  },
  {
    icon: BarChart3,
    title: "Travel-specific Reporting",
    description:
      "Laporan khusus industri travel untuk memantau profitabilitas paket wisata.",
  },
  {
    icon: Users,
    title: "Multi-vendor Management",
    description:
      "Manajemen multi-vendor (airlines, hotels, dll) dalam satu dashboard.",
  },
];

const BENEFITS = [
  "Implementasi cepat dan mudah",
  "Dukungan teknis 24/7",
  "Skalabilitas tinggi untuk bisnis berkembang",
  "Keamanan data terjamin",
  "Kustomisasi sesuai kebutuhan spesifik",
  "Pelatihan komprehensif untuk tim Anda",
];

/* ─── Solution Section Component ─── */

function SolutionSection({
  title,
  shortDescription,
  detailedDescription,
  ctaText,
  features,
  withBg = false,
}: {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  ctaText: string;
  features: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }[];
  withBg?: boolean;
}) {
  return (
    <div className={withBg ? "bg-muted/30" : ""}>
      <section className="border-b border-border py-20 last:border-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-16 max-w-3xl">
            <h2
              className="mb-4 text-3xl font-bold text-foreground md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {title}
            </h2>
            <p className="mb-6 text-xl font-medium text-primary">
              {shortDescription}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {detailedDescription}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  {...staggerItem}
                  className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="mb-3 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ─── Page Component ─── */

export default function ProductsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative z-10 max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1
              className="mb-6 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {t("products.hero.title")}
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
              {t("products.hero.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ERP Solutions */}
      <SolutionSection
        title={t("products.erp.title")}
        shortDescription={t("products.erp.shortDescription")}
        detailedDescription={t("products.erp.detailedDescription")}
        ctaText={t("products.erp.cta")}
        features={ERP_FEATURES}
      />

      {/* Accommodation Solutions */}
      <SolutionSection
        title={t("products.accommodation.title")}
        shortDescription={t("products.accommodation.shortDescription")}
        detailedDescription={t("products.accommodation.detailedDescription")}
        ctaText={t("products.accommodation.cta")}
        features={ACCOMMODATION_FEATURES}
        withBg
      />

      {/* HR & Payroll */}
      <SolutionSection
        title={t("products.hr.title")}
        shortDescription={t("products.hr.shortDescription")}
        detailedDescription={t("products.hr.detailedDescription")}
        ctaText={t("products.hr.cta")}
        features={HR_FEATURES}
      />

      {/* Plantation Solutions */}
      <SolutionSection
        title={t("products.plantation.title")}
        shortDescription={t("products.plantation.shortDescription")}
        detailedDescription={t("products.plantation.detailedDescription")}
        ctaText={t("products.plantation.cta")}
        features={PLANTATION_FEATURES}
        withBg
      />

      {/* Accounting Systems */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-16 max-w-3xl">
            <h2
              className="mb-4 text-3xl font-bold text-foreground md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {t("products.accounting.title")}
            </h2>
            <p className="mb-6 text-xl font-medium text-primary">
              {t("products.accounting.shortDescription")}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {t("products.accounting.detailedDescription")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* General Purpose Accounting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                {t("products.accounting.general.title")}
              </h3>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                {t("products.accounting.general.description")}
              </p>
              <div className="mb-10 flex-1 space-y-6">
                {GENERAL_ACCOUNTING_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-foreground">
                          {feature.title}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 self-start rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] sm:w-auto"
              >
                {t("products.accounting.general.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Travel Agent Accounting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                {t("products.accounting.travel.title")}
              </h3>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                {t("products.accounting.travel.description")}
              </p>
              <div className="mb-10 flex-1 space-y-6">
                {TRAVEL_ACCOUNTING_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green/10">
                        <Icon className="h-6 w-6 text-green" />
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-foreground">
                          {feature.title}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 self-start rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] sm:w-auto"
              >
                {t("products.accounting.travel.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: Content */}
            <motion.div {...fadeLeft}>
              <h2
                className="mb-6 text-3xl font-bold md:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {t("products.whyChoose.title")}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
                {t("products.whyChoose.description")}
              </p>
              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start space-x-3">
                    <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-foreground/90" />
                    <span className="font-medium text-primary-foreground/90">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-green/90 active:scale-[0.98]"
              >
                {t("products.whyChoose.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Right: Stat Cards */}
            <motion.div {...fadeRight}>
              <div className="flex flex-col gap-4">
                {/* Top row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-xl border border-primary-foreground/10 bg-background p-5 shadow-xl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{t("products.stats.activeClients")}</p>
                    <p className="text-2xl font-bold text-foreground">197+</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="rounded-xl border border-primary-foreground/10 bg-background p-5 shadow-xl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{t("products.stats.clientRating")}</p>
                    <p className="text-2xl font-bold text-foreground">4.9/5</p>
                  </motion.div>
                </div>

                {/* Center card - highlighted */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-xl border border-primary-foreground/10 bg-background p-6 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green/10">
                      <TrendingUp className="h-6 w-6 text-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("products.stats.businessGrowth")}
                      </p>
                      <p className="text-3xl font-bold text-foreground">+45%</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t("products.stats.businessGrowthDescription")}
                  </p>
                </motion.div>

                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="rounded-xl border border-primary-foreground/10 bg-background p-5 shadow-xl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{t("products.stats.experience")}</p>
                    <p className="text-2xl font-bold text-foreground">{t("products.stats.experienceValue")}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="rounded-xl border border-primary-foreground/10 bg-background p-5 shadow-xl"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10">
                      <Shield className="h-5 w-5 text-green" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{t("products.stats.support")}</p>
                    <p className="text-2xl font-bold text-foreground">24/7</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
