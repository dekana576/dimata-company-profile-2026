"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

/* ─── Animation Variants ─── */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" as const },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

/* ─── Data ─── */

const SOLUTIONS = [
  {
    title: "ProChain",
    description:
      "Comprehensive operational structure management system for streamlined business processes.",
    features: [
      "Purchase order management",
      "Sales tracking and reporting",
      "Inventory control system",
      "Supplier management",
      "Real-time stock monitoring",
    ],
  },
  {
    title: "Hanoman",
    description:
      "Complete guest data management solution with integrated POS and reservation system.",
    features: [
      "Guest profile management",
      "Point of Sale (POS) system",
      "Reservation and booking",
      "Customer relationship tracking",
      "Payment processing",
    ],
  },
  {
    title: "Hairisma",
    description:
      "Advanced attendance and administrative system with performance monitoring capabilities.",
    features: [
      "Employee attendance tracking",
      "Leave management",
      "Performance monitoring",
      "Administrative workflows",
      "HR analytics dashboard",
    ],
  },
  {
    title: "AISO",
    description:
      "Real-time financial reporting system with comprehensive accounting features.",
    features: [
      "Real-time financial reports",
      "Cash flow management",
      "Accounting automation",
      "Budget tracking",
      "Financial analytics",
    ],
  },
];

/* ─── Page Component ─── */

export default function SolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("solutions.hero.title")}{" "}
              <span className="text-primary">{t("solutions.hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t("solutions.hero.description")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Solution Cards */}
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {SOLUTIONS.map((solution) => (
              <motion.div
                key={solution.title}
                {...staggerItem}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {solution.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {solution.description}
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {solution.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-foreground/80"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("solutions.cta.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("solutions.cta.description")}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("solutions.cta.button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
