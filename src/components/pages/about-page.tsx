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
  X,
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

// PERBAIKAN 1: Simpan translation key (string) di dalam array, bukan memanggil fungsi t()
const CORE_VALUES = [
  {
    letter: "D",
    label: "Discipline",
    icon: ShieldCheck,
    descriptionKey: "about.corevalue.description.d",
  },
  {
    letter: "I",
    label: "Innovative",
    icon: Lightbulb,
    descriptionKey: "about.corevalue.description.i",
  },
  {
    letter: "M",
    label: "Motivated",
    icon: Rocket,
    descriptionKey: "about.corevalue.description.m",
  },
  {
    letter: "A",
    label: "Agile",
    icon: Zap,
    descriptionKey: "about.corevalue.description.a",
  },
  {
    letter: "T",
    label: "Teamwork",
    icon: Users,
    descriptionKey: "about.corevalue.description.t",
  },
  {
    letter: "A",
    label: "Aware",
    icon: Heart,
    descriptionKey: "about.corevalue.description.a2",
  },
];

// PERBAIKAN TEAMS: Ubah properti menjadi descriptionKey untuk konsistensi (tanpa mengubah nama/title)
const TEAMS = [
  {
    name: "Development Team",
    descriptionKey: "about.teamcomposition.description.development",
  },
  {
    name: "Quality Assurance",
    descriptionKey: "about.teamcomposition.description.quality",
  },
  {
    name: "Customer Support",
    descriptionKey: "about.teamcomposition.description.customer",
  },
  {
    name: "Sales & Marketing",
    descriptionKey: "about.teamcomposition.description.sales",
  },
  {
    name: "Finance & Administration",
    descriptionKey: "about.teamcomposition.description.finance",
  },
  {
    name: "Product Management",
    descriptionKey: "about.teamcomposition.description.product",
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

export interface GalleryItem {
  id: number;
  path: string;
  description: string | null;
}

export interface AboutPageProps {
  founderImage?: string;
  galleryImages?: GalleryItem[];
}

export default function AboutPage({
  founderImage = "/img/founder.jpg",
  galleryImages = [],
}: AboutPageProps) {
  const [imgError, setImgError] = useState(false);
  const [expandedImage, setExpandedImage] = useState<GalleryItem | null>(null);
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
                    {/* PERBAIKAN 2: Panggil fungsi t() di dalam JSX menggunakan v.descriptionKey */}
                    <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                      {t(v.descriptionKey)}
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
              {/* PERBAIKAN 3: Mengubah parameter dari (t) menjadi (team) agar tidak menimpa fungsi t(), dan memanggil t(team.descriptionKey) */}
              {TEAMS.map((team) => (
                <motion.div
                  key={team.name}
                  {...staggerItem}
                  className='rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                >
                  <h4 className='text-base font-semibold text-foreground'>
                    {team.name}
                  </h4>
                  <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {t(team.descriptionKey)}
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
            {galleryImages.length > 0 ? (
              <motion.div
                {...staggerContainer}
                className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3'
              >
                {galleryImages.map((img) => (
                  <motion.div
                    key={img.id}
                    {...staggerItem}
                    className='group relative aspect-[3/2] cursor-pointer overflow-hidden rounded-2xl'
                    onClick={() => setExpandedImage(img)}
                  >
                    <img
                      src={img.path}
                      alt={img.description || "Gallery image"}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                    <span className='absolute bottom-3 left-3 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      {img.description}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
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
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {expandedImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
          onClick={() => setExpandedImage(null)}
        >
          <button
            className='absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20'
            onClick={() => setExpandedImage(null)}
          >
            <X className='h-6 w-6' />
          </button>
          <div
            className='relative max-h-[85vh] max-w-[90vw]'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage.path}
              alt={expandedImage.description || "Gallery image"}
              className='max-h-[85vh] max-w-[90vw] rounded-lg object-contain'
            />
            {expandedImage.description && (
              <div className='absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/60 p-4'>
                <p className='text-center text-sm text-white'>{expandedImage.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}