"use client";

import { motion } from "framer-motion";
import { Shield, Headphones, HelpCircle } from "lucide-react";

/* ─── Animation Variants ─── */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
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

const VISION_TEXT =
  "Menjadi penyedia solusi teknologi informasi terdepan yang memberdayakan bisnis di seluruh Indonesia untuk mencapai transformasi digital yang berkelanjutan.";

const VISION_DESCRIPTION =
  "Kami berkomitmen untuk terus berinovasi dan menghadirkan solusi yang tidak hanya memenuhi kebutuhan saat ini, tetapi juga mengantisipasi tantangan masa depan.";

const MISSION_ITEMS = [
  "Mengembangkan solusi teknologi yang inovatif, handal, dan mudah digunakan",
  "Memberikan layanan pelanggan yang responsif dan berkualitas tinggi",
  "Membangun kemitraan jangka panjang dengan klien melalui kepercayaan dan hasil nyata",
  "Terus belajar dan beradaptasi dengan perkembangan teknologi terkini",
];

const SUPPORT_SERVICES = [
  {
    icon: Shield,
    title: "Data Security",
    description:
      "Enterprise-grade security measures to protect your business data with encryption and regular backups.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Round-the-clock technical support to ensure your systems run smoothly without interruption.",
  },
  {
    icon: HelpCircle,
    title: "Online Help",
    description:
      "Comprehensive online documentation and help resources to assist you whenever you need guidance.",
  },
];

/* ─── Page Component ─── */

export default function VisionMissionPage() {
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Vision &amp; <span className="text-primary">Mission</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Our commitment to excellence drives everything we do.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision & Mission Cards */}
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                VISI
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/80">
                {VISION_TEXT}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {VISION_DESCRIPTION}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                MISI
              </h2>
              <ul className="mt-6 space-y-4">
                {MISSION_ITEMS.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Services */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Our Support Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide comprehensive support to ensure your success.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {SUPPORT_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  {...staggerItem}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
