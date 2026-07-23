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
/* Updated: Store translation keys as string identifiers */
const SOLUTIONS = [
  {
    title: "ProChain",
    descriptionKey: "solutions.prochain.description",
    featureKeys: [
      "solutions.prochain.features.0",
      "solutions.prochain.features.1",
      "solutions.prochain.features.2",
      "solutions.prochain.features.3",
      "solutions.prochain.features.4",
    ],
  },
  {
    title: "Hanoman",
    descriptionKey: "solutions.hanoman.description",
    featureKeys: [
      "solutions.hanoman.features.0",
      "solutions.hanoman.features.1",
      "solutions.hanoman.features.2",
      "solutions.hanoman.features.3",
      "solutions.hanoman.features.4",
    ],
  },
  {
    title: "Hairisma",
    descriptionKey: "solutions.hairisma.description",
    featureKeys: [
      "solutions.hairisma.features.0",
      "solutions.hairisma.features.1",
      "solutions.hairisma.features.2",
      "solutions.hairisma.features.3",
      "solutions.hairisma.features.4",
    ],
  },
  {
    title: "AISO",
    descriptionKey: "solutions.aiso.description",
    featureKeys: [
      "solutions.aiso.features.0",
      "solutions.aiso.features.1",
      "solutions.aiso.features.2",
      "solutions.aiso.features.3",
      "solutions.aiso.features.4",
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
        className="relative overflow-hidden bg-linear-to-br from-background via-background to-primary/5 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("products.hero.title")}{" "}
              {/* <span className="text-primary">{t("solutions.hero.titleHighlight")}</span> */}
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
                {/* Updated: Wrap the descriptionKey in the t() function */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(solution.descriptionKey)}
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {/* Updated: Map through featureKeys and wrap each key in t() */}
                  {solution.featureKeys.map((featureKey) => (
                    <li
                      key={featureKey}
                      className="flex items-center gap-2.5 text-sm text-foreground/80"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {t(featureKey)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-b from-background to-primary/5 py-20 md:py-24">
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