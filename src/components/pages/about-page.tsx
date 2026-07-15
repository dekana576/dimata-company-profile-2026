"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  Heart,
  Lightbulb,
  Rocket,
  Users,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

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

const TIMELINE = [
  { period: "2002 - now", role: "Founder PT. Dimata SoraJayate" },
  { period: "2022 - now", role: "Founder PT Wiweka Widya Paramartha" },
  { period: "2020 - now", role: "Founder CV Hita Vidya Utama" },
  { period: "2020 - now", role: "Founder PT Bali Agro Investama" },
  { period: "2019 - now", role: "Founder eSemeton.com" },
];

const AWARDS = [
  { year: "2017", title: "Money & I Award Nominee Technopreneur" },
  { year: "2011", title: "Telkom Indigo Fellowship" },
  { year: "2010", title: "Telkom Indigo Fellowship" },
];

const CORE_VALUES = [
  {
    letter: "D",
    label: "Discipline",
    icon: ShieldCheck,
    description:
      "Kedisiplinan adalah fondasi untuk mencapai konsistensi dan hasil terbaik dalam setiap proyek.",
  },
  {
    letter: "I",
    label: "Innovative",
    icon: Lightbulb,
    description:
      "Selalu berinovasi untuk menghadirkan solusi teknologi yang relevan dan masa depan.",
  },
  {
    letter: "M",
    label: "Motivated",
    icon: Rocket,
    description:
      "Semangat tinggi untuk terus berkembang dan memberikan yang terbaik bagi klien.",
  },
  {
    letter: "A",
    label: "Agile",
    icon: Zap,
    description:
      "Fleksibel dan cepat beradaptasi dengan perubahan kebutuhan bisnis dan teknologi.",
  },
  {
    letter: "T",
    label: "Teamwork",
    icon: Users,
    description:
      "Bekerja sama secara sinergis untuk menghasilkan solusi yang lebih besar dari individu.",
  },
  {
    letter: "A",
    label: "Aware",
    icon: Heart,
    description:
      "Peduli terhadap kebutuhan klien, lingkungan kerja, dan dampak teknologi bagi masyarakat.",
  },
];

const TEAMS = [
  {
    name: "Development Team",
    description:
      "Mengembangkan dan memelihara solusi software berkualitas tinggi.",
  },
  {
    name: "Quality Assurance",
    description:
      "Memastikan setiap produk memenuhi standar kualitas tertinggi.",
  },
  {
    name: "Customer Support",
    description:
      "Memberikan bantuan teknis 24/7 untuk kelancaran operasional klien.",
  },
  {
    name: "Sales & Marketing",
    description: "Menghubungkan solusi kami dengan bisnis yang membutuhkannya.",
  },
  {
    name: "Finance & Administration",
    description:
      "Mengelola operasional internal dengan akuntabel dan transparan.",
  },
  {
    name: "Product Management",
    description:
      "Merancang dan mengarahkan pengembangan produk sesuai kebutuhan pasar.",
  },
];

const GALLERY = [
  { src: "https://picsum.photos/seed/dimata1/600/400", alt: "Team meeting discussion" },
  { src: "https://picsum.photos/seed/dimata2/600/400", alt: "Office brainstorming session" },
  { src: "https://picsum.photos/seed/dimata3/600/400", alt: "Team building activity" },
  { src: "https://picsum.photos/seed/dimata4/600/400", alt: "Workshop and training" },
  { src: "https://picsum.photos/seed/dimata5/600/400", alt: "Celebration event" },
  { src: "https://picsum.photos/seed/dimata6/600/400", alt: "Project collaboration" },
];

/* ─── Page Component ─── */

export interface AboutPageProps {
  founderImage?: string;
}

export default function AboutPage({
  founderImage = "/img/founder.jpg",
}: AboutPageProps) {
  const [imgError, setImgError] = useState(false);
  const { t } = useLanguage();
  const showImage = founderImage && !imgError;

  return (
    <main className='flex-1'>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-28'
      >
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className='mx-auto max-w-3xl text-center'
          >
            <h1 className='text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl'>
              {t("about.hero.title")} <span className='text-primary'>DIMATA</span> IT Solutions
            </h1>
            <p className='mt-6 text-lg leading-relaxed text-muted-foreground'>
              {t("about.hero.description")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Founder & CEO */}
      <section className='py-20 md:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-start gap-10 lg:grid-cols-2 lg:gap-16'>
            {/* Photo — mobile: hidden, desktop: kiri */}
            <motion.div
              {...fadeUp}
              className='hidden lg:flex lg:justify-center'
            >
              <div className='relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-muted'>
                {showImage ? (
                  <img
                    src={founderImage}
                    alt='Founder & CEO - Dipl.-Ing. I Ketut Kartika Tanjana'
                    className='h-full w-full object-cover'
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <Building2 className='h-24 w-24 text-muted-foreground/30' />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div {...fadeUp}>
              <p className='text-sm font-semibold uppercase tracking-widest text-primary'>
                {t("about.founder.label")}
              </p>
              <h2 className='mt-3 text-3xl font-bold text-foreground md:text-4xl'>
                Dipl.-Ing. I Ketut Kartika Tanjana
              </h2>
              <p className='mt-1 text-lg font-medium text-muted-foreground'>
                {t("about.founder.title")}
              </p>
              <p className='mt-4 leading-relaxed text-muted-foreground'>
                {t("about.founder.description")}
              </p>

              {/* Timeline */}
              <div className='mt-8'>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-foreground'>
                  <Calendar className='h-5 w-5 text-primary' />
                  {t("about.timeline.title")}
                </h3>
                <ul className='mt-4 space-y-3'>
                  {TIMELINE.map((item) => (
                    <li
                      key={item.role}
                      className='flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50'
                    >
                      <span className='shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary'>
                        {item.period}
                      </span>
                      <span className='text-sm text-foreground/80'>
                        {item.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className='bg-muted py-16 md:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div {...fadeUp} className='text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
              {t("about.awards.title")}
            </h2>
            <p className='mt-4 text-lg text-muted-foreground'>
              {t("about.awards.description")}
            </p>
          </motion.div>
          <motion.div
            {...staggerContainer}
            className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          >
            {AWARDS.map((item) => (
              <motion.div
                key={item.year + item.title}
                {...staggerItem}
                className='flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10'>
                  <Award className='h-7 w-7 text-primary' />
                </div>
                <span className='mt-4 text-3xl font-bold text-primary'>
                  {item.year}
                </span>
                <p className='mt-2 text-sm font-medium leading-relaxed text-foreground/80'>
                  {item.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Culture */}
      <section className='bg-background py-20 md:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <motion.div {...fadeUp} className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
              {t("about.team.title")}
            </h2>
            <p className='mt-4 text-lg text-muted-foreground'>
              {t("about.team.description")}
            </p>
          </motion.div>

          {/* Core Values - D.I.M.A.T.A */}
          <div className='mt-14'>
            <h3 className='text-center text-xl font-semibold text-foreground'>
              {t("about.coreValues.title")} <span className='text-primary'>D.I.M.A.T.A</span>
            </h3>
            <motion.div
              {...staggerContainer}
              className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            >
              {CORE_VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.label}
                    {...staggerItem}
                    className='group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary'>
                        {v.letter}
                      </span>
                      <div className='flex items-center gap-2'>
                        <Icon className='h-5 w-5 text-primary' />
                        <span className='text-lg font-semibold text-foreground'>
                          {v.label}
                        </span>
                      </div>
                    </div>
                    <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                      {v.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Team Composition */}
          <div className='mt-16'>
            <h3 className='text-center text-xl font-bold text-foreground'>
              {t("about.teamComposition.title")}
            </h3>
            <motion.div
              {...staggerContainer}
              className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            >
              {TEAMS.map((t) => (
                <motion.div
                  key={t.name}
                  {...staggerItem}
                  className='rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                >
                  <h4 className='text-base font-semibold text-foreground'>
                    {t.name}
                  </h4>
                  <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {t.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Gallery */}
          <div className='mt-16'>
            <h3 className='text-center text-xl font-bold text-foreground'>
              {t("about.gallery.title")}
            </h3>
            <p className='mt-2 text-center text-muted-foreground'>
              {t("about.gallery.description")}
            </p>
            <motion.div
              {...staggerContainer}
              className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3'
            >
              {GALLERY.map((img) => (
                <motion.div
                  key={img.src}
                  {...staggerItem}
                  className='group relative aspect-[3/2] overflow-hidden rounded-2xl'
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  <span className='absolute bottom-3 left-3 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    {img.alt}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}