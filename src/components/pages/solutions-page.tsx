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
  Cloud,
  Zap,
  RefreshCw,
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

/* ─── Data (Title Tetap Asli, Description Menggunakan Key) ─── */

const ERP_FEATURES = [
  {
    icon: ShoppingCart,
    title: "Purchasing",
    descriptionKey: "products.erp.purchasing.description",
  },
  {
    icon: Package,
    title: "Inventory",
    descriptionKey: "products.erp.inventory.description",
  },
  {
    icon: Boxes,
    title: "Products Master & Costing",
    descriptionKey: "products.erp.products.description",
  },
  {
    icon: Calculator,
    title: "Accounting",
    descriptionKey: "products.erp.accounting.description",
  },
  {
    icon: Smartphone,
    title: "Web & Mobile Solutions",
    descriptionKey: "products.erp.web.description",
  },
];

const SAAS_FEATURES = [
  {
    icon: Boxes,
    title: "Modular App Selection",
    descriptionKey: "products.saas.modular.description",
  },
  {
    icon: Cloud,
    title: "SaaS (Cloud Subscription)",
    descriptionKey: "products.saas.cloud.description",
  },
  {
    icon: Shield,
    title: "On-Premise Deployment",
    descriptionKey: "products.saas.onpremise.description",
  },
  {
    icon: TrendingUp,
    title: "Pay-as-You-Grow",
    descriptionKey: "products.saas.growth.description",
  },
  {
    icon: Link2,
    title: "Unified Ecosystem",
    descriptionKey: "products.saas.ecosystem.description",
  },
];

const ACCOMMODATION_FEATURES = [
  {
    icon: Building2,
    title: "Property Management",
    descriptionKey: "products.accommodation.property.description",
  },
  {
    icon: Users,
    title: "Guest Management",
    descriptionKey: "products.accommodation.guest.description",
  },
  {
    icon: CalendarCheck,
    title: "Reservation & Registration Management",
    descriptionKey: "products.accommodation.reservation.description",
  },
  {
    icon: Briefcase,
    title: "Integrated Outlet Services",
    descriptionKey: "products.accommodation.integrated.description",
  },
  {
    icon: Calculator,
    title: "Accounting",
    descriptionKey: "products.accommodation.accounting.description",
  },
];

const HR_FEATURES = [
  {
    icon: Users,
    title: "Recruitment",
    descriptionKey: "products.hr.recruitment.description",
  },
  {
    icon: GraduationCap,
    title: "Onboarding",
    descriptionKey: "products.hr.onboarding.description",
  },
  {
    icon: Settings,
    title: "Training",
    descriptionKey: "products.hr.training.description",
  },
  {
    icon: Settings,
    title: "Operations",
    descriptionKey: "products.hr.operations.description",
  },
  {
    icon: CalendarCheck,
    title: "Leave & Scheduling",
    descriptionKey: "products.hr.leave.description",
  },
  {
    icon: TrendingUp,
    title: "Appraisals & Recognition",
    descriptionKey: "products.hr.appraisals.description",
  },
  {
    icon: Briefcase,
    title: "Company Structure",
    descriptionKey: "products.hr.structure.description",
  },
  {
    icon: Workflow,
    title: "Workflow",
    descriptionKey: "products.hr.workflow.description",
  },
  {
    icon: FileLock,
    title: "Company Documents",
    descriptionKey: "products.hr.documents.description",
  },
  {
    icon: Clock,
    title: "Overtime",
    descriptionKey: "products.hr.overtime.description",
  },
  {
    icon: FileText,
    title: "Employee Contract Management",
    descriptionKey: "products.hr.contracts.description",
  },
  {
    icon: CreditCard,
    title: "Payroll",
    descriptionKey: "products.hr.payroll.description",
  },
  {
    icon: Link2,
    title: "Integration to Accounting",
    descriptionKey: "products.hr.integration.description",
  },
];

const PLANTATION_FEATURES = [
  {
    icon: Briefcase,
    title: "Projects Management",
    descriptionKey: "products.plantation.projects.description",
  },
  {
    icon: MapPin,
    title: "Areas Management",
    descriptionKey: "products.plantation.areas.description",
  },
  {
    icon: Sprout,
    title: "Plants Management",
    descriptionKey: "products.plantation.plants.description",
  },
  {
    icon: Package,
    title: "Inventory & Cost Management",
    descriptionKey: "products.plantation.inventory.description",
  },
  {
    icon: BarChart3,
    title: "Production Tracking",
    descriptionKey: "products.plantation.production.description",
  },
];

const GENERAL_ACCOUNTING_FEATURES = [
  {
    icon: Calculator,
    title: "Flash Finance Report Generation",
    descriptionKey: "products.accounting.general.flash.description",
  },
  {
    icon: Settings,
    title: "AI-based Supporting Bookkeeping",
    descriptionKey: "products.accounting.general.ai.description",
  },
  {
    icon: BarChart3,
    title: "Real-time Financial Reports",
    descriptionKey: "products.accounting.general.realtime.description",
  },
  {
    icon: CreditCard,
    title: "Multi-currency Support",
    descriptionKey: "products.accounting.general.multicurrency.description",
  },
];

const TRAVEL_ACCOUNTING_FEATURES = [
  {
    icon: Users,
    title: "Commission Management",
    descriptionKey: "products.accounting.travel.commission.description",
  },
  {
    icon: ShoppingCart,
    title: "Booking & Invoice Integration",
    descriptionKey: "products.accounting.travel.booking.description",
  },
  {
    icon: BarChart3,
    title: "Travel-specific Reporting",
    descriptionKey: "products.accounting.travel.reporting.description",
  },
  {
    icon: Users,
    title: "Multi-vendor Management",
    descriptionKey: "products.accounting.travel.multivendor.description",
  },
];

const BENEFITS = [
  "products.benefits.0",
  "products.benefits.1",
  "products.benefits.2",
  "products.benefits.3",
  "products.benefits.4",
  "products.benefits.5",
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
  features: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    descriptionKey: string;
  }[];
  withBg?: boolean;
}) {
  const { t } = useLanguage();

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
                  <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {/* Title ditampilkan asli tanpa fungsi t() */}
                  <h4 className="mb-3 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  {/* Description diterjemahkan menggunakan fungsi t() */}
                  <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                    {t(feature.descriptionKey)}
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
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/5">
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
              {t("solutions.hero.title")}
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

      {/* ─── NEW: SaaS Solutions Section (withBg enabled for contrast) ─── */}
      <SolutionSection
        title={t("products.saas.title")}
        shortDescription={t("products.saas.shortDescription")}
        detailedDescription={t("products.saas.detailedDescription")}
        ctaText={t("products.saas.cta")}
        features={SAAS_FEATURES}
        withBg
      />

      {/* Accommodation Solutions */}
      <SolutionSection
        title={t("products.accommodation.title")}
        shortDescription={t("products.accommodation.shortDescription")}
        detailedDescription={t("products.accommodation.detailedDescription")}
        ctaText={t("products.accommodation.cta")}
        features={ACCOMMODATION_FEATURES}
      />

      {/* HR & Payroll */}
      <SolutionSection
        title={t("products.hr.title")}
        shortDescription={t("products.hr.shortDescription")}
        detailedDescription={t("products.hr.detailedDescription")}
        ctaText={t("products.hr.cta")}
        features={HR_FEATURES}
        withBg
      />

      {/* Plantation Solutions */}
      <SolutionSection
        title={t("products.plantation.title")}
        shortDescription={t("products.plantation.shortDescription")}
        detailedDescription={t("products.plantation.detailedDescription")}
        ctaText={t("products.plantation.cta")}
        features={PLANTATION_FEATURES}
      />

      {/* Accounting Systems */}
      <section className="border-b border-border py-20 bg-muted/30">
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
                        {/* Title ditampilkan asli tanpa fungsi t() */}
                        <p className="mb-1 font-semibold text-foreground">
                          {feature.title}
                        </p>
                        {/* Description diterjemahkan menggunakan fungsi t() */}
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {t(feature.descriptionKey)}
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
                        {/* Title ditampilkan asli tanpa fungsi t() */}
                        <p className="mb-1 font-semibold text-foreground">
                          {feature.title}
                        </p>
                        {/* Description diterjemahkan menggunakan fungsi t() */}
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {t(feature.descriptionKey)}
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
                {BENEFITS.map((benefitKey) => (
                  <div key={benefitKey} className="flex items-start space-x-3">
                    <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-foreground/90" />
                    <span className="font-medium text-primary-foreground/90">
                      {t(benefitKey)}
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
                      <Shield className="h-6 w-6 text-green" />
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